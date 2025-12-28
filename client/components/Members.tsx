'use client'

import { cn } from "@/lib/utils" // Utility function for conditional class names
import { Call } from "@stream-io/video-react-sdk" // Importing Call type from Stream SDK
import Image from "next/image" // Next.js Image component for optimized images
import { useEffect, useState } from "react" // React hooks for state and effects

// Interface for component props
type MembersProps = {
    call: Call // Expects a Call object from Stream SDK
}

// Members component to display meeting participants
const Members = ({ call }: MembersProps) => {
    if(!call) return // If no call is provided, return nothing
    
    const [callMembers, setCallMembers] = useState<any[]>([]) // State to store call members
    
    useEffect(() => {
        const getMembers = async () => {
            const members = await call.queryMembers() // Fetching call members
            setCallMembers(members.members) // Updating state with members
        }
        getMembers()
    }, []) // Runs once when component mounts
    
    // If there are members in the call, render their avatars
    if(callMembers.length > 0) {
        return (
            <div className="relative flex w-full">
              {callMembers.map((member, index) => {
                const user = member.user // Extract user details from member object
                return (
                    <Image
                      key={user.id} // Unique key for React list rendering
                      src={user.image} // User avatar image
                      alt="attendees"
                      width={40} // Image width
                      height={40} // Image height
                      className={cn("rounded-full", { absolute: index > 0 })} // First image is static, others are positioned
                      style={{ top: 0, left: index * 28 }} // Position images in a stacked manner
                    />
                  )
              })}
              
              {/* Show the total number of participants */}
              <div className="flex justify-center items-center absolute left-[136px] size-10 rounded-full border-[5px] border-gray-800 bg-gray-800 text-white shadow-2xl">
                {callMembers.length}
              </div>
            </div>
        )
    }
}

export default Members;