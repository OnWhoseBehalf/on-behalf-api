APP_NAME=grpn-facets

COFFEE=node_modules/.bin/coffee
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
	$(COFFEE) src/server.coffee -n

forever:
	$(FOREVER) -c coffee src/server.coffee -n
