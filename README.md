# GitHub Activity Galaxy

GitHub 활동 데이터를 은하처럼 시각화하는 3D 운영 지도입니다. 초기 버전은 민감 정보 없는 샘플 데이터로 동작하며, 중앙 `okorion/self-improving-maintainer-bot` control plane이 target profile을 통해 API 연결 후보, 시각 개선, 문서 개선을 PR로 제안하도록 세팅합니다.

## 목적
- PR, 이슈, 커밋, 리뷰 흐름을 한 화면에서 시각적으로 파악한다.
- GitHub API 연결 전에도 demo mode로 디자인과 interaction을 검증한다.
- 자동화가 민감 정보 없이 기능/문서 개선을 제안하는 PR 루프를 검증한다.

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

## 로컬 maintainer 검증
로컬 Codex self-improvement 루프가 문서나 앱 코드를 정리한 뒤에는 target repo 검증과 중앙 control plane 검증을 함께 확인한다.

```bash
pnpm check
```

중앙 control plane root에서는 다음 dry-run 검증을 실행한다.

```bash
python -m self_maintainer_bot.cli smoke-check
python -m self_maintainer_bot.cli validate-evals
```

`python -m self_maintainer_bot.cli eval-docs`는 API 비용이 드는 eval이 필요할 때만 별도로 실행한다.

GitHub Actions는 dry-run, check, report 자동화로만 취급하며 배포, credential 변경, 자동 merge를 수행하지 않는다.

## 자가 개선
이 저장소에는 자가 개선 엔진을 두지 않는다. 중앙 control plane인 `okorion/self-improving-maintainer-bot`이 `profiles/overtura/github-activity-galaxy.json` profile로 이 저장소를 target repo로 다룬다.

Target 설정은 `maintainer-bot/`에 둔다. 실제 GitHub token, private activity dump, `.github/workflows/**`, credential, auth/security, infra, migration 변경은 R3로 취급하며 draft/proposal only로 처리한다.

## 디자인 시스템
- 기준 문서: `DESIGN.md`
- 실행 토큰: `src/design-system/base.css`
- 참고 기록: `docs/design/`

## 범위 밖
- 실제 GitHub token 저장
- 비공개 저장소 데이터를 기본 샘플에 포함
- 운영용 analytics 백엔드
