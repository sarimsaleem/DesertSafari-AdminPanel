import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const auth = getAuth(); // Initialize Firebase Auth
    const navigate = useNavigate()
  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSignup = (values, { setSubmitting, setErrors }) => {
    const { email, password } = values;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/prod uct")
        console.log('Signed up:', user);
        // Redirect to dashboard or show success message
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error:', errorCode, errorMessage);
        setErrors({ email: errorMessage }); // Set email-related error from Firebase
        setSubmitting(false);
      });
  };

  return (
    <div className='signup'>
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className='form-group'>
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                className="form-control"
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className='form-group'>
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <div className='form-group'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage name="confirmPassword" component="div" className="error-message" />
            </div>

            <div className='form-group'>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
