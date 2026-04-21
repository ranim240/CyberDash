/**
 * Seed Runner
 * Executes all seed files in the correct order
 * 
 * Usage: npm run seed:all
 * Or: node src/seeds/runSeeds.js
 */

import { spawn } from 'child_process';

// Seeds to run in order
const SEEDS_IN_ORDER = [
  'seedLearnerBadges',
];

/**
 * Run a single seed command
 * @param {string} seedName - Name of the seed (without .js)
 * @returns {Promise<void>}
 */
function runSeed(seedName) {
  return new Promise((resolve, reject) => {
    console.log(`📌 Running: ${seedName}.js`);

    const knexProcess = spawn('npx', ['knex', 'seed:run', `--specific=${seedName}.js`], {
      stdio: 'inherit',
      shell: true,
    });

    knexProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${seedName}.js completed successfully\n`);
        resolve();
      } else {
        reject(new Error(`${seedName}.js failed with exit code ${code}`));
      }
    });

    knexProcess.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Run all seeds sequentially
 */
async function runAllSeeds() {
  console.log('🌱 Starting seed execution...\n');

  try {
    for (const seedName of SEEDS_IN_ORDER) {
      await runSeed(seedName);
    }

    console.log('🎉 All seeds executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed execution failed:', error.message);
    process.exit(1);
  }
}

// Run all seeds
runAllSeeds();
