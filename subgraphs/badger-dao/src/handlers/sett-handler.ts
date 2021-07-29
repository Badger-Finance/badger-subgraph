import { Transfer } from '../../generated/templates/SettVault/BadgerSett';
import { handleSettTokenTransfer } from '../utils/setts';

export function handleTransfer(event: Transfer): void {
  handleSettTokenTransfer(event.address, event.params.from, event.params.to, event.params.value, true);
}
