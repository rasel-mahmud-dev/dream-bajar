import {NextFunction, Request, Response} from "express"
import dbConnect from "../database"
import {RequestWithAuth} from "../types";
import {mongoConnect} from "../services/mongodb/database.service";
import User, {Roles} from "../models/User";
import {createHash, hashCompare} from "../hash";

const {ObjectId} = require("mongodb")
const {errorResponse, successResponse} = require("../response")

import * as mongoDB from "mongodb"
import {createToken} from "../jwt";


export const login = async (req: Request, res: Response, next: NextFunction)=>{

  const { email, password } = req.body;

  try{

    const database = await mongoConnect();

    if(!(email && password)){
      return errorResponse(next, 'Please provide valid credential', 404)
    }

    let user = await database.collection("users").findOne<User>({email})
    if(!user){
      return errorResponse(next, 'You are not registered', 404)
    }

    if(!user.password){
      return errorResponse(next, 'You haven"t any password', 409)
    }

    const isMatched = hashCompare(password, user.password)
    if(!isMatched){
      return errorResponse(next, 'Password Error', 409)
    }

    let token = createToken(user._id)

    delete user.password;

    successResponse(res, 201, {
      user,
      token
    })
    
  } catch(ex) {
    next(ex)
  }
}

export const googleLoginController = async (req: RequestWithAuth, res: Response, next: NextFunction)=>{
  
  if(!req.user){
    return errorResponse(next, "Login fail")
  }
  
  let token = createToken(req.user._id, req.user.email,req.user.roles)
  successResponse(res, 201, {user: req.user, token: token})
}

export const registration = async (req: Request, res: Response, next: NextFunction)=>{
  try{
    const { email, firstName, lastName, password } = req.body

    const database = await mongoConnect();

    const user = await database.collection("users").findOne<User>({email})
    if(user){
      return next({message: "User already registered", status: 401})
    }

    let newUser = new User({
      firstName,
      email,
      lastName: (lastName ? " " + lastName : ""),
      username: firstName + (lastName ? " " + lastName : ""),
      roles: [Roles.CUSTOMER]
    })

    const [err, hashPassword] = await createHash(password)
    if(!err){
      newUser.password = hashPassword;
    }

    const doc: mongoDB.InsertOneResult = await database.collection("users").insertOne(newUser)

    if(doc.insertedId){

      let token = createToken(user._id)
      delete newUser.password;
      newUser._id = doc.insertedId

      successResponse(res, 201, {
        user: newUser,
        token
      })

    } else {
      return errorResponse(next, "Registration fail. please try again.")
    }

  } catch(ex){
    next(ex)
  }
} 

export const currentAuth = async (req: RequestWithAuth, res: Response, next: NextFunction)=>{

  try{
    const database = await mongoConnect();
    const user = await database.collection("users").findOne<User>({_id: ObjectId(req.userId)})

    if(!user){
      return errorResponse(next, "Please login.", 401)
    }

    delete user.password
    successResponse(res, 200, user)

  } catch(ex){
    next(ex)
  }
}

export const fetchProfile = async (req: RequestWithAuth, res: Response, next: NextFunction)=>{
  let client;
  try{
    const { c: UserCollection, client: cc } = await dbConnect("users")  
    client = cc
    let user = await UserCollection.findOne({_id: ObjectId(req.user.userId) })
    res.json({user})
  } catch(ex){
    next(ex)
    console.log(ex) 
  } finally{
    client?.close()
  }
}


