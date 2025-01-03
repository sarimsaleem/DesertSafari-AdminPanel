import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Typography, Upload, Checkbox, Row, Col } from 'antd'; // Import Checkbox
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { PlusOutlined } from '@ant-design/icons';
import "./categorymodal.css";

const { Title } = Typography;

// Schema validation
const CategorySchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required'),
    show_on_homepage: Yup.boolean(),
    show_on_menu: Yup.boolean(),
});

const CategoriesModal = ({ open, setOpen, addCategory, updateCategory, isEditing, currentCategory }) => {
    const [fileList, setFileList] = useState([]);

    const initialValues = {
        category_name: currentCategory?.category_name || '',
        image: currentCategory?.image_url || "null",
        show_on_homepage: currentCategory?.show_on_homepage || false,
        show_on_menu: currentCategory?.show_on_menu || false,
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const modalTitle = (
        <Title className='categoryTitle' level={3} style={{ marginTop: "10px", marginBottom: "20px", fontWeight:"700" }}>
            {isEditing ? 'Update Category' : 'Add Category'}
        </Title>
    );

    useEffect(() => {
        if (open && currentCategory) {
            setFileList(currentCategory.image_url ? [{
                uid: currentCategory.image_url,
                name: 'Category Image',
                status: 'done',
                url: currentCategory.image_url,
            }] : []);
        } else {
            setFileList([]);
        }
    }, [currentCategory, open]);

    return (
        <Modal
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width={600}
            footer={null}
            title={modalTitle}
            padding="30px"
        >
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={CategorySchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (isEditing) {
                        updateCategory({ ...currentCategory, ...values, oldImageUrl: currentCategory?.image_url, image: fileList[0]?.originFileObj ? fileList[0]?.originFileObj : fileList[0]?.url });
                    } else {
                        addCategory({ ...values, image: fileList[0]?.originFileObj });
                    }
                    setSubmitting(false);
                    resetForm();
                    setOpen(false);
                    setFileList([]);
                }}
            >
                {({ handleSubmit, isSubmitting, errors, touched, setFieldValue, values }) => (
                    <Form onSubmit={handleSubmit}>

                        <Row gutter={20}>
                            <Col className="gutter-row" span={24}>
                                <Typography.Title level={5}>Name</Typography.Title>
                                <Field name="category_name" as={Input} placeholder="Enter category name" />
                                {touched.category_name && errors.category_name ? (
                                    <div className="ant-form-item-explain">{errors.category_name}</div>
                                ) : null}
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Shown on Home Page</Typography.Title>
                                <Checkbox className='checkbox-Cat' checked={values.show_on_homepage}
                                    onChange={(e) => setFieldValue('show_on_homepage', e.target.checked)}
                                >
                                    Shown on Home Page
                                </Checkbox>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Shown On Menu</Typography.Title>
                                <Checkbox
                                    className='checkbox-Cat'
                                    checked={values.show_on_menu}
                                    onChange={(e) => setFieldValue('show_on_menu', e.target.checked)}
                                >
                                    Shown On Menu
                                </Checkbox>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Image</Typography.Title>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={(info) => {
                                        handleImageChange(info);
                                        setFieldValue('image', info.fileList[0]?.originFileObj);
                                    }}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                >
                                    {fileList?.length < 1 && (
                                        <div>
                                            <PlusOutlined /> 
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Col>
                        </Row>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ marginTop: "20px" }}>
                            {isEditing ? 'Update' : 'Submit'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CategoriesModal;
