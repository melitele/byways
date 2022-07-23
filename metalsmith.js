const metalsmith = require('metalsmith');

const collectons = require('@metalsmith/collections');
const debug = require('metalsmith-debug');
const define = require('metalsmith-define');
const layouts = require('@metalsmith/layouts');
const markdown = require('metalsmith-markdownit');
const stylus = require('metalsmith-stylus');
const lunr = require('@pirxpilot/metalsmith-lunr-index');
const esbuild = require('@pirxpilot/metalsmith-esbuild');

const {
  destination,
  port = 3040,
  preview = false
} = require('minimist')(process.argv.slice(2));


/* exported locals */
const locals = {
  siteTitle: "America's Scenic Byways",
  siteDescription: "Descriptions, maps and links to related information for over 800 America's most scenic roads.",
  siteUrl: "http://scenicbyways.info",
  email: "contact@scenicbyways.info",
  furkotUrl: process.env.FURKOT_URL || "https://trips.furkot.com",
  js: 'js',
  colors: {
    "All-American Road": "#AB0534",
    "National Scenic Byway": "#003768",
    "National Forest Scenic Byway": "#006E24",
    "Parkway": "#955A32",
    "BLM Back Country Byway": "#007BFF",
    "Other Scenic Road": "#E3BE16"
  },
  package: require('./package.json'),
};

const collectionsData = {
  byways: { pattern: ['byway/*'], refer: false, sortBy: 'name' },
  states: { pattern: ['state/*'], refer: false, sortBy: 'name' }
};


function setUrls(files) {
  Object.entries(files).forEach(function ([path, file]) {
    const url = path.replace(/\.md$/, '.html');
    file.url = `/${url}`;
    file.slug = path.split('/').pop().split('.')[0];
  });
}

function handleYaml(files) {
  Object.keys(files).forEach(function (path) {
    if (path.endsWith('.yaml')) {
      let strippedPath = path.slice(0, -5);
      files[strippedPath] = files[path];
      delete files[path];
    }
  });
}

function handleJSON(files) {
  Object.keys(files).forEach(function (path) {
    if (path.endsWith('.json')) {
      let strippedPath = path.slice(0, -5);
      let file = files[path];
      Object.assign(file, JSON.parse(file.contents.toString()));
      file.contents = Buffer.allocUnsafe(0);
      files[strippedPath + '.html'] = files[path];
      delete files[path];
    }
  });
}

function adjustProperties(files) {
  Object.values(files).forEach(function (file) {
    if (file.path) {
      delete file.path;
    }
    if (file.template) {
      file.layout = file.template;
      delete file.template;
    }
    if (file.layout) {
      file.layout += '.pug';
    }
    if (file.name) {
      // title is used by lunr
      file.title = file.name;
    }
  });
}

function collectDesignations(files, metalsmith) {
  function bywaysByDesignation(byways, names) {
    const designation2list = names.reduce(function (result, name) {
      result[name] = [];
      return result;
    }, Object.create(null));

    // last by
    const others = designation2list[names[names.length - 1]];

    byways
      .filter(byway => !byway['part of'])
      .forEach(function (byway) {
        const { designations = [] } = byway;

        let addToOthers = true;

        designations.forEach(function (dsg) {
          let list = designation2list[dsg];
          if (list) {
            list.push(byway);
            addToOthers = false;
          }
        });

        if (addToOthers) {
          others.push(byway);
        }
      });

    return designation2list;
  }

  const metadata = metalsmith.metadata();
  const names = [
    'All-American Road',
    'National Scenic Byway',
    'Parkway',
    'National Forest Scenic Byway',
    'BLM Back Country Byway',
    'Other Scenic Road'
  ];

  metadata.designations = bywaysByDesignation(metadata.byways, names);
}

function collectById(files, metalsmith) {
  const metadata = metalsmith.metadata();

  function addBySlug(result, item) {
    result[item.slug] = item;
    return result;
  }

  metadata.statesById = metadata.states.reduce(addBySlug, Object.create(null));
  metadata.bywaysById = metadata.byways.reduce(addBySlug, Object.create(null));
}

const ms = metalsmith(__dirname)
  .env({ NODE_ENV: process.env.NODE_ENV })
  .source('contents')
  .destination(destination)
  .clean(false)
  .use(debug())
  .use(define(locals))
  .use(handleYaml)
  .use(handleJSON)
  .use(adjustProperties)
  .use(setUrls)
  .use(collectons(collectionsData))
  .use(collectDesignations)
  .use(collectById)
  .use(stylus({
    compress: true
  }))
  .use(esbuild({
    entries: {
      'scripts/index': 'contents/scripts/index.js',
      'scripts/search': 'contents/scripts/search.js'
    }
  }))
  .use(markdown({
    html: true
  }))
  .use(lunr({
    pattern: ['byway/*.html', 'about.html'],
    refKey: 'url'
  }))
  .use(layouts({
    directory: 'templates',
    default: 'byway.pug',
    pattern: ['**/*.html', '**/*.xml']
  }));

if (preview) {
  const serve = require('metalsmith-serve');
  ms.use(serve({ port }));
}

/* global console */

ms.build(function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
