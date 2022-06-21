# Badger Subgraph

Subgraph to track Votium Bribe events

## Entities

This entity holds info about each bribed event that went through Votium protocol

```graphql
type Bribe @entity(immutable: true) {
  id: Bytes!
  proposal: Bytes!
  token: Bytes!
  amount: BigInt!
  choiceIndex: BigInt!
}
```
