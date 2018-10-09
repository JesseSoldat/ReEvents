import React from "react";
import { Form, Segment, Button, Label, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
// Common Components
import TextInput from "../../../app/common/form/TextInput";
// Custom Components
import SocialLogin from "../SocialLogin/SocialLogin";
// Actions
import { login, socialLogin } from "../authActions";

const LoginForm = ({ login, handleSubmit, error, socialLogin }) => {
  return (
    <Form size="large" onSubmit={handleSubmit(login)}>
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
        <Button fluid size="large" color="teal">
          Login
        </Button>
        <Divider horizontal>Or</Divider>
        <SocialLogin socialLogin={socialLogin} />
      </Segment>
    </Form>
  );
};

export default connect(
  null,
  { login, socialLogin }
)(reduxForm({ form: "loginForm" })(LoginForm));
