/*
 * vertical_image.js
 * Adds a class to vertical image.
 */

(function($) {

// Hero Vertical add class.
Drupal.behaviors.heroVertical = {
  attach: function (context, settings) {
    $('.energy-static-image').each(function() {
      var $this = $(this);
      var fid = $this.find('img').attr("data-fid");
      var limitVertical = settings.heroVertical.limitVertical;

      // Only add the class if the fid isn't in the limitVertical array.
      if ($.inArray(fid, limitVertical) == -1) {
        // Load smallest image to test height ratio.
        // Then add class used to restrict size.
        var $img_source = $this.find('img').attr("data-borealis-respondsmall");
        if ( !$img_source ) { return; }
        var img = new Image();
        img.src = $img_source;
        img.onload = function() {
          if (this.height > this.width) {
            $this.addClass("is-vertical");
          }
        }
      }
    });
  }
}

})(jQuery);
;
