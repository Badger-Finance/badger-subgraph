import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett, Token } from '../../generated/schema';
import { ERC20 } from '../../generated/templates/SettVault/ERC20';
import { readValue } from './contracts';

export function loadToken(address: Address): Token {
  let id = address.toHexString();
  let sett = Sett.load(id) as Sett;
  // create a token representation of the sett,
  // append a prefix to avoid sett / token collisions
  if (sett != null) {
    id = '0x'.concat(id);
  }

  // handle scenario where a sett is loaded as a deposit token, sett implements token
  let token = Token.load(id) as Token;

  if (token) {
    return token;
  }

  let contract = ERC20.bind(address);
  token = new Token(id);
  token.name = readValue<string>(contract.try_name(), '');
  token.symbol = readValue<string>(contract.try_symbol(), '');
  token.decimals = BigInt.fromI32(readValue<i32>(contract.try_decimals(), 18));
  token.totalSupply = readValue<BigInt>(contract.try_totalSupply(), BigInt.fromI32(0));

  token.save();
  return token;
}
