const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qa_agent_db';

// Middleware
app.use(express.json());

// MongoDB Connection
let db;

async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(MONGODB_URI);
        db = client.db('qa_agent_db');
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Routes

// 1. Analyze Release Impact
app.post('/api/analyze-release', async (req, res) => {
    try {
        const { releaseVersion, documentation, githubPR } = req.body;
        
        // TODO: Implement analysis logic
        const analysis = {
            releaseVersion,
            affectedAreas: [],
            suggestedTestCases: [],
            additionalActions: []
        };
        
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Analysis failed', message: error.message });
    }
});

// 2. Get Historical Analysis
app.get('/api/analysis-history/:releaseVersion', async (req, res) => {
    try {
        const { releaseVersion } = req.params;
        const analysisHistory = await db.collection('analysis_history')
            .findOne({ releaseVersion });
        
        if (!analysisHistory) {
            return res.status(404).json({ message: 'No analysis found for this release' });
        }
        
        res.json(analysisHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analysis history', message: error.message });
    }
});

// Start server
async function startServer() {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer(); 