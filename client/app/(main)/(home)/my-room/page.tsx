// Enable React Server Components in Next.js
"use client";

// Import necessary hooks and components
import { useUser } from "@clerk/nextjs"; // Retrieves the authenticated user
import { useStreamVideoClient } from "@stream-io/video-react-sdk"; // Handles video call functionalities
import { useRouter } from "next/navigation"; // Enables client-side navigation in Next.js
import { Button } from "@/components/ui/button"; // Reusable button component
import Image from "next/image"; // Next.js component for optimized image rendering
import { toast } from "sonner";

// Define a PersonalMeetingInfo component to display meeting details
const PersonalMeetingInfo = ({ title, description }: { title: string; description: string }) => {
  return (
    // Flex container to align title and description
    <div className="flex flex-col items-start gap-2 xl:flex-row text-black">
      {/* Title of the field */}
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      {/* Description of the field with truncation for long text */}
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

// Define the main component for the personal meeting room page
const MyRoomPage = () => {
  const router = useRouter(); // Initialize the router for navigation
  const { user } = useUser(); // Retrieve the logged-in user
  const client = useStreamVideoClient(); // Get the Stream Video client instance
  
  const meetingId = user?.id; // Set the meeting ID to the user's ID

  // Function to start a personal meeting room
  const startRoom = async () => {
    if (!client || !user) return; // Ensure client and user exist

    // Create a new call instance using the user's ID
    const personalCall = client.call("default", meetingId!);
    await personalCall.getOrCreate({
      data: {
        starts_at: new Date().toISOString(), // Set the meeting start time
      },
    });

    router.push(`/meeting/${meetingId}`); // Navigate to the meeting page
  };

  // Generate the invite link for the meeting
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}`;

  return (
    // Page layout container
    <section className="flex size-full flex-col gap-10 text-white animate-fade-in">
      {/* Page title */}
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      
      {/* Meeting details PersonalMeetingInfo */}
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <PersonalMeetingInfo title="Topic" description={`${user?.firstName || user?.username || 'No Name Found'}'s Meeting Room`} />
        <PersonalMeetingInfo title="Meeting ID" description={meetingId!} />
        <PersonalMeetingInfo title="Invite Link" description={meetingLink} />
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-5">
        {/* Button to start the meeting */}
        <Button className="rounded bg-blue-700 p-4 hover:bg-blue-400 px-6" onClick={startRoom}>
          Start Meeting
        </Button>
        
        {/* Button to copy the invitation link */}
        <Button
          className="bg-gray-700"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink); // Copy link to clipboard
            toast("Link Copied",{
              duration: 3000,
              className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
            });
          }}
        >
          {/* Copy icon */}
          <Image src="/assets/copy.svg" alt="copy" width={20} height={20} />
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default MyRoomPage; // Export the component for use in the app