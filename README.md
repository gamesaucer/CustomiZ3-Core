# CustomiZ3-Core

[![Build Status](https://travis-ci.org/gamesaucer/CustomiZ3-Core.svg?branch=master)](https://travis-ci.org/gamesaucer/CustomiZ3-Core) 
[![Coverage Status](https://coveralls.io/repos/github/gamesaucer/CustomiZ3-Core/badge.svg?branch=master)](https://coveralls.io/github/gamesaucer/CustomiZ3-Core?branch=master) [![Code Style: Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Description

CustomiZ3 is a tool for customizing Zelda 3 roms. It relies fully on the contents of the provided rom, as most of its editing capability consists of pointing to other parts of the rom and copying over values.

The tool has an internal map of where to find certain game data, and by providing instructions, it becomes possible swap or copy the behaviour of things such as holes, bird locations and whirlpools to other objects of the same type.

## Installation

TODO

## Usage

Use CustomiZ3 in a project as follows:

```JavaScript
const { getPatcher, getRomVersion, getDomainList } = require('CustomiZ3')
```

Retrieve the version data of a rom by calling `getRomVersion` and providing the path to the rom file:

```JavaScript
const version = await getRomVersion('path/to/rom')
```

Get a list of Domain objects for a set of changes by calling `getDomainList` and providing the changes:

```JavaScript
const domainList = await getDomainList(changes)
```

Get a PatcherFactory by calling `getPatcher` and providing the Domain list and the rom version. Then call the PatcherFactory with the desired type of patch to get a Patcher.

```JavaScript
const patcherFactory = await getPatcher(domainList, version)
const patcher = await patcherFactory('native')
```

Call the `patch` method on the Patcher with the path to the rom file and a target location:

```JavaScript
await patcher.patch('path/to/rom', 'path/to/target')
```

The target file will now be a copy of the rom, but with the changes applied to it.