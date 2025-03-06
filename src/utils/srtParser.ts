interface Caption {
  index: number;
  start: number;
  end: number;
  text: string;
}

function timeToFrames(timeStr: string, fps: number): number {
  const [hours, minutes, seconds] = timeStr.split(':');
  const [secs, ms] = seconds.split(',');
  
  const totalSeconds = 
    parseInt(hours) * 3600 + 
    parseInt(minutes) * 60 + 
    parseInt(secs) + 
    parseInt(ms) / 1000;
    
  return Math.floor(totalSeconds * fps);
}

export function parseSRT(srtContent: string): Caption[] {
  const captions: Caption[] = [];
  const blocks = srtContent.trim().split('\n\n');
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;
    
    const index = parseInt(lines[0]);
    const [startTime, endTime] = lines[1].split(' --> ');
    const text = lines.slice(2).join('\n');
    
    captions.push({
      index,
      start: timeToFrames(startTime, 30), // assuming 30fps
      end: timeToFrames(endTime, 30),
      text
    });
  }
  
  return captions;
}

export function getCurrentCaption(frame: number, captions: Caption[]): string {
  const currentCaption = captions.find(
    caption => frame >= caption.start && frame <= caption.end
  );
  return currentCaption?.text || '';
} 