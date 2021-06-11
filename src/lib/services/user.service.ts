import { gql } from 'apollo-server-lambda';

type User = {
  value: string,
  title: string,
}

export const typeDefsUser = gql`
  type User {
    value: String,
    title: String,
  }
  extend type Query {
    getItems: [User]
  }
`

export const resolverUser = {
  Query: {
    getItems: async (): Promise<User[]> => {
      const res = await fetch('https://jsonplaceholder.cypress.io/users?_limit=10');
      const data = await res.json();
      return data.map((item) => ({ value: item.id, title: item.name }));
    },
  }
}
