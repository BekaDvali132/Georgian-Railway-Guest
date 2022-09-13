import { Button, Form, Input, InputNumber, Space, Tabs, Upload } from "antd";
import { UploadOutlined,ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const items = new Array(3).fill(null).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of Tab Pane ${id}`,
    style:
      i === 0
        ? {
            height: 200,
          }
        : undefined,
  };
});

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

function AddCountry() {
  const [form] = Form.useForm();
  let navigate = useNavigate();

  const imageSet = ({ file, onSuccess }) => {
    form.setFieldValue("flag_image", file);
    onSuccess("ok");
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <ArrowLeftOutlined
        style={{ fontSize: "20px" }}
        onClick={() => navigate("/countries")}
      />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `ქართული`,
              key: "1",
              children: (
                <Form.Item label="სახელი" name={"name_ka"}>
                  <Input placeholder="შეიყვანე ქვეყნის სახელი" />
                </Form.Item>
              ),
            },
            {
              label: `ინგლისური`,
              key: "2",
              children: (
                <Form.Item label="სახელი" name={"name_en"}>
                  <Input placeholder="შეიყვანე ქვეყნის სახელი" />
                </Form.Item>
              ),
            },
            {
              label: `რუსული`,
              key: "3",
              children: (
                <Form.Item label="სახელი" name={"name_ru"}>
                  <Input placeholder="შეიყვანე ქვეყნის სახელი" />
                </Form.Item>
              ),
            },
          ]}
        />
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" listType="picture" customRequest={imageSet}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name={"country_phone_code"} label="ქვეყნის სატელეფონო კოდი">
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
