## Creating a project

```bash
# clone project
git clone git@github.com:kamalkech/sveltekit-graphql.git

# install dependencies
cd sveltekit-graphql
npm install

# start servers sveltekit and graphql
npm run dev

# sveltekit endpoint
http://localhost:3000

# graphql endpoint
http://localhost:3000/graphql
```

## Test graphql queries

Using graphql playground, this example to fetch two queries "hello" return just a string and "getItems" return list users from jsonplaceholder

```bash
query {
  hello
  getItems {
    value
    title
  }
}
```

enjoy ;)
