import { Button, Form, Input } from "antd";
import React from "react";
import "./UserLogin.scss";
import useTranslation from "../hooks/translation/useTranslation";
import { useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/userContext/userContext";
import { useContext } from "react";
function UserLogin() {
  const { trans } = useTranslation();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext)

  const onFinish = (values) => {
    setIsLoading(true);

    axios.post("/api/customers/login", values).then((res) => {
      setIsLoading(false);
      if (res?.data?.status === "success") {
        setErrors(null);
        userContext.setUser(res?.data?.data?.user, res?.data?.data?.token)
      } else {
        setErrors(res?.data?.errors);
      }
    });
  };
  return (
    <div className="center-login">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={trans("email")}
          name={"email"}
          validateStatus={errors?.email && "error"}
          help={errors?.email}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={trans("password")}
          name={"password"}
          validateStatus={errors?.password && "error"}
          help={errors?.password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {trans("submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserLogin;
