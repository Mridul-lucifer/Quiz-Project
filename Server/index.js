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

app.post('/page', async (req, res) => {
    try {
        const { pageText, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID required for personalization." });
        }

        // 1. Fetch user context from Neon
        const users = await sql`SELECT age, degree, difficulty, goal FROM users WHERE id = ${userId}`;
        const profile = users[0] || {};

        // 3. Initialize Gemini
        const model_name = process.env.MODEL
        const model = genAI.getGenerativeModel({ model: model_name }); // Note: gemini-2.0-flash is current best

        // 4. Construct the Personalized Prompt
        // This logic should sit inside your app.post('/page') or app.post('/search/:value')
        // after you have fetched the 'profile' from the Neon database.

        const prompt = `
            Act as a highly specialized Personal Academic AI Tutor.
            
            USER CONTEXT:
            - Age: ${profile.age || 'Not specified'}
            - Gender: ${profile.gender || 'Not specified'}
            - Academic Degree: ${profile.degree || 'General Education'}
            - Knowledge Level: ${profile.difficulty || 'Intermediate'} (Adjust technical depth accordingly)
            - Question Style: ${profile.question_level || 'Conceptual'} (Factual, Analytical, or Conceptual focus)
            
            CURRENT FOCUS:
            - Topic/Source Material: "${pageText}"

            TASK:
            1. Analyze the Source Material above through the lens of a ${profile.degree} curriculum.
            2. Generate all possible high-quality Question and Answer pairs.
            3. The tone should be encouraging yet academically rigorous, specifically tailored for a ${profile.age} year old student.
            4. Since the user prefers "${profile.question_level}" questions, ensure the answers provide deep ${profile.question_level} insights.

            OUTPUT GUIDELINES:
            - Return ONLY a valid JSON array.
            - No markdown formatting, no conversational filler.
            - Format:
            [
            { 
                "question": "A ${profile.question_level} question about...", 
                "answer": "A detailed explanation that matches the ${profile.difficulty} level..." 
            }
            ]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean and Parse
        const cleanJsonString = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJsonString);
        
        res.json(data);

    } catch (error) {
        console.error("AI/DB Error:", error);
        res.status(500).json({ error: "Failed to generate personalized content." });
    }
});

app.post('/search/:value', async (req, res) => {
    try {
        const { value } = req.params;
        const { userId, count } = req.body; // Getting count from frontend

        if (!userId) {
            return res.status(400).json({ error: "User ID required." });
        }

        // 1. Fetch user context
        const users = await sql`SELECT age, gender, degree, difficulty, question_level, goal FROM users WHERE id = ${userId}`;
        const p = users[0] || {};

        const model_name = process.env.MODEL || "gemini-1.5-flash";        
        const model = genAI.getGenerativeModel({ model: model_name });

        // 2. Dynamic Prompt based on requested count
        const prompt = `
            You are an elite tutor for a ${p.age} year old ${p.gender || 'student'} studying ${p.degree || 'General Studies'}.
            Topic: ${value}.
            Difficulty: ${p.difficulty || 'Intermediate'}.
            Focus Area: ${p.question_level || 'Conceptual'} questions.
            
            Task: Create exactly ${count || 5} ${p.question_level || 'relevant'} style questions and answers. 
            Adjust your language for a ${p.degree || 'standard'} student.
            
            RULES:
            - Return ONLY a JSON array. 
            - No markdown formatting. No backticks. No conversational filler.
            - If text includes quotes, use single quotes inside (e.g., 'Hello').
            
            EXAMPLE:
            [{"question": "What is X?", "answer": "X is..."}]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // 3. Robust JSON Extraction
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("AI failed to return a valid JSON array.");
        
        const data = JSON.parse(jsonMatch[0]);
        res.json(data);

    } catch (error) {
        console.error("Search AI Error:", error);
        res.status(500).json({ error: "Failed to generate personalized search." });
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
        const { age, gender, degree, difficulty, question_level, goal, userId } = req.body;

        if (!userId) return res.status(400).json({ error: "User ID required" });

        const updatedUser = await sql`
            UPDATE users 
            SET 
                age = ${age}, 
                gender = ${gender},
                degree = ${degree}, 
                difficulty = ${difficulty}, 
                question_level = ${question_level},
                goal = ${goal}
            WHERE id = ${userId}
            RETURNING *
        `;

        res.status(200).json({ user: updatedUser[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to update personalized data." });
    }
});

app.post('/save-card', async (req, res) => {
    try {
        const { userId, question, answer } = req.body;

        if (!userId || !question || !answer) {
            return res.status(400).json({ error: "Missing required data" });
        }

        const saved = await sql`
            INSERT INTO saved_cards (user_id, question, answer)
            VALUES (${userId}, ${question}, ${answer})
            RETURNING id
        `;

        res.status(200).json({ message: "Card saved to vault!", id: saved[0].id });
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ error: "Failed to save card" });
    }
});

app.get('/vault/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const savedCards = await sql`
            SELECT * FROM saved_cards 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;
        res.json(savedCards);
    } catch (error) {
        console.error("Vault Fetch Error:", error);
        res.status(500).json({ error: "Could not retrieve your vault." });
    }
});

// Endpoint to delete a card once mastered
app.delete('/vault/:cardId', async (req, res) => {
    try {
        await sql`DELETE FROM saved_cards WHERE id = ${req.params.cardId}`;
        res.json({ message: "Card removed from vault" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});




app.listen(port, () => {
    console.log(`Server running`);
});