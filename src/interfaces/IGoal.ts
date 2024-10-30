export default interface IGoal {
  title: string
  desiredWeeklyFrequency: number
}

export type GoalsPerDay = Record<
  string,
  {
    id: string
    title: string
    completedAtDate: string
  }[]
>
