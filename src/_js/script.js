// Enable Swup
import Swup from 'swup'
const swup = new Swup()

// Main Nav Menu
import NavTab from './navTab'
let main_tab = new NavTab(swup, 'nav.main', 'div.navbar-tab', '.hamburger')

// Tab Interface (projects page)
import TabBar from './tabBar'
const tabs = new TabBar(swup)
