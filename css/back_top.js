/*****www.crawlist.net***/
jQuery(document).ready(function() {
    var offset = 220;
    var duration = 500;
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.ks-back-to-top').fadeIn(duration);
        } else { //www.crawlist.blogspot.com
            jQuery('.ks-back-to-top').fadeOut(duration);
        }
    });

    jQuery('.ks-back-to-top').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    })
});