var cached = require('cached');
var MEMCACHE_CONFIG = {
  backend: {
    type: 'memcached',
    hosts: '127.0.0.1:11211',
  }
};

getOrElse('zip-map', '60647', fetcher);
function getOrElse(cacheName, cacheKey){
  var cache = cached(cacheKey, MEMCACHE_CONFIG);
}

cacheMiss = cached.deferred(function(done) {
  geocoder.geocode( address, function( err, data ){
    if (!data.results.length) {
      var responseData = {
          legislators:[]
      };
      _this.done(null, responseData);

      return;
    }

    _this.onGetCoordsForAddress( err, data, done );

  });
});

cache.getOrElse(cacheKey, cacheMiss).then(function(data){
  _this.respond(data);
});