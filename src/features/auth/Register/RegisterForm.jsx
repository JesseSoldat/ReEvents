import React from "react";
import { connect } from "react-redux";
import { Form, Segment, Button, Label, Divider } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";
import { Field, reduxForm } from "redux-form";
// Common Components
import TextInput from "../../../app/common/form/TextInput";
// Custom Components
import SocialLogin from "../SocialLogin/SocialLogin";
// Actions
import { registerUser, socialLogin } from "../authActions";

const RegisterForm = ({
  registerUser,
  handleSubmit,
  error,
  invalid,
  submitting,
  socialLogin
}) => {
  return (
    <Form size="large" onSubmit={handleSubmit(registerUser)}>
      {" "}
      <Segment>
        <Field
          name="displayName"
          type="text"
          component={TextInput}
          placeholder="Username"
        />
        <Field
          name="email"
          type="text"
          component={TextInput}
          placeholder="Email"
        />
        <Field
          name="password"
          type="password"
          component={TextInput}
          placeholder="Password"
        />
        {error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
        <Button
          disabled={invalid || submitting}
          fluid
          size="large"
          color="teal"
        >
          Register
        </Button>
        <Divider horizontal>Or</Divider>
        <SocialLogin socialLogin={socialLogin} />
      </Segment>
    </Form>
  );
};

const validate = combineValidators({
  displayName: isRequired("displayName"),
  email: isRequired("email"),
  password: isRequired("password")
});

export default connect(
  null,
  { registerUser, socialLogin }
)(reduxForm({ form: "registerForm", validate })(RegisterForm));
