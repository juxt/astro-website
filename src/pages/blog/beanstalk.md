---
author: 'jon'
title: 'AWS Beanstalk, Docker and Clojure'
description: 'The JUXT experience of deploying Docker containers through Beanstalk'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '26 May 2015'
heroImage: 'aws-beanstalk-clojure.jpg'
tags:
  - 'tech'
---

When developing cloud based applications there's always the question of
deployment. At JUXT we've had experience in AWS of using Cloud Formation
templates, Puppet, Vagrant, Pallet, and Capistrano, to name a few.
Recently we've been evaluating Beanstalk and its recent support for
Docker.

# PaaS or IaaS

Before choosing a solution, you have to ask yourself if you need IaaS or
PaaS. Paas (Platform as a Service) is the Heroku/Beanstalk model. The
ethos is that you don't need to worry about setting up the internals of
a platform yourself, such as auto-scaling, load-balancing etc. By paying
for a PaaS, it's all done for you. IaaS (Infrastructure as a Service) on
the other hand gives you the lower level constructs so you can build a
platform yourself. This is the traditional way of using AWS with its EC2
nodes, AutoScaling groups, Elastic Load Balancers (ELBs), CloudFront
etc.

This choice between PaaS and IaaS is largely contextual. For example if
you're building an MVP (minimal viable product), then you may just want
a PaaS, whereas if you're building something large and strategic from
the outset, then IaaS may be the straightforward choice. That's not to
say the choices are mutually exclusive, as you could start with a PaaS,
and if your project grows to something bigger with more infrastructural
demands such as zero downtime or a rich Blue/Green deployment model (see
below), then you could move to IaaS at a time that suits. Any time
invested in PaaS should be minimal, so that graduating to IaaS is seen
as an evolutionary move.

# Docker

