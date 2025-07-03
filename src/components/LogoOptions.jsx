import React from 'react';

const LogoOptions = () => {
  return (
    <div className="content-wrapper">
      <div className="logo-upload-section">
        <div className="logo-upload-header">
          <strong>Upload your custom logo image</strong>
        </div>
        
        <div className="upload-container">
          <input
            type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
            style={{ display: 'none' }}
            id="logoInput"
          />
          <div className="upload-area" onClick={() => document.getElementById('logoInput').click()}>
            <div className="upload-placeholder">
              <div className="upload-icon">📤</div>
              <div>Upload</div>
            </div>
          </div>
        </div>
        
        <div className="upload-info">
          <p>Accepted formats: .svg, .png, .jpg, .jpeg, .gif. Max image size: 3Mb</p>
        </div>
        
        <div className="predefined-logos-section">
          <div className="predefined-header">
            <strong>or Choose one of the following samples</strong>
          </div>
          <div className="logo-list">
            <div className="icon-box" title="Facebook">📘</div>
            <div className="icon-box" title="Instagram">📷</div>
            <div className="icon-box" title="Twitter">🐦</div>
            <div className="icon-box" title="LinkedIn">💼</div>
            <div className="icon-box" title="YouTube">📺</div>
            <div className="icon-box" title="Pinterest">📌</div>
          </div>
          
          <button type="button" className="clear-logo-btn">
            Clear logo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoOptions;
