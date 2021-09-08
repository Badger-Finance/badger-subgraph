import { Sett } from '../../generated/schema';
import { SettVault, SettVaultV2 } from '../../generated/templates';
import {
  AddKey,
  AddVersion,
  DemoteVault,
  NewVault,
  PromoteVault,
  RemoveVault,
  Set,
} from '../../generated/VaultRegistry/VaultRegistry';
import { loadSett, SettStatusString, updateSettStatus } from '../entities/badger-sett';
import { loadSettV2 } from '../entities/badger-sett-v2';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleAddKey(event: AddKey): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleAddVersion(event: AddVersion): void {}

// TODO: consider how to differentiate on author
export function handleNewVault(event: NewVault): void {
  let vault = event.params.vault;
  let version = event.params.version;

  let sett = Sett.load(vault.toHexString());

  if (sett == null) {
    if (version == 'v1') {
      SettVault.create(vault);
      loadSett(vault).save();
    } else if (version == 'v2') {
      SettVaultV2.create(vault);
      loadSettV2(vault).save();
    }
  }
}

export function handlePromoteVault(event: PromoteVault): void {
  let status = SettStatusString(event.params.status);
  updateSettStatus(event.params.vault, event.params.version, status);
}

export function handleDemoteVault(event: DemoteVault): void {
  let status = SettStatusString(event.params.status);
  updateSettStatus(event.params.vault, event.params.version, status);
}

export function handleRemoveVault(event: RemoveVault): void {
  updateSettStatus(event.params.vault, event.params.version, 'unregistered');
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleSet(event: Set): void {}
