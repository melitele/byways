PROJECT=byways.org
BUILD_DIR?=/var/www/$(PROJECT)
BUILD_SCRIPT=$(BUILD_DIR)/scripts/index

BIN_DIR=./node_modules/.bin
WS=$(BIN_DIR)/wintersmith

all: lint preview

$(BUILD_DIR):
	mkdir -p $@

clean:
	rm -rf $(BUILD_DIR)/*

distclean: clean
	rm -rf node_modules

%.min.js: %.es5.js
	$(BIN_DIR)/uglifyjs \
		--mangle \
		--no-copyright \
		--compress \
		--output $@ $<

%.es5.js: %.js
	$(BIN_DIR)/buble \
		--yes dangerousForOf \
		--target ie:10 \
		--output $@ $<

$(BUILD_SCRIPT).js: | $(BUILD_DIR)
	$(WS) $(WS_OPTIONS) build --output $(BUILD_DIR)

build: $(BUILD_SCRIPT).min.js

preview:
	$(WS) $(WS_OPTIONS) preview

lint:
	$(BIN_DIR)/jshint lib contents/scripts

.PHONY: all preview build lint clean
