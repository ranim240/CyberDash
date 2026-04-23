export const seed = async function(knex) {
  await knex('category').insert([
    { category_id: 'cat_web', name: 'Web Security', description: 'XSS, CSRF, SQLi', icon_url: '/icons/web.png' },
    { category_id: 'cat_crypto', name: 'Cryptography', description: 'Encoding, hashing, encryption', icon_url: '/icons/crypto.png' },
    { category_id: 'cat_forensics', name: 'Digital Forensics', description: 'Log analysis, memory dumps', icon_url: '/icons/forensics.png' },
    { category_id: 'cat_reverse', name: 'Reverse Engineering', description: 'Binary analysis', icon_url: '/icons/reverse.png' },
    { category_id: 'cat_pwn', name: 'Binary Exploitation', description: 'Buffer overflows, ROP', icon_url: '/icons/pwn.png' }
  ]).onConflict('category_id').ignore();
};