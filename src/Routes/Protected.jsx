import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Blog, Categories, FAQs, Order, Product, Queries } from '../Admin'
import NavLink from '../Component/Sidebar/NavLink'
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';

import { Button, Layout } from 'antd'


function Protected() {

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed((prev) => !prev);
    };

    console.log(collapsed)
    return (
        <Layout style={{ height: '100%', overflow: 'auto' }}>
            <NavLink collapsed={collapsed} />
            <Layout style={{ background: "white" }}>

                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                    style={{ fontSize: "16px", width: 64, height: 64, padding: "30px" }}
                />
                <Routes>
                    <Route path="/" element={<Product />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/orders" element={<Order />} />
                    <Route path="/queries" element={<Queries />} />
                    <Route path="/blogs" element={<Blog />} />
                </Routes>
            </Layout>
        </Layout>
    )
}

export default Protected
