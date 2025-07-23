import React, { useState, useRef, useEffect } from 'react';

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
  downloadFormat,
  setDownloadFormat,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleDownloadClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleFormatSelect = (format) => {
    setDownloadFormat(format);
    setShowDropdown(false);
    downloadQR(format);
  };

  return (
    <div className="qr-preview-section">
      <div className="qr-display-container">
        {showQR && (
          <div ref={qrRef} className="qr-code-display" onClick={openLightbox}></div>
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
      <div className="action-buttons-group" style={{ position: 'relative' }}>
        <button onClick={createQRCode} className="create-qr-btn">
          Create QR Code                
        </button>
        <button onClick={handleDownloadClick} className="download-qr-btn">
          Download ▼
        </button>
        {showDropdown && (
          <div ref={dropdownRef} className="download-dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 10, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ padding: '8px 0', minWidth: 120 }}>
              <div className="dropdown-item" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleFormatSelect('png')}>PNG</div>
              <div className="dropdown-item" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleFormatSelect('svg')}>SVG</div>
              <div className="dropdown-item" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleFormatSelect('jpg')}>JPG</div>
              <div className="dropdown-item" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleFormatSelect('pdf')}>PDF</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodePreview;
