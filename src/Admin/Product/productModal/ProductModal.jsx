import React, { useState, useEffect } from 'react';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button } from 'antd';
import { Formik, Form, Field, FieldArray } from 'formik';
import { ProductSchema } from "./ProductSchema";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./productmodal.css";

const { Option } = Select;

const ProductModal = ({ open, setOpen, addProduct }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);

    const initialValues = {
        productName: '',
        productCardDetail: '',
        productIsMostPopular: false,
        productCategory: '',
        productImage: null,
        productPrice: 0,
        specialNote: '',
        description: '',
        packageIncludes: [],
        notes: [],
        timings: [],
        bannerImg: null
    };

    useEffect(() => {
        if (!open) {
            setFileList([]);
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
                validationSchema={ProductSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    addProduct(values);
                    setSubmitting(false);
                    resetForm();
                    setFileList([]);
                    setOpen(false);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, values, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>


                        {/* name and detail  */}
                        <div className="des-spec-parernt">
                            {/* Product Name Field */}
                            <div className="fields">
                                <label>Product Name</label>
                                <Field name="productName" as={Input} placeholder="Enter product name" />
                                {touched.productName && errors.productName ? <div className="ant-form-item-explain">{errors.productName}</div> : null}
                            </div>

                            {/* Product Card Detail Field */}
                            <div className="fields">
                                <label>Product Card Detail</label>
                                <Field name="productCardDetail" as={Input} placeholder="Enter product card detail" />
                                {touched.productCardDetail && errors.productCardDetail ? <div className="ant-form-item-explain">{errors.productCardDetail}</div> : null}
                            </div>
                        </div>
                        {/* Is Product Most Popular */}
                        <div className="fields" style={{ marginBottom: '16px' }}>
                            <label>Is Product Most Popular?</label>
                            <Field name="productIsMostPopular" type="checkbox" as={Checkbox} />
                        </div>
                        {/* price and category  */}
                        <div className="des-spec-parernt">
                            {/* Product Category Field */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Product Category</label>
                                <Field name="productCategory">
                                    {({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select category"
                                            onChange={(value) => setFieldValue('productCategory', value)}
                                        >
                                            <Option value="category1">Category 1</Option>
                                            <Option value="category2">Category 2</Option>
                                            <Option value="category3">Category 3</Option>
                                        </Select>
                                    )}
                                </Field>
                                {touched.productCategory && errors.productCategory ? <div className="ant-form-item-explain">{errors.productCategory}</div> : null}
                            </div>
                            {/* Product Price Field */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
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
                                {touched.productPrice && errors.productPrice ? <div className="ant-form-item-explain">{errors.productPrice}</div> : null}
                            </div>
                        </div>
                        {/* special note and description  */}
                        <div className="des-spec-parernt">
                            {/* Special Note Field */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Special Note</label>
                                <Field name="specialNote">
                                    {({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Enter special note"
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                {touched.specialNote && errors.specialNote ? <div className="ant-form-item-explain">{errors.specialNote}</div> : null}
                            </div>

                            {/* Description Field */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Description</label>
                                <Field name="description">
                                    {({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Enter product description"
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                {touched.description && errors.description ? <div className="ant-form-item-explain">{errors.description}</div> : null}
                            </div>
                        </div>
                        {/* array fieldss  */}
                        <div className="arrayfield-wrapper">
                            {/* Package Includes and Timings - Both will take up 40% of the width */}
                            <div className="arrayfield-group">
                                {/* Package Includes Field */}
                                <div className="fields">
                                    <label>Package Includes</label>
                                    <FieldArray
                                        name="packageIncludes"
                                        render={arrayHelpers => (
                                            <>
                                                {values?.packageIncludes?.map((_, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                        <Field
                                                            name={`packageIncludes.${index}`}
                                                            as={Input}
                                                            placeholder="Enter additional info"
                                                        />
                                                        <MinusCircleOutlined
                                                            style={{ marginLeft: '8px' }}
                                                            onClick={() => arrayHelpers.remove(index)}
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

                                {/* Timings Field */}
                                <div className="fields">
                                    <label>Timings</label>
                                    <FieldArray
                                        name="timings"
                                        render={arrayHelpers => (
                                            <>
                                                {values?.timings?.map((_, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                        <Field
                                                            name={`timings.${index}`}
                                                            as={Input}
                                                            placeholder="Enter additional info"
                                                        />
                                                        <MinusCircleOutlined
                                                            style={{ marginLeft: '8px' }}
                                                            onClick={() => arrayHelpers.remove(index)}
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
                            </div>

                            {/* Notes Field - Takes up 40% of the width */}
                            <div className="fields" style={{ width: '40%' }}>
                                <label>Notes</label>
                                <FieldArray
                                    name="notes"
                                    render={arrayHelpers => (
                                        <>
                                            {values?.notes?.map((_, index) => (
                                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                    <Field
                                                        name={`notes.${index}`}
                                                        as={Input}
                                                        placeholder="Enter additional info"
                                                    />
                                                    <MinusCircleOutlined
                                                        style={{ marginLeft: '8px' }}
                                                        onClick={() => arrayHelpers.remove(index)}
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
                        </div>

                        {/* images section */}
                        <div className="des-spec-parernt">
                            {/* Product Image Upload */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Product Image</label>
                                <Upload
                                    name="productImage"
                                    fileList={fileList}
                                    beforeUpload={(file) => {
                                        setFieldValue('productImage', file);
                                        setFileList([file]);
                                        return false;
                                    }}
                                    onRemove={() => {
                                        setFieldValue('productImage', null);
                                        setFileList([]);
                                    }}
                                    listType="picture"
                                >
                                    <Button>Upload Product Image</Button>
                                </Upload>
                                {touched.productImage && errors.productImage ? <div className="ant-form-item-explain">{errors.productImage}</div> : null}
                            </div>

                            {/* product banner Image   */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Banner Img</label>
                                <Upload
                                    name="bannerImg"
                                    fileList={bannerImgList}
                                    beforeUpload={(file) => {
                                        setFieldValue('bannerImg', file);
                                        setBannerImgList([file]);
                                        return false;
                                    }}
                                    onRemove={() => {
                                        setFieldValue('bannerImg', null);
                                        setBannerImgList([]);
                                    }}
                                    listType="picture"
                                >
                                    <Button>Upload Banner Image</Button>
                                </Upload>
                                {touched.bannerImg && errors.bannerImg ? <div className="ant-form-item-explain">{errors.bannerImg}</div> : null}
                            </div>
                        </div>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default ProductModal;
