import { OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import * as THREE from 'three'

import { ACTIVITY_BUCKETS, ACTIVITY_POINTS, TOTAL_ACTIVITY_COUNT } from './activityData'

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
