export function getFormattedRecordingTime(recordingTime) {
  const hours = String(Math.floor(recordingTime / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((recordingTime % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(recordingTime % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
