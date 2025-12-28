"use client";

import { useUser } from "@clerk/nextjs";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
import Loading from "@/components/Loading";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

type StreamProviderProps = {
  children: ReactNode;
};

const StreamProvider = ({ children }: StreamProviderProps) => {
  const { user, isLoaded } = useUser();
  const [videoClient, setVideoClient] =
    useState<StreamVideoClient | null>(null);

  const tokenProvider = async () => {
  const res = await fetch("/api/stream/token", {
    method: "GET",
    credentials: "include", // ⭐ MOST IMPORTANT
    cache: "no-store",      // ⭐ Stream ke liye recommended
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Token fetch failed:", text);
    throw new Error("Failed to fetch Stream token");
  }

  const data = await res.json();
  return data.token;
};


  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error("Stream API key missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user.id,
        name: user.firstName || user.username || "User",
        image: user.imageUrl,
      },
      tokenProvider,
    });

    setVideoClient(client);

    return () => {
      client.disconnectUser();
      setVideoClient(null);
    };
  }, [user, isLoaded]);

  if (!videoClient) return <Loading />;

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};

export default StreamProvider;
