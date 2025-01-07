import React from 'react';
import { Modal, Input, Button, Typography, Row, Col } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import "../faqs.css"
const { Title } = Typography;

// Schema validation
const FAQSchema = Yup.object().shape({
    question: Yup.string().required('Question is required'),
    answer: Yup.string().required('Answer is required')
});

const FAQModal = ({ open, setOpen, addFAQ, updateFAQ, isEditing, currentFAQ }) => {

    const initialValues = {
        question: currentFAQ?.question || '',
        answer: currentFAQ?.answer || '',
    };

    const modalTitle = (
        <Title className='faqTitle' level={3} style={{ marginTop: "0px", fontWeight: "700" }}>
            {isEditing ? 'Edit FAQ' : 'Add FAQ'}
        </Title>
    );

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
                validationSchema={FAQSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (isEditing) {
                        updateFAQ({ ...currentFAQ, ...values });
                    } else {
                        addFAQ(values);
                    }
                    setSubmitting(false);
                    resetForm(); // Reset form after submission
                    setOpen(false); // Close modal after submission
                }}
            >
                {({ handleSubmit, isSubmitting, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row gutter={20}>
                            <Col className="gutter-row" span={24}>
                                <Typography.Title level={5}>Question</Typography.Title>
                                <Field name="question" as={Input} placeholder="Enter question"  />
                                {touched.question && errors.question ? (
                                    <div className="ant-form-item-explain">{errors.question}</div>
                                ) : null}
                            </Col>

                            <Col className="gutter-row" span={24}>
                                <Typography.Title level={5}>Answer</Typography.Title>
                                <Field name="answer" as={Input.TextArea} placeholder="Enter answer" rows={5} />
                                {touched.answer && errors.answer ? (
                                    <div className="ant-form-item-explain">{errors.answer}</div>
                                ) : null}
                            </Col>
                        </Row>

                        <Button
                            type="primary"
                            htmlType="button"
                            loading={isSubmitting}
                            style={{ marginTop: "20px",padding: "20px 25px", fontSize: "16px" }}
                            onClick={() => handleConfirm(handleSubmit)}
                        >
                            {isEditing ? 'Update' : 'Submit'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default FAQModal;
