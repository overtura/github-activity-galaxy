import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { type ComponentRef, type RefObject, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ActivityBucket, ActivityKind } from '../activity-data'

type ActivityPoint = {
  key: string
  kind: ActivityKind
  color: string
  position: [number, number, number]
}

type GalaxyProps = {
  buckets: readonly ActivityBucket[]
  selectedKind: ActivityKind
  isRotating: boolean
}

type GalaxySceneProps = GalaxyProps & {
  resetRevision: number
}

type CameraRigProps = {
  controlsRef: RefObject<ComponentRef<typeof OrbitControls> | null>
  resetRevision: number
}

const INITIAL_CAMERA = {
  position: [0, 3.2, 6.2] as [number, number, number],
  fov: 48,
}
const CANVAS_PIXEL_RATIO: [number, number] = [1, 1.75]
const CANVAS_BACKGROUND: [string] = ['#f8fbff']

const createActivityPoint = (bucket: ActivityBucket, bucketIndex: number, index: number): ActivityPoint => {
  const angle = (index / bucket.count) * Math.PI * 2 + bucketIndex * 0.7
  const spiral = bucket.radius + index * 0.006

  return {
    key: `${bucket.kind}-${index}`,
    kind: bucket.kind,
    color: bucket.color,
    position: [
      Math.cos(angle) * spiral,
      Math.sin(index * 1.7) * 0.22 + bucketIndex * 0.08,
      Math.sin(angle) * spiral,
    ],
  }
}

const createActivityPoints = (buckets: readonly ActivityBucket[]) =>
  buckets.flatMap((bucket, bucketIndex) =>
    Array.from({ length: bucket.count }, (_, index) => createActivityPoint(bucket, bucketIndex, index)),
  )

function Galaxy({ buckets, selectedKind, isRotating }: GalaxyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const activityPoints = useMemo(() => createActivityPoints(buckets), [buckets])

  useFrame((_, delta) => {
    if (groupRef.current && isRotating) groupRef.current.rotation.y += Math.min(delta, 0.1) * 0.08
  })

  return (
    <group ref={groupRef}>
      {buckets.map((bucket) => {
        const isSelected = bucket.kind === selectedKind

        return (
          <mesh key={`${bucket.kind}-orbit`} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[bucket.radius, isSelected ? 0.014 : 0.007, 8, 120]} />
            <meshBasicMaterial color={bucket.color} transparent opacity={isSelected ? 0.58 : 0.18} />
          </mesh>
        )
      })}
      {activityPoints.map((point) => {
        const isSelected = point.kind === selectedKind

        return (
          <mesh key={point.key} position={point.position} scale={isSelected ? 1.38 : 0.82}>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial
              color={point.color}
              emissive={point.color}
              emissiveIntensity={isSelected ? 0.78 : 0.32}
              transparent
              opacity={isSelected ? 1 : 0.56}
            />
          </mesh>
        )
      })}
      {buckets.map((bucket, index) => (
        <Html key={bucket.kind} position={[bucket.radius + 0.2, 0.48 + index * 0.18, 0]}>
          <span
            className={`orbit-label${bucket.kind === selectedKind ? ' selected' : ''}`}
            style={{ color: bucket.color }}
          >
            {bucket.shortLabel} {bucket.count}
          </span>
        </Html>
      ))}
    </group>
  )
}

function CameraRig({ controlsRef, resetRevision }: CameraRigProps) {
  const { camera, size } = useThree()

  useEffect(() => {
    const cameraDistance = size.width <= 560 ? 8.4 : size.width <= 900 ? 7.2 : 6.2
    camera.position.set(0, 3.2, cameraDistance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    controlsRef.current?.target.set(0, 0, 0)
    controlsRef.current?.update()
    controlsRef.current?.saveState()
  }, [camera, controlsRef, resetRevision, size.width])

  return null
}

export function GalaxyScene({ buckets, selectedKind, isRotating, resetRevision }: GalaxySceneProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)

  return (
    <Canvas camera={INITIAL_CAMERA} dpr={CANVAS_PIXEL_RATIO}>
      <color attach="background" args={CANVAS_BACKGROUND} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[0, 4, 4]} intensity={2.2} color="#ffffff" />
      <pointLight position={[0, 4, 2]} intensity={10} color="#7ed8ee" />
      <Galaxy buckets={buckets} selectedKind={selectedKind} isRotating={isRotating} />
      <OrbitControls ref={controlsRef} enablePan={false} minDistance={4} maxDistance={9} />
      <CameraRig controlsRef={controlsRef} resetRevision={resetRevision} />
      <EffectComposer>
        <Bloom intensity={0.24} luminanceThreshold={0.4} luminanceSmoothing={0.3} />
      </EffectComposer>
    </Canvas>
  )
}
