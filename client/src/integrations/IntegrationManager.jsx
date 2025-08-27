import React from 'react';
import EmailIntegration from './EmailIntegration';
import SmsIntegration from './SmsIntegration';

const IntegrationManager = () => (
  <div>
    <h2>Интеграции</h2>
    <EmailIntegration />
    <SmsIntegration />
  </div>
);

export default IntegrationManager;
