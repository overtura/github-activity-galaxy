# DESIGN.md - GitHub Activity Galaxy

## Product Intent
GitHub 활동을 3D 지도로 보여주는 시각 운영 도구다. 사용자는 기간을 선택하고 PR, issue, commit, review 반응을 빠르게 파악한다.

## Design Authority
우선순위는 이 문서, CSS semantic token, 컴포넌트 규약, 외부 디자인 도구와 레퍼런스 순서다. 외부 브랜드의 고유한 로고, 서체, 구성은 복제하지 않는다.

## Visual Character
```txt
Operational
Spatial
Bright
Readable
Calm
```

- 3D galaxy는 검은 우주 배경이 아니라 밝은 activity map이다.
- cyan은 primary status, amber는 review/attention, rose는 commit activity를 표현한다.
- metrics는 compact하고 scan 가능해야 한다.
- GitHub 자체 브랜드 색과 Octocat visual identity를 복제하지 않는다.

## Typography
- UI: Inter, Pretendard, system-ui
- Display: 40-76px
- Body: 18/31
- Metric value: 28/34, semibold, tabular numbers
- Control: 14/20

## Layout
- Desktop은 summary와 galaxy canvas의 2-column 구조다.
- Metrics는 2-column compact panel로 유지한다.
- Canvas frame radius는 8px 이하로 유지한다.
- Mobile은 summary, controls, canvas 순서로 쌓는다.

## Component Rules
- Period switch는 segmented control이다.
- Activity metric은 label, value, helper context를 포함한다.
- 3D label은 canvas 내부에서만 사용하고 page chrome으로 확장하지 않는다.
- 실제 GitHub token 또는 private activity dump는 UI seed data로 넣지 않는다.

## Interaction Model
```txt
Choose period -> Read density -> Inspect orbit -> Propose data/visual PR
```

## Responsive Rules
- 900px 이하에서는 단일 column이다.
- Metrics panel은 390px에서 overflow 없이 2-column 또는 1-column로 자연스럽게 줄어들어야 한다.
- Canvas minimum height는 360px이다.

## Anti-patterns
- GitHub 브랜드 복제
- 검은 ops dashboard
- crowded fake analytics
- activity를 숫자만으로 표현
- color-only status
