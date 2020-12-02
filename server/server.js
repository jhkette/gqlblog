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
    }

})



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