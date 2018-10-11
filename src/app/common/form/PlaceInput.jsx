import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import Script from "react-load-script";
import { Form, Label, Segment } from "semantic-ui-react";
import { googleMapsApiKey } from "../../config/googleKey";

const url = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;

class PlacesInput extends Component {
  state = {
    scriptLoaded: false
  };

  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  handleChange = address => {
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
      input,
      searchOptions,
      meta: { touched, error }
    } = this.props;

    // console.log("Places", input);

    const { value } = input;

    return (
      <Form.Field error={touched && !!error}>
        <Script url={url} onLoad={this.handleScriptLoaded} />
        {this.state.scriptLoaded && (
          <PlacesAutocomplete
            value={value}
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
