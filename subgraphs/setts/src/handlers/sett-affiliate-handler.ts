import { Transfer } from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { SettType } from '../constants';
import { handleSettTokenTransfer } from './sett-handler';

export function handleTransfer(event: Transfer): void {
  const timestamp = event.block.timestamp.toI32();
  const from = event.params.from;
  const to = event.params.to;
  const value = event.params.value;
  const hash = event.block.hash;
  handleSettTokenTransfer(
    hash,
    timestamp,
    event.address,
    SettType.Affiliate,
    from,
    to,
    value,
  );
}
