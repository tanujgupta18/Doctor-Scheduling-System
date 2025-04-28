const { format, addDays, parseISO } = require("date-fns");

function generateAvailableSlots(doctor, booked = []) {
  const today = new Date();
  const result = [];
  const maxDays = 14; // show slots for next 2 weeks

  // Convert booked appointments to Set for quick lookup
  const bookedSet = new Set(booked.map((b) => `${b.date}_${b.time}`));

  // Weekday mapping
  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  for (let i = 0; i < maxDays; i++) {
    const currentDate = addDays(today, i);
    const dayName = format(currentDate, "EEEE"); // "Monday"
    const dateStr = format(currentDate, "yyyy-MM-dd");

    for (const rule of doctor.availability) {
      if (rule.type === "weekday" && rule.days.includes(dayName)) {
        for (const time of rule.slots) {
          const slotKey = `${dateStr}_${time}`;
          if (!bookedSet.has(slotKey)) {
            result.push({ date: dateStr, time });
          }
        }
      }

      if (rule.type === "daterange") {
        const from = parseISO(rule.from);
        const to = parseISO(rule.to);
        if (currentDate >= from && currentDate <= to) {
          for (const time of rule.slots) {
            const slotKey = `${dateStr}_${time}`;
            if (!bookedSet.has(slotKey)) {
              result.push({ date: dateStr, time });
            }
          }
        }
      }
    }
  }

  return result;
}

module.exports = { generateAvailableSlots };
