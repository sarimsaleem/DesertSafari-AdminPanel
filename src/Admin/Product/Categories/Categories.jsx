import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, } from '@ant-design/icons';
import { Button, Space, Table, Popconfirm, Typography, Image, } from 'antd';
import CategoriesModal from './CategoryModal/CategoriesModal';
import { Add, Update, fetchCategories, deleteCategory } from './CategoriesFunctions/CategoriesFunction';
import { v4 as uuidv4 } from 'uuid';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';



const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false)


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
        <Image src={record.image_url} style={{ width: 100 }} />
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

  const headerProps = {
    title: 'Categories',
    renderRight: () => renderRight(),
  };

  const renderRight = () => {
    return (
      <div className='btns'>
        <Button
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
          style={{ marginRight: '16px' }}
          disabled={loading}
          className='modalBtn'
        >
          Add Category
        </Button>
      </div>

    )
  }

  return (
    <div className="page" >
      <PageWrapper
        collapsed={collapsed}
        headerProps={headerProps}
      >
        <Table
          scroll={{
            x: 'max-content',
          }} dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
        />
      </PageWrapper>

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