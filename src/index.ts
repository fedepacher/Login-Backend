import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as cors from 'cors'; //esto permite que una app front end acceda a nuestro backend
import * as helmet from 'helmet';
import routes from './routes';
const PORT = process.env.PORT || 3000;

createConnection().then(async => {

    // create express app
    const app = express();
    //Middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());

    app.use('/', routes)//esto levanta el index de routes

    // start express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   
}).catch(error => console.log(error));
