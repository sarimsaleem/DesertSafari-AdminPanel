import React, { useState, useEffect } from 'react';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button } from 'antd';
import { Formik, Form, Field, FieldArray } from 'formik';
import { ProductSchema } from "./ProductSchema";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./productmodal.css";

const { Option } = Select;

const ProductEditModal = ({ open, setOpen, updateProduct, currentProduct }) => {
    const [fileList, setFileList] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // To manage uploaded images

    const initialValues = {
        image_text: '',
        event_name: '',
        most_popular: false,
        category: '',
        price: 0,
        special_note: '',
        description: '',
        packageIncludes: [],
        notes: [],
        timings: [],
        image_url: null,
        banner_image_url: null
    };


    useEffect(() => {
        if (currentProduct) {
            setFileList(currentProduct.productImages || []); // Load existing images
        } else {
            setFileList([]);
        }
    }, [currentProduct]);

    const handleUpload = (file) => {
        setFileList((prevList) => [...prevList, file]); // Add new file to list
        setImageFiles((prevFiles) => [...prevFiles, file]); // Keep track of new files separately
        return false; // Prevent auto upload
    };

    return (
        <Modal
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width={1000}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={ProductSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log('Updated Product values:', values);
                    values.productImages = fileList; // Update the productImages field
                    updateProduct(values); // Call the update function
                    setSubmitting(false);
                    resetForm();
                    // setFileList([]);
                    setOpen(false);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>Additional Information</label>
                            <FieldArray
                                name="additionalFields"
                                render={arrayHelpers => (
                                    <>
                                        {initialValues.additionalFields.map((_, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                <Field name={`additionalFields.${index}`} as={Input} placeholder="Enter additional info" />
                                                <MinusCircleOutlined
                                                    style={{ marginLeft: '8px' }}
                                                    onClick={() => arrayHelpers.remove(index)} // remove the field
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => arrayHelpers.push('')}
                                            icon={<PlusOutlined />}
                                        >
                                            Add Additional Info
                                        </Button>
                                    </>
                                )}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Product Name</label>
                            <Field name="productName" as={Input} placeholder="Enter product name" />
                            {touched.productName && errors.productName ? <div>{errors.productName}</div> : null}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Product Card Detail</label>
                            <Field name="productCardDetail" as={Input} placeholder="Enter product card detail" />
                            {touched.productCardDetail && errors.productCardDetail ? <div>{errors.productCardDetail}</div> : null}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Is Product Most Popular?</label>
                            <Field name="productIsMostPopular" type="checkbox" as={Checkbox} />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Product Category</label>
                            <Field name="productCategory" value="category1" as={Select}>
                                <Option value="category1">Category 1</Option>
                                <Option value="category2">Category 2</Option>
                                <Option value="category2">Category 3</Option>
                            </Field>
                            {touched.productCategory && errors.productCategory ? <div>{errors.productCategory}</div> : null}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Product Price</label>
                            <Field name="productPrice">
                                {({ field }) => (
                                    <InputNumber
                                        {...field}
                                        onChange={(value) => setFieldValue('productPrice', value)}
                                        min={0}
                                        placeholder="Enter product price"
                                        style={{ width: '100%' }}
                                    />
                                )}
                            </Field>
                            {touched.productPrice && errors.productPrice ? <div>{errors.productPrice}</div> : null}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Special Note</label>
                            <Field name="specialNote" as={Input} placeholder="Enter special note" />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Description</label>
                            <Field name="description" as={Input.TextArea} placeholder="Enter product description" />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Product Images</label>
                            <Upload
                                beforeUpload={handleUpload}
                                fileList={fileList}
                                multiple
                                showUploadList={true}
                                onRemove={(file) => {
                                    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
                                    setImageFiles((prevFiles) => prevFiles.filter((item) => item.uid !== file.uid));
                                }}
                            >
                                <Button>
                                    Upload Images
                                </Button>
                            </Upload>
                            {touched.productImages && errors.productImages ? <div>{errors.productImages}</div> : null}
                        </div>

                        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                            Update Product
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default ProductEditModal;
