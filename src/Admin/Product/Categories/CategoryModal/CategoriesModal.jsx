import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Typography, Upload } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { PlusOutlined } from '@ant-design/icons';
import "./categorymodal.css";

const { Title } = Typography;

// Schema validation
const CategorySchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required'),
    image: Yup.mixed().required('Image is required')  // Image validation
});

const CategoriesModal = ({ open, setOpen, addCategory, updateCategory, isEditing, currentCategory }) => {
    const [fileList, setFileList] = useState([]);

    const initialValues = {
        category_name: currentCategory?.category_name || '',
        image: currentCategory?.image_url || null,
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
                {({ handleSubmit, isSubmitting, errors, touched, setFieldValue }) => (
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
                            {touched.image && errors.image ? (
                                <div className="ant-form-item-explain">{errors.image}</div>
                            ) : null}
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
