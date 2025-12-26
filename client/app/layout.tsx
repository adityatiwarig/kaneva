import { SocketProvider } from "./context/SocketProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
