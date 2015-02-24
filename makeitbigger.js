(function() {
	var $inflate = $('[data-makeitbigger]'),
			items = [],
			documentHeight = $(document).height();

	$inflate.each(function(el) {
	  var $el = $(this);
	  
	  items.push({
	    $el: $el,
	    property: $el.data('property'),
	    initialValue: parseInt( $el.css( $el.data('property') )),
	    maxValue: $el.data('max')
	  });
	});

	function map(value, istart, istop, ostart, ostop) {
		return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
	}

	// Setup
	function resizeProperties() {
		var scrollTop = $(document).scrollTop();

		for (var i = 0; i < items.length; i++ ) {
			var item = items[i],
			     newValue = map(scrollTop, 0, documentHeight, item.initialValue, item.maxValue );
			 
			if (newValue < item.maxValue && scrollTop > 0 && newValue > item.initialValue )
			   item.$el.css(item.property, newValue);
		}
	}

	resizeProperties();
	$(document).on('scroll', resizeProperties );
}());