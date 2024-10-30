import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalsCompleted } from '../db/schema'
import type IGoal from '../interfaces/IGoal'
import dayjs from 'dayjs'
import type { GoalsPerDay } from '../interfaces/IGoal'

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

  public async getSummary() {
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()

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

    const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
      db
        .select({
          id: goalsCompleted.id,
          title: goals.title,
          createdAt: goalsCompleted.createdAt,
          completedAt: sql /*sql*/`
            DATE(${goalsCompleted.createdAt})
          `.as('completedAt'),
        })
        .from(goalsCompleted)
        .innerJoin(goals, eq(goals.id, goalsCompleted.goalId))
        .where(
          and(
            gte(goalsCompleted.createdAt, firstDayOfWeek),
            lte(goalsCompleted.createdAt, lastDayOfWeek)
          )
        )
        .orderBy(desc(goalsCompleted.createdAt))
    )

    const goalsCompletedGroupedByDay = db
      .$with('goals_completed_grouped_by_day')
      .as(
        db
          .select({
            completedAtDate: goalsCompletedInWeek.completedAt,
            completions: sql /*sql*/`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', ${goalsCompletedInWeek.id},
                  'title', ${goalsCompletedInWeek.title},
                  'completedAt', ${goalsCompletedInWeek.createdAt}
                )
              )
          `.as('completions'),
          })
          .from(goalsCompletedInWeek)
          .groupBy(goalsCompletedInWeek.completedAt)
          .orderBy(desc(goalsCompletedInWeek.completedAt))
      )

    const [summary] = await db
      .with(
        goalsCreatedUpToWeek,
        goalsCompletedInWeek,
        goalsCompletedGroupedByDay
      )
      .select({
        completed: sql<number> /*sql*/`
          (SELECT COUNT(*) FROM ${goalsCompletedInWeek})::DECIMAL
        `.mapWith(Number),
        total: sql /*sql*/`
          (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})
        `.mapWith(Number),
        goalsPerDay: sql /*sql*/<GoalsPerDay>`
          JSON_OBJECT_AGG(
            ${goalsCompletedGroupedByDay.completedAtDate},
            ${goalsCompletedGroupedByDay.completions}
          )
        `,
      })
      .from(goalsCompletedGroupedByDay)

    return {
      summary,
    }
  }

  public async removeACompletedGoal(id: string): Promise<
    {
      deletedId: string
    }[]
  > {
    return await db
      .delete(goalsCompleted)
      .where(eq(goalsCompleted.id, id))
      .returning({ deletedId: goalsCompleted.id })
  }
}
