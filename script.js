// const prev = (string) => {
//     if(document.querySelector(string).previousElementSibling) return document.querySelector(string).previousElementSibling;
//     else return document.querySelector(string).parentElement.lastElementChild;
// };
// const next = (string) => {
//     if(document.querySelector(string).nextElementSibling) return document.querySelector(string).nextElementSibling;
//     else return document.querySelector(string).parentElement.firstElementChild;
// };
// const prevElemSibling = (elem) => {
//     if(elem.previousElementSibling) return elem.previousElementSibling;
//     else return elem.parentElement.lastElementChild;
// };
// const nextElemSibling = (elem) => {
//     if(elem.nextElementSibling) return elem.nextElementSibling;
//     else return elem.parentElement.firstElementChild;
// };
// const prevElem = (elem) => {
//     if(elem.previousSibling) return elem.previousSibling;
//     else return elem.parentElement.lastChild;
// };
// const nextElem = (elem) => {
//     if(elem.nextSibling) return elem.nextSibling;
//     else return elem.parentElement.firstChild;
// };

// const slider = () => {

//     // if(document.querySelector('.portfolio__portfolio-image.active').nextElementSibling) {
//     //     document.querySelector('.portfolio__portfolio-image.active').nextElementSibling.style.display = 'block';
//     //     document.querySelector('.portfolio__portfolio-image.active').nextElementSibling.style.transform = 'translate(100vw, 0)';


//     //     // previous.style.transform = `translate(100vw, ${previous.offsetTop})`;
//     // }else {
//     //     document.querySelector('.portfolio__portfolio-images').firstElementChild.style.display = 'block';
//     //     document.querySelector('.portfolio__portfolio-images').firstElementChild.style.transform = 'translate(100vw, 0)';

//     //     // const previous = prevElem(document.querySelector('.portfolio__portfolio-image.active'));
//     //     // previous.style.transform = `translate(100vw, ${previous.offsetTop})`;
//     // }

//     const previousElem = prevElemSibling(document.querySelector('.portfolio__portfolio-image.active'));
//     // previousElem.style.display = `block`;
//     previousElem.style.transform = `translateX(-100vw)`;
//     // const previousOffset = previousElem.offsetTop - document.querySelector('.portfolio__portfolio-image.active').offsetTop;
//     // previousElem.style.transform = `translate(0, -${previousOffset}px)`;

//     const followElem = nextElemSibling(document.querySelector('.portfolio__portfolio-image.active'));
//     // followElem.style.display = `block`;
//     // const followOffset = followElem.offsetTop - document.querySelector('.portfolio__portfolio-image.active').offsetTop;
//     // followElem.style.transform = `translate(0, -${followOffset}px)`;
//     followElem.style.transform = `translateX(100vw)`;

    
    
    
// }

// // slider();

// document.querySelector('.portfolio__portfolio-button.portfolio__portfolio-button--left').addEventListener('click', () => {
//     const previousActiveImage = document.querySelector('.portfolio__portfolio-image.active');
//     previousActiveImage.classList.toggle('active');
//     console.log(previousActiveImage);
//     prevElemSibling(previousActiveImage).classList.toggle('active');

//     slider();
// });

// document.querySelector('.portfolio__portfolio-button.portfolio__portfolio-button--right').addEventListener('click', () => {
//     const followActiveImage = document.querySelector('.portfolio__portfolio-image.active');
//     followActiveImage.classList.toggle('active');
//     console.log(followActiveImage);
//     nextElemSibling(followActiveImage).classList.toggle('active');

//     slider();
// });

const bar = document.querySelector('.portfolio__portfolio-progress-bar').offsetWidth;
const elem = bar / document.querySelectorAll('.portfolio__portfolio-image.swiper-slide').length;
document.querySelector('.portfolio__portfolio-progress-bar-elem').style.width = `${elem}px`;

document.querySelectorAll('.portfolio__portfolio-button').forEach(button => {
    button.addEventListener('click', () => {
        setTimeout(() => {
            document.querySelectorAll('.portfolio__portfolio-image.swiper-slide').forEach((slide, i) => {
                if(slide.classList.contains('swiper-slide-active')) {
                    document.querySelector('.portfolio__portfolio-progress-bar-elem').style.marginLeft = `${i * elem}px`;
                }
            });
        }, 1);
    });
});