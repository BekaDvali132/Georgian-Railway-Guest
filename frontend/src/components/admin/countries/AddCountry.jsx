import { Button, Form, Input, InputNumber, message, Space, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

function AddCountry() {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState([]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onFinish = (values) => {

    const formData = new FormData();
    Object.keys(values).map(key=>values?.[key] && formData.append(key, values?.[key]));
    fileList && values?.flag_image?.file ? formData.set('flag_image', values?.flag_image?.file) : formData.delete('flag_image')

    axios.post("/api/countries", formData).then((res) => {
      if (res?.data?.status === "success") {
        navigate("/admin/countries");
      } else {
        setErrors(res?.data?.errors);
      }
    });
  };

  const beforeImageUpload = (file) => {
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/svg" ||
      file.type === "image/svg+xml"
    ) {
      if (file.size / 1024 / 1024 < 0.5) {
        setFileList([{
          uid:'1',
          name:file?.name,
          status:'done',
          url: URL.createObjectURL(file)
        }]);
        getBase64(file, (url) => {
          setFile(url);
        });
      } else {
      message.error("სურათი უნდა იყოს 500kb ზომის");
      }
    } else {
      message.error("სურათ უნდა იყოს .jpeg, .jpg, .png ან .svg გაფართოების");
    }
    return false;
  }

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <ArrowLeftOutlined
        style={{ fontSize: "20px" }}
        onClick={() => navigate("/admin/countries")}
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
        name={'flag_image'}
        label={"ქვეყნის დროშა"}
        validateStatus={errors?.flag_image && "error"}
        help={errors?.flag_image}>
        <Upload
          listType="picture"
          beforeUpload={beforeImageUpload}
          fileList={fileList}
          onRemove={()=>setFileList(null)}
        >
          <Button icon={<UploadOutlined />}>აირჩიეთ სურათი</Button>
        </Upload>
        </Form.Item>
        <Form.Item
          name={"country_phone_code"}
          label="ქვეყნის სატელეფონო კოდი*"
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
