Releasing
=========

We release our web-apps in containers on a server running the [Dokku PaaS](http://dokku.viewdocs.io/dokku/).

One-Time Setup
--------------

To be able to release, you first need to setup your keys so that you can push to the Dokku server.
Once that is setup for you, then you need to add git remotes for each app that you want to release.
On your machine, that looks something like this:

```
git remote add prod-tools dokku@my.server.edu:mc-tools
git remote add prod-topics dokku@my.server.edu:mc-topics
git remote add prod-sources dokku@my.server.edu:mc-sources
git remote add prod-explorer dokku@my.server.edu:mc-explorer
```

Building and Pushing a Release
-------------------------------

1. Make or enter release branch such as 3.5.x, and create a milestone if we don't have one (ie. v3.5.1)
1. Test the changes locally to make sure they worked (after pulling into release branch)
1. Update the version number in `./package.json`.
1. Update release notes in `server/static/data/release_history.json`
   1. Commit these files
1. Build the release version of the JS and CSS: `npm run topics-release`, or `npm run sources-release`, etc.
   1. Commit those built files
1. Tag the new build with the appropriate release label (ie. "git tag sources-v2.7.3" or "git tag topics-v2.4.3") -
see `version-control.md` for more details
1. Push the tag(s) `git push origin --tags`
1. Push the tagged release to the appropriate production Dokku server with git (ie.
`git push prod-explorer explorer-v3.1.x:master`)
1. Make sure it works on the server
1. Create a PR on GitHub from your branch back to master (so the changes get merged in)

Bug Fixes and Patches
---------------------

When fixing a bug for production
* Make a commit to fix the bug on the release branch (e.g. v3.13.x)
* Deploy the fix to production by following the release process
