import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 530;
const DEFAULT_MAX_BUBBLE_RADIUS = 70;
const DEFAULT_HEIGHT = 200;

const PLACEMENT_AUTO = 'auto';
const PLACEMENT_HORIZONTAL = 'horizontal';
const DEFAULT_PLACEMENT = PLACEMENT_AUTO;

/**
 * Draw a bubble chart with labels.  Values are mapped to area, not radius.
 */
class BubbleChart extends React.Component {

  render() {
    const { data, width, height, maxBubbleRadius, placement } = this.props;
    const { formatNumber } = this.props.intl;
    const options = {
      width,
      height,
      maxBubbleRadius,
      placement,
    };
    if ((width === null) || (width === undefined)) {
      options.width = DEFAULT_WIDTH;
    }
    if ((height === null) || (height === undefined)) {
      options.height = DEFAULT_HEIGHT;
    }
    if ((maxBubbleRadius === null) || (maxBubbleRadius === undefined)) {
      options.maxBubbleRadius = DEFAULT_MAX_BUBBLE_RADIUS;
    }
    if ((placement === null) || (placement === undefined)) {
      options.placement = DEFAULT_PLACEMENT;
    }

    // prep the data and some config (scale by sqrt of value so we map to area, not radius)
    const maxValue = d3.max(data.map(d => d.value));
    const radius = d3.scaleSqrt().domain([0, maxValue]).range([0, options.maxBubbleRadius]);
    let circles = null;
    switch (options.placement) {
      case PLACEMENT_HORIZONTAL:
        circles = data.map((d, idx, list) => {
          const preceeding = list.slice(0, idx);
          const diameters = preceeding.map(d2 => (radius(d2.value) + 5) * 2);
          const xOffset = diameters.reduce((a, b) => a + b, 0);
          return {
            ...d,
            r: radius(d.value),
            y: 0,
            x: xOffset,
          };
        });
        break;
      case PLACEMENT_AUTO:
        const bubbleData = data.map(d => ({ ...d, r: radius(d.value) }));
        circles = d3.packSiblings(bubbleData);
        break;
      default:
        const error = { message: `BubbleChart received invalid placement option of ${options.placement}` };
        throw error;
    }
    let content = null;
    if (circles) {
      // render it all
      const node = ReactFauxDOM.createElement('svg');
      const svg = d3.select(node)
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('class', 'bubble-chart');
      const totalWidth = circles.slice(-1)[0].x + circles.slice(-1)[0].r; // TODO: make this support bubble packing too
      const bubbles = svg.append('g')
        .attr('transform', `translate(${(options.width - totalWidth) / 2},${options.height / 2})`)
        .selectAll('.bubble')
        .data(circles)
        .enter();
      // create the bubbles
      bubbles.append('circle')
        .attr('r', d => d.r)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', d => d.color || '');
      // format the text for each bubble
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y - d.r - 18)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.labelColor} !important` || '')
        .text(d => d.label);
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y - d.r - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.labelColor} !important` || '')
        .text(d => formatNumber(d.value));
      content = node.toReact();
    }

    return content;
  }

}

BubbleChart.propTypes = {
  intl: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired, // [ {'label': string, 'value': number, 'color': string(optional), 'labelColor': string(optional)}, ... ]
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  placement: React.PropTypes.string,  // [ 'auto' | 'horiztonal' ]
  maxBubbleRadius: React.PropTypes.number,
};

export default injectIntl(BubbleChart);
