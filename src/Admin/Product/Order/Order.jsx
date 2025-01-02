import React, { useState, useEffect } from 'react';
import { Button, Table, Layout, Tag, Drawer, Descriptions } from 'antd';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';
import { fetchOrders } from './OrderFunction/OrderFunction';

const { Header, Content, Sider } = Layout;

const Order = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState({});

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await fetchOrders();
        console.log(fetchedOrders, "Fetched Orders");
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
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
      width: 150,
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
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const bookingStatus = record.bookings?.[0]?.status;
        return (
          <Tag color={bookingStatus === 'Pending' ? 'orange' : 'green'}>
            {bookingStatus || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record.orderInfo)}>
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
      <Table
        columns={bookingsColumns}
        dataSource={record.bookings}
        rowKey="packageId"
        pagination={false}
      />
    );
  };

  const headerProps = {
    title: 'Orders',
    renderRight: () => <div className="btns" />,
  };

  return (
    <>
      <Drawer
        title="Order Details"
        placement="right"
        closable
        width="60%"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Descriptions bordered column={1} layout="vertical">
          <Descriptions.Item label="Full Name">{drawerContent.fullName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Additional Info">{drawerContent.additionalInfo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{drawerContent.phoneNo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Room Number">{drawerContent.roomNo || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Pickup Location">{drawerContent.pickupLocation || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{drawerContent.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Nationality">{drawerContent.nationality || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Drawer>

      <PageWrapper collapsed={collapsed} headerProps={headerProps}>
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
      </PageWrapper>
    </>
  );
};

export default Order;
