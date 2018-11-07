// import Swup from '/js/swup.min.js';
// eslint no-unused-vars: off, no-undef: off
const navMenu = document.querySelector('nav.main');
const navMenuList = document.querySelector('nav.main ul');
const menuButton = document.querySelector('.hamburger');
const navTab = document.querySelector('div.navbar-tab');

// swup:pageView triggers on page loaded by swup, DOMContentLoaded triggers when
// loading page the first time or on refresh.
['DOMContentLoaded', 'swup:pageView'].forEach(event => {
  document.addEventListener(event, navUpdate);
});

window.addEventListener('resize', resizeThrottled);
let throttled;

function resizeThrottled() {
  if (throttled) return;

  instantNavUpdate();

  throttled = true;
  setTimeout(() => {
    throttled = false;
    // If another resize happens while throttled, it'll end up in the wrong
    // place. This fixes that:
    instantNavUpdate();
  }, 100);
}

// Position highlight div, without transition effects.
function instantNavUpdate() {
  navTab.classList.remove('slide-transition');
  navUpdate();
  // Wait to enable transitions till we're sure it's in the right place:
  window.setTimeout(enableHighlightTransition, 100);
}

function enableHighlightTransition() {
  navTab.classList.add('slide-transition');
}

menuButton.addEventListener('click', toggleMenu);

function toggleMenu() {
  navMenu.classList.toggle('open');
  menuButton.classList.toggle('active');
}

function closeMenu() {
  window.setTimeout(() => {
    navMenu.classList.remove('open');
    menuButton.classList.remove('active');
  }, 500);
}


// Enable swup
const options = {
  // debugMode: true
};

new Swup(options);

function navUpdate() {
  // Get current location (i.e. blog, home, or root)
  const location = getBasePath(window.location.pathname);

  // Grab all nav items
  const navItems = Array.from(navMenuList.children);

  // Grab appropriate nav item
  const activeItem = navItems.find(item => {
    return getBasePath(item.firstChild.attributes.href.value) === location;
  });

  // Position Div
  updateHighlightPosition(activeItem.getBoundingClientRect());

  // Style nav items
  navItems.forEach(item => {
    if (item === activeItem) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Close the mobile drawer
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
  return url.match(/^\/?(\w*)[/.]?/g).pop();
}
