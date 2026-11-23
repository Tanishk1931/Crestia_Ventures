<?php
/**
 * Healthcare interactive sections (former React islands).
 *
 * @package Crestia
 */
$a = static function (string $file): string {
	return esc_url(crestia_asset('assets/healthcare/assets/' . ltrim($file, '/')));
};
?>
<section class="medical-choices" id="medical-choices" aria-labelledby="medical-choices-title">
	<div class="medical-choices-inner">
		<header class="medical-choices-heading">
			<p class="medical-choices-eyebrow js-fade-up">CRESTIA VENTURES <span aria-hidden="true">•</span> HEALTHCARE</p>
			<h2 id="medical-choices-title" class="medical-editorial-heading js-fade-up" aria-label="How can we help you?">
				<span class="medical-choice-word">How</span>
				<span class="medical-choice-word">can</span>
				<span class="medical-choice-word">we</span>
				<span class="medical-choice-word medical-heading-highlight medical-editorial-highlight">help</span>
				<span class="medical-choice-word medical-heading-highlight medical-editorial-highlight">you?</span>
			</h2>
			<p class="medical-choices-subtitle js-fade-up">Choose the path that best describes what you're looking for.</p>
		</header>
		<div class="medical-choices-grid">
			<article class="medical-choice-card medical-choice-card--jobs" role="group" tabindex="0" aria-label="Find a Job card. Press Enter or Space to flip." aria-expanded="false" data-flip-card>
				<div class="medical-choice-flipper">
					<div class="medical-choice-face medical-choice-front">
						<img class="medical-choice-image" src="<?php echo $a('nurse-card.jpg'); ?>" alt="Smiling healthcare professional in green scrubs with a stethoscope" loading="lazy">
						<div class="medical-choice-front-content">
							<span class="medical-choice-icon" aria-hidden="true">✚</span>
							<h3>Find a Job</h3>
							<span class="medical-choice-accent-line" aria-hidden="true"></span>
							<span class="medical-choice-hint">Click to explore <span aria-hidden="true">↗</span></span>
						</div>
					</div>
					<div class="medical-choice-face medical-choice-back" aria-hidden="true">
						<div class="medical-choice-back-content">
							<span class="medical-choice-icon" aria-hidden="true">✚</span>
							<h3>Find Your Next Opportunity</h3>
							<p>Explore healthcare career opportunities that match your skills, experience and professional goals.</p>
							<button class="medical-choice-cta" type="button" disabled title="Configure this destination when the page is available.">Explore Jobs <span aria-hidden="true">→</span></button>
						</div>
					</div>
				</div>
			</article>
			<article class="medical-choice-card medical-choice-card--talent" role="group" tabindex="0" aria-label="Hire Talent card. Press Enter or Space to flip." aria-expanded="false" data-flip-card>
				<div class="medical-choice-flipper">
					<div class="medical-choice-face medical-choice-front">
						<img class="medical-choice-image" src="<?php echo $a('team-card.jpg'); ?>" alt="Two healthcare professionals reviewing a tablet together" loading="lazy">
						<div class="medical-choice-front-content">
							<span class="medical-choice-icon" aria-hidden="true">👥</span>
							<h3>Hire Talent</h3>
							<span class="medical-choice-accent-line" aria-hidden="true"></span>
							<span class="medical-choice-hint">Click to explore <span aria-hidden="true">↗</span></span>
						</div>
					</div>
					<div class="medical-choice-face medical-choice-back" aria-hidden="true">
						<div class="medical-choice-back-content">
							<span class="medical-choice-icon" aria-hidden="true">👥</span>
							<h3>Build Your Healthcare Team</h3>
							<p>Connect with qualified healthcare professionals to strengthen your organization and workforce.</p>
							<button class="medical-choice-cta" type="button" disabled title="Configure this destination when the page is available.">Find Talent <span aria-hidden="true">→</span></button>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</section>

