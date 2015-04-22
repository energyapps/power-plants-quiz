/*
 * loader.js
 * utilizes Modernizr to test and load js files.
 * 
 * If media queries are not supported, respond.js is loaded (example for IE8).
 * 
 * If Match Media is not supported it loads a polyfill,
 * then, for all cases it loads enquire.js and calls the main menu navigation 
 * function Drupal.doeResponsive.menuNavigation defined in navigation.js.
 * 
 * It is included by template.php via drupal_add_js while preprocessing html.
 * 
 */

Modernizr.load([
  {
    // The test: does the browser understand Media Queries?
    test : Modernizr.mq('only all'),
    // If not, load the respond.js file
    nope : '/sites/all/themes/energy/scripts/respond/respond.min.js',
  }
]);

Modernizr.load([
  {
    // Test for matchMedia
    test: window.matchMedia,
    // If not load polyfill
    nope: '/sites/all/themes/energy/scripts/media-match/media.match.min.js',
    // Load enquire for everything
    load: ['/sites/all/themes/energy/scripts/enquire/enquire.min.js'],
    // On completion execute specific functions that use enquire.
    complete: function () {
      Drupal.doeResponsive.menuNavigation.attach(document);
    },
  }
]);