import { Address } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { GEYSERS, NO_ADDR } from '../constants';

export function loadUser(address: Address): User {
  let id = address.toHexString();
  let user = User.load(id) as User;

  if (user) {
    return user;
  }

  user = new User(id);
  return user ;
}

export function isValidUser(address: string): boolean {
  return address != NO_ADDR && !GEYSERS.includes(address);
}
