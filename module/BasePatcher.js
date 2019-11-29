export default class BasePatcher {
  setRomWriter (romWriter) {
    this.romWriter = romWriter
  }

  setGameOptions (gameOptions) {
    this.gameOptions = gameOptions
  }

  patch () {
    this.romWriter.write(this.gameOptions)
  }
}
