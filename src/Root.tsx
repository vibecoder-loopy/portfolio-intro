import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

// SRT 마지막 자막: 01:02 = 62초 → 62 * 30fps = 1860 + 여유 30 = 1890
const FPS = 30;
const DURATION = 1890;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SrtVideo"
        component={MyComposition}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
