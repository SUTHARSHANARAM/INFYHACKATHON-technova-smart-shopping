import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AiAssistantDrawer } from '../ai/AiAssistantDrawer';

export const Layout: React.FC = () => {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Header onOpenAiDrawer={() => setAiDrawerOpen(true)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AiAssistantDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
    </div>
  );
};
