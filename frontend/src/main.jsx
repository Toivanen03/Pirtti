import "./layout/styles/custom_styles.scss"
import { ApolloProvider } from "@apollo/client/react"
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import client from './contexts/auth.js'

const root = createRoot(document.getElementById('root'))

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
