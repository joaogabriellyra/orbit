import { db } from '../db'
import { goals, goalsCompleted } from '../db/schema'
import type IGoal from '../interfaces/IGoal'

export default class GoalsService {
  public async create(goal: IGoal) {
    await db.insert(goals).values(goal)
  }

  public async getCompletedGoals() {
    return await db.select().from(goalsCompleted)
  }
}
