/**
 * Formats seconds into M:SS format
 * @param seconds Total seconds to format
 * @returns Formatted string in M:SS format (e.g., "2:00" or "0:45")
 */
export const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};