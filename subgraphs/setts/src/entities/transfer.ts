import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/schema';
import { loadUser } from './user';

export function loadTransfer(
  hash: Bytes,
  timestamp: i32,
  sett: string,
  from: Address,
  to: Address,
  amount: BigInt,
): Transfer {
  let id = hash.toHexString();
  let transfer = Transfer.load(id) as Transfer;
  if (transfer) {
    return transfer;
  }
  transfer = new Transfer(id);
  transfer.timestamp = timestamp;
  transfer.sett = sett;
  transfer.from = loadUser(from).id;
  transfer.to = loadUser(to).id;
  transfer.amount = amount;
  transfer.save();
  return transfer;
}

export function transferExists(hash: Bytes): boolean {
  let transfer = Transfer.load(hash.toHexString()) as Transfer;
  return transfer != null;
}
