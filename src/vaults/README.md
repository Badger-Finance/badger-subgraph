# Badger API Subgraph

![License](https://img.shields.io/badge/license-MIT-green)
[![Build](https://github.com/axejintao/badger-dao/actions/workflows/build.yml/badge.svg)](https://github.com/axejintao/badger-dao/actions/workflows/build.yml)

This subgraph focuses on tracking sett vault tokens transfers for users of the Badger Protocol.
This supgraph powers the [Badger API](http://docs.badger.finance/).

## Deployed

`Mainnet`:
- `sequences`: https://thegraph.com/hosted-service/subgraph/badger-finance/badger-dao-setts
- `graphiql`: https://api.thegraph.com/subgraphs/name/badger-finance/badger-dao-setts

Subgraphs for other networks conform this pattern `badger-finance/badger-dao-tokens-<network>`,
where `network` can be:
- fantom
- avalanche
- polygon
- arbitrum
- xdai
- bsc

## Sources
- [RegistryV2.sol](https://github.com/Badger-Finance/badger-registry/blob/main/contracts/BadgerRegistry.sol)
- [Vault.sol](https://github.com/Badger-Finance/badger-vaults-1.5/blob/main/contracts/Vault.sol)

## Initial Setup

Generate graphql entities and contracts:

```bash
yarn prepare:mainnet
yarn codegen
```

## Deploying a Subgraph

Prepare deployment:

```sh
yarn prepare:<network>
```

Deploy

```sh
yarn deploy:<network>
```

Network Options

- mainnet
- mainnet-staging
- bsc
- matic
- xdai
