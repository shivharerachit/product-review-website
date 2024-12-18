import { Container, Title, Text, Button, Group, Paper, Stack, rem, SimpleGrid, Card, Image, Badge, ThemeIcon } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconStar, IconTrendingUp, IconUsers, IconShoppingCart } from '@tabler/icons-react'

function FeatureCard({ icon, title, description }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <ThemeIcon size="xl" radius="md" variant="light" color="blue" mb="md">
        {icon}
      </ThemeIcon>
      <Text size="lg" weight={500} mb="xs">{title}</Text>
      <Text size="sm" color="dimmed">
        {description}
      </Text>
    </Card>
  )
}

function Home() {
  return (
    <Container size="xl">
      <Stack spacing="xl">
        <Paper
          p={rem(40)}
          radius="md"
          style={{
            backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
          }}
        >
          <Title order={1} size="h1" mb="md" c="white">
            Welcome to ProductPulse
          </Title>
          <Text size="xl" mb="xl" c="white">
            Discover, review, and pulse-check the latest products! Join our vibrant community of reviewers and share your experiences.
          </Text>
          <Group>
            <Button
              component={Link}
              to="/products"
              size="lg"
              variant="filled"
              color="blue"
            >
              Explore Products
            </Button>
            <Button
              component={Link}
              to="/add-product"
              size="lg"
              variant="white"
              color="dark"
            >
              Add a Product
            </Button>
          </Group>
        </Paper>

        <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <FeatureCard
            icon={<IconStar size={rem(24)} />}
            title="Honest Reviews"
            description="Get authentic insights from real users to make informed decisions."
          />
          <FeatureCard
            icon={<IconTrendingUp size={rem(24)} />}
            title="Trending Products"
            description="Stay updated with the latest and most popular products in various categories."
          />
          <FeatureCard
            icon={<IconUsers size={rem(24)} />}
            title="Community-Driven"
            description="Join a thriving community of product enthusiasts and share your experiences."
          />
          <FeatureCard
            icon={<IconShoppingCart size={rem(24)} />}
            title="Diverse Categories"
            description="Explore a wide range of products across multiple categories."
          />
        </SimpleGrid>

        <Paper withBorder p="xl" radius="md">
          <Title order={2} mb="xl">Featured Categories</Title>
          <SimpleGrid cols={4} spacing="lg" breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 },
          ]}>
            {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map((category) => (
              <Card key={category} padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={`https://source.unsplash.com/featured/?${category}`}
                    height={160}
                    alt={category}
                  />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>{category}</Text>
                  <Badge color="pink" variant="light">
                    New
                  </Badge>
                </Group>
                <Button
                  component={Link}
                  to={`/products?category=${category.toLowerCase()}`}
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  View Products
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Paper>
      </Stack>
    </Container>
  )
}

export default Home

