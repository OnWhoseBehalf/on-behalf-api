On Behalf  API
---

# Install and Start

*Requires NPM and Node and Memcached*

Install memcached with `brew install memcached`

Then start with `brew services start memcached`

Clone this repo, install, and run.

```
make install
make forever
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
