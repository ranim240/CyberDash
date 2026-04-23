/**
 * Seed Categories
 * Creates challenge categories
 * Run after seedUsers
 */

import {
  category1Id,
  category2Id,
  category3Id,
  category4Id,
  category5Id,
} from './seedIds.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('category').del();
  console.log(category1Id);
  await knex('category').insert([
    {
      category_id: category1Id,
      name: 'Web Security',
      description: 'Learn about web application vulnerabilities and protection techniques',
      icon_url: 'https://api.cyberdash.com/icons/web-security.svg',
    },
    {
      category_id: category2Id,
      name: 'Cryptography',
      description: 'Master encryption, hashing, and cryptographic algorithms',
      icon_url: 'https://api.cyberdash.com/icons/cryptography.svg',
    },
    {
      category_id: category3Id,
      name: 'Network Security',
      description: 'Understand network attacks and defense mechanisms',
      icon_url: 'https://api.cyberdash.com/icons/network-security.svg',
    },
    {
      category_id: category4Id,
      name: 'System Administration',
      description: 'Learn Linux/Windows administration and security hardening',
      icon_url: 'https://api.cyberdash.com/icons/sys-admin.svg',
    },
    {
      category_id: category5Id,
      name: 'Reverse Engineering',
      description: 'Discover how to analyze and understand malware and binaries',
      icon_url: 'https://api.cyberdash.com/icons/reverse-eng.svg',
    },
  ]);
};
