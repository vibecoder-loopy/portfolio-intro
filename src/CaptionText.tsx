import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import { loadFont as loadKrFont } from "@remotion/google-fonts/NotoSansKR";

const { fontFamily: fira } = loadFont();
const { fontFamily: kr } = loadKrFont();

const FONT = `${kr}, ${fira}, sans-serif`;

interface CaptionTextProps {
  text: string;
  startFrame: number;
  endFrame: number;
  accentColor: string;
}

export const CaptionText: React.FC<CaptionTextProps> = ({
  text,
  startFrame,
  endFrame,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(/\s+/);
  const totalDuration = endFrame - startFrame;
  const msPerWord = totalDuration / words.length;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "8px 10px",
        maxWidth: 1100,
        lineHeight: 1.5,
      }}
    >
      {words.map((word, i) => {
        const wordStart = startFrame + i * msPerWord;
        const isActive = frame >= wordStart && frame < wordStart + msPerWord;
        const isPast = frame >= wordStart + msPerWord;
        const isFuture = frame < wordStart;

        // 등장 애니메이션
        const enterProgress = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 15, stiffness: 200 },
        });

        const scale = isFuture
          ? 1
          : interpolate(enterProgress, [0, 1], [0.92, 1]);

        const opacity = isFuture ? 0.3 : isPast ? 0.55 : 1;

        return (
          <span
            key={`${word}-${i}`}
            style={{
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: isActive ? 800 : 600,
              color: isActive ? "#fff" : isPast ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)",
              transform: `scale(${scale})`,
              opacity,
              display: "inline-block",
              position: "relative",
              padding: isActive ? "4px 14px" : "4px 6px",
              borderRadius: 10,
              background: isActive ? accentColor : "transparent",
              transition: "background 0.1s",
              textShadow: isActive
                ? `0 0 20px ${accentColor}80`
                : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
