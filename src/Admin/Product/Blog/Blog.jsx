import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Space } from 'antd';
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

    const loadBlogs = async () => {
        setLoading(true);
        const fetchedBlogs = await fetchBlogs();
        setBlogs(fetchedBlogs);
        setLoading(false);
    };

    const handleSubmitBlog = async (blog) => {
        setLoading(true);

        if (currentBlog?._id) {
            // Update the existing blog
            await update(currentBlog._id, blog);
        } else {
            // Add a new blog
            const blogId = uuidv4();
            await Add({ ...blog, _id: blogId });
        }

        await loadBlogs();
        setOpenModal(false);
        setCurrentBlog(null); // Clear the currentBlog state after submission
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
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            // render: (text) => text || 'No Content',
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
                        style={{ width: '100px', height: 'auto', borderRadius: '4px' }}
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
                    <Button danger onClick={() => handleDeleteBlog(record._id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const renderRight = () => {
        return (
            <div className='btns'>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => { setCollapsed(!collapsed); }}
                    style={{ fontSize: "16px", width: 64, height: 64 }}
                />
                <Button
                    onClick={() => {
                        setCurrentBlog(null); 
                        setOpenModal(true);
                    }}
                    icon={<PlusOutlined />}
                    style={{ marginRight: '16px' }}
                    disabled={loading}
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
            </PageWrapper>
        </>
    );
};

export default Blog;
