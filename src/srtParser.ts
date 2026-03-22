export interface SrtEntry {
  id: number;
  startMs: number;
  endMs: number;
  text: string;
}

function timeToMs(time: string): number {
  const [h, m, rest] = time.split(":");
  const [s, ms] = rest.split(",");
  return (
    parseInt(h) * 3600000 +
    parseInt(m) * 60000 +
    parseInt(s) * 1000 +
    parseInt(ms)
  );
}

export function parseSrt(srtContent: string): SrtEntry[] {
  const blocks = srtContent
    .trim()
    .replace(/\r\n/g, "\n")
    .split(/\n\n+/);

  return blocks.map((block) => {
    const lines = block.split("\n");
    const id = parseInt(lines[0]);
    const [startTime, endTime] = lines[1].split(" --> ");
    const text = lines.slice(2).join(" ");

    return {
      id,
      startMs: timeToMs(startTime.trim()),
      endMs: timeToMs(endTime.trim()),
      text,
    };
  });
}

export function msToFrames(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps);
}

export function getTotalDurationFrames(
  entries: SrtEntry[],
  fps: number,
): number {
  const lastEntry = entries[entries.length - 1];
  return msToFrames(lastEntry.endMs, fps) + fps; // +1초 여유
}
