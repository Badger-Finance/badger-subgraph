# Badger Subgraph

Subgraph to track Across protocol balances on Mainnet.

## Setup

- Copy `.envrc.example` to `.envrc`.
- Set `ACCESS_TOKEN` to your The Graph [access token](https://thegraph.com/docs/deploy-a-subgraph#store-the-access-token).
- Set `GRAPH_PATH` to `<github-username>/<subgraph-name>`.
- Export `.envrc` variables.

## Entities

This entity holds information regarding ERC20 tokens present in the subgraph.

```graphql
type Token @entity {
  id: ID!
  address: Bytes!
  decimals: Int!
  name: String!
  symbol: String!
}
```