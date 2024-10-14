import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Table, Space } from 'antd';
import "./product.css";
import ProductModal from './productModal/ProductModal';
import ProductEditModal from './productModal/ProduuctEditModal';
import { Add, fetchProducts, deleteProduct, update } from './Function/productFunction';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from './Categories/CategoriesFunctions/CategoriesFunction';

const { Header, Sider, Content } = Layout;

const Product = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([])

    const loadProducts = async () => {
        const fetchedProducts = await fetchProducts();
        console.log('Fetched Products:', fetchedProducts);
        setProducts(fetchedProducts);
    };

    const navigate = useNavigate();

    const handleAddProduct = async (product) => {
        await Add({
            ...product,
            category: product.category._id, // Use the category ID
        });
        await loadProducts();
        setOpenModal(false);
    };


    const handleEditProduct = async (productId, updatedProduct) => {
        await update(productId, {
            ...updatedProduct,
            category: updatedProduct.category._id, // Use the category ID
        });
        await loadProducts();
    };

    const handleDeleteProduct = async (productId, imageUrl) => {
        await deleteProduct(productId, imageUrl);
        await loadProducts();
    };

    const loadCategories = async () => { // New function to load categories
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
    };


    useEffect(() => {
        loadProducts();
        loadCategories()
    }, []);


    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'image_text',
            key: 'image_text',
        },
        {
            title: 'Product Card Detail',
            dataIndex: 'event_name',
            key: 'event_name',
        },
        {
            title: 'Most Popular',
            dataIndex: 'most_popular',
            key: 'most_popular',
            render: (value) => (value ? 'Yes' : 'No'),
        },
        {
            title: 'Product Category',
            dataIndex: 'category',
            key: 'category',
            render: (categoryId) => {
                const category = categories.find(cat => cat._id === categoryId);
                return category ? category.category_name : 'N/A'; 
            },
        },
        {
            title: 'Product Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Product Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (image) => image ? <img src={image} alt="image_url" width={100} /> : 'No Image',
        },
        {
            title: 'Banner Image',
            dataIndex: 'banner_image_url',
            key: 'banner_image_url',
            render: (image) => image ? <img src={image} alt="Product" width={100} /> : 'No Image',
        },
        {
            title: 'Special Note',
            dataIndex: 'special_note',
            key: 'special_note',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Package Includes",
            dataIndex: "packageIncludes",
            key: "packageIncludes"
        },
        {
            title: "Timings",
            dataIndex: "timings",
            key: "timings"
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes"
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => {
                        setCurrentProduct(record); // Set current product for editing
                        setOpenEditModal(true); // Open the edit modal
                    }}>Edit</Button>
                    <Button danger onClick={() => handleDeleteProduct(record.id, record.image_url)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
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
                <Header style={{
                    padding: 0,
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // backgrounf: "primary"
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <Button onClick={() => setOpenModal(true)}
                        // type="primary"
                        icon={<PlusOutlined />}
                        style={{ marginRight: '16px' }}
                    >Add Product</Button>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', overflowX: "scroll" }}>
                    <Table dataSource={products} columns={columns} rowKey="id" />

                    <ProductModal
                        open={openModal}
                        setOpen={setOpenModal}
                        addProduct={handleAddProduct}
                        categories={categories}
                    />

                    <ProductEditModal
                        open={openEditModal}
                        setOpen={setOpenEditModal}
                        update={handleEditProduct}
                        currentProduct={currentProduct}
                        categories={categories}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Product;
