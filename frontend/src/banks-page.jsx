import React from 'react';

function CreditCardsPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        textAlign: 'center',
        backgroundColor: 'white', // Light background color
      }}
    >
      <h1
        style={{
          fontSize: '3rem', // Larger font size
          fontWeight: 'bold', // Bold text
          color: '#4a90e2', // Soothing blue color
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Slight shadow for depth
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Modern font
          letterSpacing: '1px', // Spacing between letters
        }}
      >
        Hello Bank Page
      </h1>
    </div>
  );
}

export default CreditCardsPage;
