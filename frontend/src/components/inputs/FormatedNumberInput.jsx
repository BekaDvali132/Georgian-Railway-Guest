import { Form, Input } from "antd";
import { useState } from "react";

function FormatedNumberInput({name, label, errorMessage, style, form}) {
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
          form && form.setFieldValue(name,e.target.value)
        } else {
          setValue(value)
          form && form.setFieldValue(name,value)
        }
      }}
      value={value}
    />
    </Form.Item>
  );
}

export default FormatedNumberInput;
