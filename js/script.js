import Swup from 'swup'
const navMenu = document.querySelector('nav.main')
const navMenuList = document.querySelector('nav.main ul')
const menuButton = document.querySelector('.hamburger')
const navTab = document.querySelector('div.navbar-tab')

// DOMContentLoaded triggers when loading page the first time or on refresh.
window.addEventListener('load', instantNavUpdate)

// swup:willReplaceContent triggers when a link is clicked. This allows the
// animation to start instantly, rather than waiting for new content to
// download.
document.addEventListener('swup:clickLink', navUpdate)

// swup:pageView triggers when content is displayed. Triggering a second time
// accounts for scroll bar appearing or disappearing on page load. Without this
// call, highlight ends up in the wrong place if the scrollbar is added or removed
// between pages.
document.addEventListener('swup:pageView', navUpdate)

// We need to reposition the highlight when the window is resized.
window.addEventListener('resize', resizeThrottled)

// Close the nav menu when a link is selected.
document.addEventListener('swup:clickLink', closeMenu)

// Add functionality to the nav menu.
menuButton.addEventListener('click', toggleMenu)

// Enable Swup
new Swup()

let throttled

function resizeThrottled() {
  if (throttled) return

  instantNavUpdate()

  throttled = true
  setTimeout(() => {
    throttled = false

    // If another resize happens while throttled, it'll end up in the wrong
    // place. This fixes that:
    instantNavUpdate()
  }, 100)
}

// Position highlight div, without transition effects.
function instantNavUpdate() {
  navTab.classList.remove('slide-transition')
  navUpdate()
  // Wait to enable transitions till we're sure it's in the right place:
  window.setTimeout(enableHighlightTransition, 300)
}

function enableHighlightTransition() {
  navTab.classList.add('slide-transition')
}

function toggleMenu() {
  navMenu.classList.toggle('open')
  menuButton.classList.toggle('active')
}

function closeMenu() {
  window.setTimeout(() => {
    navMenu.classList.remove('open')
    menuButton.classList.remove('active')
  },
  150
  )
}

function navUpdate(e) {
  // Get current location (i.e. blog, home, or root)
  // Event is optional. If passed, and if its target element has an href, use
  // that as the target. Otherwise use current location.
  const targetPath = getBasePath(new URL(
    e && e.currentTarget.activeElement.href ?
      e.currentTarget.activeElement.href :
      window.location.href
  ).pathname)

  // Grab all nav items
  const navItems = Array.from(navMenuList.children)

  // Grab appropriate nav item
  const activeItem = navItems.find(item => {
    return getBasePath(item.firstElementChild.attributes.href.value) ===
      targetPath
  }) || navItems[0]

  // Set target position of div
  const targetPosition = findTargetPosition(activeItem)

  // Position Div
  updateHighlightPosition(targetPosition)

  // Style nav items
  navItems.forEach(item => {
    if (item === activeItem) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
}

function findTargetPosition(activeItem) {
  return {
    width: activeItem.offsetWidth,
    height: activeItem.offsetHeight,
    top: activeItem.offsetTop + navMenu.offsetTop,
    left: activeItem.offsetLeft + navMenu.offsetLeft
  }
}

function Transformation(targetPosition) {
  // We add a little fudge factor to the X scale to prevent ugly white gaps
  // between the outline and the highlight.
  this.scaleX = .01 + (targetPosition.width / navTab.offsetWidth)
  this.scaleY = targetPosition.height / navTab.offsetHeight
  this.translateY = (targetPosition.top - navTab.offsetTop - navMenu.offsetTop)
  this.translateX = (targetPosition.left - navTab.offsetLeft - navMenu.offsetLeft)
}

function updateHighlightPosition(targetPosition) {
  const trans = new Transformation(targetPosition)
  navTab.style.transform =
    `translate(${trans.translateX}px, ${trans.translateY}px) scale(${trans.scaleX}, ${trans.scaleY}) `
}

// Given a relative pathname, determine site base position. Example: Given
// 'blog.html', return 'blog', given '/', return '', given
// '/blog/2018/aviation-and-programming.html' return 'blog'
function getBasePath(url) {
  return /^\/?(\w*)[/.]?/.exec(url)[1]
}
