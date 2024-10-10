import React, { useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const CategorySchema = Yup.object().shape({
    category_name: Yup.string().required('Category name is required'),
});

const CategoriesModal = ({ open, setOpen, addCategory, updateCategory, isEditing, currentCategory }) => {
    const initialValues = {
        category_name: currentCategory?.category_name || '', // Use currentCategory if editing
    };

    // Dynamically change the title of the modal based on the editing state
    const modalTitle = isEditing ? 'Edit Category' : 'Add Category';

    return (
        <Modal
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width={600}
            footer={null}
            title={modalTitle} // Set the modal title based on isEditing
        >
            <Formik
                enableReinitialize={true} // Ensures form reinitializes when currentCategory changes
                initialValues={initialValues}
                validationSchema={CategorySchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (isEditing) {
                        // If editing, update the category
                        updateCategory({ ...currentCategory, ...values });
                    } else {
                        // If not editing, add a new category
                        addCategory(values);
                    }
                    setSubmitting(false);
                    resetForm();
                    setOpen(false);
                }}
            >
                {({ handleSubmit, isSubmitting, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="fields">
                            <label>Category Name</label>
                            <Field
                                name="category_name"
                                as={Input}
                                placeholder="Enter category name"
                            />
                            {touched.category_name && errors.category_name ? (
                                <div className="ant-form-item-explain">{errors.category_name}</div>
                            ) : null}
                        </div>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ marginTop: '20px' }}>
                            {isEditing ? 'Update' : 'Submit'} {/* Button text changes based on isEditing */}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CategoriesModal;
