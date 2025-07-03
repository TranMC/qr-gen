import React from 'react';

function LocationForm({ formData, onInputChange, locationError, onSearchLocation }) {
  return (
    <div className="form-content">
      <div className="form-group">
        <label>📍 Search Location</label>
        <input
          type="text"
          placeholder="Search for a place..."
          value={formData.searchLocation || ''}
          onChange={e => onInputChange('searchLocation', e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onSearchLocation(e.target.value)}
          className="form-input"
        />
        <button 
          type="button" 
          className="search-btn"
          onClick={() => onSearchLocation(formData.searchLocation)}
        >
          🔍 Search
        </button>
        {locationError && <div className="location-error">{locationError}</div>}
      </div>
      <div className="map-container">
        <iframe
          src={
            formData.latitude && formData.longitude
              ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.longitude)-0.01}%2C${parseFloat(formData.latitude)-0.01}%2C${parseFloat(formData.longitude)+0.01}%2C${parseFloat(formData.latitude)+0.01}&layer=mapnik&marker=${formData.latitude}%2C${formData.longitude}`
              : 'https://www.openstreetmap.org/export/embed.html?bbox=105.8%2C20.9%2C106.0%2C21.1&layer=mapnik&marker=21.0285%2C105.8542'
          }
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
            onChange={e => onInputChange('latitude', e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>📍 Longitude</label>
          <input
            type="number"
            step="any"
            placeholder="-122.4194"
            value={formData.longitude || ''}
            onChange={e => onInputChange('longitude', e.target.value)}
            className="form-input"
          />
        </div>
      </div>
      <div className="location-info-text">
        <small>💡 You can search for a location above or enter coordinates directly</small>
      </div>
    </div>
  );
}

export default LocationForm; 