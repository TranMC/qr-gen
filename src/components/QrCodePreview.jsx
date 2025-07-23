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
          <div className="qr-code-display" onClick={openLightbox}>
            <div style={{ width: '100%', height: '100%' }} />
            <div className="hover"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg> Preview</div>
          </div>
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
