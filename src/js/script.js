(function () {
   let avatar = document.querySelector('.avatar');
   let avatarWrapper = document.querySelector('.avatar-wrapper');
   let innerLink = document.querySelectorAll('[href^="#"]');
   let menu = document.querySelector('.menu');
   let form = document.querySelector('.form');
   
   let menuBackgroundStyle = window.getComputedStyle(menu, null).getPropertyValue('background-color');
   let menuBackgroundRGBValue = menuBackgroundStyle.substr(
         menuBackgroundStyle.indexOf('(') + 1,
         menuBackgroundStyle.lastIndexOf(',') - menuBackgroundStyle.indexOf('(') - 1);
   
   let menuBorderBottomStyle = window.getComputedStyle(menu, null).getPropertyValue('border-bottom-color');
   let menuBorderBottomRGBValue = menuBorderBottomStyle.substr(
         menuBorderBottomStyle.indexOf('(') + 1,
         menuBorderBottomStyle.lastIndexOf(',') - menuBorderBottomStyle.indexOf('(') - 1);
   
   let heightOnInit = window.innerHeight;
   
   const MENU_HEIGHT = menu.clientHeight;
   
   init();
   
   let responsiveMenu = new ResponsiveMenu(menu, {
      classes: {
         hideClass: 'hide',
         mobileClass: 'menu--mobile'
      }
   });
   let formValidator = new Validator(form, {
      classes: {
         errorClass: 'input-error',
         invalidClass: 'input-input--invalid',
         validClass: 'input-input--valid'
         
      }
   });
   
   window.addEventListener('scroll', () => {
      avatar.style.backgroundPositionY = window.pageYOffset / 4 + 'px';
      avatarWrapper.style.top = -window.pageYOffset / 2 + 'px';
      setMenuStyles();
   });
   
   window.addEventListener('resize', () => {
      if (Math.abs(heightOnInit - window.innerHeight) > 150) {
         init();
         heightOnInit = window.innerHeight;
      }
   
   });
   
   for (let elem in innerLink) {
      if (innerLink.hasOwnProperty(elem)) {
         innerLink[elem].addEventListener('click', (e) => {
            e.preventDefault();
            let target = e.target.href;
            let targetId = target.substr(target.lastIndexOf('#'));
            if (targetId !== '#index') {
               let targetElement = document.querySelector(targetId);
               scrollTo(targetElement, -MENU_HEIGHT);
            } else {
               let targetElement = document.querySelector('html');
               scrollTo(targetElement, -window.innerHeight);
            }
         });
      }
   }
   
   function scrollTo (element, offset) {
      
      let scrollTo = element.offsetTop + window.innerHeight + (offset || 0);
      let scrollFrom = window.pageYOffset;
      let scrollDifference = scrollTo - scrollFrom;
      
      console.log(scrollTo);
      
      scrollAnimate();
      
      function scrollAnimate (i = 0) {
         let frames = 100;
         window.scrollTo(0, scrollFrom + scrollDifference * (i / frames));
         if (i < frames) {
            setTimeout(() => {
               scrollAnimate(i + 1);
            }, 5);
         }
      }
   }
   
   function setMenuStyles () {
      let opacity = (window.pageYOffset / window.innerHeight) < 1 ? window.pageYOffset / window.innerHeight : 1;
      menu.style.background = `rgba(${menuBackgroundRGBValue}, ${opacity})`;
      menu.style.borderColor = `rgba(${menuBorderBottomRGBValue}, ` + opacity / 5 + ` )`;
   }
   
   function init () {
      avatar.style.height = window.innerHeight + 'px';
      setMenuStyles();
      
   }
   
})();