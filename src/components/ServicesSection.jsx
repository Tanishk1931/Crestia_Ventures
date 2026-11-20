import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const services = [
  {
    name: 'Revenue Cycle Management',
    category: 'Revenue operations',
    description:
      'Connecting healthcare organizations with skilled revenue cycle professionals to optimize medical billing, coding, claims management, and financial operations.',
    action: 'DISCOVER RCM',
    images: [
      {
        src: '/assets/service-revenue-cycle.jpg',
        alt: 'Revenue cycle professional reviewing paperwork',
        caption: 'Revenue operations',
      },
      {
        src: '/assets/showcase-rcm-team.jpg',
        alt: 'Healthcare professional working at a computer',
        caption: 'Healthcare administration',
      },
    ],
  },
  {
    name: 'Medical Staffing',
    category: 'Healthcare recruitment & staffing',
    description:
      'Connecting healthcare organizations with qualified clinical and non-clinical professionals across nursing, allied health, clinical support, and healthcare administration.',
    action: 'DISCOVER MEDICAL STAFFING',
    images: [
      {
        src: '/assets/showcase-medical-staffing.jpg',
        alt: 'A medical professional wearing a white coat and stethoscope',
        caption: 'Clinical workforce',
      },
      {
        src: '/assets/service-healthcare-staffing.jpg',
        alt: 'Healthcare professionals working together in surgery',
        caption: 'Care teams',
      },
    ],
  },
  {
    name: 'IT Staffing',
    category: 'Technology recruitment & staffing',
    description:
      'Building high-performing technology teams by connecting businesses with skilled IT professionals across software development, cloud, infrastructure, and emerging technologies.',
    action: 'DISCOVER IT STAFFING',
    images: [
      {
        src: '/assets/service-it-staffing.jpg',
        alt: 'Technology team collaborating around laptops',
        caption: 'Technology teams',
      },
      {
        src: '/assets/showcase-it-developer.jpg',
        alt: 'Close view of a software developer working with code',
        caption: 'Software development',
      },
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return undefined;

    const slides = [...section.querySelectorAll('.showcase-slide')];
    const progressFill = section.querySelector('.showcase-progress-fill');
    const progressStep = section.querySelector('.showcase-progress-step');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 600px)').matches;
    const travel = reducedMotion ? 0 : 90;
    const rotation = reducedMotion ? 0 : mobile ? 5 : 9;
    const travelDuration = reducedMotion ? 0.12 : 0.85;

    const context = gsap.context(() => {
      slides.forEach((slide, index) => {
        const left = slide.querySelector('.showcase-image--left');
        const right = slide.querySelector('.showcase-image--right');
        const content = slide.querySelector('.showcase-content');
        const isFirst = index === 0;

        gsap.set(slide, {
          autoAlpha: isFirst ? 1 : 0,
          pointerEvents: 'none',
        });
        gsap.set(left, {
          autoAlpha: 0,
          xPercent: -travel,
          yPercent: mobile ? 0 : -46,
          y: isFirst ? 24 : 38,
          rotation: isFirst ? -rotation : rotation,
          scale: 0.91,
        });
        gsap.set(right, {
          autoAlpha: 0,
          xPercent: travel,
          yPercent: mobile ? 0 : -54,
          y: isFirst ? 32 : 20,
          rotation: isFirst ? rotation : -rotation,
          scale: 0.91,
        });
        gsap.set(content, {
          autoAlpha: isFirst ? 1 : 0,
          xPercent: -50,
          yPercent: -50,
          y: 22,
        });
      });

      const stageGap = 1.2;
      const timelineDuration = (slides.length - 1) * stageGap + travelDuration + 0.06;
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? true : 0.8,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const elapsed = progress * timelineDuration;
            const activeIndex = Math.min(
              slides.length - 1,
              Math.floor(elapsed / stageGap),
            );
            slides.forEach((slide, index) => {
              const isActive = index === activeIndex;
              slide.style.pointerEvents = isActive ? 'auto' : 'none';
              slide.setAttribute('aria-hidden', String(!isActive));
            });
            progressStep.textContent = `0${activeIndex + 1} / 0${slides.length}`;
            gsap.set(progressFill, { scaleX: progress });
          },
        },
      });

      const enter = (slide, position) => {
        timeline
          .to(slide, { autoAlpha: 1, duration: 0.01 }, position)
          .to(slide.querySelector('.showcase-image--left'), {
            autoAlpha: 1,
            xPercent: 0,
            y: 0,
            rotation: -rotation * 0.65,
            scale: 1,
            duration: travelDuration,
          }, position)
          .to(slide.querySelector('.showcase-image--right'), {
            autoAlpha: 1,
            xPercent: 0,
            y: 0,
            rotation: rotation * 0.65,
            scale: 1,
            duration: travelDuration,
          }, position + 0.06)
          .to(slide.querySelector('.showcase-content'), {
            autoAlpha: 1,
            y: 0,
            duration: travelDuration * 0.78,
          }, position + 0.12);
      };

      const leave = (slide, position) => {
        timeline
          .to(slide.querySelector('.showcase-image--left'), {
            autoAlpha: 0,
            xPercent: -travel,
            y: -42,
            rotation: -rotation * 1.5,
            scale: 0.9,
            duration: travelDuration,
          }, position)
          .to(slide.querySelector('.showcase-image--right'), {
            autoAlpha: 0,
            xPercent: travel,
            y: 40,
            rotation: rotation * 1.5,
            scale: 0.9,
            duration: travelDuration,
          }, position)
          .to(slide.querySelector('.showcase-content'), {
            autoAlpha: 0,
            y: -18,
            duration: travelDuration * 0.68,
          }, position);
      };

      enter(slides[0], 0);
      for (let index = 1; index < slides.length; index += 1) {
        const transitionAt = index * stageGap;
        leave(slides[index - 1], transitionAt);
        enter(slides[index], transitionAt);
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      className="services-section"
      id="services"
      ref={sectionRef}
      aria-label="Crestia Ventures services"
    >
      <div className="services-stage">
        <p className="showcase-overline">
          <span className="eyebrow-rule" />
          Featured services <span className="showcase-overline-index">01 — 03</span>
        </p>

        {services.map((service, index) => (
          <article
            className="showcase-slide"
            key={service.name}
            aria-hidden={index !== 0}
          >
            {service.images.map((image, imageIndex) => (
              <figure
                className={`showcase-image showcase-image--${imageIndex === 0 ? 'left' : 'right'}`}
                key={image.src}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span>{image.caption}</span>
                  <span aria-hidden="true">0{imageIndex + 1}</span>
                </figcaption>
              </figure>
            ))}

            <div className="showcase-content">
              <span className="showcase-category">{service.category}</span>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <a className="showcase-cta" href="#contact">
                {service.action}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}

        <div className="showcase-progress" aria-label="Service showcase progress">
          <span className="showcase-progress-label">Service showcase</span>
          <span className="showcase-progress-step">01 / 03</span>
          <span className="showcase-progress-track" aria-hidden="true">
            <span className="showcase-progress-fill" />
          </span>
          <span className="showcase-progress-end" aria-hidden="true">03</span>
        </div>
      </div>
    </section>
  );
}
