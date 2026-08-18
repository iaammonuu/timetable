import { TimetableClass, DayOfWeek, Subject } from '../types';

/**
 * Maps day string to RFC 5545 2-letter day code
 */
const DAY_TO_ICS_CODE: Record<DayOfWeek, string> = {
  Monday: 'MO',
  Tuesday: 'TU',
  Wednesday: 'WE',
  Thursday: 'TH',
  Friday: 'FR',
  Saturday: 'SA',
  Sunday: 'SU',
};

const DAY_TO_INDEX: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Format a Date object to ICS local timestamp string: YYYYMMDDTHHmmss
 */
function formatICSTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escape text for ICS format (RFC 5545)
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Find the next upcoming date matching the specified day of week
 */
function getNextDateForDay(day: DayOfWeek, startDate: Date = new Date()): Date {
  const targetDayIndex = DAY_TO_INDEX[day];
  const currentDayIndex = startDate.getDay();
  const result = new Date(startDate);

  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  result.setDate(startDate.getDate() + daysToAdd);
  return result;
}

export interface ICSExportOptions {
  batch?: string;
  semester?: string;
  studentName?: string;
  startDate?: Date; // Semester start date
  endDate?: Date;   // Semester end date
  selectedSubjectIds?: string[];
  selectedTypes?: string[];
  reminderMinutes?: number; // Alarm before class
}

/**
 * Generates standard RFC 5545 .ics calendar content
 */
export function generateTimetableICS(
  classes: TimetableClass[],
  subjects: Subject[],
  options: ICSExportOptions = {}
): string {
  const {
    batch = '25CAIBTCSB52',
    semester = 'III',
    studentName = 'Student',
    startDate = new Date(),
    endDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // ~16 weeks semester duration
    selectedSubjectIds,
    selectedTypes,
    reminderMinutes = 10,
  } = options;

  // Filter classes if options provided
  const filteredClasses = classes.filter((c) => {
    if (selectedSubjectIds && selectedSubjectIds.length > 0 && !selectedSubjectIds.includes(c.subjectId)) {
      return false;
    }
    if (selectedTypes && selectedTypes.length > 0 && !selectedTypes.includes(c.type)) {
      return false;
    }
    return true;
  });

  const nowTimestamp = formatICSTime(new Date()) + 'Z';
  const untilTimestamp = formatICSTime(endDate) + 'Z';

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudyOS//Student Academic Timetable Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:StudyOS Timetable (${batch} Sem ${semester})`,
    `X-WR-CALDESC:Academic class schedule and room directory for Batch ${batch}, Semester ${semester}`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  filteredClasses.forEach((c) => {
    const subject = subjects.find((s) => s.id === c.subjectId);
    const subjectCode = subject ? subject.code : '';
    const subjectName = subject ? subject.name : c.subjectName;

    // Parse start and end time (e.g. "09:30" and "10:30")
    const [startH, startM] = c.startTime.split(':').map(Number);
    const [endH, endM] = c.endTime.split(':').map(Number);

    // Compute first event date matching day of week
    const firstEventDate = getNextDateForDay(c.day, startDate);

    const eventStart = new Date(firstEventDate);
    eventStart.setHours(startH, startM, 0, 0);

    const eventEnd = new Date(firstEventDate);
    eventEnd.setHours(endH, endM, 0, 0);

    const dtStart = formatICSTime(eventStart);
    const dtEnd = formatICSTime(eventEnd);
    const byDay = DAY_TO_ICS_CODE[c.day] || 'MO';

    const uid = `studyos-${c.id}-${batch}-${c.day.toLowerCase()}@studyos.app`;
    const summary = `[${c.type.toUpperCase()}] ${subjectName} (${subjectCode || c.type})`;
    const location = c.room ? `Room: ${c.room}` : 'Venue TBA';

    let descriptionLines = [
      `📚 Subject: ${subjectName} (${subjectCode})`,
      `📍 Room / Lab: ${c.room || 'TBA'}`,
      `🏫 Type: ${c.type}`,
      `🎓 Batch: ${batch} | Semester ${semester}`,
    ];
    if (c.faculty) {
      descriptionLines.push(`👨‍🏫 Faculty: ${c.faculty}`);
    }
    if (c.notes) {
      descriptionLines.push(`📝 Notes: ${c.notes}`);
    }
    descriptionLines.push(`⚡ Synced via StudyOS Academic Dashboard`);

    const description = escapeICSText(descriptionLines.join('\n'));

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${uid}`);
    ics.push(`DTSTAMP:${nowTimestamp}`);
    ics.push(`DTSTART:${dtStart}`);
    ics.push(`DTEND:${dtEnd}`);
    ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${untilTimestamp}`);
    ics.push(`SUMMARY:${escapeICSText(summary)}`);
    ics.push(`LOCATION:${escapeICSText(location)}`);
    ics.push(`DESCRIPTION:${description}`);
    ics.push('STATUS:CONFIRMED');
    ics.push('TRANSP:OPAQUE');
    ics.push('SEQUENCE:0');

    // Add reminder alarm
    if (reminderMinutes > 0) {
      ics.push('BEGIN:VALARM');
      ics.push(`TRIGGER:-PT${reminderMinutes}M`);
      ics.push('ACTION:DISPLAY');
      ics.push(`DESCRIPTION:Reminder: ${summary} in ${c.room || 'class'}`);
      ics.push('END:VALARM');
    }

    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');

  return ics.join('\r\n');
}

/**
 * Triggers a client-side file download of the generated .ics file
 */
export function downloadICSFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an instant 1-click Google Calendar web link for an individual class
 */
export function getSingleClassGoogleCalendarUrl(
  c: TimetableClass,
  subject?: Subject,
  batch = '25CAIBTCSB52',
  targetDate: Date = new Date()
): string {
  const nextDate = getNextDateForDay(c.day, targetDate);
  const [startH, startM] = c.startTime.split(':').map(Number);
  const [endH, endM] = c.endTime.split(':').map(Number);

  const start = new Date(nextDate);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(nextDate);
  end.setHours(endH, endM, 0, 0);

  const formatGCalDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  const title = `[${c.type.toUpperCase()}] ${subject?.name || c.subjectName} (${subject?.code || ''})`;
  const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  const location = c.room ? `Room ${c.room}` : 'Classroom';
  
  let details = `Subject: ${subject?.name || c.subjectName}\nRoom: ${c.room || 'TBA'}\nType: ${c.type}\nBatch: ${batch}`;
  if (c.faculty) details += `\nFaculty: ${c.faculty}`;
  if (c.notes) details += `\nNotes: ${c.notes}`;
  details += `\n\nExported from StudyOS`;

  const recurrence = `RRULE:FREQ=WEEKLY;BYDAY=${DAY_TO_ICS_CODE[c.day]}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: dates,
    location: location,
    details: details,
    recur: recurrence,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
