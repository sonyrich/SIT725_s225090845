// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myprojectDB');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Serve static files from 'public_html' folder
app.use(express.static(path.join(__dirname, 'public_html')));
app.use(express.json());

const ProjectSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});

const Project = mongoose.model('Project', ProjectSchema);

// GET REST endpoint — returns portfolio projects as JSON
app.get('/api/projects', async (req, res) => {
    // res.json(projects);
    const projects = await Project.find({});
    res.json({ statusCode: 200, data: projects, message: "Success" });
});

// Optional: Redirect root to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and go to: http://localhost:${PORT}`);
});