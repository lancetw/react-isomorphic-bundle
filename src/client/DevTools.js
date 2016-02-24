import React from 'react'

import { createDevTools } from 'redux-devtools'

import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import SliderMonitor from 'redux-slider-monitor'

const DevTools = createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    changeMonitorKey="ctrl-m"
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q">
    <LogMonitor theme="nicinabox" />
    <SliderMonitor />
  </DockMonitor>
)

module.exports = DevTools
