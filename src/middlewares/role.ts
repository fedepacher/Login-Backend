import { Request, Response, NextFunction } from "express";
import {User} from '../entity/User';
import { getRepository } from 'typeorm';

export const checkRole = (roles:Array<string>) => {
    return async (req:Request, res: Response, next:NextFunction) => {
        const {userId} = res.locals.jwtPayLoad;
        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail(userId);
        }
        catch(e){
            return res.status(401).send();
        }

        //check role
        const {role} = user;//esto quiere decir que de user solo se queda con la variable role
        if(roles.includes(role)){
            next();
        }
        else{
            res.status(401).json({message: 'Not authorized'});
        }

    }
}