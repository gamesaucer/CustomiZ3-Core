#!/usr/bin/env node

export default class BasePatcher {
  setRomWriter (romWriter) {
    this.romWriter = romWriter
  }

  setGameOptions (gameOptions) {
    this.gameOptions = gameOptions
  }

  patch () {
    this.romWriter.applyPatches(this.gameOptions)
  }
}
