import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

type ActivityBucket = {
  label: string
  displayLabel: string
  count: number
  color: string
  radius: number
}

type ActivityPoint = {
  key: string
  color: string
  position: [number, number, number]
}

type PeriodOption = {
  mode: PeriodMode
  buttonLabel: string
  metricLabel: string
  insight: string
  buckets: readonly ActivityBucket[]
}

type PeriodMode = 'week' | 'month'

const PERIOD_OPTIONS = [
  {
    mode: 'week',
    buttonLabel: '이번 주',
    metricLabel: '주간',
    insight: '이번 주는 커밋 밀도가 높고, 이슈 대응 궤도가 두 번째로 활발합니다.',
    buckets: [
      { label: 'PR', displayLabel: 'PR', count: 18, color: '#007da5', radius: 1.2 },
      { label: 'Issue', displayLabel: '이슈', count: 31, color: '#4f8f32', radius: 1.8 },
      { label: 'Commit', displayLabel: '커밋', count: 74, color: '#c4457c', radius: 2.45 },
      { label: 'Review', displayLabel: '리뷰', count: 12, color: '#b77900', radius: 3.0 },
    ],
  },
  {
    mode: 'month',
    buttonLabel: '이번 달',
    metricLabel: '월간',
    insight: '이번 달은 이슈와 커밋 궤도가 넓게 쌓여 장기 흐름 비교에 적합합니다.',
    buckets: [
      { label: 'PR', displayLabel: 'PR', count: 52, color: '#007da5', radius: 1.2 },
      { label: 'Issue', displayLabel: '이슈', count: 86, color: '#4f8f32', radius: 1.8 },
      { label: 'Commit', displayLabel: '커밋', count: 164, color: '#c4457c', radius: 2.45 },
      { label: 'Review', displayLabel: '리뷰', count: 41, color: '#b77900', radius: 3.0 },
    ],
  },
] as const satisfies readonly PeriodOption[]

const createActivityPoint = (bucket: ActivityBucket, bucketIndex: number, index: number): ActivityPoint => {
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
}

const createActivityPoints = (buckets: readonly ActivityBucket[]): ActivityPoint[] =>
  buckets.flatMap((bucket, bucketIndex) =>
    Array.from({ length: bucket.count }, (_, index) => createActivityPoint(bucket, bucketIndex, index)),
  )

const sumActivityCount = (buckets: readonly ActivityBucket[]) => buckets.reduce((sum, item) => sum + item.count, 0)

const getTopBucket = (buckets: readonly ActivityBucket[]) =>
  buckets.reduce((topBucket, bucket) => (bucket.count > topBucket.count ? bucket : topBucket), buckets[0])

const getPeriodOption = (mode: PeriodMode) =>
  PERIOD_OPTIONS.find((option) => option.mode === mode) ?? PERIOD_OPTIONS[0]

type GalaxyProps = {
  buckets: readonly ActivityBucket[]
}

function Galaxy({ buckets }: GalaxyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const activityPoints = useMemo(() => createActivityPoints(buckets), [buckets])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.08
  })

  return (
    <group ref={groupRef}>
      {buckets.map((bucket) => (
        <mesh key={`${bucket.label}-orbit`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[bucket.radius, 0.006, 8, 120]} />
          <meshBasicMaterial color={bucket.color} transparent opacity={0.2} />
        </mesh>
      ))}
      {activityPoints.map((point) => (
        <mesh key={point.key} position={point.position}>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.6} />
        </mesh>
      ))}
      {buckets.map((bucket, index) => (
        <Html key={bucket.label} position={[bucket.radius + 0.2, 0.48 + index * 0.18, 0]}>
          <span className="orbit-label" style={{ color: bucket.color }}>
            {bucket.label} {bucket.count}
          </span>
        </Html>
      ))}
    </group>
  )
}

export default function App() {
  const [mode, setMode] = useState<PeriodMode>('week')
  const selectedPeriod = getPeriodOption(mode)
  const totalActivityCount = sumActivityCount(selectedPeriod.buckets)
  const topBucket = getTopBucket(selectedPeriod.buckets)

  return (
    <main className="shell">
      <section className="panel" aria-labelledby="title">
        <div className="summary">
          <p className="kicker">GitHub Activity Galaxy</p>
          <h1 id="title">저장소 활동을 밝은 3D 운영 지도로 읽습니다.</h1>
          <p className="lead">
            PR, 이슈, 커밋, 리뷰 신호를 궤도로 배치해 프로젝트 흐름을 시각화합니다. 초기 버전은
            민감 정보 없이 샘플 데이터로 동작하고, 이후 PR에서 GitHub API 연결을 안전하게 확장합니다.
          </p>
          <div className="toolbar" role="group" aria-label="기간 선택">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.mode}
                className={mode === option.mode ? 'active' : ''}
                type="button"
                aria-pressed={mode === option.mode}
                onClick={() => setMode(option.mode)}
              >
                {option.buttonLabel}
              </button>
            ))}
          </div>
          <p className="period-note" aria-live="polite">
            {selectedPeriod.insight}
          </p>
          <dl className="metrics">
            <div>
              <dt>활동 노드</dt>
              <dd>{totalActivityCount}</dd>
              <p>{selectedPeriod.metricLabel} 샘플 활동 합계</p>
            </div>
            <div>
              <dt>집중 신호</dt>
              <dd>{topBucket.displayLabel}</dd>
              <p>{topBucket.count}개 노드로 가장 큰 궤도</p>
            </div>
          </dl>
          <ul className="bucket-list" aria-label={`${selectedPeriod.metricLabel} 활동 유형별 분포`}>
            {selectedPeriod.buckets.map((bucket) => {
              const share = Math.round((bucket.count / totalActivityCount) * 100)

              return (
                <li key={bucket.label}>
                  <span className="bucket-swatch" style={{ backgroundColor: bucket.color }} aria-hidden="true" />
                  <span className="bucket-label">{bucket.displayLabel}</span>
                  <strong>{bucket.count}</strong>
                  <small>{share}%</small>
                  <span className="bucket-share" aria-hidden="true">
                    <span
                      style={{
                        width: `${share}%`,
                        color: bucket.color,
                        backgroundColor: bucket.color,
                      }}
                    />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="galaxy" aria-label={`${selectedPeriod.metricLabel} GitHub 활동 3D 지도`}>
          <Canvas camera={{ position: [0, 3.2, 6.2], fov: 48 }}>
            <color attach="background" args={['#f8fbff']} />
            <ambientLight intensity={1} />
            <directionalLight position={[0, 4, 4]} intensity={2.2} color="#ffffff" />
            <pointLight position={[0, 4, 2]} intensity={10} color="#7ed8ee" />
            <Galaxy buckets={selectedPeriod.buckets} />
            <OrbitControls enablePan={false} minDistance={4} maxDistance={9} />
            <EffectComposer>
              <Bloom intensity={0.28} luminanceThreshold={0.36} luminanceSmoothing={0.28} />
            </EffectComposer>
          </Canvas>
        </div>
      </section>
    </main>
  )
}
