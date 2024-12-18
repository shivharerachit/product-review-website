import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Image, Text, Button, Group, Badge, TextInput, Select, Loader, Alert } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const form = useForm({
    initialValues: {
      search: '',
      category: '',
      sort: 'name',
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
          form.setFieldValue('category', category);
        }
        const res = await axios.get('http://localhost:5001/api/products', { params: form.values });
        setProducts(res.data || []); // Ensure we always have an array
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again.');
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search, form.values]);

  const handleSubmit = (values) => {
    // The form submission will trigger a re-fetch due to the useEffect dependency on form.values
  };

  if (loading) {
    return (
      <Container size="xl">
        <Loader size="xl" mx="auto" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group align="end" mb="xl">
          <TextInput
            label="Search"
            placeholder="Search products"
            {...form.getInputProps('search')}
          />
          <Select
            label="Category"
            placeholder="All categories"
            data={[
              { value: '', label: 'All categories' },
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'books', label: 'Books' },
              { value: 'home', label: 'Home & Garden' },
            ]}
            {...form.getInputProps('category')}
          />
          <Select
            label="Sort by"
            placeholder="Sort by"
            data={[
              { value: 'name', label: 'Name (A-Z)' },
              { value: '-name', label: 'Name (Z-A)' },
              { value: '-createdAt', label: 'Newest first' },
              { value: 'createdAt', label: 'Oldest first' },
            ]}
            {...form.getInputProps('sort')}
          />
          <Button type="submit">Apply Filters</Button>
        </Group>
      </form>

      <Grid>
        {products.length === 0 ? (
          <Grid.Col>
            <Text align="center" color="dimmed">No products found.</Text>
          </Grid.Col>
        ) : (
          products.map((product) => (
            <Grid.Col key={product._id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                    height={160}
                    alt={product.name}
                  />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>{product.name}</Text>
                  <Badge color="pink" variant="light">
                    {product.category}
                  </Badge>
                </Group>
                <Text size="sm" color="dimmed" lineClamp={2}>
                  {product.description}
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  component={Link}
                  to={`/products/${product._id}`}
                >
                  View Details
                </Button>
              </Card>
            </Grid.Col>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default Products;

