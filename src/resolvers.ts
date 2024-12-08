import { getCourses, getCourseById, addCourse, updateCourse, deleteCourse } from './db';
import pool from './db';
import { hashPassword, comparePassword, generateToken, verifyToken } from './utils/auth';

interface JwtPayload {
  userId: number;
  role: string;
}

const resolvers = {
  Query: {
    courses: async (parent: any, { limit, sortOrder }: { limit?: number; sortOrder?: 'ASC' | 'DESC' }, context: any) => {
      return await getCourses(limit, sortOrder);
    },
    course: async (parent: any, { id }: { id: string }, context: any) => {
      return await getCourseById(id);
    },
  },

  Mutation: {
    // Register a new user
    register: async (parent: any, { username, password }: { username: string; password: string }, context: any) => {
      // Check if user already exists
      const [existingUser]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (existingUser.length > 0) {
        throw new Error('User already exists');
      }

      // Hash the password before saving
      const hashedPassword = await hashPassword(password);

      // Create a new user in the database
      const [result]: any = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
      const userId = result.insertId;

      // Generate a JWT token for the newly created user
      const token = generateToken(userId, 'user'); 

      return { token, userId };
    },

    // Login an existing user
    login: async (parent: any, { username, password }: { username: string; password: string }, context: any) => {
      // Fetch user from the database
      const [user]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (user.length === 0) {
        throw new Error('User not found');
      }

      // Compare the entered password with the stored hashed password
      const isValid = await comparePassword(password, user[0].password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      // Generate a JWT token upon successful login
      const token = generateToken(user[0].id, user[0].role);

      return { token, userId: user[0].id };
    },

    // Add a new course
    addCourse: async (parent: any, { input }: { input: { title: string; description: string; duration: string; outcome: string } }, context: any) => {
      // Ensure user is authenticated by checking if user exists in the context
      const { user } = context;

      if (!user) {
        throw new Error('Authentication required');
      }

      // Extract userId from the decoded JWT
      const { userId } = user;

      // Add the course to the database
      const { title, description, duration, outcome } = input;
      const query = 'INSERT INTO courses (title, description, duration, outcome, userId) VALUES (?, ?, ?, ?, ?)';
      const [result]: any = await pool.query(query, [title, description, duration, outcome, userId]);

      return {
        id: result.insertId,
        title,
        description,
        duration,
        outcome,
        userId,
      };
    },

    // Update an existing course
    updateCourse: async (parent: any, { id, input }: { id: string; input: { title: string; description: string; duration: string; outcome: string } }, context: any) => {
      // Ensure user is authenticated by checking if user exists in the context
      const { user } = context;

      if (!user) {
        throw new Error('Authentication required');
      }

      const { userId, role } = user;

      // Fetch the course from the database
      const [course]: any = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
      if (course.length === 0) {
        throw new Error('Course not found');
      }

      // Ensure the course belongs to the user or the user is an admin
      if (course[0].userId !== userId && role !== 'admin') {
        throw new Error('Not authorized to update this course');
      }

      // Update the course in the database
      const { title, description, duration, outcome } = input;
      const query = 'UPDATE courses SET title = ?, description = ?, duration = ?, outcome = ? WHERE id = ?';
      await pool.query(query, [title, description, duration, outcome, id]);

      return {
        id,
        title,
        description,
        duration,
        outcome,
        userId,
      };
    },

    // Delete a course
    deleteCourse: async (parent: any, { id }: { id: string }, context: any) => {
      // Ensure user is authenticated by checking if user exists in the context
      const { user } = context;

      if (!user) {
        throw new Error('Authentication required');
      }

      const { userId, role } = user;

      // Fetch the course from the database
      const [course]: any = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
      if (course.length === 0) {
        throw new Error('Course not found');
      }

      // Ensure the course belongs to the user or the user is an admin
      if (course[0].userId !== userId && role !== 'admin') {
        throw new Error('Not authorized to delete this course');
      }

      // Delete the course from the database
      await pool.query('DELETE FROM courses WHERE id = ?', [id]);

      return 'Course deleted successfully';
    },
  },
};

export default resolvers;
