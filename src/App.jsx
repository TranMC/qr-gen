import './App.css';

function App() {
  return (
    <div className="qr-app-root">
      <header className="qr-header">
        <div className="qr-header-inner">
          <img src="https://apps3.omegatheme.com/qr-code-generator-frontend/_nuxt/img/logo-qr.1e2e2e2.svg" alt="QR Logo" className="qr-logo" />
          <div className="qr-header-title-group">
            <h1 className="qr-title">QR Code Generator</h1>
            <p className="qr-subtitle">Tạo mã QR miễn phí, nhanh chóng và dễ dàng</p>
          </div>
        </div>
      </header>
      <main className="qr-main">
        <form className="qr-form-horizontal">
          <input id="qr-input" type="text" placeholder="Nhập văn bản hoặc URL..." className="qr-input" />
          <button type="button" className="qr-generate-btn">Tạo mã QR</button>
        </form>
        <div className="qr-center-block">
          <div className="qr-display">
            <div className="qr-placeholder">
              <span>QR Code sẽ hiển thị ở đây</span>
            </div>
          </div>
          <div className="qr-options-row">
            <button type="button" className="qr-download-btn" disabled>
              <span className="qr-download-icon">⬇️</span> PNG
            </button>
            <button type="button" className="qr-download-btn" disabled>
              <span className="qr-download-icon">⬇️</span> SVG
            </button>
          </div>
        </div>
      </main>
      <footer className="qr-footer">
        <span>© 2024 QR Code Generator. Powered by OmegaTheme.</span>
      </footer>
    </div>
  );
}

export default App;
