import React, { useState, useRef, useEffect, useCallback } from "react";
import QRCode from 'react-qr-code'
import html2canvas from 'html2canvas'
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

  const toggleFAQ = (index) => {
    setActiveFAQ((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  }

  const handleDataChange = useCallback((data, tab) => {
    setQrData(generateQRData(data, tab))
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
        return `geo:${formData.latitude},${formData.longitude}`
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
    setErrorLevel('M')
  }
  const createQRCode = () => {
    console.log('QR Code created!')
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
                  <div className="color-options">
                    <div className="color-group">
                      <label>Foreground Color:</label>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                      />
                    </div>
                    <div className="color-group">
                      <label>Background Color:</label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                      />
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
              </div>
              <div className={`qr-section-content ${logoExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="content-wrapper">
                  <p>Logo functionality coming soon...</p>
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
              <div className="qr-display">
                <div ref={qrRef} className="qr-code-container" onClick={openLightbox} style={{ cursor: 'pointer' }}>
                  <QRCode
                    value={qrData}
                    size={293} 
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level={errorLevel}
                  />
                </div>
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
              style={{
                transform: `scale(${lightboxZoom}) rotate(${lightboxRotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
            >
              <QRCode
                value={qrData}
                size={500} 
                bgColor={bgColor}
                fgColor={fgColor}
                level={errorLevel}
              />
            </div>
            
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
              <div className="qr-type-icon">🌐</div>
              <h3>URL</h3>
              <p>Use this type to open a link to a webpage, social channel, contact form, or Youtube</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">📝</div>
              <h3>Text</h3>
              <p>Use this type to display text in any language, with no limit on characters</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">✉️</div>
              <h3>Email</h3>
              <p>Use this type to send an email to a specific person with a pre-set message</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">📞</div>
              <h3>Phone</h3>
              <p>Use this type to call a contact directly, no need to type the phone number</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">📍</div>
              <h3>Location</h3>
              <p>Use this type to connect a location without typing the address</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">📶</div>
              <h3>Wifi</h3>
              <p>Use this type to connect a Wifi network without typing the password</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">👤</div>
              <h3>Business profile</h3>
              <p>Use this type to connect your business profile or website</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">🍽️</div>
              <h3>Restaurant menu</h3>
              <p>Use this type to connect your restaurant menu</p>
            </div>
            <div className="qr-type-card">
              <div className="qr-type-icon">⋯</div>
              <h3>More to come</h3>
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

function QRFormContent({ activeTab, onDataChange }) {
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    const defaults = {
      URL: { url: 'https://dingdoong.io/' },
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
  }, [activeTab])
  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const searchLocation = async (query) => {
    if (!query) return
    const cityCoords = {
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'ho chi minh': { lat: 10.8231, lng: 106.6297 },
      'hanoi': { lat: 21.0285, lng: 105.8542 }
    }
    
    const cityKey = query.toLowerCase()
    const coords = cityCoords[cityKey]
    
    if (coords) {
      handleInputChange('latitude', coords.lat)
      handleInputChange('longitude', coords.lng)
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
              value={formData.url || 'https://dingdoong.io/'}
              onChange={(e) => handleInputChange('url', e.target.value)}
            />
          </div>
        </div>
      )
    
    case 'FACEBOOK':
      return (
        <div className="form-content">
          <div className="form-group">
            <label>📘 Facebook URL</label>
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
          </div>
          
          <div className="map-container">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14897.585524393065!2d105.81504059271653!3d21.016820098173046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9ef82fed13%3A0x1ee04aa292e377a2!2zVHJ1bmcgdMOibSBDaGnhur91IHBoaW0gUXXhu5FjIGdpYQ!5e0!3m2!1svi!2s!4v1750652701700!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade')}`}
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
