$('.top-bar img').click(function() {
   window.location.href = "/";
});

$('.person').hover(
    function () {
        $('.person-info').eq($(this).index()).fadeIn(200);
    },
    function () {
        $('.person-info').eq($(this).index()).fadeOut(200);
    }
);

// Submit name & email to add to mailing list
if($('body#feed').length > 0) {
    document.getElementsByTagName('form')[0].addEventListener('submit', function (e) {
        e.preventDefault();
        $('#fail-email').hide();
        $('#fail-generic').hide();
        document.getElementsByClassName('form-wrapper')[0].getElementsByTagName('img')[0].style.display = 'block';
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        console.log(name + ', ' + email);
        $.ajax({
            type: "POST",
            url: "https://trova.social/application/addtolist?name=" + name + "&email=" + email,
            success: function (response) {
                document.getElementsByClassName('form-wrapper')[0].getElementsByTagName('img')[0].style.display = 'none';
                var json = JSON.parse(JSON.stringify(response));
                if (json.success) {
                    $('form').fadeOut(500);
                    setTimeout(function () {
                        $('#success').fadeIn(500);
                    }, 500);
                } else {
                    if (json.why === 'email') {
                        $('#fail-email').css({
                            display: 'block'
                        }).animate({opacity: 1}, 500);
                    } else {
                        $('#fail-generic').css({
                            display: 'block'
                        }).animate({opacity: 1}, 500);
                    }
                }
            }
        });
    });
}

// media query event handler
if (matchMedia) {
    const mq = window.matchMedia("(max-width: 550px)");
    mq.addListener(widthChanged);
    widthChanged(mq);
}

// media query change
function widthChanged(mq) {
    if (mq.matches) {
        $('.person-info').show();
        $('.person').off('mouseenter mouseleave');
    } else {
        $('.person-info').hide();
        $('.person').hover(
            function () {
                $('.person-info').eq($(this).index()).fadeIn(200);
            },
            function () {
                $('.person-info').eq($(this).index()).fadeOut(200);
            }
        );
    }

}

// Landing page value prop text rotation
$("#rotate-word").Morphext({
    // The [in] animation type. Refer to Animate.css for a list of available animations.
    animation: "fadeInUp",
    // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
    separator: ",",
    // The delay between the changing of each phrase in milliseconds.
    speed: 3000,
    complete: function () {
        // Called after the entrance animation is executed.
    }
});