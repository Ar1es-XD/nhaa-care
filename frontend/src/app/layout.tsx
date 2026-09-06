import React from 'react';
import '../styles/globals.css';
import { GovHeader } from '../components/common/GovHeader';
import { Footer } from '../components/common/Footer';

export const metadata = {
  title: 'NHAA-Care | National Helpline Against Atrocities (14566)',
  description: 'AI-based Dynamic Mental Health Monitoring and Distress Prediction System under SC/ST (PoA) Act, 1989.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <div>
          <GovHeader />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
