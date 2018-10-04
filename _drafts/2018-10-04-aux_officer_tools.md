---
title: "Project: Aux Officer Tools"
summary: 
  What exactly does this Rails app do?
image: 
  url: projects/screenshot-mtns.png
  alt: Screenshot of homepage
  caption: "Bootstrap much?"

---

I wanted to give an in-depth description of this project in particular, for a
few reasons:

- It's hard to see a demo. You have to spin up your own rails server to test
  drive it.
- 95% of the content is behind a login, which you can't have access to.
- It's the biggest, most complicated project I've ever done, while also being
  the first 'real world' project I've ever done.
- I've mentioned it on the project page, and the Github readme gives a decent
  overview, but neither of those are a great place to talk about the guts of
  that project at length. Blog post makes sense.

## Circumstances

I decided around September of 2017 that I needed a career change. I need a job
which pays well enough to support a family, allows me to work remotely, and
lets me solve challenging problems. I settled on web development, and started
taking Lynda courses followed by Rob Dey's 'Upskill' tutorial. In this
tutorial, we built a rails application for a fictional startup. It had basic
CRUD capability for a few different resources, it interfaced with an external
API, used Bootstrap, and addressed many of the challenges required to build a
complete website. It certainly didn't teach me everything, but it gave me a
few basic tools to get started on my own. 

Around the time I was finishing this tutorial, my dad called me up looking for a
website. He volunteers with a small-town Tennessee county Sheriff's office, and
they needed a few different things which I knew I could provide. At my other job
the cardinal rule is "never work for free", but seeing as it was such a good
learning opportunity, I decided to make an exception. So with a few video
tutorials and a budget of precisely $0, I rolled up my sleeves and got to
work.

## Specifications

- Only allow logged-in, authorized users to access any content beyond the login screen.
- Require administrator approval of all new users.
- Provide a mechanism for volunteers to log hours spent working, with robust validations.
- Embed training videos, and provide a way to track who has completed this training.
- Provide a central bulletin board for posting announcements.
- (later on) Provide a document library, allowing them to share files between each other.

## Architecture

The website is hosted on Heroku's free tier. (Not long after the website went
live I inquired about upgrading to the $7 plan, to be told the office could not
afford such things. I chose to ignore the implications of this attitude
regarding the value of my own work.) The registrar is GoDaddy (chosen by the
client). User login & registration is handled by devise, with necessary
modifications to enable administrator approval of new signups. The document
library is in an AWS s3 bucket, the styling is entirely stock Bootstrap, and
the test suite is MiniTest. Training videos are listed or unlisted YouTube
videos (pretty much your only option with a budget of 0).

Sometime later on, I worked out that I could use an Amazon Cloudfront
distribution to enable HTTPS encryption, which is not a feature offered by
Heroku's free tier when combined with a custom domain name. The site doesn't
have much cacheable content, meaning the CDN was actually a performance hit,
but what else can you do? Database backups are handled by a script on my local
machine, executed by anacron, which downloads, encrypts, and uploads the
database dump to S3. (Yes, it's an entirely amateur solution, but when the
database dumps are only 80kb it's not an issue.) 

I'd change many things if I were writing it today, but ultimately I have built
a full-featured, HTTPS encrypted, twice-daily-backed-up, 20 user website
tracking about 500 volunteer hours per month, hosted for pocket change. I'm
proud of that.
