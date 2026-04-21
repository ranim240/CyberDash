import {
  getGlobalStats,
  getAnalytics,
  getPendingChallenges,
  getIncidentReports
} from './admin.services.js';

async function test() {
  try {
    console.log("=== Global Stats ===");
    console.log(await getGlobalStats());

    console.log("\n=== Analytics ===");
    console.log(await getAnalytics());

    console.log("\n=== Pending Challenges ===");
    console.log(await getPendingChallenges());

    console.log("\n=== Incident Reports ===");
    console.log(await getIncidentReports({ page: 1, limit: 5 }));

  } catch (err) {
    console.error(err);
  }
}

test();