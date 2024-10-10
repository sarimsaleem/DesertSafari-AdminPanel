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
        if (!open) {
            setFileList([]);
            setBannerImgList([])
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
                    setBannerImgList([])
                    setOpen(false);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, values, errors, touched }) => {
                    console.log(errors,"errors")
                   return (
                        <Form onSubmit={handleSubmit}>
                            {console.log(handleSubmit,"handleSubmit")}
                            <div className="des-spec-parernt">
                                {/* Product Name Field */}
                                <div className="fields">
                                    <label>Product Name</label>
                                    <Field name="image_text" as={Input} placeholder="Enter product name" />
                                    {touched.image_text && errors.image_text ? <div className="ant-form-item-explain">{errors.image_text}</div> : null}
                                </div>
    
                                {/* Product Card Detail Field */}
                                <div className="fields">
                                    <label>Product Card Detail</label>
                                    <Field name="event_name" as={Input} placeholder="Enter product card detail" />
                                    {touched.event_name && errors.event_name ? <div className="ant-form-item-explain">{errors.event_name}</div> : null}
                                </div>
                            </div>
                            {/* Is Product Most Popular */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Is Product Most Popular?</label>
                                <Field name="most_popular" type="checkbox" as={Checkbox} />
                            </div>
                            <div className="des-spec-parernt">
                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Product Category</label>
                                    <Field name="category">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select category"
                                                onChange={(value) => setFieldValue('category', value)}
                                            >
                                                <Option value="category1">Category 1</Option>
                                                <Option value="category2">Category 2</Option>
                                                <Option value="category3">Category 3</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    {touched.category && errors.category ? <div className="ant-form-item-explain">{errors.category}</div> : null}
                                </div>
                                {/* Product Price Field */}
                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Product Price</label>
                                    <Field name="price">
                                        {({ field }) => (
                                            <InputNumber
                                                {...field}
                                                onChange={(value) => setFieldValue('price', value)}
                                                min={0}
                                                placeholder="Enter product price"
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    </Field>
                                    {touched.price && errors.price ? <div className="ant-form-item-explain">{errors.price   }</div> : null}
                                </div>
                            </div>
                            {/* special note and description  */}
                            <div className="des-spec-parernt">
                                {/* Special Note Field */}
                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Special Note</label>
                                    <Field name="special_note">
                                        {({ field }) => (
                                            <Input.TextArea
                                                {...field}
                                                placeholder="Enter special note"
                                                rows={4}
                                            />
                                        )}
                                    </Field>
                                    {touched.special_note && errors.special_note ? <div className="ant-form-item-explain">{errors.special_note}</div> : null}
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
                                <div className="arrayfield-group">
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
    
                                <div className="fields">
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
                                        name="image_url"
                                        fileList={fileList}
                                        beforeUpload={(file) => {
                                            setFieldValue('image_url', file);
                                            setFileList([file]);
                                            return false;
                                        }}
                                        onRemove={() => {
                                            setFieldValue('image_url', null);
                                            setFileList([]);
                                        }}
                                        listType="picture"
                                    >
                                        <Button>Upload Product Image</Button>
                                    </Upload>
                                    {touched.image_url && errors.image_url ? <div className="ant-form-item-explain">{errors.image_url}</div> : null}
                                </div>
    
                                {/* product banner Image   */}
                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Banner Img</label>
                                    <Upload
                                        name="banner_image_url"
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
                                    >
                                        <Button>Upload Banner Image</Button>
                                    </Upload>
                                    {touched.banner_image_url && errors.banner_image_url ? <div className="ant-form-item-explain">{errors.banner_image_url}</div> : null}
                                </div>
                            </div>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Submit
                            </Button>
                        </Form>
                    )
                }}
            </Formik>
        </Modal>
    );
};

export default ProductModal;
