import { Pause, Play, RotateCcw, ScanSearch } from 'lucide-react'
import { useState } from 'react'
import {
  getActivityShare,
  getPeriodOption,
  getTopBucket,
  PERIOD_OPTIONS,
  sumActivityCount,
  type ActivityKind,
  type PeriodMode,
} from './activity-data'
import { GalaxyScene } from './components/GalaxyScene'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [mode, setMode] = useState<PeriodMode>('week')
  const [visibleKinds, setVisibleKinds] = useState<Set<ActivityKind>>(
    () => new Set(['pull-request', 'issue', 'commit', 'review']),
  )
  const [selectedKind, setSelectedKind] = useState<ActivityKind>('commit')
  const [isRotating, setIsRotating] = useState(() => !prefersReducedMotion())
  const [resetRevision, setResetRevision] = useState(0)
  const selectedPeriod = getPeriodOption(mode)
  const allActivityCount = sumActivityCount(selectedPeriod.buckets)
  const visibleBuckets = selectedPeriod.buckets.filter((bucket) => visibleKinds.has(bucket.kind))
  const visibleActivityCount = sumActivityCount(visibleBuckets)
  const topBucket = getTopBucket(visibleBuckets)
  const selectedBucket = selectedPeriod.buckets.find((bucket) => bucket.kind === selectedKind) ?? topBucket

  const toggleBucketVisibility = (kind: ActivityKind) => {
    if (visibleKinds.has(kind) && visibleKinds.size === 1) return

    const nextVisibleKinds = new Set(visibleKinds)
    if (nextVisibleKinds.has(kind)) nextVisibleKinds.delete(kind)
    else nextVisibleKinds.add(kind)

    setVisibleKinds(nextVisibleKinds)
    if (!nextVisibleKinds.has(selectedKind)) {
      setSelectedKind(nextVisibleKinds.values().next().value ?? kind)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1>GitHub Activity Galaxy</h1>
            <p>샘플 저장소 활동 지도</p>
          </div>
        </div>
        <div className="period-switch" role="group" aria-label="활동 기간 선택">
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
      </header>

      <div className="workspace">
        <aside className="activity-sidebar" aria-label="활동 요약과 표시 설정">
          <section className="sidebar-section overview" aria-labelledby="overview-title">
            <p className="eyebrow">{selectedPeriod.metricLabel} 요약</p>
            <h2 id="overview-title">저장소 활동 개요</h2>
            <p className="period-note" aria-live="polite">
              {selectedPeriod.insight}
            </p>
            <dl className="metrics">
              <div>
                <dt>표시 노드</dt>
                <dd>{visibleActivityCount}</dd>
                <p>전체 {allActivityCount}개 중</p>
              </div>
              <div>
                <dt>표시 궤도</dt>
                <dd>{visibleBuckets.length}</dd>
                <p>활동 유형 기준</p>
              </div>
              <div>
                <dt>집중 신호</dt>
                <dd>{topBucket.shortLabel}</dd>
                <p>{topBucket.count}개 노드</p>
              </div>
            </dl>
          </section>

          <section className="sidebar-section" aria-labelledby="filter-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">레이어</p>
                <h2 id="filter-title">활동 유형</h2>
              </div>
              <span>{visibleBuckets.length}/4 표시</span>
            </div>
            <ul className="bucket-list">
              {selectedPeriod.buckets.map((bucket) => {
                const isVisible = visibleKinds.has(bucket.kind)
                const isOnlyVisibleBucket = isVisible && visibleKinds.size === 1
                const share = getActivityShare(bucket, allActivityCount)

                return (
                  <li key={bucket.kind} className={bucket.kind === selectedKind ? 'selected' : ''}>
                    <label className="bucket-toggle">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        disabled={isOnlyVisibleBucket}
                        onChange={() => toggleBucketVisibility(bucket.kind)}
                      />
                      <span className="bucket-swatch" style={{ backgroundColor: bucket.color }} aria-hidden="true" />
                      <span className="bucket-name">
                        <strong>{bucket.label}</strong>
                        <small>{share}%</small>
                      </span>
                      <span className="bucket-count">{bucket.count}</span>
                    </label>
                    <button
                      className="inspect-button"
                      type="button"
                      title={`${bucket.label} 상세 보기`}
                      aria-label={`${bucket.label} 상세 보기`}
                      aria-pressed={bucket.kind === selectedKind}
                      disabled={!isVisible}
                      onClick={() => setSelectedKind(bucket.kind)}
                    >
                      <ScanSearch size={17} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="sidebar-section inspector" aria-labelledby="inspector-title" aria-live="polite">
            <div className="section-heading">
              <div>
                <p className="eyebrow">선택 정보</p>
                <h2 id="inspector-title">{selectedBucket.label}</h2>
              </div>
              <span className="inspector-count" style={{ color: selectedBucket.color }}>
                {selectedBucket.count}
              </span>
            </div>
            <p>{selectedBucket.description}</p>
            <div className="share-meter" aria-label={`전체 활동의 ${getActivityShare(selectedBucket, allActivityCount)}%`}>
              <span
                style={{
                  width: `${getActivityShare(selectedBucket, allActivityCount)}%`,
                  backgroundColor: selectedBucket.color,
                }}
              />
            </div>
          </section>
        </aside>

        <section className="galaxy-stage" aria-labelledby="scene-title">
          <header className="stage-toolbar">
            <div>
              <p className="eyebrow">3D 활동 지도</p>
              <h2 id="scene-title">{selectedBucket.shortLabel} 궤도 탐색</h2>
            </div>
            <div className="stage-actions" role="toolbar" aria-label="3D 지도 제어">
              <button
                type="button"
                title={isRotating ? '자동 회전 일시정지' : '자동 회전 재생'}
                aria-label={isRotating ? '자동 회전 일시정지' : '자동 회전 재생'}
                aria-pressed={!isRotating}
                onClick={() => setIsRotating((current) => !current)}
              >
                {isRotating ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              </button>
              <button
                type="button"
                title="3D 시점 초기화"
                aria-label="3D 시점 초기화"
                onClick={() => setResetRevision((revision) => revision + 1)}
              >
                <RotateCcw size={18} aria-hidden="true" />
              </button>
            </div>
          </header>
          <div
            className="galaxy-canvas"
            role="img"
            aria-label={`${selectedPeriod.metricLabel} GitHub 활동 3D 지도. ${visibleBuckets.length}개 궤도와 ${visibleActivityCount}개 노드 표시 중.`}
          >
            <GalaxyScene
              buckets={visibleBuckets}
              selectedKind={selectedKind}
              isRotating={isRotating}
              resetRevision={resetRevision}
            />
          </div>
          <footer className="stage-status" aria-live="polite">
            <span className="status-dot" style={{ backgroundColor: selectedBucket.color }} aria-hidden="true" />
            <strong>{selectedBucket.shortLabel}</strong>
            <span>{selectedBucket.count}개 노드 강조</span>
            <span className="motion-status">자동 회전 {isRotating ? '켜짐' : '꺼짐'}</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
