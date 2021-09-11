import { Column, ManyToMany, JoinColumn } from "typeorm";

import { User } from "./User";

abstract class ITimeStamp {

  @Column('date')
  createAt: Date;

  @Column('date')
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinColumn()
  createdUser?: User;
  
  @ManyToMany(() => User)
  @JoinColumn()
  updatedUser?: User;
}

export { ITimeStamp }