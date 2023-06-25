import createError from './error';
import jwt from 'jsonwebtoken';

function verifyToken(req,res, next){
    const tempToken = req.cookies.access_token;
    if(!tempToken) return next(createError(401, "You are not authenticated!"));

    jwt.verify(tempToken, process.env.JWT, (err, user) =>{
        if(err) return next(createError(403, "Token is not valid!"));
        
        req.user = user;
        next();
    });
};

function verifyUser (req,res, next){
    verifyToken(req,res, next, ()=>{
        if(req.user.id == req.params.id || req.user.isAdmin){
            next();
        }else{
            next(createError(403, "You are not authenticated!"));
        }
    });
};

function verifyAdmin  (req,res, next){
    verifyToken(req,res, next ,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            next(createError(403, "You are not authenticated!"));
        }
    });
};

export {verifyToken, verifyUser, verifyAdmin};