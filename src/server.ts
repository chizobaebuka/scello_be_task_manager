import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/sequelize';

dotenv.config();

(async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');

        const PORT = process.env.PORT ?? 4001;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger docs at http://localhost:${PORT}/api-doc`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();