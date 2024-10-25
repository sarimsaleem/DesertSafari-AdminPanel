import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button, Form, Card, Space, Switch } from 'antd';
import { Formik, Form as MainForm, Field } from 'formik';import { ProductSchema } from "./ProductSchema";
import "./productmodal.css";
import { CloseOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const ProductEditModal = ({ open, setOpen, update, currentProduct, categories }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);
    const formikRef = useRef();
    const [form] = Form.useForm();

    useEffect(() => {
        if (currentProduct) {
            setFileList(currentProduct.image_url ? [{
                uid: currentProduct.image_url,
                name: 'Product Image',
                status: 'done',
                url: currentProduct.image_url,
            }] : []);

            setBannerImgList(currentProduct.banner_image_url ? [{
                uid: currentProduct.banner_image_url,
                name: 'Banner Image',
                status: 'done',
                url: currentProduct.banner_image_url,
            }] : []);

            form.setFieldValue('content', currentProduct?.content)
        } else {
            setFileList([]);
            setBannerImgList([]);
        }
        if (!open) {
            formikRef?.current?.resetForm();
        }
    }, [currentProduct, open]);

    const handleCancel = () => {
        setOpen(false); // Close the modal
    };

    const onSubmitHandler = (values, { setSubmitting, resetForm }) => {
        const productId = currentProduct?._id;

        if (typeof values?.image_url === 'string') {
            delete values.image_url;
        }
        if (typeof values?.banner_image_url === 'string') {
            delete values.banner_image_url;
        }
        const updatedValues = {
            ...values,
            category: values.category
        };
        console.log(values, "values");

        update(productId, updatedValues);
        resetForm();
        setOpen(false);
    }
    // console.log(currentProduct,'currentProduct')
    return (
        <Modal
            centered
            open={open}
            onCancel={handleCancel}
            width={1000}
        >
            <Formik
                innerRef={formikRef}
                initialValues={{
                    image_text: currentProduct?.image_text || '',
                    event_name: currentProduct?.event_name || '',
                    most_popular: currentProduct?.most_popular || false,
                    category: currentProduct?.category || '',
                    price: currentProduct?.price || 0,
                    special_note: currentProduct?.special_note || '',
                    description: currentProduct?.description || '',
                    image_url: currentProduct?.image_url || null,
                    banner_image_url: currentProduct?.banner_image_url || null,
                    content: currentProduct?.content || [{ title: " ", data: [{ item: "", itemDescription: "" }] }]
                    
                }}
                enableReinitialize={true}
                validateOnChange={true}
                validationSchema={ProductSchema}
                onSubmit={onSubmitHandler}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, errors, touched, values }) => (
                    <MainForm onSubmit={handleSubmit}>
                        {/* Product Name Field */}
                        <div className="des-spec-parernt">
                            <div className="fields">
                                <label>Product Name</label>
                                <Field name="image_text" as={Input} placeholder="Enter product name" />
                                {touched.image_text && errors.image_text ? <div className="ant-form-item-explain">{errors.image_text}</div> : null}
                            </div>

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

                        {/* Product Category and Price Field */}
                        <div className="des-spec-parernt">
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
                                        <TextArea
                                            {...field}
                                            placeholder="Enter special note"
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                {touched.special_note && errors.special_note ? <div className="ant-form-item-explain">{errors.special_note}</div> : null}
                            </div>
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Description</label>
                                <Field name="description">
                                    {({ field }) => (
                                        <TextArea
                                            {...field}
                                            placeholder="Enter product description"
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                {touched.description && errors.description ? <div className="ant-form-item-explain">{errors.description}</div> : null}
                            </div>
                        </div>

                        <Form form={form} name="dynamic_form_complex" onValuesChange={(changedValues, allValues) => {
                            setFieldValue("content", allValues.content);
                        }} style={{ maxWidth: "100%" }} autoComplete="off">
                            <Form.Item label="Hide Icon">
                                <Switch defaultChecked={false} onChange={(checked) => setFieldValue('featureEnabled', checked)} />
                            </Form.Item>

                            <Form.List name="content">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {console.log('fields',fields)}
                                        {fields.map((field) => (
                                            <Card
                                                size="small"
                                                title="Content"  // Updated title
                                                key={field.key}
                                                extra={<CloseOutlined onClick={() => remove(field.name)} />}
                                            >
                                                <Form.Item label="Title" name={[field.name, 'title']}>
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item label="Data">
                                                    <Form.List name={[field.name, 'data']}>
                                                        {(dataFields, dataOpt) => (
                                                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                                {dataFields.map((dataField) => (
                                                                    <Space key={dataField.key}>
                                                                        <Form.Item name={[dataField.name, 'item']} noStyle>
                                                                            <Input placeholder="Item" />
                                                                        </Form.Item>
                                                                        <Form.Item name={[dataField.name, 'itemDescription']} noStyle>
                                                                            <Input placeholder="Item Description" />
                                                                        </Form.Item>
                                                                        <CloseOutlined onClick={() => dataOpt.remove(dataField.name)} />
                                                                    </Space>
                                                                ))}
                                                                <Button type="dashed" onClick={() => dataOpt.add()} block>
                                                                    + Add Data Item
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>
                                            </Card>
                                        ))}

                                        <Button type="dashed" onClick={() => add()} block style={{ marginBottom: "35px" }}>
                                            + Add Content Item
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form>

                        <div className="des-spec-parernt">
                            {/* Product Image Upload */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Product Image</label>
                                <Upload
                                    name="image_url"
                                    fileList={fileList}
                                    beforeUpload={(file) => {
                                        setFieldValue('image_url', file);
                                        setFileList([{
                                            uid: file.uid,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                        }]);
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
                                {touched.image_url && errors.image_url ? (
                                    <div className="ant-form-item-explain">{errors.image_url}</div>
                                ) : null}
                            </div>

                            {/* Banner Image Upload */}
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Banner Image</label>
                                <Upload
                                    name="banner_image_url"
                                    fileList={bannerImgList}
                                    beforeUpload={(file) => {
                                        setFieldValue('banner_image_url', file);
                                        setBannerImgList([{
                                            uid: file.uid,
                                            name: file.name,
                                            status: 'done',
                                            url: URL.createObjectURL(file),
                                        }]);
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
                                {touched.banner_image_url && errors.banner_image_url ? (
                                    <div className="ant-form-item-explain">{errors.banner_image_url}</div>
                                ) : null}
                            </div>
                        </div>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Submit
                        </Button>
                    </MainForm>
                )}
            </Formik>
        </Modal>
    );
};

export default ProductEditModal;
