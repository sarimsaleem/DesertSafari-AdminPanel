import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
    
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
        <Title className='faqTitle' level={3} style={{ marginTop: "10px", marginBottom: "35px" }}>
            {isEditing ? 'Edit FAQ' : 'Add FAQ'}
        </Title>
    );

    useEffect(() => {
        if (open && currentFAQ) {
            // If editing, set initial values to current FAQ
        }
    }, [currentFAQ, open]);

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
                    console.log("Current FAQ before update:", currentFAQ);
                    if (isEditing) {
                        updateFAQ({ ...currentFAQ, ...values });
                    } else {
                        addFAQ(values);
                    }
                    setSubmitting(false);
                    resetForm();
                    setOpen(false);
                }}
            >
                {({ handleSubmit, isSubmitting, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="fields">
                            <label className='faq-Label'>Question</label>
                            <Field
                                name="question"
                                as={Input}
                                placeholder="Enter question"
                            />
                            {touched.question && errors.question ? (
                                <div className="ant-form-item-explain">{errors.question}</div>
                            ) : null}
                        </div>

                        <div className="fields">
                            <label className='faq-Label'>Answer</label>
                            <Field
                                name="answer"
                                as={Input.TextArea}
                                placeholder="Enter answer"
                                rows={4}
                            />
                            {touched.answer && errors.answer ? (
                                <div className="ant-form-item-explain">{errors.answer}</div>
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

export default FAQModal;
