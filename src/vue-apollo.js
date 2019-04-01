import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloLink } from 'apollo-link';
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client';
import store from './store';

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token';

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || '/.netlify/functions/graphql';

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'X-Developer-Key': store.getters['app/developerKey'],
    },
  });
  return forward(operation);
});

// Config
const defaultOptions = {
  httpEndpoint,
  tokenName: AUTH_TOKEN,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
};

// Call this in the Vue app file
export default function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  });

  // inject the auth middleware
  apolloClient.link = authMiddleware.concat(apolloClient.link);

  // Create vue apollo provider
  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
    },
  });
}
