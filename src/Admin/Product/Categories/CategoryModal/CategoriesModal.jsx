import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Typography, Upload, Checkbox } from 'antd'; // Import Checkbox
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { PlusOutlined } from '@ant-design/icons';
import "./categorymodal.css";

const { Title } = Typography;

// Schema validation
const CategorySchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required'),
    show_on_homepage: Yup.boolean(),
});

const CategoriesModal = ({ open, setOpen, addCategory, updateCategory, isEditing, currentCategory }) => {
    const [fileList, setFileList] = useState([]);

    const initialValues = {
        category_name: currentCategory?.category_name || '',
        image: currentCategory?.image_url || "null",
        show_on_homepage: currentCategory?.show_on_homepage || false, 
    };

    // Handle image change
    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const modalTitle = (
        <Title className='categoryTitle' level={3} style={{ marginTop: "10px", marginBottom: "35px" }}>
            {isEditing ? 'Edit Category' : 'Add Category'}
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
                        <div className="fields">
                            <label className='category-Label'>Category Name</label>
                            <Field
                                name="category_name"
                                as={Input}
                                placeholder="Enter category name"
                            />
                            {touched.category_name && errors.category_name ? (
                                <div className="ant-form-item-explain">{errors.category_name}</div>
                            ) : null}
                        </div>

                        {/* Shown on Home Page */}
                        <div className="fields">
                            <label className='category-Label'>Show on Home Page</label>
                            <Checkbox
                                checked={values.show_on_homepage}  // Directly bind to Formik values
                                onChange={(e) => setFieldValue('show_on_homepage', e.target.checked)}  // Update Formik state
                            >
                                Shown on Home Page
                            </Checkbox>
                        </div>

                        {/* Image Upload Field */}
                        <div className="fields">
                            <label className='category-Label'>Category Image</label>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={(info) => {
                                    handleImageChange(info);
                                    setFieldValue('image', info.fileList[0]?.originFileObj);  // Set image in Formik state
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
                        </div>

                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            {isEditing ? 'Update' : 'Submit'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CategoriesModal;
