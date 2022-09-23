import { Button, Space, Table } from 'antd';
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../../hooks/translation/translations.json'

const columns = [
  {
    title: translations['ka']['name'],
    dataIndex: "name",
    key: "name",
  },
  {
    title: translations['ka']['last_name'],
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: translations['ka']['gender'],
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: translations['ka']['citizenship'],
    dataIndex: "citizenship",
    key: "citizenship",
  },
  {
    title: translations['ka']['personal_number'],
    dataIndex: "personal_number",
    key: "personal_number",
  },
  {
    title: translations['ka']['passport_number'],
    dataIndex: "passport_number",
    key: "passport_number",
  },
  {
    title: translations['ka']['country_phone_code'],
    dataIndex: "country_phone_code",
    key: "country_phone_code",
  },
  {
    title: translations['ka']['phone_number'],
    dataIndex: "phone_number",
    key: "phone_number",
  },
  {
    title: translations['ka']['email'],
    dataIndex: "email",
    key: "email",
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
  }
];

function Customers() {
  const navigate = useNavigate();
  const [physicalCustomers, setPhysicalCustomers] = useState([])

  useEffect(()=>{
    axios.get('/api/customers').then(res=>{
      if(res?.data?.status === 'success'){
        setPhysicalCustomers(res?.data?.data?.physical_customers)
      }
    })

  },[])
  return (
      <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={()=>navigate('/admin/customers/add')}>{translations['ka']['add_customer']}</Button>
      <div className="overflow-table">
      <Table
      dataSource={physicalCustomers?.map((customer) => {
        return {
          key: customer?.id,
          name: customer?.first_name,
          last_name: customer?.last_name,
          gender: customer?.gender === 1 ? 'მამრობითი' : 'მდედრობით',
          citizenship: customer?.citizenship,
          personal_number: customer?.personal_number,
          passport_number: customer?.passport_number,
          country_phone_code: customer?.country_phone_code,
          phone_number: customer?.phone_number,
          email: customer?.email,
          edit: <Button> {translations['ka']['edit']}</Button>,
          delete: <Button type='danger'>{translations['ka']['delete']}</Button>
        };
      })}
        columns={columns}
      />
      </div>
    </Space>
  )
}

export default Customers