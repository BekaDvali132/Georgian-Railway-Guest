import { Input, InputNumber } from "antd";
import React from "react";
import { useState } from "react";

function FormatedNumberInput() {
  const re = /^[0-9\b]+$/;
  const [value, setValue] = useState("");
  return (
    <Input
      onChange={(e) => {
        if (e.target.value === "" || re.test(e.target.value)) {
          setValue(e.target.value);
        }
      }}
      value={value}
    />
  );
}

export default FormatedNumberInput;
