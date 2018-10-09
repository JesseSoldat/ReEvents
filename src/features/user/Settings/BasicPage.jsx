import React, { Component } from "react";
import { Segment, Form, Header, Divider, Button } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import moment from "moment";
import Script from "react-load-script";
// Common Components
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import TextInput from "../../../app/common/form/TextInput";
import RadioInput from "../../../app/common/form/RadioInput";

class BasicPage extends Component {
  state = {
    city: "",
    scriptLoaded: false
  };

  handleScriptLoaded = () => {
    this.setState({ scriptLoaded: true });
  };

  handleCitySelect = city => {
    console.log(city);
    this.props.change("city", city);
  };

  render() {
    const { pristine, submitting, handleSubmit, updateProfile } = this.props;
    return (
      <Segment>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7V7ExJydkww--H26Wtuo5NXrWmb9VEhI&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Header dividing size="large" content="Basics" />
        <Form onSubmit={handleSubmit(updateProfile)}>
          <Field
            width={8}
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Known As"
          />

          <Form.Group inline>
            <label>Gender: </label>
            <Field
              name="gender"
              value="male"
              label="Male"
              component={RadioInput}
            />
            <Field
              name="gender"
              value="female"
              label="Female"
              component={RadioInput}
            />
          </Form.Group>

          <Field
            width={8}
            name="dateOfBirth"
            component={DateInput}
            dateFormat="YYYY-MM-DD"
            showYearDropdown={true}
            showMonthDropdown={true}
            dropdownMode="select"
            maxDate={moment().subtract(18, "years")}
            placeholder="Date of Birth"
          />

          <Field
            name="city"
            placeholder="Home Town"
            searchOptions={{ types: ["(cities)"] }}
            label="Home Town"
            input={this.state.city}
            onSelect={this.handleCitySelect}
            component={PlaceInput}
            width={8}
          />

          <Divider />
          <Button
            disabled={pristine || submitting}
            size="large"
            positive
            content="Update Profile"
          />
        </Form>
      </Segment>
    );
  }
}

export default reduxForm({
  form: "userProfile",
  enableReinitialize: true,
  destroyOnUnmount: false
})(BasicPage);
