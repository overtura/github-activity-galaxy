type ActivityBucket = {
  label: string
  count: number
  color: string
  radius: number
}

type ActivityPoint = {
  key: string
  color: string
  position: [number, number, number]
}

export const ACTIVITY_BUCKETS = [
  { label: 'PR', count: 18, color: '#007da5', radius: 1.2 },
  { label: 'Issue', count: 31, color: '#4f8f32', radius: 1.8 },
  { label: 'Commit', count: 74, color: '#c4457c', radius: 2.45 },
  { label: 'Review', count: 12, color: '#b77900', radius: 3.0 },
] as const satisfies readonly ActivityBucket[]

const createActivityPoints = (buckets: readonly ActivityBucket[]): ActivityPoint[] =>
  buckets.flatMap((bucket, bucketIndex) =>
    Array.from({ length: bucket.count }, (_, index) => {
      const angle = (index / bucket.count) * Math.PI * 2 + bucketIndex * 0.7
      const spiral = bucket.radius + index * 0.006

      return {
        key: `${bucket.label}-${index}`,
        color: bucket.color,
        position: [
          Math.cos(angle) * spiral,
          Math.sin(index * 1.7) * 0.22 + bucketIndex * 0.08,
          Math.sin(angle) * spiral,
        ],
      }
    }),
  )

const sumActivityCount = (buckets: readonly ActivityBucket[]) => buckets.reduce((sum, item) => sum + item.count, 0)

export const ACTIVITY_POINTS = createActivityPoints(ACTIVITY_BUCKETS)
export const TOTAL_ACTIVITY_COUNT = sumActivityCount(ACTIVITY_BUCKETS)
