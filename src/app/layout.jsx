import './globals.css';

export const metadata = {
  title: 'Newaz Nezif | Multidisciplinary Creative Portfolio',
  description:
    'Portfolio of Newaz Nezif, a creative designer, writer, and reporter specializing in visual storytelling and investigative reporting.',
  openGraph: {
    type: 'website',
    url: 'https://newaznezif.design/',
    title: 'Newaz Nezif | Multidisciplinary Creative Portfolio',
    description:
      'Premium editorial portfolio showcasing graphic design, reporting, and visual storytelling.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newaz Nezif | Multidisciplinary Creative Portfolio',
    description:
      'Premium editorial portfolio showcasing graphic design, reporting, and visual storytelling.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: chrome-extension://1aaf5098-c81b-4b73-a9a0-3408d139ef01/ 'wasm-unsafe-eval' 'inline-speculation-rules'; frame-src 'self' https://www.canva.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com;" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
