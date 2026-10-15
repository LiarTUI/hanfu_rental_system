function getTextRenderWidth(
  text: string,
  font = '16px sans-serif',
  letterSpacing = 0,
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const spaceWidth = (text.length - 1) * letterSpacing;
  return metrics.width + spaceWidth;
}
export { getTextRenderWidth };
