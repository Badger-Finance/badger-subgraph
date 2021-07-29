import { SettVault } from '../../generated/templates';
import { NewVault, PromoteVault, RemoveVault } from '../../generated/VaultRegistry/VaultRegistry';
import { loadSett } from '../entities/badger-sett';

// TODO: consider how to differentiate on author
export function handleNewVault(event: NewVault): void {
  let vault = event.params.vault;
  SettVault.create(vault);
  loadSett(vault).save();
}

// TODO: potentially use for upgrading vault state vs. registering new vaults
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handlePromoteVault(event: PromoteVault): void {}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleRemoveVault(event: RemoveVault): void {}
