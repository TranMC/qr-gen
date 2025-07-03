import React from 'react';

function UrlForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>🔗 Your URL</label>
        <input
          type="url"
          placeholder="https://dingdoong.io/"
          value={formData.url || ''}
          onChange={e => onInputChange('url', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  );
}

export default UrlForm; 