import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoidHJhbm1jIiwiYSI6ImNtOXY3M2ZhbjBoZ3Qya213dW95anU0cXYifQ.pD8gRgAT2d-OogFUOiArKQ';

const MAP_STYLES = [
  { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v11' },
  { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
  { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v10' },
  { label: 'Light', value: 'mapbox://styles/mapbox/light-v10' },
];

function LocationForm({ formData, onInputChange, locationError, onSearchLocation }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0].value);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchInput, setSearchInput] = useState(formData.searchLocation || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Khởi tạo map
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [
        formData.longitude ? parseFloat(formData.longitude) : 105.8542,
        formData.latitude ? parseFloat(formData.latitude) : 21.0285
      ],
      zoom: 15
    });
    // Thêm marker nếu có tọa độ
    if (formData.latitude && formData.longitude) {
      marker.current = new mapboxgl.Marker({ color: '#e91e63' })
        .setLngLat([
          parseFloat(formData.longitude),
          parseFloat(formData.latitude)
        ])
        .addTo(map.current);
      // Gắn popup vào marker, không addTo map
      popup.current = new mapboxgl.Popup({ offset: 25 })
        .setText(`Lat: ${formData.latitude}, Lng: ${formData.longitude}`);
      marker.current.setPopup(popup.current);
      // Chỉ mở popup khi click marker
      marker.current.getElement().addEventListener('click', () => {
        marker.current.togglePopup();
      });
    }
    // Click để chọn vị trí
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onInputChange('latitude', lat);
      onInputChange('longitude', lng);
    });
    // Resize map sau khi mount để fix hiển thị
    setTimeout(() => {
      map.current && map.current.resize();
    }, 200);
  }, []);

  // Đổi style bản đồ
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Cập nhật marker & popup khi lat/lng thay đổi
  useEffect(() => {
    if (!map.current) return;
    if (formData.latitude && formData.longitude) {
      map.current.setCenter([
        parseFloat(formData.longitude),
        parseFloat(formData.latitude)
      ]);
      // Xóa marker cũ nếu có
      if (marker.current) marker.current.remove();
      if (popup.current) popup.current.remove();
      // Thêm marker mới
      marker.current = new mapboxgl.Marker({ color: '#e91e63' })
        .setLngLat([
          parseFloat(formData.longitude),
          parseFloat(formData.latitude)
        ])
        .addTo(map.current);
      // Gắn popup vào marker, không addTo map
      popup.current = new mapboxgl.Popup({ offset: 25 })
        .setText(`Lat: ${formData.latitude}, Lng: ${formData.longitude}`);
      marker.current.setPopup(popup.current);
      marker.current.getElement().addEventListener('click', () => {
        marker.current.togglePopup();
      });
    }
  }, [formData.latitude, formData.longitude]);

  // Autocomplete search box (Mapbox Geocoding API)
  useEffect(() => {
    if (!searchInput) {
      setSearchSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=5`,
        { signal: controller.signal }
      );
      const data = await res.json();
      if (data && data.features) {
        setSearchSuggestions(data.features);
      }
    };
    fetchSuggestions();
    return () => controller.abort();
  }, [searchInput]);

  const handleSuggestionClick = (feature) => {
    setShowSuggestions(false);
    setSearchInput(feature.place_name);
    onInputChange('searchLocation', feature.place_name);
    onInputChange('latitude', feature.center[1]);
    onInputChange('longitude', feature.center[0]);
  };

  return (
    <div className="form-content">
      <div className="form-group">
        <label>📍 Search Location</label>
        <input
          type="text"
          placeholder="Search for a place..."
          value={searchInput}
          onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          className="form-input"
          autoComplete="off"
        />
        {showSuggestions && searchSuggestions.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, marginTop: 2, position: 'absolute', zIndex: 10, width: '100%' }}>
            {searchSuggestions.map((feature) => (
              <div
                key={feature.id}
                style={{ padding: 8, cursor: 'pointer' }}
                onClick={() => handleSuggestionClick(feature)}
              >
                {feature.place_name}
              </div>
            ))}
          </div>
        )}
        <button 
          type="button" 
          className="search-btn"
          onClick={() => onSearchLocation(searchInput)}
        >
          🔍 Search
        </button>
        {locationError && <div className="location-error">{locationError}</div>}
      </div>
      <div className="form-group">
        <label>🗺️ Map Style</label>
        <select
          value={mapStyle}
          onChange={e => setMapStyle(e.target.value)}
          className="form-select"
        >
          {MAP_STYLES.map(style => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>
      </div>
      <div className="map-container" style={{ height: 400, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
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
        <small>💡 Bạn có thể tìm kiếm địa điểm, chọn style bản đồ, click lên bản đồ để lấy tọa độ hoặc nhập thủ công</small>
      </div>
    </div>
  );
}

export default LocationForm; 