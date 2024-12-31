const Analysis = require('../models/Analysis');

const analyzeImpact = async (releaseVersion, jiraData, githubData) => {
  try {
    // Analyze affected areas based on changed files and JIRA tickets
    const affectedAreas = analyzeAffectedAreas(jiraData, githubData);
    
    // Generate test cases based on changes
    const testCases = generateTestCases(affectedAreas, jiraData);
    
    // Determine additional actions needed
    const additionalActions = determineActions(affectedAreas, jiraData);

    // Create and save analysis to MongoDB
    const analysis = new Analysis({
      releaseVersion,
      affectedAreas,
      testCases,
      additionalActions,
      jiraTickets: jiraData,
      githubPRs: githubData
    });

    await analysis.save();
    return analysis;
  } catch (error) {
    console.error('Error in impact analysis:', error);
    throw error;
  }
};

// Helper functions for analysis
function analyzeAffectedAreas(jiraData, githubData) {
  const areas = new Map();

  // Analyze JIRA tickets
  jiraData.forEach(ticket => {
    const area = determineAreaFromTicket(ticket);
    if (area) {
      const confidence = calculateConfidence(ticket);
      areas.set(area.name, {
        name: area.name,
        confidence: confidence,
        impactLevel: determineImpactLevel(ticket, confidence)
      });
    }
  });

  // Analyze GitHub changes
  githubData.forEach(pr => {
    pr.files.forEach(file => {
      const area = determineAreaFromFile(file.filename);
      if (area) {
        const existing = areas.get(area.name) || { confidence: 0 };
        areas.set(area.name, {
          name: area.name,
          confidence: Math.max(existing.confidence, calculateConfidenceFromChanges(file.changes)),
          impactLevel: determineImpactLevelFromChanges(file.changes)
        });
      }
    });
  });

  return Array.from(areas.values());
}

function generateTestCases(affectedAreas, jiraData) {
  const testCases = [];
  let testCaseId = 1;

  affectedAreas.forEach(area => {
    const relatedTickets = jiraData.filter(ticket => 
      ticket.summary.toLowerCase().includes(area.name.toLowerCase())
    );

    relatedTickets.forEach(ticket => {
      testCases.push({
        id: `TC${String(testCaseId).padStart(3, '0')}`,
        name: `Verify ${ticket.summary}`,
        priority: ticket.priority,
        area: area.name
      });
      testCaseId++;
    });
  });

  return testCases;
}

function determineActions(affectedAreas, jiraData) {
  const actions = [];
  const today = new Date();

  // Add standard actions based on affected areas
  affectedAreas.forEach(area => {
    if (area.impactLevel === 'HIGH') {
      actions.push({
        action: `Update test environment for ${area.name}`,
        priority: 'HIGH',
        deadline: new Date(today.setDate(today.getDate() + 1))
      });
    }
  });

  // Add actions based on JIRA ticket types
  const uniqueTicketTypes = new Set(jiraData.map(ticket => ticket.type));
  uniqueTicketTypes.forEach(type => {
    actions.push({
      action: `Review all ${type} changes`,
      priority: 'MEDIUM',
      deadline: new Date(today.setDate(today.getDate() + 2))
    });
  });

  return actions;
}

// Helper utility functions (implement these based on your specific needs)
function determineAreaFromTicket(ticket) { /* Implementation */ }
function calculateConfidence(ticket) { /* Implementation */ }
function determineImpactLevel(ticket, confidence) { /* Implementation */ }
function determineAreaFromFile(filename) { /* Implementation */ }
function calculateConfidenceFromChanges(changes) { /* Implementation */ }
function determineImpactLevelFromChanges(changes) { /* Implementation */ }

module.exports = {
  analyzeImpact
}; 