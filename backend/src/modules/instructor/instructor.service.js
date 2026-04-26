import { getEngagedLearnersCountQuery } from './instructor.queries.js';

export const getEngagedLearnersCount = async (knex, instructorId) => {
  const result = await getEngagedLearnersCountQuery(knex, instructorId);
  return result[0].total;
};