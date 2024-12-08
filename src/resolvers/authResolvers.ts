import { IResolvers } from '@graphql-tools/utils';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import pool from '../db'; 

export const authResolvers: IResolvers = {
  Mutation: {
    register: async (_: any, { username, password }: { username: string, password: string }) => {
      const [existingUser]: any[] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

      if (existingUser.length > 0) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(password);

      const [result]: any[] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

      const userId = result.insertId;

      const token = generateToken(userId, 'user'); 
      return { token };
    },

    login: async (_: any, { username, password }: { username: string, password: string }) => {
      const [user]: any[] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

      if (user.length === 0) {
        throw new Error('User not found');
      }

      const isPasswordValid = await comparePassword(password, user[0].password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user[0].id, user[0].role);
      return { token };
    },
  },
};
