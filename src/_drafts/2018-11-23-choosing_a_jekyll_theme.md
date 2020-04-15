---
title: Choosing A Jekyll Theme
summary: There's more to it than pretty colors.
image:
  url: projects/screenshot-LiSEC-Tech.png
  alt: Screenshot of Lisec Tech
  caption: Learn from my mistakes.
---

Hypothetical scenario: You're making a new jekyll site. You don't want to start from scratch; you
just want to take something and modify it! You dive into [jekyllthemes.org](jekyllthemes.org), spend
a few minutes and find one you like. 

After some fumbling, you hack it together into something respectable, and deploy your new blog. You
live on happily for awhile, but eventually you want to make some changes. Maybe you want to tweak
the layout, or change the navigation structure. Maybe you noticed that it chugs on your friend's
older computer, or it doesn't behave well when you're out in the country on 3G. 

So you check out a new branch fire up a text editor, and pull up `main.css`. 4000 lines??!? It's a 5
page site! What on Earth could you need 4000 lines of CSS for? Or maybe you open up the default
layout, to see a mess of <div> tags. Or you run pagespeed insights against your website with less
than stellar scores.

You have a choice: Scrap your existing theme completely, or invest serious time into wrapping your
mind around the existing code before you can even start fixing it.

## You could have avoided this.

Do more than click through the demo site. The theme you choose is a moderately serious commitment,
and if you get it wrong it can hurt later! You don't have to know too much HTML, CSS, or JavaScript
to accomplish this either (though it certainly helps).

### Don't just pick the prettiest one.

It's a fine starting point; the less you have to modify the styles, the less time you'll have to
invest in getting the site up and running. It's also the easiest selection criteria; pretty much
every jekyll theme has screenshots and a demo site to play with. That said, keep in mind: 

**Many of the things which catch your eye are among the easiest to change. Customizing a theme
color, or a font, or a background image will almost certainly not break anything else.** Pay more
attention to the overall architecture, layout and behaviour.

Once you've found a candidate, it's time to dig a bit.

### Start with Lighthouse Audits

Go to the theme's demo page in Chrome and fire up the dev tools. Go to the Audits tab, uncheck
Progressive Web App (unless you know what that is and want to build one), and run them. 

Keep in mind that **These scores are not the whole picture.** Poor performance numbers on the demo
site may come from easily correctable issues that won't be a problem with your own. Ignore penalties
from things that are not integral to the theme itself, such as image size (easily fixed) static
asset caching policy (It's a server configuration), or HTTPS (also server configuration).

Another caveat is that many browser extensions inject and run javascript on every page, which shows
up in Lighthouse scores. You'll get better numbers by disabling them, using incognito mode (which
disables extensions by default), or using [Pagespeed
Insights](https://developers.google.com/speed/pagespeed/insights/).

So what _do_ you care about? Things in this vein:

-   Render blocking resources
-   Significant Main Thread Work
-   Enormous network payloads
-   Accessibility warnings harder to fix than 'Images do not have alt attributes'
-   JavaScript Libraries with known security vulnerabilities
-   Best Practice warnings (other than HTTPS)

Very few sites get perfect Lighthouse scores, and building to that standard is of questionable value
anyway (it's just an automated test suite). Look through the failing tests and evaluate them
individually. Is it the theme's fault? If so, can you live with it? If not, how hard will it be to
fix? Worth it?

### Peek at the console tab.

Bunch of warnings that aren't missing assets? Big red flag.

### Network tab:

Sort requests by size. Problems here will be pointed out in the Lighthouse audits as well, but this
will give you a feel for what libraries it's loading and what their performance impact is. If a
normal webpage comes in over a megabyte or two in total, it might be a problem (depending on how those
assets are loaded).

You can also get a look at the different libraries and assets in use. The fewer, and the lighter,
the better. The filter buttons are useful here, as well as the sources tab. Anything over 100kb is
big, and things in the megabyte range are enormous.

Some common ones:

* Analytics of some sort: Probably fine, unless huge.
* jQuery: If it's prior to version 3, stay away. Later versions are fine, but it's falling out of
    popularity as vanilla Javascript has caught up to its capability. Prefer not to have it.
* Bootstrap: Version 3 is technical debt. Version 4 is up to you; it can be easy to get started
  with, but there's some extra baggage above what you'd have with only site-specific CSS.
* Font Awesome: Convenient, but you're paying a performance tax. You really want SVG icons.
* Web fonts (*.woff or *.woff2, use the Font filter): Two or three are fine. 10 is excessive.
  Consider the file sizes.

Finally, select a throttle setting (the 'online' dropdown) and navigate around some. See how it
behaves on 3G; Does the page jump around as it loads? Does it redraw itself several times? Do
animations do odd things? Does it feel unresponsive?

### Head over to the Elements tab.

Now is a good time to look at the HTML and CSS structure. Do you see semantic HTML tags (things like
header, nav, article, and section) or just divs inside of divs? Divs are not automatically
disqualifying, but this is also not best-practice. Web crawlers and screen readers will have a harder
time with your site.

Good: `<main class="container">`

Bad: `<div id="main" class="container">`

Now select a few different elements and look at their styles in the right-hand tab. There are a few
'code smells' to look for:

-   Do many elements have many classes applied? Do most elements have no classes at all?
-   Is the styles tab enormous? Do you see the same attributes overridden repeatedly? 
-   Do you see `!important` used frequently?

If so, you'll have a harder time customizing styles.

### If you've reached this point without running into any deal-breakers, 
You probably have a decent theme on your hands.

If you know how, and plan to customize the site much, you should look at the code on GitHub. How
does the site achieve its layout? Does the CSS organization make any sense? How much custom
javascript? Does it make sense?

## Whatever choice you make,

You'll have to live with it for awhile. Be picky, or you're not doing justice to your users and/or
clients. None of the problems above are unfixable, and few are unforgivable, but some take a great
deal more effort than others. 
