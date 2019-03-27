import { ApolloServer, gql } from 'apollo-server-lambda';

const articles = [];

const typeDefs = gql`
  type Article {
    name: String
  }
  
  type Query {
    articles: [Article]
  }
`;

const resolvers = {
  Query: {
    articles: () => articles,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

exports.handler = server.createHandler();
