import React from 'react';
import { Container, Title, TextInput, PasswordInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 0 ? null : 'Password is required'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post('https://product-review-api.vercel.app/api/users/login', values);
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container>
      <Title order={1}>Login</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />
        <Button type="submit" mt="md">
          Login
        </Button>
      </form>
    </Container>
  );
}

export default Login;

