require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const seasonRoutes = require('./routes/seasonRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/seasons', seasonRoutes);

async function startServer() {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

startServer();