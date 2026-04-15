import type { Metadata } from "next";
import "./global.css";

const themeScript = `
  (() => {
    try {
      const storageKey = "oz.theme";
      const storedTheme = window.localStorage.getItem(storageKey);
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      const theme =
        storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemTheme;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
      document.documentElement.style.colorScheme = "light";
    }
  })();
`;

export const metadata: Metadata = {
  title: "OrlogoZarlaga",
  description: "Personal & Household Finance Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
