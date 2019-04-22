/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */

(function() {
	'use strict';

	const $body = document.querySelector('body');

	// svg polyfill
	svg4everybody();

	// sticky polyfill
	const stickyElements = document.getElementsByClassName('js-sticky');

	for (let i = stickyElements.length - 1; i >= 0; i--) {
	    Stickyfill.add(stickyElements[i]);
	}

	// scroll to targeted id
	function scrollTo(event, element) {
		const scrollTarget = element.dataset.scrollTarget || element.hash || '',
			$scrollTarget = document.querySelector(`[id='${scrollTarget.substring(1)}']`),
			scrollDuration = element.dataset.scrollDuration || 0.4,
			$offset = document.querySelector(element.dataset.scrollOffset) || '',
			offset = $offset.offsetHeight || 0;

		if ($scrollTarget) {
			TweenMax.to(window, scrollDuration, { scrollTo:{ y: scrollTarget, offsetY: offset } });
			event.preventDefault();
		}
	}

	// init ScrollMagic
	var sceneController = new ScrollMagic.Controller(),
		$scenes = document.querySelectorAll('.js-scene');

	$scenes.forEach(scene => {
		var sceneElement = new ScrollMagic.Scene({ triggerElement: scene, reverse: false })
			.setClassToggle(scene, 'in-viewport')
			.addIndicators()
			.addTo(sceneController);
	});

	// scroller function
	/* data-scroll-target="[selector]" -> scroll to target
	   data-scroll-offset="[selector]" -> offset of selector height
	   data-scroll-duration="[duration]" -> how long is scrolling animation
	*/
	var scrollFunction = function() {
		const $scrolls = document.querySelectorAll('.js-scroll');

		$scrolls.forEach(scroll => scroll.addEventListener('click', function() { scrollTo(event, this); }));
	}();

	// tab function, can use scroll to function
	/* data-tab-group="[name]" -> tab grouping
	   data-tab-duration="[second]" -> how long is tab animation if tab method is auto
	*/
	var tabFunction = function() {
		const $tabs = document.querySelectorAll('.js-tab');

		function tabCheck() {
			var queryString = getParameterByName('tab'),
				$this = document.querySelector(`a[href="#${queryString}"]`),
				$tabTarget = $this && document.querySelector($this.hash);

			if (queryString && $tabTarget) {
				var $tabGroup = document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"]`);
					$tabGroup.forEach(tab => tab.classList.remove('is-tabbed'));
					$this.classList.add('is-tabbed');
					$tabTarget.classList.add('is-tabbed');
			}
		}

		function tabTo(event, $this) {
			var $tabTarget = document.querySelector($this.hash);

			if ($tabTarget) {
				var $tabGroup =  document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					$tabTargetGroup = document.querySelectorAll(`.js-tab-target[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					tabTarget = $this.hash.substring(1),
					tabDuration = $this.dataset.tabDuration || 0.2,
					tabScrollTarget = $this.dataset.scrollTarget;

				if (!$tabTarget.classList.contains('is-tabbed')) {
					TweenMax.to($tabTargetGroup, tabDuration/2, { display: 'none', overflow: 'hidden', autoAlpha: 0, onComplete: function() {
						TweenMax.set($tabTarget, { display: 'block', overflow: 'visible', autoAlpha: 1 });
						TweenMax.from($tabTarget, tabDuration, { overflow: 'hidden', autoAlpha: 0 });
					}});
					$tabGroup.forEach(tab => tab.classList.remove('is-tabbed'));
					$this.classList.add('is-tabbed');
					$tabTarget.classList.add('is-tabbed');

					if (tabScrollTarget) {
						scrollTo(event, $this);
					}

					if (window.history && history.pushState) {
						history.replaceState('', '', '?tab' + '=' + tabTarget);
					}
				}

				event.preventDefault();
			}
		}

		tabCheck();
		$tabs.forEach(tab => tab.addEventListener('click', function(event) { tabTo(event, this); }));
	}();

	// toggle function, can use scroll to function
	// modifier: .js-toggle-hover, js-toggle-toggled
	/* data-toggle-target="[selector]" -> toggle target
	   data-toggle-area="[selector]" -> toggle will end outside this area
	   data-toggle-method="auto|manual" -> how toggle is handled, default is auto
	   data-toggle-duration="[second]" -> how long is toggle animation
	   data-toggle-focus="[selector]" -> toggle will focus on targeted form
	*/
	var toggleFunction = function() {
		const $toggles = document.querySelectorAll('.js-toggle');

		function transitionSlideUp(target, duration) {
			TweenMax.to(target, duration/2, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
		}

		function transitionSlideDown(target, duration, delay) {
			TweenMax.set(target, { display: 'block', overflow: 'visible', autoAlpha: 1, height: 'auto' });
			TweenMax.from(target, duration, { overflow: 'hidden', autoAlpha: 0, height: 0, delay: delay });
		}

		function toggleOpen(event, $this) {
			var toggleTarget = $this.dataset.toggleTarget || $this.hash,
				$toggleTarget = document.querySelector(toggleTarget),
				$toggleArea = $this.dataset.toggleArea ? document.querySelector($this.dataset.toggleArea) : $this,
				$toggleFocus = document.querySelector($this.dataset.toggleFocus),
				toggleMethod = $this.dataset.toggleMethod || 'auto',
				toggleDuration = $this.dataset.toggleDuration || 0.25,
				toggleScrollTarget = $this.dataset.scrollTarget,
				bodyClass = toggleTarget.substring(1),
				preventDefault = $this.dataset.toggleTarget ? false : true;

			if (!$toggleTarget) return false;

			if (event.type === 'mouseenter' || event.type === 'touchstart') {
				if ($this.classList.contains('js-toggle-hover')) {
					var $toggleLinkToggled = $toggleArea.querySelectorAll('.js-toggle-hover.is-toggled');

					$toggleLinkToggled.forEach(toggle => {
						if (toggle !== $this) {
							toggle.classList.remove('is-toggled');
						}
					});

					var $toggleAllToggled = $toggleArea.querySelectorAll('.is-toggled'),
						$toggleCurrentToggled = [];

					$toggleAllToggled.forEach(toggle => {
						if (toggle !== $this && toggle !== $toggleTarget) {
							$toggleCurrentToggled.push(toggle);
						}
					});

					if (toggleMethod === 'auto') {
						transitionSlideUp($toggleCurrentToggled, toggleDuration);
					}

					$toggleCurrentToggled.forEach(toggle => toggle.classList.remove('is-toggled'));

					if ($this.classList.contains('is-toggled') === false) {
						$this.classList.add('is-toggled');
						$toggleTarget.classList.add('is-toggled');
						if (toggleMethod === 'auto') {
							transitionSlideDown($toggleTarget, toggleDuration, toggleDuration/2);
						}
					}

					$toggleArea.addEventListener('mouseleave', function(event) { toggleClose(event, $this, $toggleTarget, $toggleArea, toggleMethod, toggleDuration, bodyClass); });
					$body.addEventListener('click', function(event) { toggleClose(event, $this, $toggleTarget, $toggleArea, toggleMethod, toggleDuration, bodyClass); });
					$body.addEventListener('touchend', function(event) { toggleClose(event, $this, $toggleTarget, $toggleArea, toggleMethod, toggleDuration, bodyClass); });
				}
			} else if (event.type === 'click') {
				if (!$this.classList.contains('js-toggle-hover')) {
					if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled')) {
						if (!hasChild($this, $toggleArea)) {
							$this.classList.remove('is-toggled');
							$this.classList.add('is-untoggling');
							$toggleTarget.classList.remove('is-toggled');
							$toggleTarget.classList.add('is-untoggling');
							$body.classList.add(bodyClass+'-is-untoggling');
							setTimeout(function() {
								$this.classList.remove('is-untoggling');
								$toggleTarget.classList.remove('is-untoggling');
								$body.classList.remove(bodyClass+'-is-toggled', bodyClass+'-is-untoggling');
							}, toggleDuration*1000);
							if (toggleMethod === 'auto') {
								transitionSlideUp($toggleTarget, toggleDuration);
							}
						}
					} else {
						$toggleTarget.classList.add('is-toggled');
						$this.classList.add('is-toggled');
						$body.classList.add(bodyClass+'-is-toggled');
						if (toggleScrollTarget) {
							scrollTo(event, $this);
						}
						if (toggleMethod === 'auto') {
							transitionSlideDown($toggleTarget, toggleDuration, 0);
						}
						if ($toggleFocus) {
							$toggleFocus.focus();
						}
						$body.addEventListener('click', function(event) { toggleClose(event, $this, $toggleTarget, $toggleArea, toggleMethod, toggleDuration, bodyClass); });
						$body.addEventListener('touchend', function(event) { toggleClose(event, $this, $toggleTarget, $toggleArea, toggleMethod, toggleDuration, bodyClass); });
					}

					if (preventDefault === true) {
						event.preventDefault();
					}
				}
			}
		}

		function toggleClose(event, $this, $toggleTarget, $toggleArea, toggleMethod, toggleDuration, bodyClass) {
			if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled')) {
				if ($this.classList.contains('js-toggle-hover') && event.type !== 'click') {
					$this.classList.remove('is-toggled');
					$this.classList.add('is-untoggling');
					$toggleTarget.classList.remove('is-toggled');
					$toggleTarget.classList.add('is-untoggling');
					setTimeout(function() {
						$this.classList.remove('is-untoggling');
						$toggleTarget.classList.remove('is-untoggling');
					}, toggleDuration*1000);
					if (toggleMethod === 'auto') {
						transitionSlideUp($toggleTarget, toggleDuration);
					}
				} else {
					if ($this !== event.target && !hasChild($this, event.target) && $toggleArea !== event.target && !hasChild($toggleArea, event.target)) {
						$this.classList.remove('is-toggled');
						$this.classList.add('is-untoggling');
						$toggleTarget.classList.remove('is-toggled');
						$toggleTarget.classList.add('is-untoggling');
						$body.classList.add(bodyClass+'-is-untoggling');
						setTimeout(function() {
							$this.classList.remove('is-untoggling');
							$toggleTarget.classList.remove('is-untoggling');
							$body.classList.remove(bodyClass+'-is-toggled', bodyClass+'-is-untoggling');
						}, toggleDuration*1000);
						if (toggleMethod === 'auto') {
							transitionSlideUp($toggleTarget, toggleDuration);
						}
					}
				}
			}
		}

		function toggleCheck() {
			var $toggles = document.querySelectorAll('.js-toggle-toggled'),
				eventClick = new MouseEvent('click'),
				eventMouse = new MouseEvent('mouseenter');

			$toggles.forEach(toggle => toggleOpen(eventClick, toggle));
			$toggles.forEach(toggle => toggleOpen(eventMouse, toggle));
		}

		toggleCheck();
		$toggles.forEach(toggle => toggle.addEventListener('click', function(event) { toggleOpen(event, this); }));
		$toggles.forEach(toggle => toggle.addEventListener('mouseenter', function(event) { toggleOpen(event, this); }));
		$toggles.forEach(toggle => toggle.addEventListener('touchstart', function(event) { toggleOpen(event, this); }));
	}();

	// mover function (will move elements depending of breakpoints)
	/* data-mover-breakpoint="[width]" -> mover breakpoint width
	   data-mover-target="[selector]" -> mover will append selected element to this selector
	*/
	var moverFunction = function() {
		const $movers = document.querySelectorAll('.js-mover');

		function moverStart(element) {
			var $this = element;
				$this.insertAdjacentHTML('beforebegin', "<div class='js-mover-source'></div>");

			var $moverSource = $this.previousElementSibling,
				$moverTarget = document.querySelector($this.dataset.moverTarget),
				moverBreakpoint = $this.dataset.moverBreakpoint,
				windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= moverBreakpoint) {
				$moverTarget.appendChild($this);
			}

			window.addEventListener('resize', function() {
				windowWidth = document.documentElement.clientWidth;

				if (windowWidth >= moverBreakpoint) {
					if ($this.parentNode !== $moverTarget) {
						$moverTarget.appendChild($this);
					}
				} else {
					if ($this.parentNode !== $moverSource) {
						$moverSource.appendChild($this);
					}
				}
			});
		}

		$movers.forEach(mover => moverStart(mover));
	}();

	// equalling heights function
	/* EXAMPLE
	   equalheight('.floaters .floater');
	*/
	var equalheight = function(elements) {
		var $this,
			currentHighest = 0,
			currentRowStart = 0,
			currentDiv,
			rowDivs = [],
			topPosition = 0;

		function calculateHeight(elements) {
			var $elements = document.querySelectorAll(elements);
			$elements.forEach(element => {
				$this = element;
				$this.style.minHeight = 0;
				topPosition = $this.offsetTop;

				if (currentRowStart !== topPosition) {
					for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
						rowDivs[currentDiv].style.minHeight = currentHighest + 'px';
					}
					rowDivs.length = 0;
					currentRowStart = topPosition;
					currentHighest = $this.offsetHeight;
					rowDivs.push($this);
				} else {
					rowDivs.push($this);
					currentHighest = (currentHighest < $this.offsetHeight) ? $this.offsetHeight : currentHighest;
				}

				for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
					rowDivs[currentDiv].style.minHeight = currentHighest + 'px';
				}
			});
		}

		calculateHeight(elements);
		window.addEventListener('resize', function() {
			calculateHeight(elements);
		});
	};

	equalheight('.marketing-benefit .marketing-benefit-item');

	imagesLoaded('.product-listing', function() {
		equalheight('.product-listing .product-listing-item');
	});

	// .site-header scrolling effect
	var $siteHeader = document.querySelector('.js-site-header'),
		siteHeaderTime = new TimelineMax(),
		$siteTopper = document.querySelector('.site-topper'),
		siteTopperHeight = $siteTopper.offsetHeight;

	siteHeaderTime.to($siteHeader.querySelector('.inner'), 1, {y: siteTopperHeight/2, ease: Power0.easeNone})
		.to('.site-header-logo', 1, {scale: 0.8, ease: Power0.easeNone}, 0);

	var siteHeaderScene = new ScrollMagic.Scene({
		duration: siteTopperHeight,
		triggerElement: '#site',
		triggerHook: 0,
		reverse: true })
		.setTween(siteHeaderTime)
		.addTo(sceneController);

	// marketing statistics
	var $marketingStatistics = document.querySelector('.marketing-statistics'),
		$marketingStatistic = document.querySelectorAll('.marketing-statistic'),
		$marketingStatisticValue = document.querySelectorAll('.marketing-statistic .value');

		$marketingStatisticValue.forEach(element => element.style.opacity = 0);

	var marketingStatisticScene = new ScrollMagic.Scene({ triggerElement: $marketingStatistics, reverse: false, triggerHook: 0.75 })
		.setClassToggle($marketingStatistics, 'in-viewport')
		.on('start', function() {
			$marketingStatistic.forEach(element => {
				var $value = element.querySelector('.value'),
					value = parseInt($value.innerHTML),
					stat = {value: 0};

				TweenMax.to($value, 0.5, {opacity: 1});

				TweenMax.to(stat, 2, {
					value: value,
					roundProps: 'value',
					ease: Expo.easeOut,
					onUpdate: function() {
						$value.innerHTML = stat.value;
					}
				});

			});
		})
		.addTo(sceneController);

	// form file
	/* EXAMPLE
	 	<div class="form-file js-form-file form-group">
			<label class="label">File</label>
			<div class="input">
				<input type="file" id="checkout-attachment" class="form-file-input" name="checkout-attachment" data-multiple-caption="{count} files selected" multiple>
				<label for="checkout-attachment" class="form-file-label"><span class="button"><i class="fa fa-upload"></i> Browse files</span> <span class="caption">No file selected&hellip;</span></label>
			</div>
		</div>
	*/
	var formFileFunction = function() {
		var $formFile = document.querySelectorAll('.js-form-file');

		$formFile.forEach(element => {
			var $input = element.querySelector('.form-file-input'),
				$label = element.querySelector('.form-file-label'),
				labelDefault = $label.innerHTML;

			$input.addEventListener('change', function(event) {
				var fileName = '';

				if (this.files && this.files.length > 1) {
					fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
				}
				else if (event.target.value) {
					fileName = event.target.value.split('\\').pop();
				}

				if (fileName) {
					var $labelCaption = $label.querySelector('.caption');
					$labelCaption.innerHTML = fileName;
					$labelCaption.classList.add('has-caption');
				}
				else {
					$label.innerHTML = labelDefault;
				}
			});
		});
	}();

})();
