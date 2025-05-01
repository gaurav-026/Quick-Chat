import jwt from 'jsonwebtoken';
import process from 'process'
export const verifyToken = (req, res, next)=>{

    // console.log(req.cookies);
    const token = req.cookies.jwt;
    // console.log({token});
    if(!token) return res.status(401).json({
        success: false,
        message:"You are not authenticated!",
    })

    jwt.verify(token, process.env.Jwt_KEY, async(err, payload)=>{
        if(err) return res.status(403).send("Token is invlid");

        req.userId = payload.userId;
        next();
    });
    

}