
'use server'

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamSecretKey = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();
    if (!user) throw new Error('User is not authenticated');
    if (!streamApiKey) throw new Error('Stream API key secret is missing');
    if (!streamSecretKey) throw new Error('Stream API secret is missing');

    const client = new StreamClient(streamApiKey, streamSecretKey);
    const userId: string = user.id;

    // token is valid for an hour
    const vailidity = 60 * 60;
    const token = client.generateUserToken(
        { 
          user_id: userId, 
          validity_in_seconds: vailidity 
        }
      );

      return token as string;
}
