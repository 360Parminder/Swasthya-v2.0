export function getDayAndDate() {
  const date = new Date(); // 3 Feb 2025

  const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    day: dayName,
    date: datePart
  };
}

const result = getDayAndDate();
