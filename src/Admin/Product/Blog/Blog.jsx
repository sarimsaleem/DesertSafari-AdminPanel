import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Space, Drawer, Descriptions, Tag, Divider } from 'antd';
import "./blog.css";
import BlogModal from './BlogModal/BlogModal';
// import BlogEditModal from './BlogModal/BlogModal'; // Component for editing blogs
import { Add, fetchBlogs, deleteBlog, update } from './Functions/Blog'; // Function handlers for blogs
import { v4 as uuidv4 } from 'uuid';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';

const Blog = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerContent, setDrawerContent] = useState({});
    const [drawerTitle, setDrawerTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const loadBlogs = async () => {
        setLoading(true);
        const fetchedBlogs = await fetchBlogs();
        setBlogs(fetchedBlogs);
        setLoading(false);
    };

    const handleAddBlog = async (blog) => {
        setLoading(true);
        const blogId = uuidv4();
        await Add({ ...blog, _id: blogId });
        await loadBlogs();
        setOpenModal(false);
        setLoading(false);
    };

    const handleEditBlog = async (blogId, updatedBlog) => {
        setLoading(true);
        await update(blogId, updatedBlog);
        await loadBlogs();
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
            title: 'Title',
            dataIndex: 'tags',
            key: 'tags',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => text || 'No Content',
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
                            setOpenEditModal(true);
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
                <Button onClick={() => setOpenModal(true)}
                    icon={<PlusOutlined />}
                    style={{ marginRight: '16px' }}
                    disabled={loading}
                >Add Blog</Button>
            </div>
        );
    };

    const headerProps = {
        title: 'Blogs',
        renderRight: () => renderRight(),
    };

    return (
        <>
        {console.log('blogs', blogs)}
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
                    addBlog={handleAddBlog}
                />
            </PageWrapper>
        </>
    );
};

export default Blog;