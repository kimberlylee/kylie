# Copyright (c) 2011, Yahoo! Inc.  All rights reserved.
# Copyright (c) 2013, Salesforce.com  All rights reserved.
# Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.

PLUGINS := src/plugins/rt.js src/plugins/bw.js src/plugins/ipv6.js src/plugins/dns.js src/plugins/memory.js src/plugins/navtiming.js src/plugins/mobile.js src/plugins/kylie.js

SHIM := src/shim/perfShimClousreCompilerTypes.js src/shim/perfShim.js

STUB := src/shim/perfShimClousreCompilerTypes.js src/shim/perfStubs.js

BEACON_URL := ""
ROOT_NAMESPACE := "Kylie"

VERSION := $(shell sed -ne '/^\s*BOOMR\.version/{s/^.*"\([^"]*\)".*/\1/;p;q;}' src/boomerang.js)
DATE := $(shell date +%s)

MINIFIER := java -jar ClosureCompiler/compiler.jar --define="BEACON_URL='$(BEACON_URL)'" --define="ROOT_NAMESPACE='$(ROOT_NAMESPACE)'" --summary_detail_level 3 --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT --output_wrapper '(function(window){%output%})(this);' --create_source_map ./perf.js.map --source_map_format=V3 --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error internetExplorerChecks --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_error nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --js=

MINIFIER_STUBS := java -jar ClosureCompiler/compiler.jar --define="ROOT_NAMESPACE='$(ROOT_NAMESPACE)'" --summary_detail_level 3 --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error internetExplorerChecks --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_error nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --js=

MINIFIER_DEBUG := java -jar ClosureCompiler/compiler.jar --define="BEACON_URL='$(BEACON_URL)'" --define="ROOT_NAMESPACE='$(ROOT_NAMESPACE)'" --summary_detail_level 3 --warning_level VERBOSE --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT --language_in ECMASCRIPT5_STRICT --output_wrapper "(function(window){%output%})(this);" --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error internetExplorerChecks --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_error nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --js=

all: perf-$(VERSION).$(DATE).js

usage:
	echo "Create a release version of bommerang/kylie:"
	echo "	make"
	echo ""
	echo "Create a release version of boomerang/kylie with the rt, bw, dns, & kylie plugins:"
	echo "	make PLUGINS=\"plugins/rt.js plugins/bw.js plugins/dns.js plugins/kylie.js\""
	echo ""
	echo "Create a release version of boomerang/kylie with a custom beacon URL and root namespace:"
	echo "	make BEACON_URL=\"/location/to/beacon/data/to\" ROOT_NAMESPACE=\"Ninja\""
	echo ""

perf-$(VERSION).$(DATE).js: perf-$(VERSION).$(DATE)-debug.js
	echo "Making $@ ..."
	echo "using plugins: $(PLUGINS)..."
	echo "using shim: $(SHIM)..."
	$(MINIFIER)src/boomerangClousreCompilerTypes.js src/boomerang.js $(PLUGINS) $(SHIM) --js_output_file=perf.js
	echo "done"
	echo
	
perf-$(VERSION).$(DATE)-debug.js: perfStub-$(VERSION).$(DATE).js
	echo "Making $@ ..."
	echo "using plugins: $(PLUGINS)..."
	echo "using shim: $(SHIM)..."
	$(MINIFIER_DEBUG)src/boomerangClousreCompilerTypes.js src/boomerang.js $(PLUGINS) $(SHIM) --js_output_file=$@
	echo "done"
	echo
	
perfStub-$(VERSION).$(DATE).js: 
	echo
	echo "Making $@ ..."
	echo "using stub: $(STUB)..."
	$(MINIFIER_STUBS)$(STUB) > $@
	echo "done"
	echo

.PHONY: all
.SILENT:
