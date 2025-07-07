import React, { useState, useEffect } from 'react';
import UrlForm from './QR_tab/UrlForm';
import FacebookForm from './QR_tab/FacebookForm';
import TextForm from './QR_tab/TextForm';
import EmailForm from './QR_tab/EmailForm';
import PhoneForm from './QR_tab/PhoneForm';
import LocationForm from './QR_tab/LocationForm';
import WifiForm from './QR_tab/WifiForm';
import VcardForm from './QR_tab/VcardForm';
import GoogleReviewForm from './QR_tab/GoogleReviewForm';

const defaults = {
  URL: { url: '' },
  FACEBOOK: { facebook: '' },
  TEXT: { text: '' },
  EMAIL: { email: '', subject: '', body: '' },  
  PHONE: { phone: '' },
  LOCATION: { latitude: '', longitude: '', address: '', searchLocation: '' },
  WIFI: { ssid: '', password: '', security: 'WPA' },
  VCARD: { name: '', organization: '', phone: '', email: '', website: '' },
  'GOOGLE REVIEW': { reviewUrl: '' }
};

function QRFormContent({ activeTab, onDataChange, resetForm, formData, setFormData }) {
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    setFormData({ ...defaults[activeTab] })
    // eslint-disable-next-line
  }, [activeTab, resetForm])

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const searchLocation = async (query) => {
    setLocationError('');
    if (!query) return;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=pk.eyJ1IjoidHJhbm1jIiwiYSI6ImNtOXY3M2ZhbjBoZ3Qya213dW95anU0cXYifQ.pD8gRgAT2d-OogFUOiArKQ&limit=1`
      );
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const coords = data.features[0].center;
        const newData = { ...formData, latitude: coords[1], longitude: coords[0] };
        setFormData(newData);
        onDataChange(newData);
        setLocationError('');
      } else {
        setLocationError('Không tìm thấy địa điểm phù hợp.');
      }
    } catch (err) {
      setLocationError('Lỗi khi tìm kiếm địa điểm.');
    }
  }

  switch (activeTab) {
    case 'URL':
      return <UrlForm formData={formData} onInputChange={handleInputChange} />
    case 'FACEBOOK':
      return <FacebookForm formData={formData} onInputChange={handleInputChange} />
    case 'TEXT':
      return <TextForm formData={formData} onInputChange={handleInputChange} />
    case 'EMAIL':
      return <EmailForm formData={formData} onInputChange={handleInputChange} />
    case 'PHONE':
      return <PhoneForm formData={formData} onInputChange={handleInputChange} />
    case 'LOCATION':
      return <LocationForm formData={formData} onInputChange={handleInputChange} locationError={locationError} onSearchLocation={searchLocation} />
    case 'WIFI':
      return <WifiForm formData={formData} onInputChange={handleInputChange} />
    case 'VCARD':
      return <VcardForm formData={formData} onInputChange={handleInputChange} />
    case 'GOOGLE REVIEW':
      return <GoogleReviewForm formData={formData} onInputChange={handleInputChange} />
    default:
      return <div>Select a tab to start generating QR codes</div>
  }
}

export default QRFormContent;
