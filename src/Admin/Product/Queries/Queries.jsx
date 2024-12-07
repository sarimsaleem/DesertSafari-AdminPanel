import React, { useState, useEffect } from 'react';
import { Button, Table, Layout, Menu, notification, Popover } from 'antd';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, ShoppingCartOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import logo from './../../assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from "./../../Firebase/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';

const { Header, Sider, Content } = Layout;

const Queries = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'E-mail', dataIndex: 'email', key: 'email' },
        { title: 'Number', dataIndex: 'number', key: 'number' },
        { title: 'Subject', dataIndex: 'subject', key: 'subject' },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (text) => (
                <Popover
                    content={text}
                    title="Full Message"
                    getPopupContainer={(trigger) => trigger.parentElement}  
                    overlayStyle={{ maxWidth: '50vw', maxHeight: '40vh', overflowY: 'auto', whiteSpace: 'pre-wrap' }}  
                >
                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        {text.length > 30 ? `${text.substring(0, 30)}...` : text}
                    </span>
                </Popover>
            ),
        }
    ];

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "queries"));
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setOrders(data);
        } catch (error) {
            console.error("Error fetching queries: ", error);
            notification.error({ message: "Failed to load queries" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate("/");
                notification.success({ message: "Logout Successful" });
            })
            .catch((error) => {
                notification.error({ message: "Logout Failed" });
            });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: '100vh' }}>
                <div className="admin-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['5']}
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
                icon: <LogoutOutlined />,
                label: 'Sign Out',
                onClick: () => handleLogout(),
                style: { marginTop: "162px" },
              },
            ]}
          />
            </Sider>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content style={{ margin: '20px 16px', padding: '24px', background: '#fff', overflowY: 'auto', flex: 1 }}>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={orders}
                        style={{ width: '100%', overflowX: 'auto' }} // Ensure scrollable in case of large tables
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Queries;
