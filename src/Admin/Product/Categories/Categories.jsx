import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoriesModal from './CategoryModal/CategoriesModal';
import { Add, Update, fetchCategories, deleteCategory } from './CategoriesFunctions/CategoriesFunction';
import { v4 as uuidv4 } from 'uuid';

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

  const updateCategory = async (updatedCategory) => {
    await Update(updatedCategory._id, updatedCategory);
    setCategories((prevCategories) =>
      prevCategories.map((category) => (category._id === updatedCategory._id ? updatedCategory : category))
    );
    setModalOpen(false);
  };

  // Handle opening the modal for adding a new category
  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory(null); // Clear any previous data
    setModalOpen(true);
  };

  // Handle opening the modal for editing a category
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory(category); // Set the selected category data
    setModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    await deleteCategory(categoryId);
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditCategory(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record._id)}
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
          <div className="demo-logo-vertical" />
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
              // backgrounf: "primary"
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
              // type="primary"
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
