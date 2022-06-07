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
  VAULT_STATUS_GUARDED,
  VAULT_STATUS_OPEN,
} from '../constants';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadSett } from '../entities/badger-sett';
import { loadSettV1_5 } from '../entities/badger-sett-v1-5';
import { readValue } from '../entities/contracts';
import { loadRegistry } from '../entities/registry';
import { loadVaultAuthor } from '../entities/author';

export function handleNewVault(event: NewVault): void {
  const registry = event.address;
  const { vault, version, metadata, author } = event.params;

  addOrPromoteVault(registry, vault, version, metadata, author);
}

export function handlePromoteVault(event: PromoteVault): void {
  const registry = event.address;
  const { vault, version, metadata, author, status } = event.params;

  addOrPromoteVault(registry, vault, version, metadata, author, status);
}

function parseRegVaultMetadata(metadata: string): Record<string, string> {
  const parsedMetaData: Record<string, string> = {
    name: METADATA_UNKNOWN,
    protocol: METADATA_UNKNOWN,
    behavior: METADATA_UNKNOWN,
  };

  if (!metadata) return parsedMetaData;

  metadata.split(',').forEach((val) => {
    const [key, value] = val.split('=');
    parsedMetaData[key] = decodeURI(value);
  });

  return parsedMetaData;
}

// Both NewVault and PromoteVault events can create new VaultInfo in mappings
function addOrPromoteVault(
  registry: Address,
  vault: Address,
  version: string,
  metadata: string,
  author: Address,
  status = VAULT_STATUS_EXPERIMENTAL, // status: VaultStatus(1), for NewVault event
) {
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
        sett = loadSettV1_5(vault);
      }
      if (version == SETT_V1) {
        SettVault.create(vault);
        sett = loadSett(vault);
      }
      if (version == AFFILIATE_SETT) {
        AffiliateSettVault.create(vault);
        sett = loadAffiliateSett(vault);
      }
    }
  }

  // avoid erroneous non-sett addresss (eoa),
  // but we still need to update entries
  if (sett == null || maybeName.length <= 0) return;

  const vaultAuthor = loadVaultAuthor(author);

  sett.author = vaultAuthor.id;

  if (status != VAULT_STATUS_EXPERIMENTAL) {
    sett.status = status;
    if (sett.releasedAt.toI32() === 0) sett.releasedAt = new BigInt(Date.now());
  }
  if ([VAULT_STATUS_OPEN, VAULT_STATUS_GUARDED].includes(status)) {
    sett.isProduction = true;
  }
  sett.lastUpdatedAt = new BigInt(Date.now());

  const parsedMetadata = parseRegVaultMetadata(metadata);

  sett.name = parsedMetadata.name;
  sett.protocol = parsedMetadata.protocol;
  sett.behavior = parsedMetadata.behavior;

  sett.save();
}

export function handlePurgeVault(event: RemoveVault): void {
  const { vault } = event.params;
  const sett = Sett.load(vault.toHexString());

  if (sett === null) return;

  // not sure, rm node or just add production=False
  // store.remove('Sett', sett.id);
  sett.isProduction = false;
  sett.save();
}

export function handleDemoteVault(event: DemoteVault): void {
  const { vault, status } = event.params;
  const sett = Sett.load(vault.toHexString());

  if (sett === null) return;

  sett.lastUpdatedAt = new BigInt(Date.now());
  sett.status = status;
  sett.isProduction = false;
  sett.save();
}
