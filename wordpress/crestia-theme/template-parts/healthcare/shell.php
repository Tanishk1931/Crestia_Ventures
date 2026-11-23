
  <div class="medical-page-canvas">
    <div class="medical-page-background" aria-hidden="true">
      <svg class="medical-page-lines" viewBox="0 0 1440 5000" preserveAspectRatio="none" focusable="false">
        <g class="medical-page-lines-base">
          <path id="medical-page-line-one" class="medical-page-line medical-page-line--primary" pathLength="1000" d="M-120 760 C120 760 280 758 430 758 C540 758 600 755 660 720 C700 695 745 695 790 720 C840 752 900 760 980 760 C1160 760 1360 760 1540 760 C1710 760 1670 1180 1450 1450 C1230 1720 1300 1970 1510 2200 C1720 2430 1360 2700 1220 2970 C1080 3240 1340 3460 1510 3720 C1680 3980 1500 4320 1240 4500 C980 4680 1280 4930 1540 5200"/>
          <path id="medical-page-line-two" class="medical-page-line medical-page-line--secondary" pathLength="1000" d="M1540 -180 C1350 80 1410 300 1280 490 C1200 610 1160 680 1120 760 C1000 980 760 1040 560 1320 C360 1600 300 1880 520 2110 C740 2340 700 2530 430 2780 C160 3030 120 3290 360 3520 C600 3750 660 3980 380 4230 C100 4480 160 4760 -120 5100"/>
        </g>
        <g class="medical-page-pulses">
          <circle class="medical-page-pulse medical-page-pulse--one" r="4" aria-hidden="true">
            <animateMotion dur="74s" repeatCount="indefinite" begin="indefinite" calcMode="paced">
              <mpath href="#medical-page-line-one"/>
            </animateMotion>
          </circle>
          <circle class="medical-page-pulse medical-page-pulse--two" r="4" aria-hidden="true">
            <animateMotion dur="88s" repeatCount="indefinite" begin="indefinite" calcMode="linear" keyPoints="1;0" keyTimes="0;1">
              <mpath href="#medical-page-line-two"/>
            </animateMotion>
          </circle>
        </g>
      </svg>
    </div>
  <header class="navbar navbar-static" id="top">
    <div class="navbar-inner">
      <a class="brand-lockup" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Crestia Ventures home">
        <img class="nav-logo-slot" src="<?php echo esc_url(crestia_asset('assets/images/Gemini_Generated_Image_wglq2wglq2wglq2w.png')); ?>" width="42" height="42" alt="">
        <span class="brand-name">
          <span class="wordmark-line">CRESTIA</span>
          <span class="wordmark-divider"></span>
          <span class="wordmark-line">VENTURES</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="<?php echo esc_url(home_url('/rcm/')); ?>">RCM</a>
        <a href="<?php echo esc_url(home_url('/it/')); ?>">IT Staffing</a>
        <a href="<?php echo esc_url(home_url('/healthcare/')); ?>">Medical Staffing</a>
      </nav>
      <a class="nav-contact" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a>
    </div>
  </header>

  <main>
    <section class="medical-intro" id="medical-intro" aria-label="Cinematic healthcare introduction">
      <div class="medical-hospital" aria-hidden="true">
        <video id="medical-video" autoplay muted playsinline preload="auto" poster="">
          <source src="<?php echo esc_url(crestia_asset('assets/videos/hospital.mp4')); ?>" type="video/mp4">
        </video>
      </div>

      <div class="medical-green" aria-hidden="true"></div>

      <div class="light-wipe" aria-hidden="true">
        <div class="light-core"></div>
        <div class="light-glow"></div>
        <div class="light-point"></div>
      </div>

      <div class="medical-copy" aria-label="Healthcare introduction">
        <p class="medical-eyebrow" id="medical-eyebrow">PEOPLE FIRST. CARE ALWAYS.</p>
        <h1 class="medical-heading medical-editorial-heading" id="medical-heading">
          <span class="medical-word healthcare">Healthcare,</span>
          <span class="medical-word connected medical-editorial-highlight">connected.</span>
        </h1>
        <p class="medical-support" id="medical-support">
          Whether you're building a career or building a team, we bring the right people together to make better care possible.
        </p>
      </div>
    </section>

    <div id="medical-choices-root" data-candidate-url="" data-employer-url=""></div>

    <section class="medical-content" id="medical-content">
      <div class="medical-content-inner">
        <p class="content-eyebrow">Medical</p>
        <h2>People-powered healthcare.</h2>
        <p>Healthcare teams need the right expertise at the right moment. Crestia Ventures connects healthcare organizations with professionals who help care happen.</p>
      </div>
    </section>
  </main>

  <footer class="medical-footer" id="contact">
    <div class="medical-footer-inner">
      <span>&copy; <span id="medical-year">2026</span> Crestia Ventures</span>
      <a href="mailto:info@crestiaventures.com">info@crestiaventures.com</a>
    </div>
  </footer>
  </div>

  
  
  

