import { runPlugins } from '../plugins'
import { getContext } from '../context'

import { mountLogic, unmountLogic } from './mount'
import { getPathForInput } from './path'
import { addConnection } from '..'

export function getBuiltLogic (inputs, props, wrapper, autoConnectInListener = true) {
  const input = inputs[0]
  const key = props && input.key ? input.key(props) : undefined

  if (input.key && typeof key === 'undefined') {
    throw new Error('[KEA] Must have key to build logic')
  }

  // get a path for the input, even if no path was manually specified in the input
  const path = getPathForInput(input, props)
  const pathString = path.join('.')

  const {
    build: { heap: buildHeap, cache: buildCache },
    run: { heap: runHeap },
    options: { autoConnect: globalAutoConnect },
    mount: { counter: mountCounter }
  } = getContext()

  if (!buildCache[pathString]) {
    buildCache[pathString] = buildLogic({ inputs, path, key, props, wrapper })
  } else {
    buildCache[pathString].props = props
  }

  // autoConnect must be enabled globally
  if (globalAutoConnect) {
    // if we were building something when this got triggered, add this as a dependency for the previous logic
    // always connect these, even if autoConnectInListener is false
    if (buildHeap.length > 0) {
      if (!buildHeap[buildHeap.length - 1].connections[pathString]) {
        addConnection(buildHeap[buildHeap.length - 1], buildCache[pathString])
      }

    // if we were running a listener and built this logic, mount it directly
    // ... except if autoConnectInListener is false
    } else if (autoConnectInListener && runHeap.length > 0) {
      const runningInLogic = runHeap[runHeap.length - 1]
      if (!runningInLogic.connections[pathString]) {
        addConnection(runningInLogic, buildCache[pathString])
        mountLogic(buildCache[pathString], mountCounter[runningInLogic.pathString]) // will be unmounted via the connection
      }
    }
  }

  return buildCache[pathString]
}

// builds logic. does not check if it's built or already on the context
function buildLogic ({ inputs, path, key, props, wrapper }) {
  let logic = createBlankLogic({ key, path, props, wrapper })
  setLogicDefaults(logic)

  const { build: { heap } } = getContext()

  heap.push(logic)

  runPlugins('beforeBuild', logic, inputs)

  for (const input of inputs) {
    applyInputToLogic(logic, input)
    if (input.extend) {
      for (const innerInput of input.extend) {
        applyInputToLogic(logic, innerInput)
      }
    }
  }

  /*
    add a connection to ourselves in the end
    logic.connections = { ...logic.connections, 'scenes.path.to.logic': logic }
  */
  logic.connections[logic.pathString] = logic

  runPlugins('afterBuild', logic, inputs)

  heap.pop()

  return logic
}

function createBlankLogic ({ key, path, props, wrapper }) {
  let logic = {
    _isKeaBuild: true,
    key,
    path,
    pathString: path.join('.'),
    props,
    wrapper,
    extend: input => applyInputToLogic(logic, input),
    mount: (callback) => {
      mountLogic(logic)
      if (callback) {
        const response = callback(logic)

        if (response && response.then && typeof response.then === 'function') {
          return response.then(value => {
            unmountLogic(logic)
            return value
          })
        }

        unmountLogic(logic)
        return response
      }
      return () => unmountLogic(logic)
    }
  }

  return logic
}

function setLogicDefaults (logic) {
  const { plugins } = getContext()

  for (const plugin of plugins.activated) {
    if (plugin.defaults) {
      const defaults = typeof plugin.defaults === 'function' ? plugin.defaults() : plugin.defaults
      Object.assign(logic, defaults)
    }
  }
}

// Converts `input` into `logic` by running all build steps in succession
function applyInputToLogic (logic, input) {
  runPlugins('beforeLogic', logic, input)

  const { plugins: { buildOrder, buildSteps } } = getContext()

  for (const step of buildOrder) {
    for (const func of buildSteps[step]) {
      func(logic, input)
    }
  }

  runPlugins('afterLogic', logic, input)

  return logic
}
