const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const cors = require('cors')

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

app.listen(port, () => {
    console.log(`Server running`);
});