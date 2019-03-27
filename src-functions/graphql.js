import {ApolloServer, gql} from 'apollo-server-lambda';
import axios from 'axios';
import get from 'lodash/get'

const user = async (parent, args, context) => {
  return await pocketsmithGetResult(context.token, 'me');
};

const transactions = async (parent, args, context) => {
  const pageSize = 100;
  return await pocketsmithGetResult(context.token, `users/${parent.id}/transactions?per_page=${pageSize}`);
};

/**
 * @param token
 * @param path
 * @returns {Promise<AxiosResponse<any> | never>}
 */
const pocketsmithGetResult = async (token, path) => {
  const url = `https://api.pocketsmith.com/v2/${ path }`;
  const headers = {
    'X-Developer-Key': token,
  };
  console.log(`Sending request to ${url}`);
  return axios(url, {headers})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const e = get(error, 'response.data.error', 'Error whilst querying PocketSmith API');
      console.error(e);
      return Promise.reject(new Error(e));
    });
};

const typeDefs = gql`
  type User {
    id: Int
    transactions: [Transaction]
  }
  
  type Transaction {
    amount: Float
    type: String
    memo: String
    category: Category
  }
  
  type Category {
    id: Int
    title: String
  }
  
  type Query {
    user: User
  }
`;

const resolvers = {
  Query: {
    user,
  },
  User: {
    transactions,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: ({event, context}) => {
    const token = get(event, 'headers.x-developer-key', '');
    return {
      token,
      event,
      context,
    };
  },
});

exports.handler = server.createHandler();
