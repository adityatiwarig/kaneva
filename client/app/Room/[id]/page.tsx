"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { getPeer } from "@/app/service/peer";
import { useSocket } from "@/app/context/SocketProvider";
import { Socket } from "socket.io-client";

/* ---------- Types ---------- */

interface UserJoinedPayload {
  email: string;
  id: string;
}

interface IncomingCallPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}

interface CallAcceptedPayload {
  from: string;
  ans: RTCSessionDescriptionInit;
}

interface NegoNeededPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}

interface NegoFinalPayload {
  ans: RTCSessionDescriptionInit;
}

/* ---------- Component ---------- */

const RoomPage: React.FC = () => {
  const socket = useSocket() as Socket;

  // ✅ SAME LOGIC: bas getPeer use kiya
  const peer = getPeer();
  if (!peer) return null;

  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  /* ---------- user joined ---------- */
  const handleUserJoined = useCallback(
    ({ email, id }: UserJoinedPayload) => {
      console.log(`Email ${email} joined room`);
      setRemoteSocketId(id);
    },
    []
  );

  /* ---------- call user ---------- */
  const handleCallUser = useCallback(async () => {
    if (!remoteSocketId) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket, peer]);

  /* ---------- incoming call ---------- */
  const handleIncomingCall = useCallback(
    async ({ from, offer }: IncomingCallPayload) => {
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyStream(stream);
      console.log("Incoming Call", from);

      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket, peer]
  );

  /* ---------- send tracks ---------- */
  const sendStreams = useCallback(() => {
    if (!myStream) return;

    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream, peer]);

  /* ---------- call accepted ---------- */
  const handleCallAccepted = useCallback(
    ({ ans }: CallAcceptedPayload) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams, peer]
  );

  /* ---------- negotiation needed ---------- */
  const handleNegoNeeded = useCallback(async () => {
    if (!remoteSocketId) return;

    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket, peer]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded, peer]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }: NegoNeededPayload) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket, peer]
  );

  const handleNegoNeedFinal = useCallback(
    async ({ ans }: NegoFinalPayload) => {
      await peer.setLocalDescription(ans);
    },
    [peer]
  );

  /* ---------- remote stream ---------- */
  useEffect(() => {
    const handleTrack = (ev: RTCTrackEvent) => {
      const streams = ev.streams;
      setRemoteStream(streams[0]);
    };

    peer.peer.addEventListener("track", handleTrack);
    return () => {
      peer.peer.removeEventListener("track", handleTrack);
    };
  }, [peer]);

  /* ---------- attach streams ---------- */
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  /* ---------- socket listeners ---------- */
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
  ]);

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Room Page</h1>

      <h4 className="mb-4">
        {remoteSocketId ? "✅ Connected" : "❌ No one in room"}
      </h4>

      <div className="flex gap-4 mb-6">
        {myStream && (
          <button
            onClick={sendStreams}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          >
            Send Stream
          </button>
        )}

        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Call User
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl">
        {myStream && (
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-72 rounded-lg object-cover"
          />
        )}

        {remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-72 rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default RoomPage;
