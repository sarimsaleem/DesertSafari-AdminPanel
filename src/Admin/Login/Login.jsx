import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage(); 

  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in:', user);
      showSuccessMessage();
      
      setTimeout(() => {
        navigate('/');
      }, 2000); 
      
    } catch (error) {
      console.error('Error:', error.code, error.message);
      form.setFields([
        { name: 'email', errors: [''] },
        { name: 'password', errors: [] },
      ]);
      showErrorMessage(); 
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="login-container">
      {contextHolder} 
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
              { min: 6, message: 'Password must be at least 6 characters!' }, 
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
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
