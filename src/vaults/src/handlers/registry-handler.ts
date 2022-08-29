import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { SettVault, BadgerSettV1_5, AffiliateSettVault } from '../../generated/templates';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import {
  AddKey,
  AddVersion,
  DemoteVault,
  NewVault,
  PromoteVault,
  RemoveVault,
  Set,
} from '../../generated/VaultRegistry/VaultRegistry';
import { AFFILIATE_SETT, SETT_V1, SETT_V1_5 } from '../constants';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadSett } from '../entities/badger-sett';
import { loadSettV1_5 } from '../entities/badger-sett-v1-5';
import { readValue } from '../entities/contracts';
import { loadRegistry } from '../entities/registry';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleAddKey(event: AddKey): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleAddVersion(event: AddVersion): void {}

// TODO: consider how to differentiate on author
export function handleNewVault(event: NewVault): void {
  handleVaultEvent(
    event.address,
    event.params.vault,
    event.params.version,
    event.block.timestamp,
  );
}

// TODO: potentially use for upgrading vault state vs. registering new vaults
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handlePromoteVault(event: PromoteVault): void {
  handleVaultEvent(
    event.address,
    event.params.vault,
    event.params.version,
    event.block.timestamp,
  );
}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleRemoveVault(event: RemoveVault): void {}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleDemoteVault(event: DemoteVault): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleSet(event: Set): void {}

function handleVaultEvent(
  registry: Address,
  vault: Address,
  version: string,
  eventTime: BigInt,
): void {
  loadRegistry(registry);
  let sett = Sett.load(vault.toHexString());
  if (sett == null) {
    let maybeSett = BadgerSett.bind(vault);
    let maybeName = readValue<string>(maybeSett.try_name(), '');
    // avoid adding erroneous non-sett addresss (eoa)
    if (maybeName.length > 0) {
      if (version == SETT_V1_5) {
        BadgerSettV1_5.create(vault);
        loadSettV1_5(vault, eventTime).save();
      }
      if (version == SETT_V1) {
        SettVault.create(vault);
        loadSett(vault, eventTime).save();
      }
      if (version == AFFILIATE_SETT) {
        AffiliateSettVault.create(vault);
        loadAffiliateSett(vault, eventTime).save();
      }
    }
  }
}
