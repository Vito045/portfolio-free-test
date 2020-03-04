const socket = io();

socket.emit('serverPortfolio', 'df');
socket.on('start', site => {
  document
    .querySelector('.footer__text')
    .addEventListener('click', e =>
      window.open(
        'https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcRwQZtRjwfTRtjxmRFqvTQqTGSXSRPdcQnKhmFtPsjfFdnxPKDgdqDvnZcvXSGGXbCvXdgKp',
        '_blank'
      )
    );
  console.log(site);
  const infoTemplate = document.querySelector('#infoTemplate').innerHTML;
  const bytes = new Uint8Array(site.site.photo.image.data);
  const encoded = encode(bytes);
  site.site.photo = encoded;

  const html = Mustache.render(infoTemplate, site.site);

  document.querySelector('.portfolio').insertAdjacentHTML('afterbegin', html);

  document.querySelectorAll('.portfolio__portfolio-plus').forEach(plus => {
    const height = plus.parentNode.offsetHeight;
    plus.parentElement.parentElement.style.height = `${height}px`;
    plus.addEventListener('click', () => {
      plus.parentElement.parentElement.classList.toggle('active');
      for (let i = 0; i < plus.children.length; i++) {
        if (
          plus.children[i].classList.contains('portfolio__portfolio-line--2')
        ) {
          plus.children[i].classList.toggle('rotation');
        }
      }
    });
  });

  socket.on('projects', projects => {
    const navigationTemplate = document.querySelector('#navigationTemplate')
      .innerHTML;
    const htmlNavigation = Mustache.render(navigationTemplate, projects);
    document
      .querySelector('.container')
      .insertAdjacentHTML('afterbegin', htmlNavigation);

    const portfolioTemplate = document.querySelector('#portfolioTemplate')
      .innerHTML;
    projects.forEach(project => {
      let media = [];
      const id = project._id.toString();
      project.media.forEach(med => {
        if (med.type === 'video')
          media.push(
            `<video autoplay muted playsinline controls loop src="media/${id}/${med.name}"></video>`
          );
        else if (med.type === 'image')
          media.push(`<img src="media/${id}/${med.name}">`);
      });
      const html = Mustache.render(portfolioTemplate, {
        title: project.title,
        info: project.info,
        media,
        id: project._id.toString(),
      });
      document
        .querySelector('.portfolio__portfolio')
        .insertAdjacentHTML('beforeend', html);
      const slider = new Swiper(`.swiper-container-${id}`, {
        navigation: {
          nextEl: `.portfolio__portfolio-button--right-${id}`,
          prevEl: `.portfolio__portfolio-button--left-${id}`,
        },
      });
      slider.on('slideChange', () => {
        setTimeout(() => {
          const swiperContainer = document.querySelector(
            `.swiper-container-${id}`
          ).firstElementChild.children;
          for (const key in swiperContainer) {
            const slide = swiperContainer[key];
            if (slide.classList.contains('swiper-slide-active')) {
              const children = document.querySelector(`.swiper-container-${id}`)
                .firstElementChild.childElementCount;
              const bar = document.querySelector(`.swiper-container-${id}`)
                .parentElement.nextElementSibling.firstElementChild
                .nextElementSibling.offsetWidth;
              const elemLength = bar / children;
              document.querySelector(
                `.swiper-container-${id}`
              ).parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.style.marginLeft = `${key *
                elemLength}px`;
            }
          }
        });
      });
    });

    document
      .querySelector('.portfolio__menu-list')
      .firstElementChild.addEventListener('click', e => {
        document
          .querySelector('.portfolio__portfolio-item')
          .firstElementChild.firstElementChild.click();
        setTimeout(() => {
          document.querySelector('.portfolio__portfolio-item').scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });
        }, 50);
      });

    document
      .querySelectorAll('.portfolio__portfolio-buttons')
      .forEach(button => {
        const bar = button.firstElementChild.nextElementSibling.offsetWidth;
        // console.log('df')
        const children =
          button.parentElement.firstElementChild.firstElementChild
            .firstElementChild.childElementCount;
        const elemLength = bar / children;
        button.firstElementChild.nextElementSibling.firstElementChild.style.width = `${elemLength}px`;

        button.firstElementChild.addEventListener('click', e => {
          const slider =
            button.parentElement.firstElementChild.firstElementChild
              .firstElementChild.children;
          for (let key in slider) {
            if (slider[key].classList.contains('swiper-slide-active')) {
              button.firstElementChild.nextElementSibling.firstElementChild.style.marginLeft = `${key *
                elemLength}px`;
            }
          }
        });

        button.lastElementChild.addEventListener('click', e => {
          const slider =
            button.parentElement.firstElementChild.firstElementChild
              .firstElementChild.children;
          for (let key in slider) {
            if (slider[key].classList.contains('swiper-slide-active')) {
              button.firstElementChild.nextElementSibling.firstElementChild.style.marginLeft = `${key *
                elemLength}px`;
            }
          }
        });
      });
    if (window.innerWidth <= 800 || window.innerHeight <= 400) {
      document
        .querySelector('.navigation__icon')
        .addEventListener('click', e => {
          document
            .querySelector('.navigation__icon')
            .classList.toggle('opened');

          if (
            document
              .querySelector('.navigation__icon')
              .classList.contains('opened')
          ) {
            document.querySelector('.navigation__list').style.display = 'flex';
            setTimeout(() => {
              document.querySelector('.navigation__list').style.right = '0%';
              document.querySelector('.navigation__list').style.paddingTop =
                '8rem';
              document.querySelector('.navigation__list').style.paddingRight =
                '6rem';
            }, 200);
            window.addEventListener('scroll', noScroll);
          } else {
            document.querySelector('.navigation__list').style.right = '-50%';
            document.querySelector('.navigation__list').style.padding = '0rem';
            window.removeEventListener('scroll', noScroll);
            setTimeout(() => {
              document.querySelector('.navigation__list').style.display =
                'none';
            }, 200);
          }
        });
    } else {
      document
        .querySelector('.navigation__icon')
        .addEventListener('click', e => {
          document
            .querySelector('.navigation__icon')
            .classList.toggle('opened');

          if (
            document
              .querySelector('.navigation__icon')
              .classList.contains('opened')
          ) {
            document.querySelector('.navigation__list').style.right = '12rem';
          } else {
            document.querySelector('.navigation__list').style.right = '-50%';
          }
        });
    }

    document.querySelectorAll('.portfolio__portfolio-plus').forEach(plus => {
      const height = plus.parentNode.offsetHeight;
      plus.parentElement.parentElement.style.maxHeight = `${height}px`;
      plus.addEventListener('click', () => {
        plus.parentElement.parentElement.classList.toggle('active');
        for (let i = 0; i < plus.children.length; i++) {
          if (
            plus.children[i].classList.contains('portfolio__portfolio-line--2')
          ) {
            plus.children[i].classList.toggle('rotation');
          }
        }
        setTimeout(
          () =>
            plus.parentElement.parentElement.scrollIntoView({
              block: 'end',
              behavior: 'smooth',
            }),
          350
        );
      });
    });

    document.querySelectorAll('.portfolio__portfolio-head').forEach(head => {
      head.addEventListener('click', e => {
        if (
          e.target.classList.contains('portfolio__portfolio-plus') ||
          e.target.classList.contains('portfolio__portfolio-line')
        )
          return false;
        console.log(
          e.target.classList.contains('portfolio__portfolio-plus'),
          e.target
        );
        head.firstElementChild.click();
      });
    });

    const nav = document.querySelector('.navigation__list').children;
    for (const key in nav) {
      document.querySelectorAll('.portfolio__portfolio-item').forEach(item => {
        nav[key].addEventListener('click', e => {
          if (window.innerWidth <= 800 || window.innerHeight <= 400) {
            if (e.target.parentElement.id === item.id) {
              document
                .querySelector('.navigation__icon')
                .classList.toggle('opened');
              window.removeEventListener('scroll', noScroll);
              item.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
              });
              item.firstElementChild.firstElementChild.click();

              document.querySelector('.navigation__list').style.right = '-50%';
              // document.body.style.overflow = 'visible';
              document.querySelector('.navigation__list').style.paddingTop =
                '8rem';
              document.querySelector('.navigation__list').style.paddingRight =
                '6rem';
              setTimeout(() => {
                document.querySelector('.navigation__list').style.display =
                  'none';
              }, 200);
            }
          } else {
            if (e.target.parentElement.id === item.id) {
              document
                .querySelector('.navigation__icon')
                .classList.toggle('opened');
              item.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
              });
              item.firstElementChild.firstElementChild.click();

              document.querySelector('.navigation__list').style.right = '-50%';
            }
          }
        });
      });
    }
  });
});

function encode(input) {
  var keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var output = '';
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
}

window.mobilecheck = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

function noScroll() {
  window.scrollTo(0, 0);
}
