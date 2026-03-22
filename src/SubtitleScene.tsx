import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

interface SubtitleSceneProps {
  bgColor1: string;
  bgColor2: string;
  children: React.ReactNode;
  enterFrame: number;
  exitFrame: number;
}

export const SubtitleScene: React.FC<SubtitleSceneProps> = ({
  bgColor1,
  bgColor2,
  children,
  enterFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();

  // 씬 전환: fade + scale
  const enterProgress = interpolate(frame, [enterFrame, enterFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [exitFrame - 8, exitFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const opacity = enterProgress * exitProgress;
  const scale = interpolate(enterProgress, [0, 1], [1.05, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgColor1}, ${bgColor2})`,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
