import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { 
  AppShell,
  Burger,
  Group,
  Button,
  Box,
  Stack,
  Container,
  Title,
  Paper,
  rem,
  useMantineTheme,
  Switch,
  MantineProvider,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSun, IconMoonStars } from '@tabler/icons-react'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import AddProduct from './pages/AddProduct'
import Login from './pages/Login'
import Register from './pages/Register'

function CustomHeader({ opened, toggle, colorScheme, toggleColorScheme, isAuthenticated, handleLogout }) {
  return (
    <Paper shadow="sm">
      <Container size="lg">
        <Group justify="space-between" h={rem(60)}>
          <Group>
            <Burger 
              opened={opened} 
              onClick={toggle} 
              size="sm"
              hiddenFrom="sm"
            />
            <Title order={3} c="blue.7">ProductPulse</Title>
          </Group>
          <Group gap="xs" visibleFrom="sm">
            <Button component={Link} to="/" variant="subtle">
              Home
            </Button>
            <Button component={Link} to="/products" variant="subtle">
              Products
            </Button>
            {isAuthenticated && (
              <Button component={Link} to="/add-product" variant="subtle">
                Add Product
              </Button>
            )}
            {!isAuthenticated ? (
              <>
                <Button component={Link} to="/login" variant="outline">
                  Login
                </Button>
                <Button component={Link} to="/register" variant="filled">
                  Register
                </Button>
              </>
            ) : (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            )}
            <Switch
              checked={colorScheme === 'dark'}
              onChange={() => toggleColorScheme()}
              size="lg"
              onLabel={<IconSun size={18} />}
              offLabel={<IconMoonStars size={18} />}
            />
          </Group>
        </Group>
      </Container>
    </Paper>
  )
}

function CustomNavbar() {
  return (
    <Box p="md">
      <Stack>
        <Title order={4} mb="md">Categories</Title>
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Button 
              component={Link} 
              to="/products?category=electronics" 
              variant="light" 
              fullWidth
            >
              Electronics
            </Button>
            <Button 
              component={Link} 
              to="/products?category=clothing" 
              variant="light" 
              fullWidth
            >
              Clothing
            </Button>
            <Button 
              component={Link} 
              to="/products?category=books" 
              variant="light" 
              fullWidth
            >
              Books
            </Button>
            <Button 
              component={Link} 
              to="/products?category=home" 
              variant="light" 
              fullWidth
            >
              Home & Garden
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

function App({ colorScheme, toggleColorScheme }) {
  const [opened, { toggle }] = useDisclosure(false)
  const theme = useMantineTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/')
  }

  return (
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { desktop: false, mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <CustomHeader 
            opened={opened} 
            toggle={toggle} 
            colorScheme={colorScheme} 
            toggleColorScheme={toggleColorScheme}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
        </AppShell.Header>

        <AppShell.Navbar>
          <CustomNavbar />
        </AppShell.Navbar>

        <AppShell.Main>
          <Container size="lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

export default App

