(function() {
  //////////////////////////////
  // Global Closure Variables
  //
  // Actual definitions set at window.onload to ensure the settings have loaded in before trying to use them.
  //////////////////////////////
  var settings = '';
  var settingsArray = '';
  var settingArrayLength = '';

  var lazyload = '';

  var aspectRatio = '';

  var sizeArray = '';
  var arraySize = '';

  var styleArray = '';


  //////////////////////////////
  // Add indexOf Polyfill
  //
  // indexOf is new to ECMA-262 standard and as such, if it doesn't exist, we need to polyfill for it.
  // Polyfill from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf#Compatibility
  //////////////////////////////
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
            n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
            return k;
        }
      }
      return -1;
    }
  }


  //////////////////////////////
  // Add getComputedStyle Polyfill
  //
  // indexOf is new to ECMA-262 standard and as such, if it doesn't exist, we need to polyfill for it.
  // Polyfill from http://snipplr.com/view/13523/
  //////////////////////////////
  if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
      this.el = el;
      this.getPropertyValue = function(prop) {
        var re = /(\-([a-z]){1})/g;
        if (prop == 'float') prop = 'styleFloat';
        if (re.test(prop)) {
          prop = prop.replace(re, function () {
            return arguments[2].toUpperCase();
          });
        }
        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
      }
      return this;
    }
  }

  //////////////////////////////
  // On Load, rock it out!
  //////////////////////////////
  window.onload = function() {
    settings = Drupal.settings.borealis_ri.sizes;
    settingsArray = sortObject(settings);
    settingArrayLength = settingsArray.length;

    lazyload = Drupal.settings.borealis_ri.lazyload;

    aspectRatio = Drupal.settings.borealis_ri.aspect_ratio;


    styleArray = Drupal.settings.borealis_ri.styleArray;

    var sizeArraySort = new Array();
    var styleArraySort = new Array();
    for (i = 0; i < settingArrayLength; i++) {
      sizeArraySort.push(settingsArray[i].value);
      styleArraySort.push(settingsArray[i].key);
    }

    sizeArray = sizeArraySort;
    styleArray = styleArraySort;

    arraySize = sizeArray.length;

    if (lazyload) {
      borealisImagePlaceholder();
    }
    else {
      borealisImageRespond();
    }


    // When the screen is resized, check again!
    window.onresize = debounce(function(){

      if (lazyload) {
        borealisImagePlaceholder();
      }
      else {
        borealisImageRespond();
      }
    }, 20);

    // When the screen is scrolled, do it again!
    window.onscroll = window.onresize;
  };


  //////////////////////////////
  // Borealis Image Placeholder
  //
  // Loop over each image, add height and width to get general idea of whether or not an image is in the viewport
  //////////////////////////////
  function borealisImagePlaceholder() {
    var images = document.querySelectorAll('img.borealis');
    var imageLength = images.length;

    for (var i = 0; i < imageLength; i++) {
      var image = images[i];
      var width = blockParentWidth(image);
      var height = width * aspectRatio;

      var imgStyle = image.getAttribute('data-borealis-style') ? true : false


      if (!imgStyle) {
        image.setAttribute('width', width);
        image.setAttribute('height', height);
      }

      if (elementInViewport(image)) {
        borealisFindImage(image);
      }
      
      if (!imgStyle) {
        image.removeAttribute('width');
        image.removeAttribute('height');
      }
      
    }
  }

  //////////////////////////////
  // Borealis Image Resize
  //
  // Resizes image's height/width
  //////////////////////////////

  function borealisImageResize() {
    var images = document.querySelectorAll('img.borealis');
    var imageLength = images.length;

    for (var i = 0; i < imageLength; i++) {
      var image = images[i];
      var imgStyle = image.getAttribute('data-borealis-style') ? true : false

      if (!imgStyle) {
        image.setAttribute('width', image.width);
        image.setAttribute('height', image.height);
      }
    }
  }

  //////////////////////////////
  // Borealis Image Respond
  //
  // Loop over each image, and change their source depending on parent width
  //////////////////////////////
  function borealisImageRespond() {
    var images = document.querySelectorAll('img.borealis');
    var imageLength = images.length;

    for (var i = 0; i < imageLength; i++) {
      var image = images[i];
      borealisFindImage(image);
    } // End Image Loop
  }

  //////////////////////////////
  // Borealis Find Image
  //
  // Reusable chunk of code to find and swap in an image
  //////////////////////////////
  function borealisFindImage(image) {
    var width = blockParentWidth(image);

    if (width > 0) {
      var slfor = arraySize - 1;
      swapped = false;

      if (width <= sizeArray[0]) {
        borealisImageSwap(image, -1, width);
      }
      else if (width >= sizeArray[slfor + 1]) {
        borealisImageSwap(image, slfor, width, true);
      }
      else {
        for (j = slfor; j >= 0; j--) {
          if (width >= sizeArray[j]) {
            borealisImageSwap(image, j, width);
            j = -1;
          }
        }
      } // End Size Loop
    } //End Width > 0 Check
  }

  //////////////////////////////
  // Borealis Image Swap
  //
  // Sets the appropriate image style based off of Device Pixel Ratio
  //////////////////////////////
  function borealisImageSwap(img, index, width, bypass) {
    // Increase index by one to get the next highest size
    index++;

    if (img.getAttribute('data-locked')) {
      return;
    }

    img.setAttribute('data-locked', 1);

    // Set Bypass
    bypass = (typeof bypass === "undefined") ? false : bypass;

    // Get current image style
    var imgStyle = img.getAttribute('data-borealis-style') ? img.getAttribute('data-borealis-style') : styleArray[0];

    // Get Device Pixel Ratio
    var dpr = (window.devicePixelRatio !== undefined) ? window.devicePixelRatio : 1;

    // Create Style variable
    var style = '';

    // Bypass for the index size passed regardless of DPR
    if (bypass) {
      dpr = 1;
    }

    // If we've got a HighDPI device,
    if (dpr > 1.5 && dpr <= 2.5) {
      style = styleArray[index + 1];
    }
    else {
      style = styleArray[index];
    }

    // Only swap the image if the required image is larger
    if (styleArray.indexOf(style) > styleArray.indexOf(imgStyle)) {
      var src = img.getAttribute('data-borealis-' + style);

      var loadImg = new Image();

      loadImg.onload = function() {
        loadImg.onload = null;

        var imgAttributes = img.attributes;
        var imgAttributeLength = imgAttributes.length;

        for (var i = 0; i < imgAttributeLength; i++) {
          if (imgAttributes[i].name != 'height' && imgAttributes[i].name != 'width' && imgAttributes[i].name != 'src' && imgAttributes[i].name != 'data-borealis-style' && imgAttributes[i].name != 'data-locked') {
            loadImg.setAttribute(imgAttributes[i].name, imgAttributes[i].value);
          }
        }

        // Set the current style
        loadImg.setAttribute('data-borealis-style', style);

        // Remove the Placeholder class
        removeClass(loadImg, 'placeholder');

        // Add image to the DOM
        img.parentNode.replaceChild(loadImg, img);

        // Remove the Loading class, add the Loaded class
        removeClass(loadImg.parentNode, 'loading');
        addClass(loadImg.parentNode, 'loaded');

        // Run the whole thing over again
        borealisImagePlaceholder();
      }
      loadImg.src = src;
    }
    else {
      img.removeAttribute('data-locked')
    }
  }

  //////////////////////////////
  // Returns the width of the nearest non-inline parent.
  //////////////////////////////
  function blockParentWidth(element) {
    var parentNode = element.parentNode;
    var parentDisplay = getComputedStyle(parentNode).display;
    
    // The getComputedStyle polyfill is not working for IE8, causing
    // parentDisplay to be undefined.
    // https://drupal.org/node/2011016
    // In this case, simply return the smaller of window width or 1000px.
    if  (typeof(parentDisplay) == 'undefined' || parentDisplay == null) {
      return Math.min(document.documentElement.clientWidth,1000);
    }
    
    if (parentDisplay.indexOf('inline') >= 0 && parentDisplay.indexOf('block') < 0) {
      return blockParentWidth(parentNode);
    }
    else {
      return parseInt(getComputedStyle(parentNode).width);
    }
  }

  //////////////////////////////
  // Sorts an object into an array by value. http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
  //////////////////////////////
  function sortObject(obj) {
    var arr = new Array();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        arr.push({
          'key': attr,
          'value': obj[attr]
        });
      }
    }
    arr.sort(function(a, b) { return a['value'] - b['value'] });
    return arr; // returns array
  }

  //////////////////////////////
  // Checks to see if element is in viewport
  //
  // From http://css-tricks.com/snippets/javascript/lazy-loading-images/
  //////////////////////////////
  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()

    return (
   rect.left   >= 0
    && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }

  //////////////////////////////
  // Debounce
  // Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
  //////////////////////////////
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }

  //////////////////////////////
  // Has Class
  //
  // From http://www.avoid.org/?p=78
  //////////////////////////////
  function hasClass(el, name) {
   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
  }

  //////////////////////////////
  // Remove Class
  //
  // From http://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery
  //////////////////////////////
  function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  }

  //////////////////////////////
  // Add Class
  //
  // From http://www.avoid.org/?p=78
  //////////////////////////////
  function addClass(el, name) {
   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
  }
  
  Drupal.BorealisRefresh = function() {
    borealisImageRespond();
  };
  
})();

