On Behalf  API
---

# Install and Start

*Requires NPM, NVM, io.js and Memcached*

## Memcached
Install memcached with `brew install memcached`

Then start with `memcached -d` to run as a daemon.

(You can stop it with `memcached -d stop`)

## NVM and io.js
Install [NVM](https://github.com/creationix/nvm)

Install io.js with `nvm install iojs`

Once installed use `nvm use iojs` to use it (your system default will still be used in other Terminal windows).

## Project
Clone this repo, install, and run.

```
make install
make server
```

Runs on [http://localhost:3000](http://localhost:3000)

# Use
## Make Requests
Request by `bioguide_id`

`/api/legislators/J000296`

Request by zipcode

`/api/legislators?address=60647`

## Entry Point

In `router.coffee` we have our entry point into the app.  For each call to the `'/api/legislator*'` route we create an instance of a `Legislator`, passing in the `req` and `res` objects, then call `get` method.

```
app.get '/api/legislator*', (req, res) ->
  var legislator = new Legislator req, res
  legislator.get()
```

# Needed
Semantic Versioning
