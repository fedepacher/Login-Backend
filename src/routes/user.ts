import { Router } from "express";
import { UserController } from "../controller/UserController";
import { checkJwt } from "../middlewares/jwt";
import { checkRole } from "../middlewares/role";

const router = Router();

//get all users
//aca se le agrego el middleware checkJwt que es el que corrobora el token
//cuando se llama al metodo get primero se ejecuta el middleware, si esta bie se ejecuta el 
//metodo de UserController.getAll
//router.get('/', [checkJwt, checkRole(['admin'])], UserController.getAll);
router.get('/', UserController.getAll);

//get one user
router.get('/:id', [checkJwt, checkRole(['admin'])], UserController.getById);

//create a new ser
//con el middleware checkRole solo estamos permitiendo qe el admin pueda crear usuarios
//router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);
router.post('/', UserController.newUser);

//edit user
router.patch('/:id', [checkJwt, checkRole(['admin'])], UserController.editUser);

//delet user
router.delete('/:id', [checkJwt, checkRole(['admin'])], UserController.deleteUser);



export default router;