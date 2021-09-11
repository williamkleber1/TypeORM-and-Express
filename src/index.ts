import "reflect-metadata";
import {createConnection, getConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import { Product } from "./entity/Product";

const fileUpload = require('express-fileupload');


createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(fileUpload());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // Uploading routine 
    app.post("/upload", async (req, res)=>{
        let fileData = req.files.datein

        console.log(fileData);
  
        if (Array.isArray(fileData)){
            console.log("TODO: Array")
        }else{

            var product = new Product()
            product.name  = req.body['name']
            product.value = req.body['value']
            product.createAt = new Date()
            product.updatedAt = new Date()
            product.name_file = fileData.name
            product.image = fileData.data.toString('base64')
            product.mimeType = fileData.mimetype

            try {
                const repo = getConnection().getRepository(Product)
                const result_File = await repo.save(product)
                res.send("Upload complete")
            } catch (error) {
                console.log(error)
                res.send("ERROR")
            }
        }
    })

    
    
    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));

    // await connection.manager.save(connection.manager.create(Product, {
    //     name: "Phantom",
    //     image:"image.jpg",
    //     value: 10.5,
    //     createAt: new Date(),
    //     updatedAt: new Date()
    // }));

    // await connection.manager.save(connection.manager.create(Product, {
    //     name: "teste2",
    //     image:"image.jpg",
    //     value: 1000.5,
    //     createAt: new Date(),
    //     updatedAt: new Date()
    // }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
