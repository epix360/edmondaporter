(function() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init('HfqzXzg24u4VT7IwB');
})();

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const contact_number = Math.floor(Math.random() * 100000);
        const templateParams = {
            contact_number: contact_number,
            ...this
        };
        emailjs.send('service_g5clgej', 'template_2flsjn5', templateParams)
            .then(() => {
                console.log('SUCCESS!');
            })
            .catch((error) => {
                console.log('FAILED...', error);
            });
    });
});

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