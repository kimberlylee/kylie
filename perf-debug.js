(function(window){'use strict';function IBOOMR() {
}
IBOOMR.prototype.version;
IBOOMR.prototype.window;
IBOOMR.prototype.t_lstart;
IBOOMR.prototype.t_start;
IBOOMR.prototype.sendBeacon;
IBOOMR.prototype.page_ready;
IBOOMR.prototype.addVar;
IBOOMR.prototype.removeVar;
IBOOMR.prototype.getVars;
IBOOMR.prototype.getVar;
IBOOMR.prototype.removeStats;
IBOOMR.prototype.setImmediate;
IBOOMR.prototype.setBeaconUrl;
IBOOMR.prototype.debug;
IBOOMR.prototype.info;
IBOOMR.prototype.warn;
IBOOMR.prototype.error;
IBOOMR.prototype.subscribe;
IBOOMR.prototype.init;
function IBOOMR_utils() {
}
IBOOMR.prototype.utils;
IBOOMR_utils.prototype.objectToString;
IBOOMR_utils.prototype.getCookie;
IBOOMR_utils.prototype.setCookie;
IBOOMR_utils.prototype.removeCookie;
IBOOMR_utils.prototype.pluginConfig;
IBOOMR_utils.prototype.getSubCookies;
function IPlugin() {
}
IPlugin.prototype.init;
IPlugin.prototype.is_complete;
/*
 Copyright (c) 2011, Yahoo! Inc.  All rights reserved.
 Copyright (c) 2012, Log-Normal, Inc.  All rights reserved.
 Copyright (c) 2013, SOASTA, Inc. All rights reserved.
 Copyright (c) 2013, Salesforce.com. All rights reserved.
 Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.
*/
var BOOMR_start = (new Date).getTime();
var BOOMR;
var BEACON_URL = "";
function run(w) {
  if(w.parent !== w && (document.getElementById("boomr-if-as") && document.getElementById("boomr-if-as").nodeName.toLowerCase() === "script")) {
    w = w.parent
  }
  var d = w.document;
  var k;
  var perfOptions = w["perfOptions"] || {};
  BOOMR = w.BOOMR === undefined ? {} : w.BOOMR;
  if(BOOMR.version) {
    return
  }
  BOOMR.version = "0.9";
  BOOMR.window = w;
  var impl = {beacon_url:BEACON_URL, site_domain:w.location.hostname.replace(/.*?([^.]+\.[^.]+)\.?$/, "$1").toLowerCase(), user_ip:"", onloadfired:false, handlers_attached:false, events:{"page_ready":[], "page_unload":[], "dom_loaded":[], "onLoad":[], "visibility_changed":[], "before_beacon":[], "click":[]}, vars:{}, disabled_plugins:{}, onclick_handler:function(ev) {
    var target;
    if(!ev) {
      ev = w.event
    }
    if(ev.target) {
      target = ev.target
    }else {
      if(ev.srcElement) {
        target = ev.srcElement
      }
    }
    if(target.nodeType === 3) {
      target = target.parentNode
    }
    if(target && (target.nodeName.toUpperCase() === "OBJECT" && target.type === "application/x-shockwave-flash")) {
      return
    }
    impl.fireEvent("click", target)
  }, fireEvent:function(e_name, data) {
    var i, h, e;
    if(!impl.events.hasOwnProperty(e_name)) {
      return false
    }
    e = impl.events[e_name];
    for(i = 0;i < e.length;i++) {
      h = e[i];
      h[0].call(h[2], data, h[1])
    }
    return true
  }};
  var boomr = {t_lstart:undefined, t_start:BOOMR_start, t_end:null, utils:{objectToString:function(o, separator) {
    var value = [], l;
    if(!o || typeof o !== "object") {
      return o
    }
    if(separator === undefined) {
      separator = "\n\t"
    }
    for(l in o) {
      if(Object.prototype.hasOwnProperty.call(o, l)) {
        value.push(encodeURIComponent(l) + "=" + encodeURIComponent(o[l]))
      }
    }
    return value.join(separator)
  }, getCookie:function(name) {
    if(!name) {
      return null
    }
    name = " " + name + "=";
    var i, cookies;
    cookies = " " + d.cookie + ";";
    if((i = cookies.indexOf(name)) >= 0) {
      i += name.length;
      cookies = cookies.substring(i, cookies.indexOf(";", i));
      return cookies
    }
    return null
  }, setCookie:function(name, subcookies, max_age) {
    var value, nameval, c, exp;
    if(!name || !impl.site_domain) {
      return false
    }
    value = BOOMR.utils.objectToString(subcookies, "&");
    nameval = name + "=" + value;
    c = [nameval, "path=/", "domain=" + impl.site_domain];
    if(max_age) {
      exp = new Date;
      exp.setTime(exp.getTime() + max_age * 1E3);
      exp = exp.toGMTString();
      c.push("expires=" + exp)
    }
    if(nameval.length < 4E3) {
      d.cookie = c.join("; ");
      return value === BOOMR.utils.getCookie(name)
    }
    return false
  }, getSubCookies:function(cookie) {
    var cookies_a, i, l, kv, cookies = {};
    if(!cookie) {
      return null
    }
    cookies_a = cookie.split("&");
    if(cookies_a.length === 0) {
      return null
    }
    for(i = 0, l = cookies_a.length;i < l;i++) {
      kv = cookies_a[i].split("=");
      kv.push("");
      cookies[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1])
    }
    return cookies
  }, removeCookie:function(name) {
    return BOOMR.utils.setCookie(name, {}, 0)
  }, pluginConfig:function(o, config, plugin_name, properties) {
    var i, props = 0;
    if(!config || !config[plugin_name]) {
      return false
    }
    for(i = 0;i < properties.length;i++) {
      if(config[plugin_name][properties[i]] !== undefined) {
        o[properties[i]] = config[plugin_name][properties[i]];
        props++
      }
    }
    return props > 0
  }, addListener:function(el, type, fn) {
    if(el.addEventListener) {
      el.addEventListener(type, fn, false)
    }else {
      el.attachEvent("on" + type, fn)
    }
  }}, init:function(config) {
    var i, l, properties = ["beacon_url", "site_domain", "user_ip"];
    if(!config) {
      config = {}
    }
    for(i = 0;i < properties.length;i++) {
      if(config[properties[i]] !== undefined) {
        impl[properties[i]] = config[properties[i]]
      }
    }
    if(config.log !== undefined) {
      BOOMR.log = config.log
    }
    if(!BOOMR.log) {
      BOOMR.log = function(m, l, s) {
      }
    }
    for(l in BOOMR.plugins) {
      if(BOOMR.plugins.hasOwnProperty(l)) {
        if(config[l] && (config[l].hasOwnProperty("enabled") && config[l].enabled === false)) {
          impl.disabled_plugins[l] = 1;
          continue
        }
        if(impl.disabled_plugins[l]) {
          delete impl.disabled_plugins[l]
        }
        if(typeof BOOMR.plugins[l].init === "function") {
          BOOMR.plugins[l].init(config)
        }
      }
    }
    if(impl.handlers_attached) {
      return BOOMR
    }
    if(!impl.onloadfired && (config.autorun === undefined || config.autorun !== false)) {
      if(d.readyState && d.readyState === "complete") {
        BOOMR.setImmediate(BOOMR.page_ready, null, null, BOOMR)
      }else {
        if(w["onpagehide"] || w["onpagehide"] === null) {
          boomr.utils.addListener(w, "pageshow", BOOMR.page_ready)
        }else {
          boomr.utils.addListener(w, "load", BOOMR.page_ready)
        }
      }
    }
    boomr.utils.addListener(w, "DOMContentLoaded", function() {
      impl.fireEvent("dom_loaded")
    });
    (function() {
      var fire_visible = function() {
        impl.fireEvent("visibility_changed")
      };
      if(d["webkitVisibilityState"]) {
        boomr.utils.addListener(d, "webkitvisibilitychange", fire_visible)
      }else {
        if(d["msVisibilityState"]) {
          boomr.utils.addListener(d, "msvisibilitychange", fire_visible)
        }else {
          if(d.visibilityState) {
            boomr.utils.addListener(d, "visibilitychange", fire_visible)
          }
        }
      }
      boomr.utils.addListener(d, "mouseup", impl.onclick_handler);
      if(!w["onpagehide"] && w["onpagehide"] !== null) {
        boomr.utils.addListener(w, "unload", function() {
          BOOMR.window = w = null
        })
      }
    })();
    impl.handlers_attached = true;
    return BOOMR
  }, page_ready:function() {
    if(impl.onloadfired) {
      return BOOMR
    }
    impl.fireEvent("page_ready");
    impl.onloadfired = true;
    return BOOMR
  }, setImmediate:function(fn, data, cb_data, cb_scope) {
    var cb = function() {
      fn.call(cb_scope || null, data, cb_data || {});
      cb = null
    };
    if(w.setImmediate) {
      w.setImmediate(cb)
    }else {
      if(w["msSetImmediate"]) {
        w["msSetImmediate"](cb)
      }else {
        if(w["webkitSetImmediate"]) {
          w["webkitSetImmediate"](cb)
        }else {
          if(w["mozSetImmediate"]) {
            w["mozSetImmediate"](cb)
          }else {
            setTimeout(cb, 10)
          }
        }
      }
    }
  }, subscribe:function(e_name, fn, cb_data, cb_scope) {
    var i, h, e, unload_handler;
    if(!impl.events.hasOwnProperty(e_name)) {
      return BOOMR
    }
    e = impl.events[e_name];
    for(i = 0;i < e.length;i++) {
      h = e[i];
      if(h[0] === fn && (h[1] === cb_data && h[2] === cb_scope)) {
        return BOOMR
      }
    }
    e.push([fn, cb_data || {}, cb_scope || null]);
    if(e_name === "page_ready" && impl.onloadfired) {
      BOOMR.setImmediate(fn, null, cb_data, cb_scope)
    }
    if(e_name === "page_unload") {
      unload_handler = function(ev) {
        if(fn) {
          fn.call(cb_scope, ev || w.event, cb_data)
        }
      };
      if(w["onpagehide"] || w["onpagehide"] === null) {
        boomr.utils.addListener(w, "pagehide", unload_handler)
      }else {
        boomr.utils.addListener(w, "unload", unload_handler)
      }
      boomr.utils.addListener(w, "beforeunload", unload_handler)
    }
    return BOOMR
  }, addVar:function(name, value) {
    if(typeof name === "string") {
      impl.vars[name] = value
    }else {
      if(typeof name === "object") {
        var o = name, l;
        for(l in o) {
          if(o.hasOwnProperty(l)) {
            impl.vars[l] = o[l]
          }
        }
      }
    }
    return BOOMR
  }, removeVar:function(arg0) {
    var i, params;
    if(!arguments.length) {
      return BOOMR
    }
    if(arguments.length === 1 && Object.prototype.toString.apply(arg0) === "[object Array]") {
      params = arg0
    }else {
      params = arguments
    }
    for(i = 0;i < params.length;i++) {
      if(impl.vars["hasOwnProperty"](params[i])) {
        delete impl.vars[params[i]]
      }
    }
    return BOOMR
  }, getVars:function() {
    return impl.vars
  }, getVar:function(name) {
    return impl.vars[name]
  }, removeStats:function() {
    impl.vars = {};
    BOOMR.plugins.RT.clearTimers();
    return BOOMR
  }, sendBeacon:function() {
    var l, url, img, nparams = 0;
    for(l in BOOMR.plugins) {
      if(BOOMR.plugins.hasOwnProperty(l)) {
        if(impl.disabled_plugins[l]) {
          continue
        }
        if(!BOOMR.plugins[l].is_complete()) {
          return BOOMR
        }
      }
    }
    impl.vars["v"] = BOOMR.version;
    impl.vars["u"] = d.URL.replace(/#.*/, "");
    if(w !== window) {
      impl.vars["if"] = ""
    }
    impl.fireEvent("before_beacon", impl.vars);
    if(!impl.beacon_url) {
      return BOOMR
    }
    url = [];
    for(l in impl.vars) {
      if(impl.vars["hasOwnProperty"](l)) {
        nparams++;
        url.push(encodeURIComponent(l) + "=" + (impl.vars[l] === undefined || impl.vars[l] === null ? "" : encodeURIComponent(impl.vars[l] + "")))
      }
    }
    url = impl.beacon_url + (impl.beacon_url.indexOf("?") > -1 ? "&" : "?") + url.join("&");
    BOOMR.debug("Sending url: " + url.replace(/&/g, "\n\t"));
    if(nparams) {
      img = new Image;
      img.src = url
    }
    return BOOMR
  }, setBeaconUrl:function(url) {
    impl["beacon_url"] = url
  }};
  if(typeof perfOptions["BOOMR_lstart"] === "number") {
    boomr.t_lstart = perfOptions["BOOMR_lstart"]
  }else {
    boomr.t_lstart = 0
  }
  delete perfOptions["BOOMR_lstart"];
  (function() {
    function make_logger(l) {
      return function(m, s) {
        BOOMR.log(m, l, "boomerang" + (s ? "." + s : ""));
        return BOOMR
      }
    }
    boomr.debug = make_logger("debug");
    boomr.info = make_logger("info");
    boomr.warn = make_logger("warn");
    boomr.error = make_logger("error")
  })();
  if(w.YAHOO && (w.YAHOO.widget && w.YAHOO.widget.Logger)) {
    boomr.log = w.YAHOO.log
  }else {
    if(w.Y && w.Y.log) {
      boomr.log = w.Y.log
    }else {
      if(typeof w.console === "object" && w.console.log !== undefined) {
        boomr.log = function(m, l, s) {
          w.console.log(s + ": [" + l + "] " + m)
        }
      }
    }
  }
  for(k in boomr) {
    if(boomr.hasOwnProperty(k)) {
      BOOMR[k] = boomr[k]
    }
  }
  BOOMR.plugins = BOOMR.plugins || {}
}
run(window);
function runrt(w) {
  var d = w.document;
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {initialized:false, onloadfired:false, visiblefired:false, complete:false, timers:{}, cookie:"RT", cookie_exp:1800, strict_referrer:false, navigationType:0, navigationStart:undefined, responseStart:undefined, sessionID:Math.floor(Math.random() * 4294967296).toString(36), sessionStart:undefined, sessionLength:0, t_start:undefined, t_fb_approx:undefined, r:undefined, r2:undefined, setCookie:function(how, url) {
    var t_end, t_start, subcookies;
    if(!impl.cookie) {
      return impl
    }
    subcookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie)) || {};
    if(how === "ul") {
      subcookies.r = d.URL.replace(/#.*/, "")
    }
    if(how === "cl") {
      if(url) {
        subcookies.nu = url
      }else {
        if(subcookies.nu) {
          delete subcookies.nu
        }
      }
    }
    if(url === false) {
      delete subcookies.nu
    }
    t_start = (new Date).getTime();
    if(how) {
      subcookies[how] = t_start
    }
    BOOMR.debug("Setting cookie " + BOOMR.utils.objectToString(subcookies), "rt");
    if(!BOOMR.utils.setCookie(impl.cookie, subcookies, impl.cookie_exp)) {
      BOOMR.error("cannot set start cookie", "rt");
      return impl
    }
    t_end = (new Date).getTime();
    if(t_end - t_start > 50) {
      BOOMR.utils.removeCookie(impl.cookie);
      BOOMR.error("took more than 50ms to set cookie... aborting: " + t_start + " -> " + t_end, "rt")
    }
    return impl
  }, initFromCookie:function() {
    var subcookies;
    if(!impl.cookie) {
      return
    }
    subcookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie));
    if(!subcookies) {
      return
    }
    subcookies["s"] = Math.max(+subcookies["ul"] || 0, +subcookies["cl"] || 0);
    BOOMR.debug("Read from cookie " + BOOMR.utils.objectToString(subcookies), "rt");
    if(subcookies["s"] && subcookies["r"]) {
      impl.r = subcookies["r"];
      BOOMR.debug(impl.r + " =?= " + impl.r2, "rt");
      BOOMR.debug(subcookies["s"] + " <? " + (+subcookies["cl"] + 15), "rt");
      BOOMR.debug(subcookies["nu"] + " =?= " + d.URL.replace(/#.*/, ""), "rt");
      if(!impl.strict_referrer || (impl.r === impl.r2 || subcookies["s"] < +subcookies["cl"] + 15 && subcookies["nu"] === d.URL.replace(/#.*/, ""))) {
        impl.t_start = subcookies["s"];
        if(+subcookies["hd"] > subcookies["s"]) {
          impl.t_fb_approx = parseInt(subcookies["hd"], 10)
        }
      }else {
        impl.t_start = impl.t_fb_approx = undefined
      }
    }
    if(subcookies.sid) {
      impl.sessionID = subcookies.sid
    }
    if(subcookies.ss) {
      impl.sessionStart = parseInt(subcookies.ss, 10)
    }
    if(subcookies.sl) {
      impl.sessionLength = parseInt(subcookies.sl, 10)
    }
  }, checkPreRender:function() {
    if(!(d["webkitVisibilityState"] && d["webkitVisibilityState"] === "prerender") && !(d["msVisibilityState"] && d["msVisibilityState"] === 3)) {
      return false
    }
    BOOMR.plugins.RT.startTimer("t_load", impl.navigationStart);
    BOOMR.plugins.RT.endTimer("t_load");
    BOOMR.plugins.RT.startTimer("t_prerender", impl.navigationStart);
    BOOMR.plugins.RT.startTimer("t_postrender");
    BOOMR.subscribe("visibility_changed", BOOMR.plugins.RT.done, null, BOOMR.plugins.RT);
    return true
  }, initNavTiming:function() {
    var ti, p, source;
    if(impl.navigationStart) {
      return
    }
    p = w.performance || (w["msPerformance"] || (w["webkitPerformance"] || w["mozPerformance"]));
    if(p && p.navigation) {
      impl.navigationType = p.navigation.type
    }
    if(p && p.timing) {
      ti = p.timing
    }else {
      if(w.chrome && (w.chrome.csi && w.chrome.csi().startE)) {
        ti = {navigationStart:w.chrome.csi().startE};
        source = "csi"
      }else {
        if(w.gtbExternal && w.gtbExternal.startE()) {
          ti = {navigationStart:w.gtbExternal.startE()};
          source = "gtb"
        }
      }
    }
    if(ti) {
      BOOMR.addVar("rt.start", source || "navigation");
      impl.navigationStart = ti.navigationStart || (ti.fetchStart || undefined);
      impl.responseStart = ti.responseStart || undefined;
      if(navigator.userAgent.match(/Firefox\/[78]\./)) {
        impl.navigationStart = ti.unloadEventStart || (ti.fetchStart || undefined)
      }
    }else {
      BOOMR.warn("This browser doesn't support the WebTiming API", "rt")
    }
    return
  }, page_unload:function(edata) {
    BOOMR.debug("Unload called with " + BOOMR.utils.objectToString(edata), "rt");
    impl.setCookie(edata.type === "beforeunload" ? "ul" : "hd")
  }, onclick:function(etarget) {
    if(!etarget) {
      return
    }
    BOOMR.debug("Click called with " + etarget.nodeName, "rt");
    while(etarget && etarget.nodeName.toUpperCase() !== "A") {
      etarget = etarget.parentNode
    }
    if(etarget && etarget.nodeName.toUpperCase() === "A") {
      BOOMR.debug("passing through", "rt");
      impl.setCookie("cl", etarget.href)
    }
  }, domloaded:function() {
    BOOMR.plugins.RT.endTimer("t_domloaded")
  }, onLoad:function() {
    BOOMR.plugins.RT.endTimer("t_onLoad")
  }};
  var rt = BOOMR.plugins.RT = {init:function(config) {
    BOOMR.debug("init RT", "rt");
    if(w !== BOOMR.window) {
      w = BOOMR.window;
      d = w.document
    }
    BOOMR.utils.pluginConfig(impl, config, "RT", ["cookie", "cookie_exp", "strict_referrer"]);
    impl.initFromCookie();
    if(impl.initialized) {
      return rt
    }
    impl.complete = false;
    impl.timers = {};
    BOOMR.subscribe("page_ready", rt.done, null, rt);
    BOOMR.subscribe("dom_loaded", impl.domloaded, null, impl);
    BOOMR.subscribe("page_unload", impl.page_unload, null, impl);
    BOOMR.subscribe("click", impl.onclick, null, impl);
    BOOMR.subscribe("onLoad", impl.onLoad, null, impl);
    if(BOOMR.t_start) {
      rt.startTimer("boomerang", BOOMR.t_start);
      rt.endTimer("boomerang", BOOMR.t_end);
      rt.endTimer("boomr_fb", BOOMR.t_start);
      if(BOOMR.t_lstart) {
        rt.endTimer("kylie_ld", BOOMR.t_lstart);
        rt.setTimer("kylie_lat", BOOMR.t_start - BOOMR.t_lstart, BOOMR.t_lstart)
      }
    }
    impl.r = impl.r2 = d.referrer.replace(/#.*/, "");
    if(!impl.sessionStart) {
      impl.sessionStart = BOOMR.t_lstart || BOOMR.t_start
    }
    impl.initialized = true;
    return rt
  }, startTimer:function(timer_name, time_value) {
    if(timer_name) {
      if(timer_name === "t_page") {
        rt.endTimer("t_resp", time_value)
      }
      impl.timers[timer_name] = {start:typeof time_value === "number" ? time_value : (new Date).getTime()};
      impl.complete = false
    }
    return rt
  }, endTimer:function(timer_name, time_value) {
    if(timer_name) {
      impl.timers[timer_name] = impl.timers[timer_name] || {};
      if(impl.timers[timer_name].end === undefined) {
        impl.timers[timer_name].end = typeof time_value === "number" ? time_value : (new Date).getTime()
      }
    }
    return rt
  }, setTimer:function(timer_name, time_delta, time_start) {
    if(timer_name) {
      impl.timers[timer_name] = {delta:time_delta, start:time_start}
    }
    return rt
  }, updateTimer:function(old_timer, new_timer) {
    if(old_timer) {
      impl.timers[new_timer] = impl.timers[old_timer];
      impl.timers[old_timer] = {}
    }
  }, clearTimers:function() {
    impl.timers = {};
    return rt
  }, updateVars:function() {
    if(impl.timers) {
      var timer, t_name;
      for(t_name in impl.timers) {
        if(impl.timers.hasOwnProperty(t_name)) {
          timer = impl.timers[t_name];
          if(timer.end && timer.start) {
            if(typeof timer.delta !== "number") {
              timer.delta = timer.end - timer.start
            }
            BOOMR.addVar(t_name, timer.delta)
          }
        }
      }
    }
  }, getTimers:function() {
    return impl.timers
  }, startTransaction:function(tName) {
    return BOOMR.plugins.RT.startTimer("txn_" + tName, (new Date).getTime())
  }, endTransaction:function(tName) {
    return BOOMR.plugins.RT.endTimer("txn_" + tName, (new Date).getTime())
  }, getSessionID:function() {
    return impl.sessionID
  }, getSessionStart:function() {
    return impl.sessionStart
  }, isOnLoadFired:function() {
    return impl.onloadfired
  }, done:function() {
    BOOMR.debug("Called done", "rt");
    var t_start, t_done = (new Date).getTime(), ntimers = 0, t_name, timer, t_other = [];
    impl.complete = false;
    impl.initFromCookie();
    impl.initNavTiming();
    if(impl.checkPreRender()) {
      return rt
    }
    if(impl.responseStart) {
      rt.endTimer("t_resp", impl.responseStart);
      if(impl.timers["t_load"]) {
        rt.setTimer("t_page", impl.timers["t_load"].end - impl.responseStart, impl.responseStart)
      }else {
        var delta = t_done - impl.responseStart;
        if(delta > 0) {
          rt.setTimer("t_page", delta, impl.responseStart)
        }
      }
    }else {
      if(impl.timers.hasOwnProperty("t_page")) {
        rt.endTimer("t_page")
      }else {
        if(impl.t_fb_approx) {
          rt.endTimer("t_resp", impl.t_fb_approx);
          rt.setTimer("t_page", t_done - impl.t_fb_approx)
        }
      }
    }
    if(impl.timers.hasOwnProperty("t_postrender")) {
      rt.endTimer("t_postrender");
      rt.endTimer("t_prerender")
    }
    if(impl.navigationStart) {
      t_start = impl.navigationStart
    }else {
      if(impl.t_start && impl.navigationType !== 2) {
        t_start = impl.t_start;
        BOOMR.addVar("rt.start", "cookie")
      }else {
        BOOMR.addVar("rt.start", "none");
        t_start = undefined
      }
    }
    if(t_start && impl.sessionStart > t_start) {
      impl.sessionStart = BOOMR.t_lstart || BOOMR.t_start;
      impl.sessionLength = 0
    }
    rt.endTimer("t_done", t_done);
    BOOMR.removeVar("t_done", "t_page", "t_resp", "r", "r2", "rt.tstart", "rt.bstart", "rt.end", "rt.ss", "rt.sl", "rt.lt", "t_postrender", "t_prerender", "t_load");
    BOOMR.addVar("rt.tstart", t_start);
    BOOMR.addVar("rt.bstart", BOOMR.t_start);
    BOOMR.addVar("rt.end", impl.timers["t_done"].end);
    if(impl.timers["t_configfb"]) {
      if("t_configfb" in impl.timers && typeof impl.timers["t_configfb"].start != "number" || isNaN(impl.timers["t_configfb"].start)) {
        if("t_configjs" in impl.timers && typeof impl.timers["t_configjs"].start == "number") {
          impl.timers["t_configfb"].start = impl.timers["t_configjs"].start
        }else {
          delete impl.timers["t_configfb"]
        }
      }
    }
    for(t_name in impl.timers) {
      if(impl.timers.hasOwnProperty(t_name)) {
        timer = impl.timers[t_name];
        if(typeof timer.delta !== "number") {
          if(typeof timer.start !== "number") {
            timer.start = t_start
          }
          timer.delta = timer.end - timer.start
        }
        if(isNaN(timer.delta)) {
          continue
        }
        BOOMR.addVar(t_name, timer.delta);
        ntimers++
      }
    }
    if(ntimers) {
      BOOMR.addVar("r", impl.r);
      if(impl.r2 !== impl.r) {
        BOOMR.addVar("r2", impl.r2)
      }
      if(t_other.length) {
        BOOMR.addVar("t_other", t_other.join(","))
      }
    }
    BOOMR.addVar({"rt.sid":impl.sessionID, "rt.ss":impl.sessionStart, "rt.sl":impl.sessionLength});
    impl.timers = {};
    impl.complete = true;
    BOOMR.sendBeacon();
    return rt
  }, is_complete:function() {
    return impl.complete
  }}
}
runrt(window);
function memoryrun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {complete:false, done:function() {
    var w = BOOMR.window, p = w.performance, c = w.console, d = w.document, fn = {}.toString.call(w.opera) === "[object Opera]" ? d.querySelectorAll : d.getElementsByTagName, m, f;
    f = fn.call === undefined ? function(tag) {
      return fn(tag)
    } : fn;
    m = p && p.memory ? p.memory : c && c.memory ? c.memory : null;
    if(m) {
      BOOMR.addVar({"mem.total":m.totalJSHeapSize, "mem.used":m.usedJSHeapSize})
    }
    BOOMR.addVar({"dom.ln":f.call(d, "*").length, "dom.sz":f.call(d, "html")[0].innerHTML.length, "dom.img":f.call(d, "img").length, "dom.script":f.call(d, "script").length});
    impl.complete = true;
    BOOMR.sendBeacon()
  }};
  var memory = BOOMR.plugins.Memory = {init:function() {
    BOOMR.subscribe("page_ready", impl.done, null, impl);
    return memory
  }, is_complete:function() {
    return impl.complete
  }}
}
memoryrun();
function navtimingrun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {complete:false, done:function() {
    var w = BOOMR.window, p, pn, pt;
    var data;
    p = w.performance || (w["msPerformance"] || (w["webkitPerformance"] || w["mozPerformance"]));
    if(p && (p.timing && p.navigation)) {
      BOOMR.info("This user agent supports NavigationTiming.", "nt");
      pn = p.navigation;
      pt = p.timing;
      data = {"nt_red_cnt":pn.redirectCount, "nt_nav_type":pn.type, "nt_nav_st":pt.navigationStart, "nt_red_st":pt.redirectStart, "nt_red_end":pt.redirectEnd, "nt_fet_st":pt.fetchStart, "nt_dns_st":pt.domainLookupStart, "nt_dns_end":pt.domainLookupEnd, "nt_con_st":pt.connectStart, "nt_con_end":pt.connectEnd, "nt_req_st":pt.requestStart, "nt_res_st":pt.responseStart, "nt_res_end":pt.responseEnd, "nt_domloading":pt.domLoading, "nt_domint":pt.domInteractive, "nt_domcontloaded_st":pt.domContentLoadedEventStart, 
      "nt_domcontloaded_end":pt.domContentLoadedEventEnd, "nt_domcomp":pt.domComplete, "nt_load_st":pt.loadEventStart, "nt_load_end":pt.loadEventEnd, "nt_unload_st":pt.unloadEventStart, "nt_unload_end":pt.unloadEventEnd};
      if(pt.secureConnectionStart) {
        data["nt_ssl_st"] = pt.secureConnectionStart
      }
      if(pt.msFirstPaint) {
        data["nt_first_paint"] = pt.msFirstPaint
      }
      BOOMR.addVar(data)
    }
    if(w["chrome"] && w["chrome"].loadTimes) {
      pt = w["chrome"].loadTimes();
      if(pt) {
        data = {"nt_spdy":pt.wasFetchedViaSpdy ? 1 : 0, "nt_first_paint":pt.firstPaintTime};
        BOOMR.addVar(data)
      }
    }
    impl.complete = true;
    BOOMR.sendBeacon()
  }};
  var nt = BOOMR.plugins.NavigationTiming = {init:function() {
    BOOMR.subscribe("page_ready", impl.done, null, impl);
    return nt
  }, is_complete:function() {
    return impl.complete
  }}
}
navtimingrun();
BOOMR.addVar("mob.ct", typeof navigator === "object" && navigator["connection"] ? navigator["connection"]["type"] : 0);
function kylierun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {doc:BOOMR.window.document, script:"script", complete:false, pass:false, start_ts:undefined, done:function() {
    if(!impl.complete) {
      impl.complete = true;
      impl.pass = false;
      BOOMR.sendBeacon()
    }
  }, run:function() {
    var k = impl.doc.getElementsByTagName(impl.script)[0], d = impl.doc.createElement(impl.script);
    impl.start_ts = (new Date).getTime();
    d.src = BOOMR.window["BOOMR_cURL"];
    k.parentNode.insertBefore(d, k)
  }};
  var kylie = BOOMR.plugins.Kylie = {init:function() {
    if(impl.complete) {
      return kylie
    }
    if(impl.pass) {
      setTimeout(impl.done, 10);
      BOOMR.addVar("t_cjs", (new Date).getTime() - impl.start_ts);
      if(perfOptions["BOOMR_configt"]) {
        BOOMR.addVar("t_cfb", perfOptions["BOOMR_configt"] - impl.start_ts);
        delete perfOptions["BOOMR_configt"]
      }
      return null
    }
    impl.pass = true;
    BOOMR.subscribe("page_ready", impl.run, null, null);
    return kylie
  }, is_complete:function() {
    return impl.complete
  }}
}
kylierun();
BOOMR.init({log:null, wait:true, Kylie:{enabled:false}, autorun:false});
BOOMR.t_end = (new Date).getTime();
var PerfLogLevel = {DEBUG:{name:"DEBUG", value:1}, INTERNAL:{name:"INTERNAL", value:2}, PRODUCTION:{name:"PRODUCTION", value:3}};
var PerfConstants = {PAGE_START_MARK:"PageStart", PERF_PAYLOAD_PARAM:"bulkPerf", MARK_NAME:"mark", MEASURE_NAME:"measure", MARK_START_TIME:"st", MARK_LAST_TIME:"lt", PAGE_NAME:"pn", ELAPSED_TIME:"et", REFERENCE_TIME:"rt", Perf_LOAD_DONE:"loadDone"};
PerfConstants.STATS = {NAME:"stat", SERVER_ELAPSED:"internal_serverelapsed", DB_TOTAL_TIME:"internal_serverdbtotaltime", DB_CALLS:"internal_serverdbcalls", DB_FETCHES:"internal_serverdbfetches"};
window["PerfConstants"] = PerfConstants;
window["PerfLogLevel"] = PerfLogLevel;
window.typePerfLogLevel;
window.typejsonMeasure;
function IPerf() {
}
IPerf.prototype.mark;
IPerf.prototype.endMark;
IPerf.prototype.updateMarkName;
IPerf.prototype.measureToJson;
IPerf.prototype.toJson;
IPerf.prototype.setTimer;
IPerf.prototype.toPostVar;
IPerf.prototype.getMeasures;
IPerf.prototype.getBeaconData;
IPerf.prototype.setBeaconData;
IPerf.prototype.clearBeaconData;
IPerf.prototype.removeStats;
IPerf.prototype.stat;
IPerf.prototype.getStat;
IPerf.prototype.onLoad;
IPerf.prototype.startTransaction;
IPerf.prototype.endTransaction;
IPerf.prototype.updateTransaction;
IPerf.prototype.enabled;
function IPerf_util() {
}
IPerf.prototype.utils;
IPerf_util.prototype.setCookie;
var perfOptions = window["perfOptions"];
if(perfOptions) {
  if(!perfOptions.pageStartTime) {
    perfOptions.pageStartTime = (new Date).getTime()
  }
  if(perfOptions.bURL) {
    BOOMR.setBeaconUrl(perfOptions.bURL)
  }
}else {
  perfOptions = {pageStartTime:(new Date).getTime()}
}
var BEACONURL = "";
var _beaconData = null;
function getLogLevel(logLevel) {
  if(typeof logLevel === "string") {
    logLevel = PerfLogLevel[logLevel]
  }
  return logLevel || PerfLogLevel.INTERNAL
}
function updateTimerName(oldName, newName) {
  BOOMR.plugins.RT.updateTimer(oldName, newName);
  return Perf
}
var Perf = ({currentLogLevel:getLogLevel(perfOptions.logLevel), startTime:perfOptions.pageStartTime, mark:function(id, logLevel) {
  if(Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    BOOMR.plugins.RT.startTimer(id)
  }
  return Perf
}, endMark:function(id, logLevel) {
  if(Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    BOOMR.plugins.RT.endTimer(id)
  }
  return Perf
}, updateMarkName:updateTimerName, setTimer:function(timer_name, timer_delta, logLevel) {
  if(Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    if(timer_delta >= 0) {
      BOOMR.plugins.RT.setTimer(timer_name, timer_delta)
    }else {
      BOOMR.plugins.RT.endTimer(timer_name)
    }
  }
  return Perf
}, measureToJson:function(measure) {
  return"{" + PerfConstants.MEASURE_NAME + ':"' + measure[PerfConstants.MEASURE_NAME] + '",' + PerfConstants.MARK_NAME + ':"' + measure[PerfConstants.MARK_NAME] + '",' + PerfConstants.ELAPSED_TIME + ":" + measure[PerfConstants.ELAPSED_TIME] + "," + PerfConstants.REFERENCE_TIME + ":" + measure[PerfConstants.REFERENCE_TIME] + "}"
}, toJson:function(includeMarks) {
  BOOMR.plugins.RT.updateVars();
  var timers = BOOMR.plugins.RT.getTimers(), rt = BOOMR.plugins.RT.getSessionStart(), json = ["{", 'sessionID:"', BOOMR.plugins.RT.getSessionID(), '",', "st:", rt, ",", 'pn:"', window.document.URL, '",', 'uid:"', Math.round(Math.random() * 1E15), '",'], markJson = [], measureJson = [], k, measure, vars = BOOMR.getVars(), timer;
  for(k in vars) {
    if(k != "r" && (k != "r2" && k != "t_other")) {
      if(vars.hasOwnProperty(k) && !isNaN(vars[k])) {
        if(includeMarks) {
          markJson.push('"' + k + '":' + vars[k])
        }
        measure = {};
        measure[PerfConstants.MEASURE_NAME] = k;
        measure[PerfConstants.MARK_NAME] = k;
        measure[PerfConstants.ELAPSED_TIME] = vars[k];
        timer = timers[k];
        measure[PerfConstants.REFERENCE_TIME] = timer && timer.start ? timer.start : rt;
        measureJson.push(Perf.measureToJson(measure))
      }
    }
  }
  if(includeMarks) {
    json.push("marks:{", markJson.join(","), "},")
  }
  json.push("measures:[", measureJson.join(","), "]}");
  return json.join("")
}, toPostVar:function() {
  return PerfConstants.PERF_PAYLOAD_PARAM + "=" + Perf.toJson().replace(/&/g, "__^__")
}, getMeasures:function() {
  BOOMR.plugins.RT.updateVars();
  var timers = BOOMR.plugins.RT.getTimers(), rt = BOOMR.plugins.RT.getSessionStart(), measures = [], vars = BOOMR.getVars(), k, measure;
  for(k in vars) {
    if(k != "r" && (k != "r2" && k != "t_other")) {
      if(vars.hasOwnProperty(k) && !isNaN(vars[k])) {
        measure = {};
        measure[PerfConstants.MEASURE_NAME] = k;
        measure[PerfConstants.MARK_NAME] = k;
        measure[PerfConstants.ELAPSED_TIME] = vars[k];
        measure[PerfConstants.REFERENCE_TIME] = timers[k] ? timers[k].start : rt;
        measures.push(measure)
      }
    }
  }
  return measures
}, getBeaconData:function() {
  return _beaconData
}, setBeaconData:function(beaconData) {
  _beaconData = beaconData
}, clearBeaconData:function() {
  _beaconData = null
}, removeStats:BOOMR.removeStats, subscribe:BOOMR.subscribe, stat:function(label, elapsedMillis) {
  BOOMR.addVar("st_" + label, elapsedMillis);
  return Perf
}, getStat:function(label) {
  BOOMR.plugins.RT.updateVars();
  if(!label) {
    return-1
  }
  return BOOMR.getVar(label)
}, onLoad:BOOMR.page_ready, startTransaction:function(tName) {
  BOOMR.plugins.RT.startTransaction(tName);
  return Perf
}, endTransaction:function(tName) {
  BOOMR.plugins.RT.endTransaction(tName);
  return Perf
}, updateTransaction:updateTimerName, onLoadFired:BOOMR.plugins.RT.onLoadFired, util:{setCookie:function(name, value, expires, path) {
  document.cookie = name + "=" + escape(value + "") + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "; path=/")
}}, enabled:true});
var ROOT_NAMESPACE = "Kylie";
window["Perf"] = Perf;
window[ROOT_NAMESPACE] = Perf;
window["PerfLogLevel"] = PerfLogLevel;
window["PerfConstants"] = PerfConstants;
})(this);
