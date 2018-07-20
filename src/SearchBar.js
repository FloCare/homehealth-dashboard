import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {ParseGooglePlacesAPIResponse} from './parsingUtils';
import TextField from '@material-ui/core/TextField';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      errorMessage: '',
      latitude: null,
      longitude: null,
      isGeocoding: false,
    };
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: '',
    });
  };

  handleSelect = selected => {
    const { input: { value, onChange } } = this.props
    onChange(selected);
    this.setState({ isGeocoding: true, address: selected });
    geocodeByAddress(selected)
      .then(res => {
        ParseGooglePlacesAPIResponse(res);
        getLatLng(res[0])
        .then(({ lat, lng }) => {
          localStorage.setItem('latitude', lat);
          localStorage.setItem('longitude', lng);
        })
      })
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.log('error', error); // eslint-disable-line no-console
      });
  };

  handleCloseClick = () => {
    this.setState({
      address: '',
      latitude: null,
      longitude: null,
    });
  };

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status); // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  render() {
    const { input: { value, onChange } } = this.props
    const searchOptions = {
      types: ['address'],
      componentRestrictions: {country: "us"}
    }
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        searchOptions={searchOptions}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
          <TextField
          required={true}
          id="required"
          placeholder="2340 1st Avenue, New York, NY, USA"
          margin="normal"
          style = {{width: 525}}
          {...getInputProps({
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

export default SearchBar;