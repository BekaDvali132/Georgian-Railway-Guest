import { Button, Form, Input, InputNumber, Modal, Select, Space } from "antd";
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
  const [isGeorgian, setIsGeorgian] = useState(false);
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
      values.verification = isVerified === true ? isVerified : null;
      values.recaptcha = recaptchaRef.current.getValue();
      axios.post("/api/customers/physical", values).then((res) => {
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

      <Form.Item
        label={translations["ka"]["name"] + "*"}
        name={"first_name"}
        validateStatus={errors?.first_name && "error"}
        help={errors?.first_name}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translations["ka"]["last_name"] + "*"}
        name={"last_name"}
        validateStatus={errors?.last_name && "error"}
        help={errors?.last_name}
      >
        <Input />
      </Form.Item>

      {formOptions && (
        <>
          <Form.Item
            label={translations["ka"]["gender"] + "*"}
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
            label={translations["ka"]["citizenship"] + "*"}
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

      {isGeorgian ? (
        <FormatedNumberInput
          form={form}
          label={translations["ka"]["personal_number"] + "*"}
          name={"personal_number"}
          errorMessage={errors?.personal_number}
        />
      ) : (
        <Form.Item
          label={translations["ka"]["passport_number"] + "*"}
          name={"passport_number"}
          validateStatus={errors?.["passport_number"] && "error"}
          help={errors?.["passport_number"]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        label={translations["ka"]["country_phone_code"] + "*"}
        name={"country_phone_code"}
        initialValue={
          formOptions?.countries?.find(
            (country) => country?.name_ka === "საქართველო"
          )?.id || ""
        }
        validateStatus={errors?.country_phone_code && "error"}
        help={errors?.country_phone_code}
      >
        <Select
          placeholder={translations["ka"]["country_phone_code"]}
          allowClear
        >
          {formOptions?.countries?.map((country) => (
            <Option key={country?.id} value={country?.id}>
              {country?.country_phone_code}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <FormatedNumberInput
        form={form}
        controls={false}
        type="number"
        label={translations["ka"]["phone_number"] + "*"}
        name={"phone_number"}
        errorMessage={errors?.phone_number}
      />

      <Form.Item
        label={translations["ka"]["email"] + "*"}
        name={"email"}
        validateStatus={errors?.email && "error"}
        help={errors?.email}
      >
        <Input onChange={() => setIsVerified(false)} />
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
        <Form.Item
          label={translations["ka"]["verification_method"] + "*"}
          name={"verification_method"}
          initialValue={"1"}
          validateStatus={errors?.verification && "error"}
          help={errors?.verification}
        >
          <Select
            placeholder={translations["ka"]["verification_method"]}
            onChange={() => setIsVerified(false)}
          >
            {formOptions &&
              Object.keys(formOptions?.verifications)?.map((key) => (
                <Option key={key} value={key}>
                  {formOptions?.verifications[key]}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Button
          type="link"
          htmlType="button"
          disabled={isVerified}
          onClick={() => {
            sendCode(form.getFieldValue("verification_method"));
          }}
          loading={verifyCount > 0}
        >
          {verifyCount > 0 && verifyCount} {translations["ka"]["send_code"]}
        </Button>
      </Space>
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
