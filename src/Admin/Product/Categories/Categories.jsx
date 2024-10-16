import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoriesModal from './CategoryModal/CategoriesModal';
import { Add, Update, fetchCategories, deleteCategory } from './CategoriesFunctions/CategoriesFunction';
import { v4 as uuidv4 } from 'uuid';
import logo from "../../assets/logo2.png";
const { Header, Sider, Content } = Layout;

const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      console.log('Fetched Categories:', fetchedCategories);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (newCategory) => {
    const categoryId = uuidv4();
    const categoryData = { ...newCategory, _id: categoryId };

    await Add(categoryData, (addedCategory) => {
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setModalOpen(false);
    });
  };

  const updateCategory = async (values) => {
    const payload = {
      _id: values._id,
      image_url: values?.image,
      category_name: values?.category_name,
      oldImageUrl: values?.oldImageUrl
    }
    await Update(payload);
    setCategories((prevCategories) =>
      prevCategories.map((category) => (category._id === values._id ? values : category))
    );
    setModalOpen(false);
  };

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (categoryId, imageUrl) => {
    await deleteCategory(categoryId, imageUrl);
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category._id !== categoryId)
    );
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: "Background Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (text, record) => (
        <img src={record.image_url} alt={record.category_name} style={{ width: 100 }} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditCategory(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record._id, record.background_image)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="categories">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="admin-logo">
            <img src={logo} alt="" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['2']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'Product',
                onClick: () => navigate('/product'),
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'Category',
                onClick: () => navigate('/categories'),
              },
              {
                key: '3',
                icon: <UserOutlined />,
                label: 'FAQs',
                onClick: () => navigate('/faqs'),
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
              onClick={handleAddCategory}
              style={{ marginRight: '16px' }}
            >
              Add Category
            </Button>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Table dataSource={categories} columns={columns} rowKey="_id" />
          </Content>
        </Layout>
      </Layout>

      <CategoriesModal
        open={modalOpen}
        setOpen={setModalOpen}
        addCategory={addCategory}
        updateCategory={updateCategory}
        isEditing={isEditing}
        currentCategory={currentCategory}
      />
    </div>
  );
};

export default Categories;
