// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-red-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-[#111] border border-zinc-800 shadow-xl p-6 sm:p-8">
        <SignIn
          appearance={{
            elements: {
              card: "bg-transparent shadow-none",
              headerTitle: "text-2xl font-semibold text-center text-white mb-1",
              headerSubtitle: "text-sm text-zinc-400 text-center mb-6",
              formFieldLabel: "text-sm text-zinc-300 mb-1",
              formFieldInput:
                "bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-red-500 focus:border-red-500 rounded-md px-3 py-2",
              formButtonPrimary:
                "bg-red-600 hover:bg-red-700 text-white font-medium py-2 mt-4 rounded-md transition",
              socialButtonsBlockButton:
                "bg-zinc-800 hover:bg-red-700 text-white border border-zinc-600 py-2 rounded-md",
              footerActionText: "text-zinc-400 text-sm mt-6",
              footerActionLink: "text-red-400 hover:text-red-300 underline",
            },
            variables: {
              colorPrimary: "#ef4444", // Red
              colorText: "#1a1a1a",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              borderRadius: "8px",
            },
          }}
        />
      </div>
    </div>
  );
};