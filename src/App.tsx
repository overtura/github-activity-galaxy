import { OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import * as THREE from 'three'

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

const ACTIVITY_BUCKETS = [
  { label: 'PR', count: 18, color: '#007da5', radius: 1.2 },
  { label: 'Issue', count: 31, color: '#4f8f32', radius: 1.8 },
  { label: 'Commit', count: 74, color: '#c4457c', radius: 2.45 },
  { label: 'Review', count: 12, color: '#b77900', radius: 3.0 },
] as const satisfies readonly ActivityBucket[]

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

const ACTIVITY_POINTS = createActivityPoints(ACTIVITY_BUCKETS)
const TOTAL_ACTIVITY_COUNT = sumActivityCount(ACTIVITY_BUCKETS)

function Galaxy() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.08
  })

  return (
    <group ref={groupRef}>
      {ACTIVITY_BUCKETS.map((bucket) => (
        <mesh key={`${bucket.label}-orbit`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[bucket.radius, 0.006, 8, 120]} />
          <meshBasicMaterial color={bucket.color} transparent opacity={0.2} />
        </mesh>
      ))}
      {ACTIVITY_POINTS.map((point) => (
        <mesh key={point.key} position={point.position}>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.6} />
        </mesh>
      ))}
      {ACTIVITY_BUCKETS.map((bucket, index) => (
        <Text
          key={bucket.label}
          position={[bucket.radius + 0.2, 0.48 + index * 0.18, 0]}
          fontSize={0.16}
          color={bucket.color}
          anchorX="left"
        >
          {bucket.label} {bucket.count}
        </Text>
      ))}
    </group>
  )
}

export default function App() {
  const [mode, setMode] = useState<'week' | 'month'>('week')

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
            <button className={mode === 'week' ? 'active' : ''} type="button" onClick={() => setMode('week')}>
              이번 주
            </button>
            <button className={mode === 'month' ? 'active' : ''} type="button" onClick={() => setMode('month')}>
              이번 달
            </button>
          </div>
          <dl className="metrics">
            <div>
              <dt>활동 노드</dt>
              <dd>{TOTAL_ACTIVITY_COUNT}</dd>
            </div>
            <div>
              <dt>보기 모드</dt>
              <dd>{mode === 'week' ? '주간' : '월간'}</dd>
            </div>
          </dl>
        </div>
        <div className="galaxy" aria-label="GitHub 활동 3D 지도">
          <Canvas camera={{ position: [0, 3.2, 6.2], fov: 48 }}>
            <color attach="background" args={['#f8fbff']} />
            <ambientLight intensity={1} />
            <directionalLight position={[0, 4, 4]} intensity={2.2} color="#ffffff" />
            <pointLight position={[0, 4, 2]} intensity={10} color="#7ed8ee" />
            <Galaxy />
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
