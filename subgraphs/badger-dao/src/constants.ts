import { BigInt } from '@graphprotocol/graph-ts';

export const SECONDS_PER_DAY = 86400;

// protocol addresses
// TODO: we may need governance view on registry / dynamically set
export let GOVERNANCE = '0xB65cef03b9B89f99517643226d76e286ee999e77';

// true constants
export let NONE = '';
export let NO_ADDR = '0x0000000000000000000000000000000000000000';
export let BADGER = '0x3472a5a71965499acd81997a54bba8d852c6e53d';
export let DIGG = '0x798d1be841a82a273720ce31c822c61a67a601c3';

// evaluated constants
export let ZERO = BigInt.fromI32(0);

// geysers
export let GEYSERS: string[] = [
  '0x10fc82867013fce1bd624fafc719bb92df3172fc',
  '0x2296f174374508278dc12b806a7f27c87d53ca15',
  '0xa207d69ea6fb967e54baa8639c408c31767ba62d',
  '0x085a9340ff7692ab6703f17ab5ffc917b580a6fd',
  '0xed0b7f5d9f6286d00763b0ffcba886d8f9d56d5e',
  '0xa9429271a28f8543efffa136994c0839e7d7bf77',
  '0x612f681bcd12a0b284518d42d2dbcc73b146eb65',
  '0xb5b654efba23596ed49fade44f7e67e23d6712e7',
  '0x0194b5fe9ab7e0c43a08acbb771516fc057402e7',
  '0x7f6fe274e172ac7d096a7b214c78584d99ca988b',
];

export enum SettType {
  v1,
  v2,
  Affiliate,
}
