import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerAffiliateSett } from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { NO_ADDR, ZERO } from '../constants';
import { readValue } from '../utils/contracts';
import { loadToken } from './token';

export function loadAffiliateSett(address: Address): Sett {
  let contract = BadgerAffiliateSett.bind(address);
  let id = address.toHexString();
  let sett = Sett.load(id);

  if (sett == null) {
    sett = new Sett(id);
    sett.name = readValue<string>(contract.try_name(), sett.name);
    sett.symbol = readValue<string>(contract.try_symbol(), sett.symbol);
    let token = readValue<Address>(contract.try_token(), Address.fromString(NO_ADDR));
    sett.token = loadToken(token).id;
    sett.token = '';
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
  }

  sett.pricePerFullShare = readValue<BigInt>(contract.try_pricePerShare(), sett.pricePerFullShare);
  sett.balance = readValue<BigInt>(contract.try_totalVaultBalance(address), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  return sett as Sett;
}
