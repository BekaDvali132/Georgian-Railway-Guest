import { Button, message, Modal, Space, Table } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTranslation from "../../hooks/translation/useTranslation";
import translations from '../../hooks/translation/translations.json'

function Countries() {
  const [countries, setCountries] = useState();
  const [render, setRender] = useState();
  let navigate = useNavigate();
  const basepath = process.env.BASE_PATH || 'http://localhost:5000/';
  const {trans} = useTranslation();

  const columns = [
    {
      title: translations['ka']['country_flag'],
      dataIndex: "flag_image_path",
      key: "flag_image_path",
    },
    {
      title: translations['ka']['country_name_geo'],
      dataIndex: "name_ka",
      key: "name_ka",
    },
    {
      title: translations['ka']['country_name_en'],
      dataIndex: "name_en",
      key: "name_en",
    },
    {
      title: translations['ka']['country_name_ru'],
      dataIndex: "name_ru",
      key: "name_ru",
    },
    {
      title: translations['ka']['country_phone_code'],
      dataIndex: "country_phone_code",
      key: "country_phone_code",
    },
    {
      title: translations['ka']['edit'],
      dataIndex: "edit",
      key: "edit",
    },
    {
      title: translations['ka']['delete'],
      dataIndex: "delete",
      key: "delete",
    },
  ];

  useEffect(() => {
    axios.get("/api/countries", { params: {} }).then((res) => {
      if (res.data?.status === "success") {
        setCountries(res?.data.data);
      }
    });
  }, [!render]);

  const checkIfDelete = (id, name) => {
    Modal.confirm({
      title: translations['ka']['delete_country'],
      content: `თქვენ ნამდვილად გსურთ, რომ ${name} წაშალოთ?`,
      okText: translations['ka']['yes'],
      onOk: () => deleteCountry(id),
      cancelText: translations['ka']['no'],
    });
  };

  const deleteCountry = (id) => {
    message
      .loading(
        translations['ka']['country_delete_in_progress'],
        axios.delete(`/api/countries/${id}`).then((res) => {
          if (res?.data.status === "success") {
            setRender(!render);
          }
        })
      )
      .then(() =>
        setTimeout(() => message.success(translations['ka']['country_successfully_deleted']), 400)
      );
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={()=>navigate('/admin/countries/add')}>{translations['ka']['add_country']}</Button>
      <Table
        dataSource={countries?.map((country) => {
          return {
            key: country.id,
            flag_image_path: <img src={`${basepath}${country?.flag_image_path}`} width={50} height={50} style={{objectFit:'contain'}}/>,
            name_ka: country?.name_ka,
            name_en: country?.name_en,
            name_ru: country?.name_ru,
            country_phone_code: country?.country_phone_code,
            edit: <Button onClick={()=>navigate(`/admin/countries/${country?.id}/edit`)}>{translations['ka']['edit']}</Button>,
            delete: (
              <Button
                type="danger"
                onClick={() => checkIfDelete(country?.id, country?.name_ka)}
              >
                {translations['ka']['delete']}
              </Button>
            ),
          };
        })}
        columns={columns}
      />
    </Space>
  );
}

export default Countries;
