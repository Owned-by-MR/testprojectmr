const path = require('path');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { createYoga } = require('graphql-yoga');
const { makeExecutableSchema } = require('@graphql-tools/schema');



const db = require(path.resolve(__dirname, '../server/db.js'));

const typeDefs = readFileSync(path.resolve(__dirname, 'schema.graphql'), 'utf8');

const resolvers = {
  Query: {
    products: () => db.products,
    product: (_, { id }) => db.products.find(p => p.id === id),
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({ 
  schema, 
  graphiql: true, 
});

const server = createServer(yoga);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
