@page Plugins Developing Plugins
@parent contributing 0

@body

In this guide you'll learn how to build a plugin for CanJS. As is standard with programming tutorials, we'll build something that says "Hello World".

## Setup

We'll be using [Yeoman](http://yeoman.io) and a generator built to scaffold CanJS plugins. If you don't want to use Yeoman, you will have to create the files mentioned in this guide yourself. The [canjs-hello-world](https://github.com/ccummings/canjs-hello-world) repository is where you can grok all of the files the Yeoman generator creates.

### 1) Install Yeoman

The first thing you need to do is install Yeoman and [`generator-canjs-plugin`](https://github.com/ccummings/generator-canjs-plugin) which will allow you to quickly scaffold a CanJS plugin. 

Install both by running the following on the command line:

	npm install -g yo generator-canjs-plugin

_For help installing or using Yeoman, there is the [Yeoman getting started guide](http://yeoman.io/gettingstarted.html)_

### 2) Run the generator

Next create a directory for your plugin and `cd` into it:

	mkdir canjs-hello-world && cd canjs-hello-world

Then run the generator:

	yo canjs-plugin

After answering a series of questions about your plugin the generator will create the files and install all of the dependencies you need to develop, test and publish your CanJS plugin.

## Develop

Now that you have a scaffold in place, you'll start building your plugin.

### Modify the Source

A single source file will be placed in the `src` directory. This is where you will add your plugin code. Here's what your plugin should look like:

	can.hello = function() {
		return 'Hello World';
	};

_Notice that the file includes bootstrapping that allows it to work with AMD loaders, Steal or stand alone with no dependency management tool._

### Write Tests

A [QUnit](https://qunitjs.com/) test file and runner are placed in the `test` folder. The `*_tests.js` file is where you will write tests for your plugin. Modify the `Hello World` test so it looks like this:

	test('Hello World', function() {
		equal(can.hello(), 'Hello World', 'Works!');
	});

You can run these tests by opening `test/qunit.html` in a browser or by running `grunt test` on the command line. Do this now and make sure the test passes.

### Create Examples

Examples for AMD, Steal and stand alone are placed in the `example` folder. Modify the `index.html` file in each folder to show people how to use your plugin.

In each of the 3 `index.html` files replace the line `//Demo JS goes here` with:

	console.log(can.hello());

Open these files in a browser and look at the console to see "Hello World" being logged.

## Create Documentation

It's highly recommended that you create documentation for your plugin. You can use your plugin repo's wiki or generate a website for it using [GitHub pages](https://pages.github.com/).

## Grunt Workflow

Now that you have developed a plugin, tests and examples, it's time to build the plugin using Grunt. The following commands are available:

Runs jsbeautifier and JSHint:

	grunt quality

Runs tests:

	grunt test    

Runs tests and places distributable files in the `dist` folder:

	grunt build

## Distribute your Plugin

First you'll want to put your plugin code on GitHub. Next you'll want to register it with bower so people can easily download your plugin and use it.

## Register with Bower

The scaffold generated a `bower.json` file for you so all you need to do to distribute your plugin via bower is register with the following command:

	bower register <plugin-name> <git-endpoint>

_Bower uses [git tags](http://git-scm.com/book/en/Git-Basics-Tagging) for versioning._

### Publish a new version

To publish a new version of your plugin, modify the version number in bower.json and tag a new version before pushing to origin:
	
	$ git add .
	$ git commit -m 'Update to vX.Y.Z'
	$ git tag -a vX.Y.Z -m 'vX.Y.Z'
	$ git push --tags origin master

## Wrapping Up

That's all there is to it. In this guide you developed a CanJS plugin complete with tests and examples and learned how to distribute it via bower. 

If you've created a CanJS plugin we'd love to hear about it over on [BitHub](http://bithub.com) IRC or our forums.