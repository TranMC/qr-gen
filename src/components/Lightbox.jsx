import React from 'react';

const Lightbox = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Nút đóng ở góc trên bên phải */}
      <button
        className="control-btn close-btn"
        style={{
          position: 'fixed',
          top: 32,
          right: 32,
          zIndex: 1100,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          fontSize: 28,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
        onClick={onClose}
        aria-label="Close preview"
      >
        ×
      </button>
      {/* QR code hiển thị ở giữa, không nền trắng */}
      <div
        className="lightbox-qr-display"
        style={{
          background: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Lightbox; 