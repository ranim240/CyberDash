/**
 * ═══════════════════════════════════════════════════════════════════
 * seedMLComplete.js — Complete Database Population for ML Training
 * ═══════════════════════════════════════════════════════════════════
 *
 * This script replaces ALL individual seeds and creates a coherent
 * dataset optimized for XGBoost training.
 *
 * Data volume:
 *   - 207 users (2 admins, 5 instructors, 200 learners)
 *   - 5 categories, 15 skills, 30 challenges, 6 courses + content
 *   - ~3000 challenge sessions, ~6000 submissions
 *   - ~6000 attempt metrics, ~8000 activity logs
 *   - ~3000 skill_profile entries (200 learners × 15 skills)
 *   - ai_feedback, enrollments, learner_badges, recommendation_history
 *   - challenge_files for each challenge
 *
 * Run:  node src/seeds/seedMLComplete.js
 * ═══════════════════════════════════════════════════════════════════
 */

import db from '../config/db.js';
import bcrypt from 'bcrypt';

// ═══════════════════════════════════════════════════════════════════
// SECTION 1 — Helpers
// ═══════════════════════════════════════════════════════════════════

/** Seeded PRNG for reproducible data generation */
class Rng {
  constructor(seed = 42) { this.s = seed; }
  next() { this.s = (this.s * 16807 + 7) % 2147483647; return this.s / 2147483647; }
  int(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  float(min, max) { return +(this.next() * (max - min) + min).toFixed(4); }
  bool(p) { return this.next() < p; }
  pick(a) { return a[this.int(0, a.length - 1)]; }
  shuffle(a) { const c = [...a]; for (let i = c.length-1; i > 0; i--) { const j = this.int(0,i); [c[i],c[j]]=[c[j],c[i]]; } return c; }
  sample(a, n) { return this.shuffle(a).slice(0, Math.min(n, a.length)); }
}
const rng = new Rng(42);

let _counter = 0;
const uid = (prefix) => `${prefix}_${String(++_counter).padStart(5, '0')}`;

const SALT_ROUNDS = 10;
const hashPassword = (pw) => bcrypt.hashSync(pw, SALT_ROUNDS);

const dayMs = 86400000;
const BASE_DATE = new Date('2026-01-15').getTime();
const dateAt = (daysOffset, hourOffset = 0) =>
  new Date(BASE_DATE + daysOffset * dayMs + hourOffset * 3600000);

async function batchInsert(table, rows, size = 400) {
  for (let i = 0; i < rows.length; i += size) {
    await db(table).insert(rows.slice(i, i + size));
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2 — Static Reference Data
// ═══════════════════════════════════════════════════════════════════

const CATEGORIES = [
  { category_id: 'cat_001', name: 'Web Security',          description: 'Web application vulnerabilities and protection techniques',         icon_url: '/icons/web.svg' },
  { category_id: 'cat_002', name: 'Cryptography',          description: 'Encryption, hashing, and cryptographic algorithms',                icon_url: '/icons/crypto.svg' },
  { category_id: 'cat_003', name: 'Network Security',      description: 'Network attacks and defense mechanisms',                           icon_url: '/icons/network.svg' },
  { category_id: 'cat_004', name: 'System Administration', description: 'Linux/Windows administration and security hardening',              icon_url: '/icons/sysadmin.svg' },
  { category_id: 'cat_005', name: 'Reverse Engineering',   description: 'Analyze and understand malware and binaries',                      icon_url: '/icons/reverse.svg' },
];

const SKILLS = [
  { skill_id: 'skl_001', name: 'SQL Injection - Union Based',  category_id: 'cat_001', description: 'Exploiting UNION-based SQL injection' },
  { skill_id: 'skl_002', name: 'SQL Injection - Blind',        category_id: 'cat_001', description: 'Boolean and time-based blind SQLi' },
  { skill_id: 'skl_003', name: 'XSS - Reflected',              category_id: 'cat_001', description: 'Non-persistent cross-site scripting' },
  { skill_id: 'skl_004', name: 'XSS - Stored',                 category_id: 'cat_001', description: 'Persistent cross-site scripting' },
  { skill_id: 'skl_005', name: 'CSRF Exploitation',            category_id: 'cat_001', description: 'Cross-site request forgery attacks' },
  { skill_id: 'skl_006', name: 'Classical Ciphers',            category_id: 'cat_002', description: 'Caesar, Vigenère, substitution ciphers' },
  { skill_id: 'skl_007', name: 'RSA Cryptanalysis',            category_id: 'cat_002', description: 'Factorization and RSA key attacks' },
  { skill_id: 'skl_008', name: 'Symmetric Encryption',         category_id: 'cat_002', description: 'AES, DES, and symmetric key recovery' },
  { skill_id: 'skl_009', name: 'Hash Analysis',                category_id: 'cat_002', description: 'Hash cracking and collision attacks' },
  { skill_id: 'skl_010', name: 'Network Spoofing',             category_id: 'cat_003', description: 'ARP, DNS, and IP spoofing attacks' },
  { skill_id: 'skl_011', name: 'Packet Analysis',              category_id: 'cat_003', description: 'Wireshark, tcpdump, traffic analysis' },
  { skill_id: 'skl_012', name: 'Firewall Evasion',             category_id: 'cat_003', description: 'Bypassing network access controls' },
  { skill_id: 'skl_013', name: 'Privilege Escalation',         category_id: 'cat_004', description: 'Linux/Windows privilege escalation' },
  { skill_id: 'skl_014', name: 'System Hardening',             category_id: 'cat_004', description: 'OS configuration and access control' },
  { skill_id: 'skl_015', name: 'Binary Reversing',             category_id: 'cat_005', description: 'Disassembly, decompilation, debugging' },
];

// Instructor IDs (will be created in user generation)
const INST1 = 'usr_00003'; const INST2 = 'usr_00004';
const INST3 = 'usr_00005'; const INST4 = 'usr_00006'; const INST5 = 'usr_00007';

const CHALLENGES = [
  // ─── Web Security (10 challenges) ───
  { challenge_id: 'chg_001', title: 'SQL Injection Basics',          description: 'Identify and exploit basic SQL injection vulnerabilities in a login form.',         difficulty: 'beginner',     points: 50,  flag: 'FLAG{sql_union_basics_001}',        category_id: 'cat_001', instructor_id: INST1, status: 'active', created_at: dateAt(15) },
  { challenge_id: 'chg_002', title: 'SQL Injection - Blind Attack',  description: 'Extract data using boolean-based blind SQL injection techniques.',                 difficulty: 'advanced',     points: 200, flag: 'FLAG{sql_blind_adv_002}',           category_id: 'cat_001', instructor_id: INST1, status: 'active', created_at: dateAt(16) },
  { challenge_id: 'chg_003', title: 'XSS Reflected Lab',             description: 'Find and exploit a reflected XSS vulnerability in a search page.',                 difficulty: 'beginner',     points: 50,  flag: 'FLAG{xss_reflected_003}',           category_id: 'cat_001', instructor_id: INST1, status: 'active', created_at: dateAt(17) },
  { challenge_id: 'chg_004', title: 'XSS Stored Attack',             description: 'Inject persistent JavaScript into a comment section.',                              difficulty: 'intermediate', points: 100, flag: 'FLAG{xss_stored_004}',              category_id: 'cat_001', instructor_id: INST1, status: 'active', created_at: dateAt(18) },
  { challenge_id: 'chg_005', title: 'CSRF Token Bypass',             description: 'Bypass CSRF protections to perform unauthorized actions.',                          difficulty: 'intermediate', points: 120, flag: 'FLAG{csrf_bypass_005}',             category_id: 'cat_001', instructor_id: INST2, status: 'active', created_at: dateAt(19) },
  { challenge_id: 'chg_006', title: 'HTTP Header Injection',         description: 'Exploit HTTP response splitting via header injection.',                             difficulty: 'beginner',     points: 40,  flag: 'FLAG{header_inject_006}',           category_id: 'cat_001', instructor_id: INST2, status: 'active', created_at: dateAt(20) },
  { challenge_id: 'chg_007', title: 'Authentication Bypass',         description: 'Obtain admin access by exploiting broken authentication.',                          difficulty: 'advanced',     points: 250, flag: 'FLAG{auth_bypass_007}',             category_id: 'cat_001', instructor_id: INST1, status: 'active', created_at: dateAt(21) },
  { challenge_id: 'chg_008', title: 'File Upload Vulnerability',     description: 'Upload a web shell by bypassing file upload restrictions.',                         difficulty: 'intermediate', points: 150, flag: 'FLAG{file_upload_008}',             category_id: 'cat_001', instructor_id: INST2, status: 'active', created_at: dateAt(22) },
  { challenge_id: 'chg_009', title: 'SSRF Discovery',                description: 'Exploit server-side request forgery to access internal services.',                 difficulty: 'advanced',     points: 220, flag: 'FLAG{ssrf_009}',                    category_id: 'cat_001', instructor_id: INST1, status: 'active', created_at: dateAt(23) },
  { challenge_id: 'chg_010', title: 'Directory Traversal',           description: 'Read sensitive files using path traversal techniques.',                             difficulty: 'beginner',     points: 45,  flag: 'FLAG{dir_traversal_010}',           category_id: 'cat_001', instructor_id: INST2, status: 'active', created_at: dateAt(24) },
  // ─── Cryptography (7 challenges) ───
  { challenge_id: 'chg_011', title: 'Caesar Cipher Challenge',       description: 'Decrypt messages encrypted with the Caesar cipher algorithm.',                     difficulty: 'beginner',     points: 30,  flag: 'FLAG{caesar_broken_011}',           category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(25) },
  { challenge_id: 'chg_012', title: 'Base64 & Encoding Lab',         description: 'Decode multiple layers of encoding to find the hidden flag.',                      difficulty: 'beginner',     points: 25,  flag: 'FLAG{encoding_lab_012}',            category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(26) },
  { challenge_id: 'chg_013', title: 'Vigenere Cipher Crack',         description: 'Break a Vigenère cipher using Kasiski examination.',                               difficulty: 'intermediate', points: 80,  flag: 'FLAG{vigenere_crack_013}',          category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(27) },
  { challenge_id: 'chg_014', title: 'RSA Encryption Cracking',       description: 'Factor large numbers and break RSA encryption.',                                   difficulty: 'advanced',     points: 200, flag: 'FLAG{rsa_cracked_014}',             category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(28) },
  { challenge_id: 'chg_015', title: 'Hash Collision Attack',         description: 'Find two inputs producing the same MD5 hash.',                                     difficulty: 'advanced',     points: 220, flag: 'FLAG{hash_collision_015}',          category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(29) },
  { challenge_id: 'chg_016', title: 'AES Key Recovery',              description: 'Recover the AES key from a poorly implemented encryption.',                        difficulty: 'intermediate', points: 130, flag: 'FLAG{aes_recovery_016}',            category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(30) },
  { challenge_id: 'chg_017', title: 'Frequency Analysis',            description: 'Use letter frequency analysis to decrypt a substitution cipher.',                  difficulty: 'intermediate', points: 90,  flag: 'FLAG{freq_analysis_017}',           category_id: 'cat_002', instructor_id: INST3, status: 'active', created_at: dateAt(31) },
  // ─── Network Security (6 challenges) ───
  { challenge_id: 'chg_018', title: 'ARP Spoofing Lab',              description: 'Perform ARP spoofing and understand layer-2 vulnerabilities.',                     difficulty: 'intermediate', points: 120, flag: 'FLAG{arp_spoof_018}',               category_id: 'cat_003', instructor_id: INST4, status: 'active', created_at: dateAt(32) },
  { challenge_id: 'chg_019', title: 'DNS Poisoning Simulation',      description: 'Redirect DNS queries to a malicious server.',                                      difficulty: 'advanced',     points: 180, flag: 'FLAG{dns_poison_019}',              category_id: 'cat_003', instructor_id: INST4, status: 'active', created_at: dateAt(33) },
  { challenge_id: 'chg_020', title: 'Packet Sniffing Basics',        description: 'Capture and analyze network packets to extract credentials.',                      difficulty: 'beginner',     points: 40,  flag: 'FLAG{packet_sniff_020}',            category_id: 'cat_003', instructor_id: INST4, status: 'active', created_at: dateAt(34) },
  { challenge_id: 'chg_021', title: 'TCP SYN Flood Detection',       description: 'Detect and mitigate a SYN flood attack using traffic analysis.',                   difficulty: 'intermediate', points: 110, flag: 'FLAG{syn_flood_021}',               category_id: 'cat_003', instructor_id: INST4, status: 'active', created_at: dateAt(35) },
  { challenge_id: 'chg_022', title: 'Firewall Bypass Techniques',    description: 'Evade firewall rules using fragmentation and tunneling.',                          difficulty: 'advanced',     points: 200, flag: 'FLAG{fw_bypass_022}',               category_id: 'cat_003', instructor_id: INST4, status: 'active', created_at: dateAt(36) },
  { challenge_id: 'chg_023', title: 'Wireless WEP Cracking',         description: 'Crack WEP encryption on a wireless access point.',                                 difficulty: 'intermediate', points: 140, flag: 'FLAG{wep_crack_023}',               category_id: 'cat_003', instructor_id: INST4, status: 'active', created_at: dateAt(37) },
  // ─── System Administration (4 challenges) ───
  { challenge_id: 'chg_024', title: 'Linux Privilege Escalation',    description: 'Escalate from low-privilege user to root on a Linux box.',                         difficulty: 'intermediate', points: 150, flag: 'FLAG{linux_privesc_024}',           category_id: 'cat_004', instructor_id: INST5, status: 'active', created_at: dateAt(38) },
  { challenge_id: 'chg_025', title: 'Log Analysis Challenge',        description: 'Analyze system logs to detect an intrusion timeline.',                             difficulty: 'beginner',     points: 50,  flag: 'FLAG{log_analysis_025}',            category_id: 'cat_004', instructor_id: INST5, status: 'active', created_at: dateAt(39) },
  { challenge_id: 'chg_026', title: 'SSH Key Management',            description: 'Fix misconfigured SSH keys and secure remote access.',                             difficulty: 'beginner',     points: 35,  flag: 'FLAG{ssh_keys_026}',               category_id: 'cat_004', instructor_id: INST5, status: 'active', created_at: dateAt(40) },
  { challenge_id: 'chg_027', title: 'Container Escape',              description: 'Break out of a Docker container to access the host system.',                       difficulty: 'advanced',     points: 250, flag: 'FLAG{container_escape_027}',        category_id: 'cat_004', instructor_id: INST5, status: 'active', created_at: dateAt(41) },
  // ─── Reverse Engineering (3 challenges) ───
  { challenge_id: 'chg_028', title: 'Binary Analysis Basics',        description: 'Use disassembly to find a hidden password in a compiled binary.',                  difficulty: 'beginner',     points: 60,  flag: 'FLAG{binary_basics_028}',           category_id: 'cat_005', instructor_id: INST5, status: 'active', created_at: dateAt(42) },
  { challenge_id: 'chg_029', title: 'Malware Signature Detection',   description: 'Identify malware indicators using static analysis techniques.',                    difficulty: 'intermediate', points: 130, flag: 'FLAG{malware_sig_029}',             category_id: 'cat_005', instructor_id: INST5, status: 'active', created_at: dateAt(43) },
  { challenge_id: 'chg_030', title: 'Buffer Overflow Exploitation',  description: 'Exploit a stack-based buffer overflow to gain code execution.',                    difficulty: 'advanced',     points: 280, flag: 'FLAG{bof_exploit_030}',             category_id: 'cat_005', instructor_id: INST5, status: 'active', created_at: dateAt(44) },
];

// Each challenge tests specific skills with specific weights
const CHALLENGE_SKILLS = [
  // Web Security challenges
  { challenge_id: 'chg_001', skill_id: 'skl_001', weight: 0.9 }, { challenge_id: 'chg_001', skill_id: 'skl_002', weight: 0.1 },
  { challenge_id: 'chg_002', skill_id: 'skl_001', weight: 0.3 }, { challenge_id: 'chg_002', skill_id: 'skl_002', weight: 0.7 },
  { challenge_id: 'chg_003', skill_id: 'skl_003', weight: 1.0 },
  { challenge_id: 'chg_004', skill_id: 'skl_004', weight: 0.8 }, { challenge_id: 'chg_004', skill_id: 'skl_003', weight: 0.2 },
  { challenge_id: 'chg_005', skill_id: 'skl_005', weight: 1.0 },
  { challenge_id: 'chg_006', skill_id: 'skl_003', weight: 0.5 }, { challenge_id: 'chg_006', skill_id: 'skl_005', weight: 0.5 },
  { challenge_id: 'chg_007', skill_id: 'skl_001', weight: 0.4 }, { challenge_id: 'chg_007', skill_id: 'skl_002', weight: 0.3 }, { challenge_id: 'chg_007', skill_id: 'skl_005', weight: 0.3 },
  { challenge_id: 'chg_008', skill_id: 'skl_004', weight: 0.4 }, { challenge_id: 'chg_008', skill_id: 'skl_005', weight: 0.6 },
  { challenge_id: 'chg_009', skill_id: 'skl_001', weight: 0.3 }, { challenge_id: 'chg_009', skill_id: 'skl_005', weight: 0.7 },
  { challenge_id: 'chg_010', skill_id: 'skl_003', weight: 0.6 }, { challenge_id: 'chg_010', skill_id: 'skl_004', weight: 0.4 },
  // Cryptography challenges
  { challenge_id: 'chg_011', skill_id: 'skl_006', weight: 1.0 },
  { challenge_id: 'chg_012', skill_id: 'skl_006', weight: 0.6 }, { challenge_id: 'chg_012', skill_id: 'skl_009', weight: 0.4 },
  { challenge_id: 'chg_013', skill_id: 'skl_006', weight: 1.0 },
  { challenge_id: 'chg_014', skill_id: 'skl_007', weight: 1.0 },
  { challenge_id: 'chg_015', skill_id: 'skl_009', weight: 1.0 },
  { challenge_id: 'chg_016', skill_id: 'skl_008', weight: 1.0 },
  { challenge_id: 'chg_017', skill_id: 'skl_006', weight: 0.5 }, { challenge_id: 'chg_017', skill_id: 'skl_009', weight: 0.5 },
  // Network Security challenges
  { challenge_id: 'chg_018', skill_id: 'skl_010', weight: 1.0 },
  { challenge_id: 'chg_019', skill_id: 'skl_010', weight: 0.6 }, { challenge_id: 'chg_019', skill_id: 'skl_011', weight: 0.4 },
  { challenge_id: 'chg_020', skill_id: 'skl_011', weight: 1.0 },
  { challenge_id: 'chg_021', skill_id: 'skl_011', weight: 0.6 }, { challenge_id: 'chg_021', skill_id: 'skl_012', weight: 0.4 },
  { challenge_id: 'chg_022', skill_id: 'skl_012', weight: 1.0 },
  { challenge_id: 'chg_023', skill_id: 'skl_010', weight: 0.3 }, { challenge_id: 'chg_023', skill_id: 'skl_011', weight: 0.3 }, { challenge_id: 'chg_023', skill_id: 'skl_008', weight: 0.4 },
  // System Administration challenges
  { challenge_id: 'chg_024', skill_id: 'skl_013', weight: 1.0 },
  { challenge_id: 'chg_025', skill_id: 'skl_014', weight: 0.6 }, { challenge_id: 'chg_025', skill_id: 'skl_011', weight: 0.4 },
  { challenge_id: 'chg_026', skill_id: 'skl_014', weight: 0.7 }, { challenge_id: 'chg_026', skill_id: 'skl_008', weight: 0.3 },
  { challenge_id: 'chg_027', skill_id: 'skl_013', weight: 0.8 }, { challenge_id: 'chg_027', skill_id: 'skl_014', weight: 0.2 },
  // Reverse Engineering challenges
  { challenge_id: 'chg_028', skill_id: 'skl_015', weight: 1.0 },
  { challenge_id: 'chg_029', skill_id: 'skl_015', weight: 0.7 }, { challenge_id: 'chg_029', skill_id: 'skl_009', weight: 0.3 },
  { challenge_id: 'chg_030', skill_id: 'skl_015', weight: 0.6 }, { challenge_id: 'chg_030', skill_id: 'skl_013', weight: 0.4 },
];

const COURSES = [
  { course_id: 'crs_001', title: 'Web Security Fundamentals',     description: 'OWASP top 10 vulnerabilities.',              estimated_duration: 40, level: 'beginner',     is_published: true,  instructor_id: INST1, created_at: dateAt(5) },
  { course_id: 'crs_002', title: 'Advanced Web Exploitation',     description: 'Deep web attack techniques.',                 estimated_duration: 60, level: 'advanced',     is_published: true,  instructor_id: INST1, created_at: dateAt(6) },
  { course_id: 'crs_003', title: 'Cryptography Essentials',       description: 'Classical and modern cryptography.',           estimated_duration: 50, level: 'intermediate', is_published: true,  instructor_id: INST3, created_at: dateAt(7) },
  { course_id: 'crs_004', title: 'Network Security Essentials',   description: 'Network protocols and defense.',              estimated_duration: 50, level: 'intermediate', is_published: true,  instructor_id: INST4, created_at: dateAt(8) },
  { course_id: 'crs_005', title: 'Linux System Hardening',        description: 'Secure Linux through configuration.',         estimated_duration: 45, level: 'intermediate', is_published: true,  instructor_id: INST5, created_at: dateAt(9) },
  { course_id: 'crs_006', title: 'Reverse Engineering 101',       description: 'Introduction to binary analysis.',            estimated_duration: 55, level: 'beginner',     is_published: true,  instructor_id: INST5, created_at: dateAt(10) },
];

const COURSE_CONTENTS = [
  { content_id: 'cnt_001', course_id: 'crs_001', title: 'Introduction to OWASP Top 10',         data: 'The OWASP Top 10 is a standard awareness document for web application security...', is_published: true },
  { content_id: 'cnt_002', course_id: 'crs_001', title: 'SQL Injection Explained',              data: 'SQL injection is a code injection technique used to attack data-driven applications...', is_published: true },
  { content_id: 'cnt_003', course_id: 'crs_001', title: 'Cross-Site Scripting Overview',        data: 'XSS attacks enable attackers to inject client-side scripts into web pages...', is_published: true },
  { content_id: 'cnt_004', course_id: 'crs_002', title: 'Advanced SQL Injection Techniques',   data: 'Blind SQL injection, out-of-band techniques, and second-order injection...', is_published: true },
  { content_id: 'cnt_005', course_id: 'crs_002', title: 'Server-Side Request Forgery',         data: 'SSRF vulnerabilities allow attackers to induce the server-side application...', is_published: true },
  { content_id: 'cnt_006', course_id: 'crs_003', title: 'Classical Cipher Techniques',         data: 'Caesar cipher, Vigenère cipher, and their cryptanalysis methods...', is_published: true },
  { content_id: 'cnt_007', course_id: 'crs_003', title: 'Public Key Cryptography',             data: 'RSA algorithm, key generation, encryption/decryption process...', is_published: true },
  { content_id: 'cnt_008', course_id: 'crs_003', title: 'Hash Functions and Integrity',        data: 'MD5, SHA-256, and hash collision attacks explained...', is_published: true },
  { content_id: 'cnt_009', course_id: 'crs_004', title: 'Network Protocols Deep Dive',         data: 'TCP/IP, ARP, DNS — how they work and their vulnerabilities...', is_published: true },
  { content_id: 'cnt_010', course_id: 'crs_004', title: 'Firewall Configuration',              data: 'iptables, firewalld, and network access control best practices...', is_published: true },
  { content_id: 'cnt_011', course_id: 'crs_005', title: 'Linux Permissions and Users',         data: 'File permissions, SUID, sudo configuration, PAM modules...', is_published: true },
  { content_id: 'cnt_012', course_id: 'crs_005', title: 'SSH Security Best Practices',         data: 'Key-based authentication, fail2ban, port knocking...', is_published: true },
  { content_id: 'cnt_013', course_id: 'crs_006', title: 'Introduction to Assembly',            data: 'x86 registers, instructions, calling conventions...', is_published: true },
  { content_id: 'cnt_014', course_id: 'crs_006', title: 'Using Ghidra for Reversing',          data: 'Static analysis, decompiler usage, identifying functions...', is_published: true },
];

// Challenge files (attachments for challenges)
const CHALLENGE_FILES = [
  { file_id: 'cfl_001', challenge_id: 'chg_001', file_name: 'login-form.html',       file_path: '/challenges/sqli-basics/login-form.html',       file_size: 2048 },
  { file_id: 'cfl_002', challenge_id: 'chg_001', file_name: 'database-schema.sql',   file_path: '/challenges/sqli-basics/database-schema.sql',   file_size: 1024 },
  { file_id: 'cfl_003', challenge_id: 'chg_003', file_name: 'search-page.html',      file_path: '/challenges/xss-reflected/search-page.html',    file_size: 3072 },
  { file_id: 'cfl_004', challenge_id: 'chg_004', file_name: 'comment-app.js',        file_path: '/challenges/xss-stored/comment-app.js',         file_size: 4096 },
  { file_id: 'cfl_005', challenge_id: 'chg_008', file_name: 'upload-handler.php',    file_path: '/challenges/file-upload/upload-handler.php',    file_size: 2560 },
  { file_id: 'cfl_006', challenge_id: 'chg_011', file_name: 'encrypted-message.txt', file_path: '/challenges/caesar/encrypted-message.txt',      file_size: 512 },
  { file_id: 'cfl_007', challenge_id: 'chg_014', file_name: 'public-key.pem',        file_path: '/challenges/rsa/public-key.pem',                file_size: 1024 },
  { file_id: 'cfl_008', challenge_id: 'chg_014', file_name: 'encrypted-data.bin',    file_path: '/challenges/rsa/encrypted-data.bin',            file_size: 8192 },
  { file_id: 'cfl_009', challenge_id: 'chg_018', file_name: 'network-capture.pcap',  file_path: '/challenges/arp-spoof/network-capture.pcap',    file_size: 10485760 },
  { file_id: 'cfl_010', challenge_id: 'chg_020', file_name: 'traffic-dump.pcap',     file_path: '/challenges/packet-sniff/traffic-dump.pcap',    file_size: 5242880 },
  { file_id: 'cfl_011', challenge_id: 'chg_024', file_name: 'vulnerable-vm.ova',     file_path: '/challenges/linux-privesc/vulnerable-vm.ova',   file_size: 20971520 },
  { file_id: 'cfl_012', challenge_id: 'chg_028', file_name: 'mystery-binary',        file_path: '/challenges/binary-basics/mystery-binary',      file_size: 65536 },
  { file_id: 'cfl_013', challenge_id: 'chg_030', file_name: 'vulnerable-server',     file_path: '/challenges/buffer-overflow/vulnerable-server', file_size: 131072 },
];

// Map categories to their courses (for activity log generation)
const CAT_TO_COURSES = {
  cat_001: ['crs_001', 'crs_002'],
  cat_002: ['crs_003'],
  cat_003: ['crs_004'],
  cat_004: ['crs_005'],
  cat_005: ['crs_006'],
};

// Map categories to their course IDs (for enrollment generation)
const CAT_TO_COURSE_IDS = {
  cat_001: ['crs_001', 'crs_002'],
  cat_002: ['crs_003'],
  cat_003: ['crs_004'],
  cat_004: ['crs_005'],
  cat_005: ['crs_006'],
};

const BADGES = [
  { badge_id: 'bdg_001', name: 'First Blood',          description: 'Solve your first challenge',       icon_url: '/badges/first-blood.svg',    condition_type: 'first_challenge_solved', condition_value: 1,    xp_bonus: 25,  administrator_id: 'usr_00001' },
  { badge_id: 'bdg_002', name: 'Challenge Master',     description: 'Solve 10 challenges',              icon_url: '/badges/master.svg',         condition_type: 'challenges_solved',      condition_value: 10,   xp_bonus: 100, administrator_id: 'usr_00001' },
  { badge_id: 'bdg_003', name: 'XP Accumulator',       description: 'Earn 500 XP points',               icon_url: '/badges/xp.svg',             condition_type: 'xp_earned',              condition_value: 500,  xp_bonus: 50,  administrator_id: 'usr_00001' },
  { badge_id: 'bdg_004', name: 'On Fire',              description: 'Maintain a 7-day streak',          icon_url: '/badges/fire.svg',            condition_type: 'streak_days',            condition_value: 7,    xp_bonus: 75,  administrator_id: 'usr_00001' },
  { badge_id: 'bdg_005', name: 'Crypto Expert',        description: 'Solve all crypto challenges',      icon_url: '/badges/crypto.svg',          condition_type: 'category_mastery',       condition_value: null, xp_bonus: 200, administrator_id: 'usr_00001' },
];

// AI feedback templates for incorrect submissions (keyed by error_type)
const AI_FEEDBACK_TEMPLATES = {
  syntax_error: [
    'Your syntax is incorrect. Review the structure of the command carefully.',
    'There seems to be a syntax issue. Check for missing or extra characters.',
    'The command structure is not quite right. Double-check the documentation.',
  ],
  logic_error: [
    'Your approach is on the right track, but the logic needs adjustment. Think about what the application expects.',
    'Good thinking, but the logic flow is slightly off. Try tracing through the application step by step.',
    'The concept is correct but your implementation has a logical flaw. Reconsider the order of operations.',
  ],
  wrong_flag: [
    'That is not the correct flag. Make sure you extracted the right value from the challenge.',
    'Close, but the flag format or content is not correct. Check your output carefully.',
    'The flag you submitted does not match. Verify your exploit worked correctly.',
  ],
  close_attempt: [
    'You are very close! Just a small adjustment needed. Look at the details more carefully.',
    'Almost there! Re-examine your last step — there is a subtle detail you are missing.',
    'So close! Your approach is correct, but a minor detail needs fixing.',
  ],
  random_guess: [
    'This does not appear to be a structured attempt. Try reading the challenge description and course material first.',
    'Consider studying the related course material before attempting this challenge.',
    'Take some time to understand the concepts. The course section covers the technique needed here.',
  ],
};

// ═══════════════════════════════════════════════════════════════════
// SECTION 3 — Archetype Definitions
// ═══════════════════════════════════════════════════════════════════
//
// Each archetype defines HOW a learner behaves. These behavioral
// patterns are what XGBoost will learn to recognize and use for
// predicting the optimal challenge difficulty.

const ARCHETYPES = {
  talent: {
    label: 'Talent Naturel',
    ratio: 0.15,
    challengeRange: [14, 22],      // attempts many challenges
    attemptRange: [1, 2],          // solves quickly
    finalSuccessRate: 0.92,        // almost always succeeds
    firstTryRate: 0.70,            // often on first try
    hintRate: 0.05,                // rarely needs hints
    timeRange: [30, 300],          // fast (seconds)
    readCourseRate: 0.20,          // rarely reads courses
    readDuration: [5, 60],         // quick skim if any
    errorTypes: ['close_attempt'],
    xpRange: [800, 2000],
    levelRange: [5, 10],
    streakRange: [10, 30],
  },
  methodical: {
    label: 'Étudiant Méthodique',
    ratio: 0.40,
    challengeRange: [10, 18],
    attemptRange: [2, 4],
    finalSuccessRate: 0.78,
    firstTryRate: 0.25,
    hintRate: 0.30,
    timeRange: [180, 900],
    readCourseRate: 0.85,
    readDuration: [300, 1200],
    errorTypes: ['logic_error', 'close_attempt'],
    xpRange: [300, 900],
    levelRange: [3, 6],
    streakRange: [3, 12],
  },
  perseverant: {
    label: 'Persévérant en Difficulté',
    ratio: 0.30,
    challengeRange: [8, 15],
    attemptRange: [4, 8],
    finalSuccessRate: 0.50,
    firstTryRate: 0.05,
    hintRate: 0.60,
    timeRange: [300, 1800],
    readCourseRate: 0.50,
    readDuration: [120, 600],
    errorTypes: ['syntax_error', 'logic_error', 'wrong_flag'],
    xpRange: [50, 400],
    levelRange: [1, 3],
    streakRange: [0, 5],
  },
  dropout: {
    label: 'Décrocheur',
    ratio: 0.15,
    challengeRange: [3, 8],
    attemptRange: [1, 3],
    finalSuccessRate: 0.08,
    firstTryRate: 0.03,
    hintRate: 0.02,
    timeRange: [5, 60],
    readCourseRate: 0.05,
    readDuration: [0, 15],
    errorTypes: ['random_guess', 'syntax_error'],
    xpRange: [0, 50],
    levelRange: [1, 1],
    streakRange: [0, 0],
  },
};

// ═══════════════════════════════════════════════════════════════════
// SECTION 4 — Data Generation Functions
// ═══════════════════════════════════════════════════════════════════

function generateUsers() {
  const users = [];
  const learners = [];
  const instructors = [];
  const pw = hashPassword('CyberPass123!');

  // 2 admins
  users.push({ user_id: 'usr_00001', username: 'admin_sarah',   email: 'sarah@cyberdash.com',    password_hash: pw, role: 'admin',      is_active: true, created_at: dateAt(0) });
  users.push({ user_id: 'usr_00002', username: 'admin_michael', email: 'michael@cyberdash.com',  password_hash: pw, role: 'admin',      is_active: true, created_at: dateAt(1) });

  // 5 instructors
  const instNames = ['alex','emily','omar','fatima','karim'];
  for (let i = 0; i < 5; i++) {
    const id = `usr_${String(i + 3).padStart(5, '0')}`;
    users.push({ user_id: id, username: `instructor_${instNames[i]}`, email: `${instNames[i]}@cyberdash.com`, password_hash: pw, role: 'instructor', is_active: true, created_at: dateAt(2 + i) });
    instructors.push({ user_id: id });
  }

  // 200 learners — assign archetype based on ratio
  const archetypeKeys = Object.keys(ARCHETYPES);
  const archetypeAssignments = []; // to track which learner has which archetype
  let learnerIndex = 0;

  for (const key of archetypeKeys) {
    const arch = ARCHETYPES[key];
    const count = Math.round(200 * arch.ratio);
    for (let i = 0; i < count; i++) {
      const id = `usr_${String(8 + learnerIndex).padStart(5, '0')}`;
      users.push({
        user_id: id,
        username: `learner_${String(learnerIndex + 1).padStart(3, '0')}`,
        email: `learner${learnerIndex + 1}@cyberdash.com`,
        password_hash: pw,
        role: 'learner',
        is_active: key !== 'dropout' || rng.bool(0.7), // some dropouts deactivate
        created_at: dateAt(rng.int(10, 50)),
      });
      learners.push({
        user_id: id,
        xp_points: rng.int(arch.xpRange[0], arch.xpRange[1]),
        current_level: rng.int(arch.levelRange[0], arch.levelRange[1]),
        streak: rng.int(arch.streakRange[0], arch.streakRange[1]),
      });
      archetypeAssignments.push({ user_id: id, archetype: key });
      learnerIndex++;
    }
  }

  return { users, learners, instructors, archetypeAssignments };
}

function generateBehavioralData(archetypeAssignments) {
  const sessions = [];
  const submissions = [];
  const attemptMetrics = [];
  const activityLogs = [];
  const xpHistory = [];
  const aiFeedbacks = [];

  // Track which challenges each learner solved (for skill_profile later)
  const learnerChallengeResults = {}; // { learner_id: { challenge_id: { solved, hintUsed } } }

  for (const { user_id, archetype } of archetypeAssignments) {
    const arch = ARCHETYPES[archetype];
    learnerChallengeResults[user_id] = {};

    // How many challenges this learner will attempt
    const numChallenges = rng.int(arch.challengeRange[0], arch.challengeRange[1]);
    const selectedChallenges = rng.sample(CHALLENGES, numChallenges);

    let dayOffset = rng.int(55, 70); // start date offset (days from BASE_DATE)

    for (const challenge of selectedChallenges) {
      const sessionId = uid('ses');
      const numAttempts = rng.int(arch.attemptRange[0], arch.attemptRange[1]);
      const willSucceed = rng.bool(arch.finalSuccessRate);
      const diffMultiplier = challenge.difficulty === 'advanced' ? 0.7 :
                             challenge.difficulty === 'intermediate' ? 0.85 : 1.0;
      const adjustedSuccess = willSucceed && rng.bool(diffMultiplier);

      // ── Activity Log: Maybe read the course first ──
      if (rng.bool(arch.readCourseRate)) {
        const catCourses = CAT_TO_COURSES[challenge.category_id] || [];
        if (catCourses.length > 0) {
          activityLogs.push({
            log_id: uid('log'),
            user_id,
            action_type: 'read_course',
            target_type: 'course',
            target_id: rng.pick(catCourses),
            duration_seconds: rng.int(arch.readDuration[0], arch.readDuration[1]),
            created_at: dateAt(dayOffset, rng.int(8, 12)),
          });
        }
      }

      // ── Activity Log: Start challenge ──
      const startHour = rng.int(9, 20);
      activityLogs.push({
        log_id: uid('log'),
        user_id,
        action_type: 'start_challenge',
        target_type: 'challenge',
        target_id: challenge.challenge_id,
        duration_seconds: 0,
        created_at: dateAt(dayOffset, startHour),
      });

      let sessionHintUsed = false;
      let sessionEndedAt = null;
      const sessionSubmissions = [];

      for (let attempt = 1; attempt <= numAttempts; attempt++) {
        const isLastAttempt = attempt === numAttempts;
        const isCorrect = isLastAttempt && adjustedSuccess;
        const hintUsed = !isCorrect && rng.bool(arch.hintRate);
        if (hintUsed) sessionHintUsed = true;

        // Determine the answer text
        let answer;
        if (isCorrect) {
          answer = challenge.flag;
        } else {
          answer = rng.pick([
            'incorrect_attempt', `attempt_${attempt}`,
            "' OR '1'='1", '<script>alert(1)</script>',
            'FLAG{wrong_guess}', 'test123', 'admin',
          ]);
        }

        const submissionId = uid('sub');
        const timeSpent = rng.int(arch.timeRange[0], arch.timeRange[1]);
        const submittedAt = dateAt(dayOffset, startHour + attempt * 0.5);

        submissions.push({
          submission_id: submissionId,
          session_id: sessionId,
          answer,
          is_correct: isCorrect,
          submitted_at: submittedAt,
        });

        // ── Attempt Metrics ──
        let errorType = null;
        if (!isCorrect) {
          errorType = rng.pick(arch.errorTypes);
        }

        attemptMetrics.push({
          metric_id: uid('met'),
          submission_id: submissionId,
          attempt_number: attempt,
          time_spent_seconds: timeSpent,
          error_type: errorType,
          hint_used: hintUsed,
        });

        // ── AI Feedback for incorrect submissions ──
        if (!isCorrect && errorType) {
          const templates = AI_FEEDBACK_TEMPLATES[errorType] || AI_FEEDBACK_TEMPLATES['wrong_flag'];
          aiFeedbacks.push({
            feedback_id: uid('afb'),
            submission_id: submissionId,
            content: rng.pick(templates),
            generated_at: submittedAt,
          });
        }

        // ── Activity Log: View hint ──
        if (hintUsed) {
          activityLogs.push({
            log_id: uid('log'),
            user_id,
            action_type: 'view_hint',
            target_type: 'challenge',
            target_id: challenge.challenge_id,
            duration_seconds: rng.int(10, 120),
            created_at: submittedAt,
          });
        }

        if (isCorrect) {
          sessionEndedAt = submittedAt;
          // XP History for successful completion
          xpHistory.push({
            id: uid('xph'),
            user_id,
            challenge_id: challenge.challenge_id,
            xp: challenge.points,
            created_at: submittedAt,
          });
        }
      }

      // If not solved and it's a dropout/perseverant, they may abandon
      if (!adjustedSuccess && rng.bool(archetype === 'dropout' ? 0.8 : 0.3)) {
        activityLogs.push({
          log_id: uid('log'),
          user_id,
          action_type: 'abandon_challenge',
          target_type: 'challenge',
          target_id: challenge.challenge_id,
          duration_seconds: 0,
          created_at: dateAt(dayOffset, startHour + numAttempts + 1),
        });
      }

      sessions.push({
        session_id: sessionId,
        learner_id: user_id,
        challenge_id: challenge.challenge_id,
        started_at: dateAt(dayOffset, startHour),
        ended_at: sessionEndedAt,
        attempt_count: numAttempts,
      });

      learnerChallengeResults[user_id][challenge.challenge_id] = {
        solved: adjustedSuccess,
        hintUsed: sessionHintUsed,
      };

      dayOffset += rng.int(0, 3); // some days between challenges
    }
  }

  return { sessions, submissions, attemptMetrics, activityLogs, xpHistory, aiFeedbacks, learnerChallengeResults };
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 5 — Skill Profile Computation
// ═══════════════════════════════════════════════════════════════════

function computeSkillProfiles(archetypeAssignments, learnerChallengeResults) {
  const profiles = [];

  // Pre-compute: for each skill, which challenges use it and at what weight
  const skillChallenges = {}; // { skill_id: [ { challenge_id, weight } ] }
  for (const cs of CHALLENGE_SKILLS) {
    if (!skillChallenges[cs.skill_id]) skillChallenges[cs.skill_id] = [];
    skillChallenges[cs.skill_id].push({ challenge_id: cs.challenge_id, weight: cs.weight });
  }

  for (const { user_id } of archetypeAssignments) {
    const results = learnerChallengeResults[user_id] || {};

    for (const skill of SKILLS) {
      const relatedChallenges = skillChallenges[skill.skill_id] || [];
      let score = 0;
      let totalWeight = 0;
      let observations = 0;

      for (const { challenge_id, weight } of relatedChallenges) {
        const result = results[challenge_id];
        if (!result) continue; // learner never attempted this challenge

        observations++;
        if (result.solved && !result.hintUsed) {
          score += weight * 1.0;   // Full mastery
        } else if (result.solved && result.hintUsed) {
          score += weight * 0.6;   // Partial mastery (hint penalty)
        } else {
          score += weight * 0.0;   // Not mastered
        }
        totalWeight += weight;
      }

      const finalScore = totalWeight > 0 ? Math.min(1.0, score / totalWeight) : 0.0;
      const confidence = Math.min(1.0, observations / 5); // plateaus at 5 observations

      profiles.push({
        learner_id: user_id,
        skill_id: skill.skill_id,
        score: +finalScore.toFixed(4),
        confidence: +confidence.toFixed(4),
        updated_at: dateAt(rng.int(75, 90)),
      });
    }
  }

  return profiles;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 5b — Enrollment, Badge Awards & Recommendation History
// ═══════════════════════════════════════════════════════════════════

function generateEnrollments(archetypeAssignments, learnerChallengeResults) {
  const enrollments = [];
  const seen = new Set();

  for (const { user_id } of archetypeAssignments) {
    const results = learnerChallengeResults[user_id] || {};
    // Enroll the learner in courses related to challenges they attempted
    for (const challengeId of Object.keys(results)) {
      const challenge = CHALLENGES.find(c => c.challenge_id === challengeId);
      if (!challenge) continue;
      const courseIds = CAT_TO_COURSE_IDS[challenge.category_id] || [];
      for (const courseId of courseIds) {
        const key = `${user_id}_${courseId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const solved = results[challengeId]?.solved;
        enrollments.push({
          learner_id: user_id,
          course_id: courseId,
          enrolled_at: dateAt(rng.int(50, 65)),
          completion_status: solved ? rng.pick(['completed', 'in_progress']) : 'in_progress',
        });
      }
    }
  }
  return enrollments;
}

function generateLearnerBadges(archetypeAssignments, learnerChallengeResults, learners) {
  const badges = [];
  const seen = new Set();

  for (const { user_id, archetype } of archetypeAssignments) {
    const results = learnerChallengeResults[user_id] || {};
    const solvedCount = Object.values(results).filter(r => r.solved).length;
    const learner = learners.find(l => l.user_id === user_id);
    if (!learner) continue;

    // Badge: First Blood (solved >= 1)
    if (solvedCount >= 1) {
      badges.push({ learner_id: user_id, badge_id: 'bdg_001', awarded_at: dateAt(rng.int(65, 80)) });
    }
    // Badge: Challenge Master (solved >= 10)
    if (solvedCount >= 10) {
      badges.push({ learner_id: user_id, badge_id: 'bdg_002', awarded_at: dateAt(rng.int(75, 85)) });
    }
    // Badge: XP Accumulator (xp >= 500)
    if (learner.xp_points >= 500) {
      badges.push({ learner_id: user_id, badge_id: 'bdg_003', awarded_at: dateAt(rng.int(70, 85)) });
    }
    // Badge: On Fire (streak >= 7)
    if (learner.streak >= 7) {
      badges.push({ learner_id: user_id, badge_id: 'bdg_004', awarded_at: dateAt(rng.int(70, 85)) });
    }
  }
  return badges;
}

function generateRecommendationHistory(archetypeAssignments, learnerChallengeResults) {
  const recommendations = [];

  for (const { user_id, archetype } of archetypeAssignments) {
    const results = learnerChallengeResults[user_id] || {};
    // Generate 2-5 recommendations per learner
    const numRecs = rng.int(2, 5);
    const unsolvedChallenges = CHALLENGES.filter(c => !results[c.challenge_id]?.solved);
    const recChallenges = rng.sample(unsolvedChallenges, numRecs);

    for (const ch of recChallenges) {
      const proba = rng.float(0.3, 0.95);
      const clicked = rng.bool(archetype === 'dropout' ? 0.15 : 0.60);
      let result = 'pending';
      if (clicked && results[ch.challenge_id]) {
        result = results[ch.challenge_id].solved ? 'success' : 'fail';
      } else if (clicked) {
        result = rng.bool(0.4) ? 'success' : 'fail';
      }

      recommendations.push({
        recommendation_id: uid('rec'),
        learner_id: user_id,
        challenge_id: ch.challenge_id,
        predicted_difficulty: proba,
        clicked,
        result: clicked ? result : 'pending',
        created_at: dateAt(rng.int(60, 85)),
      });
    }
  }
  return recommendations;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 6 — Main Execution
// ═══════════════════════════════════════════════════════════════════

async function run() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   CyberDash ML Seed — Populating Database   ║');
  console.log('╚══════════════════════════════════════════════╝');

  // ── Step 1: Clean all tables (children first, respecting FK order) ──
  console.log('\n🗑️  Cleaning all tables...');
  const tables = [
    'chat_message', 'chat_session',
    'recommendation_history', 'skill_profile',
    'learner_activity_log', 'challenge_attempt_metrics',
    'ai_feedback', 'xp_history', 'learner_badge',
    'submission', 'challenge_session',
    'challenge_skill', 'challenge_file',
    'incident_report', 'enrollment', 'course_content',
    'badge', 'challenge', 'course', 'skill',
    'learner', 'instructor', 'category', 'user',
  ];
  for (const t of tables) {
    try { await db(t).del(); } catch (e) { /* table may not exist yet */ }
  }

  // ── Step 2: Insert reference data (no FK dependencies) ──
  console.log('📦 Inserting categories...');
  await db('category').insert(CATEGORIES);

  console.log('📦 Inserting skills...');
  await db('skill').insert(SKILLS);

  // ── Step 3: Generate and insert users (before courses/challenges which reference instructor) ──
  console.log('👥 Generating 207 users (2 admins, 5 instructors, 200 learners)...');
  const { users, learners, instructors, archetypeAssignments } = generateUsers();
  await batchInsert('user', users);
  await db('instructor').insert(instructors);
  await batchInsert('learner', learners);

  // ── Step 4: Insert courses, badges (FK → instructor/admin now exist) ──
  console.log('📦 Inserting courses...');
  await db('course').insert(COURSES);

  console.log('📦 Inserting course contents...');
  await db('course_content').insert(COURSE_CONTENTS);

  console.log('📦 Inserting badges...');
  await db('badge').insert(BADGES);

  // ── Step 5: Insert challenges, files, and skill links ──
  console.log('🎯 Inserting 30 challenges + files...');
  await batchInsert('challenge', CHALLENGES);
  await db('challenge_file').insert(CHALLENGE_FILES);
  await batchInsert('challenge_skill', CHALLENGE_SKILLS);

  // ── Step 5: Generate behavioral data ──
  console.log('🧪 Generating behavioral data for 200 learners...');
  console.log('   (sessions, submissions, attempt metrics, activity logs, ai feedback)');
  const {
    sessions, submissions, attemptMetrics,
    activityLogs, xpHistory, aiFeedbacks, learnerChallengeResults
  } = generateBehavioralData(archetypeAssignments);

  console.log(`   → ${sessions.length} challenge sessions`);
  console.log(`   → ${submissions.length} submissions`);
  console.log(`   → ${attemptMetrics.length} attempt metrics`);
  console.log(`   → ${activityLogs.length} activity logs`);
  console.log(`   → ${aiFeedbacks.length} AI feedbacks`);

  console.log('💾 Saving sessions...');
  await batchInsert('challenge_session', sessions);
  console.log('💾 Saving submissions...');
  await batchInsert('submission', submissions);
  console.log('💾 Saving attempt metrics...');
  await batchInsert('challenge_attempt_metrics', attemptMetrics);
  console.log('💾 Saving activity logs...');
  await batchInsert('learner_activity_log', activityLogs);
  console.log('💾 Saving XP history...');
  await batchInsert('xp_history', xpHistory);
  console.log('💾 Saving AI feedbacks...');
  await batchInsert('ai_feedback', aiFeedbacks);

  // ── Step 6: Compute and insert skill profiles ──
  console.log('🧠 Computing skill profiles (200 learners × 15 skills)...');
  const skillProfiles = computeSkillProfiles(archetypeAssignments, learnerChallengeResults);
  console.log(`   → ${skillProfiles.length} skill profile entries`);
  await batchInsert('skill_profile', skillProfiles);

  // ── Step 7: Generate enrollments (learners enrolled in courses they studied) ──
  console.log('📝 Generating enrollments...');
  const enrollments = generateEnrollments(archetypeAssignments, learnerChallengeResults);
  console.log(`   → ${enrollments.length} enrollments`);
  await batchInsert('enrollment', enrollments);

  // ── Step 8: Award badges based on actual performance ──
  console.log('🏆 Awarding badges...');
  const learnerBadges = generateLearnerBadges(archetypeAssignments, learnerChallengeResults, learners);
  console.log(`   → ${learnerBadges.length} badge awards`);
  await batchInsert('learner_badge', learnerBadges);

  // ── Step 9: Generate recommendation history (ML feedback loop) ──
  console.log('🔄 Generating recommendation history...');
  const recommendations = generateRecommendationHistory(archetypeAssignments, learnerChallengeResults);
  console.log(`   → ${recommendations.length} recommendations`);
  await batchInsert('recommendation_history', recommendations);

  // ── Final Summary ──
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║           ✅ Seed Complete — Summary              ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Users:                ${String(users.length).padStart(6)}                  ║`);
  console.log(`║  Learners:             ${String(learners.length).padStart(6)}                  ║`);
  console.log(`║  Courses + Contents:   ${String(COURSES.length).padStart(6)} + ${String(COURSE_CONTENTS.length).padStart(2)}              ║`);
  console.log(`║  Challenges + Files:   ${String(CHALLENGES.length).padStart(6)} + ${String(CHALLENGE_FILES.length).padStart(2)}              ║`);
  console.log(`║  Skills:               ${String(SKILLS.length).padStart(6)}                  ║`);
  console.log(`║  Challenge Skills:     ${String(CHALLENGE_SKILLS.length).padStart(6)}                  ║`);
  console.log(`║  Enrollments:          ${String(enrollments.length).padStart(6)}                  ║`);
  console.log(`║  Sessions:             ${String(sessions.length).padStart(6)}                  ║`);
  console.log(`║  Submissions:          ${String(submissions.length).padStart(6)}                  ║`);
  console.log(`║  Attempt Metrics:      ${String(attemptMetrics.length).padStart(6)}                  ║`);
  console.log(`║  AI Feedbacks:         ${String(aiFeedbacks.length).padStart(6)}                  ║`);
  console.log(`║  Activity Logs:        ${String(activityLogs.length).padStart(6)}                  ║`);
  console.log(`║  Skill Profiles:       ${String(skillProfiles.length).padStart(6)}                  ║`);
  console.log(`║  Learner Badges:       ${String(learnerBadges.length).padStart(6)}                  ║`);
  console.log(`║  Recommendations:      ${String(recommendations.length).padStart(6)}                  ║`);
  console.log(`║  XP History:           ${String(xpHistory.length).padStart(6)}                  ║`);
  console.log('╚══════════════════════════════════════════════════╝');

  // Archetype distribution
  const counts = {};
  for (const a of archetypeAssignments) {
    counts[a.archetype] = (counts[a.archetype] || 0) + 1;
  }
  console.log('\n📊 Archetype Distribution:');
  for (const [key, count] of Object.entries(counts)) {
    console.log(`   ${ARCHETYPES[key].label}: ${count} learners (${(count/200*100).toFixed(0)}%)`);
  }
}

run()
  .then(() => {
    console.log('\n🎉 Database ready for ML training!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  });
