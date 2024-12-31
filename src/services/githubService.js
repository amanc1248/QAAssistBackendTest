const { Octokit } = require('octokit');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const fetchGithubData = async (releaseVersion) => {
  try {
    // Get PRs associated with the release
    const { data: pulls } = await octokit.rest.pulls.list({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      state: 'closed',
      per_page: 100
    });

    // Filter PRs by release version (assuming PRs are labeled with release version)
    const releasePRs = pulls.filter(pr => 
      pr.labels.some(label => label.name.includes(releaseVersion))
    );

    // Get detailed information for each PR
    const prDetails = await Promise.all(
      releasePRs.map(async pr => {
        const { data: files } = await octokit.rest.pulls.listFiles({
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          pull_number: pr.number
        });

        return {
          number: pr.number,
          title: pr.title,
          url: pr.html_url,
          files: files.map(file => ({
            filename: file.filename,
            changes: file.changes
          }))
        };
      })
    );

    return prDetails;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
};

module.exports = {
  fetchGithubData
}; 