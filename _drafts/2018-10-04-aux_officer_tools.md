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
afford such things. I suppose when you have volunteers willing to be tased and
pepper-sprayed, you get used to not paying for things!) The registrar is
GoDaddy (chosen by the client). User login & registration is handled by devise,
with necessary modifications to enable administrator approval of new signups.
The document library is in an AWS s3 bucket, the styling is entirely stock
Bootstrap, and the test suite is MiniTest. Training videos are listed or
unlisted YouTube videos (pretty much your only option with a budget of 0).

Sometime later on, I worked out that I could use an Amazon Cloudfront
distribution to enable HTTPS encryption, which is not a feature offered by
Heroku's free tier when combined with a custom domain name. The site doesn't
have much cacheable content, meaning the CDN was actually a performance hit,
but when the entire point of the application is to protect information what
else can you do? Database backups are handled by a script on my local machine,
executed by anacron, which downloads, encrypts, and uploads the database dump
to S3. (Yes, it's an entirely amateur solution, but when the database dumps are
only 80kb it's not an issue. And it's better than manually uploading them to
Dropbox.) 

## Challenges

I won't go in depth on every aspect of the application, but a few parts of it
were remarkably more difficult than I expected. 

### Timecard input form

This went through many different iterations. I had to track a clock-in time, a
clock-out time, and a description. Since it is a very frequently used feature,
it needs to be convenient! The easy way, and what I had done in the beginning,
is two datetime helper tags and a text area. This was easy enough to wire to
the model, but required a *lot* of clicking from the user, some of it
duplicated.

Since no timecard would be longer than 24 hours, there was no need to input the
closing date. More precision than 15 minutes was also unnecessary; these country
boys are not going to clock in at 7:57 AM. The UI I arrived at was a date field,
defaulting to today, and 2 dropdowns each (hours and minutes). Great!  Now how
do I wire it up? In the database, they're stored as datetime objects, and Rails
is pretty opinionated towards having one form field per model property. I needed
to take a date and two times (time as in time-of-day, not the Ruby class Time  which
includes the day), and create two complete datetime objects from them. Not only
this, but if someone needs to edit their timecard, the form didn't know what to
do with my datetime objects; it needed a date and two times!

Today I know that I could accomplish it client-side with Javascript, but at the
time I didn't know much Javascript and I didn't see why I couldn't do it server
side! I started out trying to accomplish the conversion in the controller,
because that's what the form talks to isn't it? If the controller's job is
to allow the view and model to communicate, doesn't translation fall under the
category of communication?

Several hours of hacky helper-functions later, I realized that no, it's not the
controller's job. I could accomplish exactly what I wanted in the model, using
virtual attributes and some callbacks. Here's the code:

```ruby

# app/models/timecard.rb

  attribute :clock_in_date,  :date
  attribute :clock_in_time,  :time
  attribute :clock_out_time, :time

  # Callbacks:
  after_initialize  :set_field_values
  before_validation :set_db_values

  # Sets up virtual attributes for use by the form
  def set_field_values
    self.clock_in_date  ||= clock_in?   ?  clock_in.to_date  :  Time.zone.now.to_date
    self.clock_in_time  ||= clock_in?   ?  clock_in          :  Time.zone.now
    self.clock_out_time ||= clock_out?  ?  clock_out         :  Time.zone.now
  end

  # Assembles virtual attributes for the database values
  def set_db_values 
    in_date  = clock_in_date
    in_time  = clock_in_time
    out_date = in_date
    out_time = clock_out_time

    # If clock out happens before clock in, we assume the user worked past
    # midnight:
    out_date += 1.day if in_time > out_time

    self.clock_in = Time.new(
      in_date.year,
      in_date.month,
      in_date.day,
      in_time.hour,
      in_time.min,
      0,
      Time.zone.at(in_date.noon).utc_offset
    )

    self.clock_out = Time.new(
      out_date.year,
      out_date.month,
      out_date.day,
      out_time.hour,
      out_time.min,
      0,
      Time.zone.at(out_date.noon).utc_offset
    )
  end

```

I'd change many things if I were writing it today, but ultimately I have built
a full-featured, HTTPS encrypted, twice-daily-backed-up, 20 user website
tracking about 500 volunteer hours per month, hosted for pocket change. I'm
proud of that.
