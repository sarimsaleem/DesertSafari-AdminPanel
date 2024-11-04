import React, { useState, useEffect } from 'react';
import { Button, Table, Layout, Menu, Tag, Drawer, Descriptions } from 'antd';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, ShoppingCartOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { fetchOrders } from './OrderFunction/OrderFunction';
import logo from './../../assets/logo2.png';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const Order = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState({});

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleViewDetails = (orderInfo) => {
    setDrawerContent(orderInfo);
    setOpenDrawer(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'orderInfo',
      key: 'fullName',
      render: (val) => val?.fullName,
      width: 150
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Email',
      dataIndex: 'orderInfo',
      key: 'email',
      render: (val) => val?.email,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val, obj) => {
        const bookingStatus = obj.bookings?.[0]?.status;
        return (
          <Tag color={bookingStatus === 'Pending' ? 'orange' : 'green'}>
            {bookingStatus || 'N/A'}
          </Tag>
        );
      }
    },
    
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button  onClick={() => handleViewDetails(record.orderInfo)}>
          View Details
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const bookingsColumns = [
      { title: 'Adults', dataIndex: 'adults', key: 'adults' },
      { title: 'Children', dataIndex: 'children', key: 'children' },
      { title: 'Infants', dataIndex: 'infants', key: 'infants' },
      { title: 'Tour Name', dataIndex: 'tourName', key: 'tourName' },
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal' },
      { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    ];

    return (
      <Table columns={bookingsColumns} dataSource={record.bookings} rowKey="packageId" pagination={false} />
    );
  };

  return (
    <>
      <Drawer
        title="Order Details"
        placement="right"
        closable
        width={"60%"}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Descriptions bordered column={1} layout='vertical'>
          <Descriptions.Item label="Full Name">{drawerContent.fullName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Additional Info">{drawerContent.additionalInfo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{drawerContent.phoneNo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Room Number">{drawerContent.roomNo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Pickup Location">{drawerContent.pickupLocation || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{drawerContent.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Nationality">{drawerContent.nationality || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Drawer>

      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="admin-logo">
            <img src={logo} alt="Logo" />
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/product')}>Product</Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={() => navigate('/categories')}>Categories</Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />} onClick={() => navigate('/faqs')}>FAQs</Menu.Item>
            <Menu.Item key="4" icon={<ShoppingCartOutlined />} onClick={() => navigate('/orders')}>Orders</Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined />} onClick={() => navigate('/')}>Sign Out</Menu.Item>
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
              expandable={{
                expandedRowRender,
                rowExpandable: (record) => record.bookings.length > 0,
              }}
              rowKey="orderId"
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Order;
