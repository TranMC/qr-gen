import React from 'react';

function TextForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>📝 Your Text</label>
        <textarea
          placeholder="Enter your text here..."
          rows="4"
          value={formData.text || ''}
          onChange={e => onInputChange('text', e.target.value)}
          className="form-textarea"
        />
      </div>
    </div>
  );
}

export default TextForm; 