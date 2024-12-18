import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, createTheme } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import '@mantine/core/styles.css'
import App from './App'

const theme = createTheme({
  primaryColor: 'blue',
})

function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <MantineProvider theme={{ ...theme, colorScheme }} defaultColorScheme="light">
      {children({ colorScheme, toggleColorScheme })}
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {({ colorScheme, toggleColorScheme }) => (
          <App colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
        )}
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

