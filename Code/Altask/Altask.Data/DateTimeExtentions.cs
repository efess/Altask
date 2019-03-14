using System;

public static class DateTimeExtensions {
	public static DateTime StartOfWeek(this DateTime date, DayOfWeek weekStartsOn = DayOfWeek.Sunday) {
		return date.AddDays(-(int)date.DayOfWeek + (int)weekStartsOn);
	}

	public static DateTime StartOfMonth(this DateTime date) {
		return new DateTime(date.Year, date.Month, 1);
	}

	public static int WeekInMonth(this DateTime date, DayOfWeek weekStartsOn = DayOfWeek.Sunday) {
		var weekCount = 1;
		var monthDate = date.StartOfMonth();

		if (monthDate.DayOfWeek == weekStartsOn && monthDate == date) {
			return weekCount;
		}

		do {
			monthDate = monthDate.AddDays(1);

			if (monthDate == date) {
				return weekCount;
			}

			if (monthDate.DayOfWeek == weekStartsOn) {
				weekCount++;
			}
		} while (monthDate <= date);

		return 0;
	}

	public static int WeeksInMonth(this DateTime date, DayOfWeek weekStartsOn = DayOfWeek.Sunday) {
		var weekCount = 1;
		var monthDate = date.StartOfMonth();

		if (monthDate.DayOfWeek == weekStartsOn) {
			monthDate = monthDate.AddDays(1);
		}

		while (monthDate.Month == date.Month) {
			if (monthDate.DayOfWeek == weekStartsOn) {
				weekCount++;
			}

			monthDate = monthDate.AddDays(1);
		}

		return weekCount;
	}
}