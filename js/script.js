let shotsBigSize = false

let popupBehavior = (action) => {
    if(action == "open") {
        $("section.popup").css({"display": "block"});

        setTimeout(() => {
            $("section.popup").addClass("open");
            $("section.popup" + " .inner-content").addClass("open");

            $("html, body").addClass("overflowHidden");
        }, 10);
    }

    if(action == "close") {
        $("html, body").removeClass("overflowHidden");

        $("section.popup").removeClass("open");
        $("section.popup" + " .inner-content").removeClass("open");

        setTimeout(() => {
            $("html, body").removeClass("overflowHidden");
            $("section.popup").css({"display": "none"});
        }, 300);
    }

    return;
};

let changeShotSize = () => {
  $('section button.switch i').removeClass('disable')

  if(!shotsBigSize) {
    $('section ul.shots-list li').addClass('bigger')
    $('.icon-1').addClass('disable')

    shotsBigSize = true;
  }

  else {
    $('section ul.shots-list li').removeClass('bigger')
    $('.icon-2').addClass('disable')

    shotsBigSize = false;
  }
}

$(document).ready(() => {
    picturefill();

    $("#open-popup").click((e) => {
      e.preventDefault();

      popupBehavior('open')
    })

    $("#close-popup").click((e) => {
      e.preventDefault();

      popupBehavior('close')
    })

    $("button.switch").click((e) => {
      e.preventDefault();

      changeShotSize()
    })
});
