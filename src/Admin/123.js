import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoriesModal from './CategoryModal/CategoriesModal'; 
import { Add, fetchCategories } from './CategoriesFunctions/CategoriesFunction';
import { v4 as uuidv4 } from 'uuid'; 

const { Header, Sider, Content } = Layout;

const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); 

  const navigate = useNavigate();

  const loadCategories = async () => {
    const fetchedCategories = await fetchCategories(); 
    setCategories(fetchedCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (newCategory) => {
    const categoryId = uuidv4();
    const categoryData = { ...newCategory, _id: categoryId }; 

    await Add(categoryData, null, (addedCategory) => {
      setCategories((prevCategories) => [...prevCategories, addedCategory]); 
      setModalOpen(false); 
    });
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'category_name', 
      key: 'category_name',
    },
    {
      title: 'UUID',
      dataIndex: '_id',   
      key: '_id',
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
                onClick: () => navigate('/'),
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
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)} // Open modal
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

      {/* Categories Modal */}
      <CategoriesModal open={modalOpen} setOpen={setModalOpen} addCategory={addCategory} />
    </div>
  );
};

export default Categories;







import React from 'react';
import { Modal, Input, Button } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const CategorySchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required'),
});

const CategoriesModal = ({ open, setOpen, addCategory }) => {
    const initialValues = {
        category_name: '',
    };

    return (
        <Modal
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width={600}
            footer={null}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={CategorySchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    addCategory(values); 
                    setSubmitting(false);
                    resetForm();
                }}
            >
                {({ handleSubmit, isSubmitting, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="fields">
                            <label>Category Name</label>
                            <Field
                                name="category_name"
                                as={Input}
                                placeholder="Enter category name"
                            />
                            {touched.category_name && errors.category_name ? (
                                <div className="ant-form-item-explain">{errors.category_name}</div>
                            ) : null}
                        </div>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ marginTop: '20px' }}>
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

// export default CategoriesModal;






import { setDoc } from "firebase/firestore";
import { db } from "../../../Firebase/firebaseConfig";
// imo
const PARENT_COLLECTION_NAME = "categories";

export const Add = async (values, CB) => {
  try {

    setDoc(doc(db, PARENT_COLLECTION_NAME, values?._id), { ...values, images: imageUrls });
    console.log('Category added successfully');
    CB && CB()
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

export const fetchCategories = async () => {
  const categoriesCollectionRef = collection(db, PARENT_COLLECTION_NAME);
  const categorySnapshot = await getDocs(categoriesCollectionRef);
  const categoryList = categorySnapshot.docs.map(doc => ({
    ...doc.data(),
    _id: doc.id
  }));

  return categoryList;
};