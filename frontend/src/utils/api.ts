export async function markAttendance(rollNumber: string, manual = false) {
  const res = await fetch('http://localhost:5000/attendance/mark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roll_number: rollNumber, manual }),
  });
  return res.json();
}

export async function getStats(rollNumber: string) {
  const res = await fetch(`http://localhost:5000/attendance/stats/${rollNumber}`);
  return res.json();
}

export async function manualAttendance(rollNumber: string, code: string) {
  const res = await fetch('http://localhost:5000/attendance/manual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roll_number: rollNumber, code }),
  });
  return res.json();
}