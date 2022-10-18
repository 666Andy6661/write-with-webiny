// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';

const manageEndpoint = new HttpLink({
  uri: process.env.REACT_APP_WEBINY_GRAPHQL_MANAGE_URL,
  headers : {
    Authorization : `Bearer ${process.env.REACT_APP_WEBINY_GRAPHQL_TOKEN}`
  }
});

const readEndpoint = new HttpLink({
  uri: process.env.REACT_APP_WEBINY_GRAPHQL_READ_URL,
  headers : {
    Authorization : `Bearer ${process.env.REACT_APP_WEBINY_GRAPHQL_TOKEN}`
  }
});

const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().endpointType === "manage",
    manageEndpoint,
    readEndpoint,
  ),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)