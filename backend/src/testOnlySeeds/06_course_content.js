export const seed = async function(knex) {
  await knex('course_content').insert([
    { content_id: 'cont_web1_1', course_id: 'course_web1', title: 'What is XSS?', data: 'markdown content...', is_published: true },
    { content_id: 'cont_web1_2', course_id: 'course_web1', title: 'SQL Injection basics', data: 'markdown...', is_published: true },
    { content_id: 'cont_crypto1_1', course_id: 'course_crypto1', title: 'Base64 vs XOR', data: 'markdown...', is_published: true },
    { content_id: 'cont_crypto1_2', course_id: 'course_crypto1', title: 'Cracking Vigenère', data: 'markdown...', is_published: true },
    { content_id: 'cont_pwn1_1', course_id: 'course_pwn1', title: 'Stack layout', data: 'markdown...', is_published: true },
    { content_id: 'cont_rev1_1', course_id: 'course_rev1', title: 'Ghidra intro', data: 'markdown...', is_published: true }
  ]).onConflict('content_id').ignore();
};