const errorHandler = (err , req , res , next) =>{

    let statusCode = res.status <= 200 ? 500 : res.statusCode
    res.status(statusCode)


res.json({
    message : err.message ,
    stack : process.env.NODE_ENV === "production" ? null : err.stack
})


}

export default errorHandler