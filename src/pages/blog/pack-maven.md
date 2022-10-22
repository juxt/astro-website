---
author: 'dmc'
title: 'Deploying libraries with deps.edn'
description: ''
category: 'clojure'

publishedDate: '27 Nov 2018'
heroImage: 'library.jpg'
---

I've had a number of questions about uploading libraries to maven and
clojars with [pack](https://github.com/juxt/pack.alpha). This is a
tutorial on how to go about that.

# Generate a pom.xml

Generate a pom.xml using `clojure -Spom`.

You **must** update this file with coordinates and an appropriate
version. To update your coordinates in the pom.xml, you need to update
the existing `groupId`, `artifactId` and `version` tags to match. This
example is equivalent to `{com.acme/anvil {:mvn/version "0.1.0"}}` in
deps.edn.

```xml
<groupId>com.acme</groupId>
<artifactId>anvil</artifactId>
<version>0.1.0</version>
```

You should add repository information. This will enable tools like
<https://cljdoc.org/> to generate documentation for your library. Put
this inside the `<project>` tags and update the links.

**_Example from cljdoc's documentation_**

```xml
<scm>
  <connection>scm:git:git://github.com/laforge49/aatree.git</connection>
  <developerConnection>scm:git:ssh://git@github.com/laforge49/aatree.git</developerConnection>
  <tag>edb7cefa9a01852b101ed742b278aaba8d832b02</tag>
  <url>https://github.com/laforge49/aatree</url>
</scm>
```

# Install the pack alias

Run this command to add the pack alias to your deps.edn.

```shell
$ clojure -Sdeps '{:deps {pack/pack.alpha {:git/url "https://github.com/juxt/pack.alpha.git" :sha "dccf2134bcf03726a9465d2b9997c42e5cd91bff"}}}' -m mach.pack.alpha.inject 'c70740ffc10805f34836da2160fa1899601fac02'
```

You may want to adjust the formatting afterwards.

# Build your JAR

Pack provides a mode named \"skinny jar\". This was originally designed
for companies who deploy by uploading their classpath separately from
their project. But it has a flag to not output the classpath at all,
just a jar containing your project files. This separation can be used to
create a jar that is suitable for upload to clojars.

```shell
$ clojure -A:pack  #
          mach.pack.alpha.skinny  #
          --no-libs  #
          --project-path anvil.jar#
```

- Load the pack alias, which will run the selected pack mode

- Select the skinny mode of pack

- Don't output libs

- Specify the name of your jar. Here, I selected \"anvil.jar\".

# Release the JAR

You have 2 options at this point, `mvn` or `deps-deploy`. `mvn` has a
sometimes better story around encryption of credentials, and is well
established. `deps-deploy` avoids having to install `mvn`, but is still
very new.

[Jump to deps deploy](#deps_deploy)

## `mvn` approach

You will need to set up your `~/.m2/settings.xml` in order to add
authentication information for your upload destination.

**_Example settings.xml for Clojars_**

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
  https://maven.apache.org/xsd/settings-1.0.0.xsd">
  <servers>
    <server>
      <id>clojars</id>
      <username>wil_e_coyote</username>
      <password>r04drunn3R$</password>
    </server>
  </servers>
</settings>
```

**_The above example leaves your password in plaintext on your filesystem.
I highly recommend utilising maven's [password
encryption](https://maven.apache.org/guides/mini/guide-encryption.html)._**

Now you are ready to upload your JAR and pom.xml to upstream using
`mvn deploy:deploy-file`.

**_Upload to clojars_**

```shell
$ mvn deploy:deploy-file \
      -Dfile=anvil.jar  #
      -DrepositoryId=clojars \
      -Durl=https://clojars.org/repo \
      -DpomFile=pom.xml

[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building anvil 0.1.6
[INFO] ------------------------------------------------------------------------
[INFO]
[INFO] --- maven-deploy-plugin:2.7:deploy-file (default-cli) @ anvil ---
Uploading: https://clojars.org/repo/com/acme/anvil/0.1.6/anvil-0.1.6.jar
Uploaded: https://clojars.org/repo/com/acme/anvil/0.1.6/anvil-0.1.6.jar (780 B at 0.3 KB/sec)
Uploading: https://clojars.org/repo/com/acme/anvil/0.1.6/anvil-0.1.6.pom
Uploaded: https://clojars.org/repo/com/acme/anvil/0.1.6/anvil-0.1.6.pom (980 B at 0.4 KB/sec)
Downloading: https://clojars.org/repo/com/acme/anvil/maven-metadata.xml
Downloaded: https://clojars.org/repo/com/acme/anvil/maven-metadata.xml (439 B at 0.8 KB/sec)
Uploading: https://clojars.org/repo/com/acme/anvil/maven-metadata.xml
Uploaded: https://clojars.org/repo/com/acme/anvil/maven-metadata.xml (470 B at 0.2 KB/sec)
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 8.475 s
[INFO] Finished at: 2018-11-18T13:18:06+00:00
[INFO] Final Memory: 12M/317M
[INFO] ------------------------------------------------------------------------
```

- Replace this with the name of your jar.

## Deps Deploy

[slipset](https://github.com/slipset) has made a wonderful clojure
library named [deps-deploy](https://github.com/slipset/deps-deploy).

You can add an alias for it in your deps.edn:

```clojure
{:aliases
 {:pack {…}
  :deploy {:extra-deps {deps-deploy {:mvn/version "RELEASE"}}
           :main-opts ["-m" "deps-deploy.deps-deploy" "deploy" "anvil.jar"]}}
```

Then you can invoke it:

```shell
$ export HISTFILE=/dev/null#
$ CLOJARS_USERNAME=wil_e_coyote CLOJARS_PASSWORD='r04drunn3R$' clojure -A:deploy

SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
Deploying com.acme/anvil-0.1.4 to clojars as Smeagol
done.
```

- This is to disable history from storing your username & password in
  plaintext.

# Example

There's an example at
<https://github.com/SevereOverfl0w/super-duper-octo-barnacle>. You can
update the groupId in the pom.xml and deploy it as a test to your own
groupId.
