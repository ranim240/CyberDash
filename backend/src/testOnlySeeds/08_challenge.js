export const seed = async function(knex) {
  await knex('challenge').insert([
    { challenge_id: 'chal_web_xss1', title: 'Reflected XSS', description: 'Inject an alert', difficulty: 'easy', points: 100, status: 'active', flag: 'FLAG{XSS_1S_FUN}', category_id: 'cat_web', instructor_id: 'instructor_1' },
    { challenge_id: 'chal_crypto_base64', title: 'Base64 Decode', description: 'Decode this: dGVzdF9mbGFn', difficulty: 'easy', points: 50, status: 'active', flag: 'FLAG{BASE64_EASY}', category_id: 'cat_crypto', instructor_id: 'instructor_2' },
    { challenge_id: 'chal_forensics_logs', title: 'Log Analysis', description: 'Find the attacker IP', difficulty: 'medium', points: 200, status: 'active', flag: 'FLAG{192.168.1.100}', category_id: 'cat_forensics', instructor_id: 'instructor_3' },
    { challenge_id: 'chal_rev_crackme', title: 'Crackme', description: 'Reverse this binary', difficulty: 'hard', points: 350, status: 'active', flag: 'FLAG{RE_MASTER}', category_id: 'cat_reverse', instructor_id: 'instructor_4' },
    { challenge_id: 'chal_pwn_buffer', title: 'Buffer Overflow', description: 'Get a shell', difficulty: 'hard', points: 400, status: 'draft', flag: 'FLAG{PWN_ME}', category_id: 'cat_pwn', instructor_id: 'instructor_5' }
  ]).onConflict('challenge_id').ignore();
};