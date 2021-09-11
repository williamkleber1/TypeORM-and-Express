import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Product } from "../entity/Product";
import { print } from "util";



export class ProductController {

    private productRepository = getRepository(Product);

    async all(request: Request, response: Response, next: NextFunction) {
        const res = await this.productRepository.find();

        return { res }

    }


    async one(request: Request, response: Response, next: NextFunction) {
        // Receiving file via url (uId in database)
        try {
            const repo = await this.productRepository
            const result_find = await repo.findOne(request.params.id)
            console.log(result_find);
            var fileData =  Buffer.from(result_find.image, 'base64');
            response.writeHead(200, {
                'Content-Type': result_find.mimeType,
                'Content-Disposition': 'attachment; filename=' + result_find.name_file,
                'Content-Length': fileData.length
            });
            response.write(fileData);
            response.end();
        } catch (error) {
            console.log(error)
            response.send("ERROR")
        }
      
    }


    async save(request: Request, response: Response, next: NextFunction) {
        
        let fileData = await request.files.image
        //console.log(fileData.image)
        if (Array.isArray(fileData)){
            console.log("TODO: Array")
        }else{

            var product = new Product()
            product.name  = request.body['name']
            product.value = request.body['value']
            product.createAt = new Date()
            product.updatedAt = new Date()
            product.image = fileData.data
            product.mimeType = fileData.mimetype
            product.name_file = fileData.name
            //console.log(product.image)

            try {
                const repo = await this.productRepository
                const result_File = await repo.save(product)
                response.send("Upload complete")
            } catch (error) {
                console.log(error)
                response.send("ERROR")
            }
         }
        }
    
        

    async remove(request: Request, response: Response, next: NextFunction) {
            let userToRemove = await this.productRepository.findOne(request.params.id);
            await this.productRepository.remove(userToRemove);
        }

    }