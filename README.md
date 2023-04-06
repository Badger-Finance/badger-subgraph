![TheGraph Splash Image](./docs/images/thegraph.jpg)
# Badger Subgraph

The Badger Subgraph repository is a GraphQL based project focused on parsing on chain events into queryable data to enable off chain analysis.
This project is built on top of [The Graph](https://thegraph.com/docs/developer/quick-start) - a decentralized protocol for indexing and querying data from blockchains.

The subgraphs focus on various aspects of the BadgerDAO protocol.
Each subgraph will have a local README detailing the specific data aggregated.
The subgraph project is controlled by a base package defining the shared libraries for standard use across graphs.
Each subgraph is delegated to the subgraphs workspace - this inherits all base packages from the parent package.

## Available Subgraphs

| Name | Source | Hosted | Decentralised
|-|-|-|-|
| badger-across | [src/badger-across](src/badger-across) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-across), [GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-across/graphql) | [`EHyQAM-YmsYbG`](https://thegraph.com/explorer/subgraphs/EHyQAMZk2gFBiK2peWQQVXdkfMHtPfVqMr17BgYmsYbG) (error)
| badger-aura-bribes | [src/aura-bribes](src/aura-bribes) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/aura-bribes), [GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/aura-bribes/graphql) | [`9yCNce—3cyLpR`](https://thegraph.com/explorer/subgraphs/9yCNceXTpxcNqkjsAhiWsf7YRNUqfCTh7KKZzJ3cyLpR) (synced) |
| badger-fuse | [src/fuse-subgraph](src/fuse-subgraph) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/fuse-subgraph), [GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/fuse-subgraph/graphql) | (deleted) |
| badger-nfts | [src/badger-nfts](src/badger-nfts) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-nfts), [GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-nfts/graphql) | [`DizwHg-osPESz`](https://thegraph.com/explorer/subgraphs/DizwHgs7HaymeRLAtR8d8DDCR7RAH8p9pGcng8osPESz) (synced) |
| badger-tokens | [src/tokens](src/tokens) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-dao-tokens), [GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-dao-tokens/graphql) | (error) |
| badger-vaults | [src/vaults](src/vaults) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-dao-setts), [GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-dao-setts/graphql) | (error) |
| badger-votium-bribes | [src/votium-bribes](src/votium-bribes) | [Dashboard](https://thegraph.com/hosted-service/subgraph/badger-finance/votium-bribes) (undeployed) | [`4UN7Ge-f4ZNGX`](https://thegraph.com/explorer/subgraphs/4UN7GeL4iUzPGsh1twdBmHXA6ezrmo1bJya8FFf4ZNGX) (synced) |

## Deploying a Subgraph

Badger subgraphs are written with the intention of serving cross chain implementations.
Thus, deployment of subgraphs comprises of three steps to allow for this flexibility in cross chain deployments.
