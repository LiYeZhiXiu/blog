import React, { Component } from 'react';
import '../css/Footer.less';


class Footer extends Component {
  render() {
    return (
      <footer className="blog-footer">
        <div className="footer-content">
          <p className="copyright">
            © 2020 - {new Date().getFullYear()} <span className="heart">❤</span> HUYIMIN
          </p>
          <p className="footer-links">
            {/* 浙公网安备 33010602011771号 浙ICP备2021040463号-3 */}
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;