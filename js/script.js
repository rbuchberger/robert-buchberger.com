// eslint no-unused-vars: off, no-undef: off
const navMenu = document.querySelector('nav.main ul');
const menuButton = document.querySelector('.hamburger');
const navTab = document.querySelector('div.navbar-tab');

function toggleMenu() {
  navMenu.classList.toggle('hidden-mobile');
  menuButton.classList.toggle('active');
}

menuButton.addEventListener('click', toggleMenu);

// Progressive enhancement: Show the nav menu and hide the button by default, switch them o ut once we know javascript works. 
navMenu.classList.add('hidden-mobile');
menuButton.classList.remove('hidden-mobile');

// Enable swup
// const options = {
//   debugMode: true
// };

const swup = new Swup();

// swup:pageView triggers on page loaded by swup, DOMContentLoaded triggers when
// loading page the first time or on refresh.
['DOMContentLoaded', 'swup:pageView'].forEach(event => {
  document.addEventListener(event, navUpdate);
});

function navUpdate(e) {
  // Get current location (i.e. blog, home, or root)
  const location = grabPosition(window.location.pathname);
  // Grab all nav items
  const navItems = Array.from(navMenu.children);
  // Grab appropriate nav item
  const activeItem = navItems.find(item => {
    return grabPosition(item.firstChild.attributes.href.value) === location;
  });
  // Style nav items
  navItems.forEach(item => {
    if (item === activeItem) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  // Size background div
  // Position background div
}

// Given a relative pathname, determine site base position. Example:
// Given 'blog.html', return 'blog', given '/', return '', given
// '/blog/2018/aviation-and-programming.html' return 'blog'
function grabPosition(url) {
  return url.split(/[\/.]/)[1];
}
