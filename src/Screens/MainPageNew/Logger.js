// Logger.js
import React, { useEffect, useState } from 'react';

const Logger = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    const updateLogs = (type, args) => {
      const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
      setLogs((prevLogs) => [...prevLogs, { type, message }]);
    };

    console.log = (...args) => {
      updateLogs('log', args);
      originalLog(...args);
    };

    console.error = (...args) => {
      updateLogs('error', args);
      originalError(...args);
    };

    return () => {
      console.log = originalLog; // Restore the original console.log
      console.error = originalError; // Restore the original console.error
    };
  }, []);

  return (
    <div>
      {logs.map((log, index) => (
        <p key={index} style={{ color: log.type === 'log' ? 'black' : 'red' }}>
          {log.message}
        </p>
      ))}
    </div>
  );
};

export default Logger;
