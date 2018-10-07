import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { Form, Label, Segment } from "semantic-ui-react";

class PlacesInput extends Component {
  state = {
    address: "",
    scriptLoaded: false,
    scriptError: false
  };

  handleScriptCreate = () => {
    this.setState({ scriptLoaded: false });
  };

  handleScriptError = () => {
    this.setState({ scriptError: true });
  };

  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true });
  };

  handleChange = address => {
    this.setState({ address });
  };

  render() {
    const {
      input,
      width,
      placeholder,
      onSelect,
      meta: { touched, error }
    } = this.props;
    return (
      <Form.Field error={touched && !!error} width={width}>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={onSelect}
          placeholder={placeholder}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder
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
          )}
        </PlacesAutocomplete>
        {/* {END PLACE COMPONENT} */}
        {this.touched &&
          this.error && (
            <Label basic color="red">
              {this.error}
            </Label>
          )}
      </Form.Field>
    );
  }
}
export default PlacesInput;
