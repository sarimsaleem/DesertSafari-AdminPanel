import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Space, Drawer, Descriptions, Popconfirm } from 'antd';
import "./blog.css";
import BlogModal from './BlogModal/BlogModal'; // Importing the BlogModal
import { Add, fetchBlogs, deleteBlog, update } from './Functions/Blog'; // Function handlers for blogs
import { v4 as uuidv4 } from 'uuid';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';

const Blog = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [fullContent, setFullContent] = useState('');

    const loadBlogs = async () => {
        setLoading(true);
        const fetchedBlogs = await fetchBlogs();
        setBlogs(fetchedBlogs);
        setLoading(false);
    };

    const handleSubmitBlog = async (blog) => {
        setLoading(true);
        if (currentBlog?._id) {
            await update(currentBlog._id, blog);
        } else {
            const blogId = uuidv4();
            await Add({ ...blog, _id: blogId });
        }

        await loadBlogs();
        setOpenModal(false);
        setCurrentBlog(null);
        setLoading(false);
    };

    const handleDeleteBlog = async (blogId) => {
        setLoading(true);
        await deleteBlog(blogId);
        await loadBlogs();
        setLoading(false);
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const columns = [
        {
            title: 'Blog Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => {
                const isLongText = text.length > 50;
                return isLongText ? (
                    <div>
                        {text.slice(0, 50)}...
                        <Button type="link" onClick={() => showFullContent(text)}>
                            {/* Read More */}
                        </Button>
                    </div>
                ) : (
                    text
                );
            },
        },
        {
            title: 'Image',
            dataIndex: 'banner_image_url',
            key: 'banner_image_url',
            render: (url) =>
                url ? (
                    <img
                        src={url}
                        alt="Blog Banner"
                        style={{ width: '100px', height: '70px', borderRadius: '4px' }}
                    />
                ) : (
                    'No Image'
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => {
                            setCurrentBlog(record);
                            setOpenModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this blog?"
                        onConfirm={() => handleDeleteBlog(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const renderRight = () => {
        return (
            <div className='btns'>
                <Button
                    onClick={() => {
                        setCurrentBlog(null);
                        setOpenModal(true);
                    }}
                    icon={<PlusOutlined />}
                    style={{ marginRight: '16px' }}
                    disabled={loading}
                    className='modalBtn'
                >
                    Add Blog
                </Button>
            </div>
        );
    };

    const headerProps = {
        title: 'Blogs',
        renderRight: () => renderRight(),
    };

    const showFullContent = (content) => {
        setFullContent(content);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setFullContent('');
    };
    const headingStyle = {
        fontWeight: 'bold',
        fontSize: '16px',
    };

    const contentStyle = {
        fontSize: '14px',
    };

    return (
        <>
            <PageWrapper collapsed={collapsed} headerProps={headerProps}>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={blogs}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{
                        x: 'max-content',
                    }}
                />

                <BlogModal
                    open={openModal}
                    setOpen={setOpenModal}
                    handleSubmitBlog={handleSubmitBlog}
                    currentBlog={currentBlog}
                    setCurrentBlog={setCurrentBlog}
                />

                <Drawer
                    title="Blog Content"
                    placement="right"
                    width={400}
                    onClose={closeDrawer}
                    open={drawerVisible}
                >
                    <Descriptions bordered column={1} layout="vertical">
                        <Descriptions.Item label={<span style={headingStyle}>Content</span>}>
                            <p style={contentStyle}>
                                {fullContent || 'fullContent'}
                            </p>
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>

            </PageWrapper>

        </>
    );

};

export default Blog;
