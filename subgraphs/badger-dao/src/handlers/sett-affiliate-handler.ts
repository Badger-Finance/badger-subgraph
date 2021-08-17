import { Transfer } from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { SettType } from '../constants';
import { handleSettTokenTransfer } from './sett-handler';

export function handleTransfer(event: Transfer): void {
  let timestamp = event.block.timestamp.toI32();
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  handleSettTokenTransfer(timestamp, event.address, SettType.Affiliate, from, to, value);
}
