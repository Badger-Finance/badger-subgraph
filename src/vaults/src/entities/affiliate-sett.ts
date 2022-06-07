import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerAffiliateSett } from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import {
  AFFILIATE_SETT,
  METADATA_UNKNOWN,
  NO_ADDR,
  VAULT_STATUS_EXPERIMENTAL,
  ZERO,
} from '../constants';
import { readValue } from './contracts';
import { loadToken } from './token';

export function loadAffiliateSett(address: Address): Sett {
  let contract = BadgerAffiliateSett.bind(address);
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
    sett.balance = ZERO;
    sett.totalSupply = ZERO;
    sett.available = ZERO;
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
    sett.version = AFFILIATE_SETT;
    sett.isProduction = false;
    sett.author = NO_ADDR;
    sett.status = VAULT_STATUS_EXPERIMENTAL;
    sett.protocol = METADATA_UNKNOWN;
    sett.behavior = METADATA_UNKNOWN;
    sett.createdAt = new BigInt(Date.now());
    sett.lastUpdatedAt = new BigInt(Date.now());
    sett.releasedAt = new BigInt(0);
  }

  sett.pricePerFullShare = readValue<BigInt>(
    contract.try_pricePerShare(),
    sett.pricePerFullShare,
  );
  sett.balance = readValue<BigInt>(contract.try_totalVaultBalance(address), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  sett.save();
  return sett as Sett;
}
