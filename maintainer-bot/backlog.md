# GitHub Activity Galaxy Maintainer Bot Backlog

중앙 control plane은 `okorion/self-improving-maintainer-bot`이다. 실제 GitHub token, private activity dump, 개인 인증 정보는 추가하지 않는다.

## 운영 검증
- 모든 변경은 `pnpm check`를 통과해야 한다.
- 자동 merge 기본값은 꺼져 있다.
- GitHub Actions는 dry-run, check, report 자동화로만 사용한다.
- `.github/workflows/**`, credential, auth/security, infra, migration 변경은 R3로 취급하고 draft/proposal only로 다룬다.

## R0 Report
- GitHub API 연결 전 필요한 데이터 계약과 privacy boundary를 분석 리포트로 정리한다.
- activity type별 색상 의미와 legend 확장 기준의 빈 부분을 정리한다.

## R1 PR 후보
- 민감 정보 없는 샘플 activity bucket을 더 설명적인 구조로 정리한다.
- 기간 선택 상태에 따른 설명 문구나 metrics helper text를 개선한다.
- 밝은 canvas 위에서 노드와 orbit line 가시성을 개선한다.

## R2 Draft 후보
- 실제 API integration, 의존성 변경, 데이터 fetch 구조 변경은 draft PR로만 제안한다.

## R3 Proposal only
- workflow, credential, security, infra, migration 관련 변경은 코드 변경 없이 proposal로만 다룬다.
