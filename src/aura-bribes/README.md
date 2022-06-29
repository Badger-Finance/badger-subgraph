# Badger Subgraph

Subgraph to track Aura Bribe events

## Entities

This entity holds info about each bribed event that went through Hidden Hand protocol

```graphql
type Bribe @entity(immutable: true) {
  id: ID!
  proposal: Bytes!
  token: Bytes!
  amount: BigInt!
  bribeIdentifier: Bytes!
  rewardIdentifier: Bytes!
  briber: Bytes!
}
```
