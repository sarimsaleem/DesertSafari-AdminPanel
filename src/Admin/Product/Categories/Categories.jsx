import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined, LogoutOutlined, UploadOutlined, ShoppingCartOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, Popconfirm, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoriesModal from './CategoryModal/CategoriesModal';
import { Add, Update, fetchCategories, deleteCategory } from './CategoriesFunctions/CategoriesFunction';
import { v4 as uuidv4 } from 'uuid';
import logo from "../../assets/logo2.png";
import { signOut } from 'firebase/auth';
import { auth } from "./../../Firebase/firebaseConfig";


const { Header, Sider, Content } = Layout;

const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await fetchCategories();
      console.log('Fetched Categories:', fetchedCategories);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };


  const addCategory = async (newCategory) => {
    setLoading(true);
    const categoryId = uuidv4();
    const categoryData = { ...newCategory, _id: categoryId };

    await Add(categoryData, (addedCategory) => {
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setModalOpen(false);
      setLoading(false);
    });
  };

  const updateCategory = async (values) => {
    setLoading(true);
    const payload = {
      _id: values._id,
      image_url: values?.image,
      category_name: values?.category_name,
      oldImageUrl: values?.oldImageUrl,
      show_on_homepage: values?.show_on_homepage,
      show_on_menu: values?.show_on_menu
    };
    console.log("values.image", values.image)

    await Update(payload);

    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === values._id
          ? { ...category, category_name: values.category_name, image_url: values.image_url }
          : category
      )
    );
    loadCategories()
    setModalOpen(false);
    setLoading(false);
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
  useEffect(() => {
    loadCategories();
  }, []);

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Is Shown On Home Page ',
      dataIndex: 'show_on_homepage',
      key: 'show_on_homepage',
      render: (show_on_homepage) => (
        show_on_homepage ? 'Yes' : 'No'
      ),
    },
    {
      title: 'Shown On Menu',
      dataIndex: 'show_on_menu',
      key: 'show_on_menu',
      render: (show_on_menu) => (
        show_on_menu ? 'Yes' : 'No'
      ),
    },
    {
      title: "Background Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (text, record) => (
        <img src={record.image_url} style={{ width: 100 }} />
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
    <div className="page" >
      <Layout >
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
              disabled={loading}
            >
              Add Category
            </Button>
          </Header>
          <Content
            style={{ margin: '24px 16px', overflowY: 'scroll', height: 'calc(100vh - 64px)' }}>
            <div
              style={{
                padding: 24, minHeight: 360, background: '#fff', overflowY: 'auto'
              }}
            >
              <div className="table-container">
                <Table
                  scroll={{
                    x: 'max-content',
                  }} dataSource={categories}
                  columns={columns}
                  rowKey="_id"
                  loading={loading}
                />
              </div>
            </div>
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
