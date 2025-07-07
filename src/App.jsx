import React, { useState, useRef, useEffect, useCallback } from "react";
import { generateCanvas, downloadCanvasAsPNG, copyCanvasToClipboard } from './utils/qrUtils';
import Faq from './components/Faq';
import './App.css';
import ColorOptions from './components/ColorOptions';
import LogoOptions from './components/LogoOptions';
import DesignOptions from './components/DesignOptions';
import QrCodePreview from './components/QrCodePreview';
import QRCodeStyling from 'qr-code-styling';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import QrAdvantages from './components/QrAdvantages';

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

const faqData = [
  {
    question: 'What is a QR code?',
    answer: 'A QR code (Quick Response code) is a type of barcode that can be scanned using a smartphone or QR reader to quickly access information such as websites, contact details, and more. It is widely used for its high data capacity and fast readability.'
  },
  {
    question: 'What is a QR code generator?',
    answer: 'A QR code generator is a tool or software that allows you to create QR codes for various types of information, such as URLs, text, or contact details.'
  },
  {
    question: 'How do I create a QR code?',
    answer: 'You can create a QR code by using a QR code generator, entering the information you want to encode, and downloading the generated QR code image.'
  },
  {
    question: 'Are QR codes free to use?',
    answer: 'Most QR code generators offer free basic QR code creation. However, some advanced features may require payment.'
  },
  {
    question: 'Can QR codes be customized?',
    answer: 'Yes, QR codes can be customized with different colors, logos, and designs while still remaining scannable.'
  },
  {
    question: 'How long do QR codes last?',
    answer: 'QR codes do not expire, and they can last indefinitely as long as the printed code remains intact and scannable.'
  },
  {
    question: 'What are the benefits of using QR codes?',
    answer: 'QR codes offer quick access to information, are easy to use, and can store a variety of data types.'
  },
  {
    question: 'Do QR codes require an internet connection to work?',
    answer: 'QR codes themselves do not require internet to be scanned, but the content they link to (like websites) may require an internet connection.'
  },
  {
    question: 'How do I ensure my QR code is scannable?',
    answer: 'Use high contrast colors, keep the design simple, avoid resizing too small, and test the code with multiple devices before distribution.'
  }
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

  // Thêm mảng nhận link ảnh QR từ props hoặc biến
  const qrImageLinks = [
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(4)-1.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-2.png ',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(3)-2.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(6)-1.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(9)-1.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(11)-2.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(7)-1.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(5)-1.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(8)-1.png',
    'https://apps3.omegatheme.com/qr-code-generator-frontend/images/qr-code-(10)-1.png',
  ];

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
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          return `https://www.google.com/maps/place/${lat},${lng}`;
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
    if (!qrData) return;
    const canvas = await generateCanvas(qrRef.current, size / 293);
    downloadCanvasAsPNG(canvas, `qrcode-${size}x${size}.png`);
  }

  const copyQR = async () => {
    if (!qrData) return;
    try {
      const canvas = await generateCanvas(qrRef.current, size / 293);
      await copyCanvasToClipboard(canvas);
      alert('QR Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy QR code:', err);
      alert('Failed to copy QR code to clipboard');
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
    if (!qrData) return;
    const canvas = await generateCanvas(lightboxQrRef.current, 2);
    downloadCanvasAsPNG(canvas, `qrcode-preview-${Date.now()}.png`);
  }

  const copyLightboxQR = async () => {
    if (!qrData) return;
    try {
      const canvas = await generateCanvas(lightboxQrRef.current, 2);
      await copyCanvasToClipboard(canvas);
      alert('QR Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy QR code:', err);
      alert('Failed to copy QR code to clipboard');
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

 
  

  return (    
  <div className="qr-app-root">
      <header className="qr-header">
        <h1 className="qr-title">Free QR Code Generator</h1>
        <div className="qr-badges-row">
          <div className="qr-badge">
            <span className="qr-badge-icon">
              {/* Icon dollar */}
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="#e91e63"/>
                <text x="10" y="15" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">$</text>
              </svg>
            </span>
            <span>Free</span>
          </div>
          <div className="qr-badge">
            <span className="qr-badge-icon">
              {/* Icon đồng hồ */}
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="#e91e63"/>
                <rect x="9" y="5" width="2" height="6" rx="1" fill="#fff"/>
                <rect x="10" y="10" width="5" height="2" rx="1" fill="#fff" transform="rotate(45 10 10)"/>
              </svg>
            </span>
            <span>QR made easy, in seconds</span>
          </div>
          <div className="qr-badge">
            <span className="qr-badge-icon">
              {/* Icon dấu trừ */}
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="#e91e63"/>
                <rect x="5" y="9" width="10" height="2" rx="1" fill="#fff"/>
              </svg>
            </span>
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
                <ColorOptions
                  colorMode={colorMode}
                  setColorMode={setColorMode}
                  fgColor={fgColor}
                  setFgColor={setFgColor}
                  fgColor2={fgColor2}
                  setFgColor2={setFgColor2}
                  gradientType={gradientType}
                  setGradientType={setGradientType}
                  useCustomEye={useCustomEye}
                  setUseCustomEye={setUseCustomEye}
                  eyeFrameColor={eyeFrameColor}
                  setEyeFrameColor={setEyeFrameColor}
                  eyeBallColor={eyeBallColor}
                  setEyeBallColor={setEyeBallColor}
                  bgColor={bgColor}
                  setBgColor={setBgColor}
                  handleSwapColors={handleSwapColors}
                />
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
                <LogoOptions />
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
                <DesignOptions
                  bodyShape={bodyShape}
                  setBodyShape={setBodyShape}
                  eyeBallShape={eyeBallShape}
                  setEyeBallShape={setEyeBallShape}
                  errorLevel={errorLevel}
                  setErrorLevel={setErrorLevel}
                />
              </div>
            </div>
          </div>
          
          <div className="qr-right-panel">
            <QrCodePreview
              qrRef={qrRef}
              showQR={showQR}
              openLightbox={openLightbox}
              resetQR={resetQR}
              size={size}
              setSize={setSize}
              createQRCode={createQRCode}
              copyQR={copyQR}
              downloadQR={downloadQR}
            />
          </div>
        </div>
      </div>
        {}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div 
              ref={lightboxQrRef}
              className="lightbox-qr-display lightbox-qr-display-style"
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
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span><h3>URL</h3></div>
              <p>Use this type to open a link to a webpage, social channel, contact form, or Youtube</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="11" y2="18"/></svg></span><h3>Text</h3></div>
              <p>Use this type to display text in any language, with no limit on characters</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg></span><h3>Email</h3></div>
              <p>Use this type to send an email to a specific person with a pre-set message</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"/></svg></span><h3>Phone</h3></div>
              <p>Use this type to call a contact directly, no need to type the phone number</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></span><h3>Location</h3></div>
              <p>Use this type to connect a location without typing the address</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg></span><h3>Wifi</h3></div>
              <p>Use this type to connect a Wifi network without typing the password</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><rect x="7" y="10" width="3" height="3"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M2 13h20"/></svg></span><h3>Business profile</h3></div>
              <p>Use this type to connect your business profile or website</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="16" x2="15" y2="16"/></svg></span><h3>Restaurant menu</h3></div>
              <p>Use this type to connect your restaurant menu</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-row"><span className="qr-type-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span><h3>More to come</h3></div>
              <p>Many features and updates are upcoming and we're actively working on them</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <Faq faqData={faqData} />
      

      {/* Header lớn và subtitle */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 44, marginBottom: 16 }}>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, letterSpacing: '-2px' }}>
          Free QR Code generator for high quality
        </h1>
      <div style={{ fontSize: 20, color: '#222', marginTop: 12 }}>Explore DingDoong's QR Code Generator: Packed with Incredible Advantages!</div>
      </div>

      {/* Thêm Swiper phía dưới header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '52px 0' }}>
        <div style={{ maxWidth: 1000, width: '100%' }}>
          <Slider
            dots={false}
            infinite={true}
            speed={400}
            slidesToShow={5}
            slidesToScroll={5}
            autoplay={true}
            autoplaySpeed={4000}
            cssEase="linear"
            swipe={true}
            draggable={true}
            touchMove={false}
            responsive={[
              { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 3 } },
              { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } }
            ]}
          >
            {qrImageLinks.map((img, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={img} alt={`QR ${idx + 1}`} style={{ width: 180, height: 180, borderRadius: 20, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      

      {/* Phần nội dung bên dưới slider, 2 hàng 2 cột */}
      <div className="qr-advantage-grid-section">
        <div className="qr-advantage-grid-container">
          {/* Hàng 1 */}
          <div className="qr-advantage-row">
            <div className="qr-advantage-icon-box">
              <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/images/Group-42439-(0).png" />
            </div>
            <div>
              <div className="qr-advantage-title">Perpetual Use: Unlimited Scans</div>
              <div className="qr-advantage-desc">DingDoong's QR Codes come with boundless possibilities. There's no expiration date, no limits on scans, and absolutely no charges or constraints.</div>
            </div>
          </div>
          <div className="qr-advantage-row">
            <div className="qr-advantage-icon-box">
              <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/images/Group-42439-(1).png"/>
            </div>
            <div>
              <div className="qr-advantage-title">Custom Design and Color Options</div>
              <div className="qr-advantage-desc">Make your QR Code truly unique with design and color options. Customize corners, body shape, and colors to match your style. Eye-catching QR Codes attract more scans.</div>
            </div>
          </div>
          {/* Hàng 2 */}
          <div className="qr-advantage-row">
            <div className="qr-advantage-icon-box">
              <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/images/Group-42439-(2).png"/>
            </div>
            <div>
              <div className="qr-advantage-title">High-Resolution Excellence</div>
              <div className="qr-advantage-desc">DingDoong's QR Codes: High-resolution for print. You're free to choose the pixel size and file type for your optimal quality.</div>
            </div>
          </div>
          <div className="qr-advantage-row">
            <div className="qr-advantage-icon-box">
              <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/images/Group-42439-(2).png" />
            </div>
            <div>
              <div className="qr-advantage-title">Free for Commercial Use</div>
              <div className="qr-advantage-desc">Enjoy our QR Codes for free! Use them however you like, even for commercial purposes.</div>
            </div>
          </div>
          {/* Hàng 3 */}
          <div className="qr-advantage-row">
            <div className="qr-advantage-icon-box">
              <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/images/Group-42439-(4).png"/>
            </div>
            <div>
              <div className="qr-advantage-title">Logo-Embedded QR Codes</div>
              <div className="qr-advantage-desc">Personalize your QR Code with a brand for impact. It's easy and effective, keeping the QR Code readable.</div>
            </div>
          </div>
          <div className="qr-advantage-row">
            <div className="qr-advantage-icon-box">
              <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/images/Group-42439-(5).png"/>
            </div>
            <div>
              <div className="qr-advantage-title">Secure Data Encryption</div>
              <div className="qr-advantage-desc">Ensure privacy with DingDoong's Secure Data Encryption. It keeps your QR Code content confidential and secure.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: What are the advantages of using a QR Code? */}
      <div className="qr-adv-title-section">
        <h1 className="qr-adv-main-title">What are the advantages of using a QR Code?</h1>
        <div className="qr-adv-subtitle">
          Explore how QR Codes positively impact your business, marketing, and personal branding
        </div>
      </div>
      <QrAdvantages />

    </div>
  );
}

import QRFormContent from './components/QRFormContent';

export default App;

