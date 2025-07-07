import pool from '../config/db.js';

export const getAllUsersFromDB = async () => {
    try {
      const [rows] = await pool.execute('SELECT id, first_name, last_name, email, role FROM users');
      return rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Unable to fetch users from the database');
    }
  };
  


export const deleteUserFromDB = async (id) => {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
};
