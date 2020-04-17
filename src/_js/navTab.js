class NavTab {
  constructor(swup, menu_selector, tab_selector, button_selector) {
    this.throttled = false
    this.swup = swup
    this.navMenu = document.querySelector(menu_selector) // nav.main
    this.navMenuList = document.querySelector(menu_selector + ' ul')
    this.navTab = document.querySelector(tab_selector) // div.navbar-tab
    this.menuButton = document.querySelector(button_selector) // .hamburger

    // Grab all nav items
    this.navItems = Array.from(this.navMenuList.children)

    // Add event listeners
    // DOMContentLoaded triggers when loading page the first time or on refresh.
    window.addEventListener('load', this.instantNavUpdate.bind(this))

    // We need to reposition the highlight when the window is resized.
    window.addEventListener('resize', this.resizeThrottled.bind(this))

    // Add functionality to the nav menu.
    this.menuButton.addEventListener(
      'click',
      this.toggleMenu.bind(this)
    )

    this.swup.on('clickLink', this.navUpdate.bind(this))

    // pageView triggers when content is displayed. Triggering a second time
    // accounts for scroll bar appearing or disappearing on page load. Without this
    // call, highlight ends up in the wrong place if the scrollbar is added or removed
    // between pages.
    this.swup.on('pageView', this.navUpdate.bind(this))

    // Close the nav menu when a link is selected.
    this.swup.on('clickLink', this.closeMenu.bind(this))
  }

  navUpdate(e) {
    // Get current location (i.e. blog, home, or root)
    // Event is optional. If passed, and if its target element has an href, use
    // that as the target. Otherwise use current location.
    const targetPath = this.getBasePath(
      new URL(
        e && e.currentTarget.activeElement.href
          ? e.currentTarget.activeElement.href
          : window.location.href
      ).pathname
    )

    // Grab appropriate nav item
    const activeItem =
      this.navItems.find(item => {
        return (
          this.getBasePath(item.firstElementChild.attributes.href.value) ===
          targetPath
        )
      }) || this.navItems[0]

    // Position Div
    this.updateHighlightPosition(this.findTargetPosition(activeItem))

    // Style nav items
    this.navItems.forEach(item => {
      if (item === activeItem) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  // Position highlight div, without transition effects.
  instantNavUpdate() {
    this.navTab.classList.remove('slide-transition')
    this.navUpdate()
    // Wait to enable transitions till we're sure it's in the right place:
    window.setTimeout(() => {
      this.navTab.classList.add('slide-transition')
    }, 300)
  }

  findTargetPosition(activeItem) {
    return {
      width: activeItem.offsetWidth,
      height: activeItem.offsetHeight,
      top: activeItem.offsetTop + this.navMenu.offsetTop,
      left: activeItem.offsetLeft + this.navMenu.offsetLeft
    }
  }

  updateHighlightPosition(targetPosition) {
    const trans = new Transformation(targetPosition, this.navTab, this.navMenu)
    this.navTab.style.transform = `translate(${trans.translateX}px, ${trans.translateY}px) scale(${trans.scaleX}, ${trans.scaleY}) `
  }

  // Given a relative pathname, determine site base position. Example: Given
  // 'blog.html', return 'blog', given '/', return '', given
  // '/blog/2018/aviation-and-programming.html' return 'blog'
  getBasePath(url) {
    return /^\/?(\w*)[/.]?/.exec(url)[1]
  }

  resizeThrottled() {
    if (this.throttled) return

    this.instantNavUpdate()

    this.throttled = true
    setTimeout(() => {
      this.throttled = false

      // If another resize happens while throttled, it'll end up in the wrong
      // place. This fixes that:
      this.instantNavUpdate()
    }, 100)
  }

  toggleMenu() {
    this.navMenu.classList.toggle('open')
    this.menuButton.classList.toggle('active')
  }

  closeMenu() {
    window.setTimeout(() => {
      this.navMenu.classList.remove('open')
      this.menuButton.classList.remove('active')
    }, 150)
  }
}

class Transformation {
  constructor(targetPosition, navTab, navMenu) {
    // We add a little fudge factor to the X scale to prevent ugly white gaps
    // between the outline and the highlight.
    this.scaleX = 0.01 + targetPosition.width / navTab.offsetWidth
    this.scaleY = targetPosition.height / navTab.offsetHeight
    this.translateY = targetPosition.top - navTab.offsetTop - navMenu.offsetTop
    this.translateX =
      targetPosition.left - navTab.offsetLeft - navMenu.offsetLeft
  }
}

export default NavTab
