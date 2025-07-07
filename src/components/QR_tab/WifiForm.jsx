import React from 'react';

function WifiForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>📶 Network Name (SSID)</label>
        <input
          type="text"
          placeholder="My WiFi Network"
          value={formData.ssid || ''}
          onChange={e => onInputChange('ssid', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="WiFi password"
          value={formData.password || ''}
          onChange={e => onInputChange('password', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Security</label>
        <select
          value={formData.security || 'WPA'}
          onChange={e => onInputChange('security', e.target.value)}
          className="form-select"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
        </select>
      </div>
    </div>
  );
}

export default WifiForm; 