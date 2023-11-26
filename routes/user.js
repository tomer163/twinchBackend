import 'dotenv/config'

import { Router } from "express"

import bcrypt from 'bcrypt'

import { randomBytes } from 'node:crypto'

import jwt from 'jsonwebtoken'
import auth from '../util/jwtvalidate.js'
const router = Router()

router.post('/signup',async(req,res)=>{
    try{
        const user = await req.prisma.user.create({
            data: {
                username:req.body.username,
                password:bcrypt.hashSync(req.body.password,5),
                streamkey:randomBytes(64).toString('hex')
            }
        })
        return res.status(201).json(user)
    } catch(err){
        console.log(err)
        return res.json(err)
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user = await req.prisma.user.findFirstOrThrow({
            where:{
                username:req.body.username
            }
        })
        if(!bcrypt.compareSync(req.body.password,user.password)) throw({message:'false password!'});
        const token = jwt.sign({data: user.id}, process.env.JWT_SECRET)
        res.status(200).json({token})
    } catch(err){
        console.log(err)
        res.status(403).json(err)
    }
})




//all users
router.get('/users',async(req,res)=>{
    try{
        const user = await req.prisma.user.findMany({
            select:{
                id:true,
                username:true,
            }
        })
        return res.status(200).json(user)
    } catch(err){
        return res.status(404).json(err)
    }
})

router.get('/myUser',auth,async(req,res)=>{
    try{
        const user = await req.prisma.user.findFirstOrThrow({
            where:{
                id:req.user.data
            },
            select:{
                id:true,
                username:true
            }
        })
        return res.status(200).json(user)
    } catch(err){
        return res.status(404).json(err)
    }
})

router.get('/myStreamKey',auth,async(req,res)=>{
    try{
        const user = await req.prisma.user.findFirstOrThrow({
            where:{
                id:req.user.data
            },
            select:{
                streamkey:true
            }
        })
        return res.status(200).json(user)
    } catch(err){
        return res.status(404).json(err)
    }
})

router.get('/streamToUser/:streamkey',async(req,res)=>{
    try{
        const user = await req.prisma.user.findFirstOrThrow({
            where:{
                streamkey:req.params.streamkey
            },
            select:{
                username:true
            }
        })
        return res.status(200).json(user)
    } catch(err){
        return res.sendStatus(404)
    }
})



export default router;