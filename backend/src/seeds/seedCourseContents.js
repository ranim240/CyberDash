/**
 * Seed Course Contents
 * Creates course lessons and content
 * Run after seedCourses
 *
 * NOTE: Update course IDs to match those created in seedCourses
 */

import { generateContentId } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('course_content').del();

  // Reference course IDs - update these to match seedCourses
  const COURSE_1_ID = 'course_001_6cbd9a1b'; // Update this - Web Security
  const COURSE_2_ID = 'course_002_54f09a59'; // Update this - Cryptography
  const COURSE_3_ID = 'course_003_31329622'; // Update this - Network Security
  const COURSE_4_ID = 'course_004_09fa5c57'; // Update this - Linux Hardening

  const content1Id = generateContentId(1);
  const content2Id = generateContentId(2);
  const content3Id = generateContentId(3);
  const content4Id = generateContentId(4);
  const content5Id = generateContentId(5);
  const content6Id = generateContentId(6);
  const content7Id = generateContentId(7);
  const content8Id = generateContentId(8);
  const content9Id = generateContentId(9);
  const content10Id = generateContentId(10);

  await knex('course_content').insert([
    // Web Security Fundamentals
    {
      content_id: content1Id,
      course_id: COURSE_1_ID,
      title: 'Module 1: Introduction to Web Security',
      data: JSON.stringify({
        sections: [
          { title: 'What is Web Security?', content: 'Comprehensive overview of web security threats...' },
          { title: 'Common Attack Vectors', content: 'Understanding different types of attacks...' },
        ],
      }),
      is_published: true,
    },
    {
      content_id: content2Id,
      course_id: COURSE_1_ID,
      title: 'Module 2: SQL Injection',
      data: JSON.stringify({
        sections: [
          { title: 'SQL Injection Basics', content: 'How SQL injection attacks work...' },
          { title: 'Prevention Techniques', content: 'Parameterized queries and input validation...' },
        ],
      }),
      is_published: true,
    },
    {
      content_id: content3Id,
      course_id: COURSE_1_ID,
      title: 'Module 3: Cross-Site Scripting (XSS)',
      data: JSON.stringify({
        sections: [
          { title: 'XSS Vulnerabilities', content: 'Types of XSS attacks...' },
          { title: 'XSS Prevention', content: 'Output encoding and content security policies...' },
        ],
      }),
      is_published: true,
    },
    {
      content_id: content4Id,
      course_id: COURSE_1_ID,
      title: 'Module 4: CSRF and Other Top 10',
      data: JSON.stringify({
        sections: [
          { title: 'CSRF Attacks', content: 'Cross-Site Request Forgery explained...' },
          { title: 'OWASP Top 10 Review', content: 'Other critical vulnerabilities...' },
        ],
      }),
      is_published: false,
    },

    // Advanced Cryptography
    {
      content_id: content5Id,
      course_id: COURSE_2_ID,
      title: 'Module 1: Cryptographic Fundamentals',
      data: JSON.stringify({
        sections: [
          { title: 'What is Cryptography?', content: 'Historical and modern cryptography...' },
          { title: 'Symmetric vs Asymmetric', content: 'Key differences and use cases...' },
        ],
      }),
      is_published: true,
    },
    {
      content_id: content6Id,
      course_id: COURSE_2_ID,
      title: 'Module 2: RSA Encryption',
      data: JSON.stringify({
        sections: [
          { title: 'RSA Algorithm', content: 'Understanding RSA mechanism...' },
          { title: 'Implementation and Security', content: 'Practical RSA implementation...' },
        ],
      }),
      is_published: true,
    },

    // Network Security Essentials
    {
      content_id: content7Id,
      course_id: COURSE_3_ID,
      title: 'Module 1: Network Fundamentals',
      data: JSON.stringify({
        sections: [
          { title: 'OSI Model', content: 'Understanding network layers...' },
          { title: 'Network Protocols', content: 'TCP/IP, UDP, ICMP overview...' },
        ],
      }),
      is_published: true,
    },
    {
      content_id: content8Id,
      course_id: COURSE_3_ID,
      title: 'Module 2: Firewalls and IDS',
      data: JSON.stringify({
        sections: [
          { title: 'Firewall Types', content: 'Stateless, stateful, proxy firewalls...' },
          { title: 'Intrusion Detection', content: 'IDS/IPS systems and signatures...' },
        ],
      }),
      is_published: true,
    },

    // Linux System Hardening
    {
      content_id: content9Id,
      course_id: COURSE_4_ID,
      title: 'Module 1: Linux Security Basics',
      data: JSON.stringify({
        sections: [
          { title: 'User Management', content: 'Users, groups, and permissions...' },
          { title: 'File Permissions', content: 'Understanding chmod and ACLs...' },
        ],
      }),
      is_published: true,
    },
    {
      content_id: content10Id,
      course_id: COURSE_4_ID,
      title: 'Module 2: Service Hardening',
      data: JSON.stringify({
        sections: [
          { title: 'Service Security', content: 'Configuring secure services...' },
          { title: 'Monitoring and Logging', content: 'Audit trails and log management...' },
        ],
      }),
      is_published: false,
    },
  ]);
};
