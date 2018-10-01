import React from "react";
import { connect } from "react-redux";
import { Form, Segment, Button, Label, Divider } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";
import { Field, reduxForm } from "redux-form";
// Actions
import { registerUser } from "../authActions";
// Components
import TextInput from "../../../app/common/form/TextInput";

const RegisterForm = ({
  registerUser,
  handleSubmit,
  error,
  invalid,
  submitting
}) => {
  return (
    <Form size="large" onSubmit={handleSubmit(registerUser)}>
      {" "}
      <Segment>
        <Field
          name="displayName"
          type="text"
          component={TextInput}
          placeholder="Known As"
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
  { registerUser }
)(reduxForm({ form: "registerForm", validate })(RegisterForm));
