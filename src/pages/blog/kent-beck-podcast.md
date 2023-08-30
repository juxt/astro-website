---
author: 'mal'
title: 'JUXT Cast Special with Kent Beck'
description: 'In this episode, Jeremy Taylor, James Henderson, and Malcolm Sparks are joined by Kent Beck to discuss programming, bitemporality, and the state of Agile.'
category: 'bitemporality'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2023-08-30'
heroImage: 'kent-beck-ogimage.jpg'
tags:
  - 'architecture'
  - 'bitemporality'
  - 'xtdb'
---

In our latest JUXT Cast we invited <a href='https://en.wikipedia.org/wiki/Kent_Beck' target='_blank'>Kent Beck</a>, author of the original XP book, <a href='https://www.amazon.co.uk/Extreme-Programming-Explained-Embrace-Change/dp/0321278658' target='_blank'> Extreme Programming <br> Explained</a>.

Today, you might sub-title this book as ‘Agile, the good parts’, since XP introduced many of the practices that developers still value, such as Test Driven Development, Continuous Integration and Pair Programming.

This blog post touches on some of the themes that came up in our discussion.

<iframe class='md:w-[560px] w-full h-[315px]' src="https://www.youtube.com/embed/gaRyeGrp0vU?si=SVjIlkNveDfwKfZz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**The point of fast feedback**

Development isn’t just about coding to a strict specification, and Agile did away with that perception. But there is still a strong sense that developers follow a linear path, working through the backlog of end-user requirements to implementation. Yet, Kent argues that wasn’t what XP was about at all!

The essence XP is to introduce much faster feedback loops into the development process in order to allow a developer to search more rapidly through the vast set of possible solutions to the problem at hand. Many solutions ought to be tried and rejected in the search for better ones.

The idea of throwing away ‘work’ is at odds with the prevailing accounting-based business view of software development. But the process of discarding inferior solutions along the way leads to better, simpler solutions, which keep code-bases clean and flexible, able to take on further change.

Programmers who use interactive languages in their daily work, perhaps using a REPL, take for granted the advantages of being able to trial and reject numerous ideas as quickly as possible. It’s second-nature to us. However, many programmers still have to wait minutes for confirmation for even trivial experiments.

**Safety, for users too!**

Kent has a personal mission to 'help geeks feel safe in the world'.

Kent's many contributions to the field of software development all give developers a greater amount of safety and security in their work.

This foundational safety allows developers to take creative risks to find better solutions to business problems.

Test Driven Development, for example, ensures that tests are sufficient to allow developers to make simplifications to their code-bases along the way, keeping them flexible and ready to take on business changes.

We spoke about how this sense of safety can be expanded to include the users of our systems.

There are properties we can build in to our software systems that provide safety to users.

For example, imagine how much more confidence is created by the mere presence of an 'undo' button in your spreadsheet.

Or my favourite, the feature in GMail to 'undo' the sending of an email up to 30 seconds after hitting send!

Users often make mistakes, we’re all human after all! One of the many benefits of adopting the principle of <a href='https://tidyfirst.substack.com/p/eventual-business-consistency' target='_blank'>bitemporality (AKA "eventual business consistency")</a> in your platform is that users' mistakes can be rectified at a later date, but without losing the information about when the mistake was made, and by whom.

When systems are sympathetic and forgiving to users, they feel a greater sense of safety. That can only be a good thing.

This JUXT Cast episode is also available on [Pinecast](https://pnc.st/s/juxt-cast/736d5a29/juxt-cast-special-with-kent-beck).

In this podcast, and in a few of his latest blog posts, Kent Beck discussed the importance of bitemporality — <a href='https://www.juxt.pro/blog/bitemporality-and-the-art-of-maintaining-accurate-databases/' target='_blank'>check out this on-demand webinar</a> to learn more about it, and how it is likely to impact your work in the near future.

Happy listening!
