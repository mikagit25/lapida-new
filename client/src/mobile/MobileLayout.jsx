import React from 'react';
import MobileNav from './MobileNav';

const MobileLayout = ({ children }) => (
  <div className="mobile-layout">
    <MobileNav />
    <main>{children}</main>
  </div>
);

export default MobileLayout;
