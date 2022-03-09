import { ethereum } from '@graphprotocol/graph-ts';

export function readValue<T>(callResult: ethereum.CallResult<T>, defaultValue: T): T {
  if (callResult.reverted) {
    return defaultValue;
  }
  return callResult.value;
}
