import React, { useState, useEffect } from 'react';
import { Formik, Form as MainForm, Field, FieldArray } from 'formik';
import "../blog.css";
import * as Yup from 'yup';
import { Modal, Input, Upload, InputNumber, Button, Form, Card, Space, Switch, Col, Row, Typography, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';


const BlogModal = ({ open, setOpen, addBlog, categories }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);

    const BlogSchema = Yup.object().shape({
        title: Yup.string().required('Blog Title is required'),
        banner_image_url: Yup.mixed().required('Banner Image is required'),
        content: Yup.string().required('Blog Content is required'),
    });

    const initialValues = {
        title: '',
        banner_image_url: null,
        content: '',
        tags: '',
        hide_icon: false,
    };

    useEffect(() => {
        if (!open) {
            setFileList([]);
            setBannerImgList([]);
        }
    }, [open]);

    return (
        <Modal
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width={1000}
            footer={null}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={BlogSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log("Submitted Values:", values);
                    addBlog({
                        ...values,
                        banner_image_url: values.banner_image_url, // Adjust as needed
                    });
                    setSubmitting(false);
                    resetForm({ values: initialValues });
                    setFileList([]);
                    setBannerImgList([]);
                    setOpen(false);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, values, errors, touched }) => (
                    <MainForm onSubmit={handleSubmit}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Typography.Title level={5}>Blog Title</Typography.Title>
                                <Field name="title" as={Input} placeholder="Enter blog title" />
                                {touched.title && errors.title && (
                                    <Typography.Text type="danger">{errors.title}</Typography.Text>
                                )}
                            </Col>

                            <Col span={24}>
                                <Typography.Title level={5}>Blog Content</Typography.Title>
                                <Field name="content">
                                    {({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Enter blog content"
                                            rows={6}
                                        />
                                    )}
                                </Field>
                                {touched.content && errors.content && (
                                    <Typography.Text type="danger">{errors.content}</Typography.Text>
                                )}
                            </Col>

                            <Col span={12}>
                                <Typography.Title level={5}>Tags</Typography.Title>
                                <Field name="tags" as={Input} placeholder="Enter tags (comma-separated)" />
                            </Col>

                            <Col span={12}>
                                <Typography.Title level={5}>Banner Image</Typography.Title>
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
                                    listType="picture"
                                    maxCount={1}
                                >
                                    <Button>Select Banner Image</Button>
                                </Upload>
                                {touched.banner_image_url && errors.banner_image_url && (
                                    <Typography.Text type="danger">{errors.banner_image_url}</Typography.Text>
                                )}
                            </Col>
                        </Row>

                        <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ marginTop: 20 }}>
                            Submit
                        </Button>
                    </MainForm>
                )}
            </Formik>
        </Modal>
    );
};

export default BlogModal;