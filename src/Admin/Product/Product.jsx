import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Table, Space } from 'antd';
import "./product.css";
import ProductModal from './productModal/ProductModal';
import { Add, fetchProducts, deleteProduct } from './Function/productFunction';

const { Header, Sider, Content } = Layout;

const Product = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
    };

    const navigate = useNavigate()

    const handleAddProduct = async (product) => {
        await Add(product);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setOpenModal(false);
    };

    const handleDeleteProduct = async (productId, imageUrl) => {
        await deleteProduct(productId, imageUrl);
        await loadProducts();
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const columns = [
        {
            title: 'image_text',
            dataIndex: 'image_text',
            key: 'image_text',
        },
        {
            title: 'event_name',
            dataIndex: 'event_name',
            key: 'event_name',
        },
        {
            title: 'most_popular',
            dataIndex: 'most_popular',
            key: 'most_popular',
            render: (value) => (value ? 'Yes' : 'No'),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'image_url',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (image) => image ? <img src={image} alt="image_url" width={100} /> : 'No Image',
        },
        {
            title: 'banner_image_url',
            dataIndex: 'banner_image_url',
            key: 'banner_image_url',
            render: (image) => image ? <img src={image} alt="Product" width={100} /> : 'No Image',
        },
        {
            title: 'special_note',
            dataIndex: 'special_note',
            key: 'special_note',
        },
        {
            title: 'description',
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
                    <Button warning >Edit</Button>
                    <Button danger onClick={() => handleDeleteProduct(record.id, record.image_url)} >Delete</Button>
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
                            onClick: () => navigate('/'),
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'Category',
                            onClick: () => navigate('/categories'), // Navigate to Category
                        },
                    ]}
                />

            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: '#fff',
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
                    <Button onClick={() => setOpenModal(true)}>Add Product</Button>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#fff',
                        overflowX: "scroll"
                    }}
                >
                    <Table dataSource={products} columns={columns} rowKey="id" />

                    <ProductModal
                        open={openModal}
                        setOpen={setOpenModal}
                        addProduct={handleAddProduct}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Product;