Orthogonal to the IaaS vs PaaS decision is the actual deployment unit.
When building Clojure applications we typically like to build and deploy
uberjars because then we're in full control of the application stack
including the servlet container. [Docker](https://www.docker.com/) makes
for a nice way of wrapping an uberjar, where you have the option of
performing additional config and set up of your container. Docker is
also popular right now for its philosophy of providing isolation, making
it a developer friendly choice where you can create a container that
mirrors your production environment, isolated from your host development
environment.

Playing around with Docker and Clojure uberjars is simple enough, see
`lein-docker` and `lein-uberjar`. My preference is to skip both tools
and use Docker directly.

If you haven't already done so, first build your uberjar

    cd myproj
    lein uberjar

Now create a file with the name `Dockerfile` in the root of your
directory, with the following content

```docker
FROM java:8

ADD target/myproj.0.1.0-SNAPSHOT-standalone.jar /srv/myproj-app.jar

EXPOSE 8080

CMD ["java", "-jar", "/srv/myproj-app.jar"]
```

Now build your Docker image with

```clojure
docker build -t myproj/latest
```

Finally, here's how to run it

```clojure
docker run -d -P myproj/latest`
```

If you're using OSX then you'll need
[`boot2docker`](http://boot2docker.io).

# Beanstalk

If you're seeking a PaaS solution, like the idea of Docker and you've a
preference for AWS, then it's worth checking out Beanstalk.

Beanstalk layers a PaaS on top of existing AWS constructs, so if you
give it a WAR file or a Docker image, then it will create the EC2 nodes
and corresponding infrastructure for you, including AutoScaling Groups,
Elastic Load Balancers, and Security Groups. It also helps you with
minimally provided config (such as key pairs), and can expose
environmental vars to the app, thus jiving well with the [12 factor](http://12factor.net) approach.

Beanstalk has _Applications_, _Environments_ and _Application Versions_
as onion layers: Application -\> Environment -\> Application Version. An
application has environments, and you can deploy different application
versions to a target environment.

When you deploy an application version to Beanstalk, it automatically
sets up a DNS pointing to
`+{your-app-name}-{environment}.elasticbeanstalk.com+`. It also sets up
CloudWatch and various other pieces of the AWS stack that you would
normally have to configure manually.

One word of warning is that Beanstalk is well suited for monolithic or
broad grained services. If Microservices is your thing then Beanstalk
may be too bloated and unwieldly to house lots of moving parts. I got
burned when I wanted my singular deployed instance to open up a few
different ports, so that I could mimic the running of a few different
services/applications in the same process, effectively cheating my way
out of the dev ops workload during the early days of development. I got
stuck by AWS Beanstalk/Docker expecting just a _single application
port_, and fell foul of how Beanstalk ties its Docker service to the
Elastic Load Balancer using some reverse proxying, where the
`docker run` command is essentially locked down. I've since learnt that
it's best to keep your deployment ambitions in check when using PaaS.

# No Blue/Green

[Blue/Green deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html) is
the concept of running two application versions side by side in
production, and once you're happy with the new _green_ release
candidate, you can gracefully retire the existing _blue_ version.

Beanstalk doesn't offer blue/green deployment by default. When deploying
a new application version it simply replaces the one that's already
there in the same environment, and you don't get a chance to check the
candidate for yourself. The approach will also incur some downtime
during the deployment transition.

You can however maintain two different environments, i.e. a prod1 and a
prod2, and then do a DNS swap between them, to ensure _zero downtime_,
as [covered here](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.CNAMESwap.html).
There is though a big downside to using DNS swapping to achieve
blue/green, as DNS entries are cached by clients hitting your service.
This means you do not ultimately control the switch, and you can never
be sure that some of your clients will not have problems when you retire
an environment. I don't think this a good approach, and the best AWS
method I've seen of achieve Blue/Green is to manage a single Elastic
Load Balancer and gracefully swap in/out different AutoScaling Groups
containing different application versions. You don't get this with
Beanstalk.

If you need zero downtime but want to avoid any DNS switching, then
Beanstalk has another option. They have quietly introduced [_rolling application version updates_](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html)
[late in
2014](http://aws.amazon.com/about-aws/whats-new/2014/10/28/aws-elastic-beanstalk-supports-application-version-deployments/).
This is subtly different to plain [old rolling environment config changes](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rollingupdates.html),
which have been around for a while.

So now if you have a few nodes running in a Beanstalk environment, you
can _roll in_ an application version by upgrading one batch, and then
the other. This doesn't give you Blue/Green proper, but it does offer a
zero downtime approach. Just make sure you've well tested the
application version on a different environment to prod.

# Deploying Docker Containers to Beanstalk using Leiningen

If you are using Clojure then there are a couple of options. At the time
of writing the Leiningen plugin `lein-beanstalk` focuses on building and
deploying WAR files to Beanstalk. I have built a very small wrapper here
[`lein-dockerstalk`](https://github.com/juxt/lein-dockerstalk), where
you can simply do `+lein dockerstalk deploy dev {path-to-zip-file}+`.
You need to build the ZIP file in advance, containing typically just the
Dockerfile and the uberjar (you can use `lein-zip`). `lein-dockerstalk`
may well get factored into `lein-beanstalk` in the future.

There is also a [plugin for boot](https://github.com/adzerk-oss/boot-beanstalk) for deploying Docker
images to Beanstalk.

# Conclusion

Beanstalk is a certainly a good option for when you want a PaaS in AWS.
Given Beanstalk sits on top of familiar AWS constructs, there is a
migration path away from Beanstalk when the time is right.

Thanks to [Antonio Terreno](http://the-arm.com) and others for pointing
the way to Beanstalk and Docker.

# References

<http://blog.bwhaley.com/evaluating-elastic-beanstalk-an-ops-perspective>
<http://www.hudku.com/blog/demystified-zero-downtime-with-amazon/>
<http://www.thoughtworks.com/insights/blog/implementing-blue-green-deployments-aws>
