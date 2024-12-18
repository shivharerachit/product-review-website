import React from 'react';
import { Container, Title, TextInput, PasswordInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length > 0 ? null : 'Username is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5001/api/users/register', values);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container>
      <Title order={1}>Register</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          placeholder="Your username"
          {...form.getInputProps('username')}
        />
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
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;