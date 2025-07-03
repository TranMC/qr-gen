import React from 'react';

const ColorOptions = ({
  colorMode,
  setColorMode,
  fgColor,
  setFgColor,
  fgColor2,
  setFgColor2,
  gradientType,
  setGradientType,
  useCustomEye,
  setUseCustomEye,
  eyeFrameColor,
  setEyeFrameColor,
  eyeBallColor,
  setEyeBallColor,
  bgColor,
  setBgColor,
  handleSwapColors,
}) => {
  return (
    <div className="content-wrapper">
      <div className="color-option-group">
        <label className="color-option-label">Foreground color</label>
        <div className="color-radio-group">
          <label><input type="radio" name="fgmode" checked={colorMode === 'single'} onChange={() => setColorMode('single')} /> Single color</label>
          <label><input type="radio" name="fgmode" checked={colorMode === 'gradient'} onChange={() => setColorMode('gradient')} /> Color gradient</label>
          <label><input type="checkbox" checked={useCustomEye} onChange={() => setUseCustomEye(v => !v)} /> Custom eye color</label>
        </div>
        {colorMode === 'single' && (
          <div className="color-input-group">
            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="color-input" />
            <span className="color-value">{fgColor}</span>
          </div>
        )}
        {colorMode === 'gradient' && (
          <div className="color-input-group">
            <div className="color-input-group">
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="color-input" />
              <span className="color-value">{fgColor}</span>
            </div>
            <button type="button" onClick={handleSwapColors} className="color-swap-btn">↔</button>
            <div className="color-input-group">
              <input type="color" value={fgColor2} onChange={e => setFgColor2(e.target.value)} className="color-input" />
              <span className="color-value">{fgColor2}</span>
            </div>
            <select value={gradientType} onChange={e => setGradientType(e.target.value)} className="gradient-select">
              <option value="linear">Linear Gradient</option>
              <option value="radial">Radial Gradient</option>
            </select>
          </div>
        )}
        {useCustomEye && (
          <div className="eye-color-options">
            <div className="color-input-group">
              <label className="eye-color-label">Eye frame color</label>
              <input type="color" value={eyeFrameColor} onChange={e => setEyeFrameColor(e.target.value)} className="color-input" />
              <span className="color-value">{eyeFrameColor}</span>
            </div>
            <div className="color-input-group">
              <label className="eye-color-label">Eye ball color</label>
              <input type="color" value={eyeBallColor} onChange={e => setEyeBallColor(e.target.value)} className="color-input" />
              <span className="color-value">{eyeBallColor}</span>
            </div>
          </div>
        )}
      </div>
      <div className="background-color-group">
        <label className="color-option-label">Background color</label>
        <div className="color-input-group">
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="color-input" />
          <span className="color-value">{bgColor}</span>
        </div>
      </div>
    </div>
  );
};

export default ColorOptions;