<section id="transforming-recruitment" class="transforming-recruitment" aria-labelledby="transforming-recruitment-title">
	<div class="transforming-recruitment-inner">
		<header class="transforming-recruitment-heading">
			<h2 id="transforming-recruitment-title" class="medical-editorial-heading js-fade-up">
				<span>Transforming </span>
				<span class="transforming-recruitment-highlight medical-editorial-highlight">Healthcare Recruitment</span>
			</h2>
			<p class="js-fade-up">We bring healthcare professionals and organizations together, creating meaningful connections between talent, opportunity and workforce needs.</p>
		</header>
		<div class="transforming-recruitment-grid" data-recruitment-circles>
			<?php
			$circles = [
				['needs', 'recruitment-needs.jpg', 'Healthcare professional consulting a patient in a clinic', 'Understanding Your Needs', 'Every recruitment journey starts with understanding people. We focus on learning about organizational hiring requirements and individual career aspirations.'],
				['opportunity', 'recruitment-opportunity.jpg', 'Healthcare professional and recruitment representative collaborating around a laptop', 'Connecting Talent With Opportunity', 'We aim to connect healthcare professionals with opportunities that align with their qualifications, experience and career goals, while helping organizations identify suitable talent.'],
				['meaningful', 'recruitment-meaningful.jpg', 'Diverse healthcare team collaborating around a laptop', 'Supporting Meaningful Recruitment', 'We focus on creating relevant professional connections by understanding role expectations, candidate experience and organizational workforce needs.'],
			];
			foreach ($circles as $circle) :
				[$id, $img, $alt, $title, $desc] = $circle;
				?>
				<div class="recruitment-circle-entry js-fade-up">
					<button class="recruitment-circle" type="button" data-circle-id="<?php echo esc_attr($id); ?>" aria-label="<?php echo esc_attr($title); ?>" aria-expanded="false" aria-controls="recruitment-description-<?php echo esc_attr($id); ?>">
						<img class="recruitment-circle-photo" src="<?php echo $a($img); ?>" alt="<?php echo esc_attr($alt); ?>" loading="lazy" decoding="async">
						<span class="recruitment-circle-panel">
							<span class="recruitment-circle-copy">
								<span class="recruitment-circle-title"><?php echo esc_html($title); ?></span>
								<span class="recruitment-circle-description" id="recruitment-description-<?php echo esc_attr($id); ?>" aria-hidden="true"><?php echo esc_html($desc); ?></span>
							</span>
						</span>
					</button>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="healthcare-specializations" id="healthcare-specializations" aria-labelledby="healthcare-specializations-title">
	<div class="healthcare-specializations-inner">
		<header class="healthcare-specializations-heading">
			<h2 id="healthcare-specializations-title" class="medical-editorial-heading js-fade-up">
				Healthcare <span class="medical-editorial-highlight">Specializations</span>
			</h2>
			<p class="js-fade-up">From clinical care to healthcare technology, we connect skilled professionals with opportunities across the healthcare ecosystem.</p>
		</header>
		<div class="healthcare-specializations-scroll" data-specializations role="group" aria-label="Healthcare specializations">
			<div class="healthcare-specializations-track">
				<?php
				$specs = [
					['nursing', 'Nursing', 'Connecting registered nurses, nursing assistants and specialized nursing professionals with healthcare organizations that value compassionate, skilled patient care.', 'nurse-card.jpg', 'center 30%'],
					['allied-health', 'Allied Health', 'Supporting recruitment across diagnostic, therapeutic and rehabilitation services, including professionals who play an essential role in patient care.', 'specialization-allied-health.jpg', 'center 35%'],
					['clinical-support', 'Clinical Support', 'Connecting healthcare organizations with skilled professionals who support clinical operations, patient services and the smooth delivery of care.', 'specialization-clinical-support.jpg', 'center 42%'],
					['healthcare-administration', 'Healthcare Administration', 'Helping organizations find professionals in hospital management, operations, healthcare coordination and administrative leadership.', 'specialization-administration.jpg', '65% center'],
					['revenue-cycle-management', 'Revenue Cycle Management (RCM)', 'Connecting organizations with talent across medical billing, coding, claims processing, payment management and revenue cycle operations.', 'specialization-revenue-cycle.jpg', '68% center'],
					['healthcare-it', 'Healthcare IT', 'Bringing together healthcare and technology talent across health information systems, medical technology, data management and digital healthcare solutions.', 'specialization-healthcare-it.jpg', '68% center'],
				];
				foreach ($specs as $spec) :
					[$id, $title, $desc, $img, $pos] = $spec;
					?>
					<button class="healthcare-specialization-card" type="button" data-spec-id="<?php echo esc_attr($id); ?>" aria-expanded="false" aria-controls="specialization-description-<?php echo esc_attr($id); ?>">
						<img class="healthcare-specialization-image" src="<?php echo $a($img); ?>" alt="" loading="lazy" decoding="async" style="object-position: <?php echo esc_attr($pos); ?>">
						<span class="healthcare-specialization-overlay" aria-hidden="true"></span>
						<span class="healthcare-specialization-copy">
							<span class="healthcare-specialization-title" role="heading" aria-level="3"><?php echo esc_html($title); ?></span>
							<span class="healthcare-specialization-description" id="specialization-description-<?php echo esc_attr($id); ?>" aria-hidden="true"><?php echo esc_html($desc); ?></span>
						</span>
					</button>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>

<section class="recruitment-process" id="our-recruitment-process" aria-labelledby="recruitment-process-title">
	<div class="recruitment-process-stage">
		<div class="recruitment-process-inner">
			<header class="recruitment-process-heading">
				<h2 id="recruitment-process-title" class="medical-editorial-heading js-fade-up">Our Recruitment <span class="medical-editorial-highlight">Process</span></h2>
				<p class="js-fade-up">A thoughtful approach to building stronger healthcare teams.</p>
			</header>
			<div class="recruitment-process-grid" data-process-grid>
				<?php
				$stages = [
					['01', 'Discover', 'Understand workforce requirements, organizational goals and the people behind every hiring need.', 'forest'],
					['02', 'Assess', 'Evaluate role requirements, candidate qualifications and experience to identify the right fit.', 'dark-green'],
					['03', 'Design', 'Develop a tailored recruitment strategy aligned with hiring priorities and workforce needs.', 'emerald'],
					['04', 'Launch', 'Bring the recruitment strategy to life through targeted talent sourcing and candidate engagement.', 'sage'],
					['05', 'Operate', 'Support recruitment activities, coordination and communication throughout the hiring journey.', 'mint'],
					['06', 'Improve', 'Review outcomes, gather insights and refine recruitment strategies for continued improvement.', 'white'],
				];
				foreach ($stages as $stage) :
					[$num, $title, $desc, $tone] = $stage;
					?>
					<article class="recruitment-process-card recruitment-process-card--<?php echo esc_attr($tone); ?> js-process-card">
						<span class="recruitment-process-number"><?php echo esc_html($num); ?></span>
						<h3><?php echo esc_html($title); ?></h3>
						<p><?php echo esc_html($desc); ?></p>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
