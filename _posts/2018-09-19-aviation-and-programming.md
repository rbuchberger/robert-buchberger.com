---
title: Aviation and Programming
summary: 
  I've been working on airplanes for nearly ten years now, and programming in earnest for the past year. These
  two industries, though obviously entirely different, have a few things to learn from each other.
image: 
  url: blog/2018-09-19/office_view.jpg
  alt: C-130s on the Runway
  caption: "View from my office"

---

## My background as a mechanic

I started out as a C-130 Crew Chief, working in a back shop on mechanical systems such as the flight
controls and landing gear. As one of my mentors put it (in a thick southern drawl): "Once you take
somethin' apart, you understand it". Over the course of 3 years I increasingly understood the guts
of the airplane, manipulating and disassembling critical components that rarely see the light of
day. 

As we worked on these 28 year old airplanes, our biggest concern was the people who would fly on them. While all
large aircraft are built with a great deal of redundancy, many of the components I worked on had no
backups. There is no practical way to add a second set of wheels in case the first doesn't extend
properly, and no way to add a second pair of ailerons in case the first jam up. These systems *must*
function properly. It's the sort of thing that's always on your mind as you work.

I learned to read, understand, and follow documentation to the letter. I learned to work slowly,
carefully, consistently, and deliberately. When a single lost screw on a bad day could jam up the
flight controls and kill everyone on board, *you don't lose screws*.

## Going to Fly

{% picture blog/2018-09-19/formation_takeoff.jpg alt="Formation Takeoff on a Humid Day" %}

After 3 years as a mechanic, I cross-trained to become a Flight Engineer on the same airplanes I'd
been maintaining. What's a Flight Engineer? That's a great question, and not entirely simple to
answer because it encompasses many different duties, from the preflight inspection, to the actual
flight, until we put the airplane to bed. It's a dying career field, replaced by computers on nearly
all aircraft flying today. The shortest accurate description is "Systems Expert". I sit in the
middle seat, behind the throttles, and run the systems that keep us flying. When they malfunction,
as all mechanical systems do, it's my job to notice, alert the crew, and know how to handle it.

This new position took many of the challenges of my previous one, and added time pressure. Instead
of hours or days to solve a problem, I have seconds or minutes. When one forgotten switch of 20 in a
checklist can overheat a system, or give the whole crew hypoxia, you continue to work slowly,
deliberately, and consistenly. You learn that some mistakes are forgivable, and some are not. 

As a mechanic, the only people I generally interacted with were my supervisors and coworkers. Now,
as an engineer, the only time I work with another engineer is my yearly checkride.  Instead I
integrate with a crew of 6, giving meaningful, timely, and useful input. Your interpersonal skills
improve in that situation; you learn to disagree and point out mistakes, productively and without
insult (explicit or implied). You learn to have your own mistakes and failings pointed out in a
similar manner, without taking offense. These are the strengths that make a crewed aircraft so
effective; we live and die together, and all criticism is for the sake of future success. Hubris
doesn't last long in that world.

## So how does this relate to programming?

{% picture blog/2018-09-19/over_ocean.jpg alt="Herc over the ocean" %}

On the surface, they're clearly entirely unrelated, but the more you dig the more similarities
appear. Take the C-130 electrical system for example: It's composed of 4 AC and 2 DC buses,
(usually) powered by 4 generators, 2 transformer-rectifiers, and 2 batteries. If you consider the
`number_4_engine_generator` an instance of the class `EngineGenerator` which has its `.spin` method called
by the `number_4_engine`, an excellent metaphor emerges.

### Encapsulation

It would certainly be possible to activate and deactivate an engine generator by connecting and
disconnecting wires within it while the engine is running (and there are legends about this sort of
thing actually happening), but you'd be absolutely insane to do so. There is a switch in the cockpit
to accomplish this. While that generator is operating, I don't know what the various switches and
coils are doing within it are doing, but I can monitor its frequency and voltage to know that it's
working properly. It's *encapsulated*. 

### Abstraction

An `EngineGenerator` serves exactly one purpose: to generate AC electrical power.  If you understand
that, and you know its interactions, you don't need to know its inner workings in order to use it.
The electrical shop can completely understand one, disassemble it, and fix it, while the hydraulic
shop doesn't need to know about generators in order to fix their electric pumps. The fat, dumb, and
happy Flight Engineer doesn't need to know either of those things in order to use both.

### Inheritence

Both an aircraft and a program are incredibly complex, often so complex that no single person can
maintain a working knowledge of the entire system, and yet they are built up on the repeated use of
simple components. There are a few other generators on the aircraft; for example the cockpit
indication of engine RPM is powered by a small "tachometer" generator on the engine. All generators
spin and produce power; so if we have a parent class of `Generator`, with methods `.spin` and
`.power`, both `TachGenerator` and `EngineGenerator` can *inherit* from it.

### Polymorphism

As I said, all generators spin and produce power. However, an engine generator is rated for 40,000
watts and a tach generator produces just enough power to move a needle on a dial. Even though we
call the same `.spin` and `.power` methods on them, we've modified those methods as required.

## Nice regurgitation. What else? 

{% picture blog/2018-09-19/line_abreast.jpg alt="Hercs in line-abreast formation" %}

Well, 

* Both Aviation and Programming are worlds of somewhat abstract, conceptual rules, of which some
are flexible and some are *absolutely* not. There's an art to not only knowing best practices, but
knowing how to apply them, and when to avoid them. In some situations, deviating from the checklist
is not just acceptable, but necessary. (In case it needs to be stated, there is a world of
difference between making a single, justified, rare exception to best practice, and failing to apply
it because you don't know it.)

* Programs are generally built by teams of people, and the success of a program generally requires the
success of all its parts. There is an art to disagreeing productively, giving and receiving useful
feedback in a way that's easy to swallow, which is required both on a software team and within an
aircrew. You need a kind of empathy, to understand how the words you are saying will sound
to the person receiving them, or how the words you are hearing are meant by the person saying them.

* You could say that reliability is an important component of both aviation and web development.
Redundant systems, fail-safes, and ironclad procedures are common to prevent unlikely disasters.

* Aircraft may not change much, but the regulations and procedures surrounding them sure do. Staying
up to date on them requires frequent study, much like keeping up with the latest updates and
frameworks. 

## So what's your point?

Nerdy Flight Engineers can make good web developers. 
