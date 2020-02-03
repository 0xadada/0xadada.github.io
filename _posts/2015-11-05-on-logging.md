---
title: "on logging"
date: 2015-11-05 11:13:00
metaDescription: "Thoughts and best practices on application logging"
metaKeywords: software engineering, web development, 12 factor
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [essays, open-source]
---

Application logs are useful for many reasons. They are the primary source
of troubleshooting information. Logs are essential to forensics during
any rigorous security analysis. Web server logs are often used for analysis
in order to gain insight into usage, audience, and trends.


## Logging

Logs are time-ordered streams: there is no beginning or end, but rather
an ongoing, collated collection of events which we may wish to view in
realtime as they happen. Unix provides some excellent tools for handling
streams. There are two default output streams, `stdout` and `stderr`,
available automatically to all programs.

A program which uses `stdout` is equipped to log in a variety of ways
without adding any weight to its codebase or configuration format.

Treating your logs as streams is a form of future-proofing for your
application. Choosing to use `stdout` over custom-implementing a specific
logging solution allows your application to change logging mechanisms
with 0-code changes. It allows you to be the most agnostic as you haven't
needed to make any decisions or implementations other than adopting a
long-standard convention.

If you run them in the foreground, as is typical of development mode, you
see the output right in your terminal. This is exactly what you want. If
you run in production mode, you can redirect the output to a file, to syslog,
to both, or to any other logging system that can accept an input stream.

Logging on any reasonably large distributed system will generally end up
using the syslog protocol to send logs from many components to a single
location. Programs that treat logs as files are now on the wrong path: if
they wish to log to syslog, each program needs to implement syslog
internally - and provide yet more logging configuration options to set
the various syslog fields.


### Best Practices

1. An app shouldn't implement a custom logging solution. Simply write
  to `stdout` and `stderr`.
1. Don't write to a log file, and don't expect log files to be managed.
  This then requires log rotation and log file maintenance.

During local development, the developer will view this stream in the
foreground of their terminal to observe app behavior. During production
the runtime environment will read `stdout` and `stderr` from the app, the
streams will be captured by the execution environment, collated together
with all other streams from the app, and routed to one or more final
destinations for viewing and long-term archival. These archival destinations
are not visible to or configurable by the app, and instead are completely
managed by the execution environment. Furthermore, the app needn't
implement any logging solution.

The event stream for an app can be rerouted to a file (if needed), or
watched in a terminal. Most significantly, the stream can be sent to a log
indexing and analysis system such as Splunk. These systems allow for great
power and flexibility for introspecting an app's behavior over time,
including:

* Finding specific events in the past.
* Large-scale graphing of trends (such as requests per minute).
* Active alerting according to user-defined heuristics


### In Practice

Already using Amazon AWS? Checkout CloudWatch, the additional advantages
here are that you could have a central source of truth for all monitoring
needs because such metrics as CPU, disk I/O, and network for your container
instances are already available on CloudWatch.

If using Docker, [Docker 1.9 announced a logging driver for CloudWatch](https://github.com/docker/docker/releases/tag/v1.9.0). Use
these options to enable the `awslogs` Amazon AWS CloudWatch logging
driver:

    --log-opt awslogs-region=<aws_region>
    --log-opt awslogs-group=<log_group_name>
    --log-opt awslogs-stream=<log_stream_name>

Provide AWS credentials to the Docker daemon to use the `awslogs`
logging driver. You can provide these credentials with the `AWS_ACCESS_KEY_ID`
, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables.

Credentials must have a policy applied that allows the `logs:CreateLogStream`
and `logs:PutLogEvents` actions, as shown in the following example.

    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Effect": "Allow",
          "Resource": "*"
        }
      ]
    }

Use containers to move logs from one container into another service using
a Docker logging driver. Docker allows configuration of container log
driver:

    container_name:
        log_driver: syslog
          log_opt:
            syslog-tag: nginxproxy_nginx
            syslog-address: udp://MY_DOCKER_HOST

Using Splunk? [Use containers to run a Splunk
forwarder](http://blogs.splunk.com/2015/08/24/collecting-docker-logs-and-stats-with-splunk/)

    splunkforwarder:
      image: outcoldman/splunk:6.2-forwarder
      environment:
        - SPLUNK_FORWARD_SERVER=YOUR_DOCKER_HOSTNAME:9997
      volumes_from:
        - vforwarder
      ports:
        - 514:1514/udp
      restart: always
