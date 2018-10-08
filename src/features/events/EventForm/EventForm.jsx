import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { withFirestore } from "react-redux-firebase";
import Script from "react-load-script";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
// Actions
import { createEvent } from "../eventActions";
// Common Components
import TextInput from "../../../app/common/form/TextInput";
import SelectInput from "../../../app/common/form/SelectInput";
import TextArea from "../../../app/common/form/TextArea";
import PlaceInput from "../../../app/common/form/PlaceInput";
import DateInput from "../../../app/common/form/DateInput";

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };

  handleScriptLoaded = () => {
    this.setState({ scriptLoaded: true });
  };

  handleCitySelect = selectedCity => {
    this.props.change("city", selectedCity);
    this.placeToGeoLocation(selectedCity, "cityLatLng");
  };

  handleVenueSelect = selectedVenue => {
    this.props.change("venue", selectedVenue);
    this.placeToGeoLocation(selectedVenue, "venueLatLng");
  };

  placeToGeoLocation = (place, type) => {
    geocodeByAddress(place)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          [type]: latlng
        });
      })
      .catch(err => console.log("geoByAddress", err));
  };

  updateSearchOptions = () => {
    const searchOptions = {
      location: new window.google.maps.LatLng(this.state.cityLatLng),
      radius: 1000,
      types: ["establishment"]
    };
    return searchOptions;
  };

  onFormSubmit = values => {
    console.log(values);

    const formValues = {
      ...values,
      cityLatLng: this.state.cityLatLng,
      venueLatLng: this.state.venueLatLng
    };

    this.props.createEvent(formValues);
    this.props.history.push("/events");
  };

  render() {
    const { handleSubmit, submitting, pristine, invalid, loading } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7V7ExJydkww--H26Wtuo5NXrWmb9VEhI&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={handleSubmit(this.onFormSubmit)}>
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Give your event a name"
              />
              <Field
                name="category"
                type="text"
                component={SelectInput}
                options={category}
                placeholder="What is your event about"
              />
              <Field
                name="description"
                type="text"
                component={TextArea}
                rows={3}
                placeholder="Tell us about your event"
              />
              <Header sub color="teal" content="Event Location details" />
              {this.state.scriptLoaded && (
                <div>
                  <Field
                    name="city"
                    type="text"
                    component={PlaceInput}
                    searchOptions={{ types: ["(cities)"] }}
                    placeholder="Event city"
                    input={this.state.city}
                    onSelect={this.handleCitySelect}
                  />
                  <Field
                    name="venue"
                    type="text"
                    component={PlaceInput}
                    searchOptions={this.updateSearchOptions()}
                    placeholder="Event venue"
                    onSelect={this.handleVenueSelect}
                  />
                </div>
              )}
              <Field
                name="date"
                type="text"
                component={DateInput}
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Date and time of event"
              />
              <Button
                loading={loading}
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
              <Button
                disabled={loading}
                onClick={this.props.history.goBack}
                type="button"
              >
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired({ message: "Please provide a category" }),
  description: composeValidators(
    isRequired({ message: "Please enter a description" }),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 characters"
    })
  )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date")
});

const mapStateToProps = ({ firestore, firebase, async }) => {
  let event = {};

  if (firestore.ordered.events && firestore.ordered.events[0]) {
    event = firestore.ordered.events[0];
  }
  return {
    initialValues: event,
    event,
    loading: async.loading
  };
};

export default withFirestore(
  connect(
    mapStateToProps,
    { createEvent }
  )(
    reduxForm({ form: "eventForm", enableReinitialize: true, validate })(
      EventForm
    )
  )
);
