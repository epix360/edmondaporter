// OPEN / CLOSE STATE FOR BLOG POST LIST ACCORDION
const postAccordion = document.querySelector('#postAccordion');

if (screen.width > 767 || location.pathname === '/blog/archive') {
    postAccordion.open = true;
} else {
    postAccordion.open = false;
}