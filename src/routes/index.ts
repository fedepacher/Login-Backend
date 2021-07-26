import {Router} from 'express';

import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/auth', auth);//esto hace que al ingresar la ruta sea localhost:3000/auth/lo que esta en el metodo get
routes.use('/users', user);

export default routes;


//el usuario al loggearse entra a
//localhost:3000/auth/login
//y al estar loggeado entra a
//localhost:3000/users/