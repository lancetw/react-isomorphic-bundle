BIN = node_modules/.bin
MOCHA_CMD = $(BIN)/mocha
ISTANBUL_CMD = node --harmony node_modules/istanbul/lib/cli.js
ESLINT_CMD = $(BIN)/eslint

SRC_JS = $(shell find src -name "*.js")
LIB_JS = $(patsubst src/%.js,lib/%.js,$(SRC_JS))
TEST_JS = $(shell find tests -name "*-test.js")

BABEL_ARGS = --stage 0 --source-maps-inline
MOCHA_ARGS = --harmony --require co-mocha tests/spec.js --compilers js:babel/register -R nyan $(TEST_JS)
MOCHA_ARGS_SPEC = --harmony --require co-mocha tests/spec.js --compilers js:babel/register -R spec $(TEST_JS)
ISTANBUL_ARGS = cover node_modules/mocha/bin/_mocha -- --timeout 500000 --harmony --require co-mocha tests/spec.js --compilers js:babel/register -R spec $(TEST_JS)
TRAVIS_ARGS = cover node_modules/mocha/bin/_mocha -- --timeout 500000 --harmony --require co-mocha tests/spec.js --compilers js:babel/register --report lcovonly -R spec $(TEST_JS) && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js


build: js webpack

clean:
	rm -rf public/assets/
	rm -rf lib/

# Test
test: lint js
	@NODE_ENV=test $(MOCHA_CMD) $(MOCHA_ARGS)

test-spec:
	@NODE_ENV=test $(MOCHA_CMD) $(MOCHA_ARGS_SPEC)

test-cov: js
	@NODE_ENV=test $(ISTANBUL_CMD) $(ISTANBUL_ARGS)

test-ci: js
	@NODE_ENV=test $(ISTANBUL_CMD) $(TRAVIS_ARGS)

lint:
	$(ESLINT_CMD) $(SRC_JS) $(TEST_JS)

# Build application quickly
# Faster on first build, but not after that
fast-build: fast-js build

# Watch for changes
watch:
	@NODE_ENV=development $(MAKE) -j5 dev-server webpack-server browser-sync


debug:
	@NODE_ENV=debug $(MAKE) -j5 webpack-dev node-debug dev-debug

node-debug:
	node-inspector --no-preload

# Transpile JavaScript using Babel
js: $(LIB_JS)

$(LIB_JS): lib/%.js: src/%.js
	mkdir -p $(dir $@)
	$(BIN)/babel $< -o $@ $(BABEL_ARGS)

fast-js:
	$(BIN)/babel src -d lib $(BABEL_ARGS)

watch-js:
	$(BIN)/babel src -d lib $(BABEL_ARGS) -w

dev-server: $(SRC_JS)
	nodemon --harmony ./src/server

dev-debug:
	node --harmony --debug ./src/server

browser-sync:
	$(BIN)/browser-sync start --proxy="localhost:3000" --port 3002 --ui-port 3003 --files="src" --no-open

webpack-dev:
	node ./webpack/server.js

webpack-server: $(LIB_JS)
	node ./webpack/server.js

webpack: public/js/index.js

public/js/index.js: $(SRC_JS)
	@NODE_ENV=production $(BIN)/webpack --progress --profile --colors --stats --config webpack/server.js
