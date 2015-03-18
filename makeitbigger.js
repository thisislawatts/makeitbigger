'use strict';

(function($) {
	var documentHeight = $(document).height();

	window.MakeItBiggerItems = [];

	/**
	 * [MakeItBigger description]
	 * @param jQuery element  $el
	 * @param object options
	 */
	var MakeItBigger = function( $el, options ) {

		var _self = this;

		_self.$el = $el;

		this.options = _self.getOptions( options );

		console.log( this.options );
		window.MakeItBiggerItems.push( this.options );

		MakeItBiggerResizeProperties();

		return this;
	};

	MakeItBigger.prototype._getDataAttribute = function( property, defaultValue ) {
		var val = this.$el.data( property );

		if (!val)
			return defaultValue;

		return val;
	}

	MakeItBigger.prototype.getOptions = function( options ) {
		var _self = this,
			opts = jQuery.extend({
			$el: _self.$el,
			property: _self._getDataAttribute('property', 'opacity' ),
			minValue: _self._getDataAttribute('valueMin', 0 ),
			maxValue: _self._getDataAttribute('valueMax', 1),
			transitionStart: _self._getDataAttribute('transitionStart', 0),
			transitionEnd: _self._getDataAttribute('transitionEnd', documentHeight)
		}, options );

		_self.originalOptions = opts;

		for ( var prop in opts) {
			if (opts.hasOwnProperty(prop)) {
				if ( typeof opts[prop] === 'function')  {
					opts[prop] = opts[prop]();
				}
			}
		}

		return opts;
	};

	function map(value, istart, istop, ostart, ostop) {
		return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
	}

	window.MakeItBiggerResizeProperties = function() {
		var scrollTop = $(document).scrollTop();

		for (var i = 0; i < window.MakeItBiggerItems.length; i++ ) {
			var item = window.MakeItBiggerItems[i],
			     newValue = map(scrollTop, item.transitionStart, item.transitionEnd, item.minValue, item.maxValue ),
			     negativeScale = item.minValue > item.maxValue;

			if ( scrollTop < item.transitionStart || scrollTop > item.transitionEnd )
				return;
			
			if (
					(newValue < item.maxValue && scrollTop >= 0 && newValue >= item.minValue)
						||
					(negativeScale && newValue <= item.minValue && scrollTop > 0 && newValue >= item.maxValue)
				) {
				item.$el.css(item.property, newValue);
			}
		}
	}

	/**
	 * Fetch up declared elements
	 * @type {[type]}
	 */
	var $domDeclared = $('[data-makeitbigger]');

	$domDeclared.each(function() {
	  var $el = $(this),
	  item = new MakeItBigger( $el );

	});

	MakeItBiggerResizeProperties();

	$(document).on('scroll', MakeItBiggerResizeProperties );

	window.MakeItBigger = MakeItBigger;

}(jQuery));