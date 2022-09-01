import { Transfer } from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { SettType } from '../constants';
import { handleSettTokenTransfer } from './sett-handler';

export function handleTransfer(event: Transfer): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  let hash = event.transaction.hash;
  handleSettTokenTransfer(
    hash,
    event.logIndex,
    event.block.timestamp,
    event.block.number,
    event.address,
    SettType.Affiliate,
    from,
    to,
    value,
  );
}
