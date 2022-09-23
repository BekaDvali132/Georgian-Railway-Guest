import { Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FlagOutlined,
  LogoutOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import React, { useContext, useState } from "react";
import './AdminRoute.scss'
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import translations  from "../../hooks/translation/translations.json";

const { Header, Sider, Content } = Layout;

function AdminRoute() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState();
  let navigate = useNavigate();
  const adminContext = useContext(AdminContext)

  axios.interceptors.request.use(function (req){
    if(localStorage.getItem('accessToken')) {
      req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`;
  }
  return req;
  })

  const getMe = () => {
    if (localStorage.getItem('accessToken')) {
      axios.get('/api/users/me').then((res)=>{

        if (res?.data?.status === 'success') {
          adminContext.setUser(res?.data?.user, res?.data?.token)
        }
  
      })
    }else{
      adminContext.resetUser()
      navigate('/admin/login')
    }
    
  }

  axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    
    return response;
  },function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error);
    if(error.response?.status === 401){
      adminContext.resetUser()
      navigate('/admin/login')
    }
  })

  useEffect(()=>{
    getMe()
  },[])


  return (
    <Layout>
      <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: "1",
              icon: <FlagOutlined />,
              label: translations['ka']?.['countries'],
              onClick: ()=>(navigate('/admin/countries'),setActiveKey(1))
              
            },
            {
              key: "2",
              icon: <UsergroupAddOutlined />,
              label: translations['ka']?.['customers'],
              onClick: ()=>(navigate('/admin/customers'),setActiveKey(1))
              
            },
            {
              key: "3",
              icon: <LogoutOutlined />,
              label: translations['ka']?.['logout'],
              onClick: ()=>(adminContext.resetUser(),navigate('/admin/login'))
            }
          ]}
          defaultActiveFirst={activeKey}
        ></Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
        className="site-layout-background"
        style={{
            padding: 0
        }}
        >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed)
            })}
            <div className="language-changer">
            გამარჯობა {adminContext.user?.username}
            </div>
        </Header>
        <Content
        className="site-layout-background"
        style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280
        }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminRoute;
