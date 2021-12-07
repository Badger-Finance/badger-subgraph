import { Bytes } from '@graphprotocol/graph-ts';
import { Transaction } from '../../generated/schema';

export function loadTransaction(hash: Bytes): Transaction {
  let id = hash.toHexString();
  let transaction = Transaction.load(id) as Transaction;

  if (transaction) {
    return transaction;
  }

  transaction = new Transaction(id);
  transaction.save();
  return transaction;
}
