# Kylie - Real User Monitoring Plugin for Websites. #

Copyright (c) 2011, Yahoo! Inc. All rights reserved. Some code Copyright (c) 2012, Log-Normal Inc. All rights reserved. Some code Copyright (c) 2013, Salesforce.com. All rights reserved.

Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.

boomerang always comes back, except when it hits something.

Kylie - [an Australian boomerang; one side flat and the other convex](http://wordnetweb.princeton.edu/perl/webwn?s=kylie)

## Summary ##

Kylie is a piece of JavaScript that is embedded in a webpage to monitor how long it takes for users to load the page. This is also commonly referred to as [RUM](https://en.wikipedia.org/wiki/Real_user_monitoring). Kylie is also a fork of [boomerang](https://github.com/lognormal/boomerang) that is designed to reduce the [observer effect](https://en.wikipedia.org/wiki/Observer_effect_\(physics\)) and add new features.

Apart from page load time, Kylie measures a whole bunch of performance characteristics of your user's web browsing experience. All you have to do is stick it into your web pages and call the `onLoad()` method at the very end of the page load.

## Usage ##

The simple synchronous way to include Kylie on your page...

    <script src="http://your-cdn.host.com/path/to/perf.js"></script>
    ...
    <body onload="perf.onLoad()">

This does not work asynchronously. Based on the way that it is setup it needs to call `perf.onLoad()` explicitly because most complex sites do not have a standard measure to say that the page is fully loaded.

Kylie can also capture the client-side time on the browser for a page. To accurately facilitate this you need to include a reference time at the top of the page `var perfOptions={pageStartTime:new Date()};`.

    <script>var perfOptions={pageStartTime:new Date()};</script>
    <script src="http://your-cdn.host.com/path/to/perf.js"></script>
    ...
    <body onload="perf.onLoad()">

If `pageStartTime` is not included on the page then a `new Date()` is instantiated after downloading/parsing perf.js and is used in it's place.

### Adding Custom Measurements ##

Kylie can be used to measure the time it takes to load specific parts of a web page.  It is as simple as calling `perf.mark("UNIQUE_NAME")` to start the timer and `perf.endMark("UNIQUE_NAME")` to end the timer. This will capture the elapsed time of the instrumented code and a reference time that can be used to order it within the other metrics.

#### Simple Example ####

    <script>
    perf.mark("ConsoleLog");
    console.log("Number of DOM elements: " + document.getElementsByTagName("*").length);
    perf.endMark("ConsoleLog");
    </script>

### Accessing Metrics ###

If the beacon URL is set then the data can be read in JSON format from the server. Inside the boomerang.js file the URL to report the captured measurements is set in the `beacon_url` url parameter.

From the browser console or JavaScript you can access the parameters uisng `perf.toJson()`.

## What makes this Fork better than any other implementation of Boomerang? ##

### Smaller in size ###

The code is smaller size and will download and parse faster. It was re-coded to work completely with Google's [Closure Compiler](https://developers.google.com/closure/compiler/) (in advanced mode). This means that the overhead that this library will have is less. The number of required global variables have be reduce to 2, which reduces the negative impact on overall performance and namespace clobbering.

### Faster Code ###

The code was also re-designed to use `"use strict";` and be compatible with it. This improves the performance of the code and reduces the chances of having hidden errors. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode) for more info on Strict Mode.

## Support ##

All support, questions, bug fixing, is done via our github repository at [https://github.com/forcedotcom/boomerang](https://github.com/forcedotcom/boomerang). You'll need a github account to participate, but then you'll need one to check out the code as well :)

I would like to thank you for taking a look at Kylie.  Please leave us a message telling us if you use our version.

Kylie is supported by the Perf Eng team at Salesforce.com, and the community of opensource developers / DevOps / Perforce engineers who use and hack it.
