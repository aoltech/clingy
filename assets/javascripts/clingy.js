/*

Clingy

Copyright (c) 2013, AOL Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
 * Neither the name of AOL nor the names of its contributors may be
   used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

*/

var image_markup = '\
    <div id="lightbox" class="hide">\
        <a href="http://placehold.it/150x150" target="_blank" id="full-size">\
            <img src="http://placehold.it/150x150" title="http://placehold.it/150x150" />\
        </a>\
        <a href="#" id="close-lightbox">x</a>\
    </div>\
    <div id="image-gallery">\
        <span id="tab">images</span>\
        <ul id="image-list">\
        </ul>\
    </div>\
';

$(document).ready(function(){
    // Are there attachments on the page?
    if ($('div.attachments').length > 0) {
        $('#history .details').before('<div class="file-thumbnails"></div>');
        $('#history .details a').each(function(index) {
            var file_url = $(this).attr('href');
            if (file_url.indexOf('.png') != -1 || file_url.indexOf('.jpg') != -1 || file_url.indexOf('.PNG') != -1 || file_url.indexOf('.JPG') != -1) {
                $(this).parent().parent().prev().append('<img src="' + $(this).attr('href') + '" class="inline-image">');
            }
        });

        // Append styles and markup
        $('body').append(image_markup);
        $('.attachments a.icon-attachment').each(function(index) {
            var file_url = $(this).attr('href');
            if (file_url.indexOf('.png') != -1 || file_url.indexOf('.jpg') != -1 || file_url.indexOf('.PNG') != -1 || file_url.indexOf('.JPG') != -1 ) {
                $('#image-list').append('<li class="image-attachment"><a href="' + file_url + '"><img src="' + file_url + '" title="' + file_url + '" /></a></li>');
            }
        });

        // Apply height to lightbox
        $('#lightbox').css('height', $(window).height() - 100 + 'px');
        $(window).resize(function() {
            $('#lightbox').css('height', $(window).height() - 100 + 'px');
        });

        // Toggle gallery via tab
        $('#tab').click(function(e) {
            e.preventDefault();
            // If gallery isn't displayed, display it
            // Else hide it (along with the lightbox)
            if ($(this).parent().css('bottom') != '0px') {
                $(this).parent().css('bottom', '0px');
                $('img.selected').removeClass('selected');
            } else {
                $(this).parent().css('bottom', '-86px');
                $('#lightbox').addClass('hide');
                $('img.selected').removeClass('selected');
            }
        });

        // Clicking an image thumbnail
        $('.image-attachment img').click(function(e) {
            e.preventDefault();
            // If the lightbox is hidden, update the image, full size link
            // and display the image. Also remove styles from any existing selected
            // thumbnails and make the clicked thumbnails selected.
            // If the lightbox is displayed, but isn't displaying the clicked
            // thumbnail's image, update attributes accordingly
            // If the you click the thumbnail that's currently in the lightbox,
            // Hide it.
            if ($('#lightbox').attr('class') === 'hide') {
                $('#lightbox img').attr('src', $(this).attr('src'));
                $('#lightbox #full-size').attr('href', $(this).attr('src'));
                $('#lightbox').removeClass('hide');
                $('img.selected').removeClass('selected');
                $(this).addClass('selected');
            } else if ($(this).attr('src') != $('#lightbox img').attr('src')) {
                $('#lightbox img').attr('src', $(this).attr('src'));
                $('#lightbox #full-size').attr('href', $(this).attr('src'));
                $('img.selected').removeClass('selected');
                $(this).addClass('selected');
            } else {
                $('#lightbox').addClass('hide');
                $('img.selected').removeClass('selected');
            }
        });

        $('.inline-image').click(function(e) {
            e.preventDefault();
            if ($('#lightbox').attr('class') === 'hide') {
                var inline_image_src = $(this).attr('src');
                $('#lightbox img').attr('src', inline_image_src);
                $('#lightbox #full-size').attr('href', inline_image_src);
                $('#lightbox').removeClass('hide');
                $('img.selected').removeClass('selected');
                $('#image-list img').each(function(index) {
                    if ($(this).attr('src') === inline_image_src) {
                        $(this).addClass('selected');
                    }
                })
                if ($('#image-gallery').css('bottom') != '0px') {
                    $('#image-gallery').css('bottom', '0px');
                }
            }
        });

        // Close the lightbox when you click the x button
        $('#close-lightbox').click(function(e) {
            e.preventDefault();
            $('#lightbox').addClass('hide');
            $('img.selected').removeClass('selected');
        });

        // Super cool keyboard shortcutes
        $(document).keyup(function(e) {
            e.preventDefault();
            // If the image gallery isn't currenty displayed
            if ($('#image-gallery').css('bottom') === '0px') {
                // Hide everything when you hit ctrl + i
                if (e.ctrlKey && e.keyCode == 73) {
                    $('#image-gallery').css('bottom', '-86px');
                    $('#lightbox').addClass('hide');
                    $('img.selected').removeClass('selected');
                }
                // Hide stuff when you hit esc
                if (e.keyCode == 27) {
                    if ($('#lightbox').attr('class') === 'hide') {
                        $('#image-gallery').css('bottom', '-86px');
                    } else if ($('#lightbox').attr('class') != 'hide') {
                        $('#lightbox').addClass('hide');
                    }
                    $('img.selected').removeClass('selected');
                }
                // If the lightbox isn't hidden
                if ($('#lightbox').attr('class') != 'hide') {
                    // Hitting j or right arrow will show the next image
                    // Hitting k or left arrow will show the prev image
                    if (e.keyCode == 39 || e.keyCode == 74) {
                        $('.image-attachment').each(function(index) {
                            if ($(this).find('img').attr('src') === $('#lightbox img').attr('src')) {
                                if ($(this).next().length > 0) {
                                    $('#lightbox img').attr('src', $(this).next().find('img').attr('src'));
                                    $('#lightbox #full-size').attr('href', $(this).next().find('img').attr('src'));
                                    $('img.selected').removeClass('selected');
                                    $(this).next().find('img').addClass('selected');
                                    return false;
                                }
                            }
                        });
                    } else if (e.keyCode == 37 || e.keyCode == 75) {
                        $('.image-attachment').each(function(index) {
                            if ($(this).find('img').attr('src') === $('#lightbox img').attr('src')) {
                                if ($(this).prev().length > 0) {
                                    $('#lightbox img').attr('src', $(this).prev().find('img').attr('src'));
                                    $('#lightbox #full-size').attr('href', $(this).prev().find('img').attr('src'));
                                    $('img.selected').removeClass('selected');
                                    $(this).prev().find('img').addClass('selected');
                                    return false;
                                }
                            }
                        });
                    }
                } else {
                    // If not image is displayed, show the first or last
                    if (e.keyCode == 39 || e.keyCode == 74) {
                        $('.image-attachment:first-child').find('img').addClass('selected');
                        $('#lightbox img').attr('src', $('.image-attachment:first-child').find('img').attr('src'));
                        $('#lightbox #full-size').attr('href', $('.image-attachment:first-child').find('img').attr('src'));
                        $('#lightbox').removeClass('hide');

                    } else if (e.keyCode == 37 || e.keyCode == 75) {
                        $('.image-attachment:last-child').find('img').addClass('selected');
                        $('#lightbox img').attr('src', $('.image-attachment:first-child').find('img').attr('src'));
                        $('#lightbox #full-size').attr('href', $('.image-attachment:first-child').find('img').attr('src'));
                        $('#lightbox').removeClass('hide');
                    }
                }
            } else {
                // Hide everything if you his ctrl + i
                if (e.ctrlKey && e.keyCode == 73) {
                    $('#image-gallery').css('bottom', '0px');
                    $('img.selected').removeClass('selected');
                }
            }

            // Open image in new tab in full size when hitting enter
            if ($('#lightbox').attr('class') != 'hide') {
                if (e.keyCode == 13) {
                    var tab = window.open($('#lightbox a').attr('href'), '_blank');
                    tab.focus();
                }
            }
        });
    }
});
