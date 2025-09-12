import React from 'react';

/**
 * Компонент разделителя времени между сообщениями
 * props:
 *   ts: timestamp (number)
 */
const ChatTimeDivider = ({ ts }) => (
  <div className="text-center text-gray-400 text-xs my-2 select-none">
    {ts ? new Date(ts).toLocaleString() : ''}
  </div>
);

export default ChatTimeDivider;
