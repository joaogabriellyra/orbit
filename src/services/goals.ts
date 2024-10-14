import { db } from '../db'
import { goals } from '../db/schema'
import type IGoal from '../interfaces/IGoal'

export default class GoalsService {
  public async create(goal: IGoal) {
    await db.insert(goals).values(goal)
  }
}
