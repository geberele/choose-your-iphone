import React from 'react'
import axios from 'axios'
import _ from 'lodash'

class Phone extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      data: {},
      colorSelected: ''
    }

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.getColours = this.getColours.bind(this);
  }

  componentDidMount() {
    var self = this

    axios.get('https://raw.githubusercontent.com/geberele/choose-your-iphone/master/data/phones.json')
      .then(function (response) {
        self.setState({data: response.data[0]})
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  handleOptionChange(e) {
    this.setState({
      colorSelected: e.target.value
    });
  }

  getColours(list) {
    let uniqList = _.uniqBy(list, 'colourHex')
    return _.map(uniqList, (o) => (_.pick(o, ['colourHex', 'colourName'])))
  }

  render() {
    const {data} = this.state
    console.log(data)
    var phoneSelected = (!_.isEmpty(data)) ? JSON.stringify(data.deviceSummary[0], null, 2) : '',
      colours = this.getColours(data.deviceSummary),
      options = []

    _.each(colours, (colour, index) => {
      options[index] = (
        <label key={index}>
          <input type="radio" id="contactChoice1"
                 name="color" value={colour.colourHex}
                 onChange={this.handleOptionChange} />
          {colour.colourName}
        </label>
      )
    })
    console.log(options)

    if (_.isEmpty(data)) {
      return (
        <div className="phone">
          Loading...
        </div>
      )
    } else {
      return (
        <div className="phone">
          <div className="phone__image">{data.groupName}</div>
          <div className="phone__group-name">{data.groupName}</div>
          <div className="phone__rating">{data.rating}</div>
          <div className="phone__desc"><pre>{phoneSelected}</pre></div>
          <form>
            {options}
          </form>
        </div>
      )
    }
  }
}

export default Phone
