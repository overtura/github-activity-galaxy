import { OrbitControls, Stars, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const activity = [
  { label: 'PR', count: 18, color: '#6ee7ff', radius: 1.2 },
  { label: 'Issue', count: 31, color: '#b6f569', radius: 1.8 },
  { label: 'Commit', count: 74, color: '#f9a8d4', radius: 2.45 },
  { label: 'Review', count: 12, color: '#facc15', radius: 3.0 },
] as const

function Galaxy() {
  const groupRef = useRef<THREE.Group>(null)
  const points = useMemo(() => {
    return activity.flatMap((bucket, bucketIndex) =>
      Array.from({ length: bucket.count }, (_, index) => {
        const angle = (index / bucket.count) * Math.PI * 2 + bucketIndex * 0.7
        const spiral = bucket.radius + index * 0.006
        return {
          key: `${bucket.label}-${index}`,
          label: bucket.label,
          color: bucket.color,
          position: [
            Math.cos(angle) * spiral,
            Math.sin(index * 1.7) * 0.22 + bucketIndex * 0.08,
            Math.sin(angle) * spiral,
          ] as [number, number, number],
        }
      }),
    )
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.08
  })

  return (
    <group ref={groupRef}>
      {points.map((point) => (
        <mesh key={point.key} position={point.position}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={1.8} />
        </mesh>
      ))}
      {activity.map((bucket, index) => (
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
          <h1 id="title">저장소 활동을 은하처럼 읽는 3D 운영 지도</h1>
          <p className="lead">
            PR, 이슈, 커밋, 리뷰 신호를 궤도로 배치해 프로젝트 흐름을 시각화합니다. 초기 버전은
            민감 정보 없이 샘플 데이터로 동작하고, 후속 PR에서 GitHub API 연결을 안전하게 확장합니다.
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
              <dd>{activity.reduce((sum, item) => sum + item.count, 0)}</dd>
            </div>
            <div>
              <dt>보기 모드</dt>
              <dd>{mode === 'week' ? '주간' : '월간'}</dd>
            </div>
          </dl>
        </div>
        <div className="galaxy" aria-label="GitHub 활동 3D 은하">
          <Canvas camera={{ position: [0, 3.2, 6.2], fov: 48 }}>
            <color attach="background" args={['#060712']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 4, 2]} intensity={22} color="#8be9ff" />
            <Stars radius={40} depth={30} count={1600} factor={3} fade speed={0.45} />
            <Galaxy />
            <OrbitControls enablePan={false} minDistance={4} maxDistance={9} />
            <EffectComposer>
              <Bloom intensity={0.75} luminanceThreshold={0.12} luminanceSmoothing={0.28} />
            </EffectComposer>
          </Canvas>
        </div>
      </section>
    </main>
  )
}
