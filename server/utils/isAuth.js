const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthenticationError } = require('apollo-server-express');

const thowAuthError = () => {
    throw new AuthenticationError('You are not auth, shame shame shame 1');
}
const authorize = (req, verify= false) => {

    const authorizationHeader = req.headers.authorization || '';
    // First check we have a req.headers.authorization
    if(!authorizationHeader) {
        req.isAuth = false;
        return !verify ? thowAuthError(): req;
    }
    // replace bearer with '' so you just get the token
    const token = authorizationHeader.replace('Bearer ','');
    if(!token || token === ''){
        req.isAuth = false;
        return !verify ? thowAuthError(): req;
    }

    //////
    let decodedJWT;
    try {
        // you need to verify token using token and secret password
        decodedJWT = jwt.verify(token,process.env.SECRET);
        if(!decodedJWT){
            req.isAuth = false;
            return !verify ? thowAuthError(): req;
        }

        console.log(decodedJWT)

        req.isAuth = true;
        req._id = decodedJWT._id;
        req.email = decodedJWT.email;
        req.token = token;
        
    } catch(err){
        req.isAuth = false;
        return !verify ? thowAuthError(): req;
    }
    return req;
}

module.exports = authorize;