import { Layout, Menu, notification } from 'antd';
import logo from '../../Admin/assets/logo2.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, ShoppingCartOutlined, QuestionCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { signOut } from 'firebase/auth';
import { auth } from "../../Admin/Firebase/firebaseConfig";

const { Sider } = Layout;

const NavLink = ({ collapsed }) => {

  console.log(collapsed, "collapsed")
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        notification.success({
          message: "Logout Successful",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Logout Failed",
        });
      });
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={200}
      collapsedWidth={80}
    >
      <div className="admin-logo" style={{ textAlign: 'center', padding: '0px 0' }}>
        <img src={logo} alt="Admin Logo" style={{ width: '100%' }} />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'Product',
            onClick: () => navigate('/'),
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'Categories',
            onClick: () => navigate('/categories'),
          },
          {
            key: '3',
            icon: <UploadOutlined />,
            label: 'FAQs',
            onClick: () => navigate('/faqs'),

          },
          {
            key: '4',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
            onClick: () => navigate('/orders'),

          },
          {
            key: '5',
            icon: <QuestionCircleOutlined />,
            label: 'Queries',
            onClick: () => navigate('/queries'),

          },
          {
            key: '6',
            icon: <QuestionCircleOutlined />,
            label: 'Blogs',
            onClick: () => navigate('/blogs'),

          },
          {
            key: '7',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
            onClick: handleLogout,
          }
        ]}
      />
    </Sider>
  );
};

export default NavLink;
