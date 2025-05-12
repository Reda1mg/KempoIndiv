// src/entities/User.entity.ts
import { EntitySchema } from '@mikro-orm/core';
import { v4 } from 'uuid';

export class User {
  id!: number;
  username!: string;
  password!: string;
  role!: string;
}

export const UserSchema = new EntitySchema<User>({
  class: User,
  tableName: 'user',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    username: { type: 'string' },
    password: { type: 'string' },
    role: { type: 'string' },
  },
});
