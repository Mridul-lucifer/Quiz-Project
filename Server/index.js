const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { neon } = require('@neondatabase/serverless');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const cors = require('cors')

const sql = neon(process.env.DATABASE_URL); // Your Neon connection string
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json())
// Initialize the API with your key
// Note the second argument specifying the API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.get('/list-models', async (req, res) => {
//     try {
//         const apiKey = process.env.GEMINI_API_KEY;
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
//         const data = await response.json();
        
//         // This will send back a list of names like ["models/gemini-1.5-flash", ...]
//         const modelNames = data.models.map(m => m.name);
//         res.json(modelNames);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

app.post('/page', async (req,res)=>{
    try {
        const pageText = req.body.pageText;

        // Use the model name found in your specific list
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash" 
        });

        const prompt = `Generate a JSON array of 5 questions and answers from "${pageText}". 
        Return ONLY the raw JSON in this format:
        [
          { "question": "...", "answer": "..." }
        ]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 1. Remove markdown code blocks if the AI includes them
        const cleanJsonString = text.replace(/```json|```/g, "").trim();
        
        // 2. Parse and send
        const data = JSON.parse(cleanJsonString);
        res.json(data);

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Something went wrong with the AI call." });
    }
});

app.post('/search/:value', async (req, res) => {
    try {
        const { value } = req.params;

        // Use the model name found in your specific list
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash" 
        });

        const prompt = `Generate a JSON array of 5 questions and answers about "${value}". 
        Return ONLY the raw JSON in this format:
        [
          { "question": "...", "answer": "..." }
        ]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 1. Remove markdown code blocks if the AI includes them
        const cleanJsonString = text.replace(/```json|```/g, "").trim();
        
        // 2. Parse and send
        const data = JSON.parse(cleanJsonString);
        res.json(data);

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Something went wrong with the AI call." });
    }
});

// --- SIGN UP ENDPOINT ---
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // 1. Check if user already exists
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "User already exists with this email." });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into Neon
        const newUser = await sql`
            INSERT INTO users (email, password) 
            VALUES (${email}, ${hashedPassword}) 
            RETURNING id, email
        `;

        res.status(201).json({ 
            message: "User created successfully", 
            user: newUser[0] 
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error during signup." });
    }
});

// --- LOGIN ENDPOINT ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const user = users[0];

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // 3. Create JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error during login." });
    }
});

app.post('/info', async (req, res) => {
    try {
        const { age, degree, difficulty, goal, userId } = req.body;

        // Validation
        if (!userId) {
            return res.status(400).json({ error: "User ID is required to update info." });
        }

        // Update the user record in Neon
        const updatedUser = await sql`
            UPDATE users 
            SET 
                age = ${age}, 
                degree = ${degree}, 
                difficulty = ${difficulty}, 
                goal = ${goal}
            WHERE id = ${userId}
            RETURNING id, email, age, degree, difficulty, goal
        `;

        if (updatedUser.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser[0]
        });

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to save personalized data." });
    }
});

app.listen(port, () => {
    console.log(`Server running`);
});