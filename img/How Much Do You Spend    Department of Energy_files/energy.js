/*
 * energy.js
 * contains miscellaneous theming functions.
 *
 * A good amount of legacy code (from before the responsive redesign) was
 * collected here. There may be yet more things that can be removed.
 *
 */

(function($) {

// General scripts.
Drupal.behaviors.general = {
  attach: function (context, settings) {
    // Attach placeholder shim
    $('input, textarea').placeholder();
  }
}

// Stripe table rows.
Drupal.behaviors.tableRowStriping = {
  attach: function (context, settings) {
    $('table tbody, table:not(:has(thead))').each(function() {
      $(this).children('tr').each(function(i) {
        $(this).addClass((i+1)%2 == 1 ? 'tr-odd' : 'tr-even');
      });
    });
  }
}

// General scripts.
Drupal.behaviors.beanOnFocus = {
  attach: function (context, settings) {
    // columns on the in focus bean
    //$('.entity-bean.bean-in-focus > .content').equalHeights();
    //$('.field-name-field-in-focus-left-content .field-items').equalHeights(null, ':first');
    $('.block-bean.bean-in-focus > h4.block-title').append('<a class="in-focus-control"><span>Open</span></a>').each(function() {
      $('.entity-bean.bean-in-focus').hide();
    });
    $('.in-focus-control').toggle(function() {
      $(this).find('span').addClass('opened').html('Close');
      $(this).closest('.block-bean').find('.entity-bean.bean-in-focus').slideDown();
    },
    function() {
      $(this).find('span').removeClass('opened').html('Open');
      $(this).closest('.block-bean').find('.entity-bean.bean-in-focus').slideUp();
    });
  }
}

// Content promotion bean carousels.
Drupal.behaviors.beanPromotions = {
  attach: function (context, settings) {
    $('.bean-content-promotion').not('.bean-content-promotion-processed').each(function() {
      $(this).find('.node').each(function() {
         $(this).replaceWith('<li>'+$(this).html()+'</li>');
      });
      $(this).find('.content').first().wrapInner('<ul class="slides" />');
      $(this).find('.content').first().after('<div id="'+$(this).attr('id')+'-pager" class="slide-pager"><div class="slide-indicator"><span class="current-slide"></span>/<span class="total-slides"></span></div></div>');

      $(this).flexslider({
        animation: "slide",
        animationLoop: false,
        slideshow: false,
        itemWidth: 125,
        itemMargin: 20,
        controlsContainer: ".slide-pager",

        // Uncomment below to enable slide indicator/count (.slide-indicator is also being hidden in _style.scss).
        // start: function(slider) {
        //   $('.current-slide').text(slider.currentSlide+1);
        //   $('.total-slides').text(slider.controlNav.length);
        // },
        // before: function(slider) {
        //   $('.current-slide').text(slider.currentSlide+1);
        //   $('.total-slides').text(slider.controlNav.length);
        // },
        // after: function(slider) {
        //   $('.current-slide').text(slider.currentSlide+1);
        // },
      });
    });
   }
 }

// Generates embed code.
Drupal.behaviors.energygovEmbed = {
  attach: function (context, settings) {
    $('<a href="#" class="energygov_embed at300b"></a>').append('<span>Embed</span>').insertAfter('.addthis_button_print, .at15t_print, .addthis_button_print.at300b');
    $('.addthis_button_print, .at15t_print, .addthis_button_print.at300b').remove();
    var nid = Drupal.settings.energy_content.nid, base_url = Drupal.settings.energy_content.base_url, embedScriptTag = '<script src="' + base_url + '/node/' + nid + '/embed" id="energygov_' + nid + '_script"></script>';
    $('.energygov_embed.at300b').click(function(e) {
      e.preventDefault();
      var $embedDialog = $('<div class="energygov-embed-dialog"></div>').append('<p>Copy the following code and paste it in your website to embed this content:</p>');
      var embedTextarea = $('<textarea class="energygov-embed-code" rows="4"></textarea>').val(embedScriptTag).css('width', '450px');
      $embedDialog.append(embedTextarea).dialog({
        title: 'Embed This Content In Your Site',
        modal: true,
        resizeable: false,
        draggable: false,
        width: 500,
      });
    });
  }
}

// Grid wrapping.
Drupal.behaviors.gridWrap = {
  attach: function (context, settings) {
    if ($('.content-grid-results').length) {
      var divs = $(".content-grid-results > .node");
      for(var i = 0; i < divs.length; i+=3) {
        divs.slice(i, i+3).wrapAll("<div class='content-grid-row clearfix'></div>");
      }
    }
  }
}

// Savings button fade.
Drupal.behaviors.savingsButton = {
  attach: function (context, settings) {
    if ($('#edit-content-savings-search-button').length) {
      $('#edit-content-savings-search-button').mousedown(function() {
        $('#content-savings-results').fadeTo(50, 0.4);
      });
    }
  }
}

// Search Filters.
Drupal.behaviors.searchFilters = {
  attach: function (context, settings) {
    $('.block-facetapi').each(function() {
      var filterTitle = $('.block-title', $(this));
      var filterList = $('.content .item-list', $(this));
      filterTitle.on("click",function() {
        filterList.slideToggle();
        $(this).toggleClass('expanded');
      });
    });
  }
}

// Flex slider.
Drupal.behaviors.flexSlider = {
  attach: function (context, settings) {
    $('.flexslider').flexslider({
      animation: "slide",
      slideshow: true,
      useCSS: false,
      touch: true
    });
  }
}

// Map cover. Enable/disable map interactions
Drupal.behaviors.mapCover = {
  attach: function (context, settings) {
    var $cover = $( '<div class="mapbox-cover">Interaction disabled.</div>' );
    var $coverToggle = $( '<div class="mapbox-cover-toggle"><a href="#">Enable Interactions</a></div>' );
    // For map heros, check if static map is using an iframe.
    if ($('.node-full .energy-static-map iframe').length) {
      $('.node-full .energy-static-map').append($cover).before($coverToggle);
    }
    else {
      $('.node-full .field-name-field-map-map > .field-items').append($cover);
      $('.node-full .field-name-field-map-map').before($coverToggle);
    }
    $('.mapbox-cover-toggle a').click(function() {
      event.preventDefault();
      $('.mapbox-cover').toggle();
    }).toggle(
      function() {
        $(this).text('Disable Interaction');
      },
      function() {
        $(this).text('Enable Interaction');
      }
    );
  }
}
// Data Tables.
Drupal.behaviors.dataTable = {
  attach: function (context, settings) {
    if ($('.tablefield').length) {
      $('.tablefield').dataTable();
    }
  }
}

})(jQuery);
