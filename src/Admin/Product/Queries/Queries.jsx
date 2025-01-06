import React, { useState, useEffect } from 'react';
import { Button, Table, notification, Popover, Drawer, Descriptions } from 'antd';
import { db } from "./../../Firebase/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';

const Queries = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState(null);

    const headingStyle = {
        fontWeight: 'bold',
        fontSize: '16px',
    };

    const contentStyle = {
        fontSize: '14px',
    };

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
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button  onClick={() => handleViewQuery(record)}>
                    View Details
                </Button>
            ),
        },
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

    const handleViewQuery = (record) => {
        setSelectedQuery(record);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedQuery(null);
    };

    const renderRight = () => {
        return <div className='btns'></div>;
    };

    const headerProps = {
        renderRight: () => renderRight(),
        title: 'Queries',
    };

    return (
        <PageWrapper collapsed={collapsed} headerProps={headerProps}>
            <Table
                loading={loading}
                columns={columns}
                dataSource={orders}
                style={{ width: '100%', overflowX: 'auto' }}
            />
            <Drawer
                title="Query Details"
                placement="right"
                onClose={closeDrawer}
                visible={drawerVisible}
                width={"40%"}
            >
                {selectedQuery && (
                    <Descriptions bordered column={1} layout='vertical'>
                        <Descriptions.Item label={<span style={headingStyle}>Name</span>}>
                            <span style={contentStyle}>{selectedQuery.name}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={headingStyle}>Email</span>}>
                            <span style={contentStyle}>{selectedQuery.email}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={headingStyle}>Number</span>}>
                            <span style={contentStyle}>{selectedQuery.number}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={headingStyle}>Subject</span>}>
                            <span style={contentStyle}>{selectedQuery.subject}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={headingStyle}>Message</span>}>
                            <span style={contentStyle}>{selectedQuery.message}</span>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </PageWrapper>
    );
};

export default Queries;
