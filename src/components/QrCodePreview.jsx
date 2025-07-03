import React from 'react';

const QrCodePreview = ({
  qrRef,
  showQR,
  openLightbox,
  resetQR,
  size,
  setSize,
  createQRCode,
  copyQR,
  downloadQR,
}) => {
  return (
    <div className="qr-preview-section">
      <div className="qr-display-container">
        {showQR && (
          <div ref={qrRef} className="qr-code-display" onClick={openLightbox} />
        )}
        <button className="reset-qr-btn" onClick={resetQR}>Reset</button>
      </div>
      
      <div className="size-control-section">
        <h3>Pick your size</h3>
        <div className="size-slider-wrapper">
          <span className="size-label">Low quality</span>
          <input 
            type="range" 
            min="64" 
            max="1024" 
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="size-slider"
          />
          <span className="size-label">High quality</span>
        </div>
        <div className="size-display-text">{size} x {size} px</div>
      </div>
      <div className="action-buttons-group">
        <button onClick={createQRCode} className="create-qr-btn">
          Create QR Code                
        </button>
        <button onClick={copyQR} className="copy-qr-btn">
          📋 Copy QR Code
        </button>
        <button onClick={downloadQR} className="download-qr-btn">
          Download ({size}x{size}px)
        </button>
      </div>
    </div>
  );
};

export default QrCodePreview;
