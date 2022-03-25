export interface Worker {
  id: string
  name: string
  token?: string
  password: string
  created_at: number
  updated_at: number
  remaining_vacations: number
}

export type WorkerResult = Omit<Worker, 'password'>
export type WorkerPartialToken = {
  id: string
  token: string
}

export type WorkerPartialVacation = {
  id: string
  vacation_start_date: number
  vacation_end_date: number
}

export type ToWorkerResult = (worker: Worker) => WorkerResult
export const toWorkerResult: ToWorkerResult = worker => ({
  id: worker.id,
  name: worker.name,
  created_at: worker.created_at,
  updated_at: worker.updated_at,
  remaining_vacations: worker.remaining_vacations,
})
