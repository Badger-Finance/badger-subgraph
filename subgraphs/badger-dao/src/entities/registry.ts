import { Address } from "@graphprotocol/graph-ts";
import { Registry } from "../../generated/schema";

export function loadRegistry(address: Address): Registry {
  let id = address.toHexString();
  let registry = Registry.load(id) as Registry;
  if (registry) {
    return registry;
  }
  registry = new Registry(id);
  registry.save();
  return registry;
}
