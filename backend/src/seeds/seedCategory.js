export const seed = async (knex) => {
  await knex('category').del();

  await knex('category').insert([
    {
      category_id: 'cat_1',
      name: 'Web Security',
      description: 'Web vulnerabilities',
      icon_url: 'https://example.com/web.png',
    },
    {
      category_id: 'cat_2',
      name: 'Network Security',
      description: 'Network attacks and defenses',
      icon_url: 'https://example.com/network.png',
    },
  ]);
};