# GitHub Activity Galaxy

GitHub 활동 데이터를 은하처럼 시각화하는 3D 운영 지도입니다. 초기 버전은 민감 정보 없는 샘플 데이터로 동작하며, self-improving maintainer bot이 안전한 PR 단위로 API 연결, 시각 개선, workflow 개선을 제안하고 자동 merge까지 진행하도록 세팅합니다.

## 목적
- PR, 이슈, 커밋, 리뷰 흐름을 한 화면에서 시각적으로 파악한다.
- GitHub API 연결 전에도 demo mode로 디자인과 interaction을 검증한다.
- 자동화가 민감 정보 없이 기능/문서/workflow 개선을 제안하고 병합하는 루프를 검증한다.

## 사용자 flow
1. 주간/월간 보기 모드를 선택한다.
2. 3D 은하에서 활동 유형별 궤도와 밀도를 확인한다.
3. 후속 PR에서 실제 GitHub API 또는 artifact 기반 데이터를 연결한다.

## 실행 방법
```bash
pnpm install
pnpm dev
```

## 검증
```bash
pnpm check
```

## 자가 개선
```bash
pnpm self-improve:context
pnpm self-improve:guard
```

`Self Improve` workflow는 GitHub Models 기반 diff를 생성하고, guard와 `pnpm check` 통과 후 자동 PR과 squash merge를 수행한다.

## 디자인 시스템
- 기준 문서: `DESIGN.md`
- 실행 토큰: `src/design-system/base.css`
- 참고 기록: `docs/design/`

## 범위 밖
- 실제 GitHub token 저장
- 비공개 저장소 데이터를 기본 샘플에 포함
- 운영용 analytics 백엔드
