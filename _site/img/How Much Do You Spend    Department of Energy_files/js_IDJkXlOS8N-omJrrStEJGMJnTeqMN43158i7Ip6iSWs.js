/* Javascript for tracking downloads as events; Borrowed from Google Analytics module */

(function ($) {

  function energyEventTracking() {
    var extensions = '7z|aac|arc|arj|asf|asx|avi|bin|csv|doc|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|msi|msp|pdf|phps|png|ppt|qtm?|ra(m|r)?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd|xls|xml|z|zip';

    // Attach onclick event to document only and catch clicks on all elements.
    $(document.body).click(function(event) {
      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest("a,area").each(function() {

        // Expression to check for absolute internal links.
        var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
        // Expression to check for download links.
        var isDownload = new RegExp("\\.(" + extensions + ")$", "i");

        var accts = Drupal.settings.drupal_ga_accounts;
        var alphabet = 'abcdefghijklmnopqrstuvwxyz';

        // Is the clicked URL internal?
        if (isInternal.test(this.href)) {
          // Is download tracking activated and the file extension configured for download tracking?
          if (isDownload.test(this.href)) {
            // Download link clicked.
            var extension = isDownload.exec(this.href);
            
            //  cycle thru GA accounts as needed 
            for(var i = 0; i< accts.length; i++) {
              var inlabel = "";
              if (i > 0) inlabel = alphabet.charAt(i) + ".";  //  first account in GA doesn't get an alphabetic signifier; secondary+ start with b and go from there.
              
              var acct = inlabel + "_setAccount";
              var track = inlabel + "_trackEvent";
              
              _gaq.push(
                [acct, accts[i]],
                [track, "Downloads", extension[1].toUpperCase(), this.href.replace(isInternal, '')]
              );
            }
          }
        }
        else {
          if ($(this).is("a[href^=mailto:],area[href^=mailto:]")) {
            // Mailto link clicked.
            //  cycle thru GA accounts as needed 
            for(var i = 0; i< accts.length; i++) {
              var inlabel = "";
              if (i > 0) inlabel = alphabet.charAt(i) + ".";  //  first account in GA doesn't get an alphabetic signifier; secondary+ start with b and go from there.
              
              var acct = inlabel + "_setAccount";
              var track = inlabel + "_trackEvent";
              
              _gaq.push(
                [acct, accts[i]],
                [track, "Mails", "Click", this.href.substring(7)]
              );
            }
          }
        }
      });
    });
  }

  Drupal.behaviors.energyEventTracking = {attach: energyEventTracking};

})(jQuery);;
/* DOE-723: Add GA Event Tracking for Related Content Links; Borrowed from event_tracking.js */

(function ($) {

  function energyRelatedDownloadTracking() {

    // Attach onclick event to document only and catch clicks on all elements.
    $(document.body).click(function(event) {
      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest("#block-apachesolr-search-download-more-downloads a,area").each(function() {

        // Expression to check for absolute internal links.
        var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

        // Expression to check for download links.
        var isDownload = new RegExp("/downloads/", "i");
        var accts = Drupal.settings.drupal_ga_accounts;
        var alphabet = 'abcdefghijklmnopqrstuvwxyz';

        // Is the clicked URL internal?
        if (isInternal.test(this.href)) {
          if (isDownload.test(this.href)) {

            //  cycle thru GA accounts as needed 
            for(var i = 0; i< accts.length; i++) {
              var inlabel = "";
              if (i > 0) inlabel = alphabet.charAt(i) + ".";  //  first account in GA doesn't get an alphabetic signifier; secondary+ start with b and go from there.

              var acct = inlabel + "_setAccount";
              var track = inlabel + "_trackEvent";

              _gaq.push(
                [acct, accts[i]],
                [track, "Related", "Downloads", this.href.replace(isInternal, '')]
              );
            }
          }
        }
      });
    });
  }
  Drupal.behaviors.energyRelatedDownloadTracking = {attach: energyRelatedDownloadTracking};
})(jQuery);

(function ($) {
  function energyRelatedArticleTracking() {
    // Attach onclick event to document only and catch clicks on all elements.
    $(document.body).click(function(event) {
      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest("#block-apachesolr-search-article-related-articles a,area").each(function() {

        // Expression to check for absolute internal links.
        var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
        // Expression to check for article links.
        var isArticle = new RegExp("/articles/", "i");

        var accts = Drupal.settings.drupal_ga_accounts;
        var alphabet = 'abcdefghijklmnopqrstuvwxyz';

        // Is the clicked URL internal?
        if (isInternal.test(this.href)) {
          if (isArticle.test(this.href)) {

            //  cycle thru GA accounts as needed 
            for(var i = 0; i< accts.length; i++) {
              var inlabel = "";
              if (i > 0) inlabel = alphabet.charAt(i) + ".";  //  first account in GA doesn't get an alphabetic signifier; secondary+ start with b and go from there.

              var acct = inlabel + "_setAccount";
              var track = inlabel + "_trackEvent";

              _gaq.push(
                [acct, accts[i]],
                [track, "Related", "Articles", this.href.replace(isInternal, '')]
              );
            }
          }
        }
      });
    });
  }

  Drupal.behaviors.energyRelatedArticleTracking = {attach: energyRelatedArticleTracking};
})(jQuery);

;
/* DOE-928: Add GA Event Tracking for Breadcrumb Links; Borrowed from event_tracking.js */

(function ($) {

  function energyBreadcrumbTracking() {

    // Attach onclick event to document only and catch clicks on all elements.
    $(document.body).click(function(event) {
      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest(".breadcrumb a,area").each(function() {

        // Expression to check for absolute internal links.
        var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

        // Expression to check for download links.
        var accts = Drupal.settings.drupal_ga_accounts;
        var alphabet = 'abcdefghijklmnopqrstuvwxyz';

        // Is the clicked URL internal?
        if (isInternal.test(this.href)) {

        var pageTitle = Drupal.settings.energyCore.pageTitle;

          //  cycle thru GA accounts as needed
          for (var i = 0; i< accts.length; i++) {
            var inlabel = "";
            if (i > 0) inlabel = alphabet.charAt(i) + ".";  //  first account in GA doesn't get an alphabetic signifier; secondary+ start with b and go from there.

            var acct = inlabel + "_setAccount";
            var track = inlabel + "_trackEvent";

            _gaq.push(
              [acct, accts[i]],
              [track, "Breadcrumb", pageTitle, this.href.replace(isInternal, '')]
            );
          }
        }
      });
    });
  }
  Drupal.behaviors.energyBreadcrumbTracking = {attach: energyBreadcrumbTracking};
})(jQuery);
;
/* DOE-1032: Add GA Event Tracking for Context CallOut Links; Borrowed from event_tracking.js */

(function ($) {

  function energyContextCallOutTracking() {

    var accts = Drupal.settings.drupal_ga_accounts;
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

    $('.field-name-field-article-callout-text a').click(function() {
      for(var i = 0; i< accts.length; i++) {
        var inlabel = "";
        if (i > 0) inlabel = alphabet.charAt(i) + "."; // First account in GA doesn't get an alphabetic signifier; secondary+ start with b and go from there.

        var acct = inlabel + "_setAccount";
        var track = inlabel + "_trackEvent";

        var link_path = this.href.replace(isInternal, '');
        var page_path = document.URL.replace(isInternal, '');

        _gaq.push(
          [acct, accts[i]],
          [track, "CallOut", link_path, page_path]
        );
      }
    });
  }

  Drupal.behaviors.energyContextCallOutTracking = {attach: energyContextCallOutTracking};

})(jQuery);
;
