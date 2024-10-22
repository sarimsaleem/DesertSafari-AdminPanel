import React, { useState, useEffect } from 'react';
import { Formik, Form as MainForm, Field } from 'formik';
import { ProductSchema } from "./ProductSchema";
import "./productmodal.css";
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button, Form, Card, Space, Typography } from 'antd';


const { Option } = Select;

const ProductModal = ({ open, setOpen, addProduct, categories }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);
    const [form] = Form.useForm();

    const initialValues = {
        image_text: '',
        event_name: '',
        most_popular: false,
        category: '',
        price: 0,
        special_note: '',
        description: '',
        image_url: null,
        banner_image_url: null,
        // items: [{ name: '', list: [{ first: '', second: '' }] }]
        items: [{name: " ", list: [{ first: "", second: "" }] }]
    
    };

    [{name}]

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
                validationSchema={ProductSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    addProduct(values);
                    setSubmitting(false);
                    resetForm();
                    setFileList([]);    
                    setBannerImgList([]);
                    setOpen(false);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, values, errors, touched }) => {
                    return (
                        <MainForm onSubmit={handleSubmit}>
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
                                {/* Product Category */}
                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Product Category</label>
                                    <Field name="category">
                                        {({ field, form: { touched, errors, setFieldValue } }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select category"
                                                onChange={(value) => setFieldValue('category', value)}
                                            >
                                                {categories.map((category) => (
                                                    <Option key={category._id} value={category._id}>
                                                        {category.category_name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Field>
                                    {touched.category && errors.category ? (
                                        <div className="ant-form-item-explain">{errors.category}</div>
                                    ) : null}
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
                                    {touched.price && errors.price ? <div className="ant-form-item-explain">{errors.price}</div> : null}
                                </div>
                            </div>

                            {/* Special Note and Description */}
                            <div className="des-spec-parernt">
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

                            <Form labelCol={{ span: 6, }} wrapperCol={{ span: 18, }} form={form} name="dynamic_form_complex"
                                style={{ maxWidth: 600, }} autoComplete="off" initialValues={initialValues}
                            >
                                <Form.List name="items">
                                    {(fields, { add, remove }) => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                rowGap: 16,
                                                flexDirection: 'column',
                                            }}
                                        >
                                            {fields.map((field) => (
                                                <Card
                                                    size="small"
                                                    title={`Item ${field.name + 1}`}
                                                    key={field.key}
                                                    extra={<CloseOutlined onClick={() => { remove(field.name); }} />}
                                                >
                                                    <Form.Item label="Name" name={[field.name, 'name']}>
                                                        <Input />
                                                    </Form.Item>

                                                    {/* Nest Form.List */}
                                                    <Form.Item label="List">
                                                        <Form.List name={[field.name, 'list']}>
                                                            {(subFields, subOpt) => (
                                                                <div
                                                                    style={{ display: 'flex', flexDirection: 'column', rowGap: 16,
                                                                    }}
                                                                >
                                                                    {subFields.map((subField) => (
                                                                        <Space key={subField.key}>
                                                                            <Form.Item noStyle name={[subField.name, 'first']}>
                                                                                <Input placeholder="first" />
                                                                            </Form.Item>
                                                                            <Form.Item noStyle name={[subField.name, 'second']}>
                                                                                <Input placeholder="second" />
                                                                            </Form.Item>
                                                                            <CloseOutlined
                                                                                onClick={() => {
                                                                                    subOpt.remove(subField.name);
                                                                                }}
                                                                            />
                                                                        </Space>
                                                                    ))}
                                                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                                                        + Add Sub Item
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </Form.List>
                                                    </Form.Item>
                                                </Card>
                                            ))}

                                            <Button type="dashed" onClick={() => add()} block style={{marginBottom: "35px"}}>
                                                + Add Item
                                            </Button>
                                        </div>
                                    )}
                                </Form.List>
                                <Form.Item noStyle shouldUpdate>
                                    {() => (
                                        <Typography>
                                            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                                        </Typography>
                                    )}
                                </Form.Item>
                            </Form>

                            {/* images section */}
                            <div className="des-spec-parernt">
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
                                </div>
                            </div>

                            <div style={{ textAlign: 'left', marginTop: '16px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Add Product
                                </Button>
                            </div>
                        </MainForm>
                    );
                }}
            </Formik>
        </Modal>
    );
};

export default ProductModal;