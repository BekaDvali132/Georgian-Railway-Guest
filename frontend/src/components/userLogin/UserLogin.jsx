import { Button, Form, Input, message, Modal, Radio } from "antd";
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
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const userContext = useContext(UserContext)
  const [form] = Form.useForm()
  const [codeStep, setCodeStep] = useState(false);

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

  const restorePassword = (values) => {

    axios.post('/api/customers/send-recovery', values).then((res) => {

      if (res.data.status==='success') {
        setShow(false)
        message.success(`პაროლის აღდგენა გამოიგზავნა ${values.email}-ზე`)
        setError(null)
        form.resetFields()
      } else {
        setError(res.data.errors)
      }

    })

  };

  return (
    <div className="center-login">
      <Modal
        title={trans('password_recovery')}
        visible={show}
        okText={trans('send')}
        cancelText={trans('cancel')}
        onCancel={() => {setShow(false);setCodeStep(false)}}
        onOk={form.submit}
      >
        <Form layout={"vertical"} form={form} onFinish={restorePassword} preserve>
          <Form.Item
            label={"ელ.ფოსტა"}
            name={"email"}
            validateStatus={error?.['email'] ? `error` : ""}
            rules={[
              {
                required: false,
              },
            ]}
            help={error?.['email']}
          >
            <Input
              placeholder={`შეიყვანეთ თქვენი ელ.ფოსტა`}
            />
          </Form.Item>
          <Form.Item
            name={"type"}
            validateStatus={error?.['type'] ? `error` : ""}
            help={error?.['type']}
            initialValue={'physical_customers'}
          >
            <Radio.Group>
              <Radio value={'physical_customers'}>{trans('physical_customers')}</Radio>
              <Radio value={'legal_customers'}>{trans('legal_customers')}</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
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
          <Button  type="link" htmlType="button" onClick={()=>setShow(true)}>
            {trans('forgot_password')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserLogin;
