import React, { useState } from 'react';
import { qrAdvantagesData } from '../assets/qrAdvantagesData';
import './QrAdvantages.css';

const categories = [
  { key: 'business', label: 'Business' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'freelancer', label: 'Freelancer' },
];

export default function QrAdvantages() {
  const [active, setActive] = useState('business');

  let gridClass = '';
  if (active === 'business') gridClass = 'qr-advantages-grid-business';
  else if (active === 'marketing') gridClass = 'qr-advantages-grid-marketing';
  else if (active === 'freelancer') gridClass = 'qr-advantages-grid-freelancer';

  // Helper render cho từng loại
  function renderBusiness() {
    return qrAdvantagesData.business.map((item, idx) => (
      <div className="qr-adv-card" key={idx}>
        {item.link ? (
          <img className="qr-adv-img-placeholder" src={item.link} alt={item.title} />
        ) : (
          <div className="qr-adv-img-placeholder" />
        )}
        <div className="qr-adv-title">{item.title}</div>
      </div>
    ));
  }

  function renderMarketing() {
    // 3 hàng, mỗi hàng 2 ảnh, 1 title chung dưới ảnh
    const rows = [
      [0, 1], // hàng 1
      [2, 3], // hàng 2
      [4, 5], // hàng 3
    ];
    return rows.map((pair, rowIdx) => {
      const imgs = pair.map((i) => {
        const item = qrAdvantagesData.marketing[i];
        return (
          <div className="qr-adv-card" key={i}>
            {item.link ? (
              <img className="qr-adv-img-placeholder" src={item.link} alt={item.title} />
            ) : (
              <div className="qr-adv-img-placeholder" />
            )}
          </div>
        );
      });
      const title = qrAdvantagesData.marketing[pair[0]].title;
      return (
        <div className="qr-adv-group" key={`marketing-group-${rowIdx}`} style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {imgs}
          </div>
          <div className="qr-adv-title marketing-row-title" style={{ marginTop: 8, textAlign: 'center' }}>
            {title}
          </div>
        </div>
      );
    });
  }

  function renderFreelancer() {
    // 2 ảnh đầu
    const img1 = qrAdvantagesData.freelancer[0];
    const img2 = qrAdvantagesData.freelancer[1];
    // wide
    const wide = qrAdvantagesData.freelancer[2];
    // 2 ảnh cuối
    const img3 = qrAdvantagesData.freelancer[3];
    const img4 = qrAdvantagesData.freelancer[4];
    return [
      <div className="qr-adv-card" key={0}>
        {img1.link ? (
          <img className="qr-adv-img-placeholder" src={img1.link} alt={img1.title} />
        ) : (
          <div className="qr-adv-img-placeholder" />
        )}
        <div className="qr-adv-title">{img1.title}</div>
      </div>,
      <div className="qr-adv-card" key={1}>
        {img2.link ? (
          <img className="qr-adv-img-placeholder" src={img2.link} alt={img2.title} />
        ) : (
          <div className="qr-adv-img-placeholder" />
        )}
        <div className="qr-adv-title">{img2.title}</div>
      </div>,
      // wide card riêng biệt
      <div className="qr-adv-card freelancer-wide" key={2} style={{ gridColumn: '1 / -1' }}>
        {wide.link ? (
          <img className="qr-adv-img-wide-placeholder" src={wide.link} alt={wide.title} />
        ) : (
          <div className="qr-adv-img-wide-placeholder" />
        )}
        <div className="qr-adv-title">{wide.title}</div>
      </div>,
      // group 2 ảnh cuối + title chung
      <div className="qr-adv-group" key="freelancer-group" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div className="qr-adv-card" style={{ paddingBottom: 0 }}>
            {img3.link ? (
              <img className="qr-adv-img-placeholder" src={img3.link} alt={img3.title} />
            ) : (
              <div className="qr-adv-img-placeholder" />
            )}
          </div>
          <div className="qr-adv-card" style={{ paddingBottom: 0 }}>
            {img4.link ? (
              <img className="qr-adv-img-placeholder" src={img4.link} alt={img4.title} />
            ) : (
              <div className="qr-adv-img-placeholder" />
            )}
          </div>
        </div>
        <div className="qr-adv-title freelancer-row-title" style={{ marginTop: 8, textAlign: 'center' }}>
          Connecting Clients to Your Contact Details
        </div>
      </div>,
    ];
  }

  return (
    <div className="qr-advantages-container">
      <div className="qr-advantages-left">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className={`qr-adv-dropdown ${active === cat.key ? 'active' : ''}`}
            onClick={() => setActive(cat.key)}
          >
            <div className="qr-adv-dropdown-header">
              <span>{cat.label}</span>
              <span className={`arrow ${active === cat.key ? 'open' : ''}`}>▼</span>
            </div>
            <div
              className={`qr-adv-dropdown-content ${
                active === cat.key ? 'show' : ''
              }`}
            >
              {cat.key === 'business' && (
                <p>
                  Drive engagement, simplify interactions, gather feedback and enhance marketing efforts seamlessly.
                </p>
              )}
              {cat.key === 'marketing' && (
                <p>
                  Boost your campaigns, track engagement, and reach your audience more effectively.
                </p>
              )}
              {cat.key === 'freelancer' && (
                <p>
                  Showcase your portfolio, share contact info, and connect with clients easily.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="qr-advantages-right">
        <div className={gridClass}>
          {active === 'business' && renderBusiness()}
          {active === 'marketing' && renderMarketing()}
          {active === 'freelancer' && renderFreelancer()}
        </div>
      </div>
    </div>
  );
} 