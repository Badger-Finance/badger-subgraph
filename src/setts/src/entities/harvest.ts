import { Address } from '@graphprotocol/graph-ts';
import { SettHarvest } from '../../generated/schema';
import { Harvest } from '../../generated/templates/BadgerStrategy/BadgerStrategy';
import { loadSett } from './badger-sett';
import { loadStrategy } from './strategy';

export function loadHarvest(event: Harvest): SettHarvest {
  let id = event.transaction.hash
    .toHexString()
    .concat('-')
    .concat(event.logIndex.toString());
  let harvest = SettHarvest.load(id) as SettHarvest;
  if (harvest) {
    return harvest;
  }
  harvest = new SettHarvest(id);
  harvest.timestamp = event.block.timestamp.toI32();
  harvest.blockNumber = event.block.number;

  let strategy = loadStrategy(event.address);
  harvest.strategy = strategy.id;
  harvest.sett = strategy.sett;
  harvest.amount = event.params.harvested;

  if (strategy.sett) {
    let sett = loadSett(Address.fromString(strategy.sett));
    harvest.token = sett.token;
  }

  harvest.save();
  return harvest;
}
