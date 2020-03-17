$( document ).ready(function() {

	// focus search input on toggle
	$('.search').click(function() {
		$('.search-field').stop().slideToggle();
		$('.search-field input[type=text]').focus();
	});
	//close search bar on 'esc'
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('.search-field').slideUp();
		}
	}).click(function() {
		$('.search-field').slideUp();
	});
	$('.search-wrap').click(function(e) {
		e.stopPropagation();
	});

	// resize post on touch
	if(window.matchMedia('(max-width: 1087px)').matches)
		{
			$('.vert-post').removeClass('vert-post').addClass('vert-post-s');
		}

	// burger nav toggle
	var mobNav = $('.mobile-menu');
	var burger = $('.navbar-burger');

	burger.click(function() {
		$('.mobile-menu').stop().slideToggle();
		if($(this).hasClass('active')){
			mobNav.css({"display": "none"});
			burger.removeClass('active');
		}else{
			mobNav.css({"display": "flex"});
			burger.addClass('active');
		}
	});

	// progress bar
	$("body").prognroll({
		height: 3,
		color: "#e74d3c",
		custom: false
	});

	// disqusloader
	$.disqusLoader('.comments', {
		scriptUrl: '//codehax.disqus.com/embed.js',
		disqusConfig: function() {
			this.callbacks.onReady = [function() {
				$('.disqus-placeholder').addClass('is-hidden');
			}];
		}
	});
	
	// lazyLoad initalize
	var lazyLoadInstance = new LazyLoad({
		elements_selector: ".lazy"
		// ... more custom settings?
	});
	lazyLoadInstance.update();
	
});
