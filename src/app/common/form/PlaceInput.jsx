import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import Script from "react-load-script";
import { Form, Label, Segment } from "semantic-ui-react";

class PlacesInput extends Component {
  state = {
    address: "",
    scriptLoaded: false
  };

  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  handleChange = address => {
    this.setState({ address });
    this.props.onSelect(address);
  };

  renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions }) => (
    <div>
      <input
        {...getInputProps({
          placeholder: this.props.placeholder
        })}
      />
      <Segment.Group suggestions={suggestions}>
        {suggestions.map(suggestion => (
          <Segment {...getSuggestionItemProps(suggestion)}>
            {suggestion.description}
          </Segment>
        ))}
      </Segment.Group>
    </div>
  );

  render() {
    const {
      searchOptions,
      meta: { touched, error }
    } = this.props;
    return (
      <Form.Field error={touched && !!error}>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7V7ExJydkww--H26Wtuo5NXrWmb9VEhI&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        {this.state.scriptLoaded && (
          <PlacesAutocomplete
            value={this.state.address}
            searchOptions={searchOptions}
            onChange={this.handleChange}
            onSelect={this.handleChange}
            debounce={200}
          >
            {this.renderFunc}
          </PlacesAutocomplete>
        )}
        {touched &&
          !!error && (
            <Label basic color="red">
              {error}
            </Label>
          )}
      </Form.Field>
    );
  }
}
export default PlacesInput;
