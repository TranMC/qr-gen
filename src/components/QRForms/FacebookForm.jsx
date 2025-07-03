import React from 'react';

function FacebookForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>📘 Your Facebook URL</label>
        <input
          type="url"
          placeholder="https://facebook.com/yourpage"
          value={formData.facebook || ''}
          onChange={e => onInputChange('facebook', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  );
}

export default FacebookForm; 