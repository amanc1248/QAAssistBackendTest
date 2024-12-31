const { fetchJiraData } = require('../services/jiraService.js');
const { fetchGithubData } = require('../services/githubService.js');
const { analyzeImpact } = require('../services/analysisService.js');
const Analysis = require('../models/Analysis.js');

const analyzeRelease = async (req, res) => {
    const { releaseVersion } = req.body;

    try {
        // Check if analysis already exists
        // let analysis = await Analysis.findOne({ releaseVersion });
        const jiraData = await fetchJiraData(releaseVersion)
        console.log(jiraData)
        // if (true) {
        //     // Fetch data from JIRA and GitHub
        //     const [jiraData, githubData] = await Promise.all([
        //         fetchJiraData(releaseVersion),
        //         fetchGithubData(releaseVersion)
        //     ]);

        //     // Perform analysis and save to database
        //     analysis = await analyzeImpact(releaseVersion, jiraData, githubData);
        // }

        // res.json(analysis);
    } catch (error) {
        console.error('Error in release analysis:', error);
        res.status(500).json({ error: 'Failed to analyze release' });
    }
};

module.exports = {
    analyzeRelease
}; 