;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;

(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append(' ').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
      var wrapper = $(this);

      wrapper.accordion({
        autoHeight: false,
        active: '.field-group-accordion-active',
        collapsible: true,
        changestart: function(event, ui) {
          if ($(this).hasClass('effect-none')) {
            ui.options.animated = false;
          }
          else {
            ui.options.animated = 'slide';
          }
        }
      });

      if (type == 'form') {
        // Add required fields mark to any element containing required fields
        wrapper.find('div.accordion-item').each(function(i){
          if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
            $('h3.ui-accordion-header').eq(i).append(' ').append($('.form-required').eq(0).clone());
          }
          if ($('.error', $(this)).length) {
            $('h3.ui-accordion-header').eq(i).addClass('error');
            var activeOne = $(this).parent().accordion("activate" , i);
            $('.ui-accordion-content-active', activeOne).css({height: 'auto', width: 'auto', display: 'block'});
          }
        });
      }
    });
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('verticalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 *
 * TODO clean this up meaning check if this is really
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).once('fieldgroup-effects', function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.

      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents());

      // Add required field markers if needed
      if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
        $link.append(' ').append($('.form-required').eq(0).clone());
      }

      $link.appendTo($toggler);

      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        $wrapper.toggleClass('collapsed');
        return false;
      });

    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    if (settings.field_group == undefined) {
      return;
    }

    // Execute all of them.
    $.each(Drupal.FieldGroup.Effects, function (func) {
      // We check for a wrapper function in Drupal.field_group as
      // alternative for dynamic string function calls.
      var type = func.toLowerCase().replace("process", "");
      if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
        this.execute(context, settings, settings.field_group[type]);
      }
    });

    // Fixes css for fieldgroups under vertical tabs.
    $('.fieldset-wrapper .fieldset > legend').css({display: 'block'});
    $('.vertical-tabs fieldset.fieldset').addClass('default-fallback');

  }
};

})(jQuery);;
(function ($) {

/**
 * Retrieves the summary for the first element.
 */
$.fn.drupalGetSummary = function () {
  var callback = this.data('summaryCallback');
  return (this[0] && callback) ? $.trim(callback(this[0])) : '';
};

/**
 * Sets the summary for all matched elements.
 *
 * @param callback
 *   Either a function that will be called each time the summary is
 *   retrieved or a string (which is returned each time).
 */
$.fn.drupalSetSummary = function (callback) {
  var self = this;

  // To facilitate things, the callback should always be a function. If it's
  // not, we wrap it into an anonymous function which just returns the value.
  if (typeof callback != 'function') {
    var val = callback;
    callback = function () { return val; };
  }

  return this
    .data('summaryCallback', callback)
    // To prevent duplicate events, the handlers are first removed and then
    // (re-)added.
    .unbind('formUpdated.summary')
    .bind('formUpdated.summary', function () {
      self.trigger('summaryUpdated');
    })
    // The actual summaryUpdated handler doesn't fire when the callback is
    // changed, so we have to do this manually.
    .trigger('summaryUpdated');
};

/**
 * Sends a 'formUpdated' event each time a form element is modified.
 */
Drupal.behaviors.formUpdated = {
  attach: function (context) {
    // These events are namespaced so that we can remove them later.
    var events = 'change.formUpdated click.formUpdated blur.formUpdated keyup.formUpdated';
    $(context)
      // Since context could be an input element itself, it's added back to
      // the jQuery object and filtered again.
      .find(':input').andSelf().filter(':input')
      // To prevent duplicate events, the handlers are first removed and then
      // (re-)added.
      .unbind(events).bind(events, function () {
        $(this).trigger('formUpdated');
      });
  }
};

/**
 * Prepopulate form fields with information from the visitor cookie.
 */
Drupal.behaviors.fillUserInfoFromCookie = {
  attach: function (context, settings) {
    $('form.user-info-from-cookie').once('user-info-from-cookie', function () {
      var formContext = this;
      $.each(['name', 'mail', 'homepage'], function () {
        var $element = $('[name=' + this + ']', formContext);
        var cookie = $.cookie('Drupal.visitor.' + this);
        if ($element.length && cookie) {
          $element.val(cookie);
        }
      });
    });
  }
};

})(jQuery);
;
/**
 * @file: tab_builder.js
 *
 * take the html markup for tabbed/accordion body
 * content and convert to the desired presentation.
 *
 * we'll have to rework the markup structure first and then,
 * we can apply the toggle event elements for the user interaction
 * bits.
 */

