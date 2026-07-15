export type ActivityKind = 'pull-request' | 'issue' | 'commit' | 'review'

export type ActivityBucket = {
  kind: ActivityKind
  label: string
  shortLabel: string
  count: number
  color: string
  radius: number
  description: string
}

export type PeriodMode = 'week' | 'month'

export type PeriodOption = {
  mode: PeriodMode
  buttonLabel: string
  metricLabel: string
  insight: string
  buckets: readonly ActivityBucket[]
}

export const PERIOD_OPTIONS = [
  {
    mode: 'week',
    buttonLabel: '이번 주',
    metricLabel: '주간',
    insight: '커밋 밀도가 높고, 이슈 대응 궤도가 두 번째로 활발합니다.',
    buckets: [
      {
        kind: 'pull-request',
        label: 'Pull request',
        shortLabel: 'PR',
        count: 18,
        color: '#007da5',
        radius: 1.2,
        description: '변경 제안과 병합 준비 흐름',
      },
      {
        kind: 'issue',
        label: '이슈',
        shortLabel: '이슈',
        count: 31,
        color: '#4f8f32',
        radius: 1.8,
        description: '논의 중인 문제와 개선 요청',
      },
      {
        kind: 'commit',
        label: '커밋',
        shortLabel: '커밋',
        count: 74,
        color: '#c4457c',
        radius: 2.45,
        description: '저장소에 반영된 코드 변화',
      },
      {
        kind: 'review',
        label: '리뷰',
        shortLabel: '리뷰',
        count: 12,
        color: '#b77900',
        radius: 3,
        description: '변경을 검토하고 판단한 기록',
      },
    ],
  },
  {
    mode: 'month',
    buttonLabel: '이번 달',
    metricLabel: '월간',
    insight: '이슈와 커밋 궤도가 넓게 쌓여 장기 흐름 비교에 적합합니다.',
    buckets: [
      {
        kind: 'pull-request',
        label: 'Pull request',
        shortLabel: 'PR',
        count: 52,
        color: '#007da5',
        radius: 1.2,
        description: '변경 제안과 병합 준비 흐름',
      },
      {
        kind: 'issue',
        label: '이슈',
        shortLabel: '이슈',
        count: 86,
        color: '#4f8f32',
        radius: 1.8,
        description: '논의 중인 문제와 개선 요청',
      },
      {
        kind: 'commit',
        label: '커밋',
        shortLabel: '커밋',
        count: 164,
        color: '#c4457c',
        radius: 2.45,
        description: '저장소에 반영된 코드 변화',
      },
      {
        kind: 'review',
        label: '리뷰',
        shortLabel: '리뷰',
        count: 41,
        color: '#b77900',
        radius: 3,
        description: '변경을 검토하고 판단한 기록',
      },
    ],
  },
] as const satisfies readonly PeriodOption[]

export const getPeriodOption = (mode: PeriodMode) =>
  PERIOD_OPTIONS.find((option) => option.mode === mode) ?? PERIOD_OPTIONS[0]

export const sumActivityCount = (buckets: readonly ActivityBucket[]) =>
  buckets.reduce((sum, bucket) => sum + bucket.count, 0)

export const getTopBucket = (buckets: readonly ActivityBucket[]) =>
  buckets.reduce((topBucket, bucket) => (bucket.count > topBucket.count ? bucket : topBucket), buckets[0])

export const getActivityShare = (bucket: ActivityBucket, total: number) =>
  total === 0 ? 0 : Math.round((bucket.count / total) * 100)
