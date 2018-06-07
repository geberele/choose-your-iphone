import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import StarRating from 'react-star-review'

class Phone extends React.Component {

  /**
   * Implements constructor().
   */
  constructor (props) {
    super(props)

    this.state = {
      groupName: '',
      rating: '',
      listPhones: {},
      phoneSelected: {},
      colourSelected: '',
      memorySelected: '',
    }

    this.handleColourChange = this.handleColourChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.getColours = this.getColours.bind(this);
    this.getCapacities = this.getCapacities.bind(this);
    this.changePhone = this.changePhone.bind(this);
  }

  /**
   * Implements componentDidMount().
   */
  componentDidMount() {
    var self = this

    axios.get('https://raw.githubusercontent.com/geberele/choose-your-iphone/master/data/phones.json')
      .then(function (response) {
        self.setState({
          groupName: response.data[0].groupName,
          rating: response.data[0].rating,
          listPhones: response.data[0].deviceSummary,
          phoneSelected: (!_.isEmpty(response.data[0].deviceSummary)) ? response.data[0].deviceSummary[0] : {},
          colourSelected: (!_.isEmpty(response.data[0].deviceSummary)) ? response.data[0].deviceSummary[0].colourName : '',
          memorySelected: (!_.isEmpty(response.data[0].deviceSummary)) ? response.data[0].deviceSummary[0].memory : ''
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  /**
   * Handles the changes of the radio button for the capacities.
   */
  handleCapacityChange(e) {
    this.changePhone('', e.target.value)
  }

  /**
   * Handles the changes of the radio button for the colours.
   */
  handleColourChange(e) {
    this.changePhone(e.target.value)
  }

  /**
   * Implements componentDidMount().
   */
  changePhone(colour = '', memory = '') {
    colour = (!_.isEmpty(colour)) ? colour : this.state.colourSelected
    memory = (!_.isEmpty(memory)) ? memory : this.state.memorySelected

    let filteredByColour = _.filter(this.state.listPhones, (o) => (o.colourName == colour)),
      filteredByCapacity = _.filter(filteredByColour, (o) => (o.memory == memory))

    this.setState({
      phoneSelected: (!_.isEmpty(filteredByCapacity)) ? filteredByCapacity[0] : {},
      colourSelected: colour,
      memorySelected: memory
    });
  }

  /**
   * Get the list of the different colours.
   */
  getColours() {
    let uniqList = _.uniqBy(this.state.listPhones, 'colourHex')
    return _.map(uniqList, (o) => (_.pick(o, ['colourHex', 'colourName'])))
  }

  /**
   * Get the list of the different capacities.
   */
  getCapacities() {
    let uniqList = _.uniqBy(this.state.listPhones, 'memory')
    return _.map(uniqList, (o) => (_.pick(o, ['memory'])))
  }

  /**
   * Implements render().
   */
  render() {
    const {groupName, rating, phoneSelected, colourSelected, memorySelected} = this.state

    var colours = this.getColours(),
      capacities = this.getCapacities(),
      radioColours = [], radioCapacities = []

    _.each(colours, (colour, index) => {
      let style = {backgroundColor: colour.colourHex}
      radioColours[index] = (
        <label key={index} className="container">
          <input type="radio" id="contactChoice1"
                 name="colour" value={colour.colourName}
                 checked={colourSelected === colour.colourName}
                 onChange={this.handleColourChange} />
          <span className="checkmark" style={style}></span>
        </label>
      )
    })

    _.each(capacities, (capacity, index) => {
      radioCapacities[index] = (
        <label key={index} className="container">
          <input type="radio" id="contactChoice133"
                 name="capacity" value={capacity.memory}
                 checked={memorySelected === capacity.memory}
                 onChange={this.handleCapacityChange} />
          <span className="checkmark">{capacity.memory.substring(0, capacity.memory.length - 2)}</span>
        </label>
      )
    })

    if (_.isEmpty(groupName)) {
      return (
        <div className="phone">
          Loading...
        </div>
      )
    } else if (_.isEmpty(phoneSelected)) {
      return (
        <div className="phone">
          No phones
        </div>
      )
    } else {
      return (
        <div className="phone">
          <div className="phone__image">
            <img src={phoneSelected.merchandisingMedia[0]['value']} />
          </div>
          <div className="phone__info">
            <div className="phone__group-name">{groupName}</div>
            <div className="phone__rating">
              <StarRating
                rating={rating}
              />
            </div>
            <div className="phone__desc">{phoneSelected.displayDescription}</div>
            <form>
              <div className="radio-field">
                <div className="radio-field__title">Colour: <span>{colourSelected}</span></div>
                {radioColours}
              </div>
              <div className="radio-field">
                <div className="radio-field__title">Capacity: <span>{memorySelected}</span></div>
                {radioCapacities}
              </div>
            </form>
            <div className="phone__price-wrapper">
              <div className="phone__price">
                from <span>£{phoneSelected.priceInfo.hardwarePrice.oneOffPrice.gross}</span> upfront cost
              </div>
              <span className="phone__price-line"></span>
              <div className="phone__price">
                When you pay <span>£{phoneSelected.priceInfo.bundlePrice.monthlyPrice.gross}</span> a month
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Phone
