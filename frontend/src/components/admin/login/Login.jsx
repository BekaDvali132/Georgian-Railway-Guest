import { Button, Form, Input } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import "./Login.scss";
import translations from '../../hooks/translation/translations.json';

function Login() {
  const adminContext = useContext(AdminContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values) => {
    setIsLoading(true);
    axios
      .post("/api/users/login", values)
      .then((res) => {
        setIsLoading(false);
        if (res?.data?.status === "success") {
          setErrors(null);
          adminContext.setUser(res?.data?.data?.user, res?.data?.data?.token);
          navigate("/admin");
        } else {
          setErrors(res?.data?.errors);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors(error?.response?.data?.errors);
        setIsLoading(false);
      });
  };

  const checkLogin = () => {
    if (localStorage.getItem("accessToken")) {
      axios
        .get("/api/users/me", {
          headers: {
            Authorization:
              "Bearer " + JSON?.parse(localStorage.getItem("accessToken")),
          },
        })
        .then((res) => {
          if (res?.data?.status === "success") {
            adminContext.setUser(
              res?.data?.user,
              res?.data?.token
            );

            navigate("/admin/");
          } else {
            adminContext?.resetUser();
            navigate('/admin/login')
          }
        });
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div className="login-page">
      <Form
        layout="vertical"
        className={`login ${errors && "error"}`}
        onFinish={handleFinish}
      >
        <Form.Item
          label={translations['ka']['username']}
          name={"username"}
          validateStatus={errors?.username && "error"}
          help={errors?.username}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translations['ka']['password']}
          name={"password"}
          validateStatus={errors?.password && "error"}
          help={errors?.password}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {translations['ka']['submit']}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
