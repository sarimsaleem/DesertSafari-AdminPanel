import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, UploadOutlined, LogoutOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Table, Space, Drawer, Descriptions, Tag, Row, Col, Divider } from 'antd';
import "./product.css";
import ProductModal from './productModal/ProductModal';
import ProductEditModal from './productModal/ProductEditModal';
import { Add, fetchProducts, deleteProduct, update } from './Function/productFunction';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from './Categories/CategoriesFunctions/CategoriesFunction';
import logo from "../assets/logo2.png";
import { v4 as uuidv4 } from 'uuid';

const { Header, Sider, Content } = Layout;

const Product = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerContent, setDrawerContent] = useState({});
    const [drawerTitle, setDrawerTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setLoading(false);
    };

    const navigate = useNavigate();

    const handleAddProduct = async (product) => {
        setLoading(true);
        const productId = uuidv4();
        await Add({ ...product, _id: productId });
        await loadProducts();
        setOpenModal(false);
        setLoading(false);
    };

    const handleEditProduct = async (productId, updatedProduct) => {
        setLoading(true);
        await update(productId, updatedProduct);
        await loadProducts();
        setLoading(false);
    };

    const handleDeleteProduct = async (productId, imageUrl) => {
        setLoading(true);
        await deleteProduct(productId, imageUrl);
        await loadProducts();
        setLoading(false);
    };

    const loadCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const showDrawer = (product) => {
        setDrawerTitle(product.image_text || 'Product Details');
        setDrawerContent(product);
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
            dataIndex: 'category',
            key: 'category',
            render: (categoryId) => {
                const category = categories.find(cat => cat._id === categoryId);
                return category ? category.category_name : '--';
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
            render: (image) => image ? <img src={image} alt="Product" width={100} /> : 'No Image',
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
                <Button onClick={() => showDrawer(record)}>
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
                    <Button danger onClick={() => handleDeleteProduct(record._id, record.image_url)}>Delete</Button>
                </Space>
            )
        }
    ];

    const headingStyle = {
        fontWeight: 'bold',
        fontSize: '16px',
    };

    const subHeadingStyle = {
        fontWeight: '700',
        fontSize: '15px',
    };

    const contentStyle = {
        fontSize: '14px',
    };
    const itemStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
    };

    return (
        <>
            <Drawer
                title={drawerTitle}
                placement="right"
                closable
                width={"60%"}
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label={<span style={headingStyle}>Special Note</span>}>
                        {drawerContent.special_note || 'No Special Note'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span style={headingStyle}>Description</span>}>
                        {drawerContent.description || 'No Description'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span style={headingStyle}>Hide Icon</span>}>
                        <Tag color="geekblue" bordered={false}>
                            {drawerContent.hide_icon ? 'True' : 'False'}
                        </Tag>
                    </Descriptions.Item>

                    {/* <Divider style={{ borderColor: '#7cb305', }} /> */}

                    <Descriptions.Item label={<span style={headingStyle}>Content Details</span>}>
                        {Array.isArray(drawerContent.content) && drawerContent.content.length > 0 ? (
                            <Descriptions bordered>
                                {drawerContent.content.map((contentItem, index) => (
                                    <div key={index} style={itemStyle}>
                                        <span style={subHeadingStyle}>{contentItem.title || 'No Title'}</span>

                                        <div>
                                            {Array.isArray(contentItem.data) && contentItem.data.length > 0 ? (
                                                <ul style={{ padding: 0, margin: 0 }}>
                                                    {contentItem.data.map((dataItem, dataIndex) => (
                                                        <li key={dataIndex} style={{ listStyleType: 'none', ...contentStyle }}>
                                                            {dataItem.item.trim() === "" && dataItem.itemDescription.trim() === ""
                                                                ? 'No Content Available'
                                                                : `${dataItem.item} - ${dataItem.itemDescription}`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'No data available'
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </Descriptions>
                        ) : (
                            'No Content'
                        )}
                    </Descriptions.Item>

                </Descriptions>
            </Drawer>

            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="admin-logo">
                        <img src={logo} alt="Logo" />
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
                                icon: <UploadOutlined />,
                                label: 'FAQs',
                                onClick: () => navigate('/faqs'),
                            },
                            {
                                key: '4',
                                icon: <LogoutOutlined />,
                                label: 'Sign Out',
                                onClick: () => navigate('/'),
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
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={products}
                                rowKey="_id"
                                pagination={{
                                    pageSize: 5,
                                }}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>
            {openModal && (
                <ProductModal
                    visible={openModal}
                    onCancel={() => setOpenModal(false)}
                    onAdd={handleAddProduct}
                />
            )}
            {openEditModal && (
                <ProductEditModal
                    visible={openEditModal}
                    onCancel={() => setOpenEditModal(false)}
                    onEdit={handleEditProduct}
                    currentProduct={currentProduct}
                />
            )}
        </>
    );
};

export default Product;
