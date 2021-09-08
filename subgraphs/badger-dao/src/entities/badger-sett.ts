import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import { NO_ADDR, REGISTRY_SETT_STATUSES, ZERO } from '../constants';
import { loadSettV2 } from './badger-sett-v2';
import { readValue } from './contracts';
import { loadToken } from './token';

export function loadSett(address: Address): Sett {
  let contract = BadgerSett.bind(address);
  let id = address.toHexString();
  let sett = Sett.load(id);

  if (sett == null) {
    sett = new Sett(id);
    sett.name = readValue<string>(contract.try_name(), sett.name);
    sett.symbol = readValue<string>(contract.try_symbol(), sett.symbol);
    sett.decimals = BigInt.fromI32(readValue<i32>(contract.try_decimals(), 18));
    let token = readValue<Address>(contract.try_token(), Address.fromString(NO_ADDR));
    sett.token = loadToken(token).id;
    sett.pricePerFullShare = BigInt.fromI32(1);
    sett.balance = BigInt.fromI32(0);
    sett.totalSupply = BigInt.fromI32(0);
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
    sett.status = 'dev';
  }

  sett.pricePerFullShare = readValue<BigInt>(contract.try_getPricePerFullShare(), sett.pricePerFullShare);
  sett.balance = readValue<BigInt>(contract.try_balance(), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  sett.save();
  return sett as Sett;
}

export function updateSettStatus(address: Address, version: string, status: string): void {
  let sett = Sett.load(address.toHexString());
  if (version == 'v1') {
    sett = loadSett(address);
  } else if (version == 'v2') {
    sett = loadSettV2(address);
  }

  if (sett !== null) {
    sett.status = status;
    sett.save();
  }
}

export function SettStatusString(status: i32): string {
  let statusString = 'unknown';
  if (0 <= status && status < REGISTRY_SETT_STATUSES.length) {
    statusString = REGISTRY_SETT_STATUSES[status];
  }

  return statusString as string;
}
