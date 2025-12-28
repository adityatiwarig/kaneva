'use client'

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [calls, setCalls] = useState<Call[]>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return;
            
            setIsLoading(true);
      
            try {
              const { calls } = await client.queryCalls({
                  sort: [{ field: 'starts_at', direction: -1 }],  // Sort by start time (latest first)
                  filter_conditions: {
                    starts_at: { $exists: true },  // Calls must have a start time
                    $or: [
                      { created_by_user_id: user.id },  // User is the creator
                      { members: { $in: [user.id] } },  // OR user is a member of the call
                    ],
                  },
                });
      
              setCalls(calls);
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          };

        loadCalls()
    }, [client, user?.id])

    const now = new Date();

    //   endedCalls: Calls that have either:
    // Started before the current time.
    // Have an endedAt timestamp (indicating the call has ended).
  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt
  })

//   upcomingCalls: Calls that start in the future.
  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now
  })
  // renaming the calls state when returning it from the hook.
  // then returning all types of calls
  return { endedCalls, upcomingCalls, callRecordings: calls , isLoading}



};