const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

//routes
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');


mongoose.connect(process.env.DATABASE_URL)
    .then(() => {console.log('Database connected')})
    .catch((err) => {console.log(err.message)})

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Methods', '*');
    if(res.method == 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
})

const PORT = process.env.PORT || 8000

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', noteRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found...');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})


app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT} `);  
})

 