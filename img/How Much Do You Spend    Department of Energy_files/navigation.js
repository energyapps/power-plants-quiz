/*
 * navigation.js
 * 1) defines some media query variables
 * which need to match those defined in _variables.scss.
 * 2) contains the JavaScript for both mobile and desktop main menu navigation
 * which utilizes enquire.js to use different JS at different viewport widths.
 *
 * It is included by drupal_add_js in template.php while preprocessing html...
 * however the main function Drupal.doeResponsive.menuNavigation does not
 * execute until it is later called by loader.js.
 *
 */

(function ($, Drupal, undefined) {
  /**
   * Define some media queries for use in this theme.
   */
  Drupal.doeResponsive = Drupal.doeResponsive ? Drupal.doeResponsive : {};

  Drupal.doeResponsive.mediaQueries = {
    /* These need to match the breakpoints defined in _variables.scss. */
    expandpointNarrow : "screen and (min-width: 531px)",
    expandpointMid : "screen and (min-width: 666px)",
    expandpointFull : "screen and (min-width: 901px)",
    narrowNavigation : "screen and (min-width: 0) and (max-width: 673px)",
    wideNavigation : "screen and (min-width: 674px)",
  };
})(jQuery, Drupal, undefined);

(function ($, Drupal, undefined) {

Drupal.doeResponsive.menuNavigation = {
  attach: function (context, settings) {

    // Toggle for mail chimp newletter signup form
    $('#energy-social-header-widget li.last a').click(function(e) {
      e.preventDefault();
      $('body').removeClass("active-newsform-footer").toggleClass("active-newsform-header");
      $(this).toggleClass("active-button");
      $('#energy-social-footer-widget li.last a').removeClass("active-button");
    });
    $('#energy-social-footer-widget li.last a').click(function(e) {
      e.preventDefault();
      $('body').removeClass("active-newsform-header").toggleClass("active-newsform-footer");
      $(this).toggleClass("active-button");
      $('#energy-social-header-widget li.last a').removeClass("active-button");
    });

    // Register reactions for narrow navigation
    enquire.register(Drupal.doeResponsive.mediaQueries.narrowNavigation, {

      // Setup function gets run one time. Since deferSetup is true, it is when
      // the "narrowNavigation" becomes true.
      deferSetup: true,
      setup: function() {

        // Off canvas controls section
        // ------------------------------
        // Since search and menu buttons only display in narrowNavigation the
        // off-canvas controls can be placed in the setup phase, this way we
        // don't have to bind/unbind the controls each time we enter and leave
        // this viewport size.

        // Toggle for search
        $('.search-button').click(function(e) {
          e.preventDefault();
          $('body').removeClass("active-nav").toggleClass("active-search");
          $('.menu-button').removeClass("active-button");
          $('.search-button').toggleClass("active-button");
        });

        // Toggle for menu
        $('.menu-button').click(function(e) {
          e.preventDefault();
          $('body').removeClass("active-search").toggleClass("active-nav");
          $('.search-button').removeClass("active-button");
          $('.menu-button').toggleClass("active-button");
        });

      }, // End setup

      // match narrowNavigation
      match: function() {

        // Add classes from body for off-canvas controls
        $("body").addClass("small-screen");

        // Mobile Navigation
        // ---------------------------

        // Define Variables
        $navBlockWrapper = $('.block-energy-core-navigation-main-wrapper');
        $navBlock = $('.block-energy-core-navigation-main');
        // Initialize the index counter that is used to know how far left/right
        // to move the navigation.
        $navBlock.data('index', 0);

        // Add in the "Back" link and the sub-menu title link
        //------------------------------------------------------
        // Pull element out of the DOM for manipulation and add it back in later.
        $navBlock.detach();

        // Insert Sub Office left subnav into main menu.
        if ($('.suboffice-nav')) {
          $this = $('.suboffice-nav');
          var $officeTitle = '<li class="title parent-title subnav-item">Office Menu</li>';
          $this.find('ul').addClass('subnav');
          var $navLeft = $this.html();
          $navBlock.find('.primary-nav').prepend($navLeft);
          $navBlock.find('.subnav + .menu').addClass('invisible');
        }

        // Loop through the first of the .expanded anchor tags
        // and insert the extra links.
        $navBlock.find('.expanded>a').each(function () {
          var $link = $(this),
              $dropdown = $link.siblings('ul.menu'),
              url = $link.attr('href');
          //var $titleLi = $('<li class="title back js-generated"><a href="#">Back</a></li><li class="title js-generated"><a class="parent-title js-generated" href="' + url + '">' + $link.text() +'</a></li>');
          var $titleLi = $('<li class="title back js-generated"><a href="#">Back</a></li><li class="title parent-title js-generated">' + $link.text() +'</li>');
          $dropdown.prepend($titleLi);
        });

        // Put element back in the DOM
        $navBlock.appendTo($navBlockWrapper);


        // Reveals the sub-menu when touch/click a menu item (with sub-menus).
        $('.block-energy-core-navigation-main ul.menu li.expanded > a').on('click', function(e) {
            // Prevent the default link action.
            e.preventDefault();
            // Defining some variables.
            var $this = $(this),
                $selectedLi = $this.closest('li');

            // The moved class tells which sub-class to make visible.
            // (Since all uls at the same sublevel are on top of each other
            // they are set to invisible by default.) //
            $selectedLi.addClass('moved');

            // Increment the counter so we know how far to move it left/right.
            $navBlock.data('index', $navBlock.data('index') + 1);

            // Move the whole navigation block to the left/right.
            $navBlock.css({left: -(100 * $navBlock.data('index')) + '%'});

        });

        // Clicking on "back" goes up a level.
        $('.block-energy-core-navigation-main ul.menu li.back > a').on('click', function (e) {
          e.preventDefault();

          var $this = $(this),
              $movedLi = $this.closest('li.moved'),
              $previousLevelUl = $movedLi.parent();

          // Decrement the counter so we know how far to move it right.
          $navBlock.data('index', $navBlock.data('index') - 1);

          // Move the whole navigation block to the left/right.
          $navBlock.css({left: -(100 * $navBlock.data('index')) + '%'});

          // Removing the .moved class, which makes the menu invisible again.
          // Using a setTimeout so that the menu doesn't dissappear before the
          // CSS transition effect moves it off of the screen.
          setTimeout(function () {
            $movedLi.removeClass('moved');
          }, 300);
        });

      }, // END match narrowNavigation

      // unmatch narrowNavigation
      unmatch: function() {
        // Remove body classes
        $("body").removeClass("active-search active-nav small-screen");
        // Remove back and extra title link
        $('.block-energy-core-navigation-main ul.menu li.title.js-generated').remove();
        // Reset the counter and left percentage.
        $navBlock.data('index', 0);
        $navBlock.css({left: '0%'});
        // Remove any 'moved' classes
        $('.block-energy-core-navigation-main ul.menu .moved').removeClass('moved');
        // Remove/unbind the click event from menu items with sub-menus.
        $('.block-energy-core-navigation-main ul.menu li.expanded > a').off('click');

        // Remove .invisible class from main menu.
        $('.primary-nav .invisible').removeClass('invisible');
        // Remove subnav-items from main menu.
        $('.primary-nav ul.subnav').remove();
      },
      destroy: function() {}
    });

    // Register reactions for wide navigation
    enquire.register(Drupal.doeResponsive.mediaQueries.wideNavigation, {
      deferSetup: true,
      setup: function() {
        $('.mc_embed_signup_wrapper-header-widget').appendTo('.region-header');
      },
      match: function() {

        var $dropdowns = $('.block-energy-core-navigation-main ul.menu li.expanded.depth-1');

        // Add/remove classes to body
        $("body").addClass("multi-column");

        // Prevent click on only top level with sub-menu
        $('.block-energy-core-navigation-main ul.menu li.expanded.depth-1 > a').on('click', function (e) {
          e.preventDefault();
        });

        // Mouse events. Mimic hoverIntent plugin by waiting for the mouse to 'settle' within the target before triggering
        $dropdowns
          .on('mouseover', function() {
            var $this = $(this);
            if ($this.prop('hoverTimeout')) {
              $this.prop('hoverTimeout', clearTimeout($this.prop('hoverTimeout')));
            }
            $this.prop('hoverIntent', setTimeout(function() {
              $this.addClass('hover');
            }, 250));
          })
          .on('mouseleave', function() {
              var $this = $(this);
              if ($this.prop('hoverIntent')) {
                  $this.prop('hoverIntent', clearTimeout($this.prop('hoverIntent')));
              }
              $this.prop('hoverTimeout', setTimeout(function() {
                  $this.removeClass('hover');
              }, 250));
          });

        // Touch events. Support click to open if we're dealing with a touchscreen
        if ('ontouchstart' in document.documentElement) {
          $dropdowns.each(function() {
            var $this = $(this);
            this.addEventListener('touchstart', openDropdown = function(e) {
              if (e.touches.length === 1) {
                // Prevent touch events within dropdown bubbling down to document
                e.stopPropagation();
                // Toggle hover
                if (!$this.hasClass('hover')) {
                  // Prevent link on first touch
                  if (e.target === this || e.target.parentNode === this) {
                      e.preventDefault();
                  }
                  // Hide other open dropdowns
                  $dropdowns.removeClass('hover');
                  $this.addClass('hover');
                  // Hide dropdown on touch outside
                  document.addEventListener('touchstart', closeDropdown = function(e) {
                    e.stopPropagation();
                    $this.removeClass('hover');
                    document.removeEventListener('touchstart', closeDropdown);
                  });
                }
              }
            }, false);
          });
        } // END if onthouchstart

      }, // END match wide navigation
      unmatch: function() {
        // Remove body class
        $("body").removeClass("multi-column");

        var $dropdowns = $('.block-energy-core-navigation-main ul.menu li.expanded.depth-1');

        // Reset Javascript from above match -- unbind hoverintent.
        $dropdowns.off("mouseover").off("mouseleave");
        $dropdowns.removeProp('hoverIntent');
        $dropdowns.removeProp('hoverTimeout');
        if ('ontouchstart' in document.documentElement) {
          $dropdowns.off('touchstart');
          $(document).off('touchstart');
        }
      },
      destroy: function() {}
    }, true); // true = shouldDegrade

  }
};

})(jQuery, Drupal, undefined);
