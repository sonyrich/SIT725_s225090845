// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public_html' folder
app.use(express.static(path.join(__dirname, 'public_html')));

// GET REST endpoint — returns portfolio projects as JSON
app.get('/api/projects', (req, res) => {
    const projects = [
        {
            title: "Weather App",
            image: "images/project-1.jpg",
            link: "View Project",
            description: "A responsive weather dashboard built with React and OpenWeatherMap API."
        },
        {
            title: "Task Manager",
            image: "images/project-2.jpg",
            link: "View Project",
            description: "Full-stack to-do app using Node.js, Express, and MongoDB."
        },
        {
            title: "E-Commerce Store",
            image: "images/project-3.jpg",
            link: "View Project",
            description: "Online store with cart functionality, built with Vue.js and Stripe."
        }
    ];
    res.json(projects);
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