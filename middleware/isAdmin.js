import pool from '../config/db.js'
export const promoteUserToAdmin = async (req, res) => {
    const targetUserId = req.params.id;

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    try {
        console.log(`Promoting user with ID ${targetUserId}`);
        await pool.query('UPDATE users SET role = \'admin\' WHERE id = ?', [targetUserId]);
        res.status(200).json({ message: 'User promoted to admin successfully' });
    } catch (err) {
        console.error('Error promoting user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};
