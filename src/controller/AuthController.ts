import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import { validate } from 'class-validator';

class AuthController{
    //metodo para chequear datos de login
    static login = async (req: Request, res: Response) =>{
        const {username, password} = req.body;//recupero lo que me manda el front end
        //chequeamos que haya usuario y contraseña en el body
        if(!(username && password)){
            return res.status(400).json({message: 'Username & Password are required!'});
        }

        //recuperamos el usuario del frontend
        const userRepository = getRepository(User);
        let user: User;
        try{
            user = await userRepository.findOneOrFail({where: {username}});
        }
        catch(e){
            return res.status(400).json({message: 'Username & Password are incorrect!'});
        }

        //check password
        if(!user.checkPassword(password)){
            return res.status(400).json({message: 'Username or Password are incorrect!'});
        }


        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '1h'});
       
        res.json({message: 'OK', token, userId: user.id, role: user.role});
    };

    static changePassword = async (req:Request, res:Response) => {
        const {userId} = res.locals.jwtPayLoad;
        const {oldPassword, newPassword} = req.body;
        
        if(!(oldPassword && newPassword)){
          return res.status(400).json({message: 'Old password & new password are required'});
        }

        const userRepository = getRepository(User);
        let user: User;
        try{
            user = await userRepository.findOneOrFail(userId);
        }
        catch(e){
            return res.status(400).json({message: 'Something goes wrong!'});
        }
      
        if(!user.checkPassword(oldPassword)){
            return res.status(401).json({message: 'Check your old password'});
        }
        
        user.password = newPassword;
        const validationOps = {validationError: {target : false, value: false}};
        const errors = await validate(user, validationOps);

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        //hash password
        user.hashPassword();
        userRepository.save(user);//guarda los cambios en la bd
        res.json({message: 'Password changed!'})
        
    } 
}

export default AuthController;