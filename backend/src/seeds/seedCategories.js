/**
 * Seed Categories
 * Creates challenge categories
 * Run after seedUsers
 */

import { generateCategoryId } from './seedUtils.js';

export const seed = async (knex) => {
  // Delete existing data
  await knex('category').del();

  const category1Id = generateCategoryId(1);
  const category2Id = generateCategoryId(2);
  const category3Id = generateCategoryId(3);
  const category4Id = generateCategoryId(4);
  const category5Id = generateCategoryId(5);

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
