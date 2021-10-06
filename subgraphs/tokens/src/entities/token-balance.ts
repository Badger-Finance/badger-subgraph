import { Address } from "@graphprotocol/graph-ts";
import { TokenBalance } from "../../generated/schema";
import { BIGINT_ZERO } from "../constants";
import { loadToken } from "./token";

export function loadTokenBalance(token: Address, user: Address): TokenBalance {
  let id = token.toHexString().concat('-').concat(user.toHexString());
  let tokenBalance = TokenBalance.load(id.toString());
  if (tokenBalance == null) {
    tokenBalance = new TokenBalance(id.toString());
    tokenBalance.balance = BIGINT_ZERO;
    tokenBalance.token = loadToken(token).id;
  }
  return tokenBalance as TokenBalance;
}
