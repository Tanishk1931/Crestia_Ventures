import { useEffect, useRef } from 'react';
import { renderPremiumFooter } from '../../../../deployment/godaddy/public_html/shared/premium-footer.js';
import '../../../../deployment/godaddy/public_html/shared/premium-footer.css';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    renderPremiumFooter(footerRef.current);
  }, []);

  return (
    <footer ref={footerRef} data-premium-footer data-footer-theme="home" id="footer" />
  );
}
