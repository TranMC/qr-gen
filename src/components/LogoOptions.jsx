import React, { useRef, useState } from 'react';
import FacebookLogo from '../assets/facebook.svg';
import InstagramLogo from '../assets/instagram.svg';
import TwitterLogo from '../assets/twitter.svg';
import LinkedInLogo from '../assets/linkedin.svg';
import YouTubeLogo from '../assets/youtube.svg';
import PinterestLogo from '../assets/pinterest.svg';
import Upload from '../assets/upload.svg';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const LogoOptions = () => {
  const [logo, setLogo] = useState(null); // URL preview
  const [logoFile, setLogoFile] = useState(null); // file gốc
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 3 * 1024 * 1024) {
      const url = URL.createObjectURL(file);
      setLogo(url);
      setLogoFile(file);
    } else {
      alert('File quá lớn hoặc không hợp lệ!');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleClearLogo = () => {
    setLogo(null);
    setLogoFile(null);
    fileInputRef.current.value = '';
  };

  const handleSampleLogo = (logoUrl) => {
    setLogo(logoUrl);
    setLogoFile(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="content-wrapper">
      <div className="logo-upload-section">
        <div className="logo-upload-header">
          <strong>Upload your custom logo image</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="upload-container">
          <input
            type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
            style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
          />
            <div className="upload-area" onClick={handleUploadClick} style={{ minWidth: 110 }}>
            <div className="upload-placeholder">
              <div className="upload-icon"><img src={Upload} alt="Upload Icon" /></div>
              <div>Upload</div>
            </div>
          </div>
        </div>
          {logo && (
            <PhotoProvider>
              <PhotoView src={logo}>
                <div className="logo-preview" style={{ position: 'relative', cursor: 'pointer' }}>
                  <img src={logo} alt="Logo preview" style={{ maxWidth: 60, maxHeight: 60 }} />
                  {/* Nút X nhỏ để clear logo nhanh */}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleClearLogo(); }}
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      background: '#e91e63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                    }}
                    tabIndex={-1}
                    aria-label="Clear logo"
                  >
                    ×
                  </button>
                </div>
              </PhotoView>
            </PhotoProvider>
          )}
        </div>
        <div className="upload-info">
          <p>Accepted formats: .svg, .png, .jpg, .jpeg, .gif. Max image size: 3Mb</p>
        </div>
        <div className="predefined-logos-section">
          <div className="predefined-header">
            <strong>or Choose one of the following samples</strong>
          </div>
          <div className="logo-list">
            <div className="icon-box" title="Facebook" onClick={() => handleSampleLogo(FacebookLogo)}><img src={FacebookLogo} alt="Facebook" /></div>
            <div className="icon-box" title="Instagram" onClick={() => handleSampleLogo(InstagramLogo)}><img src={InstagramLogo} alt="Instagram" /></div>
            <div className="icon-box" title="Twitter" onClick={() => handleSampleLogo(TwitterLogo)}><img src={TwitterLogo} alt="Twitter" /></div>
            <div className="icon-box" title="LinkedIn" onClick={() => handleSampleLogo(LinkedInLogo)}><img src={LinkedInLogo} alt="LinkedIn" /></div>
            <div className="icon-box" title="YouTube" onClick={() => handleSampleLogo(YouTubeLogo)}><img src={YouTubeLogo} alt="YouTube" /></div>
            <div className="icon-box" title="Pinterest" onClick={() => handleSampleLogo(PinterestLogo)}><img src={PinterestLogo} alt="Pinterest" /></div>
          </div>
          <button
            type="button"
            className="clear-logo-btn"
            onClick={handleClearLogo}
            disabled={!logo}
          >
            Clear logo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoOptions;
