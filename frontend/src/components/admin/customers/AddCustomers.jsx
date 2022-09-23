import { Tabs } from "antd";
import React from "react";
import AddLegalCustomer from "./customerAdditionForms/AddLegalCustomer";
import AddPhysicalCustomer from "./customerAdditionForms/AddPhysicalCustomer";

function AddCustomers() {
  return (
    <div>
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
    </div>
  );
}

export default AddCustomers;
