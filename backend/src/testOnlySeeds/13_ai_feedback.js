export const seed = async function(knex) {
  await knex('ai_feedback').insert([
    { feedback_id: 'fb_1', submission_id: 'sub_1', content: 'Your payload lacked script tags. Try <script>alert(1)</script>' },
    { feedback_id: 'fb_2', submission_id: 'sub_2', content: 'Perfect! You triggered an alert.' },
    { feedback_id: 'fb_3', submission_id: 'sub_3', content: 'Correct flag. Great job!' },
    { feedback_id: 'fb_4', submission_id: 'sub_4', content: 'Wrong flag. Hint: the flag starts with FLAG{' },
    { feedback_id: 'fb_5', submission_id: 'sub_5', content: 'Excellent! You reversed the binary.' }
  ]).onConflict('feedback_id').ignore();
};