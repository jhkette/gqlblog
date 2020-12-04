  
const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../../models/user');
const authorize = require('../../utils/isAuth');

module.exports = {
    Query:{
        user: async(parent,args,context,info)=>{
            try{
                const req = authorize(context.req);
                const user = await User.findOne({'_id':args.id});
                // if request object doesn't equal user id throw error
                if(req._id.toString() !== user._id.toString()){
                    throw new AuthenticationError("You dont own this user")
                }
                return user;
            }catch(err){
                throw err;
            }
        },
        // is authenticated query
        isAuth: async(parent, args, context, info)=> {
          try{
            const req = authorize(context.req, true);
            // catch an error here that has a bad token
            if(!req._id){
              throw new AuthenticationError('Bad token');
            }
            return {_id: req._id, email: req.email, token: req.token}
          }catch(err){
            throw err
          }
        }
    }
}