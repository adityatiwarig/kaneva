'use client'

import { useEffect, useState } from "react";

const DateAndTime = () => {
    const [time, setTime] = useState(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      });

    const [date, setDate] = useState(() => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);
    });

    
    useEffect(() => {
        const intervalId = setInterval(() => {
          const now = new Date();
          setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'}));
          setDate(new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now));

        }, 1000); // Update every 1 sec
    
        return () => clearInterval(intervalId); // Clean up on component unmount
      }, []);
    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
        </div>
    )
}

export default DateAndTime;