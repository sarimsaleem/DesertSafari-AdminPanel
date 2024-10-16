import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Table, Space, Drawer, Radio } from 'antd';
import "./product.css";
import ProductModal from './productModal/ProductModal';
import ProductEditModal from './productModal/ProductEditModal';
import { Add, fetchProducts, deleteProduct, update } from './Function/productFunction';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from './Categories/CategoriesFunctions/CategoriesFunction';
import logo from "../assets/logo2.png";

const { Header, Sider, Content } = Layout;

const Product = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false); // State to manage drawer
    const [drawerContent, setDrawerContent] = useState(''); // State for dynamic content in the drawer
    const [drawerTitle, setDrawerTitle] = useState(''); // State for dynamic title in the drawer

    const loadProducts = async () => {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
    };

    const navigate = useNavigate();

    const handleAddProduct = async (product) => {
        await Add({
            ...product,
            // category: product.category._id,
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

    const loadCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // Function to handle opening the Drawer
    const showDrawer = (fieldTitle, details) => {
        setDrawerTitle(fieldTitle);
        setDrawerContent(details); 
        setOpenDrawer(true);
    };


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
            dataIndex: 'category', // This should match the key you are saving in the product
            key: 'category',
            render: (categoryId) => {
                const category = categories.find(cat => cat._id === categoryId);
                return category ? category.category_name : '//'; 
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
            title: 'Details',
            key: 'details',
            render: (_, record) => (
                <Button
                    onClick={() => {
                        const details = {
                            specialNote: record.special_note || 'No Special Note',
                            description: record.description || 'No Description',
                            packageIncludes: record.packageIncludes || 'No Package Includes',
                            timings: record.timings || 'No Timings',
                            notes: record.notes || 'No Notes',
                        };
                        showDrawer('Product Details', details);
                    }}
                >
                    View
                </Button>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => {
                        setCurrentProduct(record);
                        setOpenEditModal(true);
                    }}>Edit</Button>
                    <Button danger onClick={() => handleDeleteProduct(record.id, record.image_url)}>Delete</Button>
                </Space>
            )
        }
    ];


    return (
        <>
        {/* <h1>{categories.categories_name} sarim</h1> */}
            <Drawer
                title={drawerTitle}
                placement="right"
                closable
                size='large'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <div className="drawer-details">
                    {drawerContent && (
                        <>
                            <div className="detail-item">
                                <strong>Special Note:</strong>
                                <p>{drawerContent.specialNote}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Description:</strong>
                                <p>{drawerContent.description}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Package Includes:</strong>
                                <p>{drawerContent.packageIncludes}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Timings:</strong>
                                <p>{drawerContent.timings}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Notes:</strong>
                                <p>{drawerContent.notes}</p>
                            </div>
                        </>
                    )}
                </div>
            </Drawer>

            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="admin-logo">
                        <img src={logo} alt="" />
                    </div>
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
                    <Header style={{
                        padding: 0,
                        background: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />
                        <Button onClick={() => setOpenModal(true)}
                            icon={<PlusOutlined />}
                            style={{ marginRight: '16px' }}
                        >Add Product</Button>
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', overflowX: "scroll" }}>
                        <Table dataSource={products} columns={columns} rowKey="id"  />

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
        </>
    );
};

export default Product;
