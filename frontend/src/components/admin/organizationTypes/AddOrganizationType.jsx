import { Button, Form, Input, Space } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import translations from '../../hooks/translation/translations.json'
import axios from "axios";
function AddOrganizationType() {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const onFinish = (values) => {
    axios.post('/api/organization-types',values).then(res=>{
        if (res?.data?.status === 'success') {
            navigate('/admin/organization-types')
        } else {
            setErrors(res?.data?.errors)
        }
    })
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <ArrowLeftOutlined
        style={{ fontSize: "20px" }}
        onClick={() => navigate("/admin/countries")}
      />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label={translations["ka"]["organization_name"] + "*"}
          name={"name_ka"}
          validateStatus={errors?.name_ka && "error"}
          help={errors?.name_ka}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translations["ka"]["organization_name_en"] + "*"}
          name={"name_en"}
          validateStatus={errors?.name_en && "error"}
          help={errors?.name_en}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translations["ka"]["organization_name_ru"] + "*"}
          name={"name_ru"}
          validateStatus={errors?.name_ru && "error"}
          help={errors?.name_ru}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translations['ka']['submit']}
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}

export default AddOrganizationType;
