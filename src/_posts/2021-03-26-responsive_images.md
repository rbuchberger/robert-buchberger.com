---
title: Images, Correctly.
summary:
  Responsive Images are a collection of simple solutions, which become annoyingly
  complex when you combine them.
published: true
image:
  url: blog/responsive_images/IMG_20191022_092607.jpg
  alt: Pestka
  caption: "This entire article is just an excuse to show off pictures of my dog."
---

This is lazy, and not in a good way:

```html
<img src="myimage.jpg" />
```

It might be fine for a small, personal project, but if it's meant for public
consumption there is probaby not one single image file which serves everyone
well. If you are willing to jump through some (many) hoops, by offering images
responsively you can give every last one of your users a good experience.

Despite the confident title, there is quite a lot more to be said on the subject
than I'll say here. I'm not going into lazy loading, the processing of image
files themselves, or techniques to prevent page reflow. While those things are
important and you should definitely learn them, here I'll only focus on
responsive images and leave the rest for another day. That means everything in
this article is pure HTML; it applies to every platform, every framework, and
every stack.

# Problems

"Responsive Images" are a set of solutions to a set of problems, which
ultimately stem from one: _People use wildly different devices to view the same
content._ When displays can range from smartwatches to the
[Matterhorn](https://www.zermatt.ch/en/hope), there are very few safe
assumptions available to us.

Since a solution only makes sense if you understand the problem it exists to
address, let's start by breaking down the problems that responsive images solve:

## Image Resolution

This is the most intuitive issue; bigger screens need bigger images. HiDPI
screens need bigger images. Get it wrong, and you either waste bandwidth or have
blurry photos. We want to match the number of pixels in the image file to the
number of physical, hardware pixels that will display it. This is determined by
its physical dimensions when displayed, and the screen's pixel density. "pixel
density" is the number of pixels per unit length, usually given in "Pixels Per
Inch" (PPI). Another way to think of it is the reciprocal of pixel size-- pixel
density is the frequency to pixel size's wavelength.

```
ideal width (pixels) = displayed width (inches) * display PPI
```

For example, If we have an image which will be ultimately be 5 inches wide when
displayed on some screen with a pixel density of 96 PPI, A perfectly sized image
would be `5 * 96 = 480` pixels wide. There is no "standard" pixel density, and
it can vary hugely between devices. An average desktop monitor might have ~100
PPI, while a high end smartphone might have a pixel density of ~400 PPI.

_We need a way to offer a selection of image sizes, and let the browser choose
the best fit._ This is called the **"resolution switching"** problem.

## Design

Sometimes, an image's resolution isn't the problem. Maybe your banner image
looks gorgeous on desktop, but it gets all skinny and wrong on mobile. Maybe the
important part of an image gets too small to see below a certain size, so you
want to use a tighter crop instead. Maybe you have a [portfolio](/projects) page
and you want to show screenshots of the desktop layout to desktop users while
showing the mobile layout to mobile users. Just like you often rearrange your
layout at different breakpoints, you often want to swap out images at the same
time.

A further complication is the somewhat obvious fact that the further away
something is, the smaller it appears to the viewer. In other words, "Perceived
Size" is determined not only by image size and pixel density, but also viewing
distance. Consider that you can buy both smartphones and televisions with 1080p
displays; if (assuming the phone is held sideways) they have the same screen
resolution, does that mean we can always treat them the same? Sorry, but no. Not
even close.

_We need a way to coordinate images with varying screen dimensions and viewing
distances._ This is called the **Art Direction** problem. Don't confuse it with
resolution switching; they have nothing to do with each other.

## Browser Compatibility

At the time of writing, Chrome and Firefox both support webp. Safari, being
Safari, doesn't. It supports jpeg2000 instead. You don't have to go very
far back in time to find browsers which don't support either. How do we offer
cool, new formats without excluding those who can't use them?

_We need a way to offer the same image in multiple formats._ I haven't heard a
proper name for this, but we'll call it the **"format switching"** problem.

# Solutions

Just like the problems all stem from a single one, the solutions do too: _Use
different image files in different situations._ We'll look at each one
individually, and then bring them all together at the end.

## Resolution Switching

Given the complexities of pixel density and viewing distance, have you ever
wondered why you don't have to adjust fonts and spacing to account for them? It
turns out the `px` units we deal with in CSS are a little white lie. They don't
refer to physical pixels on a display, they're "CSS pixels" which are meant to
represent a constant perceived size across all devices. Physical and CSS pixels
are related to each other by a setting called "pixel ratio":

```
physical pixels = css pixels * pixel ratio
```

Pixel Ratio is a browser setting which accounts for both pixel density and
viewing distance. It will usually range from ~1 (average desktop) to ~3 (high
end smartphone).

The web browser itself will pick the best fit for us; We just need to give it
some options and information. Our basic tools for this are the `srcset` and
`sizes` attributes, which can be applied to either an `<img>` or a `<source>`
tag.

### Width Based Srcsets

There are 2 formats a srcset can take. (Well, 3 if you count a single image by
itself). The first, and the one you want to use most of the time, is based on
image width. It looks like this:

```html
<img
  srcset="myimage-6.jpg 600w, myimage-9.jpg 900w, myimage-12.jpg 1200w"
  src="myimage.jpg"
/>
```

In other words, a comma separated list of image URLs and their widths. We're
telling the browser "Here's a list of image files, here's how many pixels they
have, use whichever one fits best." The `src` attribute is part of the spec;
it's required as a fallback for browsers which don't support `srcset` (of which
there are very few in use these days).

```
  srcset="<uri> <integer>w, <uri> <integer>w, ..."
```

Sadly, there's a hitch. When a browser renders a page, it starts downloading
images before it has drawn the page layout. Put simply, a browser renders a page
by first parsing its HTML line-by-line, and when it runs into an additional
asset it must download (such as Javascript, CSS, or an image), it starts that
process immediately. This means at the moment in time when it must decide which
image to download, it has no idea how large it will be on the page. Thumbnail
or hero, it has no clue. We have to tell it, like this:

```html
<img
  sizes="(max-width: 600px) 80vw, 600px"
  srcset="myimage-6.jpg 600w, myimage-9.jpg 900w, myimage-12.jpg 1200w"
  src="myimage.jpg"
/>
```

In words this says (via the `sizes` attribute):

> When the viewport is less than 600 pixels wide, this image will be 80% of the
> width of the viewport. Otherwise, it will be 600 pixels wide.

Basically, the `sizes` attribute is a comma-separated list of media queries and
widths, with a final unconditional width at the end.

```
sizes="(<media query>) <width>, (<media query>) <width>, ..., <width>"
```

**Some notes:**

- The width can be given in `px`, `em`, `rem`, or `vw`
- You can't use `%` (as in percentage of the parent container), for the same
  reason we have to do this at all.
- If you don't give a `sizes` attribute, the browser will use a value of
  `100vw`.
- You can use things like `calc(100vw - 18px)`
- This doesn't have to be pixel-perfect. It doesn't affect your layout, it just
  helps the browser determine which image will fit best.

Here's a demo:

{% picture blog/responsive_images/DSC_0722.jpg %}

To see it in action, open up your dev tools to the network tab and resize the
page. You should see requests for different image sizes for all the images here.

### Pixel Ratio Srcset

Some images, such as thumbnails and icons, are always the same width on all
screens. If that's the case, the only factor we need to account for is pixel
ratio, and we can use a simpler format:

```html
<img
  srcset="myimage-100.jpg 1x, myimage-150.jpg 1.5x, myimage-200.jpg 2x"
  src="myimage.jpg"
/>
```

```
  srcset="<url> <pixel ratio>x, <url> <pixel ratio>x, ..."
```

We can omit the `sizes` attribute, and in the `srcset` give pixel ratios instead
of pixel widths for each image. The browser will simply take whichever image
most closely matches its own pixel ratio.

Given that it's simpler to write and easier to understand, it's tempting to
reach for this format when it's not appropriate. **Only use multipliers when the
image is always the same size on all screens.**

## Art Direction

_Remember, resolution switching refers to offering different sizes of the same
image, while art direction refers to offering different images for different
layouts._

To solve the Art Direction problem, I'd like to introduce you to the `<picture>`
and `<source>` elements. You use them like this:

```html
<picture>
  <source media="(max-width: 600px)" srcset="myimage_cropped.jpg" />
  <source srcset="myimage_wide.jpg" />
  <img src="myimage.jpg" alt="" />
</picture>
```

In English, this says something like:

> If your display is 600 css pixels wide or smaller, use `myimage_cropped.jpg`.
> Otherwise, use `myimage_wide.jpg`. If you are a dinosaur and don't understand
> `<picture>` and `srcset=`, just use `myimage.jpg`. If you are a screenreader,
> ignore this image.

To associate a given image with a given breakpoint, you can simply add the
appropriate media query. Some notes:

- A `<picture>` indicates a single image that will be displayed to the user,
  among multiple possibilities. It contains any number of `<source>` tags,
  followed by a fallback `<img>`.
- A `source` is a bit like an `img`, except it doesn't use `src` and `alt`. Its
  primary purpose is to hold a `srcset` attribute, and others associated with
  it.
- The `media` attribute accepts a CSS media query. If that media query isn't
  true, its entire source tag is ignored.
- The browser will pick the first valid `<source>` tag; if there are none it
  will use the `<img>`.
- Alt text goes in the same place it always has: as an attribute of the `<img>`
  tag.

Here's a demo! No network tab necessary this time, just resize the window.

{%
  picture /blog/responsive_images/running.jpg 2:1 entropy
  full_width: /blog/responsive_images/running.jpg 1:1
%}

### Resolution Switching vs Art Direction

Personally, this was my biggest source of confusion learning this subject. Why
can't you just use cropped images in your `srcset`? Because pixel ratio, that's
why. Using that approach, the only way to ensure your images match your layout
would be to target a single pixel ratio at the expense of all others. For
instance, if you target a pixel ratio of 1 then anyone with a pixel ratio of 2
would see images intended for screens twice the size of what they're actually
looking at.

When you use a `srcset`, you are saying "Pick any one of these images, I don't
care which one. They all work with my layout." When you use a `<source>` with a
`media` attribute, you are being more directive. You're saying "This image only
fits correctly when this media query is true. If it's not, ignore it and keep
looking."

## Format switching

Format switching works basically the same way as art direction:

```html
<picture>
  <source srcset="myimage.webp" type="image/webp" />
  <source srcset="myimage.jp2" type="image/jp2" />
  <img src="myimage.jpg" alt="The Best Dog" />
</picture>
```

In English, this says something like:

> Here's a webp image, if you know how to use that then do so. Otherwise, here's
> a jp2. If you can't display either of those, or if you don't know what a
> `picture` tag is, ignore it and use this `img` tag instead. If you are a
> screenreader, this is an image of the best dog.

Basically, you provide a mime type within a `type` attribute for each source. If
a browser can't handle that particular type, it will ignore that `source` and
move on to the next one. **Order matters**; if you place a `jpeg` source before
a `webp` source, the `webp` source will never get used.

Why can't it just look at the file extensions? Because the world sucks and
nothing is ever simple.

You want a demo? Every image on this page is offered in both webp and jpg. On
most newer browsers if you right click -> save as, you'll get a webp, but if you
come here in an older browser that doesn't suppor it the images will all work
fine. Go ahead, fire up dosbox! The javascript and styles will be pretty broken,
but the images should all work fine. Here's a very sad dog to test it out on:

{% picture /blog/responsive_images/saddog.jpg %}

# Combining them all

This is where it gets ugly. These solutions have been carefully crafted to stay
out of each others' way, allowing you to use any combination you like.
Unfortunately the number of images and complexity of the markup increase
drastically as you do so.

For example, if you (quite reasonably) want to offer 2 crops of an image, in 3
resolutions, in both webp and jpg formats, you have 12 images to generate, name,
and organize. The markup would look something like this:

```html
<picture>
  <source
    type="image/webp"
    media="(max-width: 600px)"
    sizes="(max-width: 600px) 80vw, 600px"
    srcset="
      /images/myimage-cropped-600.webp   600w,
      /images/myimage-cropped-900.webp   900w,
      /images/myimage-cropped-1200.webp 1200w
    "
  />
  <source
    type="image/webp"
    sizes="(max-width: 600px) 80vw, 600px"
    srcset="
      /images/myimage-600.webp   600w,
      /images/myimage-900.webp   900w,
      /images/myimage-1200.webp 1200w
    "
  />
  <source
    type="image/jpeg"
    media="(max-width: 600px)"
    sizes="(max-width: 600px) 80vw, 600px"
    srcset="
      /images/myimage-cropped-600.jpg   600w,
      /images/myimage-cropped-900.jpg   900w,
      /images/myimage-cropped-1200.jpg 1200w
    "
  />
  <source
    type="image/jpeg"
    sizes="(max-width: 600px) 80vw, 600px"
    srcset="
      /images/myimage-600.jpg   600w,
      /images/myimage-900.jpg   900w,
      /images/myimage-1200.jpg 1200w
    "
  />
  <img src="myimage-800.jpg" alt="We always write alternate text." />
</picture>
```

... Which is why I strongly advise you to automate this. Use a plugin or script
of some sort, and if that doesn't exist for your particular stack then consider
writing it.

That doesn't absolve you of learning Responsive Images, of course. If you don't
understand it, you won't know how to use your tools, and you'll get it wrong, at
the cost of your users and whoever pays for hosting. Garbage in, garbage out.
