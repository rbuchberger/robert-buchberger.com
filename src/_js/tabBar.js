// This handles the tab menu on the projects page.
class TabBar {
  constructor(swup) {
    this.swup = swup
    this.selectedTab = '1'

    this.swup.on('pageView', this.setup.bind(this))
    window.addEventListener('DOMContentLoaded', this.setup.bind(this))
  }

  setup() {
    this.tabs = document.querySelector('.tabs')

    if (!this.tabs) {
      return
    }

    this.buttons = Array.from(this.tabs.querySelectorAll('.tabs__button'))
    this.pages = this.tabs.querySelectorAll('.tabs__page')

    this.buttons.forEach(button => {
      button.addEventListener('click', this.update.bind(this))
    })

    document.body.addEventListener('keyup', this.handleKeyPress.bind(this))

    this.update()
  }

  update(e) {
    if (e) {
      this.selectedTab = e.target.dataset.index
    }

    this.pages.forEach(page => {
      if (this.selectedTab === page.dataset.index) {
        page.classList.remove('tabs__page_hidden')
      } else {
        page.classList.add('tabs__page_hidden')
      }
    })

    this.buttons.forEach(button => {
      if (button.dataset.index === this.selectedTab) {
        button.classList.add('tabs__button_active')
      } else {
        button.classList.remove('tabs__button_active')
      }
    })
  }

  // click events don't capture tab-focus + enter; this does.
  handleKeyPress(e) {
    if (e.keyCode == 13 && this.buttons.includes(document.activeElement)) {
      this.selectedTab = document.activeElement.dataset.index
      this.update()
    }
  }
}

export default TabBar
