import { useState, useEffect } from 'react';

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

interface UseDaysReturn {
  timeElapsed: TimeElapsed;
  getFormattedString: () => string;
  getYearsOnly: () => string;
  getMonthsOnly: () => string;
  getDaysOnly: () => string;
}

const START_DATE = new Date('2008-02-06');

export const useDays = (): UseDaysReturn => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
  });

  const calculateTimeElapsed = (): TimeElapsed => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - START_DATE.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate years, months, and days
    let years = 0;
    let months = 0;
    let days = 0;

    // Simple calculation - can be refined for more accuracy
    years = Math.floor(totalDays / 365);
    const remainingDaysAfterYears = totalDays % 365;
    months = Math.floor(remainingDaysAfterYears / 30);
    days = remainingDaysAfterYears % 30;

    return {
      years,
      months,
      days,
      totalDays,
    };
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeElapsed(calculateTimeElapsed());
    };

    // Update immediately
    updateTime();

    // Update every day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      updateTime();
      // Set up daily updates
      setInterval(updateTime, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const getFormattedString = (): string => {
    const { years, months, days } = timeElapsed;
    const parts = [];
    
    if (years > 0) {
      parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    }
    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    }
    
    return parts.join(' ');
  };

  const getYearsOnly = (): string => {
    return `${timeElapsed.years} year${timeElapsed.years !== 1 ? 's' : ''}`;
  };

  const getMonthsOnly = (): string => {
    return `${timeElapsed.months} month${timeElapsed.months !== 1 ? 's' : ''}`;
  };

  const getDaysOnly = (): string => {
    return `${timeElapsed.days} day${timeElapsed.days !== 1 ? 's' : ''}`;
  };

  return {
    timeElapsed,
    getFormattedString,
    getYearsOnly,
    getMonthsOnly,
    getDaysOnly,
  };
}; 