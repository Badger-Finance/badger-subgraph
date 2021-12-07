import { Address } from '@graphprotocol/graph-ts';
import { Strategy } from '../../generated/schema';
import { BadgerStrategy } from '../../generated/templates';
import { BadgerStrategy as BaseStrategy } from '../../generated/templates/BadgerStrategy/BadgerStrategy';
import { BadgerController } from '../../generated/templates/BadgerStrategy/BadgerController';
import { ADDR_ZERO, NO_ADDR } from '../constants';
import { readValue } from './contracts';

export function loadStrategy(address: Address): Strategy {
  let id = address.toHexString();
  let strategy = Strategy.load(id) as Strategy;
  if (strategy == null) {
    BadgerStrategy.create(address);
    strategy = new Strategy(id);
  }
  let contract = BaseStrategy.bind(address);
  let controller = readValue<Address>(contract.try_controller(), ADDR_ZERO);
  if (controller != ADDR_ZERO) {
    let want = readValue<Address>(contract.try_want(), ADDR_ZERO);
    let controllerContract = BadgerController.bind(controller);
    strategy.controller = controller.toHexString();
    let vault = readValue<Address>(controllerContract.try_vaults(want), ADDR_ZERO);
    if (vault != ADDR_ZERO) {
      strategy.sett = vault.toHexString();
    }
  }
  strategy.save();
  return strategy;
}

export function loadStrategyFromController(address: Address, sett: Address): Strategy {
  if (address.toHexString() === NO_ADDR) {
    return loadStrategy(address);
  }
  let controller = BadgerController.bind(address);
  let strategy = readValue<Address>(
    controller.try_strategies(sett),
    Address.fromString(NO_ADDR),
  );
  return loadStrategy(strategy);
}
