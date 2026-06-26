# Synthesis Notes

## Product Intent And User Task
사용자는 GitHub 활동량을 기간별로 비교하고 3D orbit에서 활동 유형을 구분한다.

## Adopted Principles
- operation metrics와 3D map을 같은 우선순위로 둔다.
- 색상은 activity type과 status 의미를 분리한다.
- seed data는 private 정보 없이 설명 가능해야 한다.

## Rejected Principles
- GitHub brand imitation은 피한다.
- dense table dashboard는 v1 목적과 맞지 않아 제외한다.

## Token Changes
- `src/design-system/base.css`에 galaxy ops dark theme semantic token을 둔다.

## Component Contract Changes
- period segmented control, metric card, canvas frame은 token 기반으로 고정한다.

## Golden Screens
- Desktop weekly galaxy
- Monthly mode selected state
- Mobile stacked activity map
