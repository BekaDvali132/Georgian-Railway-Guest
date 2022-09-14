import { Button, Form, Input, InputNumber, message, Space, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function AddCountry() {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [img, setImg] = useState();
  const [errors, setErrors] = useState({});

  const onFinish = (values) => {
    values.flag_image_path = img;
    delete values.upload;

    axios.post("/api/countries", values).then((res) => {
      if (res?.data?.status === "success") {
        navigate("/countries");
      } else {
        setErrors(res?.data?.errors);
      }
    });
  };

  const removeImage = () => {
    axios.delete(`/api/images`, { params: { image_path: img } }).then((res) => {
      if (res?.data?.status === "success") {
        setImg(null);
      }
    });
  };

  const beforeUpload = (file) => {
    if (img) {
      removeImage();
    }
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/svg" ||
      file.type === "image/svg+xml"
    ) {
      if (file.size / 1024 / 1024 < 0.5) {
        return true;
      }
      message.error("სურათი უნდა იყოს 500kb ზომის");
      return false;
    } else {
      message.error("სურათ უნდა იყოს .jpeg, .jpg, .png ან .svg გაფართოების");
      return false;
    }
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <ArrowLeftOutlined
        style={{ fontSize: "20px" }}
        onClick={() => navigate("/countries")}
      />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="ქვეყნის დასახელება ქართულად*"
          name={"name_ka"}
          validateStatus={errors?.name_ka && "error"}
          help={errors?.name_ka}
        >
          <Input placeholder="შეიყვანე ქვეყნის დასახელება" />
        </Form.Item>
        <Form.Item
          label="ქვეყნის დასახელება ინგლისურად*"
          name={"name_en"}
          validateStatus={errors?.name_en && "error"}
          help={errors?.name_en}
        >
          <Input placeholder="შეიყვანე ქვეყნის დასახელება" />
        </Form.Item>
        <Form.Item
          label="ქვეყნის დასახელება რუსულად*"
          name={"name_ru"}
          validateStatus={errors?.name_ru && "error"}
          help={errors?.name_ru}
        >
          <Input placeholder="შეიყვანე ქვეყნის დასახელება" />
        </Form.Item>
        <Form.Item
          label="ქვეყნის დასახელება რუსულად*"
          name={"flag_image_path"}
          validateStatus={errors?.flag_image_path && "error"}
          help={errors?.flag_image_path}
        >
          <Upload
            name="image"
            action={"/api/images"}
            listType={"picture"}
            maxCount={1}
            onRemove={removeImage}
            onChange={(e) => setImg(e?.file?.response?.image_path)}
            beforeUpload={beforeUpload}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name={"country_phone_code"}
          label="ქვეყნის დროშა"
          validateStatus={errors?.country_phone_code && "error"}
          help={errors?.country_phone_code}
        >
          <InputNumber
            placeholder="შეიყვანე ქვეყნის სატელეფონო კოდი"
            type="number"
            controls={"none"}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            შენახვა
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}

export default AddCountry;
