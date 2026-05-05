const Job = require("../models/Job");
const Company = require("../models/Company");
const User = require("../models/User");

/**
 * Smart JSON Upload Terminal
 * Detects model type and performs bulk upserts to prevent duplicates.
 */
exports.uploadJSON = async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid JSON format. Expected an array of objects." });
    }

    if (data.length === 0) {
      return res.status(400).json({ message: "Empty data array provided." });
    }

    // 1. Detect Model Type
    const firstItem = data[0];
    let Model;
    let uniqueFields = [];

    if (firstItem.skills && (firstItem.title || firstItem.jobType)) {
      Model = Job;
      uniqueFields = ["title", "company"]; // Composite key for duplication check
    } else if (firstItem.industry || firstItem.companyName) {
      Model = Company;
      uniqueFields = ["companyName"];
    } else if (firstItem.email && firstItem.role) {
      Model = User;
      uniqueFields = ["email"];
    } else {
      return res.status(400).json({ message: "Undefined data schema. Ensure fields match Jobs, Companies, or Users blueprint." });
    }

    // 2. Bulk Execution (Upsert)
    const results = { updated: 0, inserted: 0, errors: 0 };

    for (const item of data) {
      try {
        const query = {};
        uniqueFields.forEach(field => { query[field] = item[field]; });

        const outcome = await Model.updateOne(
          query,
          { $set: item },
          { upsert: true }
        );

        if (outcome.upsertedCount > 0) results.inserted++;
        else results.updated++;
      } catch (err) {
        console.error("In-loop Upload Error:", err.message);
        results.errors++;
      }
    }

    res.json({
      success: true,
      message: `Data Engine processed ${data.length} nodes.`,
      summary: results
    });

  } catch (err) {
    res.status(500).json({ message: "Engine Failure: " + err.message });
  }
};
