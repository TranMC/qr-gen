import React, { useState, useRef, useEffect, useCallback } from "react";
import QRCode from 'react-qr-code'
import html2canvas from 'html2canvas'
import QRCodeStyling from 'qr-code-styling'
import './App.css';

const tabs = [
  { id: 'URL', label: 'URL', icon: '🔗' },
  { id: 'FACEBOOK', label: 'FACEBOOK', icon: '📘' },
  { id: 'TEXT', label: 'TEXT', icon: '📝' },
  { id: 'EMAIL', label: 'EMAIL', icon: '📧' },
  { id: 'PHONE', label: 'PHONE', icon: '📞' },
  { id: 'LOCATION', label: 'LOCATION', icon: '📍' },
  { id: 'WIFI', label: 'WIFI', icon: '📶' },
  { id: 'VCARD', label: 'VCARD', icon: '👤' },
  { id: 'GOOGLE REVIEW', label: 'GOOGLE REVIEW', icon: '⭐' }
];

function App() {
  const [activeTab, setActiveTab] = useState('URL')
  const [qrData, setQrData] = useState('https://dingdoong.io/')
  const [size, setSize] = useState(480)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgColor, setFgColor] = useState('#e91e63')
  const [errorLevel, setErrorLevel] = useState('M')
  const [contentExpanded, setContentExpanded] = useState(true)
  const [colorsExpanded, setColorsExpanded] = useState(true)
  const [logoExpanded, setLogoExpanded] = useState(false)
  const [designExpanded, setDesignExpanded] = useState(false)
  const qrRef = useRef()
  const lightboxQrRef = useRef()

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxRotation, setLightboxRotation] = useState(0)
  const [activeFAQ, setActiveFAQ] = useState([])

  const [colorMode, setColorMode] = useState('single'); // 'single', 'gradient', 'eye'
  const [fgColor2, setFgColor2] = useState('#5dde9f');
  const [gradientType, setGradientType] = useState('radial'); // 'linear', 'radial'
  const [eyeFrameColor, setEyeFrameColor] = useState('#000000');
  const [eyeBallColor, setEyeBallColor] = useState('#000000');
  const [bodyShape, setBodyShape] = useState('square');
  const [eyeBallShape, setEyeBallShape] = useState('square');

  const qrStyling = useRef(null);
  const lightboxQrStyling = useRef(null);

  const [resetForm, setResetForm] = useState(0);
  const [useCustomEye, setUseCustomEye] = useState(false);

  const [showQR, setShowQR] = useState(false);

  const [locationError, setLocationError] = useState('');

  const [formData, setFormData] = useState({});

  const toggleFAQ = (index) => {
    setActiveFAQ((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  }

  const handleDataChange = useCallback((data, tab) => {
    setQrData(generateQRData(data, tab))
    setShowQR(false)
  }, [])

  const generateQRData = (formData, tab) => {
    switch (tab) {
      case 'URL':
        return formData.url || 'https://dingdoong.io/'
      case 'FACEBOOK':
        return formData.facebook || ''
      case 'TEXT':
        return formData.text || ''
      case 'EMAIL':
        return `mailto:${formData.email}?subject=${formData.subject}&body=${formData.body}`
      case 'PHONE':
        return `tel:${formData.phone}`
      case 'LOCATION':
        if (formData.latitude && formData.longitude) {
          return `https://www.google.com/maps/place/@${formData.latitude},${formData.longitude},15z`;
        }
        return ''
      case 'WIFI':
        return `WIFI:T:${formData.security};S:${formData.ssid};P:${formData.password};;`
      case 'VCARD':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name}\nORG:${formData.organization}\nTEL:${formData.phone}\nEMAIL:${formData.email}\nURL:${formData.website}\nEND:VCARD`
      case 'GOOGLE REVIEW':
        return formData.reviewUrl || ''
      default:
        return ''
    }
  }
  const downloadQR = async () => {
    if (!qrData) return
    
    const element = qrRef.current
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: size / 293 
    })
    
    const link = document.createElement('a')
    link.download = `qrcode-${size}x${size}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyQR = async () => {
    if (!qrData) return
    
    try {
      const element = qrRef.current
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: size / 293
      })
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          alert('QR Code copied to clipboard!')
        }
      }, 'image/png')
    } catch (err) {
      console.error('Failed to copy QR code:', err)
      alert('Failed to copy QR code to clipboard')
    }
  }

  const resetQR = () => {
    setQrData('https://dingdoong.io/')
    setSize(480)
    setBgColor('#ffffff')
    setFgColor('#e91e63')
    setFgColor2('#5dde9f')
    setErrorLevel('M')
    setEyeFrameColor('#000000')
    setEyeBallColor('#000000')
    setBodyShape('square')
    setEyeBallShape('square')
    setColorMode('single')
    setUseCustomEye(false)
    setResetForm(r => r + 1)
    setShowQR(false)
  }
  const createQRCode = () => {
    setShowQR(true)
  }  
  const openLightbox = () => {
    setLightboxOpen(true)
    setLightboxZoom(1)
    setLightboxRotation(0)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const zoomIn = () => {
    setLightboxZoom(prev => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setLightboxZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const rotateLeft = () => {
    setLightboxRotation(prev => prev - 90)
  }

  const rotateRight = () => {
    setLightboxRotation(prev => prev + 90)
  }

  const downloadLightboxQR = async () => {
    if (!qrData) return
    
    const element = lightboxQrRef.current
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2 
    })
    
    const link = document.createElement('a')
    link.download = `qrcode-preview-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyLightboxQR = async () => {
    if (!qrData) return
    
    try {
      const element = lightboxQrRef.current
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2
      })
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          alert('QR Code copied to clipboard!')
        }
      }, 'image/png')
    } catch (err) {
      console.error('Failed to copy QR code:', err)
      alert('Failed to copy QR code to clipboard')
    }
  }

  const handleSwapColors = () => {
    const tmp = fgColor;
    setFgColor(fgColor2);
    setFgColor2(tmp);
  };

  // Đồng bộ màu khi đổi mode
  useEffect(() => {
    if (colorMode === 'gradient') {
      setFgColor2(fgColor);
    } else if (colorMode === 'single') {
      setFgColor(fgColor);
    }
  }, [colorMode]);

  // QR code ngoài
  useEffect(() => {
    if (!showQR) return;
    const options = {
      width: 252,
      height: 252,
      data: qrData,
      image: undefined,
      dotsOptions: { type: bodyShape },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: useCustomEye ? { color: eyeFrameColor } : {},
      cornersDotOptions: { color: useCustomEye ? eyeBallColor : undefined, type: eyeBallShape },
    };
    if (colorMode === 'single') {
      options.dotsOptions.color = fgColor;
    } else if (colorMode === 'gradient') {
      options.dotsOptions.gradient = {
        type: gradientType,
        colorStops: [
          { offset: 0, color: fgColor },
          { offset: 1, color: fgColor2 }
        ]
      };
    }
    if (useCustomEye) {
      options.dotsOptions.color = fgColor;
    }
    if (!qrStyling.current) {
      qrStyling.current = new QRCodeStyling(options);
    } else {
      qrStyling.current.update(options);
    }
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrStyling.current.append(qrRef.current);
    }
  }, [showQR, qrData, fgColor, fgColor2, bgColor, colorMode, gradientType, eyeFrameColor, eyeBallColor, bodyShape, eyeBallShape, useCustomEye]);

  // QR code preview (lightbox)
  useEffect(() => {
    if (!lightboxOpen) return;
    const options = {
      width: 500,
      height: 500,
      data: qrData,
      image: undefined,
      dotsOptions: { type: bodyShape },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: useCustomEye ? { color: eyeFrameColor } : {},
      cornersDotOptions: { color: useCustomEye ? eyeBallColor : undefined, type: eyeBallShape },
    };
    if (colorMode === 'single') {
      options.dotsOptions.color = fgColor;
    } else if (colorMode === 'gradient') {
      options.dotsOptions.gradient = {
        type: gradientType,
        colorStops: [
          { offset: 0, color: fgColor },
          { offset: 1, color: fgColor2 }
        ]
      };
    }
    if (useCustomEye) {
      options.dotsOptions.color = fgColor;
    }
    if (!lightboxQrStyling.current) {
      lightboxQrStyling.current = new QRCodeStyling(options);
    } else {
      lightboxQrStyling.current.update(options);
    }
    if (lightboxQrRef.current) {
      lightboxQrRef.current.innerHTML = '';
      lightboxQrStyling.current.append(lightboxQrRef.current);
    }
  }, [lightboxOpen, qrData, fgColor, fgColor2, bgColor, colorMode, gradientType, eyeFrameColor, eyeBallColor, bodyShape, eyeBallShape, useCustomEye]);

  const searchLocation = async (query) => {
    setLocationError('');
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = data[0];
        const newData = { ...formData, latitude: coords.lat, longitude: coords.lon };
        setFormData(newData);
        onDataChange(newData);
        setLocationError('');
      } else {
        setLocationError('Không tìm thấy địa điểm phù hợp.');
      }
    } catch (err) {
      setLocationError('Lỗi khi tìm kiếm địa điểm.');
    }
  }

  return (    
  <div className="qr-app-root">
      <header className="qr-header">
        <h1 className="qr-title">Free QR Code Generator</h1>
        <div className="qr-badges-row">
          <div className="qr-badge">
            <span className="qr-badge-icon">💰</span>
            <span>Free</span>
          </div>
          <div className="qr-badge">
            <span className="qr-badge-icon">🕒</span>
            <span>QR made easy, in seconds</span>
          </div>
          <div className="qr-badge">
            <span className="qr-badge-icon">📊</span>
            <span>Unlimited use and scans</span>
          </div>
        </div>
      </header>
      
      <div className="qr-main-container">
        <nav className="qr-tabbar">
          {tabs.map(tab => (
            <button 
              className={`qr-tabbar-btn ${activeTab === tab.id ? 'active' : ''}`} 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="qr-content-container">
          <div className="qr-left-panel">
            {}
            <div className="qr-section">              <div 
                className="qr-section-header"
                onClick={() => setContentExpanded(!contentExpanded)}
              >
                <div className="section-icon">💰</div>
                <span>Enter content</span>
                <div className={`dropdown-arrow ${contentExpanded ? 'expanded' : ''}`}>▼</div>
              </div>
              <div className={`qr-section-content ${contentExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="content-wrapper">                  
                  <QRFormContent 
                    activeTab={activeTab} 
                    onDataChange={(data) => handleDataChange(data, activeTab)}
                    resetForm={resetForm}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </div>
            </div>

            {}
            <div className="qr-section">              
              <div 
                className="qr-section-header"
                onClick={() => setColorsExpanded(!colorsExpanded)}
              >
                <div className="section-icon">🎨</div>
                <span>Section colors</span>
                <div className={`dropdown-arrow ${colorsExpanded ? 'expanded' : ''}`}>▼</div>
              </div>
              <div className={`qr-section-content ${colorsExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="content-wrapper">
                  <div style={{marginBottom: 18}}>
                    <label style={{fontWeight:600, marginBottom:8, display:'block'}}>Foreground color</label>
                    <div style={{display:'flex', gap:24, alignItems:'center', marginBottom:16}}>
                      <label><input type="radio" name="fgmode" checked={colorMode==='single'} onChange={()=>setColorMode('single')} /> Single color</label>
                      <label><input type="radio" name="fgmode" checked={colorMode==='gradient'} onChange={()=>setColorMode('gradient')} /> Color gradient</label>
                      <label><input type="checkbox" checked={useCustomEye} onChange={()=>setUseCustomEye(v=>!v)} /> Custom eye color</label>
                    </div>
                    {colorMode==='single' && (
                      <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} style={{width:40,height:40,borderRadius:8,border:'1px solid #ccc'}} />
                        <span style={{fontFamily:'monospace',fontSize:16}}>{fgColor}</span>
                      </div>
                    )}
                    {colorMode==='gradient' && (
                      <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} style={{width:40,height:40,borderRadius:8,border:'1px solid #ccc'}} />
                          <span style={{fontFamily:'monospace',fontSize:16}}>{fgColor}</span>
                        </div>
                        <button type="button" onClick={handleSwapColors} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#e24646'}}>↔</button>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <input type="color" value={fgColor2} onChange={e=>setFgColor2(e.target.value)} style={{width:40,height:40,borderRadius:8,border:'1px solid #ccc'}} />
                          <span style={{fontFamily:'monospace',fontSize:16}}>{fgColor2}</span>
                        </div>
                        <select value={gradientType} onChange={e=>setGradientType(e.target.value)} style={{height:40,borderRadius:8,border:'1px solid #ccc',padding:'0 12px',fontSize:16}}>
                          <option value="linear">Linear Gradient</option>
                          <option value="radial">Radial Gradient</option>
                        </select>
                      </div>
                    )}
                    {useCustomEye && (
                      <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:12}}>
                        <div style={{display:'flex',alignItems:'center',gap:16}}>
                          <label style={{fontWeight:500}}>Eye frame color</label>
                          <input type="color" value={eyeFrameColor} onChange={e=>setEyeFrameColor(e.target.value)} style={{width:40,height:40,borderRadius:8,border:'1px solid #ccc'}} />
                          <span style={{fontFamily:'monospace',fontSize:16}}>{eyeFrameColor}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:16}}>
                          <label style={{fontWeight:500}}>Eye ball color</label>
                          <input type="color" value={eyeBallColor} onChange={e=>setEyeBallColor(e.target.value)} style={{width:40,height:40,borderRadius:8,border:'1px solid #ccc'}} />
                          <span style={{fontFamily:'monospace',fontSize:16}}>{eyeBallColor}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{marginTop:18}}>
                    <label style={{fontWeight:600, marginBottom:8, display:'block'}}>Background color</label>
                    <div style={{display:'flex',alignItems:'center',gap:16}}>
                      <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} style={{width:40,height:40,borderRadius:8,border:'1px solid #ccc'}} />
                      <span style={{fontFamily:'monospace',fontSize:16}}>{bgColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Logo Image */}
            <div className="qr-section">
              <div
                className="qr-section-header"
                onClick={() => setLogoExpanded(!logoExpanded)}
              >
                <div className="section-icon">🖼️</div>
                <span>Add logo image</span>
                <div className={`dropdown-arrow ${logoExpanded ? 'expanded' : ''}`}>▼</div>
              </div>              <div className={`qr-section-content ${logoExpanded ? 'expanded' : 'collapsed'}`}>
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
              </div>
            </div>

            {/* Customize Design */}
            <div className="qr-section">              
              <div 
                className="qr-section-header"
                onClick={() => setDesignExpanded(!designExpanded)}
              >
                <div className="section-icon">🎯</div>
                <span>Customize design</span>
                <div className={`dropdown-arrow ${designExpanded ? 'expanded' : ''}`}>▼</div>
              </div>
              <div className={`qr-section-content ${designExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="content-wrapper">
                  <div className="design-options">
                    <label>Body shape:</label>
                    <select value={bodyShape} onChange={e=>setBodyShape(e.target.value)}>
                      <option value="square">Square</option>
                      <option value="dots">Dots</option>
                      <option value="rounded">Rounded</option>
                      <option value="extra-rounded">Extra Rounded</option>
                      <option value="classy">Classy</option>
                      <option value="classy-rounded">Classy Rounded</option>
                    </select>
                  </div>
                  <div className="design-options" style={{marginTop:12}}>
                    <label>Eye ball shape:</label>
                    <select value={eyeBallShape} onChange={e=>setEyeBallShape(e.target.value)}>
                      <option value="square">Square</option>
                      <option value="circle">Circle</option>
                      <option value="dot">Dot</option>
                    </select>
                  </div>
                  <div className="design-options" style={{marginTop:12}}>
                    <label>Error Correction:</label>
                    <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)}>
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="qr-right-panel">
            <div className="qr-preview-section">
              <div className="qr-display" style={{ width: 352, height: 352, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {showQR && (
                <div ref={qrRef} className="qr-code-container" style={{ width: 252, height: 252, cursor: 'pointer' }} onClick={openLightbox} />
                )}
                <button className="reset-btn" onClick={resetQR}>Reset</button>
              </div>
              
              <div className="size-control">
                <h3>Pick your size</h3>
                <div className="size-slider-container">
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
                <div className="size-display">{size} x {size} px</div>
              </div>                <div className="action-buttons">
                <button onClick={createQRCode} className="create-btn">
                  Create QR Code                
                  </button>
                <button onClick={copyQR} className="copy-btn">
                  📋 Copy QR Code
                </button>
                <button onClick={downloadQR} className="download-btn">
                  Download ({size}x{size}px)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        {}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div 
              ref={lightboxQrRef}
              className="lightbox-qr-display"
              style={{ width: 500, height: 500, margin: '0 auto' }}
            />
            
            <div className="lightbox-controls">
              <button onClick={zoomOut} className="control-btn" title="Zoom Out">
                ➖
              </button>
              <button onClick={zoomIn} className="control-btn" title="Zoom In">
                ➕
              </button>
              <button onClick={rotateLeft} className="control-btn" title="Rotate Left">
                ↶
              </button>
              <button onClick={rotateRight} className="control-btn" title="Rotate Right">
                ↷
              </button>
              <button onClick={copyLightboxQR} className="control-btn" title="Copy">
                📋
              </button>
              <button onClick={downloadLightboxQR} className="control-btn" title="Download">
                💾
              </button>
              <button onClick={closeLightbox} className="control-btn close-btn" title="Close">
                ✖️
              </button>
            </div>
          </div>
        </div>      )}      
        {}
      <div className="info-section">
        <div className="info-container">
          <h2 className="info-title">What type of QR Code can I create?</h2>
          <p className="info-subtitle">QR Codes are entirely free and come with no expiry or scan limits</p>
          <div className="qr-types-grid">
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* URL SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span><h3>URL</h3></div>
              <p>Use this type to open a link to a webpage, social channel, contact form, or Youtube</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Text SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg></span><h3>Text</h3></div>
              <p>Use this type to display text in any language, with no limit on characters</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Email SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg></span><h3>Email</h3></div>
              <p>Use this type to send an email to a specific person with a pre-set message</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Phone SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"/></svg></span><h3>Phone</h3></div>
              <p>Use this type to call a contact directly, no need to type the phone number</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Location SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></span><h3>Location</h3></div>
              <p>Use this type to connect a location without typing the address</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Wifi SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg></span><h3>Wifi</h3></div>
              <p>Use this type to connect a Wifi network without typing the password</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Business SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M2 13h20"/></svg></span><h3>Business profile</h3></div>
              <p>Use this type to connect your business profile or website</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* Menu SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg></span><h3>Restaurant menu</h3></div>
              <p>Use this type to connect your restaurant menu</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon">{/* More SVG */}<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span><h3>More to come</h3></div>
              <p>Many features and updates are upcoming and we're actively working on them</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>          
          <div className="faq-list">
            <div className={`faq-item ${activeFAQ.includes(0) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(0)}>
                <h3>What is a QR code?</h3>
                <span className="faq-toggle">{activeFAQ.includes(0) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>A QR code (Quick Response code) is a type of two-dimensional barcode that can store various types of information such as text, URLs, contact information, and more. It can be scanned using a smartphone camera or QR code reader.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(1) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(1)}>
                <h3>How long do QR codes last?</h3>
                <span className="faq-toggle">{activeFAQ.includes(1) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>QR codes do not expire, and they can last indefinitely as long as the printed code remains intact and scannable.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(2) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(2)}>
                <h3>What is a QR code generator?</h3>
                <span className="faq-toggle">{activeFAQ.includes(2) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>A QR code generator is an online tool or software that creates QR codes. Users can input information such as URLs, text, or contact details, and the generator produces a QR code that can be scanned to access that information.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(3) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(3)}>
                <h3>What are the benefits of using QR codes?</h3>
                <span className="faq-toggle">{activeFAQ.includes(3) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>QR codes offer quick access to information, enhance user engagement, are easy to create and use, and can store a variety of data types.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(4) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(4)}>
                <h3>How do I create a QR code?</h3>
                <span className="faq-toggle">{activeFAQ.includes(4) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
              <ul>
                <li>Step 1: Select your QR code type: You may choose from URL, vCard, Plain Text, Facebook, WiFi, and Google Review.</li>
                <li>Step 2: Fill all the details: Enter all the information we require that appears. Then, select "Generate."</li>
                <li>Step 3: Download your QR Code.</li>
              </ul>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(5) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(5)}>
                <h3>Do QR codes require an internet connection to work?</h3>
                <span className="faq-toggle">{activeFAQ.includes(5) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>QR codes themselves don't require internet to be scanned, but the content they link to (like websites) may require an internet connection. Text, WiFi, and contact information QR codes work offline.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(6) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(6)}>
                <h3>Are QR codes free to use?</h3>
                <span className="faq-toggle">{activeFAQ.includes(6) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>All of DingDoong's QR Codes are free. Our small note: you won't be able to modify the information, so always test and make sure they work before printing.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(7) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(7)}>
                <h3>How do I ensure my QR code is scannable?</h3>
                <span className="faq-toggle">{activeFAQ.includes(7) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>To ensure your QR code is scannable, use high contrast colors, keep the design simple, avoid resizing too small, and test the code with multiple devices before distribution.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFAQ.includes(8) ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(8)}>
                <h3>Can QR codes be customized?</h3>
                <span className="faq-toggle">{activeFAQ.includes(8) ? '⌄' : '⌃'}</span>
              </div>
              <div className="faq-answer">
                <p>Yes, QR codes can be customized with different colors, logos, and designs to match your branding while still remaining scannable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QRFormContent({ activeTab, onDataChange, resetForm, formData, setFormData }) {
  const [locationError, setLocationError] = useState('');
  
  useEffect(() => {
    const defaults = {
      URL: { url: '' },
      FACEBOOK: { facebook: '' },
      TEXT: { text: '' },
      EMAIL: { email: '', subject: '', body: '' },  
      PHONE: { phone: '' },
      LOCATION: { latitude: '', longitude: '', address: '', searchLocation: '' },
      WIFI: { ssid: '', password: '', security: 'WPA' },
      VCARD: { name: '', organization: '', phone: '', email: '', website: '' },
      'GOOGLE REVIEW': { reviewUrl: '' }
    }
    setFormData({ ...defaults[activeTab] })
    // eslint-disable-next-line
  }, [activeTab, resetForm])

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const searchLocation = async (query) => {
    setLocationError('');
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = data[0];
        const newData = { ...formData, latitude: coords.lat, longitude: coords.lon };
        setFormData(newData);
        onDataChange(newData);
        setLocationError('');
      } else {
        setLocationError('Không tìm thấy địa điểm phù hợp.');
      }
    } catch (err) {
      setLocationError('Lỗi khi tìm kiếm địa điểm.');
    }
  }

  switch (activeTab) {
    case 'URL':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>🔗 Your URL</label>
            <input
              type="url"
              placeholder="https://dingdoong.io/"
              value={formData.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
            />
          </div>
        </div>
      )
    
    case 'FACEBOOK':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📘 Your Facebook URL</label>
            <input
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={formData.facebook || ''}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
            />
          </div>
        </div>
      )

    case 'TEXT':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📝 Your Text</label>
            <textarea
              placeholder="Enter your text here..."
              rows="4"
              value={formData.text || ''}
              onChange={(e) => handleInputChange('text', e.target.value)}
            />
          </div>
        </div>
      )
    
    case 'EMAIL':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Email subject"
              value={formData.subject || ''}
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Email message"
              rows="3"
              value={formData.body || ''}
              onChange={(e) => handleInputChange('body', e.target.value)}
            />
          </div>
        </div>
      )
    
    case 'PHONE':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📞 Phone Number</label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>        </div>
      )

    case 'LOCATION':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📍 Search Location</label>
            <input
              type="text"
              placeholder="Search for a place..."
              value={formData.searchLocation || ''}
              onChange={(e) => handleInputChange('searchLocation', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation(e.target.value)}
            />
            <button 
              type="button" 
              className="search-btn"
              onClick={() => searchLocation(formData.searchLocation)}
            >
              🔍 Search
            </button>
            {locationError && <div style={{color:'red',marginTop:8}}>{locationError}</div>}
          </div>
          
          <div className="map-container">
            <iframe
              src={
                formData.latitude && formData.longitude
                  ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.longitude)-0.01}%2C${parseFloat(formData.latitude)-0.01}%2C${parseFloat(formData.longitude)+0.01}%2C${parseFloat(formData.latitude)+0.01}&layer=mapnik&marker=${formData.latitude}%2C${formData.longitude}`
                  : 'https://www.openstreetmap.org/export/embed.html?bbox=105.8%2C20.9%2C106.0%2C21.1&layer=mapnik&marker=21.0285%2C105.8542'
              }
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <div className="coordinate-inputs">
            <div className="form-group">
              <label>📍 Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="37.7749"
                value={formData.latitude || ''}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>📍 Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="-122.4194"
                value={formData.longitude || ''}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
              />
            </div>
          </div>
          
          <div className="location-info">
            <small>💡 You can search for a location above or enter coordinates directly</small>
          </div>
        </div>
      )
    
    case 'WIFI':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📶 Network Name (SSID)</label>
            <input
              type="text"
              placeholder="My WiFi Network"
              value={formData.ssid || ''}
              onChange={(e) => handleInputChange('ssid', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="WiFi password"
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Security</label>
            <select
              value={formData.security || 'WPA'}
              onChange={(e) => handleInputChange('security', e.target.value)}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
        </div>
      )
    
    case 'VCARD':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>👤 Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Organization</label>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.organization || ''}
              onChange={(e) => handleInputChange('organization', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
        </div>
      )

    case 'GOOGLE REVIEW':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>⭐ Google Review URL</label>
            <input
              type="url"
              placeholder="https://g.page/r/..."
              value={formData.reviewUrl || ''}
              onChange={(e) => handleInputChange('reviewUrl', e.target.value)}
            />
          </div>
        </div>
      )
    
    default:
      return <div>Select a tab to start generating QR codes</div>
  }
}

export default App;
