const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query{
        user(id:ID!):User!
        isAuth: User!
    }
    type Mutation {
        updateUserProfile(name:String, lastname: String, _id: ID!):User!
        updateUserEmailPass(email:String, password: String, _id: ID!):User!
        authUser(fields:AuthInput!):User!
        signUp(fields:AuthInput!):User!
        createPost(fields:PostInput!):Post!
    }
    type User {
        _id:ID!
        email:String!
        password:String
        name:String
        lastname:String
        token:String
    }
    input AuthInput {
        email:String!
        password:String!
    }
    input PostInput {
        title: String
        excerpt: String
        content: String
        status: PostStatus
    }
    enum PostStatus {
        PUBLIC,
        DRAFT
    }
`;



module.exports = typeDefs;