import dayjs from 'dayjs'
import { client, db } from '.'
import { goals, goalsCompleted } from './schema'

async function seed() {
  await db.delete(goalsCompleted)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'gym', desiredWeeklyFrequency: 6 },
      { title: 'wake up early', desiredWeeklyFrequency: 6 },
      { title: 'meditate', desiredWeeklyFrequency: 3 },
    ])
    .returning()

  const firstDayOfTheWeek = dayjs().startOf('week')

  await db.insert(goalsCompleted).values([
    { goalId: result[0].id, createdAt: firstDayOfTheWeek.toDate() },
    {
      goalId: result[1].id,
      createdAt: firstDayOfTheWeek.add(1, 'day').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})
