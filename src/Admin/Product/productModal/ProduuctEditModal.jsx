import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button } from 'antd';
import { Formik, Form, Field, FieldArray } from 'formik';
import { ProductSchema } from "./ProductSchema";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./productmodal.css";
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const ProductEditModal = ({ open, setOpen, update, currentProduct, categories }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);
    const formikRef = useRef()
    console.log('currentProduct:', currentProduct);

    // Initial values for the form
    const [initialValues, setInitialValues] = useState({});

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
        } else {
            setFileList([]);
            setBannerImgList([]);
        }
        if (open) {
            console.log('open', open)
            setInitialValues({
                image_text: currentProduct?.image_text || '',
                event_name: currentProduct?.event_name || '',
                most_popular: currentProduct?.most_popular || false,
                category: currentProduct?.category || '',
                price: currentProduct?.price || 0,
                special_note: currentProduct?.special_note || '',
                description: currentProduct?.description || '',
                packageIncludes: currentProduct?.packageIncludes || [],
                notes: currentProduct?.notes || [],
                timings: currentProduct?.timings || [],
                image_url: currentProduct?.image_url || null,
                banner_image_url: currentProduct?.banner_image_url || null,
                additionalFields: currentProduct?.additionalFields || []
            })
        } else {
            console.log('close', open)
            formikRef?.current?.resetForm();
        }
    }, [currentProduct, open]);

    const handleCancel = () => {
        setOpen(false); // Close the modal
    };

    const onSubmitHandler = (values, { setSubmitting, resetForm }) => {
        if (typeof values?.image_url === 'string') {
            delete values.image_url;
        }
        if (typeof values?.banner_image_url === 'string') {
            delete values.banner_image_url;
        }
        // console.log('Updated Product values:', values);

        update(currentProduct.id, values);
        // setSubmitting(false);
        resetForm();
        setOpen(false);
    }

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
                    description: currentProduct?.description || 'Ssarim',
                    packageIncludes: currentProduct?.packageIncludes || [],
                    notes: currentProduct?.notes || [],
                    timings: currentProduct?.timings || [],
                    image_url: currentProduct?.image_url || null,
                    banner_image_url: currentProduct?.banner_image_url || null,
                    additionalFields: currentProduct?.additionalFields || []
                }}
                validateOnChange={true}
                validationSchema={ProductSchema}
                onSubmit={onSubmitHandler}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, errors, touched, values }) => (
                    <Form onSubmit={handleSubmit}>
                        {console.log('values', values)}
                        {console.log('initialValues', initialValues)}
                        {/* Product Name Field Product Card Detail Field*/}
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

                        {/* Product Category Product Price Field  */}
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
                                                <Option key={category._id} value={category.name}>
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

                        {/* special note and description  */}
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
                            <div className="fields" style={{ marginBottom: '16px' }}>
                                <label>Description</label>
                                <Field name="description">
                                    {({ field }) => (
                                    <TextArea
                                        {...field}
                                        placeholder="Enter product description"
                                        value={values?.description}
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
                                        url: URL.createObjectURL(file), // Generate URL for display
                                    }]);
                                    return false; // Prevent auto-upload
                                }}
                                onRemove={() => {
                                    setFieldValue('image_url', null); // Clear the field value in Formik
                                    setFileList([]); // Reset file list
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
                                        url: URL.createObjectURL(file), // Generate URL for display
                                    }]);
                                    return false; // Prevent auto-upload
                                }}
                                onRemove={() => {
                                    setFieldValue('banner_image_url', null); // Clear the field value in Formik
                                    setBannerImgList([]); // Reset banner image list
                                }}
                                listType="picture"
                            >
                                <Button>Upload Banner Image</Button>
                            </Upload>
                            {touched.banner_image_url && errors.banner_image_url ? (
                                <div className="ant-form-item-explain">{errors.banner_image_url}</div>
                            ) : null}
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

export default ProductEditModal;
