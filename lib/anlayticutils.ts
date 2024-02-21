import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  subMonths,
  subYears,
  set,
} from "date-fns";

export function displayCustomDateFormatter(customDate: any): string {
  console.log("displayCustomDateFormatter");
  function formatDate(date: Date): string {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    return `${monthNames[monthIndex]} ${day}${suffix}`;
  }

  if (customDate?.to) {
    return (
      formatDate(new Date(customDate?.from)) +
      " - " +
      formatDate(new Date(customDate?.to))
    );
  } else {
    return formatDate(new Date(customDate?.from));
  }
}

export function percentageFormatter(value1: number, value2: number | null) {
  console.log("percentageFormatter");
  if (value2 === 0 || value2 === null) {
    const roundedPercentage = Math.trunc(Math.round(value1 * 100));
    if (roundedPercentage == Infinity || Number.isNaN(roundedPercentage)) {
      return "0%";
    }

    return `${roundedPercentage}%`;
  } else {
    const percentageChange = ((value1 - value2) / value2) * 100;

    const roundedPercentage = Math.trunc(
      Math.round(percentageChange * 100) / 100
    );
    if (roundedPercentage == Infinity || NaN) {
      return "0%";
    }

    return `${roundedPercentage}%`;
  }
}

export function convertISOToTimestampTZ(date: Date | undefined): string {
  console.log("formatDateToCustomFormat");

  const ISOdate = new Date(date?.toISOString() || "");

  // Extract date components
  const year = ISOdate.getUTCFullYear();
  const month = String(ISOdate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(ISOdate.getUTCDate()).padStart(2, "0");
  const hours = String(ISOdate.getUTCHours()).padStart(2, "0");
  const minutes = String(ISOdate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(ISOdate.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(ISOdate.getUTCMilliseconds())
    .padStart(6, "0")
    .substr(0, 6); // taking up to 6 digits

  // Concatenate into custom format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
}

/**
 *
 * @param selected  The term representing the currently selected date relative to a specific time range.
 *                  Expected values are "This" or "Last". Any other value will be returned as is.
 * @returns   A string representing the formatted date range. If the `selected` term and `timeRange` match known patterns,
 *            returns a concatenated string (e.g., "This Week"). Otherwise, returns the original `selected` term.
 */
export function dateWordFormatter(selected: string, timeRange: string) {
  //   console.log("dateWordFormatter", selected, timeRange);

  const timeMappings: { [key: string]: { [key: string]: string } } = {
    Day: { This: "Today", Last: "Yesterday" },
    Week: { This: "This Week", Last: "Last Week" },
    Month: { This: "This Month", Last: "Last Month" },
    Year: { This: "This Year", Last: "Last Year" },
  };

  if (Object.keys(timeMappings).includes(timeRange)) {
    return timeMappings[timeRange][selected];
  } else {
    return selected;
  }
}

/**
 *
 * @param date  The date to be formatted, either "This", "Last" or "Custom", and formatting using the timeRange as context
 * @returns   An object containing the start and end date of the formatted date
 */
export function formattingDates(date: string, timeRange: string) {
  console.log("formattingDates", date);
  switch (dateWordFormatter(date, timeRange)) {
    case "Today":
      return { start: startOfDay(new Date()), end: endOfDay(new Date()) };
    case "Yesterday":
      return {
        start: startOfDay(subDays(new Date(), 1)),
        end: endOfDay(subDays(new Date(), 1)),
      };
    case "This Week":
      return { start: startOfWeek(new Date()), end: endOfWeek(new Date()) };
    case "Last Week":
      return {
        start: startOfWeek(subDays(new Date(), 7)),
        end: endOfWeek(subDays(new Date(), 7)),
      };
    case "This Month":
      return { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
    case "Last Month":
      return {
        start: startOfMonth(subMonths(new Date(), 1)),
        end: endOfMonth(subMonths(new Date(), 1)),
      };
    case "This Year":
      return {
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      };
    case "Last Year":
      return {
        start: startOfYear(subYears(new Date(), 1)),
        end: endOfYear(subYears(new Date(), 1)),
      };
    default:
      return { start: startOfDay(new Date()), end: endOfDay(new Date()) };
  }
}
