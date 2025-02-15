import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Upload, Button, Row, Col, Typography } from 'antd';
import { Formik, Form as MainForm, Field } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogModal = ({ open, setOpen, handleSubmitBlog, currentBlog = null, setCurrentBlog }) => {
    const formRef = useRef();

    const [bannerImgList, setBannerImgList] = useState([]);

    useEffect(() => {
        if (open) {
            if (currentBlog?.banner_image_url) {
                setBannerImgList([{ uid: currentBlog?._id, url: currentBlog?.banner_image_url }]);
            }
        }
    }, [open]);

    const BlogSchema = Yup.object().shape({
        title: Yup.string().required('Blog Title is required'),
        banner_image_url: Yup.mixed().required('Banner Image is required'),
        content: Yup.string().required('Blog Content is required'),
    });

    const initialValues = {
        title: currentBlog ? currentBlog.title : '',
        banner_image_url: currentBlog ? currentBlog.banner_image_url : null,
        content: currentBlog ? currentBlog.content : '',
    };

    useEffect(() => {
        if (!open) {
            setBannerImgList(currentBlog ? [{ uid: currentBlog._id, url: currentBlog.banner_image_url }] : []);
        }
    }, [open, currentBlog]);

    const handleCancel = () => {
        setOpen(false);
        if (formRef.current) {
            formRef.current.resetForm();
        }
        setBannerImgList([]);
        setCurrentBlog(null);
    };

    const handleConfirm = (formikSubmit) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to proceed with submitting this form?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                // Trigger the Formik submit handler
                formikSubmit();
            },
        });
    };

    return (
        <Modal
            centered
            open={open}
            onCancel={handleCancel}
            width={1000}
            destroyOnClose={true}
            footer={null}
        >
            <div style={{ marginTop: "10px", textAlign: "center", marginBottom: "20px", fontWeight: "900" }}>
                <Typography.Title level={3}>
                    {currentBlog ? 'Update Blog' : 'Add Blog'}
                </Typography.Title>
            </div>

            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={BlogSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    handleSubmitBlog({
                        ...values,
                    });
                    setSubmitting(false);
                    resetForm();
                    setBannerImgList([]);
                    setOpen(false);
                    setCurrentBlog(null);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, touched, errors }) => (
                    <MainForm onSubmit={handleSubmit}>
                        <Row gutter={20}>
                            <Col span={24}>
                                <Typography.Title level={5}>Title</Typography.Title>
                                <Field name="title" as={Input} placeholder="Enter blog title" />
                                {touched.title && errors.title && (
                                    <Typography.Text type="danger">{errors.title}</Typography.Text>
                                )}
                            </Col>

                            <Col span={24}>
                                <Typography.Title level={5}>Content</Typography.Title>
                                <Field name="content">
                                    {({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={(value) => setFieldValue('content', value)}
                                            placeholder="Enter blog content"
                                            style={{ height: '200px', marginBottom: '50px' }}
                                        />
                                    )}
                                </Field>
                                {touched.content && errors.content && (
                                    <Typography.Text type="danger">{errors.content}</Typography.Text>
                                )}
                            </Col>

                            <Col span={12}>
                                <Typography.Title level={5}>Image</Typography.Title>
                                <Upload
                                    fileList={bannerImgList}
                                    beforeUpload={(file) => {
                                        setFieldValue('banner_image_url', file);
                                        setBannerImgList([file]);
                                        return false;
                                    }}
                                    onRemove={() => {
                                        setFieldValue('banner_image_url', null);
                                        setBannerImgList([]);
                                    }}
                                    listType="picture-card"
                                    maxCount={1}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                                {touched.banner_image_url && errors.banner_image_url && (
                                    <Typography.Text type="danger">{errors.banner_image_url}</Typography.Text>
                                )}
                            </Col>
                        </Row>

                        <Button
                            type="primary"
                            htmlType="button"
                            loading={isSubmitting}
                            style={{ marginTop: "20px", padding: "20px 25px", fontSize: "16px" }}
                            onClick={() => handleConfirm(handleSubmit)} 
                        >
                            Submit
                        </Button>
                    </MainForm>
                )}
            </Formik>
        </Modal>
    );
};

export default BlogModal;
