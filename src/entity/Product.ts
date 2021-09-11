import { Entity, Column, PrimaryColumn, FileLogger } from "typeorm";

import { ITimeStamp } from "./TimeStamp";
import { User } from "./User";

@Entity()
class Product extends ITimeStamp {
  
  @PrimaryColumn({
    unique: true,
    type: 'char',
    length: 100,
  })
  name: string;

  @Column('longblob')
  image: string;

  @Column()
  name_file: string

  @Column()
  mimeType:string

  @Column('double')
  value: number;


}

export { Product }