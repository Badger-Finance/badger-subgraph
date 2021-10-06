import { Address } from "@graphprotocol/graph-ts";
import { UChildERC20 } from "../../generated/Badger/UChildERC20";
import { Token } from "../../generated/schema";
import { DEFAULT_DECIMALS } from "../constants";

export function loadToken(address: Address): Token {
  let id = address.toHexString();

  let token = Token.load(id);
  if (token) {
    return token;
  }

  token = new Token(id);
  token.address = address;
  let erc20Token = UChildERC20.bind(address);

  let tokenDecimals = erc20Token.try_decimals();
  let tokenName = erc20Token.try_name();
  let tokenSymbol = erc20Token.try_symbol();

  token.decimals = !tokenDecimals.reverted ? tokenDecimals.value : DEFAULT_DECIMALS;
  token.name = !tokenName.reverted ? tokenName.value : '';
  token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : '';
  token.save();

  return token as Token;
}
