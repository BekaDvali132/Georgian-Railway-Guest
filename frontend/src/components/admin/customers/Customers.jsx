import { Button, message, Modal, Space, Table } from 'antd';
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../../hooks/translation/translations.json'

const physicalCustomerColumns = [
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
    title:translations['ka']['reset_password'],
    dataIndex:"reset_password",
    key:'reset_password'
  },
  {
    title: translations['ka']['delete'],
    dataIndex: "delete",
    key: "delete",
  }
];

const legalCustomerColumns = [
  {
    title: translations['ka']['country'],
    dataIndex: "country",
    key: "country",
  },
  {
    title: translations['ka']['identification_number'],
    dataIndex: "identification_number",
    key: "identification_number",
  },
  {
    title: translations['ka']['organization_type'],
    dataIndex: "organization_type",
    key: "organization_type",
  },
  {
    title: translations['ka']['organization_name'],
    dataIndex: "organization_name",
    key: "organization_name",
  },
  {
    title: translations['ka']['bank_account_number'],
    dataIndex: "bank_account_number",
    key: "bank_account_number",
  },
  {
    title: translations['ka']['legal_address'],
    dataIndex: "legal_address",
    key: "legal_address",
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
    title:translations['ka']['reset_password'],
    dataIndex:"reset_password",
    key:'reset_password'
  },
  {
    title: translations['ka']['delete'],
    dataIndex: "delete",
    key: "delete",
  }
];

function Customers() {
  const navigate = useNavigate();
  const [physicalCustomers, setPhysicalCustomers] = useState([]);
  const [legalCustomers, setLegalCustomers] = useState([]);
  const [organizationTypes, setOrganizationTypes] = useState(null);
  const [render, setRender] = useState(false)
  const [countries, setCoutries] = useState([])

  useEffect(()=>{
    axios.get('/api/customers').then(res=>{
      if(res?.data?.status === 'success'){
        setPhysicalCustomers(res?.data?.data?.physical_customers)
        setLegalCustomers(res?.data?.data?.legal_customers)
        setOrganizationTypes(res?.data?.data?.organization_types)
        setCoutries(res?.data?.data?.countries)
      }
    })

  },[render])

  const checkIfDelete = (id, name, isLegal) => {
    Modal.confirm({
      title: translations['ka']['delete_customer'],
      content: `თქვენ ნამდვილად გსურთ, რომ ${name} წაშალოთ?`,
      okText: translations['ka']['yes'],
      onOk: () => deleteCustomer(id, isLegal),
      cancelText: translations['ka']['no'],
    });
  };

  const deleteCustomer = (id,isLegal) => {
    message
      .loading(
        translations['ka']['customer_delete_in_progress'],
        axios.delete(`/api/customers/${isLegal ? 'legal' : 'physical'}/${id}`).then((res) => {
          if (res?.data.status === "success") {
            setRender(!render);
          }
        })
      )
      .then(() =>
        setTimeout(() => message.success(translations['ka']['customer_successfully_deleted']), 400)
      );
  };

  const resetPassword = (id, isLegal) => {
    message.loading(translations['ka']['reseting_password'])

    axios.post(`/api/customers/${id}/reset`, {legal:isLegal}).then(res=>{
      message.destroy()
      if (res?.data?.status === 'success') {
        message.success(translations['ka']['password_successfully_reseted'])
      } else {
        message.error(translations['ka']['password_not_reseted'])
      }
    }).catch(res=>{
      message.error(translations['ka']['password_not_reseted'])
    })
  }

  return (
      <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Button type="primary" onClick={()=>navigate('/admin/customers/add')}>{translations['ka']['add_customer']}</Button>
      <div className="overflow-table">
      <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
        <h2>{translations['ka']['physical_customers']}</h2>
      <Table
      dataSource={physicalCustomers?.map((customer) => {
        return {
          key: customer?.id,
          name: customer?.first_name,
          last_name: customer?.last_name,
          gender: customer?.gender === 1 ? 'მამრობითი' : 'მდედრობით',
          citizenship: countries?.find(country=> country.id === customer?.citizenship)?.name_ka,
          personal_number: customer?.personal_number,
          passport_number: customer?.passport_number,
          country_phone_code: customer?.country_phone_code,
          phone_number: customer?.phone_number,
          email: customer?.email,
          reset_password: <Button onClick={()=>resetPassword(customer.id,false)}> {translations['ka']['reset_password']}</Button>,
          delete: <Button
          type="danger"
          onClick={() => checkIfDelete(customer?.id, customer?.first_name, false)}
        >
          {translations['ka']['delete']}
        </Button>
        };
      })}
        columns={physicalCustomerColumns}
      />
      </Space>
      </div>
      <div className="overflow-table">
      <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
        <h2>{translations['ka']['legal_customers']}</h2>
      <Table
      dataSource={legalCustomers?.map((customer) => {
        return {
          key: customer?.id,
          country: countries?.find(country=> country.id === customer?.country)?.name_ka,
          identification_number: customer?.identification_number,
          organization_type: organizationTypes?.find(type=>type.id === customer?.organization_type_id)?.name_ka,
          organization_name: customer?.organization_name,
          bank_account_number: customer?.bank_account_number,
          legal_address: customer?.legal_address,
          country_phone_code: customer?.country_phone_code,
          phone_number: customer?.phone_number,
          email: customer?.email,
          reset_password: <Button onClick={()=>resetPassword(customer.id, true)}> {translations['ka']['reset_password']}</Button>,
          delete: <Button
          type="danger"
          onClick={() => checkIfDelete(customer?.id, customer?.organization_name, true)}
        >
          {translations['ka']['delete']}
        </Button>
        };
      })}
        columns={legalCustomerColumns}
      />
      </Space>
      </div>
    </Space>
  )
}

export default Customers