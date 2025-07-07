import React from 'react';

function PhoneForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>📞 Phone Number</label>
        <input
          type="tel"
          placeholder="+1234567890"
          value={formData.phone || ''}
          onChange={e => onInputChange('phone', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  );
}

export default PhoneForm; 