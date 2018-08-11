import {
  createElement as n,
  Component
} from 'react'
import styled from 'styled-components'
import { render } from 'react-dom'

import map from './components/map/map.component.js'

const app = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
`

window.fetch('./dist/assets/brasil.json')
.then(res => res.json())
.then(json => {
  render(
    n(app, {}, n(map, { json: json })),
    document.getElementById('app')
    )
})