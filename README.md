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
| badger-across | [src/badger-across](src/badger-across) | [badger-across](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-across) ([GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-across/graphql)) | [`EHyQAM-YmsYbG`](https://thegraph.com/explorer/subgraphs/EHyQAMZk2gFBiK2peWQQVXdkfMHtPfVqMr17BgYmsYbG) (synced)
| badger-aura-bribes | [src/aura-bribes](src/aura-bribes) | [aura-bribes](https://thegraph.com/hosted-service/subgraph/badger-finance/aura-bribes) ([GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/aura-bribes/graphql)) | [`9yCNce—3cyLpR`](https://thegraph.com/explorer/subgraphs/9yCNceXTpxcNqkjsAhiWsf7YRNUqfCTh7KKZzJ3cyLpR) (synced) |
| badger-fuse | [src/fuse-subgraph](src/fuse-subgraph) | [fuse-subgraph](https://thegraph.com/hosted-service/subgraph/badger-finance/fuse-subgraph) ([GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/fuse-subgraph/graphql)) | [`BwHGyX—XzBUSu`](https://thegraph.com/explorer/subgraphs/BwHGyX6rmbYwdnNTBMriebr2D6ihZDd59GpGsTXzBUSu) (synced) |
| badger-nfts | [src/badger-nfts](src/badger-nfts) | [badger-nfts](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-nfts) ([GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-nfts/graphql)) | [`DizwHg-osPESz`](https://thegraph.com/explorer/subgraphs/DizwHgs7HaymeRLAtR8d8DDCR7RAH8p9pGcng8osPESz) (synced) |
| badger-erc20s | [src/tokens](src/tokens) | [badger-dao-tokens](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-dao-tokens) ([GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-dao-tokens/graphql)) | [`E7qo3m-DA1m1q`](https://thegraph.com/explorer/subgraphs/E7qo3mY1Y5QU2FUukbeFKv98afpiun144ASjTdDA1m1q) (synced) |
| badger-vaults | [src/vaults](src/vaults) | [badger-dao-setts](https://thegraph.com/hosted-service/subgraph/badger-finance/badger-dao-setts) ([GraphiQL](https://api.thegraph.com/subgraphs/name/badger-finance/badger-dao-setts/graphql)) | [`4fGNcB-K3jnca`](https://thegraph.com/explorer/subgraphs/4fGNcBzS8nvcSgnAt8QSsL7aVgC6xJBygN531HK3jnca) (synced) |
| badger-votium-bribes | [src/votium-bribes](src/votium-bribes) | [votium-bribes](https://thegraph.com/hosted-service/subgraph/badger-finance/votium-bribes) (undeployed) | [`4UN7Ge-f4ZNGX`](https://thegraph.com/explorer/subgraphs/4UN7GeL4iUzPGsh1twdBmHXA6ezrmo1bJya8FFf4ZNGX) (synced) |

## Testing on a Local Graph Node
Open a terminal and run a local blockchain fork for the graph node to connect to:
```
ganache -h 0.0.0.0 --fork https://eth-mainnet.g.alchemy.com/v2/***
```

Then in a second terminal, run a local graph node:
```
git clone git@github.com:graphprotocol/graph-node.git
cd graph-node/docker
docker-compose up
```
(might need to `rm -rf data` before running the docker in order to reset ipfs and postgres persistency)

Finally deploy the subgraph in question to the local node:
```
cd src/<subgraph-dir>
yarn codegen && yarn build && yarn create-local && yarn deploy-local
```

**NOTE**: find the decentralised subgraphs in the readme in their own branch here: [`tree/decentralized`](../../tree/decentralized)

## Deploying a Subgraph

Badger subgraphs are written with the intention or serving cross chain implementations.
Thus, deployment of subgraphs comprises of three steps to allow for this flexibility in cross chain deployments.

## Deploying a Decentralised Subgraph
```
graph auth --studio <api-key>
cd src/<subgraph-dir>
graph codegen && graph build
graph deploy --studio <subgraph-slug>
```
