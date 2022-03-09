# Badger API Subgraph

![License](https://img.shields.io/badge/license-MIT-green)
[![Build](https://github.com/axejintao/badger-dao/actions/workflows/build.yml/badge.svg)](https://github.com/axejintao/badger-dao/actions/workflows/build.yml)

This subgraph focuses on tracking sett vault tokens transfers for users of the Badger Protocol.
This supgraph powers the [Badger API](http://docs.badger.finance/).

## Initial Setup

Generate graphql entities and contracts:

```bash
yarn prepare:mainnet
yarn codegen
```

## Deploying a Subgraph

Prepare deployment:

```
yarn prepare:<network>
```

Deploy

```
yarn deploy:<network>
```

Network Options

- mainnet
- mainnet-staging
- bsc
- matic
- xdai
