---
title: "Development Lifecycle with Docker and Elastic Beanstalk"
description:
  "This article explains the advantages of using Docker over automated
  configuration management tools, and describes a workflow from development
  through QA and into production deployment using Amazons' Elastic Beanstalk."
tags: [essays, software-engineering]
---

Docker is getting a lot of hype these days, for good reason. There are plenty of
articles touting the merits of Docker but most are written without context and
are limited to examining the the benefits of Docker independently of its'
practical everyday use in a software development project lifecycle.

This article aims to examine the benefits of Docker within the context of a
software company with multiple developers working on multiple projects, having
to manage these projects deployed in a cloud production environment. In this
context the benefits of Docker become more readily apparent.

With the rise of cloud computing, the number of systems that need to be
maintained has exploded. Manual _[provisioning](#provisioning)_ of an
increasingly large number of systems becomes impossible for a small team, given
platforms like Amazon EC2 provide _[auto-scaling](#autoscaling)_ when additional
load is detected.

Tools like Ansible, Chef, Puppet and Salt are great solutions towards achieving
automated provisioning of virtual machines. The industry has responded by
quickly adopting these tools, but even more agility and performance can be
achieved by using _[Docker containers](#docker-container)_.

Combining Docker with a deployment tool like AWS Elastic Beanstalk can provide
even greater efficiencies for developing and deploying cloud applications.

## Dockdj

![Dockdj](https://assets-cdn.github.com/images/icons/emoji/unicode/1f6a2.png)

This article will be using [Dockdj](https://github.com/0xadada/dockdj) to
illustrate using Docker and Elastic Beanstalk in the context of a real-world web
project. Dockdj is a recipe for building 12-factor Python / Django web apps with
multi-container Docker and deploying to Amazon AWS using Elastic Beanstalk.
[Dockdj is available on GitHub](https://github.com/0xadada/dockdj).

### Manual Provisioning

The naive approach is _manual provisioning_: the developer installs Apache and
associated system libraries directly on the local development machine, configure
it according to the WordPress documentation.

These manual steps will need to be repeated for every additional member of the
development team, and again for the production web server. When provisioned
software is updated or configurations change. All members of the development
team and the production systems need to be updated accordingly. Larger teams
inevitably begin experiencing the _"works on my machine"_ problems between
developers when some developers haven't updated their configurations to match
coworkers who have.

Manual provisioning quickly becomes a frequent and resource-intensive process,
with the side-effect of prolonging the deployment of important vendor bug fixes
and security patches across both development and productions systems.

Additionally, when increased traffic hits productions systems, new systems need
to be allocated and scaled horizontally to support the new traffic. All the
provisioning needs to repeated. This system doesn't scale as more production
servers are added to serve additional traffic load.

Even worse is when differences between developer-systems and production-systems
result in hard-to-reproduce bugs once the app is deployed from development into
production.

### Automated Provisioning

An improvement over manual provisioning is _automated provisioning_ using a
_[configuration management](#confg-mgmt)_ tool like Ansible, Chef, Puppet, Salt,
etc. These tools have been developed to address the problems of provisioning at
large scale.

The aim of these tools are:

1. Initialize and start virtual machines
1. Automate the provisioning process in a repeatable way
1. Manage changes to provisioning in a version control system
1. Establishing and maintaining consistency of system dependencies and
   configuration throughout an applications life

Configuration management tools are wonderful for automated provisioning, but _in
practice_[^1] they tend to
split management of the stack-app into two parts:

1. the software Stack

- Operating system
- System libraries
- Provisioned software
- Configuration

1. the Application

- Source code & binaries
- Dependencies
- Runtime environment

The result is that the stack (#1) is initially allocated and provisioned using
one of the configuration management tools. The application (#2) is then deployed
on the stack&mdash; resulting in a running application. When subsequent
application versions (#2) are released and deployed, they are deployed onto the
(unchanged) stack. **The problem with this model is that the stack and the
application are managed independently.** Changes to the stack are managed as a
unit separate from changes to the application. No data is recorded that
describes the compatibility of the integrated whole.

This results in increased complexity during rollbacks or simultaneous updates to
both stack and application. More importantly **version numbers of the
application are not tied to versions of the stack.**

Under this model, the stack version and application version aren't
coupled&mdash; which increases the likelihood of integration failures.

An example will illustrate where this model will fail:

> Our production web server is provisioned with Apache 3.3.0 and the application
> (WordPress) was at version 0.7.0 last week, and have just released version
> 0.8.0 this past week.
>
> Apache announces a security vulnerability fix at version 3.3.1. Under the
> (typical) automated provisioning model, the configuration management tool
> would be updated to provision the new version of Apache. The tool runs against
> all production server systems. Here the application doesn't change, it simply
> rides on top of the Apache stack without change. No problems occur with the
> rollout of the new Apache release.
>
> Next the application updates and releases a new version for deployment- 0.9.0.
> The deploy process runs, and for some reason the application fails, it isn't
> compatible with version 3.3.1 of Apache.
>
> The decision is made to rollback the application to 0.8.0, which runs
> successfully with Apache 3.3.1. The system is working again.
>
> A critical security vulnerability is discovered in application 0.8.0 and the
> decision is made to roll application back to version 0.7.0. (Keep in mind the
> previous app version 0.7.0 was running Apache 3.3.0, and the stack is
> currently 3.3.1).
>
> The application fails&mdash; because 0.7.0 was never integration tested
> against Apache 3.3.1. What do you do?

In this example the devops team **failed to remember** to rollback Apache,
simply because the integrated dependencies were not internally coupled. The
compatible coupling existed **only as institutional knowledge** outside the
scope of the configuration management system, as Stack and Application were
managed separately.

## Docker for Configuration Management

One major advantage of Docker is that it does not necessitate running a unique
VM[^2] for every project a team works on.
If developers work on multiple projects, each with its own customized VM,
switching between projects becomes a time-consuming context shift for
developers.

Docker containers run directly on the Linux operating system and yet each
container is isolated. This eliminates the slowness of booting and the overhead
of a VM. Docker containers start up as quickly as running a normal process, and
eliminate VM "booting" for every Docker project the developer works on.
Deploying changes to the environment for every developer working on the project
is as easy as publishing a new _[Docker image](#docker-image)_. Next time a
developer starts the container, he/she will get the new image.

Another advantage of Docker over an automated configuration management tool is
that it **does not** bifurcate the stack and the application into independent
segments.

A stack using Docker containers has the same benefit of configuration
management, but can couple the stack and the application into a single managed
component. The application is deployed along with its stack&mdash; and the
complete stack-app component is deployed together as a single Docker image or a
bundle of Docker images that have already been integration tested at least on a
developers machine.

As opposed the the "automated provisioning" model, the Docker model of the
stack-app looks more like this:

1. Set of Docker images

- Operating system (the software Stack)
- Provisioned software (the software Stack)
- Configuration (the software Stack)
- System libraries (the software Stack)
- Source code & binaries (Application)
- Dependencies (Application)
- Runtime environment (Application)

With every deployment, the entire stack-app (1) will be deployed. Docker uses
hashes (like Git) to minimize the amount of data that will be downloaded for any
update. This means only the differences are downloaded rather than the entire
stack.

**The greatest advantage of using Docker is that developers can run the
application in the very same environment as production**. According to
[Twelve-Factor Methodology](http://12factor.net/dev-prod-parity) this is called
achieving "Dev/Prod Parity". This is a huge benefit in that it eliminates an
entire class of bugs that result from differences between
developers-and-developers as well as bugs that result from differences between
developers-and-production.

## Elastic Beanstalk for Deployment

If you know [Heroku](https://www.heroku.com/), than Amazons' Elastic Beanstalk
will be extremely familiar. EB borrows many ideas from Heroku, but the killer
feature is its' ability to dynamically run, deploy and scale Docker containers
on a cluster of servers. It handles hardware allocation, network configuration,
load balancing, auto-scaling, health monitoring and rolling deployments.

EB doesn't do everything, but it's good enough to adopt early and use until your
team understands its deployment use-cases more clearly and understands
limitations of EB and its trade-offs.

## Django specific structure

The core structure of the Docker / Elastic Beanstalk app can be explained by
describing the directory structure.

These comments describe the application-specific file structure:

```
.dockerignore
.ebextensions/
  01_envvars.config
.ebignore
.elasticbeanstalk/
Dockerrun.aws.json
.gitignore               # Describes which files git ignores
.bowerrc                 # Configures where web frontend dependencies live
.csslintrc.json          # Describes CSS syntax rules
.jshintrc                # Describes JavaScript syntax rules
bower.json               # Describes web frontend dependencies
gulpfile.js              # Describes app build and dev tasks
package.json             # Describes NPM dependencies
app/                     # Our python app
  apps/*                 # python app modules
  project/*              # App-specific settings
  dist/*                 # App static assets (served via Nginx)
bin/*
docker/
  django/
    dev/
      docker-compose.yml
      Dockerfile
    prod/
      docker-compose.yml
      Dockerfile
      gunicorn.conf.py   # Settings for production app-server
    start.sh             # Script to start app-server
  nginx/*                # Nginx config files
environments/            # Environment-specific settings
  dev/                   # Development-only environment settings
    .env                 # Actual environment vars (Excluded from git)
    .env.example         # Example environment vars
    Procfile             # Configures how Honcho starts app-servers
    requirements.txt     # Describes dev Python dependencies
  prod/                  # Development-only environment settings
    .env                 # Actual environment vars (Excluded from git)
    .env.example         # Example environment vars
    Procfile             # Configures how Honcho starts app-servers
    requirements.txt     # Describes prod Python dependencies
```

Some of these directories and files are described in more depth below:

### .gitignore

```
environments/*/.env
node_modules
.elasticbeanstalk/*
!.elasticbeanstalk/*.cfg.yml
!.elasticbeanstalk/*.global.yml
# Built testing and static asset artifacts
app/dist
```

Files matching the name `environments/*/.env` contain sensitive information
(usernames, passwords, etc) about per-deployment environments that shouldn't be
included in version control.

The `node_modules` directory and will be created when the developer installs NPM
packages. These are dependencies and should not be committed into the source
code repository.

The `.elasticbeanstalk/*` directory is excluded from Git because it contains
files that are generated by EB command-line during environment creation and
version deployment that shouldn't be written to the repository. It also contains
temporary configuration files (written by the EB cli).

Both `!.elasticbeanstalk/*.cfg.yml` and `!.elasticbeanstalk/*.global.yml`
entries use the "NOT" operator to re- include themselves into the repo. These
files can be useful to have in version control, as they contain useful
environment configuration settings.

### bower.json

Bower is a web frontend package management system. The application declares its
frontend dependencies in this file.

During docker image creation, these dependencies are installed.

### gulpfile.js

Gulp.js is a task runner for Node.js. `gulpfile.js` defines common tasks and
utilities related to this application:

- Running code Syntax checking & automated testing
- SASS and CSS compilation and minification
- Frontend asset building

### package.json

NPM is a package management system for Node.js applications. `package.json` The
application declares its Node.js dependencies in this file.

### app/

The `app/` directory contains all source code related to the Django python web
application.

### docker/django/prod/gunicorn.conf.py

This project uses two application servers, `runserver_plus` during development
and `gunicorn` in production.

These are settings related to the Gunicorn application server. In production, a
more performant application is used, requiring this configuration file.

### docker/nginx/sites-enabled.conf

On production systems, where nginx acts as a reverse-proxy for the Gunicorn web
application, we use Docker links to connect the two containers together. This
configuration is best for reducing latency. Inside our nginx config file, we can
use a named entry for the `proxy_pass` value to reference our Django application
server running in another container on port 8080.

```
# ...
location / {
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $http_host;
  proxy_redirect   off;
  proxy_pass       http://django:8080;
  # ...
```

### docker/django/start.sh

```
cd /var/app
# ...
honcho --procfile "environments/$ENV_NAME/Procfile" \
       --env "environments/$ENV_NAME/.env" start
```

`start.sh` is used during both development and production as a single task to
bootstrap the application server. It uses the `honcho` task runner to start the
server according to a set of tasks in a `Procfile` for development and another
for production.

The `--env` parameter is used to pass environment variables sourced from the
environments subdirectory. At runtime, the `$ENV_NAME` variable will be set:
`dev` for development and `prod` for production. This way a separate Procfile
and separate set of environment variables are available to configure the modes
independently.

### environments/dev/Procfile

```
# The webserver: Python
webserver: cd app && ./manage.py runserver_plus 0.0.0.0:8080
# The CDN assets emulation server
cdnserver: cd /var/app/app/dist && python -m http.server 8010
```

During development, the Django `runserver_plus` application server interprets
Python, while a simple HTTP server serves assets (images, CSS, etc).

### environments/prod/Procfile

```bash
webserver: cd app && gunicorn \
  -c /etc/gunicorn/gunicorn.conf.py project.wsgi:application
```

In production, we use Gunicorn to serve the python application, so the only task
run is the gunicorn app server. Static assets aren't handled here because Nginx
will be reverse-proxying the application and also serving static assets.

This decision was made because Nginx is optimized to serve static assets and it
will reduce load on the application server.

### environments/[dev | prod]/.env.example

Both `environments/dev/.env.example` and `environments/prod/.env.example` are
committed into git to provide hints to developers that they should create a
`.env` file in the same directory as a place to store environment variables that
are passed into the application.

The `.env` file is excluded from the git repository as it contains sensitive
usernames passwords and cryptographic information.

### environments/[dev | prod]/requirements.txt

The python utility `pip` is a package management utility. It uses a file named
`requirements.txt` to install all package dependencies. The development
environment adds some useful debugging utilities that shouldn't be included on
production systems, so production has its own file.

During docker image creation, these dependencies are installed.

## Docker specific structure

```
.dockerignore            # Describes which files Docker ignores
.ebextensions/
  01_envvars.config
.ebignore
.elasticbeanstalk/
Dockerrun.aws.json
.gitignore
.bowerrc
.csslintrc.json
.jshintrc
bower.json
gulpfile.js
package.json
app/
  apps/*
  project/*
  dist/*
bin/*                    # Scripts for Docker, build and deployment
docker/                  # Configuration files required by docker
  django/                # Django related settings
    dev/                 # Development-only settings
      docker-compose.yml # Orchestrates dev containers
      Dockerfile         # Builds dev Docker image
    prod/                # Production-only settings
      docker-compose.yml # Orchestrates prod containers
      Dockerfile         # Builds prod Docker image
      gunicorn.conf.py
    start.sh
  nginx/*
environments/
  dev/
    .env
    .env.example
    Procfile
    requirements.txt
  prod/
    .env
    .env.example
    Procfile
    requirements.txt
```

### .dockerignore

The `.dockerignore` file specifies a list of patterns to exclude from the build
context during creation of the Docker image. These files are not required by the
execution of the container, and should be removed to reduce the size of the
final image.

```
.coverage
.ebextensions/*
.elasticbeanstalk/*
.ebignore
.dockerignore
.git
.gitignore
.DS_Store
node_modules
app/dist
docs
htmlcov
README.md
ghostdriver.log
```

Some notable entries are described below:

The `node_modules` directory and will be created when the developer installs NPM
packages. If the developer is using on OS X, packages compiled on OS X will not
work when the container is running in the Linux VM, so this entry ensures that
node modules are installed on the host OS independently from the container OS.

`.ebextensions/*`, `.elasticbeanstalk/*` and `.ebignore` are required by the
Elastic Beanstalk deploy process, and are outside the scope of execution of the
Docker container, and are not required.

The `app/dist` directory contains frontend assets served by both Django and
Nginx, and are required by both Django and Nginx containers. Because Amazon ECS
cannot (currently) directly mount a single volume from one container into
another container, we need these files to be deployed directly on the host OS.
Docker can mount the directory on both Django and Nginx containers as a shared
volume. This directory will be deployed by EB, and is thus excluded from Docker.

### bin/image

`bin/image` is a shell script that wraps common Docker commands used to create
Docker images. There are three major subcommands: `build`, `destroy` and
`update` all take a single argument, the name of the environment subdirectory of
the `environments/` directory. This will spawn Docker and build, delete or
rebuild the image as specified by the `Dockerfile` in the directory
corresponding to the final argument.

### bin/stevedore

`bin/stevedore` is a shell script that wraps common Docker commands used to
start and stop Docker containers. There are many subcommands, but the most
useful are: `start`, `stop` and either of the two `build` commands. All
subcommands take take a single argument, the name of the environment
subdirectory of the `environments/` directory. This will spawn Docker and start,
stop or run the corresponding build process.

### docker/django/dev/docker-compose.yml

This file provides configuration for Docker to orchestrate the management of the
development Docker container for the local dev environment.

```
django:
  build: ../../..
  dockerfile: docker/django/dev/Dockerfile
  env_file: ../../../environments/dev/.env
  volumes:
    - "../../../app/apps:/var/app/app/apps"
    - "../../../app/dist:/var/app/app/dist"
    - "../../../app/project:/var/app/app/project"
    - "../../../app/manage.py:/var/app/app/manage.py"
    - "../../../environments:/var/app/environments"
    - "../../../gulpfile.js:/var/app/gulpfile.js"
  ports:
    - "80:8080"
    - "8010:8010"
```

It defines one container "django", specifying a path to the `build`-context as
well as a path to load the `Dockerfile`. `env_file` specifies the path the a
file containing all environment variables. A set of volumes to share from the
host OS to the container are listed in `volumes`. Finally `ports` tells Docker
which ports on the host to map to the container.

### docker/django/dev/Dockerfile

The `Dockerfile` is a set of instructions for Docker to execute in order to
produce a Docker image&mdash; a file used to create a Docker container running
your application code.

```bash
# ...
# Install apt, Python then NodeJS dependencies.
RUN             apt-get update && \
                curl -sL https://deb.nodesource.com/setup_0.12 | bash - && \
                apt-get install -y nodejs && \
                pip install --upgrade pip && \
                pip install -r \
                    environments/dev/requirements.txt && \
                npm update && \
                npm install -g gulp && \
                npm install && \
                gulp
# Add our initialization script to the image and run it upon startup.
ADD             docker/django/start.sh /
CMD             ["/start.sh"]
```

In the development Dockerfile, `pip` and `npm` commands install the necessary
dependencies from the `environments/dev` folder. Finally `start.sh` is called to
start the Django application server.

### docker/django/prod/docker-compose.yml

This file provides configuration for Docker to orchestrate the management of the
production Docker containers. This configuration can be used for testing locally
prior to deployment to Amazon AWS.

```yml
django:
  build: ../../..
  dockerfile: docker/django/prod/Dockerfile
  env_file: ../../../environments/prod/.env
  volumes:
    - "../../../docker/django/prod/gunicorn.conf.py:/etc/gunicorn/gunicorn.conf.py:ro"
    - "/var/app/app/dist"

nginx:
  image: nginx
  links:
    - django
  volumes:
    - "../../../docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro"
    - "../../../docker/nginx/sites-enabled.conf:/etc/nginx/conf.d/default.conf:ro"
  volumes_from:
    - django
  ports:
    - "80:80"
```

It defines two containers "django" and "nginx". "Django" is configured quite
similar to the development setup, but doesn't map as many volumes from the host
OS to the container. In this configuration "django" doesn't need to expose a
port externally, as the "nginx" container will expose port 80 externally.

Importantly, the "nginx" container uses `links` to connect the "django"
container to "nginx". This way nginx config files can refer to "django" as-if it
was another host on the same network with the name "nginx".

Finally, the "nginx" container will mount all volumes from the "django"
container with the `volumes_from` directive, and expose port 80 to the host OS.

### docker/django/prod/Dockerfile

The major difference between the development `Dockerfile` and the production
version is:

- It exposes port 8080 for other containers
- It runs `gulp build` during image creation

This Dockerfile also installs production-only Python pip dependencies in
requirements.txt.

```bash
# Install apt, Python then NodeJS dependencies.
RUN             apt-get update && \
                curl -sL https://deb.nodesource.com/setup_0.12 | bash - && \
                apt-get install -y nodejs && \
                pip install --upgrade pip && \
                pip install -r \
                    environments/prod/requirements.txt && \
                npm update && \
                npm install -g gulp && \
                npm install && \
                gulp build
# Exposes port 8080
EXPOSE          8080
```

When Docker runs the image build, it runs `gulp build`, which runs code-quality,
unit tests and produces production-ready web frontend assets. This allows for
testing prior to deployment, and gives the team an opportunity to fix errors
before they go into the wild.

## Elastic Beanstalk specific structure

Finally, these comments describe files related to Amazons' Elastic Beanstalk:

    .dockerignore
    .ebextensions/           # Describes how EB builds environments
      01_envvars.config      # Describes env vars for AWS Docker containers
    .ebignore                # Describes how Amazon EB ignores some files
    .elasticbeanstalk/       # Location Amazon EB stores its cli settings
    Dockerrun.aws.json       # Describes how to run our containers in AWS
    .gitignore
    .bowerrc
    .csslintrc.json
    .jshintrc
    bower.json
    gulpfile.js
    package.json
    app/
      apps/*
      project/*
      dist/*
    bin/*
    docker/
      django/
        dev/
          docker-compose.yml
          Dockerfile
        prod/
          docker-compose.yml
          Dockerfile
          gunicorn.conf.py
        start.sh
      nginx/*
    environments/
      dev/
        .env
        .env.example
        Procfile
        requirements.txt
      prod/
        .env
        .env.example
        Procfile
        requirements.txt

### .ebextensions/01_envvars.config

This file is used by the Elastic Beanstalk command line utilities to pass
key-value parameters to Amazon EC2 and ECS. This file is used to store all
production environment variables that are provided to running containers. This
variables often vary between deployments.

### .ebignore

When Elastic Beanstalk does a deployment, it creates a zip file of the current
directory, uploads it to Amazon S3, and deploys the files to running EC2
instances. Since this project is using Docker images to package the app, we can
ignore most files; with the exception of the `app/dist` directory&mdash; which
both "Django" and "Nginx" containers will need access too.

The `.ebignore` file is used to ignore certain files in a project directory.
This file works like a `.gitignore` file.

    # Ignore everything!
    *
    # Except for these exclusion patterns required by Amazon ECS
    !Dockerrun.aws.json
    !.ebextensions/*.config
    !.elasticbeanstalk/*.cfg.yml
    !.elasticbeanstalk/*.global.yml
    !app/dist/**
    !docker/**

The only files our EB package should contain are those required by Docker,
Elastic Beanstalk itself, or any files shared between both containers (such as
the `app/dist` directory).

When you deploy your project directory to Elastic Beanstalk and create a new
application version, the EB CLI will not include files specified by the
`.ebignore` in the source bundle that it creates. This is useful for creating
smaller packages by excluding files that aren't required for running
production-only code.

### .elasticbeanstalk/

Elastic Beanstalk uses this directory to store temp files and configuration
information about the current AWS account, EB Application name and IAM
credentials to utilize.

### Dockerrun.aws.json

`Dockerrun.aws.json` is a proprietary Amazon-specific JSON format called a
"[Task Definition](#task-def)" used to configure how to manage Docker containers
running on Amazon EC2 Container Service (ECS) platform.

```json
"containerDefinitions": [
{
    "name": "django",
    "image": "0xadada/dockdj:latest",
    "essential": true,
    "memory": 512,
    "mountPoints": [
        {
            "sourceVolume": "gunicorn-conf",
            "containerPath": "/etc/gunicorn/gunicorn.conf.py",
            "readOnly": true
        }
    ]
}
```

The JSON format is very similar to the docker-compose Yaml format, having a
nearly 1-to-1 mapping of `image`, `mountPoints` to volumes and ports all
defined.

This file is functionally identical to `docker/prod/docker-compose.yml` in that
it runs, configures and connects the "Django" and "Nginx" Docker containers. As
such, changes to the `docker-compose.yml` file should be mirrored in the
`Dockerrun.aws.json` file.

## Lifecycle

New developers to this project simply clone the project from GitHub, install
Docker (and boot2docker/docker-machine on OS X) and can begin running the app.
There is no need to setup a developer environment or create (yet) another VM.

### Development

When the developer starts working on the project from scratch, the only
requirement is Docker and a machine capable of running Docker containers (Linux
3+ or boot2docker/docker-machine).

Once an organization or developer has adopted Docker for a single project,
startup time for other docker projects is drastically reduced as this core
requirement has already been met. From that point forward, the projects
themselves can define and provision their own dependencies.

For this project, the next steps required of the developer are as follows:

```bash
git clone <PROJECT>
<create .env file>
.bin/stevedore dev start
```

The developer is now running the app. Any internal OS configuration, system
libraries, software dependencies and provisioning are all handled by the project
and Docker&mdash; transparently to the developer.

Subsequent context-switches between other projects and this project have been
reduced to a single command:

```bash
.bin/stevedore dev start
```

The developer doesn't need to boot up a VM, nor does she/he need to understand
or start any internal processes or run any commands internal to the VM.

**In development, Docker can be used to lower cognitive load on developers
switching between multiple projects.**

### QA

In this particular project, QA tests are run during build of the the production
Docker image via the `gulp build` task. See
[the production Dockerfile](#dockerdjangoproddockerfile) to view how it calls
the gulp task.

In effect, this will prevent developers or continuous Integration systems from
publishing a production Docker image to Docker Hub, as the build will trigger a
Docker image build failure.

More generally, development teams could create different tags for "production"
releases and "development" Docker image releases. Lets say "prod" vs "dev".

Development teams could publish images tagged with "dev", to Docker Hub. Other
developers on the team or members of the QA team could `docker pull` that tagged
image and run their suite of tests on it.

Using Docker in this manner, dev and QA teams no longer have to keep VM
configurations synchronized, as the OS and other dependencies have been pushed
down from VM directly into dependencies within the scope of the project. **This
has the effect of reducing manual synchronization and de-necessitating
out-of-channel communication between development and QA teams about the state of
the runtime environment.** This allows for faster, less-error-prone iteration of
the runtime environment.

### Production

Developers have iterated on functionality, QA has run tests against the code,
and the projects is ready for deployment to production.

At this point, a working Docker image has been run on developers local machines,
and QA has passed. These three phases could've gone through multiple iterations
while bugs were identified and fixed. The end result is a working Docker image
exists that has been deemed "ready" for production.

Either manually or as part of a continuous integration tool, the
production-ready Docker image can now be tagged with a release version and
published to Docker Hub (or other compatible Docker image repository). Finally,
the deploy process needs to update the production servers running our working
application stack and run the latest application code.

These tasks are handled by our `bin/deploy` script, a wrapper for Docker, Git
and Elastic Beanstalk. It will tag the latest Docker image, publish the tag to
Docker Hub, tag the publish the tags to GitHub and use Elastic Beanstalk to
deploy both the latest stack and application code:

(Lets use 1.2.3 as an arbitrary version number for this example)

```bash
bin/deploy release 1.2.3 # Create a release branch and tag the image
bin/deploy publish 1.2.3 # Publish the Docker image and git branch
                         # to Docker Hub and GitHub
bin/deploy deploy 1.2.3  # Use EB to deploy the latest release
```

The deploy script is a light bash wrapper that automates Git, Docker and Elastic
Beanstalk commands in an easy-to-reproduce set of short commands.

Once complete, the Amazon environment will be running your latest application
code, as well as any new changes to the container OS, system libraries and
dependencies. Most importantly, **any changes in provisioning to the stack have
been deployed along with the Docker image**, thus enabling seamless roll-backs.
**Rolling back the application version will also rollback the stack version**.
The application and stack are deployed together.

Happy cloud computing!

## Terms

- <a name="autoscaling">_Auto-scaling_</a> A method of setting a threshold that
  detects when the load on a server cluster necessitates adding or removing
  servers in order to optimize the number of servers servicing that load.
  Auto-scaling allows an organization to decrease operating costs by running the
  minimum number of servers required to service its load, and eliminating the
  need to accurately predict future traffic patterns.

- <a name="config-mgmt">_Configuration Management_</a> Software tools that are
  designed to automatically start, provision and configure software on virtual
  machines rather than have engineers run these steps manually on each server.
  These tools can be used both locally to create development VMs (virtual
  machines) as well as in the cloud to create staging and production VMs.

- <a name="docker-image">_Docker image_</a> A docker image is like an executable
  program binary. It takes source files and other assets and bundles them
  together, and the resulting bundle can be run/executed as a single process on
  a Linux machine.

- <a name="docker-container">_Docker container_</a> A docker container is like a
  running executable program. It is a running instance of a docker image. Like a
  running program, it has a PID, and it is appropriate to call it a process. It
  can be started and stopped. One docker image can be run many times on one or
  more machines.

- <a name="provisioning">_Provisioning_</a> The installation and configuration
  of software needed to run an application. E.g. Installing and configuring
  Apache and its system libraries in order to run WordPress.

- <a name="task-def">_Task definition_</a> A proprietary JSON format for
  describing how Docker containers are run within the Amazon EC2 Cloud Service.
  Read more about
  [Amazon ECS Task Definitions](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_defintions.html).
  Docker uses the [docker-compose Yaml](https://docs.docker.com/compose/yml/)
  file to do the same thing.

[^1]:
    Configuration management tools can be used to couple both Stack and
    Application, but experience has has shown that over time, these tools
    are not strongly opinionated, and therefore Stack-App decoupling occurs
    organically over the lifetime of a project.

[^2]:
    Docker runs on Linux version 3. In the case where the developer is
    using OS X, Windows or another non-Linux OS, they'll need to run a Linux
    VM in order to use Docker. However, this single VM will be able to run
    all Docker containers for all Docker projects they use. Tools like
    Docker Machine make working with the Docker VM much simpler.
