const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const mongoose = require('mongoose')
/// graphql 
const typeDefs = require('./graphql/schema');
const { Query } = require('./graphql/resolvers/query');
const { Mutation } = require('./graphql/resolvers/mutation');

const URI = require('./config/config')

const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query,
        Mutation
    },
    // we get the http request here - and add it to the context. This 
    // can be used in queries and resolvers. We need to add this configuration
    // to apollo server to get the 'context' - ie get access to the request
    // and response - in this case we just need request
    context:({ req })=>{
        // we are adding authorization property to to req.headders
        req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM3N2EzNmFiMTkyNjE3ZDJiZjEwYjYiLCJlbWFpbCI6ImFzZHNkQGdkLmNvbSIsImlhdCI6MTYwNzA4NDg1MiwiZXhwIjoxNjA3Njg5NjUyfQ.3JkDBZUP0IsLI-wnDampvPi9EjjMaTerBH58XyjS8To';

        return {req}
    }

})

// {
//     "data": {
//       "updateUserEmailPass": {
//         "_id": "5fc77a36ab192617d2bf10b6",
//         "email": "asdsd@gd.com",
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM3N2EzNmFiMTkyNjE3ZDJiZjEwYjYiLCJlbWFpbCI6ImFzZHNkQGdkLmNvbSIsImlhdCI6MTYwNzA4NDg1MiwiZXhwIjoxNjA3Njg5NjUyfQ.3JkDBZUP0IsLI-wnDampvPi9EjjMaTerBH58XyjS8To"
//       }
//     }
//   }



server.applyMiddleware({app})
const PORT = process.env.PORT || 5000

mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=> {

app.listen(PORT, ()=> {
    console.log(`Server started on ${PORT}, db connection made`)
})
})
.catch(err => {
    consolelog(err)
})