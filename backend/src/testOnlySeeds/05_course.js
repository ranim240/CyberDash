export const seed = async function(knex) {
  await knex('course').insert([
    { course_id: 'course_web1', title: 'Web Hacking 101', description: 'Intro to web vulnerabilities', estimated_duration: 8, level: 'beginner', is_published: true, instructor_id: 'instructor_1' },
    { course_id: 'course_crypto1', title: 'Crypto for Hackers', description: 'Cracking weak ciphers', estimated_duration: 6, level: 'intermediate', is_published: true, instructor_id: 'instructor_2' },
    { course_id: 'course_forensics1', title: 'Memory Forensics', description: 'Analyzing RAM dumps', estimated_duration: 10, level: 'advanced', is_published: false, instructor_id: 'instructor_3' },
    { course_id: 'course_rev1', title: 'Reverse Engineering with Ghidra', description: 'Static analysis', estimated_duration: 12, level: 'advanced', is_published: true, instructor_id: 'instructor_4' },
    { course_id: 'course_pwn1', title: 'Binary Exploitation', description: 'From stack overflows to ROP', estimated_duration: 14, level: 'expert', is_published: true, instructor_id: 'instructor_5' }
  ]).onConflict('course_id').ignore();
};