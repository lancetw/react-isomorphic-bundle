BIN=node_modules/.bin
BABEL_ARGS = --stage 0 --source-maps-inline

SRC_JS = $(shell find src -name "*.js")
LIB_JS = $(patsubst src/%.js,lib/%.js,$(SRC_JS))

build: build-dev

build-dev: js webpack

# Build application quickly
# Faster on first build, but not after that
fast-build: fast-js build

# Watch for changes
watch:
	@NODE_ENV=development $(MAKE) -j5 dev-server webpack-server watch-js

clean:
	rm -rf public/assets/
	rm -rf lib/
	rm -rf dist/

# Transpile JavaScript using Babel
js: $(LIB_JS)

$(LIB_JS): lib/%.js: src/%.js
	mkdir -p $(dir $@)
	$(BIN)/babel $< -o $@ $(BABEL_ARGS)

fast-js:
	$(BIN)/babel src -d lib $(BABEL_ARGS)

watch-js:
	$(BIN)/babel src -d lib $(BABEL_ARGS) -w

dev-server: $(LIB_JS)
	nodemon --harmony ./lib/server

webpack-server: $(LIB_JS)
	node ./webpack/server.js

webpack: public/js/index.js

public/js/index.js: $(SRC_JS)
	@NODE_ENV=production $(BIN)/webpack --progress --profile --colors --stats --config webpack/server.js
