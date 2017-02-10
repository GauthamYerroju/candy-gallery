// var grid = $('.grid');

// grid.masonry({
//     // set itemSelector so .grid-sizer is not used in layout
//     itemSelector: '.grid-item',
//     // use element for option
//     columnWidth: '.grid-sizer',
//     percentPosition: true
// })

$('.item-container').on('click', function() {
    var zoomed = $(this);
    if (zoomed.hasClass('zoom')) {
        zoomed.removeClass('zoom');
    } else {
        $('.item-container.zoom').removeClass('zoom');
        zoomed.addClass('zoom');
    }
    
});


// TODO: Implement Unveil for paged/endless lazy loading https://luis-almeida.github.io/unveil/
// TODO: Thumbnail server https://github.com/honza/node-thumbnail
// TODO: Navigation breadcrumbs