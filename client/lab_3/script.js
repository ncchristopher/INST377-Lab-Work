let slidePosition = 0;

const slides = document.querySelectorAll('.carousel_item');

const slidesArray = Array.from(slides);

const totalSlides = slidesArray.length;

function updateSlidePosition() {
  slidesArray.forEach(slide => {
    slide.classList.remove('visible');
    slide.classList.add('hidden');
  })
  slides[slidePosition].classList.add('visible');
}

function moveToNextSlide() {
 if (slidePosition === totalSlides - 1) {
  slidePosition = 0;
 } else{
  slidePosition++;
 }
  updateSlidePosition();
}

function moveToPrevSlide() {
  if (slidePosition === 0) {
      slidePosition = totalSlides - 1;
     } else{
      slidePosition--;
     }
  updateSlidePosition();
}

document.querySelector('.next')
  .addEventListener('click', () => {
    console.log('clicked next');
    moveToNextSlide();
  });

document.querySelector('.prev')
  .addEventListener('click', () => {
    console.log('clicked prev');
    moveToPrevSlide();
  });