const express = require('express')
const mongoose = require('mongoose')
const User = require('./userModel');
const Game = require('./gameModel');

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8000


const MONGODB_URL = "mongodb+srv://abdulnasir:2212101005@cluster0.b2bsdzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("MongoDB connected")

    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);    
})
})

// C R U D



// User registration
app.post('/register', async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        const user = new User({ username, password, isAdmin });
        await user.save();
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User login (simple, no JWT/session for now)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin creates a game
app.post('/games', async (req, res) => {
    try {
        const { name, odds, adminId } = req.body;
        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ error: 'Only admin can create games' });
        }
        const game = new Game({ name, odds, createdBy: admin._id });
        await game.save();
        res.status(201).json({ message: 'Game created', game });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});