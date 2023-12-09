//STOPS PROPOGATION ON FORM MISSING REQUIRED FIELDS
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

//ADDS .IMG-FLUID TO IMAGES UPLOADED THROUGH RICH TEXT EDITOR
let articleImgs = document.querySelectorAll('article img')
articleImgs.forEach(x => x.classList.add('img-fluid'));

//ADDS .BTN-LINK TO ARTICLE LINKS
const btnLink = document.querySelectorAll('article p a');
btnLink.forEach(x => x.classList.add('btn-link'));

//SETS YEAR FOR FOOTER
const setYear = () => {
    const copyrightYear = document.getElementById("year");
    copyrightYear.innerHTML = new Date().getFullYear();
}