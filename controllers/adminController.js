import { getAllUsersFromDB, deleteUserFromDB } from '../models/admin.js';
import { getUserById } from '../models/users.js';


export const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
  
        const users = await getAllUsersFromDB();
        console.log('Fetched users:', users); // Log to debug
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err); // Log error
        res.status(500).json({ message: 'Internal server error' });
    }
  };
  

export const deleteUser = async (req, res) => {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    try {
        if (currentUserRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        if (!targetUserId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (targetUserId === currentUserId) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }

        const userToDelete = await getUserById(targetUserId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (userToDelete.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete another admin.' });
        }

        await deleteUserFromDB(targetUserId);
        res.json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


