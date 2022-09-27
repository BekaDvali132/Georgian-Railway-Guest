import { Button, Space, Table } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import translations from '../../hooks/translation/translations.json'
const columns = [
    {
      title: translations['ka']['ნამე'],
      dataIndex: "name_ka",
      key: "name_ka",
    },
    {
      title: translations['ka']['name_en'],
      dataIndex: "name_en",
      key: "name_en",
    },
    {
      title: translations['ka']['name_ru'],
      dataIndex: "name_ru",
      key: "name_ru",
    },
  ];

function OrganizationTypes() {
    const navigate = useNavigate();

    

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={() => navigate("/admin/customers/add")}>
        {translations["ka"]["add_organization_type"]}
      </Button>
      <div className="overflow-table">
        <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
          <Table
            
            columns={columns}
          />
        </Space>
      </div>
    </Space>
  );
}

export default OrganizationTypes;
