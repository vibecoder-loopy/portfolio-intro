# Remotion 실습 프로젝트

안녕하세요! 바이브코더 루피입니다 하핳

원데이클래스에서 Remotion 배우면서 실습한 코드들 올려봅니다!!
React로 영상 만드는 거 신기하지 않나요?? 코드만 짜면 영상이 뚝딱 나옴 ㄷㄷ

## 뭘 만들었냐면요

### 1. 포트폴리오 인트로 영상
터미널 해커 감성의 자기소개 영상이에요.
- 타이핑 애니메이션 타다다닥
- 글리치 효과 + 스캔라인
- 프로그레스 바 채워지는 거 (`[████████░░░░] 95%`)
- 씬 전환 플래시 번쩍!

### 2. SRT 기반 유튜브 영상 자동화
SRT 자막 파일 넣으면 영상이 자동으로 만들어지는 시스템!!
- SRT 파싱해서 자동으로 씬 분할 (자막 3개 = 1씬)
- 단어별로 하이라이트 되는 자막 (틱톡 느낌)
- 왼쪽에는 씬 맞춤 모션그래픽, 오른쪽에는 자막
- 씬마다 컬러 테마가 자동으로 바뀜

## 실행 방법

```bash
# 설치
npm install

# 미리보기 (브라우저에서 바로 확인 가능!)
npm run dev

# 영상 렌더링 (MP4로 뽑기)
npx remotion render SrtVideo
```

## 프로젝트 구조

```
src/
├── Composition.tsx    # 메인 영상 컴포지션
├── CaptionText.tsx    # 단어별 하이라이트 자막
├── SceneVisuals.tsx   # 씬별 모션그래픽 애니메이션
├── SubtitleScene.tsx  # 씬 전환 배경
├── srtParser.ts       # SRT 파일 파싱 유틸
├── Root.tsx           # 엔트리포인트
└── index.ts
sample.srt             # 예시 SRT 대본 (1분)
```

## 씬별 모션그래픽

| 씬 | 비주얼 | 설명 |
|----|--------|------|
| INTRO | 터미널 | `$ vibe create my-app` 타이핑 |
| AI | 뉴런 네트워크 | 노드들이 연결되며 회전 |
| TOOLS | 아이콘 팝업 | Cursor, Claude, Copilot |
| INSIGHT | 장벽 붕괴 | 블록이 부서지며 OPEN |
| POWER | 카운터 | 10x 스프링 애니메이션 |
| OUTRO | 프롬프트 | 입력창 타이핑 |

## 사용 기술

- [Remotion](https://remotion.dev/) - React로 영상 만들기
- TypeScript
- Tailwind CSS
- Google Fonts (Fira Code, Noto Sans KR, NanumGothicCoding)

---

만든 사람: **바이브코더 루피**
