import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import {
  METADATA_UNKNOWN,
  NO_ADDR,
  SETT_V1,
  VAULT_STATUS_EXPERIMENTAL,
  ZERO,
} from '../constants';
import { readValue } from './contracts';
import { loadController } from './controller';
import { loadStrategyFromController } from './strategy';
import { loadToken } from './token';

export function loadSett(
  address: Address,
  eventBlock: BigInt = BigInt.fromI32(0),
  eventTime: BigInt = BigInt.fromI32(0),
): Sett {
  let contract = BadgerSett.bind(address);
  let id = address.toHexString();
  let sett = Sett.load(id);

  if (sett == null) {
    sett = new Sett(id);
    sett.name = readValue<string>(contract.try_name(), '');
    sett.symbol = readValue<string>(contract.try_symbol(), '');
    sett.decimals = BigInt.fromI32(readValue<i32>(contract.try_decimals(), 18));
    let token = readValue<Address>(contract.try_token(), Address.fromString(NO_ADDR));
    sett.token = loadToken(token).id;
    sett.pricePerFullShare = BigInt.fromI32(1);
    sett.balance = ZERO;
    sett.totalSupply = ZERO;
    sett.available = ZERO;
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
    sett.version = SETT_V1;
    sett.isProduction = false;
    sett.author = NO_ADDR;
    sett.status = VAULT_STATUS_EXPERIMENTAL;
    sett.protocol = METADATA_UNKNOWN;
    sett.behavior = METADATA_UNKNOWN;
    sett.createdAt = eventTime;
    sett.createdAtBlock = eventBlock;
    sett.lastUpdatedAt = eventTime;
    sett.releasedAt = new BigInt(0);
  }

  sett.available = readValue<BigInt>(contract.try_available(), sett.available);
  sett.pricePerFullShare = readValue<BigInt>(
    contract.try_getPricePerFullShare(),
    sett.pricePerFullShare,
  );
  sett.balance = readValue<BigInt>(contract.try_balance(), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  let settController = sett.controller
  let defaultController = settController
    ? Address.fromString(settController)
    : Address.fromString(NO_ADDR);
  let controller = readValue<Address>(contract.try_controller(), defaultController);
  sett.controller = loadController(controller).id;
  sett.strategy = loadStrategyFromController(
    controller,
    Address.fromString(sett.token),
  ).id;

  sett.save();
  return sett as Sett;
}
