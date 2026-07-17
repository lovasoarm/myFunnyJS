/**
 * Formats a duration in seconds into a human-readable string.
 * Supports hours, minutes, and seconds with zero-padding.
 * @param {number} seconds - The number of seconds to format.
 * @returns {string} A formatted duration string.
 */
function formatArenaTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n) => n.toString().padStart(2, '0');
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes || hours) parts.push(`${pad(minutes)}m`);
  parts.push(`${pad(secs)}s`);
  return parts.join(' ');
}
module.exports = { formatArenaTime };
