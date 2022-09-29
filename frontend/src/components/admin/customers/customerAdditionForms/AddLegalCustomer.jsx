import { Button, Form, Input, Modal, Select, Space } from "antd";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import translations from "../../../hooks/translation/translations.json";
import FormatedNumberInput from "../../../inputs/FormatedNumberInput";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
const { Option } = Select;

function AddPhysicalCustomer() {
  const [formOptions, setFormOptions] = useState(null);
  const [form] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [verifyCount, setVerifyCount] = useState(0);
  const recaptchaRef = useRef();

  const getFormOptions = () => {
    axios.get("/api/customers/form").then((res) => {
      if (res.data?.status === "success") {
        setFormOptions(res?.data?.data);
      }
    });
  };

  useEffect(() => getFormOptions(), []);

  const onFinish = (values) => {
      setIsLoading(true);
      values.verification = isVerified === true ? isVerified : null;
      values.recaptcha = recaptchaRef.current.getValue();

      axios.post("/api/customers/legal", values).then((res) => {
        if (res?.data?.status === "success") {
          navigate("/admin/customers");
        } else {
          setErrors(res?.data?.errors);
        }
        setIsLoading(false);
      });
  };

  const sendCode = (method) => {
    if (method == 1) {
      axios
        .post("/api/verify/email", { email: form.getFieldValue("email") })
        .then((res) => {
          if (res?.data.status == "success") {
            setVerifyCount(30);
            setOpen(true);
          } else {
            setErrors(res?.data?.errors);
          }
        });
    } else {
    }
  };

  useEffect(() => {
    verifyCount > 0 && setTimeout(() => setVerifyCount(verifyCount - 1), 1000);
  }, [verifyCount]);

  const submitCode = () => {
    axios
      .post("/api/verify/check-email", {
        email: form.getFieldValue("email"),
        code: verifyForm.getFieldValue("code"),
      })
      .then((res) => {
        if (res?.data?.status === "success") {
          setOpen(false);
          setIsVerified(true);
          setVerifyCount(0);
          setErrors(null);
          verifyForm.resetFields();
        } else {
          setErrors(res?.data?.errors);
        }
      });
  };

  const sendSmsCode = () => {};

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Modal
        open={open}
        title={translations["ka"]["verify"]}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <Form onFinish={submitCode} form={verifyForm}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={translations["ka"]["input_verification_code"]}
              name={"code"}
              validateStatus={errors?.code && "error"}
              help={errors?.code}
            >
              <Input />
            </Form.Item>
            <Space style={{ justifyContent: "end", width: "100%" }}>
              <Button
                type="link"
                htmlType="button"
                disabled={isVerified}
                loading={verifyCount > 0}
                onClick={() =>
                  sendCode(form.getFieldValue("verification_method"))
                }
              >
                {verifyCount > 0 && verifyCount}{" "}
                {translations["ka"]["send_code_again"]}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isVerified}
                style={{ marginLeft: "auto" }}
              >
                {translations["ka"]["confirm"]}
              </Button>
            </Space>
          </Space>
        </Form>
      </Modal>

      {formOptions && (
        <Form.Item
          label={translations["ka"]["country"] + "*"}
          name={"country"}
          initialValue={
            formOptions?.countries?.find(
              (country) => country?.name_ka === "საქართველო"
            )?.id || ""
          }
          validateStatus={errors?.citizenship && "error"}
          help={errors?.citizenship}
        >
          <Select placeholder={translations["ka"]["country"]} allowClear>
            {formOptions?.countries?.map((country) => (
              <Option key={country?.id} value={country?.id}>
                {country?.name_ka}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        label={translations["ka"]["identification_number"]}
        name={"identification_number"}
        validateStatus={errors?.identification_number && "error"}
        help={errors?.identification_number}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["organization_type"] + "*"}
        name={"organization_type"}
        validateStatus={errors?.organization_type && "error"}
        help={errors?.organization_type}
      >
        <Select
          placeholder={translations["ka"]["organization_type"]}
          allowClear
        >
          {formOptions?.organization_types?.map((organizationType) => (
            <Option key={organizationType?.id} value={organizationType?.id}>
              {organizationType?.name_ka}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={translations["ka"]["organization_name"] + "*"}
        name={"organization_name"}
        validateStatus={errors?.organization_name && "error"}
        help={errors?.organization_name}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["bank_account_number"] + "*"}
        name={"bank_account_number"}
        validateStatus={errors?.bank_account_number && "error"}
        help={errors?.bank_account_number}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["legal_address"] + "*"}
        name={"legal_address"}
        validateStatus={errors?.legal_address && "error"}
        help={errors?.legal_address}
      >
        <Input />
      </Form.Item>

      <Space>
        <FormatedNumberInput
          form={form}
          style={{ width: "300px" }}
          name={"phone_number"}
          label={translations["ka"]["phone_number"] + "*"}
          errorMessage={errors?.phone_number}
        />
        <Button
          type="link"
          htmlType="button"
          onClick={() => {
            sendSmsCode();
          }}
        >
          {translations["ka"]["send_code"]}
        </Button>
      </Space>

      <Form.Item
        label={translations["ka"]["email"] + "*"}
        name={"email"}
        validateStatus={(errors?.email || errors?.verification) && "error"}
        help={errors?.email || errors?.verification}
      >
        <Space>
          <Input
            onChange={() => setIsVerified(false)}
            style={{ width: "300px" }}
          />
          <Button
            type="link"
            htmlType="button"
            disabled={isVerified}
            onClick={() => {
              sendCode(1);
            }}
            loading={verifyCount > 0}
          >
            {verifyCount > 0 && verifyCount} {translations["ka"]["send_code"]}
          </Button>
        </Space>
      </Form.Item>

      <Form.Item
        label={translations["ka"]["password"] + "*"}
        name={"password"}
        validateStatus={errors?.password && "error"}
        help={errors?.password}
      >
        <Input type="password" />
      </Form.Item>

      <Space>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {translations["ka"]["submit"]}
          </Button>
        </Form.Item>
        <Form.Item
          validateStatus={errors?.recaptcha && "error"}
          help={errors?.recaptcha}
        >
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={
              process.env.PUBLIC_RECAPTCHA_SITE_KEY ||
              "6LeIojYiAAAAAMAmM_nOKKYYH4zgeQFdPzz0xxNJ"
            }
          />
        </Form.Item>
      </Space>
    </Form>
  );
}

export default AddPhysicalCustomer;
