import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/schema';
import { loadTransaction } from './transaction';
import { loadUser } from './user';

export function loadTransfer(
  hash: Bytes,
  index: BigInt,
  timestamp: i32,
  sett: string,
  from: Address,
  to: Address,
  amount: BigInt,
): Transfer {
  let id = hash.toHexString().concat('-').concat(index.toString());
  let transfer = Transfer.load(id);
  if (transfer) {
    return transfer as Transfer;
  }
  transfer = new Transfer(id);
  transfer.timestamp = timestamp;
  transfer.sett = sett;
  transfer.from = loadUser(from).id;
  transfer.to = loadUser(to).id;
  transfer.amount = amount;
  transfer.transaction = loadTransaction(hash).id;
  transfer.save();
  return transfer;
}

export function transferExists(hash: Bytes): boolean {
  let transfer = Transfer.load(hash.toHexString());
  return transfer != null;
}
