import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Upload, Button, Row, Col, Typography } from 'antd';
import { Formik, Form as MainForm, Field } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

const BlogModal = ({ open, setOpen, handleSubmitBlog, currentBlog = null, setCurrentBlog }) => {
    const formRef = useRef();

    const [bannerImgList, setBannerImgList] = useState([]);

    useEffect(() => {
        if (open) {
            if (currentBlog?.banner_image_url) {
                setBannerImgList([{ uid: currentBlog?._id, url: currentBlog?.banner_image_url }])
            }
        }
    }, [open])

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

    return (
        <Modal
            centered
            open={open}
            onCancel={handleCancel}
            width={1000}
            destroyOnClose={true}
            footer={null}
        >
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={BlogSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log(values,"valuesvalues")
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

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            style={{ marginTop: 20 }}
                        >
                            {currentBlog ? 'Update Blog' : 'Add Blog'}
                        </Button>
                    </MainForm>
                )}
            </Formik>
        </Modal>
    );
};

export default BlogModal;

