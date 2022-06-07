import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerSettV1_5 } from '../../generated/templates/BadgerSettV1_5/BadgerSettV1_5';
import {
  ADDR_ZERO,
  METADATA_UNKNOWN,
  NO_ADDR,
  SETT_V1_5,
  VAULT_STATUS_EXPERIMENTAL,
  ZERO,
} from '../constants';
import { readValue } from './contracts';
import { loadStrategyV1_5 } from './strategy';
import { loadToken } from './token';

export function loadSettV1_5(address: Address): Sett {
  let contract = BadgerSettV1_5.bind(address);
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
    sett.strategy = NO_ADDR;
    sett.author = NO_ADDR;
    sett.balance = ZERO;
    sett.totalSupply = ZERO;
    sett.available = ZERO;
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
    sett.status = VAULT_STATUS_EXPERIMENTAL;
    sett.version = SETT_V1_5;
    sett.isProduction = false;
    sett.protocol = METADATA_UNKNOWN;
    sett.behavior = METADATA_UNKNOWN;
    sett.createdAt = new BigInt(Date.now());
    sett.lastUpdatedAt = new BigInt(Date.now());
    sett.releasedAt = new BigInt(0);
  }

  sett.available = readValue<BigInt>(contract.try_available(), sett.available);
  let strategy = readValue<Address>(contract.try_strategy(), ADDR_ZERO);
  sett.strategy = loadStrategyV1_5(strategy).id;
  sett.pricePerFullShare = readValue<BigInt>(
    contract.try_getPricePerFullShare(),
    sett.pricePerFullShare,
  );
  sett.balance = readValue<BigInt>(contract.try_balance(), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  sett.save();
  return sett as Sett;
}
