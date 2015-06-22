// copy from flummox
import debug from 'debug'

export default async function runStaticMethod
  (components, methodName, ...args) {

  return Promise.all(components
    .filter(component => typeof component.DecoratedComponent === 'function')
    .map(component => component.DecoratedComponent[methodName])
    .filter(method => typeof method === 'function')
    .map(method => method(...args))
  )
}
