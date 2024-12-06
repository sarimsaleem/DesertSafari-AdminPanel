import React, { useState, useEffect } from 'react';
import { Button, Table, Layout, notification, Popover } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { db } from "./../../Firebase/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';


const Queries = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'E-mail', dataIndex: 'email', key: 'email' },
        { title: 'Number', dataIndex: 'number', key: 'number' },
        { title: 'Subject', dataIndex: 'subject', key: 'subject' },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (text) => (
                <Popover
                    content={text}
                    title="Full Message"
                    getPopupContainer={(trigger) => trigger.parentElement}
                    overlayStyle={{ maxWidth: '50vw', maxHeight: '40vh', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
                >
                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        {text.length > 30 ? `${text.substring(0, 30)}...` : text}
                    </span>
                </Popover>
            ),
        }
    ];

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "queries"));
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setOrders(data);
        } catch (error) {
            console.error("Error fetching queries: ", error);
            notification.error({ message: "Failed to load queries" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const renderRight = () => {
        return (
            <div className='btns'>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 64, height: 64 }}
                />
            </div>
        )
    }

    const headerProps = {
        renderRight: () => renderRight(),
    };

    return (
        <PageWrapper collapsed={collapsed} headerProps={headerProps}>
            <Table
                loading={loading}
                columns={columns}
                dataSource={orders}
                style={{ width: '100%', overflowX: 'auto' }}
            />
        </PageWrapper>
    );
};

export default Queries;
