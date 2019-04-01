import {ApolloServer, gql} from 'apollo-server-lambda';
import axios from 'axios';
import get from 'lodash/get';
import parseLinkHeader from 'parse-link-header';
import cacache from 'cacache/en';
import crypto from 'crypto';

const endpoint = 'https://api.pocketsmith.com';
const pageSize = 100;
const cachePath = '/tmp/cache';
const defaultExpiry = 60;

/**
 * @param parent
 * @param args
 * @param context
 * @returns {Promise<*>}
 */
const user = async (parent, args, context) => {
  const res = await pocketsmithGetResult(context.token, `${endpoint}/v2/me`, 300);
  return res.data;
};

/**
 * @param parent
 * @param args
 * @param context
 * @returns {Promise<Array|*>}
 */
const transactions = async (parent, {end_date, start_date}, context) => {
  if (!end_date.length || !start_date.length) {
    return Promise.reject(new Error('Invalid end_date or start_date argument'));
  }
  const url = `${endpoint}/v2/users/${parent.id}/transactions?per_page=${pageSize}&end_date=${end_date}&start_date=${start_date}`;
  return await getResultsPaginated(context.token, url, defaultExpiry);
};

/**
 * @param token
 * @param url
 * @param expiry
 * @returns {Promise<Array|*>}
 */
const getResultsPaginated = async (token, url, expiry) => {
  const res = await pocketsmithGetResult(token, url, expiry);
  const links = parseLinkHeader(get(res, 'headers.link', ''));
  const nextUrl = get(links, 'next.url', null);
  if (nextUrl === null) {
    return res.data;
  }
  const results = [];
  const next = await getResultsPaginated(token, nextUrl, expiry);
  results.push(...res.data);
  results.push(...next);
  return results;
};

/**
 * @param token
 * @param url
 * @param expiry
 * @returns {Promise<Promise<T | never> | T>}
 */
const pocketsmithGetResult = async (token, url, expiry = defaultExpiry) => {
  // Generate a key for this request
  const key = getRequestKey(token, url);
  const cachedResult = await getCachedResult(key);
  if (cachedResult !== null) {
    console.log(`Using cached result for ${url}`); // eslint-disable-line
    return JSON.parse(cachedResult.toString());
  }
  const headers = {
    'X-Developer-Key': token,
  };
  console.log(`Sending request to ${url}`); // eslint-disable-line
  return axios(url, {headers})
    .then(async (res) => {
      const data = {data: res.data, headers: res.headers};
      await setCachedResult(key, data, expiry);
      return data;
    })
    .catch((error) => {
      const e = get(error, 'response.data.error', 'Error whilst querying PocketSmith API');
      console.error(e); // eslint-disable-line
      return Promise.reject(new Error(e));
    });
};

/**
 * @param token
 * @param url
 * @returns {string}
 */
const getRequestKey = (token, url) => {
  return crypto.createHash('md5').update(`${token}:${url}`).digest('hex');
};

/**
 * @param key
 * @returns {Q.Promise<any>}
 */
const getCachedResult = (key) => {
  return cacache.get(cachePath, key)
    .then((res) => {
      if (res.metadata.expiry < Date.now()) {
        return null;
      }
      return res.data;
    })
    .catch(() => {
      return null;
    });
};

/**
 * @param key
 * @param value
 * @param expiry
 */
const setCachedResult = (key, value, expiry) => {
  console.log(`Putting key ${key} into cache, expiring in ${expiry} seconds`); // eslint-disable-line
  const expiryTime = Date.now() + (expiry * 1000);
  return cacache.put(cachePath, key, JSON.stringify(value), {metadata: {expiry: expiryTime}});
};

const typeDefs = gql`
  type User {
    id: Int
    transactions(end_date: String!, start_date: String!): [Transaction]
  }
  
  type Transaction {
    id: Int
    date: String
    payee: String
    original_payee: String
    upload_source: String
    amount: Float
    type: String
    memo: String
    category: Category
    transaction_account: TransactionAccount
    note: String
    status: String
    is_transfer: Boolean
    labels: [String]
  }
  
  type Category {
    id: Int
    title: String
    is_transfer: Boolean
    colour: String
  }
  
  type TransactionAccount {
    id: Int
    name: String
    number: String
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
    return {
      token: get(event, 'headers.x-developer-key', ''),
      event,
      context,
    };
  },
});

exports.handler = server.createHandler();
