import mysql from 'mysql2/promise';

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  outcome: string;
}

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',     
  password: 'Shadow11!',
  database: 'osc_assessment', 
});

// Get all courses
export const getCourses = async (limit: number | undefined, sortOrder: 'ASC' | 'DESC' = 'ASC') => {
    const [rows] = await pool.execute('SELECT * FROM courses ORDER BY title ' + sortOrder + (limit ? ` LIMIT ${limit}` : ''));
    return rows as Course[];
  };
  
  // Get a course by ID
  export const getCourseById = async (id: string) => {
    const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Course;
    }
    return null;
  };
  
  // Add a new course
  export const addCourse = async (course: { title: string; description: string; duration: string; outcome: string }) => {
    const [result] = await pool.execute(
      'INSERT INTO courses (title, description, duration, outcome) VALUES (?, ?, ?, ?)',
      [course.title, course.description, course.duration, course.outcome]
    );
    return { id: (result as mysql.ResultSetHeader).insertId, ...course };
  };
  
  // Update a course
  export const updateCourse = async (id: string, course: { title: string; description: string; duration: string; outcome: string }) => {
    const [result] = await pool.execute(
      'UPDATE courses SET title = ?, description = ?, duration = ?, outcome = ? WHERE id = ?',
      [course.title, course.description, course.duration, course.outcome, id]
    );
    const affectedRows = (result as mysql.ResultSetHeader).affectedRows;
    if (affectedRows === 0) throw new Error('Course not found');
    return { id, ...course };
  };
  
  // Delete a course
  export const deleteCourse = async (id: string) => {
    const [result] = await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    const affectedRows = (result as mysql.ResultSetHeader).affectedRows;
    return affectedRows > 0;
  };
  
  export default pool;