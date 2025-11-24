exports.isAdmin=(req,res,next)=>{
    if(!req.user){
        const error=new Error("Not authenticated");
        error.statusCode=401;
        return next(error);
    }
    if(!req.user.isAdmin){
        const error=new Error("Access denied. Admin only access");
        error.statusCode-403;
        return next(error);
    }
    next();
}