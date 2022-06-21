import { Address } from '@graphprotocol/graph-ts';
import { Author } from '../../generated/schema';

export function loadVaultAuthor(address: Address): Author {
  let id = address.toHexString();
  let author = Author.load(id) as Author;

  if (author) {
    return author;
  }

  author = new Author(id);
  author.save();
  return author;
}
