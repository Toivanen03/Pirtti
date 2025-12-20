import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import Config from '../utils/config'

const uploadHttpLink = new UploadHttpLink({
  uri: Config() + '/graphql',
  headers: {
    'apollo-require-preflight': 'true'
  }
})

const authLink = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('token')
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    }
  })
  return forward(operation)
})

const client = new ApolloClient({
  link: authLink.concat(authLink, uploadHttpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'ignore' },
    query: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
  }
})

export default client