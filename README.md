# CustomiZ3-Core

[![Build Status](https://travis-ci.org/gamesaucer/CustomiZ3-Core.svg?branch=master)](https://travis-ci.org/gamesaucer/CustomiZ3-Core) 
[![Coverage Status](https://coveralls.io/repos/github/gamesaucer/CustomiZ3-Core/badge.svg?branch=master)](https://coveralls.io/github/gamesaucer/CustomiZ3-Core?branch=master) [![NPM Version](https://img.shields.io/npm/v/@gamesaucer/customiz3-core)](https://www.npmjs.com/package/@gamesaucer/customiz3-core) [![Code Style: Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Description

CustomiZ3 is a tool for customizing Zelda 3 roms. It relies fully on the contents of the provided rom, as most of its editing capability consists of pointing to other parts of the rom and copying over values.

The tool has an internal map of where to find certain game data, and by providing instructions, it becomes possible swap or copy the behaviour of things such as holes, bird locations and whirlpools to other objects of the same type.

## Installation

You can use Node package manager to install CustomiZ3.

```cmd
npm install @gamesaucer/customiz3-core
```

## Usage

Use CustomiZ3 in a project as follows:

```JavaScript
const CustomiZ3 = require('@gamesaucer/customiz3-core')
// or:
const { getPatcher, getRomVersion, getDomainList } = require('@gamesaucer/customiz3-core')
```

Retrieve the version data of a rom by calling `getRomVersion` and providing the path to the rom file:

```JavaScript
const version = await CustomiZ3.getRomVersion('path/to/rom')
```

Get a list of Domain objects for a set of changes by calling `getDomainList` and providing the changes:

```JavaScript
const domainList = await CustomiZ3.getDomainList(changes)
```

Get a PatcherFactory by calling `getPatcher` and providing the Domain list and the rom version. Then call the PatcherFactory with the desired type of patch to get a Patcher.

```JavaScript
const patcherFactory = await CustomiZ3.getPatcher(domainList, version)
const patcher = await patcherFactory('native')
```

Call the `patch` method on the Patcher with the path to the rom file and a target location:

```JavaScript
await patcher.patch('path/to/rom', 'path/to/target')
```

The target file will now be a copy of the rom, but with the changes applied to it.