import React, { useState, useRef, useCallback, useEffect } from "react";
import { generateCanvas, downloadCanvasAsPNG, copyCanvasToClipboard } from './utils/qrUtils';
import './App.css';
import ColorOptions from './components/ColorOptions';
import LogoOptions from './components/LogoOptions';
import DesignOptions from './components/DesignOptions';
import QrCodePreview from './components/QrCodePreview';
import QRCodeStyling from 'qr-code-styling';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import QRFormContent from './components/QRFormContent';
import { Suspense, lazy } from 'react';
import Faq from './components/Faq';
import QrAdvantages from './components/QrAdvantages';
import Lightbox from './components/Lightbox';

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
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxRotation, setLightboxRotation] = useState(0)
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

  const [formData, setFormData] = useState({});


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

  const [downloadFormat, setDownloadFormat] = useState('png');

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
  const downloadQR = async (format) => {
    const fileFormat = format || downloadFormat;
    if (!qrData) return;
    if (!qrStyling.current) return;
    if (fileFormat === 'pdf') {
      const canvas = await generateCanvas(qrRef.current, size / 293);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF({ unit: 'px', format: [size, size] });
      pdf.addImage(imgData, 'PNG', 0, 0, size, size);
      pdf.save(`qrcode-${size}x${size}.pdf`);
    } else {
      let ext = fileFormat;
      if (ext === 'jpg') ext = 'jpeg';
      await qrStyling.current.download({ name: `qrcode-${size}x${size}`, extension: ext });
    }
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

  const zoomIn = () => setLightboxZoom(prev => Math.min(prev + 0.25, MAX_ZOOM));
  const zoomOut = () => setLightboxZoom(prev => Math.max(prev - 0.25, MIN_ZOOM));

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


  useEffect(() => {
    if (colorMode === 'gradient') {
      setFgColor2(fgColor);
    } else if (colorMode === 'single') {
      setFgColor(fgColor);
    }
  }, [colorMode]);

  const getQRCodeOptions = (width, height) => ({
    width,
    height,
    data: qrData,
    image: undefined,
    dotsOptions: { type: bodyShape },
    backgroundOptions: { color: bgColor },
    cornersSquareOptions: useCustomEye ? { color: eyeFrameColor } : {},
    cornersDotOptions: { color: useCustomEye ? eyeBallColor : undefined, type: eyeBallShape },
    ...(colorMode === 'single'
      ? { dotsOptions: { ...{ type: bodyShape }, color: fgColor } }
      : colorMode === 'gradient'
      ? { dotsOptions: { ...{ type: bodyShape }, gradient: { type: gradientType, colorStops: [ { offset: 0, color: fgColor }, { offset: 1, color: fgColor2 } ] } } }
      : {})
  });

  useEffect(() => {
    if (!showQR) return;
    const options = getQRCodeOptions(252, 252);
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

  useEffect(() => {
    if (!lightboxOpen) return;
    const options = getQRCodeOptions(500, 500);
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

  // Thêm state cho flip
  const [flipY, setFlipY] = useState(1); // 1 hoặc -1
  const [flipX, setFlipX] = useState(1); // 1 hoặc -1

  // Thêm hàm flip
  const flipUpDown = () => setFlipY(prev => prev * -1);
  const flipFrontBack = () => setFlipX(prev => prev * -1);

 
  

  return (    
  <div className="qr-app-root">
      <header className="qr-header">
        <h1 className="qr-title">Free QR Code Generator</h1>
        <div className="qr-badges-row">
          <div className="qr-badge">
            <span className="qr-badge-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="#e91e63"/>
                <text x="10" y="15" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">$</text>
              </svg>
            </span>
            <span>Free</span>
          </div>
          <div className="qr-badge">
            <span className="qr-badge-icon">
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
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="#e91e63"/>
                <rect x="5" y="9" width="10" height="2" rx="1" fill="#fff"/>
              </svg>
            </span>
            <span>Unlimited use and scans</span>
          </div>
        </div>
      </header>


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
      <div className="qr-main-container">

        
        <div className="qr-content-container">
          <div className="qr-left-panel custom-left-panel">
            {}
            <div className="qr-section">              
              <div 
                className={`qr-section-header${contentExpanded ? ' active' : ''}`}
                onClick={() => setContentExpanded(!contentExpanded)}
              >
                <div className="qr-section-header-icon">
                  <svg width="26" height="26" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 0C24.0606 0 31 6.93935 31 15.5C31 24.0606 24.0606 31 15.5 31C6.93935 31 0 24.0606 0 15.5C0 6.93935 6.93935 0 15.5 0ZM15.5 2.16225C11.9626 2.16225 8.5701 3.56747 6.06879 6.06879C3.56747 8.5701 2.16225 11.9626 2.16225 15.5C2.16225 19.0374 3.56747 22.4299 6.06879 24.9312C8.5701 27.4325 11.9626 28.8377 15.5 28.8377C19.0374 28.8377 22.4299 27.4325 24.9312 24.9312C27.4325 22.4299 28.8377 19.0374 28.8377 15.5C28.8377 11.9626 27.4325 8.5701 24.9312 6.06879C22.4299 3.56747 19.0374 2.16225 15.5 2.16225ZM18.6744 5.4064C19.6821 5.78743 20.6244 6.3229 21.4675 6.9936C21.6613 7.1424 21.8472 7.3005 22.0301 7.46945C22.0642 7.4989 22.0937 7.5299 22.1262 7.56245C22.6346 8.0321 23.0965 8.56065 23.5057 9.12795C23.5631 9.207 23.6235 9.27985 23.6762 9.3558C23.7754 9.5015 23.8684 9.6534 23.9614 9.8053C24.1214 10.0615 24.2688 10.3253 24.4032 10.5958C24.4853 10.7508 24.5582 10.9197 24.6341 11.084C24.6853 11.1972 24.7427 11.3134 24.7892 11.4343C24.9023 11.7164 25.003 12.0001 25.0945 12.2899C25.1239 12.386 25.1472 12.4884 25.1751 12.5845C25.3323 13.1359 25.4438 13.6995 25.5084 14.2693C25.5192 14.3716 25.5347 14.4801 25.5424 14.5808C25.5735 14.9141 25.5936 15.2504 25.5936 15.5883C25.5916 16.2486 25.5309 16.9074 25.4123 17.5568C25.3906 17.67 25.3719 17.7847 25.3502 17.8932C25.2882 18.1877 25.2169 18.476 25.1332 18.7612C24.3443 18.4 23.4174 17.8684 23.1756 17.284C22.7354 16.23 21.5636 15.703 21.0862 14.3453C20.3003 12.0977 21.3435 12.1566 21.4892 10.7616C21.5574 10.1075 21.0862 9.97115 20.4646 10.2378C19.0138 10.8469 18.5225 10.6128 18.2295 9.5201C17.9366 8.43045 18.2295 8.12665 18.2295 8.12665C17.2407 8.23515 17.2034 7.0308 17.7165 6.727C18.073 6.5224 18.3752 5.89465 18.6744 5.4064ZM14.5297 12.0853C15.4442 11.6668 16.2889 11.5165 16.1773 10.7973C16.0688 10.0858 15.8116 9.55575 14.3825 9.55575C12.9534 9.55575 13.5764 11.5165 12.4046 10.3462C11.2329 9.18375 12.6604 9.48445 13.2463 9.2194C13.8337 8.9528 14.4196 7.86005 13.3935 7.78255C12.369 7.7097 12.5875 8.23515 11.7815 7.93755C10.9755 7.63375 10.6097 8.99 10.0951 8.8009C9.75725 8.6738 8.8505 7.9763 8.2491 7.28965C7.02191 8.35703 6.05039 9.68664 5.4064 11.1801C5.58155 13.206 6.6526 14.2693 6.6526 14.2693C6.6526 14.2693 7.20285 15.5883 10.5013 17.2096C10.5013 17.2096 11.1212 17.2468 10.3896 16.4951C9.65805 15.7402 8.8505 14.7978 9.76655 14.3096C10.6811 13.8152 10.9399 13.857 11.16 14.7637C11.3785 15.6689 12.1132 15.1358 12.1845 14.2693C12.2589 13.406 13.6136 12.5038 14.5297 12.0853ZM13.8322 16.6424C15.4101 16.6424 15.2629 17.1337 16.5091 18.2311C17.7537 19.3223 17.095 20.4151 16.4703 21.2458C15.8488 22.0735 15.2985 23.0128 15.0055 24.7147C14.711 26.4104 13.9423 25.2015 13.6881 24.7876C13.4307 24.3706 13.0278 23.9956 13.1393 22.2611C13.2478 20.5282 12.0745 21.5481 11.673 19.2851C11.2701 17.0252 12.2589 16.6439 13.8337 16.6439L13.8322 16.6424ZM21.5465 18.1365C21.9666 17.8684 22.9725 18.5674 22.7555 19.3037C22.5339 20.0399 21.8395 19.6245 21.4907 19.3037C21.142 18.9844 21.1234 18.4 21.5465 18.1365Z" fill="#8E8E8E"/>
                  </svg>
                </div>
                <div className="qr-section-header-content">
                  <span>Enter content</span>
                  <div className={`dropdown-arrow ${contentExpanded ? 'expanded' : ''}`}>▼</div>
                </div>
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
                className={`qr-section-header${colorsExpanded ? ' active' : ''}`}
                onClick={() => setColorsExpanded(!colorsExpanded)}
              >
                <div className="qr-section-header-icon">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.1667 19.8016C28.5036 19.8016 27.8677 19.5409 27.3989 19.0768C26.9301 18.6127 26.6667 17.9832 26.6667 17.3269C26.6667 16.6705 26.9301 16.0411 27.3989 15.577C27.8677 15.1128 28.5036 14.8521 29.1667 14.8521C29.8297 14.8521 30.4656 15.1128 30.9344 15.577C31.4033 16.0411 31.6667 16.6705 31.6667 17.3269C31.6667 17.9832 31.4033 18.6127 30.9344 19.0768C30.4656 19.5409 29.8297 19.8016 29.1667 19.8016ZM24.1667 13.2023C23.5036 13.2023 22.8677 12.9416 22.3989 12.4774C21.9301 12.0133 21.6667 11.3839 21.6667 10.7275C21.6667 10.0712 21.9301 9.44173 22.3989 8.97762C22.8677 8.51352 23.5036 8.25279 24.1667 8.25279C24.8297 8.25279 25.4656 8.51352 25.9344 8.97762C26.4033 9.44173 26.6667 10.0712 26.6667 10.7275C26.6667 11.3839 26.4033 12.0133 25.9344 12.4774C25.4656 12.9416 24.8297 13.2023 24.1667 13.2023ZM15.8333 13.2023C15.1703 13.2023 14.5344 12.9416 14.0656 12.4774C13.5967 12.0133 13.3333 11.3839 13.3333 10.7275C13.3333 10.0712 13.5967 9.44173 14.0656 8.97762C14.5344 8.51352 15.1703 8.25279 15.8333 8.25279C16.4964 8.25279 17.1323 8.51352 17.6011 8.97762C18.0699 9.44173 18.3333 10.0712 18.3333 10.7275C18.3333 11.3839 18.0699 12.0133 17.6011 12.4774C17.1323 12.9416 16.4964 13.2023 15.8333 13.2023ZM10.8333 19.8016C10.1703 19.8016 9.53441 19.5409 9.06557 19.0768C8.59672 18.6127 8.33333 17.9832 8.33333 17.3269C8.33333 16.6705 8.59672 16.0411 9.06557 15.577C9.53441 15.1128 10.1703 14.8521 10.8333 14.8521C11.4964 14.8521 12.1323 15.1128 12.6011 15.577C13.0699 16.0411 13.3333 16.6705 13.3333 17.3269C13.3333 17.9832 13.0699 18.6127 12.6011 19.0768C12.1323 19.5409 11.4964 19.8016 10.8333 19.8016ZM20 4.95312C16.0218 4.95313 12.2064 6.51751 9.3934 9.30214C6.58035 12.0868 5 15.8635 5 19.8016C5 23.7397 6.58035 27.5164 9.3934 30.3011C12.2064 33.0857 16.0218 34.6501 20 34.6501C20.663 34.6501 21.2989 34.3894 21.7678 33.9253C22.2366 33.4611 22.5 32.8317 22.5 32.1753C22.5 31.5319 22.25 30.9545 21.85 30.5255C21.4667 30.0801 21.2167 29.5026 21.2167 28.8757C21.2167 28.2193 21.4801 27.5899 21.9489 27.1258C22.4177 26.6617 23.0536 26.4009 23.7167 26.4009H26.6667C28.8768 26.4009 30.9964 25.5318 32.5592 23.9848C34.122 22.4378 35 20.3396 35 18.1518C35 10.8595 28.2833 4.95312 20 4.95312Z" fill="#8E8E8E"/>
                  </svg>
                </div>
                <div className="qr-section-header-content">
                  <span>Section colors</span>
                  <div className={`dropdown-arrow ${colorsExpanded ? 'expanded' : ''}`}>▼</div>
                </div>
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


            <div className="qr-section">
              <div
                className={`qr-section-header${logoExpanded ? ' active' : ''}`}
                onClick={() => setLogoExpanded(!logoExpanded)}
              >
                <div className="qr-section-header-icon">
                  <svg width="26" height="26" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_4168_11281)">
                      <path d="M30.2222 3.78125H3.7778C3.27684 3.78125 2.79639 3.98026 2.44216 4.33449C2.08792 4.68873 1.88892 5.16917 1.88892 5.67014V28.3368C1.88892 28.8378 2.08792 29.3182 2.44216 29.6725C2.79639 30.0267 3.27684 30.2257 3.7778 30.2257H30.2222C30.7232 30.2257 31.2037 30.0267 31.5579 29.6725C31.9121 29.3182 32.1111 28.8378 32.1111 28.3368V5.67014C32.1111 5.16917 31.9121 4.68873 31.5579 4.33449C31.2037 3.98026 30.7232 3.78125 30.2222 3.78125ZM8.42447 7.55903C8.98485 7.55903 9.53265 7.7252 9.99859 8.03653C10.4645 8.34786 10.8277 8.79037 11.0421 9.30809C11.2566 9.82582 11.3127 10.3955 11.2034 10.9451C11.094 11.4947 10.8242 11.9996 10.4279 12.3958C10.0317 12.7921 9.52684 13.0619 8.97723 13.1713C8.42761 13.2806 7.85793 13.2245 7.3402 13.01C6.82248 12.7956 6.37997 12.4324 6.06864 11.9665C5.75731 11.5005 5.59114 10.9527 5.59114 10.3924C5.59114 9.64091 5.88965 8.92024 6.421 8.38889C6.95236 7.85754 7.67303 7.55903 8.42447 7.55903ZM5.66669 25.5035V21.6313L11.3334 15.889C11.5103 15.7131 11.7497 15.6144 11.9992 15.6144C12.2487 15.6144 12.4881 15.7131 12.665 15.889L15.1111 18.2785L7.8578 25.5035H5.66669ZM28.3334 25.5035H10.5306L16.4145 19.6196L21.5145 14.5196C21.6914 14.3437 21.9308 14.2449 22.1803 14.2449C22.4298 14.2449 22.6692 14.3437 22.8461 14.5196L28.3334 20.0068V25.5035Z" fill="#8E8E8E" />
                    </g>
                    <defs>
                      <clipPath id="clip0_4168_11281">
                        <rect width="34" height="34" fill="#8E8E8E" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="qr-section-header-content">
                  <span>Add logo image</span>
                  <div className={`dropdown-arrow ${logoExpanded ? 'expanded' : ''}`}>▼</div>
                </div>
              </div>              <div className={`qr-section-content ${logoExpanded ? 'expanded' : 'collapsed'}`}>
                <LogoOptions />
              </div>
            </div>


            <div className="qr-section">              
              <div 
                className={`qr-section-header${designExpanded ? ' active' : ''}`}
                onClick={() => setDesignExpanded(!designExpanded)}
              >
                <div className="qr-section-header-icon">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 18.3333H18.3333V5H5V18.3333ZM8.33333 8.33333H15V15H8.33333V8.33333ZM5 35H18.3333V21.6667H5V35ZM8.33333 25H15V31.6667H8.33333V25ZM21.6667 5V18.3333H35V5H21.6667ZM31.6667 15H25V8.33333H31.6667V15ZM21.6833 21.6667H25.0167V25H21.6833V21.6667ZM25.0167 25H28.35V28.3333H25.0167V25ZM21.6833 28.3333H25.0167V31.6667H21.6833V28.3333ZM28.35 28.3333H31.6833V31.6667H28.35V28.3333ZM31.6833 31.6667H35.0167V35H31.6833V31.6667ZM25.0167 31.6667H28.35V35H25.0167V31.6667ZM28.35 21.6667H31.6833V25H28.35V21.6667ZM31.6833 25H35.0167V28.3333H31.6833V25Z" fill="#8E8E8E">
                    </path>
                  </svg>
                </div>
                <div className="qr-section-header-content">
                  <span>Customize design</span>
                  <div className={`dropdown-arrow ${designExpanded ? 'expanded' : ''}`}>▼</div>
                </div>
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
          
          <div className="qr-right-panel custom-right-panel">
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
              downloadFormat={downloadFormat}
              setDownloadFormat={setDownloadFormat}
            />
          </div>
        </div>
      </div>
        {}
      <Lightbox open={lightboxOpen} onClose={closeLightbox} showControls={true} controls={null}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div 
              ref={lightboxQrRef}
              className="lightbox-qr-display lightbox-qr-display-style"
            style={{
              transform: `scale(${lightboxZoom}) rotate(${lightboxRotation}deg) scaleX(${flipX}) scaleY(${flipY})`,
              transition: 'transform 0.2s',
              width: 'auto',
              height: 'auto',
              display: 'inline-block',
              margin: '0 auto'
            }}
            />
          <div className="lightbox-controls" style={{marginTop: 24}}>
            <button onClick={flipUpDown} className="control-btn" title="Flip Up/Down">
              <svg width="16px" height="16px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M19.29894,13.097555 C19.9200379,13.097555 20.2332042,13.8469628 19.7969407,14.2892722 L14.369746,19.7916791 C14.0983279,20.0668585 13.6553376,20.0697948 13.3802994,19.7982374 C13.1052612,19.52668 13.1023265,19.0834622 13.3737445,18.8082827 L17.6255116,14.497593 L0.703482198,14.497593 C0.317070803,14.497593 0.00382247492,14.1841838 0.00382247492,13.797574 C0.00382247492,13.4109642 0.317070803,13.097555 0.703482198,13.097555 L19.29894,13.097555 Z M6.61970059,0.201762638 C6.89473881,0.473320047 6.89767354,0.91653784 6.62625551,1.19171729 L2.37448841,5.50240698 L19.2965178,5.50240698 C19.6829292,5.50240698 19.9961775,5.81581617 19.9961775,6.20242599 C19.9961775,6.58903581 19.6829292,6.902445 19.2965178,6.902445 L0.701060011,6.902445 C0.0799621139,6.902445 -0.233204177,6.15303716 0.203059275,5.7107278 L5.63025404,0.208320918 C5.90167207,-0.0668585286 6.34466238,-0.0697947706 6.61970059,0.201762638 Z"></path> </g></svg>
              </button>
            <button onClick={flipFrontBack} className="control-btn" title="Flip Front/Back">
              <svg width="16px" height="16px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M19.29894,13.097555 C19.9200379,13.097555 20.2332042,13.8469628 19.7969407,14.2892722 L14.369746,19.7916791 C14.0983279,20.0668585 13.6553376,20.0697948 13.3802994,19.7982374 C13.1052612,19.52668 13.1023265,19.0834622 13.3737445,18.8082827 L17.6255116,14.497593 L0.703482198,14.497593 C0.317070803,14.497593 0.00382247492,14.1841838 0.00382247492,13.797574 C0.00382247492,13.4109642 0.317070803,13.097555 0.703482198,13.097555 L19.29894,13.097555 Z M6.61970059,0.201762638 C6.89473881,0.473320047 6.89767354,0.91653784 6.62625551,1.19171729 L2.37448841,5.50240698 L19.2965178,5.50240698 C19.6829292,5.50240698 19.9961775,5.81581617 19.9961775,6.20242599 C19.9961775,6.58903581 19.6829292,6.902445 19.2965178,6.902445 L0.701060011,6.902445 C0.0799621139,6.902445 -0.233204177,6.15303716 0.203059275,5.7107278 L5.63025404,0.208320918 C5.90167207,-0.0668585286 6.34466238,-0.0697947706 6.61970059,0.201762638 Z"></path> </g></svg>
              </button>
              <button onClick={rotateLeft} className="control-btn" title="Rotate Left">
              <svg width="24px" height="24px" fill="#ffffff" viewBox="0 0 1024 1024" t="1569683458761" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10582" xmlnsXlink="http://www.w3.org/1999/xlink" stroke="#ffffff" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style type="text/css"></style></defs><path d="M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-0.4-12.6 6.1l-0.2 64c-118.6 0.5-235.8 53.4-314.6 154.2-69.6 89.2-95.7 198.6-81.1 302.4h74.9c-0.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z" p-id="10583"></path><path d="M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32z m-44 402H396V494h440v326z" p-id="10584"></path></g></svg>
              </button>
              <button onClick={rotateRight} className="control-btn" title="Rotate Right">
              <svg width="24px" height="24px" fill="#ffffff" viewBox="0 0 1024 1024" t="1569683458761" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10582" xmlnsXlink="http://www.w3.org/1999/xlink" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style type="text/css"></style></defs><path d="M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-0.4-12.6 6.1l-0.2 64c-118.6 0.5-235.8 53.4-314.6 154.2-69.6 89.2-95.7 198.6-81.1 302.4h74.9c-0.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z" p-id="10583"></path><path d="M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32z m-44 402H396V494h440v326z" p-id="10584"></path></g></svg>
              </button>
            <button onClick={zoomOut} className="control-btn" title="Zoom Out" disabled={lightboxZoom <= MIN_ZOOM} style={lightboxZoom <= MIN_ZOOM ? {opacity: 0.5, pointerEvents: 'none'} : {}}>
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="zoom-out"> <g> <circle cx="10.1" cy="10.1" fill="none" r="8" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle> <line fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21.9" x2="16.3" y1="21.9" y2="16.3"></line> <line fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.1" x2="7.1" y1="10.1" y2="10.1"></line> </g> </g> </g> </g></svg>
              </button>
            <button onClick={zoomIn} className="control-btn" title="Zoom In">
              <svg width="27px" height="27px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>zoom-in</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <g> <path d="M24,17H21V14a2,2,0,0,0-4,0v3H14a2,2,0,0,0,0,4h3v3a2,2,0,0,0,4,0V21h3a2,2,0,0,0,0-4Z"></path> <path d="M43.4,40.6,30.9,28.1A15.1,15.1,0,0,0,34,19,15,15,0,1,0,19,34a15.1,15.1,0,0,0,9.1-3.1L40.6,43.4a1.9,1.9,0,0,0,2.8,0A1.9,1.9,0,0,0,43.4,40.6ZM19,30A11,11,0,1,1,30,19,11,11,0,0,1,19,30Z"></path> </g> </g> </g> </g></svg>
              </button>
            </div>
          </div>
      </Lightbox>
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

      {/* FAQ Section */}
      <Suspense fallback={<div>Đang tải...</div>}>
        <Faq faqData={faqData} />
      </Suspense>


      <div style={{ width: '100%', textAlign: 'center', marginTop: 44, marginBottom: 16 }}>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, letterSpacing: '-2px' }}>
          Free QR Code generator for high quality
        </h1>
      <div style={{ fontSize: 17, color: '#222', marginTop: 18 }}>Explore DingDoong's QR Code Generator: Packed with Incredible Advantages!</div>
      </div>


      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '52px 0' }}>
        <div style={{ maxWidth: 1221, width: '100%' }}>
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
                <img src={img} alt={`QR ${idx + 1}`} style={{ width: 220, height: 220, borderRadius: 20, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      

      <div className="qr-advantage-grid-section">
        <div className="qr-advantage-grid-container">
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

      {/* Advantages Section */}
      <Suspense fallback={<div>Đang tải...</div>}>
        <QrAdvantages />
      </Suspense>

    </div>
  );
}

export default App;

