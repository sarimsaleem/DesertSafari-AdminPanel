import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage(); // Create message API

  const showSuccessMessage = () => {
    messageApi.open({
      type: 'success',
      content: 'Login successful! Redirecting...',
    });
  };

  const showErrorMessage = () => {
    messageApi.open({
      type: 'error',
      content: 'Invalid email or password. Please try again.',
    });
  };

  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in:', user);
      showSuccessMessage(); // Show success message
      
      // Delay navigation to allow the message to be displayed
      setTimeout(() => {
        navigate('/product'); 
      }, 2000); // Adjust the delay time (2000ms = 2 seconds) as needed

    } catch (error) {
      console.error('Error:', error.code, error.message);
      form.setFields([
        { name: 'email', errors: [''] },
        { name: 'password', errors: [] },
      ]);
      showErrorMessage(); // Show error message
    }
  };

  return (
    <div className="login-container">
      {contextHolder} {/* Render the context holder for messages */}
      <div className="login-box">
        <Typography.Title level={2} className="login-heading">Login</Typography.Title>
        
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
          validateTrigger="onSubmit"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'The input is not a valid email!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your Password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }, // Password length validation
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="">
              {/* Forgot password */}
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Log in
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
