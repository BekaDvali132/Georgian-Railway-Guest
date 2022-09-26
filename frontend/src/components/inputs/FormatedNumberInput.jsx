import { Form, Input, InputNumber } from "antd";
import React from "react";
import { useState } from "react";

function FormatedNumberInput({name, label, errorMessage, style}) {
  const re = /^[0-9\b]+$/;
  const [value, setValue] = useState("");
  return (
    <Form.Item
        label={label}
        name={name}
        validateStatus={errorMessage && "error"}
        help={errorMessage}
        style = {style ? style : {}}
      >
    <Input
      onChange={(e) => {
        if (e.target.value === "" || re.test(e.target.value)) {
          setValue(e.target.value);
        }
      }}
      value={value}
    />
    </Form.Item>
  );
}

export default FormatedNumberInput;
