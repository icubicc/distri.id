 /* This file contains main script for website
 * Style related scripts is located in style.js
 */

// initialize when document is ready
jQuery(document).ready(function($) {

	var windowWidth = document.documentElement.clientWidth;

	// initialize Flickity
	var $sliderHero = $('.js-slider-hero').find('.slider-hero-slides').flickity({
		imagesLoaded: true,
		prevNextButtons: false
	});

	var sliderFlick = $sliderHero.data('flickity');
	var $sliderNav = $sliderHero.siblings('.slider-hero-nav');
	var $sliderNavButton = $sliderNav.find('.bullet');

	$sliderHero.on('select.flickity', function() {
		$sliderNavButton.filter('.is-selected').removeClass('is-selected');
		$sliderNavButton.eq(sliderFlick.selectedIndex).addClass('is-selected');
	});

	$sliderNav.on('click', '.bullet', function(e) {
		var index = $(this).index();
		$sliderHero.flickity('select', index);
		e.preventDefault();
	});

	$('.js-slider-gallery').find('.slider-gallery-slides').flickity({
		draggable: false,
		imagesLoaded: true,
		pageDots: false,
		prevNextButtons: false,
		setGallerySize: false,
		selectedAttraction: 0.05,
		friction: 0.5
	});

	$('.js-slider-gallery').find('.slider-gallery-nav').flickity({
		asNavFor: '.js-slider-gallery .slider-gallery-slides',
		cellAlign: 'left',
		imagesLoaded: true,
		groupCells: true,
		pageDots: false,
		arrowShape: {
		  x0: 30,
		  x1: 50, y1: 20,
		  x2: 50, y2: 10,
		  x3: 40
		}
	});

	var $blogNext = $('.js-blog-next'),
		$blogNextContent = $blogNext.find('.blog-next-content'),
		$blogNextNav = $blogNext.find('.bullets');

	var $blogNextSlider = $blogNextContent.flickity({
		draggable: false,
		imagesLoaded: true,
		pageDots: false,
		prevNextButtons: false,
		wrapAround: true
	});

	$blogNextNav.find('.bullet-prev').on( 'click', function(e) {
		e.preventDefault();
		$blogNextSlider.flickity('previous');
	});

	$blogNextNav.find('.bullet-next').on( 'click', function(e) {
		e.preventDefault();
		$blogNextSlider.flickity('next');
	});

	$('.js-testimonial-highlights').flickity({
		imagesLoaded: true,
		pageDots: false
	});

	$('.js-product-listing-carousel').find('.product-listing-content').flickity({
		imagesLoaded: true,
		groupCells: true,
		pageDots: false
	});

	// initialize zoom
	// wrap in zoom function
	// if screen width <=768
	var galleryZoom = function() {
		if (windowWidth >= 768) {
			var $zoomContainer = $('.js-slider-gallery .slide'),
			zoomContainerWidth = $('.js-slider-gallery .slide').outerWidth();

			$zoomContainer.zoom({
				onZoomIn: function() {
					var $this = $(this),
					zoomImgWidth = $this.outerWidth(),
					zoomImgHeight = $this.outerHeight();

					if (zoomImgWidth < zoomContainerWidth && zoomImgHeight < zoomContainerWidth ) {
						$this.trigger('zoom.destroy');
					}
				}
			});
		}
	}();

	// initialize magnificPopup
	$('.js-mfp-link').magnificPopup({
		type: 'inline',
		mainClass: 'mfp-animation',
		removalDelay: 200
	});

	$('.js-mfp-modal-link').magnificPopup({
		type: 'inline',
		mainClass: 'mfp-animation',
		modal: true,
		removalDelay: 200
	});

	$(document).on('click', '.js-mfp-modal-dismiss', function(e) {
		e.preventDefault();
		$.magnificPopup.close();
	});

	// .product-variant .chosen value
	var $productVariant = $('.product-variant');
	$productVariant.find('.input').on('change', function() {
		var value = $(this).siblings('.label').attr('title');
		$(this).parents('.product-variant').find('.chosen').html(value);
	});

	// brand filter search
	$('.js-product-filter-brand').find('.list').before('<input type="text" id="search-brand" class="search" placeholder="Search brand">');

	$('#search-brand').keyup(function(){
		var valThis = $(this).val().toLowerCase();
		$(this).siblings('.list').find('.input').each(function() {
			var text = $('label[for="'+$(this).attr('id')+'"]').text().toLowerCase();
			if (text.indexOf(valThis) === 0) {
				$(this).parent().show();
			}
			else {
				$(this).parent().hide();
			}
		});
	});

});
