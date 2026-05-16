import './globals.css';

export const metadata = {
  title: 'OpenAI LLM vs RAG vs Agent Demo',
  description: 'A local learning project using Next.js and OpenAI'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}