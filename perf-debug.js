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
  var k;
  var d = w.document;
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
    var value = [], k;
    if(!o || typeof o !== "object") {
      return o
    }
    if(separator === undefined) {
      separator = "\n\t"
    }
    for(k in o) {
      if(Object.prototype.hasOwnProperty.call(o, k)) {
        value.push(encodeURIComponent(k) + "=" + encodeURIComponent(o[k]))
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
  }, removeListener:function(el, type, fn) {
    if(el.removeEventListener) {
      el.removeEventListener(type, fn, false)
    }else {
      el.detachEvent("on" + type, fn)
    }
  }}, init:function(config) {
    var i, k, properties = ["beacon_url", "site_domain", "user_ip"];
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
      BOOMR.log = function() {
      }
    }
    for(k in BOOMR.plugins) {
      if(BOOMR.plugins.hasOwnProperty(k)) {
        if(config[k] && (config[k].hasOwnProperty("enabled") && config[k].enabled === false)) {
          impl.disabled_plugins[k] = 1;
          continue
        }else {
          if(impl.disabled_plugins[k]) {
            delete impl.disabled_plugins[k]
          }
        }
        if(typeof BOOMR.plugins[k].init === "function") {
          BOOMR.plugins[k].init(config)
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
      if(d.webkitVisibilityState) {
        boomr.utils.addListener(d, "webkitvisibilitychange", fire_visible)
      }else {
        if(d.msVisibilityState) {
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
      if(w.msSetImmediate) {
        w.msSetImmediate(cb)
      }else {
        if(w.webkitSetImmediate) {
          w.webkitSetImmediate(cb)
        }else {
          if(w.mozSetImmediate) {
            w.mozSetImmediate(cb)
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
        var o = name, k;
        for(k in o) {
          if(o.hasOwnProperty(k)) {
            impl.vars[k] = o[k]
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
    BOOMR.plugins["RT"]["clearTimers"]();
    return BOOMR
  }, sendBeacon:function() {
    var k, url, img, nparams = 0;
    for(k in BOOMR.plugins) {
      if(BOOMR.plugins.hasOwnProperty(k)) {
        if(impl.disabled_plugins[k]) {
          continue
        }
        if(!BOOMR.plugins[k].is_complete()) {
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
    for(k in impl.vars) {
      if(impl.vars["hasOwnProperty"](k)) {
        nparams++;
        url.push(encodeURIComponent(k) + "=" + (impl.vars[k] === undefined || impl.vars[k] === null ? "" : encodeURIComponent(impl.vars[k] + "")))
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
    boomr.t_lstart = perfOptions["BOOMR_lstart"];
    delete perfOptions["BOOMR_lstart"]
  }else {
    boomr.t_lstart = 0
  }
  (function() {
    var make_logger = function(l) {
      return function(m, s) {
        BOOMR.log(m, l, "boomerang" + (s ? "." + s : ""));
        return BOOMR
      }
    };
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
    if(!(d.webkitVisibilityState && d.webkitVisibilityState === "prerender") && !(d.msVisibilityState && d.msVisibilityState === 3)) {
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
  }, onLoadFired:function() {
    return impl.onloadfired
  }, done:function() {
    BOOMR.debug("Called done", "rt");
    var t_start, t_done = (new Date).getTime(), basic_timers = {"t_done":1, "t_resp":1, "t_page":1, "t_domloaded":1, "t_onLoad":1, "PageStart":1, "pagePerceived":1}, ntimers = 0, t_name, timer, t_other = [];
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
function bwrun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var images = [{name:"image-0.png", size:11483, timeout:1400}, {name:"image-1.png", size:40658, timeout:1200}, {name:"image-2.png", size:164897, timeout:1300}, {name:"image-3.png", size:381756, timeout:1500}, {name:"image-4.png", size:1234664, timeout:1200}, {name:"image-5.png", size:4509613, timeout:1200}, {name:"image-6.png", size:9084559, timeout:1200}];
  images.end = images.length;
  images.start = 0;
  images.l = {name:"image-l.gif", size:35, timeout:1E3};
  var impl = {base_url:"", timeout:15E3, nruns:5, latency_runs:10, user_ip:"", cookie_exp:7 * 86400, cookie:"BA", results:[], latencies:[], latency:null, runs_left:0, aborted:false, complete:true, running:false, initialized:false, ncmp:function(a, b) {
    return a - b
  }, iqr:function(a) {
    var l = a.length - 1, q1, q3, fw, b = [], i;
    q1 = (a[Math.floor(l * 0.25)] + a[Math.ceil(l * 0.25)]) / 2;
    q3 = (a[Math.floor(l * 0.75)] + a[Math.ceil(l * 0.75)]) / 2;
    fw = (q3 - q1) * 1.5;
    l++;
    for(i = 0;i < l && a[i] < q3 + fw;i++) {
      if(a[i] > q1 - fw) {
        b.push(a[i])
      }
    }
    return b
  }, calc_latency:function() {
    var i, n, sum = 0, sumsq = 0, amean, median, std_dev, std_err, lat_filtered, first;
    first = impl.latencies.shift();
    lat_filtered = impl.iqr(impl.latencies.sort(impl.ncmp));
    n = lat_filtered.length;
    BOOMR.debug(lat_filtered, "bw");
    for(i = 0;i < n;i++) {
      sum += lat_filtered[i];
      sumsq += lat_filtered[i] * lat_filtered[i]
    }
    amean = Math.round(sum / n);
    std_dev = Math.sqrt(sumsq / n - sum * sum / (n * n));
    std_err = (1.96 * std_dev / Math.sqrt(n)).toFixed(2);
    std_dev = std_dev.toFixed(2);
    median = Math.round((lat_filtered[Math.floor(n / 2)] + lat_filtered[Math.ceil(n / 2)]) / 2);
    return{mean:amean, median:median, stddev:std_dev, stderr:std_err}
  }, calc_bw:function() {
    var i, j, n = 0, r, bandwidths = [], bandwidths_corrected = [], sum = 0, sumsq = 0, sum_corrected = 0, sumsq_corrected = 0, amean, std_dev, std_err, median, amean_corrected, std_dev_corrected, std_err_corrected, median_corrected, nimgs, bw, bw_c, debug_info = [];
    for(i = 0;i < impl.nruns;i++) {
      if(!impl.results[i] || !impl.results[i].r) {
        continue
      }
      r = impl.results[i].r;
      nimgs = 0;
      for(j = r.length - 1;j >= 0 && nimgs < 3;j--) {
        if(!r[j]) {
          break
        }
        if(r[j].t === null) {
          continue
        }
        n++;
        nimgs++;
        bw = images[j].size * 1E3 / r[j].t;
        bandwidths.push(bw);
        bw_c = images[j].size * 1E3 / (r[j].t - impl.latency.mean);
        bandwidths_corrected.push(bw_c);
        if(r[j].t < impl.latency.mean) {
          debug_info.push(j + "_" + r[j].t)
        }
      }
    }
    BOOMR.debug("got " + n + " readings", "bw");
    BOOMR.debug("bandwidths: " + bandwidths, "bw");
    BOOMR.debug("corrected: " + bandwidths_corrected, "bw");
    if(bandwidths.length > 3) {
      bandwidths = impl.iqr(bandwidths.sort(impl.ncmp));
      bandwidths_corrected = impl.iqr(bandwidths_corrected.sort(impl.ncmp))
    }else {
      bandwidths = bandwidths.sort(impl.ncmp);
      bandwidths_corrected = bandwidths_corrected.sort(impl.ncmp)
    }
    BOOMR.debug("after iqr: " + bandwidths, "bw");
    BOOMR.debug("corrected: " + bandwidths_corrected, "bw");
    n = Math.max(bandwidths.length, bandwidths_corrected.length);
    for(i = 0;i < n;i++) {
      if(i < bandwidths.length) {
        sum += bandwidths[i];
        sumsq += Math.pow(bandwidths[i], 2)
      }
      if(i < bandwidths_corrected.length) {
        sum_corrected += bandwidths_corrected[i];
        sumsq_corrected += Math.pow(bandwidths_corrected[i], 2)
      }
    }
    n = bandwidths.length;
    amean = Math.round(sum / n);
    std_dev = Math.sqrt(sumsq / n - Math.pow(sum / n, 2));
    std_err = Math.round(1.96 * std_dev / Math.sqrt(n));
    std_dev = Math.round(std_dev);
    n = bandwidths.length - 1;
    median = Math.round((bandwidths[Math.floor(n / 2)] + bandwidths[Math.ceil(n / 2)]) / 2);
    n = bandwidths_corrected.length;
    amean_corrected = Math.round(sum_corrected / n);
    std_dev_corrected = Math.sqrt(sumsq_corrected / n - Math.pow(sum_corrected / n, 2));
    std_err_corrected = (1.96 * std_dev_corrected / Math.sqrt(n)).toFixed(2);
    std_dev_corrected = std_dev_corrected.toFixed(2);
    n = bandwidths_corrected.length - 1;
    median_corrected = Math.round((bandwidths_corrected[Math.floor(n / 2)] + bandwidths_corrected[Math.ceil(n / 2)]) / 2);
    BOOMR.debug("amean: " + amean + ", median: " + median, "bw");
    BOOMR.debug("corrected amean: " + amean_corrected + ", " + "median: " + median_corrected, "bw");
    return{mean:amean, stddev:std_dev, stderr:std_err, median:median, mean_corrected:amean_corrected, stddev_corrected:std_dev_corrected, stderr_corrected:std_err_corrected, median_corrected:median_corrected, debug_info:debug_info}
  }, defer:function(method) {
    var that = impl;
    return setTimeout(function() {
      method.call(that);
      that = null
    }, 10)
  }, load_img:function(i, run, callback) {
    var url = impl.base_url + images[i].name + "?t=" + (new Date).getTime() + Math.random(), timer = 0, tstart = 0, img = new Image, that = impl;
    img.onload = function() {
      img.onload = img.onerror = null;
      img = null;
      clearTimeout(timer);
      if(callback) {
        callback.call(that, i, tstart, run, true)
      }
      that = callback = null
    };
    img.onerror = function() {
      img.onload = img.onerror = null;
      img = null;
      clearTimeout(timer);
      if(callback) {
        callback.call(that, i, tstart, run, false)
      }
      that = callback = null
    };
    timer = setTimeout(function() {
      if(callback) {
        callback.call(that, i, tstart, run, null)
      }
    }, images[i].timeout + Math.min(400, impl.latency ? impl.latency.mean : 400));
    tstart = (new Date).getTime();
    img.src = url
  }, lat_loaded:function(i, tstart, run, success) {
    if(run !== impl.latency_runs + 1) {
      return
    }
    if(success !== null) {
      var lat = (new Date).getTime() - tstart;
      impl.latencies.push(lat)
    }
    if(impl.latency_runs === 0) {
      impl.latency = impl.calc_latency()
    }
    impl.defer(impl.iterate)
  }, img_loaded:function(i, tstart, run, success) {
    if(run !== impl.runs_left + 1) {
      return
    }
    if(impl.results[impl.nruns - run].r[i]) {
      return
    }
    if(success === null) {
      impl.results[impl.nruns - run].r[i + 1] = {t:null, state:null, run:run};
      return
    }
    var result = {start:tstart, end:(new Date).getTime(), t:null, state:success, run:run};
    if(success) {
      result.t = result.end - result.start
    }
    impl.results[impl.nruns - run].r[i] = result;
    if(i >= images.end - 1 || impl.results[impl.nruns - run].r[i + 1] !== undefined) {
      BOOMR.debug(impl.results[impl.nruns - run], "bw");
      if(run === impl.nruns) {
        images.start = i
      }
      impl.defer(impl.iterate)
    }else {
      impl.load_img(i + 1, run, impl.img_loaded)
    }
  }, finish:function() {
    if(!impl.latency) {
      impl.latency = impl.calc_latency()
    }
    var bw = impl.calc_bw(), o = {bw:bw.median_corrected, bw_err:parseFloat(bw.stderr_corrected), lat:impl.latency.mean, lat_err:parseFloat(impl.latency.stderr), bw_time:Math.round((new Date).getTime() / 1E3)};
    BOOMR.addVar(o);
    if(bw.debug_info.length > 0) {
      BOOMR.addVar("bw_debug", bw.debug_info.join(","))
    }
    if(!isNaN(o.bw) && o.bw > 0) {
      BOOMR.utils.setCookie(impl.cookie, {ba:Math.round(o.bw), be:o.bw_err, l:o.lat, le:o.lat_err, ip:impl.user_ip, t:o.bw_time}, impl.user_ip ? impl.cookie_exp : 0)
    }
    impl.complete = true;
    BOOMR.sendBeacon();
    impl.running = false
  }, iterate:function() {
    if(impl.aborted) {
      return false
    }
    if(!impl.runs_left) {
      impl.finish()
    }else {
      if(impl.latency_runs) {
        impl.load_img("l", impl.latency_runs--, impl.lat_loaded)
      }else {
        impl.results.push({r:[]});
        impl.load_img(images.start, impl.runs_left--, impl.img_loaded)
      }
    }
  }, setVarsFromCookie:function(cookies) {
    var ba = parseInt(cookies.ba, 10), bw_e = parseFloat(cookies.be), lat = parseInt(cookies.l, 10) || 0, lat_e = parseFloat(cookies.le) || 0, c_sn = cookies.ip.replace(/\.\d+$/, "0"), t = parseInt(cookies.t, 10), p_sn = impl.user_ip.replace(/\.\d+$/, "0"), t_now = Math.round((new Date).getTime() / 1E3);
    if(c_sn === p_sn && (t >= t_now - impl.cookie_exp && ba > 0)) {
      impl.complete = true;
      BOOMR.addVar({"bw":ba, "lat":lat, "bw_err":bw_e, "lat_err":lat_e});
      return true
    }
    return false
  }};
  var bw = BOOMR.plugins.BW = {init:function(config) {
    var cookies;
    if(impl.initialized) {
      return bw
    }
    BOOMR.utils.pluginConfig(impl, config, "BW", ["base_url", "timeout", "nruns", "cookie", "cookie_exp"]);
    if(config && config.user_ip) {
      impl.user_ip = config.user_ip
    }
    if(!impl.base_url) {
      return bw
    }
    images.start = 0;
    impl.runs_left = impl.nruns;
    impl.latency_runs = 10;
    impl.results = [];
    impl.latencies = [];
    impl.latency = null;
    impl.complete = false;
    impl.aborted = false;
    BOOMR.removeVar("ba", "ba_err", "lat", "lat_err");
    cookies = BOOMR.utils.getSubCookies(BOOMR.utils.getCookie(impl.cookie));
    if(!cookies || (!cookies.ba || !impl.setVarsFromCookie(cookies))) {
      BOOMR.subscribe("page_ready", bw.run, null, bw);
      BOOMR.subscribe("page_unload", bw.skip, null, bw)
    }
    impl.initialized = true;
    return bw
  }, run:function() {
    if(impl.running || impl.complete) {
      return bw
    }
    if(BOOMR.window.location.protocol === "https:") {
      BOOMR.info("HTTPS detected, skipping bandwidth test", "bw");
      impl.complete = true;
      BOOMR.sendBeacon();
      return bw
    }
    impl.running = true;
    setTimeout(bw.abort, impl.timeout);
    impl.defer(impl.iterate);
    return bw
  }, abort:function() {
    impl.aborted = true;
    if(impl.running) {
      impl.finish()
    }
    return bw
  }, skip:function() {
    if(!impl.complete) {
      impl.complete = true;
      BOOMR.sendBeacon()
    }
    return bw
  }, is_complete:function() {
    return impl.complete
  }}
}
bwrun();
function ipv6run() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {complete:false, ipv6_url:"", host_url:"", timeout:1200, timers:{ipv6:{start:null, end:null}, host:{start:null, end:null}}, start:function() {
    impl.load_img("ipv6", "host")
  }, load_img:function(arg0) {
    var img, rnd = "?t=" + (new Date).getTime() + Math.random(), timer = 0, error = null, that = impl, which = Array.prototype.shift.call(arguments), a = arguments;
    if(!which || !impl.timers.hasOwnProperty(which)) {
      impl.done();
      return false
    }
    if(!impl[which + "_url"]) {
      return impl.load_img.apply(impl, a)
    }
    img = new Image;
    img.onload = function() {
      that.timers[which].end = (new Date).getTime();
      clearTimeout(timer);
      img.onload = img.onerror = null;
      img = null;
      that.load_img.apply(that, a);
      that = a = null
    };
    error = function() {
      that.timers[which].supported = false;
      clearTimeout(timer);
      img.onload = img.onerror = null;
      img = null;
      that.done();
      that = a = null
    };
    img.onerror = error;
    timer = setTimeout(error, impl.timeout);
    impl.timers[which].start = (new Date).getTime();
    img.src = impl[which + "_url"] + rnd;
    return true
  }, done:function() {
    if(impl.complete) {
      return
    }
    BOOMR.removeVar("ipv6_latency", "ipv6_lookup");
    if(impl.timers.ipv6.end !== null) {
      BOOMR.addVar("ipv6_latency", impl.timers.ipv6.end - impl.timers.ipv6.start)
    }else {
      BOOMR.addVar("ipv6_latency", "NA")
    }
    if(impl.timers.host.end !== null) {
      BOOMR.addVar("ipv6_lookup", impl.timers.host.end - impl.timers.host.start)
    }else {
      BOOMR.addVar("ipv6_lookup", "NA")
    }
    impl.complete = true;
    BOOMR.sendBeacon()
  }, skip:function() {
    if(!impl.complete) {
      impl.complete = true;
      BOOMR.sendBeacon()
    }
    return impl
  }};
  var ipv6 = BOOMR.plugins.IPv6 = {init:function(config) {
    BOOMR.utils.pluginConfig(impl, config, "IPv6", ["ipv6_url", "host_url", "timeout"]);
    if(!impl.ipv6_url) {
      BOOMR.warn("IPv6.ipv6_url is not set.  Cannot run IPv6 test.", "ipv6");
      impl.complete = true;
      return ipv6
    }
    if(!impl.host_url) {
      BOOMR.warn("IPv6.host_url is not set.  Will skip hostname test.", "ipv6")
    }
    if(BOOMR.window.location.protocol === "https:") {
      impl.complete = true;
      return ipv6
    }
    impl.ipv6_url = impl.ipv6_url.replace(/^https:/, "http:");
    impl.host_url = impl.host_url.replace(/^https:/, "http:");
    BOOMR.subscribe("page_ready", impl.start, null, impl);
    BOOMR.subscribe("page_unload", impl.skip, null, impl);
    return ipv6
  }, is_complete:function() {
    return impl.complete
  }}
}
ipv6run();
function dnsrun() {
  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};
  var impl = {complete:false, base_url:"", t_start:null, t_dns:null, t_http:null, img:null, gen_url:"", start:function() {
    if(impl.gen_url) {
      return
    }
    var random = Math.random().toString(36), cache_bust = (new Date).getTime() + "." + Math.random();
    impl.gen_url = impl.base_url.replace(/\*/, random);
    impl.img = new Image;
    impl.img.onload = impl.A_loaded;
    impl.t_start = (new Date).getTime();
    impl.img.src = impl.gen_url + "image-l.gif?t=" + cache_bust
  }, A_loaded:function() {
    var cache_bust;
    impl.t_dns = (new Date).getTime() - impl.t_start;
    cache_bust = (new Date).getTime() + "." + Math.random();
    impl.img = new Image;
    impl.img.onload = impl.B_loaded;
    impl.t_start = (new Date).getTime();
    impl.img.src = impl.gen_url + "image-l.gif?t=" + cache_bust
  }, B_loaded:function() {
    impl.t_http = (new Date).getTime() - impl.t_start;
    impl.img = null;
    impl.done()
  }, done:function() {
    var dns = impl.t_dns - impl.t_http;
    BOOMR.addVar("dns.t", dns);
    impl.complete = true;
    impl.gen_url = "";
    BOOMR.sendBeacon()
  }};
  var dns = BOOMR.plugins.DNS = {init:function(config) {
    BOOMR.utils.pluginConfig(impl, config, "DNS", ["base_url"]);
    if(!impl.base_url) {
      BOOMR.warn("DNS.base_url is not set.  Cannot run DNS test.", "dns");
      impl.complete = true;
      return dns
    }
    if(BOOMR.window.location.protocol === "https:") {
      impl.complete = true;
      return dns
    }
    BOOMR.subscribe("page_ready", impl.start, null, impl);
    return dns
  }, is_complete:function() {
    return impl.complete
  }}
}
dnsrun();
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
var disabled = {enabled:false};
BOOMR.init({log:null, wait:true, BW:disabled, DNS:disabled, IPv6:disabled, Kylie:disabled, autorun:false});
BOOMR.t_end = (new Date).getTime();
window.typePerfLogLevel;
window.typejsonMeasure;
function IPerfStubs() {
}
IPerfStubs.prototype.mark;
IPerfStubs.prototype.endMark;
IPerfStubs.prototype.stat;
IPerfStubs.prototype.measure;
function IPerf() {
}
IPerf.prototype.mark;
IPerf.prototype.endMark;
IPerf.prototype.setTimer;
IPerf.prototype.measureToJson;
IPerf.prototype.toJson;
IPerf.prototype.toPostVar;
IPerf.prototype.getMeasures;
IPerf.prototype.getBeaconData;
IPerf.prototype.setBeaconData;
IPerf.prototype.clearBeaconData;
IPerf.prototype.startTransaction;
IPerf.prototype.endTransaction;
IPerf.prototype.updateTransaction;
IPerf.prototype.stat;
IPerf.prototype.getStat;
IPerf.prototype.removeStats;
IPerf.prototype.measure;
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
var beaconData = "";
var PerfLogLevel = {DEBUG:{name:"DEBUG", value:1}, INTERNAL:{name:"INTERNAL", value:2}, PRODUCTION:{name:"PRODUCTION", value:3}};
var KylieConstants = {PAGE_START_MARK:"PageStart", KYLIE_PAYLOAD_PARAM:"bulkKylie", MARK_NAME:"mark", MEASURE_NAME:"measure", MARK_START_TIME:"st", MARK_LAST_TIME:"lt", PAGE_NAME:"pn", ELAPSED_TIME:"et", REFERENCE_TIME:"rt", KYLIE_LOAD_DONE:"loadDone"};
KylieConstants.STATS = {NAME:"stat", SERVER_ELAPSED:"internal_serverelapsed", DB_TOTAL_TIME:"internal_serverdbtotaltime", DB_CALLS:"internal_serverdbcalls", DB_FETCHES:"internal_serverdbfetches"};
function getLogLevel(logLevel) {
  if(typeof logLevel === "string") {
    logLevel = PerfLogLevel[logLevel]
  }
  return logLevel || PerfLogLevel.PRODUCTION
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
}, setTimer:function(timer_name, timer_delta, logLevel) {
  if(Perf.currentLogLevel.value <= getLogLevel(logLevel).value) {
    if(timer_delta >= 0) {
      BOOMR.plugins.RT.setTimer(timer_name, timer_delta)
    }else {
      BOOMR.plugins.RT.endTimer(timer_name)
    }
  }
  return Perf
}, measureToJson:function(measure) {
  return["{", KylieConstants.MEASURE_NAME, ':"', measure[KylieConstants.MEASURE_NAME], '",', KylieConstants.MARK_NAME, ':"', measure[KylieConstants.MARK_NAME], '",', KylieConstants.ELAPSED_TIME, ":", measure[KylieConstants.ELAPSED_TIME], ",", KylieConstants.REFERENCE_TIME, ":", measure[KylieConstants.REFERENCE_TIME], "}"].join("")
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
        measure[KylieConstants.MEASURE_NAME] = k;
        measure[KylieConstants.MARK_NAME] = k;
        measure[KylieConstants.ELAPSED_TIME] = vars[k];
        timer = timers[k];
        measure[KylieConstants.REFERENCE_TIME] = timer && timer.start ? timer.start : rt;
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
  return KylieConstants.KYLIE_PAYLOAD_PARAM + "=" + Perf.toJson().replace(/&/g, "__^__")
}, getMeasures:function() {
  BOOMR.plugins.RT.updateVars();
  var timers = BOOMR.plugins.RT.getTimers(), rt = BOOMR.plugins.RT.getSessionStart(), measures = [], vars = BOOMR.getVars(), k, measure;
  for(k in vars) {
    if(k != "r" && (k != "r2" && k != "t_other")) {
      if(vars.hasOwnProperty(k) && !isNaN(vars[k])) {
        measure = {};
        measure[KylieConstants.MEASURE_NAME] = k;
        measure[KylieConstants.MARK_NAME] = k;
        measure[KylieConstants.ELAPSED_TIME] = vars[k];
        measure[KylieConstants.REFERENCE_TIME] = timers[k] ? timers[k].start : rt;
        measures.push(measure)
      }
    }
  }
  return measures
}, getBeaconData:function() {
  return beaconData
}, setBeaconData:function(_beaconData) {
  beaconData = _beaconData
}, clearBeaconData:function() {
  beaconData = ""
}, removeStats:function() {
  BOOMR.removeStats()
}, init:function(args) {
  BOOMR.init({BW:{enabled:false}, beacon_url:BEACONURL, autorun:false})
}, subscribe:BOOMR.subscribe, stat:function(label, elapsedMillis) {
  BOOMR.addVar("st_" + label, elapsedMillis);
  return Perf
}, getStat:function(label) {
  BOOMR.plugins.RT.updateVars();
  if(!label) {
    return-1
  }
  return BOOMR.getVar(label)
}, onLoad:function() {
  BOOMR.page_ready()
}, measure:function(measureName, id, logLevel) {
  return Perf.endMark(id, logLevel)
}, startTransaction:function(tName) {
  return BOOMR.plugins.RT.startTransaction(tName)
}, endTransaction:function(tName) {
  return BOOMR.plugins.RT.endTransaction(tName)
}, updateTransaction:function(oldName, newName) {
  return BOOMR.plugins.RT.updateTimer(oldName, newName)
}, onLoadFired:function() {
  return BOOMR.plugins.RT.onLoadFired()
}, util:{setCookie:function(name, value, expires, path) {
  document.cookie = name + "=" + escape(value + "") + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "; path=/")
}}, loaded:true, enabled:true});
var ROOT_NAMESPACE = "Kylie";
window["Perf"] = Perf;
window[ROOT_NAMESPACE] = Perf;
window["PerfLogLevel"] = PerfLogLevel;
window["KylieConstants"] = KylieConstants;
})(this);
