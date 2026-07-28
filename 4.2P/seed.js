const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myprojectDB');

const ProjectSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});

const Project = mongoose.model('Project', ProjectSchema);

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
    },
    {
        title: "Portfolio Site",
        image: "images/project-4.jpg",
        link: "View Project",
        description: "Personal portfolio website built with HTML, CSS, and vanilla JavaScript."
    }
];

async function seed() {
    const count = await Project.countDocuments({});
    if (count >= 4) {
        console.log("Database already has 4+ projects, skipping seed.");
    } else {
        await Project.insertMany(projects);
        console.log("Seeded 4 projects successfully!");
    }
    mongoose.connection.close();
}

seed();
