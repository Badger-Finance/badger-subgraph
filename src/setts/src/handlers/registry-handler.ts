import { Address } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { SettVault } from '../../generated/templates';
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
import { loadSett } from '../entities/badger-sett';
import { readValue } from '../entities/contracts';
import { loadRegistry } from '../entities/registry';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleAddKey(event: AddKey): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleAddVersion(event: AddVersion): void {}

// TODO: consider how to differentiate on author
export function handleNewVault(event: NewVault): void {
  handleVaultEvent(event.address, event.params.vault);
}

// TODO: potentially use for upgrading vault state vs. registering new vaults
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handlePromoteVault(event: PromoteVault): void {
  handleVaultEvent(event.address, event.params.vault);
}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleRemoveVault(event: RemoveVault): void {}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleDemoteVault(event: DemoteVault): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function handleSet(event: Set): void {}

function handleVaultEvent(registry: Address, vault: Address): void {
  loadRegistry(registry);
  let sett = Sett.load(vault.toHexString());
  if (sett == null) {
    let maybeSett = BadgerSett.bind(vault);
    let maybeName = readValue<string>(maybeSett.try_name(), '');
    // avoid adding erroneous non-sett addresss (eoa)
    if (maybeName.length > 0) {
      SettVault.create(vault);
      loadSett(vault).save();
    }
  }
}