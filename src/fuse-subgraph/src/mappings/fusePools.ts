import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import {
  FusePoolDirectory,
  FusePoolDirectory__poolsResult,
  PoolRegistered
} from '../types/FusePoolDirectory/FusePoolDirectory'
import { Pool } from '../types/schema'
import { Comptroller } from '../types/templates/Comptroller/Comptroller'
import {
  zeroBD,
  getAllMarketsInPool,
  // getTotalSupplyUSDInPool,
  // getTotalBorrowUSDInPool
} from './helpers'

/**
 * @dev Creates FusePool entity
 * @param comptrollerAddress 
 * @returns pool A `FusePool` object
 */
export function createPool(_comptrollerAddress: string, poolRegisteredEvent: PoolRegistered | null): Pool {
  let pool: Pool,
    comptrollerAddress: Address = Address.fromString(_comptrollerAddress)

  let contract = Comptroller.bind(comptrollerAddress)
  let admin = contract.try_admin()

  pool = new Pool(_comptrollerAddress)
  pool.index = poolRegisteredEvent.params.index

  admin.reverted // pool.value1
    ? pool.creator = Address.fromString('0x0000000000000000000000000000000000000000')
    : pool.creator = admin.value

  pool.comptroller = contract._address
  pool.name = contract._name
  pool.blockPosted = BigInt.fromString('0')
  pool.timestampPosted = BigInt.fromString('0')

  pool.markets = getAllMarketsInPool(contract)
  // pool.totalSupplyUSD = zeroBD
  // pool.totalBorrowUSD = zeroBD

  return pool as Pool
}

/**
 * @param fusePoolAddress 
 * @returns pool The Fuse pool at the given Comptroller address
 */
export function updatePool(
  fusePoolAddress: Address
): Pool {
  let poolID = fusePoolAddress.toHexString()
  let pool = Pool.load(poolID)

  let contractAddress = Address.fromString(pool.id)
  let contract = Comptroller.bind(contractAddress)

  pool.name = contract._name
  pool.comptroller = contract._address
  let admin = contract.try_admin()
  let closeFactor = contract.try_closeFactorMantissa()
  let liquidationIncentive = contract.try_liquidationIncentiveMantissa()
  let oracle = contract.try_oracle()
  let maxAssets = contract.try_maxAssets()

  pool.creator = admin.reverted ? new Bytes(0) : admin.value
  pool.closeFactor = closeFactor.reverted ? new BigInt(0) : closeFactor.value
  pool.liquidationIncentive = liquidationIncentive.reverted ? new BigInt(0) : liquidationIncentive.value
  pool.priceOracle = oracle.reverted ? new Bytes(0) : oracle.value
  pool.maxAssets = maxAssets.reverted ? new BigInt(0) : maxAssets.value

  pool.markets = getAllMarketsInPool(contract)

  // pool.totalSupplyUSD = getTotalSupplyUSDInPool(contract)
  // pool.totalBorrowUSD = getTotalBorrowUSDInPool(contract)

  pool.save()

  return pool as Pool
}
