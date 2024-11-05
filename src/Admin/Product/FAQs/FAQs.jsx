import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, PlusOutlined, LogoutOutlined, VideoCameraOutlined, UploadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, Popconfirm, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import FAQModal from './FAQsModal/FAQsModal';
import { addFAQ, updateFAQs, fetchFAQs, deleteFAQs } from './Functions/functions';
import logo from "../../assets/logo2.png";
import { signOut } from 'firebase/auth';
import { auth } from "./../../Firebase/firebaseConfig";

const { Header, Sider, Content } = Layout;

const FAQs = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState(null);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const loadFAQs = async () => {
    try {
      setLoading(true)
      const fetchedFAQs = await fetchFAQs();
      setFaqs(fetchedFAQs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
    setLoading(false)
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleAddFAQ = async (newFAQ) => {
    try {
      setLoading(true)
      const addedFAQ = await addFAQ(newFAQ); 
      setFaqs((prevFAQs) => [...prevFAQs, addedFAQ]); 
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
    setLoading(false)
  };

  const handleUpdateFAQ = async (updatedFAQ) => {
    setLoading(true)
    if (!updatedFAQ.id || typeof updatedFAQ.id !== 'string') {
      console.error('No valid FAQ ID provided for update.');
      return;
    }

    try {
      await updateFAQs(updatedFAQ); // Call with the whole object
      setFaqs((prevFAQs) =>
        prevFAQs.map((faq) => (faq.id === updatedFAQ.id ? updatedFAQ : faq))
      );
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
    setLoading(false)
  };

  const handleDeleteFAQ = async (faqId) => {
    try {
      await deleteFAQs(faqId); // Directly call with faqId
      setFaqs((prevFAQs) => prevFAQs.filter((faq) => faq.id !== faqId));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleEditFAQ = (faq) => {
    setIsEditing(true);
    setCurrentFAQ(faq);
    setModalOpen(true);
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditFAQ(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this FAQ?"
            onConfirm={() => handleDeleteFAQ(record.id)} // Use id for deletion
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
    <div className="faqs">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="admin-logo">
            <img src={logo} alt="" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['3']}
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
                icon: <LogoutOutlined />,
                label: 'Sign Out',
                onClick: () => handleLogout(),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setIsEditing(false);
                setCurrentFAQ(null);
                setModalOpen(true);
              }}
              style={{ marginRight: '16px' }}
            >
              Add FAQ
            </Button>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: '#fff',
              overflowY: "scroll"
            }}
          >
            <Table dataSource={faqs} columns={columns} rowKey="id" loading={loading} /> {/* Use 'id' as the row key */}
          </Content>
        </Layout>
      </Layout>

      <FAQModal
        open={modalOpen}
        setOpen={setModalOpen}
        addFAQ={handleAddFAQ}
        updateFAQ={handleUpdateFAQ}
        isEditing={isEditing}
        currentFAQ={currentFAQ}
      />
    </div>
  );
};

export default FAQs;
