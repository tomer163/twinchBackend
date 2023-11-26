import 'dotenv/config'
import jwt from 'jsonwebtoken'

export default async(req,res,next)=>{
    try{
        const authHeader = req.header('Authorization') ? req.header('Authorization').split(' ') : ()=> {
            throw 'Unauthorized'
        }
        const token = authHeader[1]
        const Bearer = authHeader[0]
        if(!(Bearer === 'Bearer')){
            throw 'Unauthorized';
        }
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                throw err;
            }
            else req.user = decoded;
        })
        next()
    } catch(err){
        return res.status(401).json({error:err})
    }
}