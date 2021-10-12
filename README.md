![TheGraph Splash Image](./docs/images/thegraph.jpg)
# Badger Subgraph

The Badger Subgraph repository is a GraphQL based project focused on parsing on chain events into queryable data to enable off chain analysis. 
This project is built on top of [TheGraph](https://thegraph.com/docs/developer/quick-start) - a decentralized protocol for indexing and querying data from blockchains.

The subgraphs focus on various aspects of the BadgerDAO protocol.
Each subgrpah will have a local README detailing the specific data aggregated.
The subgraph project is controlled by a base package defining the shared libraries for stanard use across graphs.
Each subgraph is delegated to the subgraphs workspace - this inherits all base packages from the parent package.

## Available Subgraphs

- **Badger Setts**
  - Short description of the badger setts subgraph
- **Badger Setts**
  - Short description of the badger setts subgraph
- **Badger Setts**
  - Short description of the badger setts subgraph
- **Badger Setts**
  - Short description of the badger setts subgraph

### Deployed Subgraphs

- [BadgerDAO Ethereum](https://thegraph.com/legacy-explorer/subgraph/axejintao/badger-dao)
- [BadgerDAO Polygon](https://thegraph.com/legacy-explorer/subgraph/axejintao/badger-dao-polygon)
- [BadgerDAO Arbitrum](https://thegraph.com/legacy-explorer/subgraph/axejintao/badger-dao-arbitrum)

## Deploying a Subgraph

Badger subgraphs are written with the intention or serving cross chain implementations.
Thus, deployment of subgraphs comprises of three steps to allow for this flexibility in cross chain deployments.

...
