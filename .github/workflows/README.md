Github Workflows
================

This folder contains yaml files that define various workflows for this project.

### Organiztion

The following convention is used for naming files in this folder:

* `ci-` prefix: Files with this prefix have event definitions that result in jobs being run for things like puhes, pull requests, tags etc.
* `wf-` prefix: Files with this prefix define reusable workflows that are called from the workflows defined in `ci-` files.