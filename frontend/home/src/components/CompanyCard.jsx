import { brand } from '../data/brand.js';

export default function CompanyCard({ cardRef }) {
  return (
    <article
      ref={cardRef}
      id="company-card"
      className="company-card"
      aria-labelledby="company-title"
    >
      <div className="card-topline">
        <span className="eyebrow">A little about us</span>
        <span className="card-index">01 / 01</span>
      </div>

      <div className="card-heading">
        <p className="card-kicker">{brand.shortName} · EST. 20XX</p>
        <h2 id="company-title">{brand.tagline}</h2>
        <p className="card-intro">{brand.introduction}</p>
      </div>

      <div className="card-details">
        <div>
          <span className="detail-label">What we do</span>
          <p>{brand.offering}</p>
        </div>
        <div>
          <span className="detail-label">Our point of view</span>
          <p>{brand.vision}</p>
        </div>
      </div>

      <a className="card-link" href="#contact">
        Explore our world <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