(function ($){

	Drupal.behaviors.wysiwyg_tools_plus_theme_createTabs = {
		attach:function (context) {
			//tabbed elements first
			// for each of the div's apply an id to each
			$('.ready-tabber', context).each(function (index) {

				// a couple of opening set-ups for first run.
				if (index == 0) {
					//create the ul that our headers can be added to for the tabs row plus id's to link to content
					$(this).before('<ul class="ready-tabs"></ul>');
				}
				// add an indexed id to the div
				$(this).attr('id', 'content-' + index);

				//wrap the tab header as an anchor and li
				$(this).children('.ready-tabber-header').wrap('<li class="ready-tab"><a id="tab-' + index + '" href="javascript:void(0);"></a></li>');

				// move the header element to the ul as a li
				$(this).children('li').appendTo('ul.ready-tabs');
			});
			$('.ready-tabs', context).after('<br clear="all" />');
		}
	}

	Drupal.behaviors.wysiwyg_tools_plus_theme_createAccordions = {
		attach:function (context) {
			$('.ready-accordion').each(function (index) {
				$(this).attr('id', 'acc-' + index);
				$(this).children('.ready-accordion-header').wrap('<a class="acc-head" id="acc-head-' + index + '" href="javascript:void(0);"></a>');
				$(this).children('a.acc-head').insertBefore(jQuery(this));

        // awful hack: apply .last to the accordion heads which appear to be last
        if ($(this).next().length == 0 || !$(this).next().hasClass("ready-accordion")) {
          $(this).prev().addClass("last");
        }
			});

		}
	}

	Drupal.behaviors.wysiwyg_tools_plus_theme_initPage = {
		attach:function (context) {
			$('.ready-accordion', context).hide();
			$('.acc-head', context).children('span').addClass('collapsed');
			// set the click events
			$('.ready-tabs a', context).click(function (event) {
				idClicked = this.id;
				wysiwyg_tools_plus_theme_toggleTabContent(idClicked);
			});

			$('.acc-head', context).click(function (event) {
				idClicked = this.id;
				wysiwyg_tools_plus_theme_toggleAccordionContent(idClicked);

        // attach an active class to active accordion heads
        if ($(this).children('span').hasClass("expanded")) {
          $(this).children('span').removeClass("expanded");
					$(this).children('span').addClass("collapsed");
        } else {
          $(this).children('span').addClass("expanded");
					$(this).children('span').removeClass("collapsed");
        }

			});
			wysiwyg_tools_plus_theme_toggleTabContent('tab-0');
		}
	}

	/**
	 * Toggle the visibility of the tab content and set active link
	 */
	function wysiwyg_tools_plus_theme_toggleTabContent (eventId) {
		eventId = eventId.substring(eventId.length-1, eventId.length);
		$('.ready-tabber').each(function (index) {
			if (this.id == "content-" + eventId) {
				// set the link as active
				$('.ready-tabs #tab-' + eventId).parent('li').addClass('active');
				// expose active content
				$(this).show();
			}
			else {
				//unset active class from non-event links
				$('.ready-tabs #tab-' + index).parent('li').removeClass('active');
				//hide unactive content
				$(this).hide();
			}
		});
	}

	/**
	 * Toggle the visibility of the accordion content
	 */
	function wysiwyg_tools_plus_theme_toggleAccordionContent(eventId) {
		eventId = eventId.substring(eventId.lastIndexOf('-')+1, eventId.length);
		$('#acc-' + eventId).toggle('fast');
	}

}(jQuery));
;
