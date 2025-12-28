// Enable the "use client" directive to indicate this is a client component in Next.js
'use client'

// Import the Next.js Image component for optimized image rendering
import Image from "next/image"

// Import the DateAndTime component from the components directory
import DateAndTime from "@/components/DateAndTime";

// Import the custom hook useGetCalls to fetch upcoming calls
import { useGetCalls } from "@/hooks/useGetCalls";


const StatusBar = () => {

  // Destructure the upcomingCalls property from the useGetCalls hook
  // If the hook returns null/undefined, provide a default empty array
  const { upcomingCalls } = useGetCalls() || { upcomingCalls: [] };

  // Find the nearest upcoming call by:
  // 1. Filtering calls that have a valid start time
  // 2. Sorting them by the earliest start time
  // 3. Selecting the first (earliest) call from the sorted list
  const nearestUpcomingCall = upcomingCalls
    ?.filter(call => call?.state?.startsAt)
    .sort((a, b) => new Date(a.state.startsAt!).getTime() - new Date(b.state.startsAt!).getTime())[0];

  // Extract the start time of the nearest upcoming call
  const startsAt = nearestUpcomingCall?.state?.startsAt;

  // Format the start time as a localized date string, or show "No upcoming meetings" if none exist
  const formattedDate = startsAt ? new Date(startsAt).toLocaleString() : "No upcoming meetings"

  // If no upcoming meetings exist, render a section displaying a message and an image
  if (formattedDate === "No upcoming meetings") {
    return (
      <section className="flex flex-col gap-5 text-black items-center md:items-start">
          {}
          <h2 className="bg-blue-100 max-w-[273px] rounded-2xl p-4 text-center text-base font-light">
          No Upcoming Meetings
          </h2>
          {/* Render the DateAndTime component */}
          <DateAndTime/>
          {/* Display home image */}
          <Image 
            src='/assets/home-image.svg' 
            width={400} 
            height={400} 
            alt="home image" 
            className="max-md:hidden -ml-16"
          />
      </section>
    )
  }
  
  // Render the section when there is an upcoming meeting
  return (
    <section className="flex flex-col gap-5 text-black items-center md:items-start">
      {/* Display the upcoming meeting time */}
      <h2 className="bg-blue-100 max-w-[273px] rounded-2xl p-4 text-center text-base font-light">
        Upcoming Meeting at:
        <p className="text-lg font-semibold text-gray-800">{formattedDate}</p>
      </h2>
      {/* Render the DateAndTime component */}
      <DateAndTime/>
      {/* Display an image with specific styles */}
      <Image 
        src='/assets/home-image.svg' 
        width={400} 
        height={400} 
        alt="home image" 
        className="max-md:hidden -ml-16"
      />
    </section>
  )
}

// Export the StatusBar component as the default export
export default StatusBar;