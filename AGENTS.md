# AGENTS.md

## Project goal
이 저장소는 GitHub 활동을 3D 은하로 시각화하는 overtura 실험 저장소다. 초기에는 민감 정보 없는 샘플 데이터로 동작하고, 실제 API 연결은 secret 없이 안전한 인터페이스를 먼저 만든다.

## Commands
- install: `pnpm install`
- dev: `pnpm dev`
- lint: `pnpm lint`
- typecheck: `pnpm typecheck`
- test: `pnpm test`
- build: `pnpm build`
- full check: `pnpm check`
- self-improve context: `pnpm self-improve:context`
- self-improve guard: `pnpm self-improve:guard`

## Done definition
- 핵심 보기 전환 flow가 실제로 동작한다.
- 3D canvas가 desktop/mobile에서 비어 있지 않다.
- README에 demo mode와 자가 개선 방식이 있다.
- PR 요약에 검증 결과가 있다.

## Review guidelines
- 리뷰와 사용자-facing 문구는 기본적으로 한국어로 작성한다.
- 실제 token, private repo 데이터, 과한 workflow 권한 상승은 즉시 차단한다.
- self-improve 변경은 민감 정보 guard와 `pnpm check` 통과 여부를 먼저 본다.
