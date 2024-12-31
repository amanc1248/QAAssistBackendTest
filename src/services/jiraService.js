const JiraClient = require('jira-client');
require('dotenv').config();

const jira = new JiraClient({
    protocol: 'https',
    host: process.env.JIRA_HOST,
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_API_TOKEN,
    apiVersion: '3',
    strictSSL: true
});

const fetchJiraData = async (releaseVersion) => {
    try {
        const data = await jira.findIssue("DRAYOS-18572");
        // return data
        console.log(data)

        // get all release
        const versions = await jira.getVersions("DRAYOS");
        console.log(versions)

        // get particular release
        const release = await jira.getVersion("10499")
        console.log(release)

        const searchResults = await jira.searchJira(`fixVersion = "2.37.9"`, {
            fields: ['key', 'summary', 'issuetype', 'status', 'priority', 'components'],
            maxResults: 500
        });

        console.log('Tickets in Release:', searchResults.issues);
        // const releaseJiraTickets = await jira.searchJira(`project = DRAYOS AND fixVersion = '${releaseVersion}'`);
        //     jira.findIssue("DRAYOS-18572")
        //   .then(function(issue) {
        //     console.log('Status: ' + issue.fields.status.name);
        //   })
        //   .catch(function(err) {
        //     console.error(err);
        //   });
        // const jql = `project = ${process.env.JIRA_PROJECT_KEY} AND fixVersion = '${releaseVersion}'`;
        // const issues = await jira.searchJira(jql);

        // return issues.issues.map(issue => ({
        //   key: issue.key,
        //   summary: issue.fields.summary,
        //   type: issue.fields.issuetype.name,
        //   status: issue.fields.status.name,
        //   priority: issue.fields.priority.name
        // }));
    } catch (error) {
        console.error('Error fetching JIRA data:', error);
        throw error;
    }
};

module.exports = {
    fetchJiraData
}; 