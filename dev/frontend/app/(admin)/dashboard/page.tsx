"use client"

import React from 'react';
import UserInterface from '@/app/components/UserInterface';

const Home: React.FC = () => {
  return (
    <div>
      <UserInterface backendName="flask" />
    </div>
  );
}

export default Home;