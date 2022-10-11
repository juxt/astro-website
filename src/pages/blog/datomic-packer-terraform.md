---
author: "jon"
title: "Provisioning Datomic using Packer and Terraform"
description: "eploying Datomic"
category: "clojure"
layout: "../../layouts/BlogPost.astro"
publishedDate: "06 Feb 2017"
heroImage: "mock3.jpg"
---

At JUXT we are fans of Datomic having used it for several of our
projects. In this post I want to discuss our preferred deployment model
into AWS (which could be extended to provide for other non-AWS cloud
environments), using [Terraform](https://www.terraform.io/) and
[Packer](https://www.packer.io/).
[`pack-datomic`](https://github.com/juxt/pack-datomic) is a small
library that will help you provision your own Datomic Transactor.

# Using Packer

Datomic ships with tools to generate AWS CloudFormation templates that
will create a CloudFormation stack. In AWS, the transactor runs on an
EC2 instance spawned from an official pre-baked Datomic AMI.

The main rationale for having the Transactor and Java run-time baked
into an AMI, is so that when a machine is launched it has everything it
needs to get going, rather than depending on scripts to go and fetch
what it needs at a crucial stage in deployment.

The default Datomic transactor AMI is a good approach for getting going,
but at some stage you may want to consider building your own AMI to give
you more fine grained control. For example you may want to allow SSH
access on the transactor so that you can more closely monitor the
process. You may also want to embed agents onto the machine to capture
logs or to distribute machine profiling metrics.

This is where Packer comes in. In our
[pack-datomic](https://github.com/juxt/pack-datomic) repository we have
an extensible
[datomic.json](https://github.com/juxt/pack-datomic/blob/master/datomic.json)
packer template that you can use to build your own Datomic Transactor
AMI. To build, simply run (substituting in the correct variables):

    packer build -var 'datomic_version=?' -var 'datomic_user=?' -var 'datomic_password=? datomic.json

# Using Terraform

CloudFormation templates are not an ideal choice for storing
infrastructure-as-code. CloudFormation JSON is verbose, unwieldy, lacks
for comments, and doesn't have a modular structure.

Terraform has its own DSL that solves these problems, as well as
providing an intuitive command line API that allows you to plan for and
to make fine grained updates to existing infrastructure, as well as
[being cloud
agnostic](https://www.terraform.io/intro/vs/cloudformation.html).
Terraform is restricted in scope and doesn't solve every problem for you
(i.e. configuration management where tools such as Ansible and Puppet
may still feature), but so far we love it.

There is an implicit emphasis to make reusable Terraform modules, and
that's what we've done in
[pack-datomic](https://github.com/juxt/pack-datomic), providing a
Datomic Transactor module. This module will create the relevant security
group and IAM role permissions, an S3 bucket for logs, and an Auto
Scaling Group with a Launch Configuration.

To use it, add to the module to your existing Terraform setup:

    module "datomic" {
      source = "github.com/juxt/pack-datomic//modules/transactor?ref=0.2.2"

      # Declare variable inputs
      # ...
    }

See the
[sample](https://github.com/juxt/pack-datomic/blob/master/sample.tf)
Terraform template for a setup example.

I originally bootstrapped Datomic and Terraform using [Robert
Stutterford's
example](https://libraries.io/github/robert-stuttaford/terraform-example)
that is more comprehensive (alongside other things, it adds a Datadog
agent and Memcached); it's well worth checking out and is being
constantly updated.
