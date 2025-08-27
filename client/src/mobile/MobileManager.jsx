import React from 'react';
import MobileLayout from './MobileLayout';
import PushNotificationDemo from './PushNotificationDemo';

const MobileManager = ({ children }) => (
  <MobileLayout>
    <PushNotificationDemo />
    {children}
  </MobileLayout>
);

export default MobileManager;
