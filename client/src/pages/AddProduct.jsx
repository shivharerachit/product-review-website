import React, { useState } from 'react';
import { Container, Title, TextInput, Textarea, Button, Select, NumberInput, Group, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      category: '',
      imageUrl: '',
      price: 0,
      stock: 0,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
      category: (value) => (value.trim().length > 0 ? null : 'Category is required'),
      price: (value) => (value > 0 ? null : 'Price must be greater than 0'),
      stock: (value) => (Number.isInteger(value) && value >= 0 ? null : 'Stock must be a non-negative integer'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.post('https://product-review-api.vercel.app/api/products', values, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSuccessMessage('Product added successfully!');
      form.reset();
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm">
      <Title order={1} mb="xl">Add New Product</Title>
      {successMessage && (
        <Alert icon={<IconCheck size="1rem" />} title="Success" color="green" mb="md">
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mb="md">
          {error}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Name"
            placeholder="Enter product name"
            required
            {...form.getInputProps('name')}
          />
          <Textarea
            label="Description"
            placeholder="Enter product description"
            required
            minRows={3}
            {...form.getInputProps('description')}
          />
          <Select
            label="Category"
            placeholder="Select a category"
            required
            data={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'books', label: 'Books' },
              { value: 'home', label: 'Home & Garden' },
            ]}
            {...form.getInputProps('category')}
          />
          <TextInput
            label="Image URL"
            placeholder="Enter image URL"
            {...form.getInputProps('imageUrl')}
          />
          <Group grow>
            <NumberInput
              label="Price"
              placeholder="Enter price"
              required
              min={0.01}
              precision={2}
              {...form.getInputProps('price')}
            />
            <NumberInput
              label="Stock"
              placeholder="Enter stock quantity"
              required
              min={0}
              {...form.getInputProps('stock')}
            />
          </Group>
          <Button type="submit" mt="md" loading={loading}>
            Add Product
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default AddProduct;

