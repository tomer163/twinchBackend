import { Router } from 'express'

import auth from '../util/jwtvalidate.js'

const route = Router()

route.post('/follow/:otherid',auth,async(req,res)=>{
    try{
        const otherid = await req.prisma.user.findFirstOrThrow({
            where:{
                id:req.params.otherid
            },
            select:{
                id:true
            }
        })
        console.log(otherid)
        const newfollow = await req.prisma.follow.create({
            data:{
                userid:req.user.data,
                otheruserid:otherid.id
            }
        })
        return res.status(201).json(newfollow)
    } catch(err){
        console.log(err)
        return res.status(404).json({error:err})
    }
})

route.get('/myFollows',auth,async(req,res)=>{
    try{
        const following = await req.prisma.follow.findMany({
            where:{
                userid:req.user.data
            },
            select:{
                otheruserid:true
            }
        })
        const remap = following.map(f => f = f.otheruserid)
        const findusers = await req.prisma.user.findMany({
            where:{
                id:{
                    in: remap
                }
            },
            select:{
                id:true,
                username:true
            }
        })
        return res.status(200).json(findusers)
    } catch(err){
        console.log(err)
        return res.status(404).json({error:err})
    }
})

route.get('/followingMe',auth,async(req,res)=>{
    try{
        const following = await req.prisma.follow.findMany({
            where:{
                otheruserid:req.user.data
            },
            select:{
                user:{
                    select:{
                        id:true,
                        username:true
                    }
                }
            }
        })
        return res.status(200).json(following)
    } catch(err){

    }
})

export default route;