function ResponsiveMenu (container, config) {
   this.config = {
      classes: {
         showClass: 'show',
         hideClass: 'hide',
         buttonOpenClass: 'open',
         buttonCloseClass: 'close',
         mobileClass: 'mobile'
      },
      barMaxHeight: 100,
      elements: {
         linkSelector: 'a'
      }
   };
   this.container = container;
   this.toggleButton = container.querySelector('[data-menu-target');
   this.menu = container.querySelector('[data-menu-list]');
   this.containerHeight = this.container.clientHeight;
   this.links = container.querySelectorAll(this.config.elements.linkSelector);
   this.mobileMaxHeight = 0;
   this.windowWidth = window.innerWidth;
   
   for (let i in this.links) {
      if (this.links.hasOwnProperty(i)) {
         this.links[i].addEventListener('click', () => {
            if (this.isMobile()) {
               this.hide();
            }
         });
      }
   }
   
   this.setConfig(config);
   this.render();
   
   this.toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      document.activeElement.blur();
      this.toggle();
   });
   
   window.addEventListener('resize', () => {
      if (Math.abs(this.windowWidth - window.innerWidth) > 10) {
         this.render();
         this.windowWidth = window.innerWidth;
      }
   });
}

ResponsiveMenu.prototype.setConfig = function (config) {
   if (config) {
      if (config.classes) {
         Object.assign(this.config.classes, config.classes);
      }
   }
};
ResponsiveMenu.prototype.toggle = function () {
   
   if (this.menu.classList.contains(this.config.classes.showClass)) {
      this.hide();
   } else {
      this.show();
   }
};
ResponsiveMenu.prototype.hide = function () {
   this.menu.classList.remove(this.config.classes.showClass);
   this.menu.classList.add(this.config.classes.hideClass);
   
   this.toggleButton.classList.remove('open');
   this.toggleButton.classList.add('close');
   
   this.mobileMaxHeight = this.getHeight(this.menu);
   setTimeout(() => {
      this.menu.style.height = '0px';
   }, 10);
   
};
ResponsiveMenu.prototype.show = function () {
   this.menu.classList.remove(this.config.classes.hideClass);
   this.menu.classList.add(this.config.classes.showClass);
   
   this.toggleButton.classList.remove('close');
   this.toggleButton.classList.add('open');
   
   this.mobileMaxHeight = this.getHeight(this.menu);
   setTimeout(() => {
      this.menu.style.height = this.mobileMaxHeight + 'px';
   }, 10);
   
};
ResponsiveMenu.prototype.mobileOn = function () {
   if (!this.container.classList.contains(this.config.classes.mobileClass)) {
      this.container.classList.add(this.config.classes.mobileClass);
   }
   this.hide();
};
ResponsiveMenu.prototype.mobileOff = function () {
   if (this.container.classList.contains(this.config.classes.mobileClass)) {
      this.container.classList.remove(this.config.classes.mobileClass);
   }
};
ResponsiveMenu.prototype.isVisible = function () {
   return this.menu.classList.contains(this.config.classes.showClass);
};
ResponsiveMenu.prototype.isMobile = function () {
   return this.container.classList.contains(this.config.classes.mobileClass);
};
ResponsiveMenu.prototype.render = function () {
   let menuTransition = this.menu.style.transition;
   this.menu.style.transition = 'none';
   this.mobileOff();
   this.containerHeight = this.container.clientHeight;
   
   if (this.containerHeight > 65) {
      this.mobileOn();
      console.log('on : ' + this.containerHeight);
   } else {
      this.mobileOff();
      console.log('off : ' + this.containerHeight);
   }
   this.menu.style.transition = menuTransition;
};
ResponsiveMenu.prototype.getHeight = function (el) {
   let el_style = window.getComputedStyle(el),
         el_display = el_style.display,
         el_position = el_style.position,
         el_visibility = el_style.visibility,
         el_height = el_style.height,
         wanted_height;
   
   el.style.position = 'absolute';
   el.style.visibility = 'hidden';
   el.style.height = 'auto';
   el.style.display = 'block';
   
   wanted_height = el.clientHeight;
   
   el.style.display = el_display;
   el.style.position = el_position;
   el.style.visibility = el_visibility;
   el.style.height = el_height;
   
   return wanted_height;
};
