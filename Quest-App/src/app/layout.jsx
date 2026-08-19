import "./globals.css";

export const metadata = {
  title: "Quest — Gamified Task Planner",
  description: "Turn your to-do list into a game.",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quest",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-quest-bg">{children}</body>
    </html>
  );
}
