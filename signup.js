import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImage from './signup.jpg';
import axios from 'axios';

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${backgroundImage}) center/cover no-repeat;
`;

const SignupForm = styled(Form)`
  max-width: 400px;
  width: 100%;
  padding: 30px;
  background: #f5e2ca;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
    transform: scale(1.02);
  }
`;

const CustomInput = styled(Input)`
  height: 48px;
`;

const CustomPasswordInput = styled(Input.Password)`
  height: 48px;
`;

const SignupButton = styled(Button)`
  background-color: #8B4513;
  border-color: #8B4513;
  color: #fff;
  font-weight: bold;

  &:hover {
    background-color: #A0522D;
    border-color: #A0522D;
  }
`;

const StyledLink = styled(Link)`
  color: #3498db;
  &:hover {
    color: #2980b9;
  }
`;

const BlockbusterText = styled.h2`
  text-align: center;
  color: #8B4513;
  margin-bottom: 16px;
  font-size: 36px;
  font-family: 'Georgia', serif;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Signup = () => {
  const navigate = useNavigate();

  const openNotification = (type, message) => {
    notification[type]({
      message: 'Notification',
      description: message,
    });
  };

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:8081/signup', values);
      openNotification('success', 'Signup successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error.message);
      if (error.response && error.response.status === 400) {
        openNotification('error', 'Username or email already exists. Please choose another.');
      }
    }
  };

  return (
    <SignupContainer>
      <SignupForm
        name="signup-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <BlockbusterText>Sign Up for BlogBuster</BlockbusterText>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <CustomInput
            prefix={<UserOutlined style={{ color: '#8B4513' }} />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <CustomInput
            prefix={<MailOutlined style={{ color: '#8B4513' }} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <CustomPasswordInput
            prefix={<LockOutlined style={{ color: '#8B4513' }} />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <SignupButton type="primary" htmlType="submit" block>
            Sign Up
          </SignupButton>
        </Form.Item>
        <Form.Item>
          <p>
            Already have an account? <StyledLink to="/login">Sign in</StyledLink>
          </p>
        </Form.Item>
      </SignupForm>
    </SignupContainer>
  );
};

export default Signup;
