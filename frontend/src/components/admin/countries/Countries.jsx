import { Button, message, Modal, Space, Table } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "ქვეყნის დროშა",
    dataIndex: "flag_image_path",
    key: "flag_image_path",
  },
  {
    title: "ქვეყნის დასახელება ქართულად",
    dataIndex: "name_ka",
    key: "name_ka",
  },
  {
    title: "ქვეყნის დასახელება ინგლისურად",
    dataIndex: "name_en",
    key: "name_en",
  },
  {
    title: "ქვეყნის დასახელება რუსულად",
    dataIndex: "name_ru",
    key: "name_ru",
  },
  {
    title: "ქვეყნის სატელეფონო კოდი",
    dataIndex: "country_phone_code",
    key: "country_phone_code",
  },
  {
    title: "რედაქტირება",
    dataIndex: "edit",
    key: "edit",
  },
  {
    title: "წაშლა",
    dataIndex: "delete",
    key: "delete",
  },
];

function Countries() {
  const [countries, setCountries] = useState();
  const [render, setRender] = useState();
  let navigate = useNavigate();
  const basepath = process.env.BASE_PATH || 'http://localhost:5000/';

  useEffect(() => {
    axios.get("/api/countries", { params: {} }).then((res) => {
      if (res.data?.status === "success") {
        setCountries(res?.data.data);
      }
    });
  }, [!render]);

  const checkIfDelete = (id, name) => {
    Modal.confirm({
      title: "ქვეყნის წაშლა",
      content: `თქვენ ნამდვილად გსურთ, რომ ${name} წაშალოთ?`,
      okText: "დიახ",
      onOk: () => deleteCountry(id),
      cancelText: "არა",
    });
  };

  const deleteCountry = (id) => {
    message
      .loading(
        "მიმდინარეობს ქვეყნის წაშლა",
        axios.delete(`/api/countries/${id}`).then((res) => {
          if (res?.data.status === "success") {
            setRender(!render);
          }
        })
      )
      .then(() =>
        setTimeout(() => message.success("ქვეყანა წარმატებით წაიშალა"), 400)
      );
  };

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={()=>navigate('/countries/add')}>ქვეყნის დამატება</Button>
      <Table
        dataSource={countries?.map((country) => {
          return {
            key: country.id,
            flag_image_path: <img src={`${basepath}${country?.flag_image_path}`} width={50} height={50} style={{objectFit:'contain'}}/>,
            name_ka: country?.name_ka,
            name_en: country?.name_en,
            name_ru: country?.name_ru,
            country_phone_code: country?.country_phone_code,
            edit: <Button onClick={()=>navigate(`/countries/${country?.id}/edit`)}>რედაქტირება</Button>,
            delete: (
              <Button
                type="danger"
                onClick={() => checkIfDelete(country?.id, country?.name_ka)}
              >
                წაშლა
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
