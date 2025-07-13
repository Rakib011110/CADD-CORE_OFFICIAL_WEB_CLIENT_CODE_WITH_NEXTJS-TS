"use client";

import React, { useEffect, useState } from "react";

interface CountdownProps {
  date: string; // Seminar Date (YYYY-MM-DD)
  time: string; // Seminar Time (HH:mm format like "21:00")
}

const Countdown: React.FC<CountdownProps> = ({ date, time }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const seminarDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      const difference = seminarDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Seminar time is coming soon 🎉");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [date, time]);

  return (
    <div className="inline-block bg-gray-950  text-white px-3 py-1 rounded-full text-xs  font-semibold shadow-md">
      {timeLeft}
    </div>
  );
};

export default Countdown;
