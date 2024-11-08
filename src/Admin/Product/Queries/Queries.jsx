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
                    getPopupContainer={(trigger) => trigger.parentElement}  // Position relative to the message container
                    overlayStyle={{ maxWidth: '50vw', maxHeight: '40vh', overflowY: 'auto', whiteSpace: 'pre-wrap' }}  // Limit width and height, allow scroll
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
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="admin-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['5']}>
                    <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/')}>Product</Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={() => navigate('/categories')}>Categories</Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />} onClick={() => navigate('/faqs')}>FAQs</Menu.Item>
                    <Menu.Item key="4" icon={<ShoppingCartOutlined />} onClick={() => navigate('/orders')}>Orders</Menu.Item>
                    <Menu.Item key="5" icon={<QuestionCircleOutlined />} onClick={() => navigate('/queries')}>Queries</Menu.Item>
                    <Menu.Item key="6" icon={<LogoutOutlined />} onClick={handleLogout}>Sign Out</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', overflowY: "scroll" }}>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={orders}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Queries;
