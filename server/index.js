import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { User, Project, Application, Chat, Freelancer } from './Schema.js';
import jwt from 'jsonwebtoken';
import env from "dotenv";
import http from 'http';
import { Server } from 'socket.io';

// Create an Express app
const app = express();
env.config();

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Define the /register route
    app.get('/login', (req, res) => {
      res.render("Login.jsx");
    });

    // Registration route
    app.post("/register", async (req, res) => {
      const { name, email, password, accountType } = req.body;

      try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          accountType,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" , token: await newUser.generateToken()});
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Login route
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({user, token: await user.generateToken()}); //res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    //create project
    app.post("/add-project", async (req, res) => {
      const {
        title,
        description,
        budget,
        skills,
        clientId,
        clientName,
        clientEmail,
      } = req.body;
      try {
        const projectSkills = skills.split(",");
        const newProject = new Project({
          title,
          description,
          budget,
          skills: projectSkills,
          clientId,
          clientName,
          clientEmail,
          postedDate: new Date(),
        });
        await newProject.save();
        res.status(200).json({ message: "Project added" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //list all projects
    app.get("/list-projects", async (req, res) => {
      try {
        const projects = await Project.find();

        res.status(200).json(projects);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //search project
    app.get("/project/:id", async (req, res) => {
      try {
        const project = await Project.findById(req.params.id);

        res.status(200).json(project);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //submit application
    app.post("/submit-application", async (req, res) => {
      const {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount,
        estimatedTime,
      } = req.body;
      try {
        const freelancer = await User.findById(freelancerId);
        const freelancerData = await Freelancer.findOne({
          userId: freelancerId,
        });
        const project = await Project.findById(projectId);
        const client = await User.findById(clientId);

        const newApplication = new Application({
          projectId,
          clientId,
          clientName: client.username,
          clientEmail: client.email,
          freelancerId,
          freelancerName: freelancer.username,
          freelancerEmail: freelancer.email,
          freelancerSkills: freelancerData.skills,
          title: project.title,
          description: project.description,
          budget: project.budget,
          requiredSkills: project.skills,
          proposal,
          bidAmount,
          estimatedTime,
        });

        const application = await newApplication.save();

        project.bids.push(freelancerId);
        project.bidAmounts.push(parseInt(bidAmount));

        console.log(application);

        if (application) {
          freelancerData.applications.push(application._id);
        }

        await freelancerData.save();
        await project.save();

        res.status(200).json({ message: "Application Submitted" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });
    //view applications
    app.get("/view-applications", async (req, res) => {
      try {
        const applications = await Application.find();

        res.status(200).json(applications);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //accept application
    app.get("/accept-application/:id", async (req, res) => {
      try {
        const application = await Application.findById(req.params.id);

        const project = await Project.findById(application.projectId);

        const freelancer = await Freelancer.findOne({
          userId: application.freelancerId,
        });

        const user = await User.findById(application.freelancerId);

        application.status = "Accepted";

        await application.save();

        const remainingApplications = await Application.find({
          projectId: application.projectId,
          status: "Pending",
        });

        remainingApplications.map(async (appli) => {
          appli.status === "Rejected";
          await appli.save();
        });

        project.freelancerId = freelancer.userId;
        project.freelancerName = user.email;
        project.budget = application.bidAmount;

        project.status = "Assigned";

        freelancer.currentProjects.push(project._id);

        await project.save();
        await freelancer.save();

        res.status(200).json({ message: "Application Accepted!!" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });

    //reject application
    app.get("/reject-application/:id", async (req, res) => {
      try {
        const application = await Application.findById(req.params.id);
        application.status = "Rejected";
        await application.save();
        res.status(200).json({ message: "Application rejected!!" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //submit project
    app.post("/submit-project", async (req, res) => {
      const {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription,
      } = req.body;
      try {
        const project = await Project.findById(projectId);

        project.projectLink = projectLink;
        project.manulaLink = manualLink;
        project.submissionDescription = submissionDescription;
        project.submission = true;

        await project.save();

        await project.save();
        res.status(200).json({ message: "Project added" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //accept project
    app.get("/approve-submission/:id", async (req, res) => {
      try {
        const project = await Project.findById(req.params.id);
        const freelancer = await Freelancer.findOne({
          userId: project.freelancerId,
        });

        project.submissionAccepted = true;
        project.status = "Completed";

        freelancer.currentProjects.pop(project._id);
        freelancer.completedProjects.push(project._id);

        freelancer.funds =
          parseInt(freelancer.funds) + parseInt(project.budget);

        await project.save();
        await freelancer.save();

        res.status(200).json({ message: "submission accepted" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //reject project
    app.get("/reject-submission/:id", async (req, res) => {
      try {
        const project = await Project.findById(req.params.id);

        project.submission = false;
        project.projectLink = "";
        project.manulaLink = "";
        project.submissionDescription = "";

        await project.save();

        res.status(200).json({ message: "submission rejected" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    //show chats
    app.get("/show-chats/:id", async (req, res) => {
      try {
        const chats = await Chat.findById(req.params.id);

        console.log(chats);

        res.status(200).json(chats);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    //show all users (admin)
    app.get("/fetch-users", async (req, res) => {
      try {
        const users = await User.find();

        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Define port
    const PORT = process.env.PORT || 5000;

    // Define a simple route for testing
    app.get("/", (req, res) => {
      res.send("Hello, Express.js Server is running!");
    });

    app.post('/logout', (req, res) => {
      // Typically, you would handle logout on the client-side by removing the token.
      // The server-side logout implementation depends on your specific requirements.
    
      res.status(200).json({ message: 'Logout successful' });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
