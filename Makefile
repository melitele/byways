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

build: | $(BUILD_DIR)
	$(WS) $(WS_OPTIONS) build --output $(BUILD_DIR)
	$(BIN_DIR)/uglifyjs --mangle --no-copyright --compress --output $(BUILD_SCRIPT).min.js $(BUILD_SCRIPT).js

preview:
	$(WS) $(WS_OPTIONS) preview

lint:
	$(BIN_DIR)/jshint lib contents/scripts

.PHONY: all preview build lint clean
