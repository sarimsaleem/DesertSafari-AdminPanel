import React, { useState, useEffect } from 'react';
import { Formik, Form as MainForm, Field, FieldArray } from 'formik';
import { ProductSchema } from "./ProductSchema";
import "./productmodal.css";
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Input, Checkbox, Select, Upload, InputNumber, Button, Form, Card, Space, Switch, Col, Row, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const ProductModal = ({ open, setOpen, addProduct, categories }) => {
    const [fileList, setFileList] = useState([]);
    const [bannerImgList, setBannerImgList] = useState([]);
    const [form] = Form.useForm();

    const initialValues = {
        image_text: 'sarim',
        event_name: 'sarim',
        most_popular: false,
        category: 'Desert supari',
        price: 10,
        special_note: 'sarim',
        description: 'sarim',
        image_url: null,
        banner_image_url: null,
        content: [{ title: " ", data: [{ item: "", itemDescription: "" }] }],
        hide_icon: false
    };

    useEffect(() => {
        if (!open) {
            setFileList([]);
            setBannerImgList([]);
        }
    }, [open]);

    const renderError = (mesage) => {
        return mesage ? (
            <Typography.Text type="danger">{mesage}</Typography.Text>
        ) : null
    }

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
                    console.log(values, "values");
                    addProduct(values);
                    setSubmitting(false);
                    resetForm({
                        values: {
                            ...initialValues,
                            content: [{ title: " ", data: [{ item: "", itemDescription: "" }] }]
                        }
                    });
                    form.resetFields();
                    setFileList([]);
                    setBannerImgList([]);
                    setOpen(false);
                }}
            >
                {({ setFieldValue, handleSubmit, isSubmitting, values, errors, touched }) => {
                    const handleFormValuesChange = (_, allValues) => {
                        setFieldValue("content", allValues.content);
                    };
                    console.log(errors, values)
                    return (
                        <MainForm onSubmit={handleSubmit}>
                            <Row gutter={20}>
                                <Col className="gutter-row" span={12}>
                                    <Typography.Title level={5}>Prouct Name</Typography.Title>
                                    <Field name="image_text" as={Input} placeholder="Enter product name" />
                                    {touched?.image_text && errors?.image_text ? renderError(errors?.image_text) : null}
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Typography.Title level={5}>Product Card Detail</Typography.Title>
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
                                    <Typography.Title level={5}>Product Category</Typography.Title>
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
                                    <Typography.Title level={5}>Product Price</Typography.Title>
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
                                    <Typography.Title level={5}>special Note</Typography.Title>
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
                                    <Typography.Title level={5}>Product description</Typography.Title>

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

                                    <FieldArray name="content">
                                        {({ insert, remove, push }) => {
                                            return (
                                                <>
                                                    {values?.content.map((value, index) => {
                                                        return (
                                                            <Card
                                                                size="small"
                                                                title={value?.title || 'Item'}
                                                                key={index}
                                                                extra={<CloseOutlined onClick={() => { remove(index); }} />}
                                                            >

                                                                <Field name={`content.${index}.title`} as={Input} placeholder="Enter product name" />
                                                                <Switch
                                                                    checked={value?.hide_icon} // Bind the switch value
                                                                    onChange={(checked) => setFieldValue(`content.${index}.hide_icon`, checked)}
                                                                />

                                                                {/* </Form.Item> */}

                                                                {/* <Form.Item label="Enable List Icon">
                          <Switch
                              checked={values.hide_icon} // Bind the switch value
                              onChange={(checked) => setFieldValue('hide_icon', checked)}
                          />
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
                                              <CloseOutlined onClick={() => { dataOpt.remove(dataField.name); }} />
                                          </Space>
                                      ))}
                                      <Button type="dashed" onClick={() => dataOpt.add()} block>
                                          + Add Data Item
                                      </Button>
                                  </div>
                              )}
                          </Form.List>
                      </Form.Item> */}
                                                            </Card>
                                                        )
                                                    })}
                                                    <Button type="dashed" onClick={() => push({
                                                        _id: uuidv4(),
                                                        title: '',
                                                        content: [],
                                                        hide_icon: true
                                                    })} block>
                                                        + Add Content Item
                                                    </Button>
                                                </>
                                            )
                                        }}
                                    </FieldArray>
                                    {/* <Form.List name="content">
                              {(fields, { add, remove }) => (
                                  <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                      {fields.map((field) => (
                                          <Card
                                              size="small"
                                              title={`Item ${field.title + 1}`}
                                              key={field.key}
                                              extra={<CloseOutlined onClick={() => { remove(field.name); }} />}
                                          >
                                              <Form.Item label="Title" name={[field.name, 'title']}>
                                                  <Input />
                                              </Form.Item>

                                              <Form.Item label="Enable List Icon">
                                                  <Switch
                                                      checked={values.hide_icon} // Bind the switch value
                                                      onChange={(checked) => setFieldValue('hide_icon', checked)}
                                                  />
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
                                                                      <CloseOutlined onClick={() => { dataOpt.remove(dataField.name); }} />
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
                          </Form.List> */}
                                </Col>
                                <Col className="gutter-row" span={12}>

                                    <Typography.Title level={5}>Product Image</Typography.Title>

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
                                        maxCount={1}
                                    >
                                        <Button>Select Image</Button>
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
                                        listType="picture"
                                        maxCount={1}
                                    >
                                        <Button>Select Banner Image</Button>
                                    </Upload>
                                    {touched?.banner_image_url && errors?.banner_image_url ? renderError(errors?.banner_image_url) : null}
                                </Col>
                            </Row>

                            {/* Is Product Most Popular */}

                            {/* <div className="des-spec-parernt"> */}
                            {/* Product Category */}
                            {/* <div className="fields" style={{ marginBottom: '16px' }}> */}

                            {/* </div> */}

                            {/* Product Price Field */}
                            {/* <div className="fields" style={{ marginBottom: '16px' }}> */}
                            {/* <label>Product Price</label> */}

                            {/* </div> */}
                            {/* </div> */}

                            {/* Special Note and Description */}
                            {/* <div className="des-spec-parernt">
                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Special Note</label>
                                  
                                </div>

                                <div className="fields" style={{ marginBottom: '16px' }}>
                                    <label>Description</label>
                                   
                                </div>
                            </div> */}

                            {/* <FieldArray name="friends">
{({ insert, remove, push }) => ( */}

                            {/* Ant Design Form for Dynamic Fields */}
                            {/* <Form
                                form={form}
                                name="dynamic_form_complex"
                                onValuesChange={handleFormValuesChange}
                                style={{ maxWidth: "100%" }}
                                initialValues={initialValues}
                                autoComplete="off"
                            >
                                {/* Switch Component */}



                            {/* </Form> */}

                            {/* Images Section */}

                            {/* Submit Button */}
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Submit
                            </Button>
                        </MainForm>
                    );
                }}
            </Formik>
        </Modal>
    );
};

export default ProductModal;
