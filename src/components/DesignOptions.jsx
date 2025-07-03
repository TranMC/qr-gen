import React from 'react';

const DesignOptions = ({
  bodyShape,
  setBodyShape,
  eyeBallShape,
  setEyeBallShape,
  errorLevel,
  setErrorLevel,
}) => {
  return (
    <div className="content-wrapper">
      <div className="design-option-group">
        <label className="design-option-label">Body shape:</label>
        <select value={bodyShape} onChange={e => setBodyShape(e.target.value)} className="design-option-select">
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </select>
      </div>
      <div className="design-option-group">
        <label className="design-option-label">Eye ball shape:</label>
        <select value={eyeBallShape} onChange={e => setEyeBallShape(e.target.value)} className="design-option-select">
          <option value="square">Square</option>
          <option value="circle">Circle</option>
          <option value="dot">Dot</option>
        </select>
      </div>
      <div className="design-option-group">
        <label className="design-option-label">Error Correction:</label>
        <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)} className="design-option-select">
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </div>
    </div>
  );
};

export default DesignOptions;
