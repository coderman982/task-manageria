import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import connectDB from './config/db.js';
import app from './app.js';

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
