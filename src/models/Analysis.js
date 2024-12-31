const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  releaseVersion: {
    type: String,
    required: true,
    unique: true
  },
  affectedAreas: [{
    name: String,
    confidence: Number,
    impactLevel: String
  }],
  testCases: [{
    id: String,
    name: String,
    priority: String,
    area: String
  }],
  additionalActions: [{
    action: String,
    priority: String,
    deadline: Date
  }],
  jiraTickets: [{
    key: String,
    summary: String,
    type: String,
    status: String,
    priority: String
  }],
  githubPRs: [{
    number: Number,
    title: String,
    url: String,
    files: [{
      filename: String,
      changes: Number
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema); 