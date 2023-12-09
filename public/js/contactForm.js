(function() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init('HfqzXzg24u4VT7IwB');
})();

window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // generate a five digit number for the contact_number variable
        this.contact_number.value = Math.random() * 100000 | 0;
        // these IDs from the previous steps
        emailjs.sendForm('service_g5clgej', 'template_2flsjn5', this)
            .then(function() {
                console.log('SUCCESS!');
            }, function(error) {
                console.log('FAILED...', error);
            });
    });
}

const form = document.querySelector('form');
const heading = document.querySelector('h2');
const successMessage = document.querySelector('#successMessage');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
       successMessage.classList.remove('d-none');
       form.classList.add('d-none');
       heading.classList.add('d-none');
       setTimeout(() => form.submit(), 2000);
   }
   )