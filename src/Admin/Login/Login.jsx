import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Input, Button } from 'antd';

const Login = () => {
  const auth = getAuth(); // Initialize Firebase Auth
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = (values, { setSubmitting, setErrors }) => {
    const { email, password } = values;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/product');
        console.log('Logged in:', user);
        // Redirect to dashboard or show success message
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error:', errorCode, errorMessage);
        alert('Incorrect password');
        setErrors({ email: 'Invalid email or password' });
        setSubmitting(false);
      });
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-heading'>Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='form-group'>
                <label className='login-label' htmlFor="email">Email</label>
                <Field name="email">
                  {({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      size="large"
                    />
                  )}
                </Field>
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className='form-group'>
                <label className='login-label' htmlFor="password">Password</label>
                <Field name="password">
                  {({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="Enter your password"
                      size="large"
                    />
                  )}
                </Field>
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              {/* <div className='form-group'> */}
                <Button type="primary" htmlType="submit" className='login-btn' disabled={isSubmitting} block size="large">
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </Button>
              {/* </div> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
