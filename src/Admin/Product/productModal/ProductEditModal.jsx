import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button, Form, Card, Space, Switch, Row, Col, Typography } from 'antd';
import { Formik, Form as MainForm, Field, FieldArray } from 'formik';
import "./productmodal.css";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
  
const { Option } = Select;

const ProductEditModal = ({ open, setOpen, update, currentProduct, categories }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);
    const formikRef = useRef();
    const [form] = Form.useForm();

    const ProductSchema = Yup.object().shape({
        image_text: Yup.string().required('Product Name is required'),
        event_name: Yup.string().required('Product Card Detail is required'),
        category: Yup.string().required('Product Category is required'),
        image_url: Yup.mixed().required('Product Image is required'),
        banner_image_url: Yup.mixed().required('Banner Image is required'),
        price: Yup.number().required('Product Price is required').min(1, 'Price must be greater than 0'),
    });

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

    const handleConfirm = (formikSubmit) => {
            Modal.confirm({
                title: "Are you sure?",
                content: "Do you want to proceed with submitting this form?",
                okText: "Yes",
                cancelText: "No",
                onOk: () => {
                    // Trigger the Formik submit handler
                    formikSubmit();
                },
            });
        };

    return (
        <Modal
            title={<Typography.Title level={4} style={{ margin: 0, fontWeight: "700", textAlign: "center" }}>Update Product</Typography.Title>}
            centered
            open={open}
            onCancel={handleCancel}
            width={1000}    
            footer={null}
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
                        <Row gutter={20}>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Name</Typography.Title>
                                <Field name="image_text" as={Input} placeholder="Enter product name" />
                                {touched?.image_text && errors?.image_text ? renderError(errors?.image_text) : null}
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Card Detail</Typography.Title>
                                <Field name="event_name" as={Input} placeholder="Enter product card detail" />
                                {touched?.event_name && errors?.event_name ? renderError(errors?.event_name) : null}
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Typography.Title level={5}>Is Product Most Popular?</Typography.Title>
                                <Field name="most_popular">
                                    {({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={values.most_popular} // Bind the switch value
                                            onChange={(checked) => setFieldValue('most_popular', checked)}
                                        />
                                    )}
                                </Field>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Category</Typography.Title>
                                <Field name="category">
                                    {({ field }) => (
                                        <Select
                                            {...field}
                                            style={{ width: '100%' }}
                                            placeholder="Select category"
                                            onChange={(value) => setFieldValue('category', value)}
                                        >
                                            {categories?.map((category) => (
                                                <Option key={category?._id} value={category?._id}>
                                                    {category?.category_name}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </Field>

                                {touched?.category && errors?.category ? renderError(errors?.category) : null}

                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Price</Typography.Title>
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
                                {touched?.price && errors?.price ? renderError(errors?.price) : null}
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Special Note</Typography.Title>
                                <Field name="special_note">
                                    {({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Enter special note"
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                {touched?.special_note && errors?.special_note ? renderError(errors?.special_note) : null}
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Description</Typography.Title>

                                <Field name="description">
                                    {({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Enter product description"
                                            rows={4}
                                        />
                                    )}
                                </Field>
                                {touched?.description && errors?.description ? renderError(errors?.description) : null}
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Typography.Title level={5}>Content</Typography.Title>
                                <FieldArray name="content">
                                    {({ insert, remove, push }) => (
                                        <>
                                            {values?.content.map((value, index) => (
                                                <Card
                                                    size="small"
                                                    title={value?.title || 'Item'}
                                                    key={index}
                                                    extra={<CloseOutlined onClick={() => remove(index)} />}
                                                >
                                                    <Field
                                                        name={`content.${index}.title`}
                                                        as={Input}
                                                        placeholder="Enter title"
                                                    />
                                                    <Switch
                                                        checked={value?.hide_icon}
                                                        style={{ marginTop: "20px", marginBottom: "20px" }}
                                                        onChange={(checked) => setFieldValue(`content.${index}.hide_icon`, checked)}
                                                    />
                                                    <Field
                                                        name={`content.${index}.description`}
                                                        as={Input.TextArea}
                                                        placeholder="Enter a description for the content"
                                                        rows={4}
                                                        style={{ marginBottom: "20px" }}
                                                    />

                                                    {console.log('vavleus', values)}

                                                    {/* Nested FieldArray for data items */}
                                                    <FieldArray name={`content.${index}.data`}>
                                                        {({ remove: removeDataItem, push: pushDataItem }) => (
                                                            <>
                                                                {value.data?.map((dataItem, dataIndex) => (
                                                                    <Space key={dataIndex} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                        <Field
                                                                            name={`content.${index}.data.${dataIndex}.item`}
                                                                            as={Input}
                                                                            placeholder="Item"
                                                                        />
                                                                        <Field
                                                                            name={`content.${index}.data.${dataIndex}.itemDescription`}
                                                                            as={Input}
                                                                            placeholder="Item Description"
                                                                        />
                                                                        <CloseOutlined onClick={() => removeDataItem(dataIndex)} />
                                                                    </Space>
                                                                ))}
                                                                <Button
                                                                    type="dashed"
                                                                    onClick={() => pushDataItem({ item: '', itemDescription: '' })}
                                                                    block
                                                                >
                                                                    + Add Data Item
                                                                </Button>
                                                            </>
                                                        )}
                                                    </FieldArray>
                                                </Card>
                                            ))}
                                            <Button
                                                type="dashed"
                                                onClick={() =>
                                                    push({
                                                        _id: uuidv4(),
                                                        title: '',
                                                        hide_icon: true,
                                                        data: [{ item: '', itemDescription: '' }],
                                                    })
                                                }
                                                block
                                            >
                                                + Add Content Item
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                            </Col>

                            <Col className="gutter-row" span={12}>

                                <Typography.Title level={5}>Image</Typography.Title>

                                <Upload
                                    // listType="picture-card"
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
                                    listType="picture-card"
                                    maxCount={1}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                                {touched?.image_url && errors?.image_url ? renderError(errors?.image_url) : null}
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Typography.Title level={5}>Banner Image</Typography.Title>
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
                                    listType="picture-card"
                                    maxCount={1}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                                {touched?.banner_image_url && errors?.banner_image_url ? renderError(errors?.banner_image_url) : null}
                            </Col>
                        </Row>

                        <Button type="primary" htmlType="button" loading={isSubmitting} style={{ marginTop: "20px",padding: "20px 25px", fontSize: "16px" }} onClick={() => handleConfirm(handleSubmit)}>
                            Update
                        </Button>
                    </MainForm>
                )}
            </Formik>
        </Modal>
    );
};

export default ProductEditModal;
