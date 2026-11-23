<?php
/**
 * Home page markup (migrated from React).
 *
 * @package Crestia
 */
$img = static function (string $path): string {
	return esc_url(crestia_asset('assets/home/' . ltrim($path, '/')));
};
?>
<canvas class="shader-background-canvas" id="crestia-shader" aria-hidden="true"></canvas>

<header class="navbar" id="site-navbar">
	<div class="navbar-inner">
		<a class="brand-lockup" href="#brand-story" aria-label="Crestia Ventures home">
			<span class="nav-logo-slot" id="nav-logo-slot" role="img" aria-label="Crestia Ventures three-dimensional logo"></span>
			<span class="brand-name" id="nav-wordmark" aria-hidden="true">
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
	</div>
</header>

<div class="brand-canvas-host" id="brand-canvas-host" aria-hidden="true"></div>

<main>
	<div class="story-track" id="brand-story">
		<section class="hero-copy" id="hero-copy" aria-label="Brand introduction">
			<p class="eyebrow hero-eyebrow" id="hero-eyebrow">
				<span class="eyebrow-rule"></span>
				Healthcare • IT • Revenue Cycle Management
			</p>
			<div class="hero-wordmark" id="hero-wordmark" aria-label="Crestia Ventures">
				<span class="wordmark-line">CRESTIA</span>
				<span class="wordmark-divider" aria-hidden="true"></span>
				<span class="wordmark-line">VENTURES</span>
			</div>
			<div class="hero-support" id="hero-support">
				<h1 class="hero-headline">
					<span>Stronger operations.</span>
					<span>Better talent.</span>
				</h1>
				<p class="hero-description">An integrated partner for healthcare revenue operations, technology recruitment, and healthcare workforce solutions.</p>
				<a href="#brand-story" class="scroll-cue">
					<span>Scroll to discover</span>
					<span class="scroll-cue-line" aria-hidden="true"></span>
				</a>
			</div>
		</section>

		<section class="logo-reveal" id="logo-reveal" aria-hidden="true">
			<p class="reveal-kicker">FOUR ELEMENTS. ONE IDENTITY.</p>
		</section>

		<div id="story-progress" class="story-progress-label" aria-hidden="true">
			<span>Scroll to explore</span>
			<span class="progress-line"></span>
		</div>
	</div>

	<section class="about-track" id="company-card" aria-label="A little about us" style="--scroll-length: 250vh; --micro-duration: 220ms; --ui-ease: cubic-bezier(0.2, 0.7, 0.2, 1);">
		<div class="about-stage" id="about-stage">
			<div class="about-imageDepth" id="about-image-depth">
				<div class="about-imageLayer" aria-hidden="false">
					<img src="<?php echo $img('about/rcm-1600.webp'); ?>" srcset="<?php echo $img('about/rcm-800.webp'); ?> 800w, <?php echo $img('about/rcm-1600.webp'); ?> 1600w" sizes="(max-width: 600px) 100vw, 1600px" alt="Hands reviewing documents beside a laptop in warm daylight" width="1600" height="1067" loading="eager" decoding="async">
				</div>
				<div class="about-imageLayer" aria-hidden="true">
					<img src="<?php echo $img('about/it-1600.webp'); ?>" srcset="<?php echo $img('about/it-800.webp'); ?> 800w, <?php echo $img('about/it-1600.webp'); ?> 1600w" sizes="(max-width: 600px) 100vw, 1600px" alt="A team working around laptops at a shared desk" width="1600" height="1067" loading="lazy" decoding="async">
				</div>
				<div class="about-imageLayer" aria-hidden="true">
					<img src="<?php echo $img('about/healthcare-1600.webp'); ?>" srcset="<?php echo $img('about/healthcare-800.webp'); ?> 800w, <?php echo $img('about/healthcare-1600.webp'); ?> 1600w" sizes="(max-width: 600px) 100vw, 1600px" alt="A clinician in a white coat using a phone with a stethoscope" width="1600" height="1067" loading="lazy" decoding="async">
				</div>
			</div>
			<div class="about-vignette" id="about-vignette"></div>
			<div class="about-grain" aria-hidden="true"></div>
			<div class="about-content">
				<header class="about-intro">
					<div class="about-overline">
						<span class="about-eyebrow">A LITTLE ABOUT US</span>
						<span class="about-counter" id="about-counter" aria-live="polite">01 / 03</span>
					</div>
					<h2 class="about-headline">
						<span class="about-headlineMask"><span data-headline-line>Stronger operations.</span></span>
						<span class="about-headlineMask"><span data-headline-line>Better talent.</span></span>
					</h2>
					<p class="about-subcopy" data-intro-detail>An integrated partner for healthcare revenue operations, technology recruitment, and healthcare workforce solutions.</p>
					<p class="about-positioning" data-intro-detail>Purpose-built for the U.S. market.</p>
				</header>
				<div class="about-chapterArea">
					<article class="about-chapterPanel" id="about-panel-revenue" role="tabpanel" aria-labelledby="about-tab-revenue" aria-hidden="false" tabindex="0">
						<h3 class="about-chapterTitle"><span data-copy>Revenue Cycle Management</span></h3>
						<p class="about-chapterDescription"><span data-copy>Move from fragmented billing activity to connected revenue operations.</span></p>
						<div class="about-chips">
							<?php foreach (['Eligibility','Coding support','Claims','Denials','AR follow-up','Payment posting','Credentialing','Reporting'] as $i => $chip) : ?>
								<span class="about-chipFloat" <?php echo $i < 3 ? 'data-float-chip' : ''; ?>><span class="about-chip" data-chip><?php echo esc_html($chip); ?></span></span>
							<?php endforeach; ?>
						</div>
					</article>
					<article class="about-chapterPanel" id="about-panel-it" role="tabpanel" aria-labelledby="about-tab-it" aria-hidden="true" tabindex="-1">
						<h3 class="about-chapterTitle"><span data-copy>IT Recruitment &amp; Staffing</span></h3>
						<p class="about-chapterDescription"><span data-copy>Build the capacity to deliver technology projects with confidence.</span></p>
						<div class="about-chips">
							<?php foreach (['Software','Cloud & DevOps','Data & Analytics','Cybersecurity','Enterprise platforms','Infrastructure & Support'] as $i => $chip) : ?>
								<span class="about-chipFloat" <?php echo $i < 3 ? 'data-float-chip' : ''; ?>><span class="about-chip" data-chip><?php echo esc_html($chip); ?></span></span>
							<?php endforeach; ?>
						</div>
					</article>
					<article class="about-chapterPanel" id="about-panel-healthcare" role="tabpanel" aria-labelledby="about-tab-healthcare" aria-hidden="true" tabindex="-1">
						<h3 class="about-chapterTitle"><span data-copy>Healthcare Recruitment</span></h3>
						<p class="about-chapterDescription"><span data-copy>Place clinical and non-clinical talent where care delivery depends on it.</span></p>
						<div class="about-chips">
							<?php foreach (['Nursing','Allied health','Clinical support','Administration','Healthcare IT'] as $i => $chip) : ?>
								<span class="about-chipFloat" <?php echo $i < 3 ? 'data-float-chip' : ''; ?>><span class="about-chip" data-chip><?php echo esc_html($chip); ?></span></span>
							<?php endforeach; ?>
						</div>
					</article>
				</div>
				<footer class="about-footer">
					<p class="about-closingLine" data-footer-item>One relationship. Three ways to move your business forward.</p>
					<a class="about-cta" href="#contact" id="about-cta" data-footer-item>Explore our world <span aria-hidden="true">↗</span></a>
					<div class="about-chapterControls" data-footer-item>
						<div class="about-chapterProgress" id="about-progress" role="progressbar" aria-label="Chapter progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
							<span class="about-chapterProgressFill" id="about-progress-fill"></span>
						</div>
						<div class="about-tabList" role="tablist" aria-label="About divisions">
							<span class="about-tabIndicator" id="about-tab-indicator" aria-hidden="true"></span>
							<button class="about-tab" id="about-tab-revenue" type="button" role="tab" aria-selected="true" aria-controls="about-panel-revenue" data-about-tab="0">Revenue Cycle</button>
							<button class="about-tab" id="about-tab-it" type="button" role="tab" aria-selected="false" aria-controls="about-panel-it" data-about-tab="1">IT Staffing</button>
							<button class="about-tab" id="about-tab-healthcare" type="button" role="tab" aria-selected="false" aria-controls="about-panel-healthcare" data-about-tab="2">Healthcare</button>
						</div>
					</div>
				</footer>
			</div>
		</div>
	</section>

	<section class="services-section" id="services" aria-label="Crestia Ventures services">
		<div class="services-stage">
			<p class="showcase-overline"><span class="eyebrow-rule"></span>Featured services <span class="showcase-overline-index">01 — 03</span></p>
			<?php
			$services = [
				[
					'name' => 'Revenue Cycle Management',
					'category' => 'Revenue operations',
					'description' => 'Connecting healthcare organizations with skilled revenue cycle professionals to optimize medical billing, coding, claims management, and financial operations.',
					'action' => 'DISCOVER RCM',
					'href' => home_url('/rcm/'),
					'images' => [
						['assets/service-revenue-cycle.jpg', 'Revenue cycle professional reviewing paperwork', 'Revenue operations'],
						['assets/showcase-rcm-team.jpg', 'Healthcare professional working at a computer', 'Healthcare administration'],
					],
				],
				[
					'name' => 'Medical Staffing',
					'category' => 'Healthcare recruitment & staffing',
					'description' => 'Connecting healthcare organizations with qualified clinical and non-clinical professionals across nursing, allied health, clinical support, and healthcare administration.',
					'action' => 'DISCOVER MEDICAL STAFFING',
					'href' => home_url('/healthcare/'),
					'images' => [
						['assets/showcase-medical-staffing.jpg', 'A medical professional wearing a white coat and stethoscope', 'Clinical workforce'],
						['assets/service-healthcare-staffing.jpg', 'Healthcare professionals working together in surgery', 'Care teams'],
					],
				],
				[
					'name' => 'IT Staffing',
					'category' => 'Technology recruitment & staffing',
					'description' => 'Building high-performing technology teams by connecting businesses with skilled IT professionals across software development, cloud, infrastructure, and emerging technologies.',
					'action' => 'DISCOVER IT STAFFING',
					'href' => home_url('/it/'),
					'images' => [
						['assets/service-it-staffing.jpg', 'Technology team collaborating around laptops', 'Technology teams'],
						['assets/showcase-it-developer.jpg', 'Close view of a software developer working with code', 'Software development'],
					],
				],
			];
			foreach ($services as $index => $service) :
				?>
				<article class="showcase-slide" aria-hidden="<?php echo $index === 0 ? 'false' : 'true'; ?>">
					<?php foreach ($service['images'] as $imageIndex => $image) : ?>
						<figure class="showcase-image showcase-image--<?php echo $imageIndex === 0 ? 'left' : 'right'; ?>">
							<img
								src="<?php echo $img($image[0]); ?>"
								alt="<?php echo esc_attr($image[1]); ?>"
								loading="<?php echo $index === 0 ? 'eager' : 'lazy'; ?>"
								decoding="async"
								<?php echo $index === 0 ? 'fetchpriority="low"' : ''; ?>
							>
							<figcaption><span><?php echo esc_html($image[2]); ?></span><span aria-hidden="true">0<?php echo (int) $imageIndex + 1; ?></span></figcaption>
						</figure>
					<?php endforeach; ?>
					<div class="showcase-content">
						<span class="showcase-category"><?php echo esc_html($service['category']); ?></span>
						<h2><?php echo esc_html($service['name']); ?></h2>
						<p><?php echo esc_html($service['description']); ?></p>
						<a class="showcase-cta" href="<?php echo esc_url($service['href']); ?>"><?php echo esc_html($service['action']); ?><span aria-hidden="true">↗</span></a>
					</div>
				</article>
			<?php endforeach; ?>
			<div class="showcase-progress" aria-label="Service showcase progress">
				<span class="showcase-progress-label">Service showcase</span>
				<span class="showcase-progress-step">01 / 03</span>
				<span class="showcase-progress-track" aria-hidden="true"><span class="showcase-progress-fill"></span></span>
				<span class="showcase-progress-end" aria-hidden="true">03</span>
			</div>
		</div>
	</section>

	<section class="closing-section" id="contact">
		<div class="closing-copy">
			<p class="eyebrow"><span class="eyebrow-rule"></span>The next chapter starts here</p>
			<h2>Let’s make<br>something matter.</h2>
			<a href="mailto:info@crestiaventures.com" class="closing-link">Say hello <span aria-hidden="true">↗</span></a>
		</div>
		<div class="closing-footer">
			<span>CRESTIA VENTURES</span>
			<span>Independent by design · Est. 20XX</span>
			<a href="#brand-story">Back to the beginning ↑</a>
		</div>
	</section>
</main>
