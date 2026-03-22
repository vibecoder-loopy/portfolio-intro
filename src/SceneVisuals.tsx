import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/FiraCode";

const { fontFamily: mono } = loadFont();

// ─── Scene 0: 터미널 코드 타이핑 ───
export const TerminalVisual: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();

  const lines = [
    { prefix: "$", text: "vibe create my-app", color: accent },
    { prefix: ">", text: "Generating components...", color: "rgba(255,255,255,0.5)" },
    { prefix: ">", text: "Building UI from prompt...", color: "rgba(255,255,255,0.5)" },
    { prefix: "✓", text: "App ready in 4.2s", color: "#4ADE80" },
  ];

  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 16,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "30px 28px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        width: "100%",
      }}
    >
      {/* 윈도우 dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
      </div>

      {lines.map((line, i) => {
        const lineStart = i * 25;
        const elapsed = Math.max(0, frame - lineStart);
        const chars = Math.min(Math.floor(elapsed * 0.8), line.text.length);
        const opacity = interpolate(elapsed, [0, 5], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{ opacity, display: "flex", gap: 8 }}>
            <span style={{ color: line.prefix === "✓" ? "#4ADE80" : accent }}>{line.prefix}</span>
            <span style={{ color: line.color }}>{line.text.slice(0, chars)}</span>
            {chars < line.text.length && (
              <span style={{ color: accent, opacity: Math.sin(elapsed * 0.3) > 0 ? 1 : 0 }}>█</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Scene 1: 뉴런 네트워크 파티클 ───
export const NeuralVisual: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();

  const nodes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 100 + (i % 3) * 40;
    const x = 160 + Math.cos(angle + frame * 0.015) * radius;
    const y = 160 + Math.sin(angle + frame * 0.015) * radius;
    const pulse = interpolate(Math.sin(frame * 0.08 + i), [-1, 1], [0.4, 1]);
    return { x, y, pulse, i };
  });

  return (
    <svg width="320" height="320" viewBox="0 0 320 320">
      {/* 연결선 */}
      {nodes.map((a) =>
        nodes
          .filter((b) => b.i > a.i && Math.abs(a.i - b.i) < 4)
          .map((b) => (
            <line
              key={`${a.i}-${b.i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={accent}
              strokeWidth={1}
              opacity={0.15 * a.pulse}
            />
          )),
      )}
      {/* 노드 */}
      {nodes.map((n) => (
        <g key={n.i}>
          <circle cx={n.x} cy={n.y} r={6 * n.pulse} fill={accent} opacity={0.6 * n.pulse} />
          <circle cx={n.x} cy={n.y} r={3} fill="#fff" opacity={0.9 * n.pulse} />
        </g>
      ))}
      {/* 중앙 */}
      <circle cx={160} cy={160} r={14} fill={accent} opacity={0.3}>
        <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x={160} y={166} textAnchor="middle" fill="#fff" fontSize={14} fontFamily={mono}>
        AI
      </text>
    </svg>
  );
};

// ─── Scene 2: 아이콘 팝업 ───
export const ToolsVisual: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tools = [
    { icon: "▷", label: "Cursor" },
    { icon: "◈", label: "Claude" },
    { icon: "⬡", label: "Copilot" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {tools.map((tool, i) => {
        const enter = spring({
          frame: frame - i * 15,
          fps,
          config: { damping: 10, stiffness: 120 },
        });
        const scale = interpolate(enter, [0, 1], [0, 1]);
        const x = interpolate(enter, [0, 1], [40, 0]);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              transform: `translateX(${x}px) scale(${scale})`,
              opacity: enter,
              padding: "14px 20px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 12,
              border: `1px solid ${accent}20`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${accent}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: accent,
              }}
            >
              {tool.icon}
            </div>
            <span style={{ fontFamily: mono, fontSize: 18, color: "rgba(255,255,255,0.8)" }}>
              {tool.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Scene 3: 장벽 무너짐 ───
export const BarrierVisual: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const breakProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8, stiffness: 60 },
  });

  const blocks = Array.from({ length: 8 }, (_, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const angle = breakProgress * (15 + i * 8) * (col === 0 ? -1 : 1);
    const tx = breakProgress * (40 + i * 15) * (col === 0 ? -1 : 1);
    const ty = breakProgress * (20 + i * 12);
    const opacity = interpolate(breakProgress, [0, 0.8], [1, 0.1], { extrapolateRight: "clamp" });

    return { row, col, angle, tx, ty, opacity };
  });

  return (
    <div style={{ position: "relative", width: 280, height: 240, margin: "0 auto" }}>
      {/* 장벽 블록 */}
      {blocks.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 90 + b.col * 55,
            top: 20 + b.row * 55,
            width: 50,
            height: 50,
            background: `${accent}30`,
            border: `1px solid ${accent}50`,
            borderRadius: 4,
            transform: `translate(${b.tx}px, ${b.ty}px) rotate(${b.angle}deg)`,
            opacity: b.opacity,
          }}
        />
      ))}
      {/* 깨진 후 텍스트 */}
      {breakProgress > 0.5 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: mono,
            fontSize: 22,
            fontWeight: 700,
            color: accent,
            opacity: interpolate(breakProgress, [0.5, 1], [0, 1]),
            textShadow: `0 0 15px ${accent}60`,
          }}
        >
          OPEN
        </div>
      )}
    </div>
  );
};

// ─── Scene 4: 10x 카운터 ───
export const MultiplierVisual: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, stiffness: 50 },
  });

  const count = Math.floor(enter * 10);
  const scale = interpolate(enter, [0, 0.9, 1], [0.5, 1.15, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 120,
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
          transform: `scale(${scale})`,
          textShadow: `0 0 40px ${accent}50, 0 0 80px ${accent}25`,
        }}
      >
        {count}x
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 16,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 4,
        }}
      >
        PRODUCTIVITY
      </div>
    </div>
  );
};

// ─── Scene 5: 프롬프트 입력창 ───
export const PromptVisual: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();

  const promptText = "다음 영상에서 만나요 →";
  const elapsed = Math.max(0, frame - 10);
  const chars = Math.min(Math.floor(elapsed * 0.4), promptText.length);
  const cursorOn = Math.sin(elapsed * 0.35) > 0;

  return (
    <div
      style={{
        width: "100%",
        padding: "24px 28px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 14,
        border: `1px solid ${accent}25`,
      }}
    >
      {/* 검색바 스타일 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${accent}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: accent,
          }}
        >
          ⟩
        </div>
        <span style={{ fontFamily: mono, fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
          {promptText.slice(0, chars)}
          <span style={{ color: accent, opacity: cursorOn ? 1 : 0 }}>|</span>
        </span>
      </div>
    </div>
  );
};

// ─── 씬 인덱스로 비주얼 선택 ───
export const SceneVisual: React.FC<{ sceneIndex: number; accent: string }> = ({
  sceneIndex,
  accent,
}) => {
  const visuals = [
    <TerminalVisual accent={accent} />,
    <NeuralVisual accent={accent} />,
    <ToolsVisual accent={accent} />,
    <BarrierVisual accent={accent} />,
    <MultiplierVisual accent={accent} />,
    <PromptVisual accent={accent} />,
  ];

  return visuals[sceneIndex % visuals.length];
};
