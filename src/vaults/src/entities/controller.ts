import { Address } from '@graphprotocol/graph-ts';
import { Controller } from '../../generated/schema';

export function loadController(address: Address): Controller {
  let id = address.toHexString();
  let controller = Controller.load(id);
  if (controller) {
    return controller as Controller;
  }
  controller = new Controller(id);
  controller.save();
  return controller;
}
