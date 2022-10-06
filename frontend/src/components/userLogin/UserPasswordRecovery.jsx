import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import "./UserLogin.scss";
import useTranslation from "../hooks/translation/useTranslation";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UserPasswordRecovery() {

  const { trans } = useTranslation();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {code} = useParams()
  const navigate = useNavigate()

  useEffect(()=>checkValidity(),[])

  const checkValidity = () => {
    axios.get('/api/customers/recover-password/check', {params:{code:code}}).then(res=>{
      if (res?.data?.status !== 'success') {
        Modal.error({
          title:trans('password_recover_not_exist'),
          onOk:navigate('/login')
        })
      }

    })
  }

  const onFinish = (values) => {
    setIsLoading(true);

    axios.post(`/api/customers/recover-password/${code}`, values).then(res=>{
      setIsLoading(false);

      if (res?.data?.status === 'success') {
        Modal.success({
          title:trans('password_recover_success'),
          onOk:navigate('/login')
        })
      } else {
        setErrors(res?.data?.errors)
      }

    })
  };

  return (
    <div className="center-login">
      
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={trans("password")}
          name={"password"}
          validateStatus={errors?.password && "error"}
          help={errors?.password}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={trans("repeat_password")}
          name={"repeat_password"}
          validateStatus={errors?.repeat_password && "error"}
          help={errors?.repeat_password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item help={errors?.message} validateStatus={errors?.message && "error"}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {trans("submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserPasswordRecovery