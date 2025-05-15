import cron from 'node-cron';
import db from './config/db.js';

import logger from './config/logger.js';
// Cron job to clean up expired tokens every hour
cron.schedule('0 * * * *', async () => {
    try {
        const query = 'DELETE FROM users WHERE verification_token_expires_at IS NOT NULL AND verification_token_expires_at < NOW()';
        await db.query(query);
        logger.warn('Expired tokens cleaned up.');
    } catch (err) {
        logger.error('Error cleaning up expired tokens:', err);
    }
});
