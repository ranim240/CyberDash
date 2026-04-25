export const seed = async function(knex) {
  await knex('challenge_file').insert([
    { file_id: 'file_rev1', challenge_id: 'chal_rev_crackme', file_name: 'crackme.bin', file_path: '/uploads/chal_rev_crackme/crackme.bin', file_size: 24576 },
    { file_id: 'file_pwn1', challenge_id: 'chal_pwn_buffer', file_name: 'vuln', file_path: '/uploads/chal_pwn_buffer/vuln', file_size: 16384 },
    { file_id: 'file_forensics1', challenge_id: 'chal_forensics_logs', file_name: 'access.log', file_path: '/uploads/chal_forensics_logs/access.log', file_size: 102400 }
  ]).onConflict('file_id').ignore();
};