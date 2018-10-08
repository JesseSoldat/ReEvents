import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "./datepicker.css"; // Bug fix for padding on time section
import moment from "moment";

const DateInput = ({
  input: { value, onChange, onBlur, ...restInput },
  placeholder,
  meta: { touched, error },
  ...rest
}) => {
  if (value) value = moment(value, "X");

  return (
    <Form.Field error={touched && !!error}>
      <DatePicker
        {...rest}
        placeholderText={placeholder}
        selected={value ? moment(value) : null}
        onChange={onChange}
        {...restInput}
      />

      {touched &&
        !!error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
    </Form.Field>
  );
};

export default DateInput;
