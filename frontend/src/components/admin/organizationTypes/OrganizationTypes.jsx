import { Button, message, Modal, Space, Table } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translations from "../../hooks/translation/translations.json";
import axios from "axios";
const columns = [
  {
    title: translations["ka"]["name"],
    dataIndex: "name_ka",
    key: "name_ka",
  },
  {
    title: translations["ka"]["name_en"],
    dataIndex: "name_en",
    key: "name_en",
  },
  {
    title: translations["ka"]["name_ru"],
    dataIndex: "name_ru",
    key: "name_ru",
  },
  {
    title: translations["ka"]["edit"],
    dataIndex: "edit",
    key: "edit",
  },
  {
    title: translations["ka"]["delete"],
    dataIndex: "delete",
    key: "delete",
  }
];

function OrganizationTypes() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [render, setRender] = useState(false)

  useEffect(() => {
    axios.get("/api/organization-types").then((res) => {
      if (res.data?.status === "success") {
        setData(res?.data?.data?.organization_types);
      }
    });
  }, [render]);

  const checkIfDelete = (id, name) => {
    Modal.confirm({
      title: translations["ka"]["delete_customer"],
      content: `თქვენ ნამდვილად გსურთ, რომ ${name} წაშალოთ?`,
      okText: translations["ka"]["yes"],
      onOk: () => deleteType(id),
      cancelText: translations["ka"]["no"],
    });
  };

  const deleteType = (id) => {
    message
      .loading(
        translations["ka"]["customer_delete_in_progress"],
        axios
          .delete(`/api/organization-types/${id}`)
          .then((res) => {
            if (res?.data.status === "success") {
              setRender(!render);
            }
          })
      )
      .then(() =>
        setTimeout(
          () =>
            message.success(
              translations["ka"]["customer_successfully_deleted"]
            ),
          400
        )
      );
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={() => navigate("/admin/customers/add")}>
        {translations["ka"]["add_organization_type"]}
      </Button>
      <div className="overflow-table">
        <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
          <Table
            dataSource={data?.map((type) => {
              return {
                key: type.id,
                name_ka: type?.name_ka,
                name_en: type?.name_en,
                name_ru: type?.name_ru,
                edit: (
                  <Button
                    onClick={() =>
                      navigate(`/admin/organization-types/${type.id}/edit`)
                    }
                  >
                    {" "}
                    {translations["ka"]["edit"]}
                  </Button>
                ),
                delete: (
                  <Button
                    type="danger"
                    onClick={() => checkIfDelete(type?.id, type?.name_ka)}
                  >
                    {translations["ka"]["delete"]}
                  </Button>
                ),
              };
            })}
            columns={columns}
          />
        </Space>
      </div>
    </Space>
  );
}

export default OrganizationTypes;
