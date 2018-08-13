import {
  createElement as n,
  Component
} from 'react'
import styled from 'styled-components'

import { geoPath, geoMercator } from 'd3-geo'

const svg = styled.svg`
  height: 500px;
  width: 500px;
  stroke: #000;
  stroke-width: 1;
`

const path = styled.path`
  d: ${ props => props.d };
  fill: #fff;

  &:hover {
    fill: #000
  };
`

export default class Map extends Component {
  constructor(props) {
    super(props)
    const projection = geoMercator().fitSize([500, 500], props.json)
    this.pathGenerator = geoPath().projection(projection)
  }

  render() {
    return n(svg,
      {},
      this.props.json.features.map(feature => n(
        path, { key: feature.properties.UF_05, d: this.pathGenerator(feature) })
      )
      )
  }
}