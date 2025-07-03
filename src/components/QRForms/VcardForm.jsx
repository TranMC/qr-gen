import React from 'react';

function VcardForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>👤 Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={formData.name || ''}
          onChange={e => onInputChange('name', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Organization</label>
        <input
          type="text"
          placeholder="Company Name"
          value={formData.organization || ''}
          onChange={e => onInputChange('organization', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          placeholder="+1234567890"
          value={formData.phone || ''}
          onChange={e => onInputChange('phone', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="john@example.com"
          value={formData.email || ''}
          onChange={e => onInputChange('email', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={formData.website || ''}
          onChange={e => onInputChange('website', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  );
}

export default VcardForm; 