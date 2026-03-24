/*!
 * Chef Marissa — Custom JavaScript  (Demo 1: Elegant)
 * File: js/default.js
 *
 * Runs after Canvas vendor scripts have loaded.
 */

(function ()
{
	'use strict';

	// =========================================================================
	// Helpers
	// =========================================================================

	function qs(selector, ctx)
	{
		return (ctx || document).querySelector(selector);
	}

	function isValidEmail(email)
	{
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	// =========================================================================
	// Contact Form
	// =========================================================================

	var contactForm = qs('#contact-form-1');
	var contactFeedback = document.getElementById('contact-feedback-1');

	if (contactForm && contactFeedback)
	{
		contactForm.addEventListener('submit', function (e)
		{
			e.preventDefault();

			var name = (qs('[autocomplete="name"]', contactForm) || {value: ''}).value.trim();
			var email = (qs('[autocomplete="email"]', contactForm) || {value: ''}).value.trim();
			var message = (qs('textarea', contactForm) || {value: ''}).value.trim();

			if (!name || !email || !message) {return;}

			if (!isValidEmail(email)) {return;}

			contactForm.style.display = 'none';
			contactFeedback.style.display = 'block';

			/*
			 * Replace this block with a real fetch() to your form endpoint.
			 *
			 * Example:
			 *   fetch('/api/contact', {
			 *     method: 'POST',
			 *     headers: { 'Content-Type': 'application/json' },
			 *     body: JSON.stringify({ name, email, message }),
			 *   });
			 */
		});
	}

	// =========================================================================
	// Gallery carousel (Instagram-style)
	// =========================================================================

	if (typeof Swiper !== 'undefined' && qs('#gallery-carousel'))
	{
		new Swiper('#gallery-carousel', {
			grabCursor: true,
			breakpoints: {
				0: {slidesPerView: 2, spaceBetween: 2},
				576: {slidesPerView: 4, spaceBetween: 2},
				992: {slidesPerView: 6, spaceBetween: 2},
			},
			navigation: {
				prevEl: '.gallery-nav-prev',
				nextEl: '.gallery-nav-next',
			},
		});
	}

	// Gallery lightbox (Magnific Popup)
	if (typeof jQuery !== 'undefined' && jQuery('#gallery-carousel').length)
	{
		jQuery('#gallery-carousel').magnificPopup({
			delegate: 'a[data-lightbox="gallery-item"]',
			type: 'image',
			gallery: {enabled: true},
			zoom: {enabled: true, duration: 300},
		});
	}

	// =========================================================================
	// Footer: dynamic year
	// =========================================================================

	var yearEl = qs('#footer-year');
	if (yearEl)
	{
		yearEl.textContent = new Date().getFullYear();
	}

})();