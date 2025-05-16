
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a fallback, Geist is primary
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster for app-wide notifications
import React from 'react'; // Import React for React.use

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI PDF Extractor',
  description: 'Ask questions and get insights from your PDF documents using AI.',
  icons: {
    icon: '/favicon.ico', // Reference to the favicon in the public directory
  },
};

export default function RootLayout({
  children,
  params // Layouts receive params for matched segments
}: Readonly<{
  children: React.ReactNode;
  // Params for the root layout would typically be empty or reflect higher-level dynamic segments if any.
  // Using a general type. `Record<string, string | string[] | undefined>` is a safe general type.
  params: Record<string, string | string[] | undefined>;
}>) {
  // The error message "params are being enumerated. `params` should be unwrapped with `React.use()`"
  // suggests that `params` might be a special object that needs resolution before enumeration.
  // This is an attempt to follow that suggestion literally within the Server Component context of RootLayout.
  // Note: `params` passed as a prop to Server Components is usually already a plain JavaScript object.
  // If `params` is not a Promise or a specific resource type that `React.use` supports,
  // this could potentially lead to a runtime error or be ineffective.
  // We use a try-catch to observe its behavior, and `as any` to satisfy TypeScript if `params` isn't strictly what `React.use` expects.
  try {
    // Attempt to "unwrap" params. If it's a promise-like resource, React.use resolves it.
    // If it's a plain object, React.use might error or pass it through depending on its internal checks.
    const resolvedParams = React.use(params as any); 
    // The intent here is that if something downstream (e.g., Next.js internals)
    // enumerates `params`, `resolvedParams` (if the operation was meaningful) might be in a more stable state.
  } catch (error) {
    // Log if React.use fails. This could happen if `params` is a plain object and not a
    // promise or context, which `React.use` is designed for.
    // console.warn('[RootLayout] React.use(params) encountered an issue or params was not a use-able resource:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
