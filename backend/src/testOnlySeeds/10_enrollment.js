export const seed = async (knex) => {
  const enrollments = [
    { learner_id: 'learner_1', course_id: 'course_web1', completion_status: 'completed' },
    { learner_id: 'learner_1', course_id: 'course_crypto1', completion_status: 'in_progress' },
    { learner_id: 'learner_2', course_id: 'course_web1', completion_status: 'in_progress' },
    { learner_id: 'learner_3', course_id: 'course_pwn1', completion_status: 'in_progress' },
    { learner_id: 'learner_4', course_id: 'course_rev1', completion_status: 'in_progress' },
    { learner_id: 'learner_5', course_id: 'course_forensics1', completion_status: 'in_progress' }
  ];

  for (const enrollment of enrollments) {
    await knex.raw(`
      INSERT INTO enrollment (learner_id, course_id, enrolled_at, completion_status)
      VALUES (?, ?, CURRENT_TIMESTAMP, ?)
      ON CONFLICT ON CONSTRAINT enrollment_pkey DO NOTHING
    `, [
      enrollment.learner_id,
      enrollment.course_id,
      enrollment.completion_status
    ]);
  }
};