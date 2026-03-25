export interface StatMetricsInterface {
  totalCreatedTasks: number;
  totalCompletedTasks: number;
  percentCompletedTasks: number;
  averageCompleteTasks: {
    ms: number;
  }

  period: {
    from?: string;
    to?: string;
  }

}