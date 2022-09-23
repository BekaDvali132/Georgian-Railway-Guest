import { Space, Tabs } from "antd";
import React from "react";
import AddLegalCustomer from "./customerAdditionForms/AddLegalCustomer";
import AddPhysicalCustomer from "./customerAdditionForms/AddPhysicalCustomer";
import {ArrowLeftOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function AddCustomers() {
  const navigate = useNavigate();

  return (
    <Space size={'large'} direction='vertical' style={{width:'100%'}}>
      <ArrowLeftOutlined style={{fontSize:'20px'}} onClick={()=>navigate('/admin/customers')}/>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `ფიზიკური პირი`,
            key: "1",
            children: <AddPhysicalCustomer/>,
          },
          {
            label: `იურიდიული პირი`,
            key: "2",
            children: <AddLegalCustomer/>,
          },
        ]}
      />
    </Space>
  );
}

export default AddCustomers;
