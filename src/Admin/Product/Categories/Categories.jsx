  import React, { useState, useEffect } from 'react';
  import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined, LogoutOutlined, UploadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
      console.log("values.image",values.image)

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
          <img src={record.image_url}  style={{ width: 100 }} />
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
                  onClick: () => navigate('/'),
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
                overflowY : "scroll"
              }}
            >
              <Table dataSource={categories} columns={columns} rowKey="_id" loading={loading} />
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
