import { User, NFTBalance } from '../generated/schema'
import { Address,BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_ZERO } from './constants';

export function getOrCreateUser(address: string): User {
    let user = User.load(address)
    if(user == null) {
      user = new User(address)
    }
    user.save()
    return user as User
  }
  
export function getOrCreateNFTBalance(nftAddress: Address, nftId: BigInt , user: string): NFTBalance {
    let id = nftAddress.toHexString()
    .concat("-")
    .concat(nftId.toString())
    .concat("-")
    .concat(user)
  
    let nft = NFTBalance.load(id)
    if(nft == null) {
      nft = new NFTBalance(id)
      nft.amount = BIGINT_ZERO
      nft.owner = user.toString()
      nft.save()
    }
    return nft as NFTBalance
  }
  