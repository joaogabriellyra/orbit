import { db } from '../db'
import { goalsCompleted } from '../db/schema'

export default class GoalsCompletedService {
  public async getCompletedGoals() {
    return await db.select().from(goalsCompleted)
  }
}
