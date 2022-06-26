import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { SettVault, BadgerSettV1_5, AffiliateSettVault } from '../../generated/templates';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import {
  DemoteVault,
  NewVault,
  PromoteVault,
  RemoveVault,
} from '../../generated/VaultRegistryV2/VaultRegistryV2';
import {
  AFFILIATE_SETT,
  METADATA_UNKNOWN,
  SETT_V1,
  SETT_V1_5,
  VAULT_STATUS_EXPERIMENTAL,
} from '../constants';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadSett } from '../entities/badger-sett';
import { loadSettV1_5 } from '../entities/badger-sett-v1-5';
import { readValue } from '../entities/contracts';
import { loadRegistry } from '../entities/registry';
import { loadVaultAuthor } from '../entities/author';

export function handleNewVault(event: NewVault): void {
  let registry = event.address;
  let ep = event.params;

  addOrPromoteVault(
    registry,
    ep.vault,
    ep.version,
    ep.metadata,
    event.block.timestamp,
    ep.author,
    VAULT_STATUS_EXPERIMENTAL,
    false,
  );
}

export function handlePromoteVault(event: PromoteVault): void {
  let registry = event.address;
  let ep = event.params;

  addOrPromoteVault(
    registry,
    ep.vault,
    ep.version,
    ep.metadata,
    event.block.timestamp,
    ep.author,
    ep.status,
    true,
  );
}

function parseRegVaultMetadata(metadata: string): Map<string, string> {
  let metaDataMap: Map<string, string> = new Map();
  metaDataMap.set('name', METADATA_UNKNOWN);
  metaDataMap.set('protocol', METADATA_UNKNOWN);
  metaDataMap.set('behavior', METADATA_UNKNOWN);

  if (!metadata) return metaDataMap;

  let metaEntries = metadata.split(',');
  for (let i = 0; i < metaEntries.length; i++) {
    let keyValue = metaEntries[i].split('=');
    metaDataMap.set(keyValue[0], keyValue[1]);
  }

  return metaDataMap;
}

// Both NewVault and PromoteVault events can create new VaultInfo in mappings
function addOrPromoteVault(
  registry: Address,
  vault: Address,
  version: string,
  metadata: string,
  eventTime: BigInt,
  author: Address,
  status: number, // status: VaultStatus(1), for NewVault event
  isProduction: boolean, // Promotion mean that it is 100% in production map
): void {
  let maybeName: string;
  loadRegistry(registry);

  let sett = Sett.load(vault.toHexString());
  let maybeSett = BadgerSett.bind(vault);
  maybeName = readValue<string>(maybeSett.try_name(), '');

  if (sett == null) {
    // avoid adding erroneous non-sett addresss (eoa)
    if (maybeName.length > 0) {
      if (version == SETT_V1_5) {
        BadgerSettV1_5.create(vault);
        sett = loadSettV1_5(vault, eventTime);
      }
      if (version == SETT_V1) {
        SettVault.create(vault);
        sett = loadSett(vault, eventTime);
      }
      if (version == AFFILIATE_SETT) {
        AffiliateSettVault.create(vault);
        sett = loadAffiliateSett(vault, eventTime);
      }
    }
  }

  // avoid erroneous non-sett addresss (eoa),
  // but we still need to update entries
  if (sett == null || maybeName.length <= 0) return;

  let vaultAuthor = loadVaultAuthor(author);

  sett.author = vaultAuthor.id;

  if (status != VAULT_STATUS_EXPERIMENTAL) {
    sett.status = <i32>status;
    if (sett.releasedAt.toI32() === 0) sett.releasedAt = eventTime;
  }

  sett.isProduction = isProduction;

  sett.lastUpdatedAt = eventTime;

  let parsedMetadata = parseRegVaultMetadata(metadata);

  sett.name = <string>parsedMetadata.get('name');
  sett.protocol = <string>parsedMetadata.get('protocol');
  sett.behavior = <string>parsedMetadata.get('behavior');

  sett.save();
}

export function handlePurgeVault(event: RemoveVault): void {
  let sett = Sett.load(event.params.vault.toHexString());

  if (sett === null) return;

  // not sure, rm node or just add production=False
  // store.remove('Sett', sett.id);
  sett.isProduction = false;
  sett.save();
}

export function handleDemoteVault(event: DemoteVault): void {
  let sett = Sett.load(event.params.vault.toHexString());

  if (sett === null) return;

  sett.lastUpdatedAt = event.block.timestamp;
  sett.status = event.params.status;
  sett.isProduction = false;
  sett.save();
}
