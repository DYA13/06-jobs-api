const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')
const auth = (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
if(!authHeader || !authHeader.startsWith('Bearer')){
    
}

}



