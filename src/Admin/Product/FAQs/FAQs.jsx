import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, Popconfirm } from 'antd';
import FAQModal from './FAQsModal/FAQsModal';
import { addFAQ, updateFAQs, fetchFAQs, deleteFAQs } from './Functions/functions';
import PageWrapper from '../../../Component/Wrapper/PageWrapper';


const FAQs = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const fetchedFAQs = await fetchFAQs();
      setFaqs(fetchedFAQs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleAddFAQ = async (newFAQ) => {
    try {
      setLoading(true);
      const addedFAQ = await addFAQ(newFAQ);
      setFaqs((prevFAQs) => [...prevFAQs, addedFAQ]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
    setLoading(false);
  };

  const handleUpdateFAQ = async (updatedFAQ) => {
    setLoading(true);
    if (!updatedFAQ.id || typeof updatedFAQ.id !== 'string') {
      console.error('No valid FAQ ID provided for update.');
      return;
    }

    try {
      await updateFAQs(updatedFAQ);
      setFaqs((prevFAQs) =>
        prevFAQs.map((faq) => (faq.id === updatedFAQ.id ? updatedFAQ : faq))
      );
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
    setLoading(false);
  };

  const handleDeleteFAQ = async (faqId) => {
    try {
      await deleteFAQs(faqId);
      setFaqs((prevFAQs) => prevFAQs.filter((faq) => faq.id !== faqId));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };



  const renderRight = () => {
    return (
      <div className="btns">
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEditing(false);
            setCurrentFAQ(null);
            setModalOpen(true);
          }}
          className='modalBtn'
          disabled={loading}
          style={{ marginRight: '16px' }}
        >
          Add FAQ
        </Button>
      </div>
    )
  }

  const headerProps = {
    title: 'FAQs',
    renderRight: () => renderRight(),
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditFAQ(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this FAQ?"
            onConfirm={() => handleDeleteFAQ(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditFAQ = (faq) => {
    setIsEditing(true);
    setCurrentFAQ(faq);
    setModalOpen(true);
  };

  return (

    <PageWrapper
      collapsed={collapsed}
      headerProps={headerProps}
    >

      <Table
        loading={loading}
        columns={columns}
        dataSource={faqs}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          defaultCurrent: 1,
        }}

      />
      <FAQModal
        open={modalOpen}
        setOpen={setModalOpen}
        addFAQ={handleAddFAQ}
        updateFAQ={handleUpdateFAQ}
        isEditing={isEditing}
        currentFAQ={currentFAQ}
      />
    </PageWrapper>
  );
};

export default FAQs;