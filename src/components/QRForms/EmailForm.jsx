import React from 'react';

function EmailForm({ formData, onInputChange }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>📧 Email Address</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={formData.email || ''}
          onChange={e => onInputChange('email', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Subject</label>
        <input
          type="text"
          placeholder="Email subject"
          value={formData.subject || ''}
          onChange={e => onInputChange('subject', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea
          placeholder="Email message"
          rows="3"
          value={formData.body || ''}
          onChange={e => onInputChange('body', e.target.value)}
          className="form-textarea"
        />
      </div>
    </div>
  );
}

export default EmailForm; 