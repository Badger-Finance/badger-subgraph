import { Transfer as Casted_Transfer } from '../../generated/BADGER/BadgerSett';
import { Transfer } from '../../generated/BADGER/V1Contract';
import { handleShareTransfer } from '../yearn/yVault';
import { handleTransfer } from './sett-handler';

export function handleTransferLegacy(event: Transfer): void {
  let casted_Transfer = event as Casted_Transfer;
  handleTransfer(casted_Transfer);
  handleShareTransfer(event);
}
