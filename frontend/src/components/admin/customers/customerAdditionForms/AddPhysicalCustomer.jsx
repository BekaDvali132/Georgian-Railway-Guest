import { Button, Form, Input, InputNumber, Select } from "antd";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import translations from "../../../hooks/translation/translations.json";

const { Option } = Select;

function AddPhysicalCustomer() {
  const [formOptions, setFormOptions] = useState(null);
  const [form] = Form.useForm();
  const [isGeorgian, setIsGeorgian] = useState(false);
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const getFormOptions = () => {
    axios.get("/api/customers/form").then((res) => {
      if (res.data?.status === "success") {
        setFormOptions(res?.data?.data);
        res?.data?.data?.countries?.find(
          (country) => country.name_ka === "საქართველო"
        )?.id && setIsGeorgian(true);
      }
    });
  };

  useEffect(() => getFormOptions(), []);

  const checkIfGeorgia = (value) => {
    if (
      formOptions?.countries?.find((country) => country?.id === value)
        ?.name_ka === "საქართველო"
    ) {
      setIsGeorgian(true);
    } else {
      setIsGeorgian(false);
    }
  };

  const onFinish = (values) => {
    setIsLoading(true);
    axios.post("/api/customers/physical", values).then((res) => {
      if (res?.data?.status === "success") {
        navigate('/admin/customers')
      } else {
        setErrors(res?.data?.errors);
      }
      setIsLoading(false);
    });
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label={translations["ka"]["name"] + '*'}
        name={"first_name"}
        validateStatus={errors?.first_name && "error"}
        help={errors?.first_name}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["last_name"] + '*'}
        name={"last_name"}
        validateStatus={errors?.last_name && "error"}
        help={errors?.last_name}
      >
        <Input />
      </Form.Item>

      {formOptions && (
        <>
          <Form.Item
            label={translations["ka"]["gender"] + '*'}
            name={"gender"}
            validateStatus={errors?.gender && "error"}
            help={errors?.gender}
          >
            <Select placeholder={translations["ka"]["gender"]} allowClear>
              {formOptions &&
                Object.keys(formOptions?.genders)?.map((key) => (
                  <Option key={key} value={key}>
                    {formOptions?.genders[key]}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={translations["ka"]["citizenship"] + '*'}
            name={"citizenship"}
            initialValue={
              formOptions?.countries?.find(
                (country) => country?.name_ka === "საქართველო"
              )?.id || ""
            }
            validateStatus={errors?.citizenship && "error"}
            help={errors?.citizenship}
          >
            <Select
              placeholder={translations["ka"]["citizenship"]}
              allowClear
              onChange={(value) => checkIfGeorgia(value)}
            >
              {formOptions?.countries?.map((country) => (
                <Option key={country?.id} value={country?.id}>
                  {country?.name_ka}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item
        label={
          translations["ka"][isGeorgian ? "personal_number" : "passport_number"] + '*'
        }
        name={isGeorgian ? "personal_number" : "passport_number"}
        validateStatus={
          errors?.[isGeorgian ? "personal_number" : "passport_number"] &&
          "error"
        }
        help={errors?.[isGeorgian ? "personal_number" : "passport_number"]}
      >
        {isGeorgian ? (
          <InputNumber controls={false} type="number" />
        ) : (
          <Input />
        )}
      </Form.Item>

      <Form.Item
        label={translations["ka"]["country_phone_code"] + '*'}
        name={"country_phone_code"}
        validateStatus={errors?.country_phone_code && "error"}
        help={errors?.country_phone_code}
      >
        <InputNumber controls={false} type="number" />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["phone_number"] + '*'}
        name={"phone_number"}
        validateStatus={errors?.phone_number && "error"}
        help={errors?.phone_number}
      >
        <InputNumber controls={false} type="number" />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["email"] + '*'}
        name={"email"}
        validateStatus={errors?.email && "error"}
        help={errors?.email}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["password"] + '*'}
        name={"password"}
        validateStatus={errors?.password && "error"}
        help={errors?.password}
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {translations["ka"]["submit"]}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddPhysicalCustomer;
