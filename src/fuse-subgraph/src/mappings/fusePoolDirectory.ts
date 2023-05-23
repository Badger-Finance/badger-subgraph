/* eslint-disable prefer-const */ // to satisfy AS compiler
import { Address } from '@graphprotocol/graph-ts';
import { BADGER_COMPTROLLER } from '../constants';
import {
  PoolRegistered,
  // OwnershipTransferred
} from '../types/FusePoolDirectory/FusePoolDirectory';
import { Comptroller } from '../types/templates';
import { createPool } from './fusePools';

export function handlePoolRegistered(event: PoolRegistered): void {
  if (event.params.pool.comptroller != Address.fromString(BADGER_COMPTROLLER)) return;
  // Dynamically index all new listed Fuse pools
  Comptroller.create(event.params.pool.comptroller);
  // Create the pool for this comptroller, since it's now been registered.
  let pool = createPool(event.params.pool.comptroller.toHexString(), event);
  if (pool == null) return;
  pool.save();
}
