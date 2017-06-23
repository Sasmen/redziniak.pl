class Validator {
   constructor (form, config) {
      this.config = {
         classes: {
            errorClass: 'error',
            invalidClass: 'invalid',
            validClass: 'valid'
         },
         elements: {
            fieldsSelector: '[data-to-valid]',
            errorMessageAttribute: 'data-error-message'
         },
         errorMessages: {
            badInput: 'badInput',
            tooShort: 'Za krótki',
            tooLong: 'Za długi',
            patternMismatch: 'Zły format',
            rangeOverflow: 'Za dużo',
            rangeUnderflow: 'Za mało',
            typeMismatch: 'Nie poprawny format',
            valueMissing: 'Pole wymagane'
         }
      };
      this.form = form;
      this.fields = form.querySelectorAll(this.config.elements.fieldsSelector);
      
      this.setConfig(config);
      this.form.addEventListener('submit', (e) => {
         e.preventDefault();
         this.validForm();
      });
      
      this.addEventListenerToFields();
      
   }
   
   validForm () {
      for (let i = 0; i < this.fields.length; i++) {
         this.validField(this.fields[i]);
      }
   }
   
   validField (field) {
      this.removeError(field);
      let validity = field.validity;
      let valid = true;
      for (let err in validity) {
         if (!validity.valid && validity[err]) {
            this.setError(field, this.config.errorMessages[err]);
            valid = false;
         }
      }
      if (valid) {
         this.setValidField(field);
      }
      this.addEventListenerToFields(field);
   }
   
   removeError (field) {
      let fieldError = field.parentElement.querySelector('.' + this.config.classes.errorClass);
      if (fieldError) {
         fieldError.remove();
      }
   }
   
   setError (field, message) {
      let errorElement = document.createElement('div');
      errorElement.classList.add(this.config.classes.errorClass);
      errorElement.innerHTML = message;
      field.parentNode.appendChild(errorElement);
      this.setInvalidField(field);
   }
   
   setValidField (field) {
      field.parentElement.classList.remove(this.config.classes.invalidClass);
      field.parentElement.classList.add(this.config.classes.validClass);
   }
   
   setInvalidField (field) {
      field.parentElement.classList.remove(this.config.classes.validClass);
      field.parentElement.classList.add(this.config.classes.invalidClass);
   }
   
   addEventListenerToFields (field) {
      if (field) {
         field.oninput = () => {
            this.validField(field);
         };
      }
   }
   
   setConfig (config) {
      if (config) {
         
         if (config.classes) {
            Object.assign(this.config.classes, config.classes);
         }
      }
   }
}

