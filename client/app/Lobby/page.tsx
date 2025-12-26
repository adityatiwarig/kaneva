"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../context/SocketProvider";
import { Mail, KeyRound } from "lucide-react";

const LobbyScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const router = useRouter();

  /* ---------- SUBMIT FORM ---------- */
  const handleSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email || !room || !socket) return;

      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  /* ---------- AFTER ROOM JOIN ---------- */
  const handleJoinRoom = useCallback(
    (data: { room: string }) => {
      router.push(`/Room/${data.room}`);
    },
    [router]
  );

  /* ---------- SOCKET LISTENER ---------- */
  useEffect(() => {
    if (!socket) return;

    // 🔥 FIXED EVENT NAME
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10">

        {/* Glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 opacity-30 blur-lg"></div>

        <div className="relative">
          <h1 className="text-4xl font-extrabold text-center text-white mb-2">
            🚀 Join a Room
          </h1>
          <p className="text-center text-white/80 mb-8 text-sm">
            Enter details to start your meeting
          </p>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-white text-sm mb-1 block">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-white/20 px-4 py-3 rounded-xl border border-white/30 focus-within:ring-2 focus-within:ring-pink-400 transition">
                <Mail className="text-white/70" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent text-white placeholder-white/60 w-full outline-none"
                />
              </div>
            </div>

            {/* Room */}
            <div>
              <label className="text-white text-sm mb-1 block">
                Room ID
              </label>
              <div className="flex items-center gap-3 bg-white/20 px-4 py-3 rounded-xl border border-white/30 focus-within:ring-2 focus-within:ring-pink-400 transition">
                <KeyRound className="text-white/70" size={20} />
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Enter room code"
                  className="bg-transparent text-white placeholder-white/60 w-full outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={!email || !room}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white font-semibold shadow-lg hover:scale-[1.04] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔑 Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;
