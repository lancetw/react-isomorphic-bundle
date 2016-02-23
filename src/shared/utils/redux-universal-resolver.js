// borrow from universal-redux-boilerplate
// https://github.com/savemysmartphone/universal-redux-boilerplate

export default class ReduxResolver {

  constructor () {
    this.pending = []
    this.firstRendering = true
  }

  resolve (action) {
    const [, ...args] = arguments
    console.log(action, args)
    if (process.env.BROWSER && !this.firstRendering) {
      return action(...args)
    } else {
      this.pending = [
        ...this.pending,
        { action, args }
      ]
    }
  }

  async dispatch () {
    await Promise.all(
      this.pending.map(({ action, args }) => action(...args)))
  }

  clear () {
    this.pending = []
    this.firstRendering = false
  }
}
