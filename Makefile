PROJECT=byways.org
BUILD_DIR?=/var/www/$(PROJECT)
BUILD_SCRIPT=$(BUILD_DIR)/build/build

BIN_DIR=./node_modules/.bin
WS=$(BIN_DIR)/wintersmith

all: lint preview

$(BUILD_DIR):
	mkdir -p $@

components:
	$(BIN_DIR)/component-shrinkwrap --install

clean:
	rm -rf $(BUILD_DIR)/*

build: | $(BUILD_DIR) components
	$(WS) build --output $(BUILD_DIR)
	$(BIN_DIR)/uglifyjs --mangle --no-copyright --compress --output $(BUILD_SCRIPT).min.js $(BUILD_SCRIPT).js

preview:
	$(WS) preview

lint:
	$(BIN_DIR)/jshint lib

.PHONY: all preview build lint clean components
