const { request } = require("express");
// import errors
const { UserInputError, AuthenticationError, ApolloError } = require('apollo-server-express')
const {User} = require('../../models/user')
const {Post} = require('../../models/post')
const authorize = require('../../utils/isAuth');
const { userOwnership } = require('../../utils/tools');
const { Category } = require('../../models/category');

module.exports = {
    Mutation:{
        authUser: async(parent,args,context,info)=>{
            try{
                /// CHECK THE MAIL
                const user = await User.findOne({
                    'email': args.fields.email
                });
                // if no user throw auth error
                if(!user) {throw new AuthenticationError('Bad email'); }
                /// CHECK PASSWORD - this is a method on the user object -- see User model
                const checkpass = await user.comparePassword(args.fields.password);
                if(!checkpass) {throw new AuthenticationError('Wrong password'); }
       
                /// USER MUST BE RIGHT, LOG IN - so get the token
                // so generateToken
                const getToken = await user.generateToken();
                if(!getToken) { 
                    throw new AuthenticationError('Something went wrong, try again');
                }

                /// RETURN 
                return {
                    _id:user._id,
                    email:user.email,
                    token: getToken.token
                };
            } catch(err){
                throw err
            }
        },
        signUp: async(parent,args,context,info)=>{
            try{
                const user = new User({
                    email: args.fields.email,
                    password: args.fields.password
                });

                const getToken = await user.generateToken();
                if(!getToken) { 
                    // throw auth error
                    throw new AuthenticationError('Something went wrong, try again');
                }

                //  return user
                return { ...getToken._doc}
            } catch(err){
                // if err 11000 - ie this is standard mongo code for duplication error
                if(err.code === 11000){
                    throw new AuthenticationError('Sorry, duplicated email. try a new one');
                }
                throw err
            }
        },
        updateUserProfile:async(parent,args,context,info)=>{
            try{
                const req = authorize(context.req);

                if(!userOwnership(req,args._id))
                throw new AuthenticationError("You dont own this user");

                //// validate fields, please

                const user = await User.findOneAndUpdate(
                    {_id:args._id},
                    {
                        "$set":{
                            name:args.name,
                            lastname:args.lastname
                        }
                    },
                    { new: true }
                );
                return {...user._doc}
            } catch(err){
                throw err;
            }
        },
        updateUserEmailPass:async(parent,args,context,info)=>{
            try {
                const req = authorize(context.req);

                if(!userOwnership(req, args._id))
                throw new AuthenticationError("You dont own this user");

                const user =await User.findOne({_id:req._id});
                if(!user) throw new AuthenticationError("Sorry, try again");

                //// validate fields, please
                if(args.email){ user.email = args.email }
                if(args.password){ user.password = args.password }

                /// USER IS RIGHT, GENERATE TOKEN
                // we need to generate token as this hashes new password etc
                const getToken = await user.generateToken();
                if(!getToken) { 
                    throw new AuthenticationError('Something went wrong, try again');
                }
                // return token
                return { ...getToken._doc, token:getToken.token}
            }
             catch(err){
                throw err;
            }

        },
        createPost: async(parent,{ fields },context,info)=> {
            try {
                // get req object - which will be user object
                const req = authorize(context.req);
                /// validate...
                const post = new Post({
                    title: fields.title,
                    excerpt:fields.excerpt,
                    content:fields.content,
                    category:fields.category,
                    // the author is the  id from the req object - this is from
                    // authorize function call above
                    author: req._id,
                    status: fields.status
                });
                const result = await post.save();
                return { ...result._doc };
            } catch(err){
                throw err                
            }
        },
        createCategory:  async(parent,args,context,info)=> {
            try {
                // req is going to be user object
                const req = authorize(context.req);
                /// validate
                // create new category
                const category = new Category({
                    author: req._id,
                    name: args.name
                });
                const result = await category.save();
                return { ...result._doc}
            } catch(err){
                throw err                
            }
        },

        updateCategory: async(parent,{ catId,name },context,info)=> { 
            try {
                const req = authorize(context.req);
                const category = await Category.findOneAndUpdate(
                    { _id: catId },
                    {
                        "$set":{
                            name
                        }
                    },
                    { new: true}
                );
                /// throw..
                return { ...category._doc }
            } catch( err ) {
                throw err
            }

        },
        deleteCategory: async(parent,{ catId },context,info)=> { 
            try {
                const req = authorize(context.req);
                const category = await Category.findByIdAndRemove(catId);
                if(!category) throw new UserInputError('Sorry.Not able to find your category or it was deleted already')

                return category;
            } catch( err ) {
                throw err
            }

        },


    }
}