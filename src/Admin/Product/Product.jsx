import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, } from '@ant-design/icons';
import { Button, Table, Space, Drawer, Descriptions, Tag, Divider } from 'antd';
import "./product.css";
import ProductModal from './productModal/ProductModal';
import ProductEditModal from './productModal/ProductEditModal';
import { Add, fetchProducts, deleteProduct, update } from './Function/productFunction';
import { fetchCategories } from './Categories/CategoriesFunctions/CategoriesFunction';
import { v4 as uuidv4 } from 'uuid';
import PageWrapper from '../../Component/Wrapper/PageWrapper';

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
            width: 170
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
            width: 170

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
    const contentStyle = {
        fontSize: '14px',
    };

    const renderRight = () => {
        return (
            <div className='btns'>
                <Button onClick={() => setOpenModal(true)}
                    icon={<PlusOutlined />}
                    style={{ marginRight: '16px' }}
                    disabled={loading}
                    className='modalBtn'
                >Add Product</Button>
            </div>
        )
    }

    const headerProps = {
        title: 'Products',
        renderRight: () => renderRight(),
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
                <Descriptions bordered column={1} layout='vertical' >
                    <Descriptions.Item label={<span style={headingStyle}>Special Note</span>}>
                        {drawerContent.special_note || 'No Special Note'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span style={headingStyle}>Description</span>}>
                        {drawerContent.description || 'No Description'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span style={headingStyle}>Hide Icon</span>}>
                        <Tag color="geekblue" bordered={false}>
                            {drawerContent.hide_icon ? 'Yes' : 'No'}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Descriptions title="Content Details" bordered column={1} layout='vertical'>
                    {Array.isArray(drawerContent?.content) && drawerContent?.content.length ? (
                        drawerContent.content.map((contentItem, index) => (
                            <Descriptions.Item
                                key={index}
                                label={<span style={headingStyle}>{contentItem.title || 'No Title'}</span>}
                            >
                                {contentItem.description ? (
                                    <p style={{ marginBottom: '10px', fontStyle: 'italic', color: '#666' }}>
                                        {contentItem.description}
                                    </p>
                                ) : (
                                    <p style={{ marginBottom: '10px', fontStyle: 'italic', color: '#666' }}>
                                        No description available
                                    </p>
                                )}

                                {Array.isArray(contentItem.data) && contentItem.data.length > 0 ? (
                                    <ul style={{ padding: 0, margin: 0 }}>
                                        {contentItem.data.map((dataItem, dataIndex) => (
                                            <li key={dataIndex} style={{ listStyleType: 'none', ...contentStyle }}>
                                                {(!dataItem.item && !dataItem.itemDescription)
                                                    ? 'No Content Available'
                                                    : `${dataItem.item || ''} - ${dataItem.itemDescription || ''}`}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'No data available'
                                )}
                            </Descriptions.Item>
                        ))
                    ) : (
                        'No Content'
                    )}
                </Descriptions>
            </Drawer>

            <PageWrapper collapsed={collapsed} headerProps={headerProps}>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={products}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{
                        x: 'max-content',
                    }}
                />

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
            </PageWrapper>

        </>
    );
};

export default Product;