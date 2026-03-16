/*!
 * Canvas Single-Page Site — Custom JavaScript
 * File: js/default.js
 *
 * Initialises site-specific behaviour. Runs after Canvas vendor scripts
 * (vendor/js/plugins.min.js and vendor/js/functions.bundle.js) have loaded.
 */

(function ()
{
	'use strict';

	// =========================================================================
	// Helpers
	// =========================================================================

	/**
	 * Safely query a single element; returns null if not found.
	 * @param {string} selector
	 * @param {Element} [ctx=document]
	 * @returns {Element|null}
	 */
	function qs(selector, ctx)
	{
		return (ctx || document).querySelector(selector);
	}

	/**
	 * Validate an e-mail address with a simple RFC-5321-compatible check.
	 * @param {string} email
	 * @returns {boolean}
	 */
	function isValidEmail(email)
	{
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	/**
	 * Append a dismissible feedback alert inside a form.
	 * @param {HTMLFormElement} form
	 * @param {'success'|'error'} type
	 * @param {string} message
	 */
	function showFeedback(form, type, message)
	{
		// Remove stale feedback
		const existing = form.querySelector('.form-feedback');
		if (existing) existing.remove();

		const el = document.createElement('div');
		el.className = 'form-feedback alert ' +
			(type === 'success' ? 'alert-success' : 'alert-danger') +
			' mt-3';
		// Use textContent — never innerHTML — to avoid XSS
		el.textContent = message;
		form.appendChild(el);

		// Auto-dismiss after 6 seconds
		setTimeout(function ()
		{
			if (el.parentNode) el.remove();
		}, 6000);
	}

	// =========================================================================
	// Contact Form
	// =========================================================================

	const contactForm = qs('#template-contactform');

	if (contactForm)
	{
		contactForm.addEventListener('submit', function (e)
		{
			e.preventDefault();

			const name = (qs('#cf-name', contactForm)?.value || '').trim();
			const email = (qs('#cf-email', contactForm)?.value || '').trim();
			const message = (qs('#cf-message', contactForm)?.value || '').trim();

			// Client-side validation
			if (!name || !email || !message)
			{
				showFeedback(contactForm, 'error', 'Please fill in all required fields.');
				return;
			}

			if (!isValidEmail(email))
			{
				showFeedback(contactForm, 'error', 'Please enter a valid email address.');
				return;
			}

			// Disable submit while processing
			const submitBtn = qs('#cf-submit', contactForm);
			if (submitBtn)
			{
				submitBtn.disabled = true;
				submitBtn.textContent = 'Sending…';
			}

			/*
			 * ── Replace the code below with your real form-submission logic. ──
			 *
			 * Options:
			 *   • Fetch to a serverless function (Netlify Functions, Vercel, etc.)
			 *   • POST to a PHP mail handler in /include/form.php (bundled with Canvas)
			 *   • A third-party service like Formspree, EmailJS, etc.
			 *
			 * Example using Fetch + JSON:
			 *
			 *   fetch('/api/contact', {
			 *     method: 'POST',
			 *     headers: { 'Content-Type': 'application/json' },
			 *     body: JSON.stringify({ name, email, message }),
			 *   })
			 *   .then(r => r.ok ? r.json() : Promise.reject(r))
			 *   .then(() => showFeedback(contactForm, 'success', 'Message sent!'))
			 *   .catch(() => showFeedback(contactForm, 'error', 'Something went wrong.'))
			 *   .finally(() => {
			 *     if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
			 *   });
			 */

			// Demo: simulate a successful submission
			setTimeout(function ()
			{
				showFeedback(contactForm, 'success', 'Thank you! Your message has been received.');
				contactForm.reset();
				if (submitBtn)
				{
					submitBtn.disabled = false;
					submitBtn.textContent = 'Send Message';
				}
			}, 800);
		});
	}

	// =========================================================================
	// Footer: dynamic year
	// =========================================================================

	const yearEl = qs('#footer-year');
	if (yearEl)
	{
		yearEl.textContent = new Date().getFullYear();
	}

	// =========================================================================
	// Intersection Observer — animate elements when they enter the viewport
	// (supplements Canvas's own animate.js for non-slider elements)
	// =========================================================================

	if ('IntersectionObserver' in window)
	{
		const animatables = document.querySelectorAll('[data-animate]:not(.slider-caption *)');

		const observer = new IntersectionObserver(
			function (entries)
			{
				entries.forEach(function (entry)
				{
					if (!entry.isIntersecting) return;

					const el = entry.target;
					const animClass = el.getAttribute('data-animate');
					const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

					setTimeout(function ()
					{
						el.classList.add('animated', animClass);
						el.style.visibility = 'visible';
					}, delay);

					observer.unobserve(el);
				});
			},
			{threshold: 0.12}
		);

		animatables.forEach(function (el)
		{
			// Hide until the animation fires so there is no content flash
			el.style.visibility = 'hidden';
			observer.observe(el);
		});
	}

})();
