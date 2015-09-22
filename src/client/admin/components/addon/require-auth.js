import { checkToken, showUser, logout } from 'client/admin/actions/AuthActions'

export default function (nextState, replaceState) {
  const nextPathname = nextState.location.pathname
  const { dispatch, getState } = this.store
  dispatch(checkToken())
  const verified = getState().auth.verified

  if (!verified) {
    this.store.dispatch(logout())
    replaceState({ nextPathname: nextPathname }, '/ring')
  }
}
