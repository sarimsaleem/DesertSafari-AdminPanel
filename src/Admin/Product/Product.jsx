import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
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
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Product Card Detail',
            dataIndex: 'productCardDetail',
            key: 'productCardDetail',
        },
        {
            title: 'Most Popular',
            dataIndex: 'productIsMostPopular',
            key: 'productIsMostPopular',
            render: (value) => (value ? 'Yes' : 'No'),
        },
        {
            title: 'Category',
            dataIndex: 'productCategory',
            key: 'productCategory',
        },
        {
            title: 'Price',
            dataIndex: 'productPrice',
            key: 'productPrice',
        },
        {
            title: 'Product Image',
            dataIndex: 'productImage',
            key: 'productImage',
            render: (image) => image ? <img src={image} alt="Product" width={100} /> : 'No Image',
        },
        {
            title: 'Banner Image',
            dataIndex: 'bannerImg',
            key: 'bannerImg',
            render: (image) => image ? <img src={image} alt="Product" width={100} /> : 'No Image',
        },
        {
            title: 'Special Note',
            dataIndex: 'specialNote',
            key: 'specialNote',
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
                    <Button warning >Edit</Button>
                    <Button danger onClick={() => handleDeleteProduct(record.id, record.productImage)} >Delete</Button>
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
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
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
                    <Table dataSource={products} columns={columns} rowKey="id" /> {/* Use unique product id */}

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