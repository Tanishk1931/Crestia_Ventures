export function renderPremiumFooter(host) {
  if (!host || host.dataset.premiumFooterReady === "true") return;
  host.dataset.premiumFooterReady = "true";

  var theme = host.dataset.footerTheme || "home";
  host.className = (host.className + " crestia-footer").trim();
  host.setAttribute("data-footer-theme", theme);
  var homeDetails = theme === "home"
    ? '<section class="crestia-footer-brand" aria-label="About Crestia Ventures">' +
        '<p class="crestia-footer-brand-category">Healthcare &middot; IT &middot; Revenue Cycle Management</p>' +
        '<h2>Crestia Ventures</h2>' +
        '<p>An integrated partner for healthcare revenue operations, technology recruitment, and healthcare workforce solutions.</p>' +
        '<a href="mailto:info@crestiaventures.com">info@crestiaventures.com</a>' +
      '</section>'
    : '';

  host.innerHTML =
      '<div class="crestia-footer-inner">' +
        homeDetails +
        '<div class="crestia-footer-grid">' +
          '<section class="crestia-footer-column" aria-labelledby="footer-services-' + theme + '">' +
            '<h2 class="crestia-footer-heading" id="footer-services-' + theme + '">Our Services</h2>' +
            '<ul class="crestia-footer-links">' +
              '<li><a href="/rcm/">Revenue Cycle Management</a></li>' +
              '<li><a href="/it/">IT Recruitment &amp; Staffing</a></li>' +
              '<li><a href="/medical/">Healthcare Recruitment &amp; Staffing</a></li>' +
            '</ul>' +
          '</section>' +
          '<section class="crestia-footer-column" aria-labelledby="footer-candidates-' + theme + '">' +
            '<h2 class="crestia-footer-heading" id="footer-candidates-' + theme + '">For Candidates</h2>' +
            '<ul class="crestia-footer-links">' +
              '<li><a href="/medical/#medical-choices-root">Career Opportunities</a></li>' +
              '<li><a href="/medical/#medical-choices-root">Career Guidance</a></li>' +
            '</ul>' +
          '</section>' +
          '<section class="crestia-footer-column" aria-labelledby="footer-employers-' + theme + '">' +
            '<h2 class="crestia-footer-heading" id="footer-employers-' + theme + '">For Employers</h2>' +
            '<ul class="crestia-footer-links">' +
              '<li><a href="/it/#contact">Hire Talent</a></li>' +
              '<li><a href="/it/#expertise">IT Staffing</a></li>' +
              '<li><a href="/medical/">Healthcare Staffing</a></li>' +
              '<li><a href="/it/#contact">Submit a Requirement</a></li>' +
            '</ul>' +
          '</section>' +
          '<section class="crestia-footer-column" aria-labelledby="footer-contact-' + theme + '">' +
            '<h2 class="crestia-footer-heading" id="footer-contact-' + theme + '">Get in Touch</h2>' +
            '<ul class="crestia-footer-links">' +
              '<li><a href="https://crestiaventures.com" target="_blank" rel="noopener noreferrer">crestiaventures.com</a></li>' +
              '<li><a href="tel:+19293993984">+1 (929) 399-3984</a></li>' +
              '<li><a href="#contact">Let\'s Connect</a></li>' +
              '<li><span class="crestia-footer-developer"><a href="[LinkedIn Profile URL]" target="_blank" rel="noopener noreferrer">Designed &amp; Developed by [Developer Name]</a><a class="crestia-footer-linkedin" href="[LinkedIn Profile URL]" target="_blank" rel="noopener noreferrer" aria-label="Developer LinkedIn profile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 8.1H1.8V22h3.5V8.1ZM3.55 2A2.05 2.05 0 1 0 3.55 6.1 2.05 2.05 0 0 0 3.55 2ZM22.2 14.1c0-4.18-2.23-6.12-5.2-6.12-2.4 0-3.48 1.32-4.08 2.25V8.1H9.4V22h3.52v-6.88c0-1.82.34-3.58 2.6-3.58 2.22 0 2.25 2.08 2.25 3.7V22h3.52l-.09-7.9Z"/></svg></a></span></li>' +
            '</ul>' +
          '</section>' +
        '</div>' +
        '<div class="crestia-footer-bottom">' +
          '<span>© 2026 Crestia Ventures. All rights reserved.</span>' +
          '<nav class="crestia-footer-legal" aria-label="Legal">' +
            '<a href="mailto:info@crestiaventures.com?subject=Privacy%20Policy%20Request">Privacy Policy</a>' +
            '<span class="crestia-footer-legal-separator" aria-hidden="true">·</span>' +
            '<a href="mailto:info@crestiaventures.com?subject=Terms%20and%20Conditions%20Request">Terms &amp; Conditions</a>' +
          '</nav>' +
        '</div>' +
      '</div>';
}

document.querySelectorAll("footer[data-premium-footer]").forEach(renderPremiumFooter);
