import React from 'react';
import { Field } from 'redux-form';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Labeled } from 'react-admin';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);  
    this.state = { address: '', latitude: '', longitude: '' }
  }

  handleChange = (address) => {
    this.setState({ address })
  }

  handleSelect = (address) => {
  	this.setState({ address })
    geocodeByAddress(address)
      .then(results => console.log(results[0].formatted_address))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        shouldFetchSuggestions={this.state.address.length > 1}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <input size='50' 
              {...getInputProps({
                placeholder: '302 Massachusetts Avenue, Arlington, MA, USA',
                className: 'location-search-input'
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map(suggestion => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}>
                    <span>{suggestion.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;