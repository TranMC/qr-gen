import React from 'react';

function GoogleReviewForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>⭐ Google Review URL</label>
        <input
          type="url"
          placeholder="https://g.page/r/..."
          value={formData.reviewUrl || ''}
          onChange={e => onInputChange('reviewUrl', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  );
}

export default GoogleReviewForm; 