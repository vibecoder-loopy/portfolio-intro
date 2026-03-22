import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import { loadFont as loadKrFont } from "@remotion/google-fonts/NotoSansKR";
import { parseSrt, msToFrames, type SrtEntry } from "./srtParser";
import { CaptionText } from "./CaptionText";
import { SceneVisual } from "./SceneVisuals";

const { fontFamily: fira } = loadFont();
loadKrFont(); // 한글 폰트 로드

// ─── SRT 데이터 ───
const SRT_RAW = `1
00:00:00,000 --> 00:00:03,500
여러분, 바이브코딩이라는 말 들어보셨나요?

2
00:00:03,500 --> 00:00:07,000
2025년부터 개발자들 사이에서 폭발적으로 퍼지기 시작한

3
00:00:07,000 --> 00:00:10,500
완전히 새로운 개발 방식입니다.

4
00:00:10,500 --> 00:00:14,000
AI에게 자연어로 명령하면, 코드가 자동으로 생성됩니다.

5
00:00:14,000 --> 00:00:18,000
타이핑 한 줄 없이, 말 한마디로 앱을 만들 수 있는 시대.

6
00:00:18,000 --> 00:00:22,500
실제로 Cursor, Claude Code 같은 도구들이 등장하면서

7
00:00:22,500 --> 00:00:26,000
비개발자도 서비스를 뚝딱 만들어내고 있습니다.

8
00:00:26,000 --> 00:00:30,000
하지만 여기서 중요한 포인트가 있습니다.

9
00:00:30,000 --> 00:00:34,500
바이브코딩은 코딩을 대체하는 게 아닙니다.

10
00:00:34,500 --> 00:00:38,000
코딩의 진입장벽을 없애는 겁니다.

11
00:00:38,000 --> 00:00:42,500
기존 개발자에게는 생산성이 10배 올라가는 도구이고,

12
00:00:42,500 --> 00:00:46,000
비개발자에게는 아이디어를 현실로 바꾸는 마법입니다.

13
00:00:46,000 --> 00:00:50,000
그래서 지금 이 순간, 배워야 할 건 코딩 문법이 아니라

14
00:00:50,000 --> 00:00:54,000
AI에게 정확하게 명령하는 방법입니다.

15
00:00:54,000 --> 00:00:58,000
프롬프트 엔지니어링, 이게 진짜 핵심 스킬입니다.

16
00:00:58,000 --> 00:01:02,000
다음 영상에서 실전 바이브코딩을 직접 보여드리겠습니다.`;

const entries = parseSrt(SRT_RAW);

// ─── 씬 테마 ───
const SCENE_THEMES = [
  { bg1: "#0A0A12", bg2: "#0F0F1A", accent: "#FF6978", label: "INTRO" },
  { bg1: "#0A0F12", bg2: "#0A141A", accent: "#4FC3F7", label: "AI" },
  { bg1: "#0F0A12", bg2: "#1A0F1A", accent: "#CE93D8", label: "TOOLS" },
  { bg1: "#0A120A", bg2: "#0F1A0F", accent: "#81C784", label: "INSIGHT" },
  { bg1: "#12100A", bg2: "#1A150F", accent: "#FFB74D", label: "POWER" },
  { bg1: "#0A0A12", bg2: "#0F0F1A", accent: "#FF6978", label: "OUTRO" },
];

// 자막 3개씩 묶어서 씬
function groupEntries(list: SrtEntry[], size: number) {
  const groups: SrtEntry[][] = [];
  for (let i = 0; i < list.length; i += size) {
    groups.push(list.slice(i, i + size));
  }
  return groups;
}

const sceneGroups = groupEntries(entries, 3);

// ─── 프로그레스 바 ───
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4 }}>
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(90deg, #FF6978, #4FC3F7, #CE93D8)",
          boxShadow: "0 0 10px rgba(255,105,120,0.5)",
        }}
      />
    </div>
  );
};

// ─── 씬 인디케이터 ───
const SceneIndicator: React.FC<{
  label: string;
  accent: string;
  sceneIndex: number;
  totalScenes: number;
}> = ({ label, accent, sceneIndex, totalScenes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 150 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: interpolate(enter, [0, 1], [0, 0.5]),
        fontFamily: `${fira}, monospace`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 8px ${accent}80`,
        }}
      />
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: 3 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: accent }}>
        {String(sceneIndex + 1).padStart(2, "0")}/{String(totalScenes).padStart(2, "0")}
      </span>
    </div>
  );
};

// ─── 메인 컴포지션 ───
export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#08080C", opacity: fadeIn * fadeOut }}>
      {sceneGroups.map((group, sceneIdx) => {
        const theme = SCENE_THEMES[sceneIdx % SCENE_THEMES.length];
        const sceneStartFrame = msToFrames(group[0].startMs, 30);
        const sceneEndFrame = msToFrames(group[group.length - 1].endMs, 30);
        const sceneDuration = sceneEndFrame - sceneStartFrame;

        return (
          <Sequence key={sceneIdx} from={sceneStartFrame} durationInFrames={sceneDuration + 5}>
            {/* 배경 */}
            <AbsoluteFill
              style={{
                background: `
                  radial-gradient(ellipse at 30% 50%, ${theme.accent}06 0%, transparent 50%),
                  linear-gradient(160deg, ${theme.bg1}, ${theme.bg2})
                `,
              }}
            >
              {/* 미세 스캔라인 */}
              <AbsoluteFill
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg, transparent, transparent 4px,
                    rgba(255,255,255,0.006) 4px, rgba(255,255,255,0.006) 8px
                  )`,
                  pointerEvents: "none",
                }}
              />
              {/* 비네트 */}
              <AbsoluteFill
                style={{
                  background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)",
                  pointerEvents: "none",
                }}
              />
              {/* 중앙 세로 구분선 */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "12%",
                  bottom: "12%",
                  width: 1,
                  background: `linear-gradient(180deg, transparent, ${theme.accent}15, transparent)`,
                }}
              />
            </AbsoluteFill>

            {/* 씬 인디케이터 */}
            <SceneIndicator
              label={theme.label}
              accent={theme.accent}
              sceneIndex={sceneIdx}
              totalScenes={sceneGroups.length}
            />

            {/* ===== 2분할 레이아웃 ===== */}
            <AbsoluteFill
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "80px 60px 60px",
              }}
            >
              {/* 왼쪽: 비주얼 애니메이션 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 30px",
                }}
              >
                <div style={{ maxWidth: 400, width: "100%" }}>
                  <SceneVisual sceneIndex={sceneIdx} accent={theme.accent} />
                </div>
              </div>

              {/* 오른쪽: 자막 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "0 30px",
                  gap: 20,
                }}
              >
                {group.map((entry) => {
                  const entryStart = msToFrames(entry.startMs, 30) - sceneStartFrame;
                  const entryEnd = msToFrames(entry.endMs, 30) - sceneStartFrame;

                  return (
                    <Sequence
                      key={entry.id}
                      from={entryStart}
                      durationInFrames={entryEnd - entryStart}
                      layout="none"
                    >
                      <CaptionText
                        text={entry.text}
                        startFrame={0}
                        endFrame={entryEnd - entryStart}
                        accentColor={theme.accent}
                      />
                    </Sequence>
                  );
                })}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <ProgressBar />
    </AbsoluteFill>
  );
};
