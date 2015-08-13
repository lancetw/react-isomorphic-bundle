// borrow from universal-redux-boilerplate
// https://github.com/savemysmartphone/universal-redux-boilerplate

export default class ReduxResolver {

  constructor () {
    this.pending = []
    this.firstRending = true
  }

  resolve (action) {
    const [, ...args] = arguments
    if (process.env.BROWSER && !this.firstRending)
      return action(...args)
    else
      this.pending = [
        ...this.pending,
        { action, args }
      ]
  }

  async dispatch () {
    await Promise.all(
      this.pending.map(({ action, args }) => action(...args)))
  }

  clear () {
    this.pending = []
    this.firstRending = false
  }
}
