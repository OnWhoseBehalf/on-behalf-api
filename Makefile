APP_NAME=grpn-facets

NODE=node --harmony
NPM=npm
FOREVER=forever

# ## Usage
usage :
	@echo ''
	@echo 'Core tasks                       : Description'
	@echo '--------------------             : -----------'
	@echo 'make install                     : Installs dependencies'
	@echo 'make server                      : Starts server'
	@echo 'make forever                     : Starts server using forever'

install:
	$(NPM) install

server:
	$(NODE) src/server.js

forever:
	$(FOREVER) src/server.js

mocha:
	mocha --harmony
