'use strict'

const React = require('react')
const { Component } = React
const { Popup } = require('./popup')
const { OptionList } = require('./option')
const { blank } = require('../common/util')
const { bounds } = require('../dom')
const { startsWith } = require('../collate')
const { INPUT } = require('../constants/sass')
const {
  arrayOf, bool, func, instanceOf, number, string
} = require('prop-types')


class Completions extends Component {
  constructor(props) {
    super(props)
    this.state = this.getStateFromProps(props)
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) {
      this.setState(this.getStateFromProps(props))
    }
  }

  getStateFromProps(props = this.props) {
    return {
      active: null,
      options: this.filter(props)
    }
  }

  getPopupBounds() {
    if (this.props.input == null) return

    const { top, bottom, left, width } = bounds(this.props.input)
    const rows = this.state.options.length

    const HEIGHT = document.documentElement.clientHeight
    const height = OptionList.getHeight(rows, this.props.maxRows)
    const anchor = (bottom + height <= HEIGHT) ? 'top' : 'bottom'

    return {
      anchor,
      top: (anchor === 'top') ? bottom : top - height,
      left,
      height,
      width: width - 2 * INPUT.BORDER_WIDTH
    }
  }

  get isBlank() {
    return this.state.options.length === 0
  }

  get isVisible() {
    return (this.props.isVisibleWhenBlank || !this.isBlank) &&
      this.props.minQueryLength <= this.props.query.length
  }

  filter({ completions, match, query } = this.props) {
    query = query.trim().toLowerCase()
    const matchAll = blank(query)

    // TODO add options.idx for cached look-ups!

    return completions.reduce((options, value) => {
      if (matchAll || match(value, query)) {
        options.push({ id: value, value })
      }

      return options
    }, [])
  }

  next() {
    const next = (this.ol != null) ? this.ol.next() : null

    if (next != null) {
      this.setState({ active: next.id })
      this.ol.scrollIntoView(next, false)
    }
  }

  prev() {
    const prev = (this.ol != null) ? this.ol.prev() : null
    if (prev != null) {
      this.setState({ active: prev.id })
      this.ol.scrollIntoView(prev, false)
    }
  }

  setOptionList = (ol) => {
    this.ol = ol
  }

  render() {
    if (!this.isVisible) return null
    const { anchor, ...style } = this.getPopupBounds()

    return (
      <Popup
        anchor={anchor}
        className={this.props.className}
        style={style}>
        <OptionList
          ref={this.setOptionList}
          onSelect={this.props.onSelect}
          selection={this.state.active}
          values={this.state.options}/>
      </Popup>
    )
  }

  static propTypes = {
    className: string,
    completions: arrayOf(string).isRequired,
    input: instanceOf(HTMLElement).isRequired,
    isVisibleWhenBlank: bool,
    match: func.isRequired,
    maxRows: number.isRequired,
    minQueryLength: number.isRequired,
    onSelect: func.isRequired,
    query: string.isRequired
  }

  static defaultProps = {
    match: startsWith,
    maxRows: 5,
    minQueryLength: 0
  }
}

module.exports = {
  Completions
}
