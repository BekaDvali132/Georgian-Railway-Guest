import { Button, Form, Input, InputNumber, message, Space, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

function EditCountry() {
  const {id} = useParams();
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState([]);
  const basepath = process.env.BASE_PATH || 'http://localhost:5000/';

  useEffect(()=>{
    axios.get(`/api/countries/${id}`).then(res=>{
      if (res?.data?.status === 'success') {        
        form.setFieldsValue(res?.data?.data[0])
        setFileList([{
          uid:'-1',
          name: res.data.data?.[0]?.name_ka,
          url: `${basepath}${res.data.data?.[0]?.flag_image_path}`
        }])
      }
    })
  },[])


  const onFinish = (values) => {
    const formData = new FormData();
    Object.keys(values).map(key=>values?.[key] && formData.append(key, values?.[key]));
    if (fileList && values?.flag_image?.file) {
      formData.set('flag_image', values?.flag_image?.file) 
    } else {
      formData.delete('flag_image');
      fileList && formData.append('flag_image_path', fileList?.[0]?.url?.replace(basepath,''))
    }

    axios.put(`/api/countries/${id}`, formData).then((res) => {
      if (res?.data?.status === "success") {
        navigate("/countries");
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
      } else {
      message.error("სურათი უნდა იყოს 500kb ზომის");
      }
    } else {
      message.error("სურათ უნდა იყოს .jpeg, .jpg, .png ან .svg გაფართოების");
    }
    return false;
  }
console.log(file?.[0]?.url);
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

export default EditCountry;
