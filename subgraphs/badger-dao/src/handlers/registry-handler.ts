import { Address, log } from '@graphprotocol/graph-ts';
import { SettVaultV2 } from '../../generated/templates';
import { NewVault, PromoteVault, RemoveVault } from '../../generated/VaultRegistry/VaultRegistry';
import { loadSettV2 } from '../entities/badger-sett-v2';

function registerVault(vault: Address): void {
  SettVaultV2.create(vault);
  loadSettV2(vault).save();
}

// TODO: consider how to differentiate on author
export function handleNewVault(event: NewVault): void {
  log.warning('handleNewVault {} (author: {})', [event.params.vault.toHexString(), event.params.author.toHexString()]);
  // registerVault(event.params.vault);
  SettVaultV2.create(event.params.vault);
}

// TODO: potentially use for upgrading vault state vs. registering new vaults
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function handlePromoteVault(event: PromoteVault): void {}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleRemoveVault(event: RemoveVault): void {}
