import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Image, Group, Button, Card, TextInput, Textarea, Rating, Stack, Badge, Loader, Alert, Pagination } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  const reviewForm = useForm({
    initialValues: {
      rating: 0,
      comment: '',
    },
    validate: {
      rating: (value) => (value === 0 ? 'Rating is required' : null),
      comment: (value) => (value.trim().length === 0 ? 'Comment is required' : null),
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/reviews/${id}`, {
          params: { page: currentReviewPage, limit: 5 }
        });
        setReviews(res.data.reviews);
        setTotalReviewPages(res.data.totalPages);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to fetch reviews. Please try again later.');
      }
    };
    if (product) {
      fetchReviews();
    }
  }, [id, currentReviewPage, product]);

  const handleSubmitReview = async (values) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to submit a review.');
        return;
      }
      const response = await axios.post(`http://localhost:5001/api/reviews`, {
        productId: id,
        ...values,
      }, {
        headers: { 'x-auth-token': token },
      });
      setSuccessMessage('Review submitted successfully!');
      reviewForm.reset();
      // Refresh product data and reviews
      const productRes = await axios.get(`http://localhost:5001/api/products/${id}`);
      setProduct(productRes.data);
      const reviewsRes = await axios.get(`http://localhost:5001/api/reviews/${id}`, {
        params: { page: 1, limit: 5 }
      });
      setReviews(reviewsRes.data.reviews);
      setTotalReviewPages(reviewsRes.data.totalPages);
      setCurrentReviewPage(1);
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        setError(`Failed to submit review: ${error.response.data.msg || error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('Failed to submit review: No response received from server');
      } else {
        setError(`Failed to submit review: ${error.message}`);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/products/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setSuccessMessage('Product deleted successfully!');
        setTimeout(() => navigate('/products'), 2000);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleReviewPageChange = (page) => {
    setCurrentReviewPage(page);
  };

  if (loading) {
    return <Loader size="xl" mx="auto" />;
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  if (!product) {
    return <Loader size="xl" mx="auto" />;
  }

  return (
    <Container>
      <Stack spacing="xl">
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

        <Group position="apart" align="flex-start">
          <div>
            <Title order={1}>{product.name}</Title>
            <Badge color="pink" variant="light" size="lg" mt="xs">
              {product.category}
            </Badge>
          </div>
          <Group>
            <Button variant="outline" onClick={handleEdit}>Edit Product</Button>
            <Button color="red" variant="outline" onClick={handleDelete}>Delete Product</Button>
          </Group>
        </Group>

        <Group align="flex-start">
          <Image src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} alt={product.name} width={300} radius="md" />
          <Stack spacing="md" style={{ flex: 1 }}>
            <Text size="lg">{product.description}</Text>
            <Group>
              <Text size="xl" weight={700}>Average Rating:</Text>
              <Rating value={product.averageRating || 0} readOnly size="lg" />
              <Text>({product.reviews ? product.reviews.length : 0} reviews)</Text>
            </Group>
          </Stack>
        </Group>

        <Card withBorder>
          <Title order={3} mb="md">Submit a Review</Title>
          <form onSubmit={reviewForm.onSubmit(handleSubmitReview)}>
            <Stack spacing="md">
              <Group align="center">
                <Text>Your Rating:</Text>
                <Rating {...reviewForm.getInputProps('rating')} />
              </Group>
              <Textarea
                placeholder="Write your review here"
                label="Your Review"
                {...reviewForm.getInputProps('comment')}
              />
              <Button type="submit">Submit Review</Button>
            </Stack>
          </form>
        </Card>

        <Stack spacing="md">
          <Title order={2}>Reviews</Title>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review._id} withBorder>
                <Group position="apart" mb="xs">
                  <Text weight={500}>{review.user.username}</Text>
                  <Rating value={review.rating} readOnly />
                </Group>
                <Text>{review.comment}</Text>
              </Card>
            ))
          ) : (
            <Text>No reviews yet. Be the first to review this product!</Text>
          )}
          {totalReviewPages > 1 && (
            <Pagination
              total={totalReviewPages}
              value={currentReviewPage}
              onChange={handleReviewPageChange}
              position="center"
            />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default ProductDetails;

