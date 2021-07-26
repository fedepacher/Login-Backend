import { getRepository } from "typeorm";
import { Request, Response} from "express";
import { User } from '../entity/User';
import { validate } from "class-validator";

export class UserController {
    
    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users;
        try {
            users = await userRepository.find({ select: ['id', 'username', 'role'] });
        } catch (e) {
            res.status(404).json({ message: 'Somenthing goes wrong!' });
        }
      
        if (users.length > 0) {
            res.send(users);
        } else {
            res.status(404).json({ message: 'Not result' });
        }
        // try{
        //     const users = await userRepository.find();

        //     if(users.length > 0){
        //         res.send(users);
        //     }
        //     else{
        //         res.status(404).json({message: 'No result'});
        //     }
        // }
        // catch(e){
        //     res.status(404).json({message : 'No result'});
        // }
    };
   
    static getById = async (req: Request, res:Response) => {
        const {id} = req.params;
        const userRepsitory = getRepository(User);
        try{
            const user = await userRepsitory.findOneOrFail(id);
            res.send(user);
        }
        catch(e){
            res.status(404).json({message : 'No result'});
        }
    };

    static newUser = async (req:Request, res:Response) =>{
        const {fullname, map_id, username, password, role} = req.body;
        const user = new User();

        user.fullname = fullname;
        user.map_id = map_id;
        user.username = username;
        user.password = password;
        user.role = role;

        //validate
         //este validationOpt indica que al devolver el error no se devuelva ni el target ni el value
        const validationOpt = {validationError:{target: false, value: false} };   
        const errors = await validate(user, validationOpt);
        if (errors.length > 0){
            return res.status(400).json(errors);
        }

        //TODO: hash password

        const userRepository = getRepository(User);
        try{
            user.hashPassword();
            await userRepository.save(user);
        }
        catch(e){
            return res.status(409).json({message: 'Username already exist'});
        }

        //All ok
        //res.send('User created succesfully');
        res.send({message: 'User created succesfully', userId: user.id, role: user.role});
    };

    static editUser = async (req:Request, res:Response) =>{
        let user;
        const {id} = req.params;
        const {username, role} = req.body;

        const userRepository = getRepository(User);
        try{
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.role = role;

        }
        catch(e){
            return res.status(404).json({message: 'User not found'});
        }
        //validamos datos recibidos   
        //este validationOpt indica que al devolver el error no se devuelva ni el target ni el value
        const validationOpt = {validationError:{target: false, value: false} };   
        const errors = await validate(user, validationOpt);
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        //try t save user in database
        try{
            await userRepository.save(user);
        }
        catch(e){
            return res.status(409).json({message: 'Username already in use'});
        }
        res.status(201).json({message : 'User updated'});
    };

    static deleteUser = async (req:Request, res:Response) =>{
        const {id} = req.params;
        const userRepository = getRepository(User);
        let user : User;

        try{
            user = await userRepository.findOneOrFail(id);
        }
        catch(e){
            return res.status(404).json({message: 'User not found'})
        }

        //Remove user
        userRepository.delete(id);
        res.status(201).json({message: 'User deleted'})
    };

}

export default UserController;