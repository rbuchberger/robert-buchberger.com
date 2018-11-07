// import Swup from '/js/swup.min.js';
// eslint no-unused-vars: off, no-undef: off
const navMenu = document.querySelector('nav.main');
const navMenuList = document.querySelector('nav.main ul');
const menuButton = document.querySelector('.hamburger');
const navTab = document.querySelector('div.navbar-tab');

menuButton.addEventListener('click', toggleMenu);

// swup:pageView triggers on page loaded by swup, DOMContentLoaded triggers when
// loading page the first time or on refresh.
['DOMContentLoaded', 'swup:pageView', 'transitionend'].forEach(event => {
  document.addEventListener(event, navUpdate);
});


window.addEventListener('resize', resizeDebounced);
let timeout;

function resizeDebounced() {
  window.clearTimeout(timeout);

  timeout = window.setTimeout(instantNavUpdate, 100);
}

// Position highlight div, without transition effects.
// We have to delay adding the transition class back.
function instantNavUpdate() {
  navTab.classList.remove('slide-transition');
  navUpdate();
  timeout = window.setTimeout(enableHighlightTransition, 500);
}

function enableHighlightTransition() {
  navTab.classList.add('slide-transition');
}

function toggleMenu() {
  navMenu.classList.toggle('open');
  menuButton.classList.toggle('active');
}

function closeMenu() {
  window.setTimeout(() => {
    navMenu.classList.remove('open');
    menuButton.classList.remove('active');
  }, 300);
}


// Enable swup
const options = {
  // debugMode: true
};

const swup = new Swup(options);


function navUpdate() {
  // Get current location (i.e. blog, home, or root)
  const location = getBasePath(window.location.pathname);
  // Grab all nav items
  const navItems = Array.from(navMenuList.children);
  // Grab appropriate nav item
  const activeItem = navItems.find(item => {
    return getBasePath(item.firstChild.attributes.href.value) === location;
  });
  const targetPosition = activeItem.getBoundingClientRect();
  // Position Div
  updateHighlightPosition(targetPosition);
  // Style nav items
  navItems.forEach(item => {
    if (item === activeItem) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  closeMenu();
}

function updateHighlightPosition(target) {
  // Parent element is positioned relative, so we have to account for its
  // height.
  const offsetHeight = navMenu.getBoundingClientRect().top;

  // Size background div
  navTab.style.height = `${target.height}px`;
  navTab.style.width = `${target.width}px`;

  // Position background div
  navTab.style.top = `${target.top - offsetHeight}px`;
  navTab.style.left = `${target.left}px`;
}

// Given a relative pathname, determine site base position. Example:
// Given 'blog.html', return 'blog', given '/', return '', given
// '/blog/2018/aviation-and-programming.html' return 'blog'
function getBasePath(url) {
  return url.split(/[\/.]/)[1];
}
