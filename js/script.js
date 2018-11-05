const navMenu = document.querySelector('nav.main ul');
const menuButton = document.querySelector('.hamburger');

function toggleMenu() {
  navMenu.classList.toggle('hidden-mobile');
  menuButton.classList.toggle('active');
}

menuButton.addEventListener('click', toggleMenu);

// Progressive enhancement: Show the nav menu and hide the button by default, switch them o ut once we know javascript works. 
navMenu.classList.add('hidden-mobile');
menuButton.classList.remove('hidden-mobile');

// Enable swup
const swup = new Swup();
