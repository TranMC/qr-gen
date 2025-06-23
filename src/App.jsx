import React, { useState, useRef } from "react";
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
  const [colorsExpanded, setColorsExpanded] = useState(false)
  const [logoExpanded, setLogoExpanded] = useState(false)
  const [designExpanded, setDesignExpanded] = useState(false)
  const qrRef = useRef()

  const generateQRData = (formData) => {
    switch (activeTab) {
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
        return `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
ORG:${formData.organization}
TEL:${formData.phone}
EMAIL:${formData.email}
URL:${formData.website}
END:VCARD`
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
      scale: 2
    })
    
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const resetQR = () => {
    setQrData('https://dingdoong.io/')
    setSize(480)
    setBgColor('#ffffff')
    setFgColor('#e91e63')
    setErrorLevel('M')
  }

  const createQRCode = () => {
    // This function can be used to trigger QR code generation
    // In this case, QR code is generated automatically when data changes
    console.log('QR Code created!')
  }

  return (
    <div className="qr-app-root">
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
            {/* Enter Content Section */}
            <div className="qr-section">
              <div 
                className="qr-section-header"
                onClick={() => setContentExpanded(!contentExpanded)}
              >
                <div className="section-icon">💰</div>
                <span>Enter content</span>
                <div className={`dropdown-arrow ${contentExpanded ? 'expanded' : ''}`}>▼</div>
              </div>
              {contentExpanded && (
                <div className="qr-section-content">
                  <QRFormContent 
                    activeTab={activeTab} 
                    onDataChange={(data) => setQrData(generateQRData(data))}
                    initialData={{ url: 'https://dingdoong.io/' }}
                  />
                </div>
              )}
            </div>

            {/* Section Colors */}
            <div className="qr-section">
              <div 
                className="qr-section-header"
                onClick={() => setColorsExpanded(!colorsExpanded)}
              >
                <div className="section-icon">🎨</div>
                <span>Section colors</span>
                <div className={`dropdown-arrow ${colorsExpanded ? 'expanded' : ''}`}>▼</div>
              </div>
              {colorsExpanded && (
                <div className="qr-section-content">
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
              )}
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
              {logoExpanded && (
                <div className="qr-section-content">
                  <p>Logo functionality coming soon...</p>
                </div>
              )}
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
              {designExpanded && (
                <div className="qr-section-content">
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
              )}
            </div>
          </div>
          
          <div className="qr-right-panel">
            <div className="qr-preview-section">
              <button className="reset-btn" onClick={resetQR}>Reset</button>
              
              <div className="qr-display">
                <div ref={qrRef} className="qr-code-container">
                  <QRCode
                    value={qrData}
                    size={size}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level={errorLevel}
                  />
                </div>
              </div>
              
              <div className="size-control">
                <h3>Pick your size</h3>
                <div className="size-slider-container">
                  <span className="size-label">Low quality</span>
                  <input 
                    type="range" 
                    min="200" 
                    max="800" 
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="size-slider"
                  />
                  <span className="size-label">High quality</span>
                </div>
                <div className="size-display">{size} x {size} px</div>
              </div>
              
              <div className="action-buttons">
                <button onClick={createQRCode} className="create-btn">
                  Create QR Code
                </button>
                <button onClick={downloadQR} className="download-btn">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QRFormContent({ activeTab, onDataChange, initialData }) {
  const [formData, setFormData] = useState(initialData || {})
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      onDataChange(initialData)
    }
  }, [initialData, onDataChange])

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
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
          </div>
        </div>
      )

    case 'LOCATION':
      return (
        <div className="form-content">
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
