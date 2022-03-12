PROJECT=byways.org
BUILD_DIR?=/var/www/$(PROJECT)
PORT ?= 3040
NODE_BIN=./node_modules/.bin
SRC_DIR=contents
SRC = $(wildcard $(SRC_DIR)/scripts/*.js)

all: check build

FILES = $(shell find $(SRC_DIR) -type f)

OUT_FILES := $(FILES:.md=.html)
OUT_FILES := $(OUT_FILES:%.yaml=%)
OUT_FILES := $(OUT_FILES:.styl=.css)
OUT_FILES := $(OUT_FILES:$(SRC_DIR)/%=$(BUILD_DIR)/%)

SCRIPTS = $(SRC:$(SRC_DIR)/%.js=$(BUILD_DIR)/%.js)

%.min.js: %.js
	$(NODE_BIN)/terser \
		--mangle \
		--no-copyright \
		--compress \
		--output $@ $<

check: lint

clean:
	@rm -rf $(BUILD_DIR)/*

distclean: clean
	@rm -rf node_modules

.SECONDARY: $(OUT_FILES)

$(OUT_FILES): metalsmith

metalsmith: | node_modules ${BUILD_DIR}
	node metalsmith --destination ${BUILD_DIR}

.PHONY: metalsmith

preview: | node_modules ${BUILD_DIR}
	node metalsmith --preview --destination ${BUILD_DIR} --port $(PORT)

$(BUILD_DIR):
	mkdir -p $@
	chown $(USER) $@

lint: | node_modules
	$(NODE_BIN)/jshint metalsmith.js $(SRC)

node_modules:
	yarn && touch $@

build: $(OUT_FILES)

MIN_SCRIPTS = $(SCRIPTS:%.js=%.min.js)

dist: export NODE_ENV=production
dist: clean check
dist: $(MIN_SCRIPTS)

.PHONY: all preview build lint clean

