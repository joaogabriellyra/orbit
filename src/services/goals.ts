import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalsCompleted } from '../db/schema'
import type IGoal from '../interfaces/IGoal'
import dayjs from 'dayjs'

export default class GoalsService {
  public async create(goal: IGoal) {
    await db.insert(goals).values(goal)
  }

  public async getgoalsCompleted() {
    return await db.select().from(goalsCompleted)
  }

  public async getWeekPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
      db
        .select({
          id: goals.id,
          title: goals.title,
          desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
          createdAt: goals.createdAt,
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayOfWeek))
    )

    const goalsCompletionCount = db.$with('goal_completion_count').as(
      db
        .select({
          goalId: goalsCompleted.goalId,
          completionCount: count(goalsCompleted.id)
            .mapWith(Number)
            .as('completionCount'),
        })
        .from(goalsCompleted)
        .where(
          and(
            gte(goalsCompleted.createdAt, firstDayOfWeek),
            lte(goalsCompleted.createdAt, lastDayOfWeek)
          )
        )
        .groupBy(goalsCompleted.goalId)
    )

    return await db
      .with(goalsCreatedUpToWeek, goalsCompletionCount)
      .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql /*sql*/`
          COALESCE(${goalsCompletionCount.completionCount}, 0)
        `.mapWith(Number),
      })
      .from(goalsCreatedUpToWeek)
      .leftJoin(
        goalsCompletionCount,
        eq(goalsCompletionCount.goalId, goalsCreatedUpToWeek.id)
      )
  }

  public async completeAGoal(goalId: string) {
    await db.insert(goalsCompleted).values({
      goalId,
    })
  }

  public async findTheGoalById(id: string) {
    return await db
      .select({
        id: goals.id,
        desireedWeeklyFrequency: goals.desiredWeeklyFrequency,
      })
      .from(goals)
      .where(eq(goals.id, id))
  }
}
