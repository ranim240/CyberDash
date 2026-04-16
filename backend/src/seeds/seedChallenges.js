/**
 * Seed Challenges
 * Creates challenges with associated challenge files
 * Run after seedUsers and seedCategories
 *
 * NOTE: Update these instructor IDs and category IDs to match your seeded data
 */

import { generateChallengeId, generateFileId } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data (respecting foreign key constraints)
  await knex('challenge_file').del();
  await knex('challenge').del();

  // These IDs should match those created in seedUsers and seedCategories
  // For now using placeholder format - update with actual IDs
  const INSTRUCTOR_1_ID = 'user_003_41f2c6ee'; // Update this
  const INSTRUCTOR_2_ID = 'user_004_584e2d29'; // Update this
  const CATEGORY_WEB_ID = 'category_001_0a1a1834'; // Update this
  const CATEGORY_CRYPTO_ID = 'category_002_9e074361'; // Update this
  const CATEGORY_NETWORK_ID = 'category_003_7ef1ee45'; // Update this

  // Challenge IDs
  const challenge1Id = generateChallengeId(1);
  const challenge2Id = generateChallengeId(2);
  const challenge3Id = generateChallengeId(3);
  const challenge4Id = generateChallengeId(4);
  const challenge5Id = generateChallengeId(5);

  // Insert challenges
  const challenges = [
    {
      challenge_id: challenge1Id,
      title: 'SQL Injection Basics',
      description: 'Learn to identify and exploit SQL injection vulnerabilities in a practice environment.',
      difficulty: 'beginner',
      points: 50,
      status: 'active',
      created_at: new Date('2026-02-01'),
      flag: 'FLAG{sql_inj3ction_basics_solved}',
      category_id: CATEGORY_WEB_ID,
      instructor_id: INSTRUCTOR_1_ID,
    },
    {
      challenge_id: challenge2Id,
      title: 'XSS Attack Patterns',
      description: 'Understand Cross-Site Scripting vulnerabilities and their exploitation techniques.',
      difficulty: 'intermediate',
      points: 100,
      status: 'active',
      created_at: new Date('2026-02-05'),
      flag: 'FLAG{xss_attack_mastered}',
      category_id: CATEGORY_WEB_ID,
      instructor_id: INSTRUCTOR_1_ID,
    },
    {
      challenge_id: challenge3Id,
      title: 'Caesar Cipher Challenge',
      description: 'Decrypt messages encrypted with the Caesar cipher algorithm.',
      difficulty: 'beginner',
      points: 30,
      status: 'active',
      created_at: new Date('2026-02-10'),
      flag: 'FLAG{caesar_cipher_broken}',
      category_id: CATEGORY_CRYPTO_ID,
      instructor_id: INSTRUCTOR_2_ID,
    },
    {
      challenge_id: challenge4Id,
      title: 'RSA Encryption Cracking',
      description: 'Learn to factor large numbers and break RSA encryption in controlled scenarios.',
      difficulty: 'advanced',
      points: 200,
      status: 'active',
      created_at: new Date('2026-02-12'),
      flag: 'FLAG{rsa_compromised}',
      category_id: CATEGORY_CRYPTO_ID,
      instructor_id: INSTRUCTOR_2_ID,
    },
    {
      challenge_id: challenge5Id,
      title: 'ARP Spoofing Lab',
      description: 'Perform ARP spoofing attacks and understand network layer vulnerabilities.',
      difficulty: 'intermediate',
      points: 120,
      status: 'active',
      created_at: new Date('2026-02-15'),
      flag: 'FLAG{arp_network_compromise}',
      category_id: CATEGORY_NETWORK_ID,
      instructor_id: INSTRUCTOR_1_ID,
    },
  ];

  await knex('challenge').insert(challenges);

  // Insert challenge files
  const challengeFiles = [
    {
      file_id: generateFileId(1),
      challenge_id: challenge1Id,
      file_name: 'database-schema.sql',
      file_path: '/challenges/sql-injection/database-schema.sql',
      file_size: 2048,
    },
    {
      file_id: generateFileId(2),
      challenge_id: challenge1Id,
      file_name: 'application.jar',
      file_path: '/challenges/sql-injection/application.jar',
      file_size: 5242880,
    },
    {
      file_id: generateFileId(3),
      challenge_id: challenge2Id,
      file_name: 'vulnerable-app.html',
      file_path: '/challenges/xss/vulnerable-app.html',
      file_size: 4096,
    },
    {
      file_id: generateFileId(4),
      challenge_id: challenge2Id,
      file_name: 'server.js',
      file_path: '/challenges/xss/server.js',
      file_size: 6144,
    },
    {
      file_id: generateFileId(5),
      challenge_id: challenge3Id,
      file_name: 'encrypted-message.txt',
      file_path: '/challenges/caesar/encrypted-message.txt',
      file_size: 512,
    },
    {
      file_id: generateFileId(6),
      challenge_id: challenge4Id,
      file_name: 'public-key.pem',
      file_path: '/challenges/rsa/public-key.pem',
      file_size: 1024,
    },
    {
      file_id: generateFileId(7),
      challenge_id: challenge4Id,
      file_name: 'encrypted-data.bin',
      file_path: '/challenges/rsa/encrypted-data.bin',
      file_size: 8192,
    },
    {
      file_id: generateFileId(8),
      challenge_id: challenge5Id,
      file_name: 'network-simulation.pcap',
      file_path: '/challenges/arp-spoof/network.pcap',
      file_size: 10485760,
    },
  ];

  await knex('challenge_file').insert(challengeFiles);
};
