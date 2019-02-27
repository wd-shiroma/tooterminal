/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
(function (global, factory) {
  "use strict";

  if (typeof module === "object" && typeof module.exports === "object") {
    // For CommonJS and CommonJS-like environments where a proper `window`
    // is present, execute the factory and get jQuery.
    // For environments that do not have a `window` with a `document`
    // (such as Node.js), expose a factory as module.exports.
    // This accentuates the need for the creation of a real `window`.
    // e.g. var jQuery = require("jquery")(window);
    // See ticket #14549 for more info.
    module.exports = global.document ? factory(global, true) : function (w) {
      if (!w.document) {
        throw new Error("jQuery requires a window with a document");
      }

      return factory(w);
    };
  } else {
    factory(global);
  } // Pass this if window is not defined yet

})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  // Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
  // throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
  // arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
  // enough that all such attempts are guarded in a try block.
  "use strict";

  var arr = [];
  var document = window.document;
  var getProto = Object.getPrototypeOf;
  var slice = arr.slice;
  var concat = arr.concat;
  var push = arr.push;
  var indexOf = arr.indexOf;
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var fnToString = hasOwn.toString;
  var ObjectFunctionString = fnToString.call(Object);
  var support = {};

  var isFunction = function isFunction(obj) {
    // Support: Chrome <=57, Firefox <=52
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
  };

  var isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
  };

  var preservedScriptAttributes = {
    type: true,
    src: true,
    noModule: true
  };

  function DOMEval(code, doc, node) {
    doc = doc || document;
    var i,
        script = doc.createElement("script");
    script.text = code;

    if (node) {
      for (i in preservedScriptAttributes) {
        if (node[i]) {
          script[i] = node[i];
        }
      }
    }

    doc.head.appendChild(script).parentNode.removeChild(script);
  }

  function toType(obj) {
    if (obj == null) {
      return obj + "";
    } // Support: Android <=2.3 only (functionish RegExp)


    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
  }
  /* global Symbol */
  // Defining this global in .eslintrc.json would create a danger of using the global
  // unguarded in another place, it seems safer to define global only for this module


  var version = "3.3.1",
      // Define a local copy of jQuery
  jQuery = function (selector, context) {
    // The jQuery object is actually just the init constructor 'enhanced'
    // Need init if jQuery is called (just allow error to be thrown if not included)
    return new jQuery.fn.init(selector, context);
  },
      // Support: Android <=4.0 only
  // Make sure we trim BOM and NBSP
  rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  jQuery.fn = jQuery.prototype = {
    // The current version of jQuery being used
    jquery: version,
    constructor: jQuery,
    // The default length of a jQuery object is 0
    length: 0,
    toArray: function () {
      return slice.call(this);
    },
    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {
      // Return all the elements in a clean array
      if (num == null) {
        return slice.call(this);
      } // Return just the one element from the set


      return num < 0 ? this[num + this.length] : this[num];
    },
    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function (elems) {
      // Build a new jQuery matched element set
      var ret = jQuery.merge(this.constructor(), elems); // Add the old object onto the stack (as a reference)

      ret.prevObject = this; // Return the newly-formed element set

      return ret;
    },
    // Execute a callback for every element in the matched set.
    each: function (callback) {
      return jQuery.each(this, callback);
    },
    map: function (callback) {
      return this.pushStack(jQuery.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      }));
    },
    slice: function () {
      return this.pushStack(slice.apply(this, arguments));
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    eq: function (i) {
      var len = this.length,
          j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },
    end: function () {
      return this.prevObject || this.constructor();
    },
    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: arr.sort,
    splice: arr.splice
  };

  jQuery.extend = jQuery.fn.extend = function () {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false; // Handle a deep copy situation

    if (typeof target === "boolean") {
      deep = target; // Skip the boolean and the target

      target = arguments[i] || {};
      i++;
    } // Handle case when target is a string or something (possible in deep copy)


    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    } // Extend jQuery itself if only one argument is passed


    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name]; // Prevent never-ending loop

          if (target === copy) {
            continue;
          } // Recurse if we're merging plain objects or arrays


          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            } // Never move original objects, clone them


            target[name] = jQuery.extend(deep, clone, copy); // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    } // Return the modified object


    return target;
  };

  jQuery.extend({
    // Unique for each copy of jQuery on the page
    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
    // Assume jQuery is ready without the ready module
    isReady: true,
    error: function (msg) {
      throw new Error(msg);
    },
    noop: function () {},
    isPlainObject: function (obj) {
      var proto, Ctor; // Detect obvious negatives
      // Use toString instead of jQuery.type to catch host objects

      if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
      }

      proto = getProto(obj); // Objects with no prototype (e.g., `Object.create( null )`) are plain

      if (!proto) {
        return true;
      } // Objects with prototype are plain iff they were constructed by a global Object function


      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },
    isEmptyObject: function (obj) {
      /* eslint-disable no-unused-vars */
      // See https://github.com/eslint/eslint/issues/6125
      var name;

      for (name in obj) {
        return false;
      }

      return true;
    },
    // Evaluates a script in a global context
    globalEval: function (code) {
      DOMEval(code);
    },
    each: function (obj, callback) {
      var length,
          i = 0;

      if (isArrayLike(obj)) {
        length = obj.length;

        for (; i < length; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }

      return obj;
    },
    // Support: Android <=4.0 only
    trim: function (text) {
      return text == null ? "" : (text + "").replace(rtrim, "");
    },
    // results is for internal usage only
    makeArray: function (arr, results) {
      var ret = results || [];

      if (arr != null) {
        if (isArrayLike(Object(arr))) {
          jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
        } else {
          push.call(ret, arr);
        }
      }

      return ret;
    },
    inArray: function (elem, arr, i) {
      return arr == null ? -1 : indexOf.call(arr, elem, i);
    },
    // Support: Android <=4.0 only, PhantomJS 1 only
    // push.apply(_, arraylike) throws on ancient WebKit
    merge: function (first, second) {
      var len = +second.length,
          j = 0,
          i = first.length;

      for (; j < len; j++) {
        first[i++] = second[j];
      }

      first.length = i;
      return first;
    },
    grep: function (elems, callback, invert) {
      var callbackInverse,
          matches = [],
          i = 0,
          length = elems.length,
          callbackExpect = !invert; // Go through the array, only saving the items
      // that pass the validator function

      for (; i < length; i++) {
        callbackInverse = !callback(elems[i], i);

        if (callbackInverse !== callbackExpect) {
          matches.push(elems[i]);
        }
      }

      return matches;
    },
    // arg is for internal usage only
    map: function (elems, callback, arg) {
      var length,
          value,
          i = 0,
          ret = []; // Go through the array, translating each of the items to their new values

      if (isArrayLike(elems)) {
        length = elems.length;

        for (; i < length; i++) {
          value = callback(elems[i], i, arg);

          if (value != null) {
            ret.push(value);
          }
        } // Go through every key on the object,

      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);

          if (value != null) {
            ret.push(value);
          }
        }
      } // Flatten any nested arrays


      return concat.apply([], ret);
    },
    // A global GUID counter for objects
    guid: 1,
    // jQuery.support is not used in Core but other projects attach their
    // properties to it so it needs to exist.
    support: support
  });

  if (typeof Symbol === "function") {
    jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
  } // Populate the class2type map


  jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

  function isArrayLike(obj) {
    // Support: real iOS 8.2 only (not reproducible in simulator)
    // `in` check used to prevent JIT error (gh-2145)
    // hasOwn isn't used here due to false negatives
    // regarding Nodelist length in IE
    var length = !!obj && "length" in obj && obj.length,
        type = toType(obj);

    if (isFunction(obj) || isWindow(obj)) {
      return false;
    }

    return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
  }

  var Sizzle =
  /*!
   * Sizzle CSS Selector Engine v2.3.3
   * https://sizzlejs.com/
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2016-08-08
   */
  function (window) {
    var i,
        support,
        Expr,
        getText,
        isXML,
        tokenize,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,
        // Local document vars
    setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,
        // Instance-specific data
    expando = "sizzle" + 1 * new Date(),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function (a, b) {
      if (a === b) {
        hasDuplicate = true;
      }

      return 0;
    },
        // Instance methods
    hasOwn = {}.hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        // Use a stripped-down indexOf as it's faster than native
    // https://jsperf.com/thor-indexof-vs-for/5
    indexOf = function (list, elem) {
      var i = 0,
          len = list.length;

      for (; i < len; i++) {
        if (list[i] === elem) {
          return i;
        }
      }

      return -1;
    },
        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        // Regular expressions
    // http://www.w3.org/TR/css3-selectors/#whitespace
    whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
    "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
        pseudos = ":(" + identifier + ")(?:\\((" + // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    // 1. quoted (capture 3; capture 4 or capture 5)
    "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + // 2. simple (capture 6)
    "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + // 3. anything else (capture 2)
    ".*" + ")\\)|)",
        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp(whitespace + "+", "g"),
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),
        matchExpr = {
      "ID": new RegExp("^#(" + identifier + ")"),
      "CLASS": new RegExp("^\\.(" + identifier + ")"),
      "TAG": new RegExp("^(" + identifier + "|[*])"),
      "ATTR": new RegExp("^" + attributes),
      "PSEUDO": new RegExp("^" + pseudos),
      "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
      "bool": new RegExp("^(?:" + booleans + ")$", "i"),
      // For use in libraries implementing .is()
      // We use this for POS matching in `select`
      "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    },
        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,
        rnative = /^[^{]+\{\s*\[native \w/,
        // Easily-parseable/retrievable ID or TAG or CLASS selectors
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        rsibling = /[+~]/,
        // CSS escapes
    // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
        funescape = function (_, escaped, escapedWhitespace) {
      var high = "0x" + escaped - 0x10000; // NaN means non-codepoint
      // Support: Firefox<24
      // Workaround erroneous numeric interpretation of +"0x"

      return high !== high || escapedWhitespace ? escaped : high < 0 ? // BMP codepoint
      String.fromCharCode(high + 0x10000) : // Supplemental Plane codepoint (surrogate pair)
      String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
    },
        // CSS string/identifier serialization
    // https://drafts.csswg.org/cssom/#common-serializing-idioms
    rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        fcssescape = function (ch, asCodePoint) {
      if (asCodePoint) {
        // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
        if (ch === "\0") {
          return "\uFFFD";
        } // Control characters and (dependent upon position) numbers get escaped as code points


        return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
      } // Other potentially-special ASCII characters get backslash-escaped


      return "\\" + ch;
    },
        // Used for iframes
    // See setDocument()
    // Removing the function wrapper causes a "Permission Denied"
    // error in IE
    unloadHandler = function () {
      setDocument();
    },
        disabledAncestor = addCombinator(function (elem) {
      return elem.disabled === true && ("form" in elem || "label" in elem);
    }, {
      dir: "parentNode",
      next: "legend"
    }); // Optimize for push.apply( _, NodeList )


    try {
      push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes); // Support: Android<4.0
      // Detect silently failing push.apply

      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push = {
        apply: arr.length ? // Leverage slice if possible
        function (target, els) {
          push_native.apply(target, slice.call(els));
        } : // Support: IE<9
        // Otherwise append directly
        function (target, els) {
          var j = target.length,
              i = 0; // Can't trust NodeList.length

          while (target[j++] = els[i++]) {}

          target.length = j - 1;
        }
      };
    }

    function Sizzle(selector, context, results, seed) {
      var m,
          i,
          elem,
          nid,
          match,
          groups,
          newSelector,
          newContext = context && context.ownerDocument,
          // nodeType defaults to 9, since context defaults to document
      nodeType = context ? context.nodeType : 9;
      results = results || []; // Return early from calls with invalid selector or context

      if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
        return results;
      } // Try to shortcut find operations (as opposed to filters) in HTML documents


      if (!seed) {
        if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
          setDocument(context);
        }

        context = context || document;

        if (documentIsHTML) {
          // If the selector is sufficiently simple, try using a "get*By*" DOM method
          // (excepting DocumentFragment context, where the methods don't exist)
          if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
            // ID selector
            if (m = match[1]) {
              // Document context
              if (nodeType === 9) {
                if (elem = context.getElementById(m)) {
                  // Support: IE, Opera, Webkit
                  // TODO: identify versions
                  // getElementById can match elements by name instead of ID
                  if (elem.id === m) {
                    results.push(elem);
                    return results;
                  }
                } else {
                  return results;
                } // Element context

              } else {
                // Support: IE, Opera, Webkit
                // TODO: identify versions
                // getElementById can match elements by name instead of ID
                if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } // Type selector

            } else if (match[2]) {
              push.apply(results, context.getElementsByTagName(selector));
              return results; // Class selector
            } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
              push.apply(results, context.getElementsByClassName(m));
              return results;
            }
          } // Take advantage of querySelectorAll


          if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
            if (nodeType !== 1) {
              newContext = context;
              newSelector = selector; // qSA looks outside Element context, which is not what we want
              // Thanks to Andrew Dupont for this workaround technique
              // Support: IE <=8
              // Exclude object elements
            } else if (context.nodeName.toLowerCase() !== "object") {
              // Capture the context ID, setting it first if necessary
              if (nid = context.getAttribute("id")) {
                nid = nid.replace(rcssescape, fcssescape);
              } else {
                context.setAttribute("id", nid = expando);
              } // Prefix every selector in the list


              groups = tokenize(selector);
              i = groups.length;

              while (i--) {
                groups[i] = "#" + nid + " " + toSelector(groups[i]);
              }

              newSelector = groups.join(","); // Expand context for sibling selectors

              newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            }

            if (newSelector) {
              try {
                push.apply(results, newContext.querySelectorAll(newSelector));
                return results;
              } catch (qsaError) {} finally {
                if (nid === expando) {
                  context.removeAttribute("id");
                }
              }
            }
          }
        }
      } // All others


      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */


    function createCache() {
      var keys = [];

      function cache(key, value) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if (keys.push(key + " ") > Expr.cacheLength) {
          // Only keep the most recent entries
          delete cache[keys.shift()];
        }

        return cache[key + " "] = value;
      }

      return cache;
    }
    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */


    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }
    /**
     * Support testing using an element
     * @param {Function} fn Passed the created element and returns a boolean result
     */


    function assert(fn) {
      var el = document.createElement("fieldset");

      try {
        return !!fn(el);
      } catch (e) {
        return false;
      } finally {
        // Remove from its parent by default
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        } // release memory in IE


        el = null;
      }
    }
    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */


    function addHandle(attrs, handler) {
      var arr = attrs.split("|"),
          i = arr.length;

      while (i--) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */


    function siblingCheck(a, b) {
      var cur = b && a,
          diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex; // Use IE sourceIndex if available on both nodes

      if (diff) {
        return diff;
      } // Check if b follows a


      if (cur) {
        while (cur = cur.nextSibling) {
          if (cur === b) {
            return -1;
          }
        }
      }

      return a ? 1 : -1;
    }
    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */


    function createInputPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }
    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */


    function createButtonPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      };
    }
    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param {Boolean} disabled true for :disabled; false for :enabled
     */


    function createDisabledPseudo(disabled) {
      // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
      return function (elem) {
        // Only certain elements can match :enabled or :disabled
        // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
        // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
        if ("form" in elem) {
          // Check for inherited disabledness on relevant non-disabled elements:
          // * listed form-associated elements in a disabled fieldset
          //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
          //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
          // * option elements in a disabled optgroup
          //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
          // All such elements have a "form" property.
          if (elem.parentNode && elem.disabled === false) {
            // Option elements defer to a parent optgroup if present
            if ("label" in elem) {
              if ("label" in elem.parentNode) {
                return elem.parentNode.disabled === disabled;
              } else {
                return elem.disabled === disabled;
              }
            } // Support: IE 6 - 11
            // Use the isDisabled shortcut property to check for disabled fieldset ancestors


            return elem.isDisabled === disabled || // Where there is no isDisabled, check manually

            /* jshint -W018 */
            elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;
          }

          return elem.disabled === disabled; // Try to winnow out elements that can't be disabled before trusting the disabled property.
          // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
          // even exist on them, let alone have a boolean value.
        } else if ("label" in elem) {
          return elem.disabled === disabled;
        } // Remaining elements are neither :enabled nor :disabled


        return false;
      };
    }
    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */


    function createPositionalPseudo(fn) {
      return markFunction(function (argument) {
        argument = +argument;
        return markFunction(function (seed, matches) {
          var j,
              matchIndexes = fn([], seed.length, argument),
              i = matchIndexes.length; // Match elements found at the specified indexes

          while (i--) {
            if (seed[j = matchIndexes[i]]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */


    function testContext(context) {
      return context && typeof context.getElementsByTagName !== "undefined" && context;
    } // Expose support vars for convenience


    support = Sizzle.support = {};
    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */

    isXML = Sizzle.isXML = function (elem) {
      // documentElement is verified for cases where it doesn't yet exist
      // (such as loading iframes in IE - #4833)
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */


    setDocument = Sizzle.setDocument = function (node) {
      var hasCompare,
          subWindow,
          doc = node ? node.ownerDocument || node : preferredDoc; // Return early if doc is invalid or already selected

      if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
        return document;
      } // Update global variables


      document = doc;
      docElem = document.documentElement;
      documentIsHTML = !isXML(document); // Support: IE 9-11, Edge
      // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)

      if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
        // Support: IE 11, Edge
        if (subWindow.addEventListener) {
          subWindow.addEventListener("unload", unloadHandler, false); // Support: IE 9 - 10 only
        } else if (subWindow.attachEvent) {
          subWindow.attachEvent("onunload", unloadHandler);
        }
      }
      /* Attributes
      ---------------------------------------------------------------------- */
      // Support: IE<8
      // Verify that getAttribute really returns attributes and not properties
      // (excepting IE8 booleans)


      support.attributes = assert(function (el) {
        el.className = "i";
        return !el.getAttribute("className");
      });
      /* getElement(s)By*
      ---------------------------------------------------------------------- */
      // Check if getElementsByTagName("*") returns only elements

      support.getElementsByTagName = assert(function (el) {
        el.appendChild(document.createComment(""));
        return !el.getElementsByTagName("*").length;
      }); // Support: IE<9

      support.getElementsByClassName = rnative.test(document.getElementsByClassName); // Support: IE<10
      // Check if getElementById returns elements by name
      // The broken getElementById methods don't pick up programmatically-set names,
      // so use a roundabout getElementsByName test

      support.getById = assert(function (el) {
        docElem.appendChild(el).id = expando;
        return !document.getElementsByName || !document.getElementsByName(expando).length;
      }); // ID filter and find

      if (support.getById) {
        Expr.filter["ID"] = function (id) {
          var attrId = id.replace(runescape, funescape);
          return function (elem) {
            return elem.getAttribute("id") === attrId;
          };
        };

        Expr.find["ID"] = function (id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var elem = context.getElementById(id);
            return elem ? [elem] : [];
          }
        };
      } else {
        Expr.filter["ID"] = function (id) {
          var attrId = id.replace(runescape, funescape);
          return function (elem) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        }; // Support: IE 6 - 7 only
        // getElementById is not reliable as a find shortcut


        Expr.find["ID"] = function (id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var node,
                i,
                elems,
                elem = context.getElementById(id);

            if (elem) {
              // Verify the id attribute
              node = elem.getAttributeNode("id");

              if (node && node.value === id) {
                return [elem];
              } // Fall back on getElementsByName


              elems = context.getElementsByName(id);
              i = 0;

              while (elem = elems[i++]) {
                node = elem.getAttributeNode("id");

                if (node && node.value === id) {
                  return [elem];
                }
              }
            }

            return [];
          }
        };
      } // Tag


      Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
        if (typeof context.getElementsByTagName !== "undefined") {
          return context.getElementsByTagName(tag); // DocumentFragment nodes don't have gEBTN
        } else if (support.qsa) {
          return context.querySelectorAll(tag);
        }
      } : function (tag, context) {
        var elem,
            tmp = [],
            i = 0,
            // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
        results = context.getElementsByTagName(tag); // Filter out possible comments

        if (tag === "*") {
          while (elem = results[i++]) {
            if (elem.nodeType === 1) {
              tmp.push(elem);
            }
          }

          return tmp;
        }

        return results;
      }; // Class

      Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
        if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };
      /* QSA/matchesSelector
      ---------------------------------------------------------------------- */
      // QSA and matchesSelector support
      // matchesSelector(:active) reports false when true (IE9/Opera 11.5)


      rbuggyMatches = []; // qSa(:focus) reports false when true (Chrome 21)
      // We allow this because of a bug in IE8/9 that throws an error
      // whenever `document.activeElement` is accessed on an iframe
      // So, we allow :focus to pass through QSA all the time to avoid the IE error
      // See https://bugs.jquery.com/ticket/13378

      rbuggyQSA = [];

      if (support.qsa = rnative.test(document.querySelectorAll)) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function (el) {
          // Select is set to empty string on purpose
          // This is to test IE's treatment of not explicitly
          // setting a boolean content attribute,
          // since its presence should be enough
          // https://bugs.jquery.com/ticket/12359
          docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>"; // Support: IE8, Opera 11-12.16
          // Nothing should be selected when empty strings follow ^= or $= or *=
          // The test attribute must be unknown in Opera but "safe" for WinRT
          // https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section

          if (el.querySelectorAll("[msallowcapture^='']").length) {
            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
          } // Support: IE8
          // Boolean attributes and "value" are not treated correctly


          if (!el.querySelectorAll("[selected]").length) {
            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
          } // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+


          if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
            rbuggyQSA.push("~=");
          } // Webkit/Opera - :checked should return selected option elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          // IE8 throws error here and will not see later tests


          if (!el.querySelectorAll(":checked").length) {
            rbuggyQSA.push(":checked");
          } // Support: Safari 8+, iOS 8+
          // https://bugs.webkit.org/show_bug.cgi?id=136851
          // In-page `selector#id sibling-combinator selector` fails


          if (!el.querySelectorAll("a#" + expando + "+*").length) {
            rbuggyQSA.push(".#.+[+~]");
          }
        });
        assert(function (el) {
          el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>"; // Support: Windows 8 Native Apps
          // The type and name attributes are restricted during .innerHTML assignment

          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          el.appendChild(input).setAttribute("name", "D"); // Support: IE8
          // Enforce case-sensitivity of name attribute

          if (el.querySelectorAll("[name=d]").length) {
            rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
          } // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
          // IE8 throws error here and will not see later tests


          if (el.querySelectorAll(":enabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          } // Support: IE9-11+
          // IE's :disabled selector does not pick up the children of disabled fieldsets


          docElem.appendChild(el).disabled = true;

          if (el.querySelectorAll(":disabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          } // Opera 10-11 does not throw on post-comma invalid pseudos


          el.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }

      if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
        assert(function (el) {
          // Check to see if it's possible to do matchesSelector
          // on a disconnected node (IE 9)
          support.disconnectedMatch = matches.call(el, "*"); // This should fail with an exception
          // Gecko does not error, returns false instead

          matches.call(el, "[s!='']:x");
          rbuggyMatches.push("!=", pseudos);
        });
      }

      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
      /* Contains
      ---------------------------------------------------------------------- */

      hasCompare = rnative.test(docElem.compareDocumentPosition); // Element contains another
      // Purposefully self-exclusive
      // As in, an element does not contain itself

      contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      } : function (a, b) {
        if (b) {
          while (b = b.parentNode) {
            if (b === a) {
              return true;
            }
          }
        }

        return false;
      };
      /* Sorting
      ---------------------------------------------------------------------- */
      // Document order sorting

      sortOrder = hasCompare ? function (a, b) {
        // Flag for duplicate removal
        if (a === b) {
          hasDuplicate = true;
          return 0;
        } // Sort on method existence if only one input has compareDocumentPosition


        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;

        if (compare) {
          return compare;
        } // Calculate position if both inputs belong to the same document


        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : // Otherwise we know they are disconnected
        1; // Disconnected nodes

        if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
          // Choose the first element that is related to our preferred document
          if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
            return -1;
          }

          if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
            return 1;
          } // Maintain original order


          return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
        }

        return compare & 4 ? -1 : 1;
      } : function (a, b) {
        // Exit early if the nodes are identical
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }

        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [a],
            bp = [b]; // Parentless nodes are either documents or disconnected

        if (!aup || !bup) {
          return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0; // If the nodes are siblings, we can do a quick check
        } else if (aup === bup) {
          return siblingCheck(a, b);
        } // Otherwise we need full lists of their ancestors for comparison


        cur = a;

        while (cur = cur.parentNode) {
          ap.unshift(cur);
        }

        cur = b;

        while (cur = cur.parentNode) {
          bp.unshift(cur);
        } // Walk down the tree looking for a discrepancy


        while (ap[i] === bp[i]) {
          i++;
        }

        return i ? // Do a sibling check if the nodes have a common ancestor
        siblingCheck(ap[i], bp[i]) : // Otherwise nodes in our document sort first
        ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      };
      return document;
    };

    Sizzle.matches = function (expr, elements) {
      return Sizzle(expr, null, null, elements);
    };

    Sizzle.matchesSelector = function (elem, expr) {
      // Set document vars if needed
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      } // Make sure that attribute selectors are quoted


      expr = expr.replace(rattributeQuotes, "='$1']");

      if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          var ret = matches.call(elem, expr); // IE 9's matchesSelector returns false on disconnected nodes

          if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
          // fragment in IE 9
          elem.document && elem.document.nodeType !== 11) {
            return ret;
          }
        } catch (e) {}
      }

      return Sizzle(expr, document, null, [elem]).length > 0;
    };

    Sizzle.contains = function (context, elem) {
      // Set document vars if needed
      if ((context.ownerDocument || context) !== document) {
        setDocument(context);
      }

      return contains(context, elem);
    };

    Sizzle.attr = function (elem, name) {
      // Set document vars if needed
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }

      var fn = Expr.attrHandle[name.toLowerCase()],
          // Don't get fooled by Object.prototype properties (jQuery #13807)
      val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
      return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };

    Sizzle.escape = function (sel) {
      return (sel + "").replace(rcssescape, fcssescape);
    };

    Sizzle.error = function (msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    };
    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */


    Sizzle.uniqueSort = function (results) {
      var elem,
          duplicates = [],
          j = 0,
          i = 0; // Unless we *know* we can detect duplicates, assume their presence

      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);

      if (hasDuplicate) {
        while (elem = results[i++]) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }

        while (j--) {
          results.splice(duplicates[j], 1);
        }
      } // Clear input after sorting to release objects
      // See https://github.com/jquery/sizzle/pull/225


      sortInput = null;
      return results;
    };
    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */


    getText = Sizzle.getText = function (elem) {
      var node,
          ret = "",
          i = 0,
          nodeType = elem.nodeType;

      if (!nodeType) {
        // If no nodeType, this is expected to be an array
        while (node = elem[i++]) {
          // Do not traverse comment nodes
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (jQuery #11153)
        if (typeof elem.textContent === "string") {
          return elem.textContent;
        } else {
          // Traverse its children
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      } // Do not include comment or processing instruction nodes


      return ret;
    };

    Expr = Sizzle.selectors = {
      // Can be adjusted by the user
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        "ATTR": function (match) {
          match[1] = match[1].replace(runescape, funescape); // Move the given value to match[3] whether quoted or unquoted

          match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }

          return match.slice(0, 4);
        },
        "CHILD": function (match) {
          /* matches from matchExpr["CHILD"]
          	1 type (only|nth|...)
          	2 what (child|of-type)
          	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
          	4 xn-component of xn+y argument ([+-]?\d*n|)
          	5 sign of xn-component
          	6 x of xn-component
          	7 sign of y-component
          	8 y of y-component
          */
          match[1] = match[1].toLowerCase();

          if (match[1].slice(0, 3) === "nth") {
            // nth-* requires argument
            if (!match[3]) {
              Sizzle.error(match[0]);
            } // numeric x and y parameters for Expr.filter.CHILD
            // remember that false/true cast respectively to 0/1


            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
            match[5] = +(match[7] + match[8] || match[3] === "odd"); // other types prohibit arguments
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }

          return match;
        },
        "PSEUDO": function (match) {
          var excess,
              unquoted = !match[6] && match[2];

          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          } // Accept quoted arguments as-is


          if (match[3]) {
            match[2] = match[4] || match[5] || ""; // Strip excess characters from unquoted arguments
          } else if (unquoted && rpseudo.test(unquoted) && ( // Get excess from tokenize (recursively)
          excess = tokenize(unquoted, true)) && ( // advance to the next closing parenthesis
          excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
            // excess is a negative index
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          } // Return only captures needed by the pseudo filter method (type and argument)


          return match.slice(0, 3);
        }
      },
      filter: {
        "TAG": function (nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return nodeNameSelector === "*" ? function () {
            return true;
          } : function (elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        "CLASS": function (className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
          });
        },
        "ATTR": function (name, operator, check) {
          return function (elem) {
            var result = Sizzle.attr(elem, name);

            if (result == null) {
              return operator === "!=";
            }

            if (!operator) {
              return true;
            }

            result += "";
            return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
          };
        },
        "CHILD": function (type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
              forward = type.slice(-4) !== "last",
              ofType = what === "of-type";
          return first === 1 && last === 0 ? // Shortcut for :nth-*(n)
          function (elem) {
            return !!elem.parentNode;
          } : function (elem, context, xml) {
            var cache,
                uniqueCache,
                outerCache,
                node,
                nodeIndex,
                start,
                dir = simple !== forward ? "nextSibling" : "previousSibling",
                parent = elem.parentNode,
                name = ofType && elem.nodeName.toLowerCase(),
                useCache = !xml && !ofType,
                diff = false;

            if (parent) {
              // :(first|last|only)-(child|of-type)
              if (simple) {
                while (dir) {
                  node = elem;

                  while (node = node[dir]) {
                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                      return false;
                    }
                  } // Reverse direction for :only-* (if we haven't yet done so)


                  start = dir = type === "only" && !start && "nextSibling";
                }

                return true;
              }

              start = [forward ? parent.firstChild : parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`

              if (forward && useCache) {
                // Seek `elem` from a previously-cached index
                // ...in a gzip-friendly way
                node = parent;
                outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                // Defend against cloned attroperties (jQuery gh-1709)

                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                cache = uniqueCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];

                while (node = ++nodeIndex && node && node[dir] || ( // Fallback to seeking `elem` from the start
                diff = nodeIndex = 0) || start.pop()) {
                  // When found, cache indexes on `parent` and break
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    uniqueCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                // Use previously-cached element index if available
                if (useCache) {
                  // ...in a gzip-friendly way
                  node = elem;
                  outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                  // Defend against cloned attroperties (jQuery gh-1709)

                  uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                  cache = uniqueCache[type] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff = nodeIndex;
                } // xml :nth-child(...)
                // or :nth-last-child(...) or :nth(-last)?-of-type(...)


                if (diff === false) {
                  // Use the same loop as above to seek `elem` from the start
                  while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                      // Cache the index of each encountered element
                      if (useCache) {
                        outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
                        // Defend against cloned attroperties (jQuery gh-1709)

                        uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                        uniqueCache[type] = [dirruns, diff];
                      }

                      if (node === elem) {
                        break;
                      }
                    }
                  }
                }
              } // Incorporate the offset, then check against cycle size


              diff -= last;
              return diff === first || diff % first === 0 && diff / first >= 0;
            }
          };
        },
        "PSEUDO": function (pseudo, argument) {
          // pseudo-class names are case-insensitive
          // http://www.w3.org/TR/selectors/#pseudo-classes
          // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
          // Remember that setFilters inherits from pseudos
          var args,
              fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo); // The user may use createPseudo to indicate that
          // arguments are needed to create the filter function
          // just as Sizzle does

          if (fn[expando]) {
            return fn(argument);
          } // But maintain support for old signatures


          if (fn.length > 1) {
            args = [pseudo, pseudo, "", argument];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
              var idx,
                  matched = fn(seed, argument),
                  i = matched.length;

              while (i--) {
                idx = indexOf(seed, matched[i]);
                seed[idx] = !(matches[idx] = matched[i]);
              }
            }) : function (elem) {
              return fn(elem, 0, args);
            };
          }

          return fn;
        }
      },
      pseudos: {
        // Potentially complex pseudos
        "not": markFunction(function (selector) {
          // Trim the selector passed to compile
          // to avoid treating leading and trailing
          // spaces as combinators
          var input = [],
              results = [],
              matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
            var elem,
                unmatched = matcher(seed, null, xml, []),
                i = seed.length; // Match elements unmatched by `matcher`

            while (i--) {
              if (elem = unmatched[i]) {
                seed[i] = !(matches[i] = elem);
              }
            }
          }) : function (elem, context, xml) {
            input[0] = elem;
            matcher(input, null, xml, results); // Don't keep the element (issue #299)

            input[0] = null;
            return !results.pop();
          };
        }),
        "has": markFunction(function (selector) {
          return function (elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        "contains": markFunction(function (text) {
          text = text.replace(runescape, funescape);
          return function (elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        // "Whether an element is represented by a :lang() selector
        // is based solely on the element's language value
        // being equal to the identifier C,
        // or beginning with the identifier C immediately followed by "-".
        // The matching of C against the element's language value is performed case-insensitively.
        // The identifier C does not have to be a valid language name."
        // http://www.w3.org/TR/selectors/#lang-pseudo
        "lang": markFunction(function (lang) {
          // lang value must be a valid identifier
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }

          lang = lang.replace(runescape, funescape).toLowerCase();
          return function (elem) {
            var elemLang;

            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);

            return false;
          };
        }),
        // Miscellaneous
        "target": function (elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },
        "root": function (elem) {
          return elem === docElem;
        },
        "focus": function (elem) {
          return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },
        // Boolean properties
        "enabled": createDisabledPseudo(false),
        "disabled": createDisabledPseudo(true),
        "checked": function (elem) {
          // In CSS3, :checked should return both checked and selected elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          var nodeName = elem.nodeName.toLowerCase();
          return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
        },
        "selected": function (elem) {
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }

          return elem.selected === true;
        },
        // Contents
        "empty": function (elem) {
          // http://www.w3.org/TR/selectors/#empty-pseudo
          // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
          //   but not by others (comment: 8; processing instruction: 7; etc.)
          // nodeType < 6 works because attributes (2) do not appear as children
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }

          return true;
        },
        "parent": function (elem) {
          return !Expr.pseudos["empty"](elem);
        },
        // Element/input types
        "header": function (elem) {
          return rheader.test(elem.nodeName);
        },
        "input": function (elem) {
          return rinputs.test(elem.nodeName);
        },
        "button": function (elem) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name === "button";
        },
        "text": function (elem) {
          var attr;
          return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ( // Support: IE<8
          // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
          (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
        },
        // Position-in-collection
        "first": createPositionalPseudo(function () {
          return [0];
        }),
        "last": createPositionalPseudo(function (matchIndexes, length) {
          return [length - 1];
        }),
        "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
          return [argument < 0 ? argument + length : argument];
        }),
        "even": createPositionalPseudo(function (matchIndexes, length) {
          var i = 0;

          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        }),
        "odd": createPositionalPseudo(function (matchIndexes, length) {
          var i = 1;

          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        }),
        "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;

          for (; --i >= 0;) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        }),
        "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;

          for (; ++i < length;) {
            matchIndexes.push(i);
          }

          return matchIndexes;
        })
      }
    };
    Expr.pseudos["nth"] = Expr.pseudos["eq"]; // Add button/input type pseudos

    for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }

    for (i in {
      submit: true,
      reset: true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    } // Easy API for creating new setFilters


    function setFilters() {}

    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    tokenize = Sizzle.tokenize = function (selector, parseOnly) {
      var matched,
          match,
          tokens,
          type,
          soFar,
          groups,
          preFilters,
          cached = tokenCache[selector + " "];

      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }

      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;

      while (soFar) {
        // Comma and first run
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            // Don't consume trailing commas as valid
            soFar = soFar.slice(match[0].length) || soFar;
          }

          groups.push(tokens = []);
        }

        matched = false; // Combinators

        if (match = rcombinators.exec(soFar)) {
          matched = match.shift();
          tokens.push({
            value: matched,
            // Cast descendant combinators to space
            type: match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        } // Filters


        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }

        if (!matched) {
          break;
        }
      } // Return the length of the invalid excess
      // if we're just parsing
      // Otherwise, throw an error or return tokens


      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : // Cache the tokens
      tokenCache(selector, groups).slice(0);
    };

    function toSelector(tokens) {
      var i = 0,
          len = tokens.length,
          selector = "";

      for (; i < len; i++) {
        selector += tokens[i].value;
      }

      return selector;
    }

    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir,
          skip = combinator.next,
          key = skip || dir,
          checkNonElements = base && key === "parentNode",
          doneName = done++;
      return combinator.first ? // Check against closest ancestor/preceding element
      function (elem, context, xml) {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml);
          }
        }

        return false;
      } : // Check against all ancestor/preceding elements
      function (elem, context, xml) {
        var oldCache,
            uniqueCache,
            outerCache,
            newCache = [dirruns, doneName]; // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching

        if (xml) {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        } else {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[expando] || (elem[expando] = {}); // Support: IE <9 only
              // Defend against cloned attroperties (jQuery gh-1709)

              uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

              if (skip && skip === elem.nodeName.toLowerCase()) {
                elem = elem[dir] || elem;
              } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                // Assign to newCache so results back-propagate to previous elements
                return newCache[2] = oldCache[2];
              } else {
                // Reuse newcache so results back-propagate to previous elements
                uniqueCache[key] = newCache; // A match means we're done; a fail means we have to keep checking

                if (newCache[2] = matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          }
        }

        return false;
      };
    }

    function elementMatcher(matchers) {
      return matchers.length > 1 ? function (elem, context, xml) {
        var i = matchers.length;

        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }

        return true;
      } : matchers[0];
    }

    function multipleContexts(selector, contexts, results) {
      var i = 0,
          len = contexts.length;

      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }

      return results;
    }

    function condense(unmatched, map, filter, context, xml) {
      var elem,
          newUnmatched = [],
          i = 0,
          len = unmatched.length,
          mapped = map != null;

      for (; i < len; i++) {
        if (elem = unmatched[i]) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);

            if (mapped) {
              map.push(i);
            }
          }
        }
      }

      return newUnmatched;
    }

    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }

      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }

      return markFunction(function (seed, results, context, xml) {
        var temp,
            i,
            elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,
            // Get initial elements from seed or context
        elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
            // Prefilter to get matcher input, preserving a map for seed-results synchronization
        matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
            matcherOut = matcher ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || (seed ? preFilter : preexisting || postFilter) ? // ...intermediate processing is necessary
        [] : // ...otherwise use results directly
        results : matcherIn; // Find primary matches

        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        } // Apply postFilter


        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml); // Un-match failing elements by moving them back to matcherIn

          i = temp.length;

          while (i--) {
            if (elem = temp[i]) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }

        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              // Get the final matcherOut by condensing this intermediate into postFinder contexts
              temp = [];
              i = matcherOut.length;

              while (i--) {
                if (elem = matcherOut[i]) {
                  // Restore matcherIn since elem is not yet a final match
                  temp.push(matcherIn[i] = elem);
                }
              }

              postFinder(null, matcherOut = [], temp, xml);
            } // Move matched elements from seed to results to keep them synchronized


            i = matcherOut.length;

            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          } // Add elements to results, through postFinder if defined

        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);

          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }

    function matcherFromTokens(tokens) {
      var checkContext,
          matcher,
          j,
          len = tokens.length,
          leadingRelative = Expr.relative[tokens[0].type],
          implicitRelative = leadingRelative || Expr.relative[" "],
          i = leadingRelative ? 1 : 0,
          // The foundational matcher ensures that elements are reachable from top-level context(s)
      matchContext = addCombinator(function (elem) {
        return elem === checkContext;
      }, implicitRelative, true),
          matchAnyContext = addCombinator(function (elem) {
        return indexOf(checkContext, elem) > -1;
      }, implicitRelative, true),
          matchers = [function (elem, context, xml) {
        var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml)); // Avoid hanging onto element (issue #299)

        checkContext = null;
        return ret;
      }];

      for (; i < len; i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches); // Return special upon seeing a positional matcher

          if (matcher[expando]) {
            // Find the next relative operator (if any) for proper handling
            j = ++i;

            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }

            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector( // If the preceding token was a descendant combinator, insert an implicit any-element `*`
            tokens.slice(0, i - 1).concat({
              value: tokens[i - 2].type === " " ? "*" : ""
            })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
          }

          matchers.push(matcher);
        }
      }

      return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0,
          byElement = elementMatchers.length > 0,
          superMatcher = function (seed, context, xml, results, outermost) {
        var elem,
            j,
            matcher,
            matchedCount = 0,
            i = "0",
            unmatched = seed && [],
            setMatched = [],
            contextBackup = outermostContext,
            // We must always have either seed elements or outermost context
        elems = seed || byElement && Expr.find["TAG"]("*", outermost),
            // Use integer dirruns iff this is the outermost matcher
        dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
            len = elems.length;

        if (outermost) {
          outermostContext = context === document || context || outermost;
        } // Add elements passing elementMatchers directly to results
        // Support: IE<9, Safari
        // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id


        for (; i !== len && (elem = elems[i]) != null; i++) {
          if (byElement && elem) {
            j = 0;

            if (!context && elem.ownerDocument !== document) {
              setDocument(elem);
              xml = !documentIsHTML;
            }

            while (matcher = elementMatchers[j++]) {
              if (matcher(elem, context || document, xml)) {
                results.push(elem);
                break;
              }
            }

            if (outermost) {
              dirruns = dirrunsUnique;
            }
          } // Track unmatched elements for set filters


          if (bySet) {
            // They will have gone through all possible matchers
            if (elem = !matcher && elem) {
              matchedCount--;
            } // Lengthen the array for every element, matched or not


            if (seed) {
              unmatched.push(elem);
            }
          }
        } // `i` is now the count of elements visited above, and adding it to `matchedCount`
        // makes the latter nonnegative.


        matchedCount += i; // Apply set filters to unmatched elements
        // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
        // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
        // no element matchers and no seed.
        // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
        // case, which will result in a "00" `matchedCount` that differs from `i` but is also
        // numerically zero.

        if (bySet && i !== matchedCount) {
          j = 0;

          while (matcher = setMatchers[j++]) {
            matcher(unmatched, setMatched, context, xml);
          }

          if (seed) {
            // Reintegrate element matches to eliminate the need for sorting
            if (matchedCount > 0) {
              while (i--) {
                if (!(unmatched[i] || setMatched[i])) {
                  setMatched[i] = pop.call(results);
                }
              }
            } // Discard index placeholder values to get only actual matches


            setMatched = condense(setMatched);
          } // Add matches to results


          push.apply(results, setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting

          if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
            Sizzle.uniqueSort(results);
          }
        } // Override manipulation of globals by nested matchers


        if (outermost) {
          dirruns = dirrunsUnique;
          outermostContext = contextBackup;
        }

        return unmatched;
      };

      return bySet ? markFunction(superMatcher) : superMatcher;
    }

    compile = Sizzle.compile = function (selector, match
    /* Internal Use Only */
    ) {
      var i,
          setMatchers = [],
          elementMatchers = [],
          cached = compilerCache[selector + " "];

      if (!cached) {
        // Generate a function of recursive functions that can be used to check each element
        if (!match) {
          match = tokenize(selector);
        }

        i = match.length;

        while (i--) {
          cached = matcherFromTokens(match[i]);

          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        } // Cache the compiled function


        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)); // Save selector and tokenization

        cached.selector = selector;
      }

      return cached;
    };
    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */


    select = Sizzle.select = function (selector, context, results, seed) {
      var i,
          tokens,
          token,
          type,
          find,
          compiled = typeof selector === "function" && selector,
          match = !seed && tokenize(selector = compiled.selector || selector);
      results = results || []; // Try to minimize operations if there is only one selector in the list and no seed
      // (the latter of which guarantees us context)

      if (match.length === 1) {
        // Reduce context if the leading compound selector is an ID
        tokens = match[0] = match[0].slice(0);

        if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
          context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];

          if (!context) {
            return results; // Precompiled matchers will still verify ancestry, so step up a level
          } else if (compiled) {
            context = context.parentNode;
          }

          selector = selector.slice(tokens.shift().value.length);
        } // Fetch a seed set for right-to-left matching


        i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;

        while (i--) {
          token = tokens[i]; // Abort if we hit a combinator

          if (Expr.relative[type = token.type]) {
            break;
          }

          if (find = Expr.find[type]) {
            // Search, expanding context for leading sibling combinators
            if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
              // If seed is empty or no tokens remain, we can return early
              tokens.splice(i, 1);
              selector = seed.length && toSelector(tokens);

              if (!selector) {
                push.apply(results, seed);
                return results;
              }

              break;
            }
          }
        }
      } // Compile and execute a filtering function if one is not provided
      // Provide `match` to avoid retokenization if we modified the selector above


      (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
      return results;
    }; // One-time assignments
    // Sort stability


    support.sortStable = expando.split("").sort(sortOrder).join("") === expando; // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function

    support.detectDuplicates = !!hasDuplicate; // Initialize against the default document

    setDocument(); // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*

    support.sortDetached = assert(function (el) {
      // Should return 1, but returns 4 (following)
      return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
    }); // Support: IE<8
    // Prevent attribute/property "interpolation"
    // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx

    if (!assert(function (el) {
      el.innerHTML = "<a href='#'></a>";
      return el.firstChild.getAttribute("href") === "#";
    })) {
      addHandle("type|href|height|width", function (elem, name, isXML) {
        if (!isXML) {
          return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
        }
      });
    } // Support: IE<9
    // Use defaultValue in place of getAttribute("value")


    if (!support.attributes || !assert(function (el) {
      el.innerHTML = "<input/>";
      el.firstChild.setAttribute("value", "");
      return el.firstChild.getAttribute("value") === "";
    })) {
      addHandle("value", function (elem, name, isXML) {
        if (!isXML && elem.nodeName.toLowerCase() === "input") {
          return elem.defaultValue;
        }
      });
    } // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies


    if (!assert(function (el) {
      return el.getAttribute("disabled") == null;
    })) {
      addHandle(booleans, function (elem, name, isXML) {
        var val;

        if (!isXML) {
          return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }
      });
    }

    return Sizzle;
  }(window);

  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors; // Deprecated

  jQuery.expr[":"] = jQuery.expr.pseudos;
  jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  jQuery.escapeSelector = Sizzle.escape;

  var dir = function (elem, dir, until) {
    var matched = [],
        truncate = until !== undefined;

    while ((elem = elem[dir]) && elem.nodeType !== 9) {
      if (elem.nodeType === 1) {
        if (truncate && jQuery(elem).is(until)) {
          break;
        }

        matched.push(elem);
      }
    }

    return matched;
  };

  var siblings = function (n, elem) {
    var matched = [];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== elem) {
        matched.push(n);
      }
    }

    return matched;
  };

  var rneedsContext = jQuery.expr.match.needsContext;

  function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  }

  ;
  var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // Implement the identical functionality for filter and not

  function winnow(elements, qualifier, not) {
    if (isFunction(qualifier)) {
      return jQuery.grep(elements, function (elem, i) {
        return !!qualifier.call(elem, i, elem) !== not;
      });
    } // Single element


    if (qualifier.nodeType) {
      return jQuery.grep(elements, function (elem) {
        return elem === qualifier !== not;
      });
    } // Arraylike of elements (jQuery, arguments, Array)


    if (typeof qualifier !== "string") {
      return jQuery.grep(elements, function (elem) {
        return indexOf.call(qualifier, elem) > -1 !== not;
      });
    } // Filtered directly for both simple and complex selectors


    return jQuery.filter(qualifier, elements, not);
  }

  jQuery.filter = function (expr, elems, not) {
    var elem = elems[0];

    if (not) {
      expr = ":not(" + expr + ")";
    }

    if (elems.length === 1 && elem.nodeType === 1) {
      return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
    }

    return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
      return elem.nodeType === 1;
    }));
  };

  jQuery.fn.extend({
    find: function (selector) {
      var i,
          ret,
          len = this.length,
          self = this;

      if (typeof selector !== "string") {
        return this.pushStack(jQuery(selector).filter(function () {
          for (i = 0; i < len; i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }

      ret = this.pushStack([]);

      for (i = 0; i < len; i++) {
        jQuery.find(selector, self[i], ret);
      }

      return len > 1 ? jQuery.uniqueSort(ret) : ret;
    },
    filter: function (selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not: function (selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is: function (selector) {
      return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
      // so $("p:first").is("p:last") won't return true for a doc with two "p".
      typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  }); // Initialize a jQuery object
  // A central reference to the root jQuery(document)

  var rootjQuery,
      // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  // Strict HTML recognition (#11290: must start with <)
  // Shortcut simple #id case for speed
  rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
      init = jQuery.fn.init = function (selector, context, root) {
    var match, elem; // HANDLE: $(""), $(null), $(undefined), $(false)

    if (!selector) {
      return this;
    } // Method init() accepts an alternate rootjQuery
    // so migrate can support jQuery.sub (gh-2101)


    root = root || rootjQuery; // Handle HTML strings

    if (typeof selector === "string") {
      if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [null, selector, null];
      } else {
        match = rquickExpr.exec(selector);
      } // Match html or make sure no context is specified for #id


      if (match && (match[1] || !context)) {
        // HANDLE: $(html) -> $(array)
        if (match[1]) {
          context = context instanceof jQuery ? context[0] : context; // Option to run scripts is true for back-compat
          // Intentionally let the error be thrown if parseHTML is not present

          jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true)); // HANDLE: $(html, props)

          if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
            for (match in context) {
              // Properties of context are called as methods if possible
              if (isFunction(this[match])) {
                this[match](context[match]); // ...and otherwise set as attributes
              } else {
                this.attr(match, context[match]);
              }
            }
          }

          return this; // HANDLE: $(#id)
        } else {
          elem = document.getElementById(match[2]);

          if (elem) {
            // Inject the element directly into the jQuery object
            this[0] = elem;
            this.length = 1;
          }

          return this;
        } // HANDLE: $(expr, $(...))

      } else if (!context || context.jquery) {
        return (context || root).find(selector); // HANDLE: $(expr, context)
        // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor(context).find(selector);
      } // HANDLE: $(DOMElement)

    } else if (selector.nodeType) {
      this[0] = selector;
      this.length = 1;
      return this; // HANDLE: $(function)
      // Shortcut for document ready
    } else if (isFunction(selector)) {
      return root.ready !== undefined ? root.ready(selector) : // Execute immediately if ready is not present
      selector(jQuery);
    }

    return jQuery.makeArray(selector, this);
  }; // Give the init function the jQuery prototype for later instantiation


  init.prototype = jQuery.fn; // Initialize central reference

  rootjQuery = jQuery(document);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/,
      // Methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };
  jQuery.fn.extend({
    has: function (target) {
      var targets = jQuery(target, this),
          l = targets.length;
      return this.filter(function () {
        var i = 0;

        for (; i < l; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    closest: function (selectors, context) {
      var cur,
          i = 0,
          l = this.length,
          matched = [],
          targets = typeof selectors !== "string" && jQuery(selectors); // Positional selectors never match, since there's no _selection_ context

      if (!rneedsContext.test(selectors)) {
        for (; i < l; i++) {
          for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
            // Always skip document fragments
            if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : // Don't pass non-elements to Sizzle
            cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
              matched.push(cur);
              break;
            }
          }
        }
      }

      return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
    },
    // Determine the position of an element within the set
    index: function (elem) {
      // No argument, return index in parent
      if (!elem) {
        return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      } // Index in selector


      if (typeof elem === "string") {
        return indexOf.call(jQuery(elem), this[0]);
      } // Locate the position of the desired element


      return indexOf.call(this, // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem);
    },
    add: function (selector, context) {
      return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    addBack: function (selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    }
  });

  function sibling(cur, dir) {
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}

    return cur;
  }

  jQuery.each({
    parent: function (elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function (elem) {
      return dir(elem, "parentNode");
    },
    parentsUntil: function (elem, i, until) {
      return dir(elem, "parentNode", until);
    },
    next: function (elem) {
      return sibling(elem, "nextSibling");
    },
    prev: function (elem) {
      return sibling(elem, "previousSibling");
    },
    nextAll: function (elem) {
      return dir(elem, "nextSibling");
    },
    prevAll: function (elem) {
      return dir(elem, "previousSibling");
    },
    nextUntil: function (elem, i, until) {
      return dir(elem, "nextSibling", until);
    },
    prevUntil: function (elem, i, until) {
      return dir(elem, "previousSibling", until);
    },
    siblings: function (elem) {
      return siblings((elem.parentNode || {}).firstChild, elem);
    },
    children: function (elem) {
      return siblings(elem.firstChild);
    },
    contents: function (elem) {
      if (nodeName(elem, "iframe")) {
        return elem.contentDocument;
      } // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
      // Treat the template element as a regular one in browsers that
      // don't support it.


      if (nodeName(elem, "template")) {
        elem = elem.content || elem;
      }

      return jQuery.merge([], elem.childNodes);
    }
  }, function (name, fn) {
    jQuery.fn[name] = function (until, selector) {
      var matched = jQuery.map(this, fn, until);

      if (name.slice(-5) !== "Until") {
        selector = until;
      }

      if (selector && typeof selector === "string") {
        matched = jQuery.filter(selector, matched);
      }

      if (this.length > 1) {
        // Remove duplicates
        if (!guaranteedUnique[name]) {
          jQuery.uniqueSort(matched);
        } // Reverse order for parents* and prev-derivatives


        if (rparentsprev.test(name)) {
          matched.reverse();
        }
      }

      return this.pushStack(matched);
    };
  });
  var rnothtmlwhite = /[^\x20\t\r\n\f]+/g; // Convert String-formatted options into Object-formatted ones

  function createOptions(options) {
    var object = {};
    jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
      object[flag] = true;
    });
    return object;
  }
  /*
   * Create a callback list using the following parameters:
   *
   *	options: an optional list of space-separated options that will change how
   *			the callback list behaves or a more traditional option object
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible options:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */


  jQuery.Callbacks = function (options) {
    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

    var // Flag to know if list is currently firing
    firing,
        // Last fire value for non-forgettable lists
    memory,
        // Flag to know if list was already fired
    fired,
        // Flag to prevent firing
    locked,
        // Actual callback list
    list = [],
        // Queue of execution data for repeatable lists
    queue = [],
        // Index of currently firing callback (modified by add/remove as needed)
    firingIndex = -1,
        // Fire callbacks
    fire = function () {
      // Enforce single-firing
      locked = locked || options.once; // Execute callbacks for all pending executions,
      // respecting firingIndex overrides and runtime changes

      fired = firing = true;

      for (; queue.length; firingIndex = -1) {
        memory = queue.shift();

        while (++firingIndex < list.length) {
          // Run callback and check for early termination
          if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
            // Jump to end and forget the data so .add doesn't re-fire
            firingIndex = list.length;
            memory = false;
          }
        }
      } // Forget the data if we're done with it


      if (!options.memory) {
        memory = false;
      }

      firing = false; // Clean up if we're done firing for good

      if (locked) {
        // Keep an empty list if we have data for future add calls
        if (memory) {
          list = []; // Otherwise, this object is spent
        } else {
          list = "";
        }
      }
    },
        // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function () {
        if (list) {
          // If we have memory from a past run, we should fire after adding
          if (memory && !firing) {
            firingIndex = list.length - 1;
            queue.push(memory);
          }

          (function add(args) {
            jQuery.each(args, function (_, arg) {
              if (isFunction(arg)) {
                if (!options.unique || !self.has(arg)) {
                  list.push(arg);
                }
              } else if (arg && arg.length && toType(arg) !== "string") {
                // Inspect recursively
                add(arg);
              }
            });
          })(arguments);

          if (memory && !firing) {
            fire();
          }
        }

        return this;
      },
      // Remove a callback from the list
      remove: function () {
        jQuery.each(arguments, function (_, arg) {
          var index;

          while ((index = jQuery.inArray(arg, list, index)) > -1) {
            list.splice(index, 1); // Handle firing indexes

            if (index <= firingIndex) {
              firingIndex--;
            }
          }
        });
        return this;
      },
      // Check if a given callback is in the list.
      // If no argument is given, return whether or not list has callbacks attached.
      has: function (fn) {
        return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
      },
      // Remove all callbacks from the list
      empty: function () {
        if (list) {
          list = [];
        }

        return this;
      },
      // Disable .fire and .add
      // Abort any current/pending executions
      // Clear all callbacks and values
      disable: function () {
        locked = queue = [];
        list = memory = "";
        return this;
      },
      disabled: function () {
        return !list;
      },
      // Disable .fire
      // Also disable .add unless we have memory (since it would have no effect)
      // Abort any pending executions
      lock: function () {
        locked = queue = [];

        if (!memory && !firing) {
          list = memory = "";
        }

        return this;
      },
      locked: function () {
        return !!locked;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function (context, args) {
        if (!locked) {
          args = args || [];
          args = [context, args.slice ? args.slice() : args];
          queue.push(args);

          if (!firing) {
            fire();
          }
        }

        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function () {
        self.fireWith(this, arguments);
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function () {
        return !!fired;
      }
    };

    return self;
  };

  function Identity(v) {
    return v;
  }

  function Thrower(ex) {
    throw ex;
  }

  function adoptValue(value, resolve, reject, noValue) {
    var method;

    try {
      // Check for promise aspect first to privilege synchronous behavior
      if (value && isFunction(method = value.promise)) {
        method.call(value).done(resolve).fail(reject); // Other thenables
      } else if (value && isFunction(method = value.then)) {
        method.call(value, resolve, reject); // Other non-thenables
      } else {
        // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
        // * false: [ value ].slice( 0 ) => resolve( value )
        // * true: [ value ].slice( 1 ) => resolve()
        resolve.apply(undefined, [value].slice(noValue));
      } // For Promises/A+, convert exceptions into rejections
      // Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
      // Deferred#then to conditionally suppress rejection.

    } catch (value) {
      // Support: Android 4.0 only
      // Strict mode functions invoked without .call/.apply get global-object context
      reject.apply(undefined, [value]);
    }
  }

  jQuery.extend({
    Deferred: function (func) {
      var tuples = [// action, add listener, callbacks,
      // ... .then handlers, argument index, [final state]
      ["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2], ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"]],
          state = "pending",
          promise = {
        state: function () {
          return state;
        },
        always: function () {
          deferred.done(arguments).fail(arguments);
          return this;
        },
        "catch": function (fn) {
          return promise.then(null, fn);
        },
        // Keep pipe for back-compat
        pipe: function ()
        /* fnDone, fnFail, fnProgress */
        {
          var fns = arguments;
          return jQuery.Deferred(function (newDefer) {
            jQuery.each(tuples, function (i, tuple) {
              // Map tuples (progress, done, fail) to arguments (done, fail, progress)
              var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]]; // deferred.progress(function() { bind to newDefer or newDefer.notify })
              // deferred.done(function() { bind to newDefer or newDefer.resolve })
              // deferred.fail(function() { bind to newDefer or newDefer.reject })

              deferred[tuple[1]](function () {
                var returned = fn && fn.apply(this, arguments);

                if (returned && isFunction(returned.promise)) {
                  returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                } else {
                  newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
                }
              });
            });
            fns = null;
          }).promise();
        },
        then: function (onFulfilled, onRejected, onProgress) {
          var maxDepth = 0;

          function resolve(depth, deferred, handler, special) {
            return function () {
              var that = this,
                  args = arguments,
                  mightThrow = function () {
                var returned, then; // Support: Promises/A+ section 2.3.3.3.3
                // https://promisesaplus.com/#point-59
                // Ignore double-resolution attempts

                if (depth < maxDepth) {
                  return;
                }

                returned = handler.apply(that, args); // Support: Promises/A+ section 2.3.1
                // https://promisesaplus.com/#point-48

                if (returned === deferred.promise()) {
                  throw new TypeError("Thenable self-resolution");
                } // Support: Promises/A+ sections 2.3.3.1, 3.5
                // https://promisesaplus.com/#point-54
                // https://promisesaplus.com/#point-75
                // Retrieve `then` only once


                then = returned && ( // Support: Promises/A+ section 2.3.4
                // https://promisesaplus.com/#point-64
                // Only check objects and functions for thenability
                typeof returned === "object" || typeof returned === "function") && returned.then; // Handle a returned thenable

                if (isFunction(then)) {
                  // Special processors (notify) just wait for resolution
                  if (special) {
                    then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special)); // Normal processors (resolve) also hook into progress
                  } else {
                    // ...and disregard older resolution values
                    maxDepth++;
                    then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
                  } // Handle all other returned values

                } else {
                  // Only substitute handlers pass on context
                  // and multiple values (non-spec behavior)
                  if (handler !== Identity) {
                    that = undefined;
                    args = [returned];
                  } // Process the value(s)
                  // Default process is resolve


                  (special || deferred.resolveWith)(that, args);
                }
              },
                  // Only normal processors (resolve) catch and reject exceptions
              process = special ? mightThrow : function () {
                try {
                  mightThrow();
                } catch (e) {
                  if (jQuery.Deferred.exceptionHook) {
                    jQuery.Deferred.exceptionHook(e, process.stackTrace);
                  } // Support: Promises/A+ section 2.3.3.3.4.1
                  // https://promisesaplus.com/#point-61
                  // Ignore post-resolution exceptions


                  if (depth + 1 >= maxDepth) {
                    // Only substitute handlers pass on context
                    // and multiple values (non-spec behavior)
                    if (handler !== Thrower) {
                      that = undefined;
                      args = [e];
                    }

                    deferred.rejectWith(that, args);
                  }
                }
              }; // Support: Promises/A+ section 2.3.3.3.1
              // https://promisesaplus.com/#point-57
              // Re-resolve promises immediately to dodge false rejection from
              // subsequent errors


              if (depth) {
                process();
              } else {
                // Call an optional hook to record the stack, in case of exception
                // since it's otherwise lost when execution goes async
                if (jQuery.Deferred.getStackHook) {
                  process.stackTrace = jQuery.Deferred.getStackHook();
                }

                window.setTimeout(process);
              }
            };
          }

          return jQuery.Deferred(function (newDefer) {
            // progress_handlers.add( ... )
            tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith)); // fulfilled_handlers.add( ... )

            tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity)); // rejected_handlers.add( ... )

            tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function (obj) {
          return obj != null ? jQuery.extend(obj, promise) : promise;
        }
      },
          deferred = {}; // Add list-specific methods

      jQuery.each(tuples, function (i, tuple) {
        var list = tuple[2],
            stateString = tuple[5]; // promise.progress = list.add
        // promise.done = list.add
        // promise.fail = list.add

        promise[tuple[1]] = list.add; // Handle state

        if (stateString) {
          list.add(function () {
            // state = "resolved" (i.e., fulfilled)
            // state = "rejected"
            state = stateString;
          }, // rejected_callbacks.disable
          // fulfilled_callbacks.disable
          tuples[3 - i][2].disable, // rejected_handlers.disable
          // fulfilled_handlers.disable
          tuples[3 - i][3].disable, // progress_callbacks.lock
          tuples[0][2].lock, // progress_handlers.lock
          tuples[0][3].lock);
        } // progress_handlers.fire
        // fulfilled_handlers.fire
        // rejected_handlers.fire


        list.add(tuple[3].fire); // deferred.notify = function() { deferred.notifyWith(...) }
        // deferred.resolve = function() { deferred.resolveWith(...) }
        // deferred.reject = function() { deferred.rejectWith(...) }

        deferred[tuple[0]] = function () {
          deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
          return this;
        }; // deferred.notifyWith = list.fireWith
        // deferred.resolveWith = list.fireWith
        // deferred.rejectWith = list.fireWith


        deferred[tuple[0] + "With"] = list.fireWith;
      }); // Make the deferred a promise

      promise.promise(deferred); // Call given func if any

      if (func) {
        func.call(deferred, deferred);
      } // All done!


      return deferred;
    },
    // Deferred helper
    when: function (singleValue) {
      var // count of uncompleted subordinates
      remaining = arguments.length,
          // count of unprocessed arguments
      i = remaining,
          // subordinate fulfillment data
      resolveContexts = Array(i),
          resolveValues = slice.call(arguments),
          // the master Deferred
      master = jQuery.Deferred(),
          // subordinate callback factory
      updateFunc = function (i) {
        return function (value) {
          resolveContexts[i] = this;
          resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;

          if (! --remaining) {
            master.resolveWith(resolveContexts, resolveValues);
          }
        };
      }; // Single- and empty arguments are adopted like Promise.resolve


      if (remaining <= 1) {
        adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining); // Use .then() to unwrap secondary thenables (cf. gh-3000)

        if (master.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
          return master.then();
        }
      } // Multiple arguments are aggregated like Promise.all array elements


      while (i--) {
        adoptValue(resolveValues[i], updateFunc(i), master.reject);
      }

      return master.promise();
    }
  }); // These usually indicate a programmer mistake during development,
  // warn about them ASAP rather than swallowing them by default.

  var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

  jQuery.Deferred.exceptionHook = function (error, stack) {
    // Support: IE 8 - 9 only
    // Console exists when dev tools are open, which can happen at any time
    if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
      window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
    }
  };

  jQuery.readyException = function (error) {
    window.setTimeout(function () {
      throw error;
    });
  }; // The deferred used on DOM ready


  var readyList = jQuery.Deferred();

  jQuery.fn.ready = function (fn) {
    readyList.then(fn) // Wrap jQuery.readyException in a function so that the lookup
    // happens at the time of error handling instead of callback
    // registration.
    .catch(function (error) {
      jQuery.readyException(error);
    });
    return this;
  };

  jQuery.extend({
    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,
    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,
    // Handle when the DOM is ready
    ready: function (wait) {
      // Abort if there are pending holds or we're already ready
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      } // Remember that the DOM is ready


      jQuery.isReady = true; // If a normal DOM Ready event fired, decrement, and wait if need be

      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      } // If there are functions bound, to execute


      readyList.resolveWith(document, [jQuery]);
    }
  });
  jQuery.ready.then = readyList.then; // The ready event handler and self cleanup method

  function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    jQuery.ready();
  } // Catch cases where $(document).ready() is called
  // after the browser event has already occurred.
  // Support: IE <=9 - 10 only
  // Older IE sometimes signals "interactive" too soon


  if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
    // Handle it asynchronously to allow scripts the opportunity to delay ready
    window.setTimeout(jQuery.ready);
  } else {
    // Use the handy event callback
    document.addEventListener("DOMContentLoaded", completed); // A fallback to window.onload, that will always work

    window.addEventListener("load", completed);
  } // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function


  var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0,
        len = elems.length,
        bulk = key == null; // Sets many values

    if (toType(key) === "object") {
      chainable = true;

      for (i in key) {
        access(elems, fn, i, key[i], true, emptyGet, raw);
      } // Sets one value

    } else if (value !== undefined) {
      chainable = true;

      if (!isFunction(value)) {
        raw = true;
      }

      if (bulk) {
        // Bulk operations run against the entire set
        if (raw) {
          fn.call(elems, value);
          fn = null; // ...except when executing function values
        } else {
          bulk = fn;

          fn = function (elem, key, value) {
            return bulk.call(jQuery(elem), value);
          };
        }
      }

      if (fn) {
        for (; i < len; i++) {
          fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
        }
      }
    }

    if (chainable) {
      return elems;
    } // Gets


    if (bulk) {
      return fn.call(elems);
    }

    return len ? fn(elems[0], key) : emptyGet;
  }; // Matches dashed string for camelizing


  var rmsPrefix = /^-ms-/,
      rdashAlpha = /-([a-z])/g; // Used by camelCase as callback to replace()

  function fcamelCase(all, letter) {
    return letter.toUpperCase();
  } // Convert dashed to camelCase; used by the css and data modules
  // Support: IE <=9 - 11, Edge 12 - 15
  // Microsoft forgot to hump their vendor prefix (#9572)


  function camelCase(string) {
    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
  }

  var acceptData = function (owner) {
    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
  };

  function Data() {
    this.expando = jQuery.expando + Data.uid++;
  }

  Data.uid = 1;
  Data.prototype = {
    cache: function (owner) {
      // Check if the owner object already has a cache
      var value = owner[this.expando]; // If not, create one

      if (!value) {
        value = {}; // We can accept data for non-element nodes in modern browsers,
        // but we should not, see #8335.
        // Always return an empty object.

        if (acceptData(owner)) {
          // If it is a node unlikely to be stringify-ed or looped over
          // use plain assignment
          if (owner.nodeType) {
            owner[this.expando] = value; // Otherwise secure it in a non-enumerable property
            // configurable must be true to allow the property to be
            // deleted when data is removed
          } else {
            Object.defineProperty(owner, this.expando, {
              value: value,
              configurable: true
            });
          }
        }
      }

      return value;
    },
    set: function (owner, data, value) {
      var prop,
          cache = this.cache(owner); // Handle: [ owner, key, value ] args
      // Always use camelCase key (gh-2257)

      if (typeof data === "string") {
        cache[camelCase(data)] = value; // Handle: [ owner, { properties } ] args
      } else {
        // Copy the properties one-by-one to the cache object
        for (prop in data) {
          cache[camelCase(prop)] = data[prop];
        }
      }

      return cache;
    },
    get: function (owner, key) {
      return key === undefined ? this.cache(owner) : // Always use camelCase key (gh-2257)
      owner[this.expando] && owner[this.expando][camelCase(key)];
    },
    access: function (owner, key, value) {
      // In cases where either:
      //
      //   1. No key was specified
      //   2. A string key was specified, but no value provided
      //
      // Take the "read" path and allow the get method to determine
      // which value to return, respectively either:
      //
      //   1. The entire cache object
      //   2. The data stored at the key
      //
      if (key === undefined || key && typeof key === "string" && value === undefined) {
        return this.get(owner, key);
      } // When the key is not a string, or both a key and value
      // are specified, set or extend (existing objects) with either:
      //
      //   1. An object of properties
      //   2. A key and value
      //


      this.set(owner, key, value); // Since the "set" path can have two possible entry points
      // return the expected data based on which path was taken[*]

      return value !== undefined ? value : key;
    },
    remove: function (owner, key) {
      var i,
          cache = owner[this.expando];

      if (cache === undefined) {
        return;
      }

      if (key !== undefined) {
        // Support array or space separated string of keys
        if (Array.isArray(key)) {
          // If key is an array of keys...
          // We always set camelCase keys, so remove that.
          key = key.map(camelCase);
        } else {
          key = camelCase(key); // If a key with the spaces exists, use it.
          // Otherwise, create an array by matching non-whitespace

          key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
        }

        i = key.length;

        while (i--) {
          delete cache[key[i]];
        }
      } // Remove the expando if there's no more data


      if (key === undefined || jQuery.isEmptyObject(cache)) {
        // Support: Chrome <=35 - 45
        // Webkit & Blink performance suffers when deleting properties
        // from DOM nodes, so set to undefined instead
        // https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
        if (owner.nodeType) {
          owner[this.expando] = undefined;
        } else {
          delete owner[this.expando];
        }
      }
    },
    hasData: function (owner) {
      var cache = owner[this.expando];
      return cache !== undefined && !jQuery.isEmptyObject(cache);
    }
  };
  var dataPriv = new Data();
  var dataUser = new Data(); //	Implementation Summary
  //
  //	1. Enforce API surface and semantic compatibility with 1.9.x branch
  //	2. Improve the module's maintainability by reducing the storage
  //		paths to a single mechanism.
  //	3. Use the same single mechanism to support "private" and "user" data.
  //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
  //	5. Avoid exposing implementation details on user objects (eg. expando properties)
  //	6. Provide a clear path for implementation upgrade to WeakMap in 2014

  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      rmultiDash = /[A-Z]/g;

  function getData(data) {
    if (data === "true") {
      return true;
    }

    if (data === "false") {
      return false;
    }

    if (data === "null") {
      return null;
    } // Only convert to a number if it doesn't change the string


    if (data === +data + "") {
      return +data;
    }

    if (rbrace.test(data)) {
      return JSON.parse(data);
    }

    return data;
  }

  function dataAttr(elem, key, data) {
    var name; // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute

    if (data === undefined && elem.nodeType === 1) {
      name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
      data = elem.getAttribute(name);

      if (typeof data === "string") {
        try {
          data = getData(data);
        } catch (e) {} // Make sure we set the data so it isn't changed later


        dataUser.set(elem, key, data);
      } else {
        data = undefined;
      }
    }

    return data;
  }

  jQuery.extend({
    hasData: function (elem) {
      return dataUser.hasData(elem) || dataPriv.hasData(elem);
    },
    data: function (elem, name, data) {
      return dataUser.access(elem, name, data);
    },
    removeData: function (elem, name) {
      dataUser.remove(elem, name);
    },
    // TODO: Now that all calls to _data and _removeData have been replaced
    // with direct calls to dataPriv methods, these can be deprecated.
    _data: function (elem, name, data) {
      return dataPriv.access(elem, name, data);
    },
    _removeData: function (elem, name) {
      dataPriv.remove(elem, name);
    }
  });
  jQuery.fn.extend({
    data: function (key, value) {
      var i,
          name,
          data,
          elem = this[0],
          attrs = elem && elem.attributes; // Gets all values

      if (key === undefined) {
        if (this.length) {
          data = dataUser.get(elem);

          if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
            i = attrs.length;

            while (i--) {
              // Support: IE 11 only
              // The attrs elements can be null (#14894)
              if (attrs[i]) {
                name = attrs[i].name;

                if (name.indexOf("data-") === 0) {
                  name = camelCase(name.slice(5));
                  dataAttr(elem, name, data[name]);
                }
              }
            }

            dataPriv.set(elem, "hasDataAttrs", true);
          }
        }

        return data;
      } // Sets multiple values


      if (typeof key === "object") {
        return this.each(function () {
          dataUser.set(this, key);
        });
      }

      return access(this, function (value) {
        var data; // The calling jQuery object (element matches) is not empty
        // (and therefore has an element appears at this[ 0 ]) and the
        // `value` parameter was not undefined. An empty jQuery object
        // will result in `undefined` for elem = this[ 0 ] which will
        // throw an exception if an attempt to read a data cache is made.

        if (elem && value === undefined) {
          // Attempt to get data from the cache
          // The key will always be camelCased in Data
          data = dataUser.get(elem, key);

          if (data !== undefined) {
            return data;
          } // Attempt to "discover" the data in
          // HTML5 custom data-* attrs


          data = dataAttr(elem, key);

          if (data !== undefined) {
            return data;
          } // We tried really hard, but the data doesn't exist.


          return;
        } // Set the data...


        this.each(function () {
          // We always store the camelCased key
          dataUser.set(this, key, value);
        });
      }, null, value, arguments.length > 1, null, true);
    },
    removeData: function (key) {
      return this.each(function () {
        dataUser.remove(this, key);
      });
    }
  });
  jQuery.extend({
    queue: function (elem, type, data) {
      var queue;

      if (elem) {
        type = (type || "fx") + "queue";
        queue = dataPriv.get(elem, type); // Speed up dequeue by getting out quickly if this is just a lookup

        if (data) {
          if (!queue || Array.isArray(data)) {
            queue = dataPriv.access(elem, type, jQuery.makeArray(data));
          } else {
            queue.push(data);
          }
        }

        return queue || [];
      }
    },
    dequeue: function (elem, type) {
      type = type || "fx";

      var queue = jQuery.queue(elem, type),
          startLength = queue.length,
          fn = queue.shift(),
          hooks = jQuery._queueHooks(elem, type),
          next = function () {
        jQuery.dequeue(elem, type);
      }; // If the fx queue is dequeued, always remove the progress sentinel


      if (fn === "inprogress") {
        fn = queue.shift();
        startLength--;
      }

      if (fn) {
        // Add a progress sentinel to prevent the fx queue from being
        // automatically dequeued
        if (type === "fx") {
          queue.unshift("inprogress");
        } // Clear up the last queue stop function


        delete hooks.stop;
        fn.call(elem, next, hooks);
      }

      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    // Not public - generate a queueHooks object, or return the current one
    _queueHooks: function (elem, type) {
      var key = type + "queueHooks";
      return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
        empty: jQuery.Callbacks("once memory").add(function () {
          dataPriv.remove(elem, [type + "queue", key]);
        })
      });
    }
  });
  jQuery.fn.extend({
    queue: function (type, data) {
      var setter = 2;

      if (typeof type !== "string") {
        data = type;
        type = "fx";
        setter--;
      }

      if (arguments.length < setter) {
        return jQuery.queue(this[0], type);
      }

      return data === undefined ? this : this.each(function () {
        var queue = jQuery.queue(this, type, data); // Ensure a hooks for this queue

        jQuery._queueHooks(this, type);

        if (type === "fx" && queue[0] !== "inprogress") {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue: function (type) {
      return this.each(function () {
        jQuery.dequeue(this, type);
      });
    },
    clearQueue: function (type) {
      return this.queue(type || "fx", []);
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function (type, obj) {
      var tmp,
          count = 1,
          defer = jQuery.Deferred(),
          elements = this,
          i = this.length,
          resolve = function () {
        if (! --count) {
          defer.resolveWith(elements, [elements]);
        }
      };

      if (typeof type !== "string") {
        obj = type;
        type = undefined;
      }

      type = type || "fx";

      while (i--) {
        tmp = dataPriv.get(elements[i], type + "queueHooks");

        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }

      resolve();
      return defer.promise(obj);
    }
  });
  var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
  var cssExpand = ["Top", "Right", "Bottom", "Left"];

  var isHiddenWithinTree = function (elem, el) {
    // isHiddenWithinTree might be called from jQuery#filter function;
    // in that case, element will be second argument
    elem = el || elem; // Inline style trumps all

    return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
    // Support: Firefox <=43 - 45
    // Disconnected elements can have computed display: none, so first confirm that elem is
    // in the document.
    jQuery.contains(elem.ownerDocument, elem) && jQuery.css(elem, "display") === "none";
  };

  var swap = function (elem, options, callback, args) {
    var ret,
        name,
        old = {}; // Remember the old values, and insert the new ones

    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }

    ret = callback.apply(elem, args || []); // Revert the old values

    for (name in options) {
      elem.style[name] = old[name];
    }

    return ret;
  };

  function adjustCSS(elem, prop, valueParts, tween) {
    var adjusted,
        scale,
        maxIterations = 20,
        currentValue = tween ? function () {
      return tween.cur();
    } : function () {
      return jQuery.css(elem, prop, "");
    },
        initial = currentValue(),
        unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
        // Starting value computation is required for potential unit mismatches
    initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

    if (initialInUnit && initialInUnit[3] !== unit) {
      // Support: Firefox <=54
      // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
      initial = initial / 2; // Trust units reported by jQuery.css

      unit = unit || initialInUnit[3]; // Iteratively approximate from a nonzero starting point

      initialInUnit = +initial || 1;

      while (maxIterations--) {
        // Evaluate and update our best guess (doubling guesses that zero out).
        // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
        jQuery.style(elem, prop, initialInUnit + unit);

        if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
          maxIterations = 0;
        }

        initialInUnit = initialInUnit / scale;
      }

      initialInUnit = initialInUnit * 2;
      jQuery.style(elem, prop, initialInUnit + unit); // Make sure we update the tween properties later on

      valueParts = valueParts || [];
    }

    if (valueParts) {
      initialInUnit = +initialInUnit || +initial || 0; // Apply relative offset (+=/-=) if specified

      adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];

      if (tween) {
        tween.unit = unit;
        tween.start = initialInUnit;
        tween.end = adjusted;
      }
    }

    return adjusted;
  }

  var defaultDisplayMap = {};

  function getDefaultDisplay(elem) {
    var temp,
        doc = elem.ownerDocument,
        nodeName = elem.nodeName,
        display = defaultDisplayMap[nodeName];

    if (display) {
      return display;
    }

    temp = doc.body.appendChild(doc.createElement(nodeName));
    display = jQuery.css(temp, "display");
    temp.parentNode.removeChild(temp);

    if (display === "none") {
      display = "block";
    }

    defaultDisplayMap[nodeName] = display;
    return display;
  }

  function showHide(elements, show) {
    var display,
        elem,
        values = [],
        index = 0,
        length = elements.length; // Determine new display value for elements that need to change

    for (; index < length; index++) {
      elem = elements[index];

      if (!elem.style) {
        continue;
      }

      display = elem.style.display;

      if (show) {
        // Since we force visibility upon cascade-hidden elements, an immediate (and slow)
        // check is required in this first loop unless we have a nonempty display value (either
        // inline or about-to-be-restored)
        if (display === "none") {
          values[index] = dataPriv.get(elem, "display") || null;

          if (!values[index]) {
            elem.style.display = "";
          }
        }

        if (elem.style.display === "" && isHiddenWithinTree(elem)) {
          values[index] = getDefaultDisplay(elem);
        }
      } else {
        if (display !== "none") {
          values[index] = "none"; // Remember what we're overwriting

          dataPriv.set(elem, "display", display);
        }
      }
    } // Set the display of the elements in a second loop to avoid constant reflow


    for (index = 0; index < length; index++) {
      if (values[index] != null) {
        elements[index].style.display = values[index];
      }
    }

    return elements;
  }

  jQuery.fn.extend({
    show: function () {
      return showHide(this, true);
    },
    hide: function () {
      return showHide(this);
    },
    toggle: function (state) {
      if (typeof state === "boolean") {
        return state ? this.show() : this.hide();
      }

      return this.each(function () {
        if (isHiddenWithinTree(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  var rcheckableType = /^(?:checkbox|radio)$/i;
  var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;
  var rscriptType = /^$|^module$|\/(?:java|ecma)script/i; // We have to close these tags to support XHTML (#13200)

  var wrapMap = {
    // Support: IE <=9 only
    option: [1, "<select multiple='multiple'>", "</select>"],
    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do. So we cannot shorten
    // this by omitting <tbody> or other required elements.
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""]
  }; // Support: IE <=9 only

  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;

  function getAll(context, tag) {
    // Support: IE <=9 - 11 only
    // Use typeof to avoid zero-argument method invocation on host objects (#15151)
    var ret;

    if (typeof context.getElementsByTagName !== "undefined") {
      ret = context.getElementsByTagName(tag || "*");
    } else if (typeof context.querySelectorAll !== "undefined") {
      ret = context.querySelectorAll(tag || "*");
    } else {
      ret = [];
    }

    if (tag === undefined || tag && nodeName(context, tag)) {
      return jQuery.merge([context], ret);
    }

    return ret;
  } // Mark scripts as having already been evaluated


  function setGlobalEval(elems, refElements) {
    var i = 0,
        l = elems.length;

    for (; i < l; i++) {
      dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
    }
  }

  var rhtml = /<|&#?\w+;/;

  function buildFragment(elems, context, scripts, selection, ignored) {
    var elem,
        tmp,
        tag,
        wrap,
        contains,
        j,
        fragment = context.createDocumentFragment(),
        nodes = [],
        i = 0,
        l = elems.length;

    for (; i < l; i++) {
      elem = elems[i];

      if (elem || elem === 0) {
        // Add nodes directly
        if (toType(elem) === "object") {
          // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit
          jQuery.merge(nodes, elem.nodeType ? [elem] : elem); // Convert non-html into a text node
        } else if (!rhtml.test(elem)) {
          nodes.push(context.createTextNode(elem)); // Convert html into DOM nodes
        } else {
          tmp = tmp || fragment.appendChild(context.createElement("div")); // Deserialize a standard representation

          tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
          wrap = wrapMap[tag] || wrapMap._default;
          tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2]; // Descend through wrappers to the right content

          j = wrap[0];

          while (j--) {
            tmp = tmp.lastChild;
          } // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit


          jQuery.merge(nodes, tmp.childNodes); // Remember the top-level container

          tmp = fragment.firstChild; // Ensure the created nodes are orphaned (#12392)

          tmp.textContent = "";
        }
      }
    } // Remove wrapper from fragment


    fragment.textContent = "";
    i = 0;

    while (elem = nodes[i++]) {
      // Skip elements already in the context collection (trac-4087)
      if (selection && jQuery.inArray(elem, selection) > -1) {
        if (ignored) {
          ignored.push(elem);
        }

        continue;
      }

      contains = jQuery.contains(elem.ownerDocument, elem); // Append to fragment

      tmp = getAll(fragment.appendChild(elem), "script"); // Preserve script evaluation history

      if (contains) {
        setGlobalEval(tmp);
      } // Capture executables


      if (scripts) {
        j = 0;

        while (elem = tmp[j++]) {
          if (rscriptType.test(elem.type || "")) {
            scripts.push(elem);
          }
        }
      }
    }

    return fragment;
  }

  (function () {
    var fragment = document.createDocumentFragment(),
        div = fragment.appendChild(document.createElement("div")),
        input = document.createElement("input"); // Support: Android 4.0 - 4.3 only
    // Check state lost if the name is set (#11217)
    // Support: Windows Web Apps (WWA)
    // `name` and `type` must use .setAttribute for WWA (#14901)

    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");
    div.appendChild(input); // Support: Android <=4.1 only
    // Older WebKit doesn't clone checked state correctly in fragments

    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked; // Support: IE <=11 only
    // Make sure textarea (and checkbox) defaultValue is properly cloned

    div.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
  })();

  var documentElement = document.documentElement;
  var rkeyEvent = /^key/,
      rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

  function returnTrue() {
    return true;
  }

  function returnFalse() {
    return false;
  } // Support: IE <=9 only
  // See #13393 for more info


  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch (err) {}
  }

  function on(elem, types, selector, data, fn, one) {
    var origFn, type; // Types can be a map of types/handlers

    if (typeof types === "object") {
      // ( types-Object, selector, data )
      if (typeof selector !== "string") {
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
      }

      for (type in types) {
        on(elem, type, selector, data, types[type], one);
      }

      return elem;
    }

    if (data == null && fn == null) {
      // ( types, fn )
      fn = selector;
      data = selector = undefined;
    } else if (fn == null) {
      if (typeof selector === "string") {
        // ( types, selector, fn )
        fn = data;
        data = undefined;
      } else {
        // ( types, data, fn )
        fn = data;
        data = selector;
        selector = undefined;
      }
    }

    if (fn === false) {
      fn = returnFalse;
    } else if (!fn) {
      return elem;
    }

    if (one === 1) {
      origFn = fn;

      fn = function (event) {
        // Can use an empty set, since event contains the info
        jQuery().off(event);
        return origFn.apply(this, arguments);
      }; // Use same guid so caller can remove using origFn


      fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
    }

    return elem.each(function () {
      jQuery.event.add(this, types, fn, data, selector);
    });
  }
  /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */


  jQuery.event = {
    global: {},
    add: function (elem, types, handler, data, selector) {
      var handleObjIn,
          eventHandle,
          tmp,
          events,
          t,
          handleObj,
          special,
          handlers,
          type,
          namespaces,
          origType,
          elemData = dataPriv.get(elem); // Don't attach events to noData or text/comment nodes (but allow plain objects)

      if (!elemData) {
        return;
      } // Caller can pass in an object of custom data in lieu of the handler


      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      } // Ensure that invalid selectors throw exceptions at attach time
      // Evaluate against documentElement in case elem is a non-element node (e.g., document)


      if (selector) {
        jQuery.find.matchesSelector(documentElement, selector);
      } // Make sure that the handler has a unique ID, used to find/remove it later


      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      } // Init the element's event structure and main handler, if this is the first


      if (!(events = elemData.events)) {
        events = elemData.events = {};
      }

      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function (e) {
          // Discard the second event of a jQuery.event.trigger() and
          // when an event is called after a page has unloaded
          return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
        };
      } // Handle multiple events separated by a space


      types = (types || "").match(rnothtmlwhite) || [""];
      t = types.length;

      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort(); // There *must* be a type, no attaching namespace-only handlers

        if (!type) {
          continue;
        } // If event changes its type, use the special event handlers for the changed type


        special = jQuery.event.special[type] || {}; // If selector defined, determine special event api type, otherwise given type

        type = (selector ? special.delegateType : special.bindType) || type; // Update special based on newly reset type

        special = jQuery.event.special[type] || {}; // handleObj is passed to all event handlers

        handleObj = jQuery.extend({
          type: type,
          origType: origType,
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test(selector),
          namespace: namespaces.join(".")
        }, handleObjIn); // Init the event handler queue if we're the first

        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0; // Only use addEventListener if the special events handler returns false

          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle);
            }
          }
        }

        if (special.add) {
          special.add.call(elem, handleObj);

          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        } // Add to the element's handler list, delegates in front


        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        } // Keep track of which events have ever been used, for event optimization


        jQuery.event.global[type] = true;
      }
    },
    // Detach an event or set of events from an element
    remove: function (elem, types, handler, selector, mappedTypes) {
      var j,
          origCount,
          tmp,
          events,
          t,
          handleObj,
          special,
          handlers,
          type,
          namespaces,
          origType,
          elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

      if (!elemData || !(events = elemData.events)) {
        return;
      } // Once for each type.namespace in types; type may be omitted


      types = (types || "").match(rnothtmlwhite) || [""];
      t = types.length;

      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort(); // Unbind all events (on this namespace, if provided) for the element

        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector, true);
          }

          continue;
        }

        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"); // Remove matching events

        origCount = j = handlers.length;

        while (j--) {
          handleObj = handlers[j];

          if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
            handlers.splice(j, 1);

            if (handleObj.selector) {
              handlers.delegateCount--;
            }

            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        } // Remove generic event handler if we removed something and no more handlers exist
        // (avoids potential for endless recursion during removal of special event handlers)


        if (origCount && !handlers.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }

          delete events[type];
        }
      } // Remove data and the expando if it's no longer used


      if (jQuery.isEmptyObject(events)) {
        dataPriv.remove(elem, "handle events");
      }
    },
    dispatch: function (nativeEvent) {
      // Make a writable jQuery.Event from the native event object
      var event = jQuery.event.fix(nativeEvent);
      var i,
          j,
          ret,
          matched,
          handleObj,
          handlerQueue,
          args = new Array(arguments.length),
          handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
          special = jQuery.event.special[event.type] || {}; // Use the fix-ed jQuery.Event rather than the (read-only) native event

      args[0] = event;

      for (i = 1; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      event.delegateTarget = this; // Call the preDispatch hook for the mapped type, and let it bail if desired

      if (special.preDispatch && special.preDispatch.call(this, event) === false) {
        return;
      } // Determine handlers


      handlerQueue = jQuery.event.handlers.call(this, event, handlers); // Run delegates first; they may want to stop propagation beneath us

      i = 0;

      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;
        j = 0;

        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
          // Triggered event must either 1) have no namespace, or 2) have namespace(s)
          // a subset or equal to those in the bound event (both can have no namespace).
          if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      } // Call the postDispatch hook for the mapped type


      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }

      return event.result;
    },
    handlers: function (event, handlers) {
      var i,
          handleObj,
          sel,
          matchedHandlers,
          matchedSelectors,
          handlerQueue = [],
          delegateCount = handlers.delegateCount,
          cur = event.target; // Find delegate handlers

      if (delegateCount && // Support: IE <=9
      // Black-hole SVG <use> instance trees (trac-13180)
      cur.nodeType && // Support: Firefox <=42
      // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
      // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
      // Support: IE 11 only
      // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
      !(event.type === "click" && event.button >= 1)) {
        for (; cur !== this; cur = cur.parentNode || this) {
          // Don't check non-elements (#13208)
          // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
          if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
            matchedHandlers = [];
            matchedSelectors = {};

            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i]; // Don't conflict with Object.prototype properties (#13203)

              sel = handleObj.selector + " ";

              if (matchedSelectors[sel] === undefined) {
                matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
              }

              if (matchedSelectors[sel]) {
                matchedHandlers.push(handleObj);
              }
            }

            if (matchedHandlers.length) {
              handlerQueue.push({
                elem: cur,
                handlers: matchedHandlers
              });
            }
          }
        }
      } // Add the remaining (directly-bound) handlers


      cur = this;

      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: cur,
          handlers: handlers.slice(delegateCount)
        });
      }

      return handlerQueue;
    },
    addProp: function (name, hook) {
      Object.defineProperty(jQuery.Event.prototype, name, {
        enumerable: true,
        configurable: true,
        get: isFunction(hook) ? function () {
          if (this.originalEvent) {
            return hook(this.originalEvent);
          }
        } : function () {
          if (this.originalEvent) {
            return this.originalEvent[name];
          }
        },
        set: function (value) {
          Object.defineProperty(this, name, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
          });
        }
      });
    },
    fix: function (originalEvent) {
      return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
    },
    special: {
      load: {
        // Prevent triggered image.load events from bubbling to window.load
        noBubble: true
      },
      focus: {
        // Fire native event if possible so blur/focus sequence is correct
        trigger: function () {
          if (this !== safeActiveElement() && this.focus) {
            this.focus();
            return false;
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function () {
          if (this === safeActiveElement() && this.blur) {
            this.blur();
            return false;
          }
        },
        delegateType: "focusout"
      },
      click: {
        // For checkbox, fire native event so checked state will be right
        trigger: function () {
          if (this.type === "checkbox" && this.click && nodeName(this, "input")) {
            this.click();
            return false;
          }
        },
        // For cross-browser consistency, don't fire native .click() on links
        _default: function (event) {
          return nodeName(event.target, "a");
        }
      },
      beforeunload: {
        postDispatch: function (event) {
          // Support: Firefox 20+
          // Firefox doesn't alert if the returnValue field is not set.
          if (event.result !== undefined && event.originalEvent) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    }
  };

  jQuery.removeEvent = function (elem, type, handle) {
    // This "if" is needed for plain objects
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle);
    }
  };

  jQuery.Event = function (src, props) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    } // Event object


    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type; // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.

      this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && // Support: Android <=2.3 only
      src.returnValue === false ? returnTrue : returnFalse; // Create target properties
      // Support: Safari <=6 - 7 only
      // Target should not be a text node (#504, #13143)

      this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
      this.currentTarget = src.currentTarget;
      this.relatedTarget = src.relatedTarget; // Event type
    } else {
      this.type = src;
    } // Put explicitly provided properties onto the event object


    if (props) {
      jQuery.extend(this, props);
    } // Create a timestamp if incoming event doesn't have one


    this.timeStamp = src && src.timeStamp || Date.now(); // Mark it as fixed

    this[jQuery.expando] = true;
  }; // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
  // https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html


  jQuery.Event.prototype = {
    constructor: jQuery.Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,
    preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;

      if (e && !this.isSimulated) {
        e.preventDefault();
      }
    },
    stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;

      if (e && !this.isSimulated) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function () {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;

      if (e && !this.isSimulated) {
        e.stopImmediatePropagation();
      }

      this.stopPropagation();
    }
  }; // Includes all common event props including KeyEvent and MouseEvent specific props

  jQuery.each({
    altKey: true,
    bubbles: true,
    cancelable: true,
    changedTouches: true,
    ctrlKey: true,
    detail: true,
    eventPhase: true,
    metaKey: true,
    pageX: true,
    pageY: true,
    shiftKey: true,
    view: true,
    "char": true,
    charCode: true,
    key: true,
    keyCode: true,
    button: true,
    buttons: true,
    clientX: true,
    clientY: true,
    offsetX: true,
    offsetY: true,
    pointerId: true,
    pointerType: true,
    screenX: true,
    screenY: true,
    targetTouches: true,
    toElement: true,
    touches: true,
    which: function (event) {
      var button = event.button; // Add which for key events

      if (event.which == null && rkeyEvent.test(event.type)) {
        return event.charCode != null ? event.charCode : event.keyCode;
      } // Add which for click: 1 === left; 2 === middle; 3 === right


      if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
        if (button & 1) {
          return 1;
        }

        if (button & 2) {
          return 3;
        }

        if (button & 4) {
          return 2;
        }

        return 0;
      }

      return event.which;
    }
  }, jQuery.event.addProp); // Create mouseenter/leave events using mouseover/out and event-time checks
  // so that event delegation works in jQuery.
  // Do the same for pointerenter/pointerleave and pointerover/pointerout
  //
  // Support: Safari 7 only
  // Safari sends mouseenter too often; see:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=470258
  // for the description of the bug (it existed in older Chrome versions as well).

  jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function (orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function (event) {
        var ret,
            target = this,
            related = event.relatedTarget,
            handleObj = event.handleObj; // For mouseenter/leave call the handler if related is outside the target.
        // NB: No relatedTarget if the mouse left/entered the browser window

        if (!related || related !== target && !jQuery.contains(target, related)) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }

        return ret;
      }
    };
  });
  jQuery.fn.extend({
    on: function (types, selector, data, fn) {
      return on(this, types, selector, data, fn);
    },
    one: function (types, selector, data, fn) {
      return on(this, types, selector, data, fn, 1);
    },
    off: function (types, selector, fn) {
      var handleObj, type;

      if (types && types.preventDefault && types.handleObj) {
        // ( event )  dispatched jQuery.Event
        handleObj = types.handleObj;
        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
        return this;
      }

      if (typeof types === "object") {
        // ( types-object [, selector] )
        for (type in types) {
          this.off(type, selector, types[type]);
        }

        return this;
      }

      if (selector === false || typeof selector === "function") {
        // ( types [, fn] )
        fn = selector;
        selector = undefined;
      }

      if (fn === false) {
        fn = returnFalse;
      }

      return this.each(function () {
        jQuery.event.remove(this, types, fn, selector);
      });
    }
  });
  var
  /* eslint-disable max-len */
  // See https://github.com/eslint/eslint/issues/3229
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

  /* eslint-enable */
  // Support: IE <=10 - 11, Edge 12 - 13 only
  // In IE/Edge using regex groups here causes severe slowdowns.
  // See https://connect.microsoft.com/IE/feedback/details/1736512/
  rnoInnerhtml = /<script|<style|<link/i,
      // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
      rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g; // Prefer a tbody over its parent table for containing new rows

  function manipulationTarget(elem, content) {
    if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
      return jQuery(elem).children("tbody")[0] || elem;
    }

    return elem;
  } // Replace/restore the type attribute of script elements for safe DOM manipulation


  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }

  function restoreScript(elem) {
    if ((elem.type || "").slice(0, 5) === "true/") {
      elem.type = elem.type.slice(5);
    } else {
      elem.removeAttribute("type");
    }

    return elem;
  }

  function cloneCopyEvent(src, dest) {
    var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

    if (dest.nodeType !== 1) {
      return;
    } // 1. Copy private data: events, handlers, etc.


    if (dataPriv.hasData(src)) {
      pdataOld = dataPriv.access(src);
      pdataCur = dataPriv.set(dest, pdataOld);
      events = pdataOld.events;

      if (events) {
        delete pdataCur.handle;
        pdataCur.events = {};

        for (type in events) {
          for (i = 0, l = events[type].length; i < l; i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
    } // 2. Copy user data


    if (dataUser.hasData(src)) {
      udataOld = dataUser.access(src);
      udataCur = jQuery.extend({}, udataOld);
      dataUser.set(dest, udataCur);
    }
  } // Fix IE bugs, see support tests


  function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase(); // Fails to persist the checked state of a cloned checkbox or radio button.

    if (nodeName === "input" && rcheckableType.test(src.type)) {
      dest.checked = src.checked; // Fails to return the selected option to the default selected state when cloning options
    } else if (nodeName === "input" || nodeName === "textarea") {
      dest.defaultValue = src.defaultValue;
    }
  }

  function domManip(collection, args, callback, ignored) {
    // Flatten any nested arrays
    args = concat.apply([], args);
    var fragment,
        first,
        scripts,
        hasScripts,
        node,
        doc,
        i = 0,
        l = collection.length,
        iNoClone = l - 1,
        value = args[0],
        valueIsFunction = isFunction(value); // We can't cloneNode fragments that contain checked, in WebKit

    if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
      return collection.each(function (index) {
        var self = collection.eq(index);

        if (valueIsFunction) {
          args[0] = value.call(this, index, self.html());
        }

        domManip(self, args, callback, ignored);
      });
    }

    if (l) {
      fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
      first = fragment.firstChild;

      if (fragment.childNodes.length === 1) {
        fragment = first;
      } // Require either new content or an interest in ignored elements to invoke the callback


      if (first || ignored) {
        scripts = jQuery.map(getAll(fragment, "script"), disableScript);
        hasScripts = scripts.length; // Use the original fragment for the last item
        // instead of the first because it can end up
        // being emptied incorrectly in certain situations (#8070).

        for (; i < l; i++) {
          node = fragment;

          if (i !== iNoClone) {
            node = jQuery.clone(node, true, true); // Keep references to cloned scripts for later restoration

            if (hasScripts) {
              // Support: Android <=4.0 only, PhantomJS 1 only
              // push.apply(_, arraylike) throws on ancient WebKit
              jQuery.merge(scripts, getAll(node, "script"));
            }
          }

          callback.call(collection[i], node, i);
        }

        if (hasScripts) {
          doc = scripts[scripts.length - 1].ownerDocument; // Reenable scripts

          jQuery.map(scripts, restoreScript); // Evaluate executable scripts on first document insertion

          for (i = 0; i < hasScripts; i++) {
            node = scripts[i];

            if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
              if (node.src && (node.type || "").toLowerCase() !== "module") {
                // Optional AJAX dependency, but won't run scripts if not present
                if (jQuery._evalUrl) {
                  jQuery._evalUrl(node.src);
                }
              } else {
                DOMEval(node.textContent.replace(rcleanScript, ""), doc, node);
              }
            }
          }
        }
      }
    }

    return collection;
  }

  function remove(elem, selector, keepData) {
    var node,
        nodes = selector ? jQuery.filter(selector, elem) : elem,
        i = 0;

    for (; (node = nodes[i]) != null; i++) {
      if (!keepData && node.nodeType === 1) {
        jQuery.cleanData(getAll(node));
      }

      if (node.parentNode) {
        if (keepData && jQuery.contains(node.ownerDocument, node)) {
          setGlobalEval(getAll(node, "script"));
        }

        node.parentNode.removeChild(node);
      }
    }

    return elem;
  }

  jQuery.extend({
    htmlPrefilter: function (html) {
      return html.replace(rxhtmlTag, "<$1></$2>");
    },
    clone: function (elem, dataAndEvents, deepDataAndEvents) {
      var i,
          l,
          srcElements,
          destElements,
          clone = elem.cloneNode(true),
          inPage = jQuery.contains(elem.ownerDocument, elem); // Fix IE cloning issues

      if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
        // We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
        destElements = getAll(clone);
        srcElements = getAll(elem);

        for (i = 0, l = srcElements.length; i < l; i++) {
          fixInput(srcElements[i], destElements[i]);
        }
      } // Copy the events from the original to the clone


      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);

          for (i = 0, l = srcElements.length; i < l; i++) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      } // Preserve script evaluation history


      destElements = getAll(clone, "script");

      if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      } // Return the cloned set


      return clone;
    },
    cleanData: function (elems) {
      var data,
          elem,
          type,
          special = jQuery.event.special,
          i = 0;

      for (; (elem = elems[i]) !== undefined; i++) {
        if (acceptData(elem)) {
          if (data = elem[dataPriv.expando]) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type); // This is a shortcut to avoid jQuery.event.remove's overhead
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            } // Support: Chrome <=35 - 45+
            // Assign undefined instead of using delete, see Data#remove


            elem[dataPriv.expando] = undefined;
          }

          if (elem[dataUser.expando]) {
            // Support: Chrome <=35 - 45+
            // Assign undefined instead of using delete, see Data#remove
            elem[dataUser.expando] = undefined;
          }
        }
      }
    }
  });
  jQuery.fn.extend({
    detach: function (selector) {
      return remove(this, selector, true);
    },
    remove: function (selector) {
      return remove(this, selector);
    },
    text: function (value) {
      return access(this, function (value) {
        return value === undefined ? jQuery.text(this) : this.empty().each(function () {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            this.textContent = value;
          }
        });
      }, null, value, arguments.length);
    },
    append: function () {
      return domManip(this, arguments, function (elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function () {
      return domManip(this, arguments, function (elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function () {
      return domManip(this, arguments, function (elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function () {
      return domManip(this, arguments, function (elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    empty: function () {
      var elem,
          i = 0;

      for (; (elem = this[i]) != null; i++) {
        if (elem.nodeType === 1) {
          // Prevent memory leaks
          jQuery.cleanData(getAll(elem, false)); // Remove any remaining nodes

          elem.textContent = "";
        }
      }

      return this;
    },
    clone: function (dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function () {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function (value) {
      return access(this, function (value) {
        var elem = this[0] || {},
            i = 0,
            l = this.length;

        if (value === undefined && elem.nodeType === 1) {
          return elem.innerHTML;
        } // See if we can take a shortcut and just use innerHTML


        if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
          value = jQuery.htmlPrefilter(value);

          try {
            for (; i < l; i++) {
              elem = this[i] || {}; // Remove element nodes and prevent memory leaks

              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.innerHTML = value;
              }
            }

            elem = 0; // If using innerHTML throws an exception, use the fallback method
          } catch (e) {}
        }

        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    replaceWith: function () {
      var ignored = []; // Make the changes, replacing each non-ignored context element with the new content

      return domManip(this, arguments, function (elem) {
        var parent = this.parentNode;

        if (jQuery.inArray(this, ignored) < 0) {
          jQuery.cleanData(getAll(this));

          if (parent) {
            parent.replaceChild(elem, this);
          }
        } // Force callback invocation

      }, ignored);
    }
  });
  jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (name, original) {
    jQuery.fn[name] = function (selector) {
      var elems,
          ret = [],
          insert = jQuery(selector),
          last = insert.length - 1,
          i = 0;

      for (; i <= last; i++) {
        elems = i === last ? this : this.clone(true);
        jQuery(insert[i])[original](elems); // Support: Android <=4.0 only, PhantomJS 1 only
        // .get() because push.apply(_, arraylike) throws on ancient WebKit

        push.apply(ret, elems.get());
      }

      return this.pushStack(ret);
    };
  });
  var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

  var getStyles = function (elem) {
    // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    var view = elem.ownerDocument.defaultView;

    if (!view || !view.opener) {
      view = window;
    }

    return view.getComputedStyle(elem);
  };

  var rboxStyle = new RegExp(cssExpand.join("|"), "i");

  (function () {
    // Executing both pixelPosition & boxSizingReliable tests require only one layout
    // so they're executed at the same time to save the second computation.
    function computeStyleTests() {
      // This is a singleton, we need to execute it only once
      if (!div) {
        return;
      }

      container.style.cssText = "position:absolute;left:-11111px;width:60px;" + "margin-top:1px;padding:0;border:0";
      div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;" + "margin:auto;border:1px;padding:1px;" + "width:60%;top:1%";
      documentElement.appendChild(container).appendChild(div);
      var divStyle = window.getComputedStyle(div);
      pixelPositionVal = divStyle.top !== "1%"; // Support: Android 4.0 - 4.3 only, Firefox <=3 - 44

      reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12; // Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
      // Some styles come back with percentage values, even though they shouldn't

      div.style.right = "60%";
      pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36; // Support: IE 9 - 11 only
      // Detect misreporting of content dimensions for box-sizing:border-box elements

      boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36; // Support: IE 9 only
      // Detect overflow:scroll screwiness (gh-3699)

      div.style.position = "absolute";
      scrollboxSizeVal = div.offsetWidth === 36 || "absolute";
      documentElement.removeChild(container); // Nullify the div so it wouldn't be stored in the memory and
      // it will also be a sign that checks already performed

      div = null;
    }

    function roundPixelMeasures(measure) {
      return Math.round(parseFloat(measure));
    }

    var pixelPositionVal,
        boxSizingReliableVal,
        scrollboxSizeVal,
        pixelBoxStylesVal,
        reliableMarginLeftVal,
        container = document.createElement("div"),
        div = document.createElement("div"); // Finish early in limited (non-browser) environments

    if (!div.style) {
      return;
    } // Support: IE <=9 - 11 only
    // Style of cloned element affects source element cloned (#8908)


    div.style.backgroundClip = "content-box";
    div.cloneNode(true).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";
    jQuery.extend(support, {
      boxSizingReliable: function () {
        computeStyleTests();
        return boxSizingReliableVal;
      },
      pixelBoxStyles: function () {
        computeStyleTests();
        return pixelBoxStylesVal;
      },
      pixelPosition: function () {
        computeStyleTests();
        return pixelPositionVal;
      },
      reliableMarginLeft: function () {
        computeStyleTests();
        return reliableMarginLeftVal;
      },
      scrollboxSize: function () {
        computeStyleTests();
        return scrollboxSizeVal;
      }
    });
  })();

  function curCSS(elem, name, computed) {
    var width,
        minWidth,
        maxWidth,
        ret,
        // Support: Firefox 51+
    // Retrieving style before computed somehow
    // fixes an issue with getting wrong values
    // on detached elements
    style = elem.style;
    computed = computed || getStyles(elem); // getPropertyValue is needed for:
    //   .css('filter') (IE 9 only, #12537)
    //   .css('--customProperty) (#3144)

    if (computed) {
      ret = computed.getPropertyValue(name) || computed[name];

      if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
        ret = jQuery.style(elem, name);
      } // A tribute to the "awesome hack by Dean Edwards"
      // Android Browser returns percentage for some values,
      // but width seems to be reliably pixels.
      // This is against the CSSOM draft spec:
      // https://drafts.csswg.org/cssom/#resolved-values


      if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
        // Remember the original values
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth; // Put in the new values to get a computed value out

        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width; // Revert the changed values

        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }

    return ret !== undefined ? // Support: IE <=9 - 11 only
    // IE returns zIndex value as an integer.
    ret + "" : ret;
  }

  function addGetHookIf(conditionFn, hookFn) {
    // Define the hook, we'll check on the first run if it's really needed.
    return {
      get: function () {
        if (conditionFn()) {
          // Hook not needed (or it's not possible to use it due
          // to missing dependency), remove it.
          delete this.get;
          return;
        } // Hook needed; redefine it so that the support test is not executed again.


        return (this.get = hookFn).apply(this, arguments);
      }
    };
  }

  var // Swappable if display is none or starts with table
  // except "table", "table-cell", or "table-caption"
  // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
      rcustomProp = /^--/,
      cssShow = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  },
      cssNormalTransform = {
    letterSpacing: "0",
    fontWeight: "400"
  },
      cssPrefixes = ["Webkit", "Moz", "ms"],
      emptyStyle = document.createElement("div").style; // Return a css property mapped to a potentially vendor prefixed property

  function vendorPropName(name) {
    // Shortcut for names that are not vendor prefixed
    if (name in emptyStyle) {
      return name;
    } // Check for vendor prefixed names


    var capName = name[0].toUpperCase() + name.slice(1),
        i = cssPrefixes.length;

    while (i--) {
      name = cssPrefixes[i] + capName;

      if (name in emptyStyle) {
        return name;
      }
    }
  } // Return a property mapped along what jQuery.cssProps suggests or to
  // a vendor prefixed property.


  function finalPropName(name) {
    var ret = jQuery.cssProps[name];

    if (!ret) {
      ret = jQuery.cssProps[name] = vendorPropName(name) || name;
    }

    return ret;
  }

  function setPositiveNumber(elem, value, subtract) {
    // Any relative (+/-) values have already been
    // normalized at this point
    var matches = rcssNum.exec(value);
    return matches ? // Guard against undefined "subtract", e.g., when used as in cssHooks
    Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
  }

  function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
    var i = dimension === "width" ? 1 : 0,
        extra = 0,
        delta = 0; // Adjustment may not be necessary

    if (box === (isBorderBox ? "border" : "content")) {
      return 0;
    }

    for (; i < 4; i += 2) {
      // Both box models exclude margin
      if (box === "margin") {
        delta += jQuery.css(elem, box + cssExpand[i], true, styles);
      } // If we get here with a content-box, we're seeking "padding" or "border" or "margin"


      if (!isBorderBox) {
        // Add padding
        delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles); // For "border" or "margin", add border

        if (box !== "padding") {
          delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles); // But still keep track of it otherwise
        } else {
          extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        } // If we get here with a border-box (content + padding + border), we're seeking "content" or
        // "padding" or "margin"

      } else {
        // For "content", subtract padding
        if (box === "content") {
          delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        } // For "content" or "padding", subtract border


        if (box !== "margin") {
          delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    } // Account for positive content-box scroll gutter when requested by providing computedVal


    if (!isBorderBox && computedVal >= 0) {
      // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
      // Assuming integer scroll gutter, subtract the rest and round down
      delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5));
    }

    return delta;
  }

  function getWidthOrHeight(elem, dimension, extra) {
    // Start with computed style
    var styles = getStyles(elem),
        val = curCSS(elem, dimension, styles),
        isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box",
        valueIsBorderBox = isBorderBox; // Support: Firefox <=54
    // Return a confounding non-pixel value or feign ignorance, as appropriate.

    if (rnumnonpx.test(val)) {
      if (!extra) {
        return val;
      }

      val = "auto";
    } // Check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable elem.style


    valueIsBorderBox = valueIsBorderBox && (support.boxSizingReliable() || val === elem.style[dimension]); // Fall back to offsetWidth/offsetHeight when value is "auto"
    // This happens for inline elements with no explicit setting (gh-3571)
    // Support: Android <=4.1 - 4.3 only
    // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)

    if (val === "auto" || !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") {
      val = elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)]; // offsetWidth/offsetHeight provide border-box values

      valueIsBorderBox = true;
    } // Normalize "" and auto


    val = parseFloat(val) || 0; // Adjust for the element's box model

    return val + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles, // Provide the current computed size to request scroll gutter calculation (gh-3589)
    val) + "px";
  }

  jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
      opacity: {
        get: function (elem, computed) {
          if (computed) {
            // We should always get a number back from opacity
            var ret = curCSS(elem, "opacity");
            return ret === "" ? "1" : ret;
          }
        }
      }
    },
    // Don't automatically add "px" to these possibly-unitless properties
    cssNumber: {
      "animationIterationCount": true,
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    },
    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {},
    // Get and set the style property on a DOM Node
    style: function (elem, name, value, extra) {
      // Don't set styles on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      } // Make sure that we're working with the right name


      var ret,
          type,
          hooks,
          origName = camelCase(name),
          isCustomProp = rcustomProp.test(name),
          style = elem.style; // Make sure that we're working with the right name. We don't
      // want to query the value if it is a CSS custom property
      // since they are user-defined.

      if (!isCustomProp) {
        name = finalPropName(origName);
      } // Gets hook for the prefixed version, then unprefixed version


      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]; // Check if we're setting a value

      if (value !== undefined) {
        type = typeof value; // Convert "+=" or "-=" to relative numbers (#7345)

        if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
          value = adjustCSS(elem, name, ret); // Fixes bug #9237

          type = "number";
        } // Make sure that null and NaN values aren't set (#7116)


        if (value == null || value !== value) {
          return;
        } // If a number was passed in, add the unit (except for certain CSS properties)


        if (type === "number") {
          value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
        } // background-* props affect original clone's values


        if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
          style[name] = "inherit";
        } // If a hook was provided, use that value, otherwise just set the specified value


        if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
          if (isCustomProp) {
            style.setProperty(name, value);
          } else {
            style[name] = value;
          }
        }
      } else {
        // If a hook was provided get the non-computed value from there
        if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
          return ret;
        } // Otherwise just get the value from the style object


        return style[name];
      }
    },
    css: function (elem, name, extra, styles) {
      var val,
          num,
          hooks,
          origName = camelCase(name),
          isCustomProp = rcustomProp.test(name); // Make sure that we're working with the right name. We don't
      // want to modify the value if it is a CSS custom property
      // since they are user-defined.

      if (!isCustomProp) {
        name = finalPropName(origName);
      } // Try prefixed name followed by the unprefixed name


      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]; // If a hook was provided get the computed value from there

      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      } // Otherwise, if a way to get the computed value exists, use that


      if (val === undefined) {
        val = curCSS(elem, name, styles);
      } // Convert "normal" to computed value


      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      } // Make numeric if forced or a qualifier was provided and val looks numeric


      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
      }

      return val;
    }
  });
  jQuery.each(["height", "width"], function (i, dimension) {
    jQuery.cssHooks[dimension] = {
      get: function (elem, computed, extra) {
        if (computed) {
          // Certain elements can have dimension info if we invisibly show them
          // but it must have a current display style that would benefit
          return rdisplayswap.test(jQuery.css(elem, "display")) && ( // Support: Safari 8+
          // Table columns in Safari have non-zero offsetWidth & zero
          // getBoundingClientRect().width unless display is changed.
          // Support: IE <=11 only
          // Running getBoundingClientRect on a disconnected node
          // in IE throws an error.
          !elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function () {
            return getWidthOrHeight(elem, dimension, extra);
          }) : getWidthOrHeight(elem, dimension, extra);
        }
      },
      set: function (elem, value, extra) {
        var matches,
            styles = getStyles(elem),
            isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box",
            subtract = extra && boxModelAdjustment(elem, dimension, extra, isBorderBox, styles); // Account for unreliable border-box dimensions by comparing offset* to computed and
        // faking a content-box to get border and padding (gh-3699)

        if (isBorderBox && support.scrollboxSize() === styles.position) {
          subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5);
        } // Convert to pixels if value adjustment is needed


        if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
          elem.style[dimension] = value;
          value = jQuery.css(elem, dimension);
        }

        return setPositiveNumber(elem, value, subtract);
      }
    };
  });
  jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
    if (computed) {
      return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, {
        marginLeft: 0
      }, function () {
        return elem.getBoundingClientRect().left;
      })) + "px";
    }
  }); // These hooks are used by animate to expand properties

  jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      expand: function (value) {
        var i = 0,
            expanded = {},
            // Assumes a single number if not a string
        parts = typeof value === "string" ? value.split(" ") : [value];

        for (; i < 4; i++) {
          expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
        }

        return expanded;
      }
    };

    if (prefix !== "margin") {
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  jQuery.fn.extend({
    css: function (name, value) {
      return access(this, function (elem, name, value) {
        var styles,
            len,
            map = {},
            i = 0;

        if (Array.isArray(name)) {
          styles = getStyles(elem);
          len = name.length;

          for (; i < len; i++) {
            map[name[i]] = jQuery.css(elem, name[i], false, styles);
          }

          return map;
        }

        return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    }
  });

  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }

  jQuery.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function (elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || jQuery.easing._default;
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    cur: function () {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function (percent) {
      var eased,
          hooks = Tween.propHooks[this.prop];

      if (this.options.duration) {
        this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
      } else {
        this.pos = eased = percent;
      }

      this.now = (this.end - this.start) * eased + this.start;

      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }

      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }

      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default: {
      get: function (tween) {
        var result; // Use a property on the element directly when it is not a DOM element,
        // or when there is no matching style property that exists.

        if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
          return tween.elem[tween.prop];
        } // Passing an empty string as a 3rd parameter to .css will automatically
        // attempt a parseFloat and fallback to a string if the parse fails.
        // Simple values such as "10px" are parsed to Float;
        // complex values such as "rotate(1rad)" are returned as-is.


        result = jQuery.css(tween.elem, tween.prop, ""); // Empty strings, null, undefined and "auto" are converted to 0.

        return !result || result === "auto" ? 0 : result;
      },
      set: function (tween) {
        // Use step hook for back compat.
        // Use cssHook if its there.
        // Use .style if available and use plain properties where available.
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  }; // Support: IE <=9 only
  // Panic based approach to setting things on disconnected nodes

  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function (tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    }
  };
  jQuery.easing = {
    linear: function (p) {
      return p;
    },
    swing: function (p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    _default: "swing"
  };
  jQuery.fx = Tween.prototype.init; // Back compat <1.8 extension point

  jQuery.fx.step = {};
  var fxNow,
      inProgress,
      rfxtypes = /^(?:toggle|show|hide)$/,
      rrun = /queueHooks$/;

  function schedule() {
    if (inProgress) {
      if (document.hidden === false && window.requestAnimationFrame) {
        window.requestAnimationFrame(schedule);
      } else {
        window.setTimeout(schedule, jQuery.fx.interval);
      }

      jQuery.fx.tick();
    }
  } // Animations created synchronously will run synchronously


  function createFxNow() {
    window.setTimeout(function () {
      fxNow = undefined;
    });
    return fxNow = Date.now();
  } // Generate parameters to create a standard animation


  function genFx(type, includeWidth) {
    var which,
        i = 0,
        attrs = {
      height: type
    }; // If we include width, step value is 1 to do all cssExpand values,
    // otherwise step value is 2 to skip over Left and Right

    includeWidth = includeWidth ? 1 : 0;

    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }

    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }

    return attrs;
  }

  function createTween(value, prop, animation) {
    var tween,
        collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
        index = 0,
        length = collection.length;

    for (; index < length; index++) {
      if (tween = collection[index].call(animation, prop, value)) {
        // We're done with this property
        return tween;
      }
    }
  }

  function defaultPrefilter(elem, props, opts) {
    var prop,
        value,
        toggle,
        hooks,
        oldfire,
        propTween,
        restoreDisplay,
        display,
        isBox = "width" in props || "height" in props,
        anim = this,
        orig = {},
        style = elem.style,
        hidden = elem.nodeType && isHiddenWithinTree(elem),
        dataShow = dataPriv.get(elem, "fxshow"); // Queue-skipping animations hijack the fx hooks

    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");

      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;

        hooks.empty.fire = function () {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }

      hooks.unqueued++;
      anim.always(function () {
        // Ensure the complete handler is called before this completes
        anim.always(function () {
          hooks.unqueued--;

          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    } // Detect show/hide animations


    for (prop in props) {
      value = props[prop];

      if (rfxtypes.test(value)) {
        delete props[prop];
        toggle = toggle || value === "toggle";

        if (value === (hidden ? "hide" : "show")) {
          // Pretend to be hidden if this is a "show" and
          // there is still data from a stopped show/hide
          if (value === "show" && dataShow && dataShow[prop] !== undefined) {
            hidden = true; // Ignore all other no-op show/hide data
          } else {
            continue;
          }
        }

        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      }
    } // Bail out if this is a no-op like .hide().hide()


    propTween = !jQuery.isEmptyObject(props);

    if (!propTween && jQuery.isEmptyObject(orig)) {
      return;
    } // Restrict "overflow" and "display" styles during box animations


    if (isBox && elem.nodeType === 1) {
      // Support: IE <=9 - 11, Edge 12 - 15
      // Record all 3 overflow attributes because IE does not infer the shorthand
      // from identically-valued overflowX and overflowY and Edge just mirrors
      // the overflowX value there.
      opts.overflow = [style.overflow, style.overflowX, style.overflowY]; // Identify a display type, preferring old show/hide data over the CSS cascade

      restoreDisplay = dataShow && dataShow.display;

      if (restoreDisplay == null) {
        restoreDisplay = dataPriv.get(elem, "display");
      }

      display = jQuery.css(elem, "display");

      if (display === "none") {
        if (restoreDisplay) {
          display = restoreDisplay;
        } else {
          // Get nonempty value(s) by temporarily forcing visibility
          showHide([elem], true);
          restoreDisplay = elem.style.display || restoreDisplay;
          display = jQuery.css(elem, "display");
          showHide([elem]);
        }
      } // Animate inline elements as inline-block


      if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
        if (jQuery.css(elem, "float") === "none") {
          // Restore the original display value at the end of pure show/hide animations
          if (!propTween) {
            anim.done(function () {
              style.display = restoreDisplay;
            });

            if (restoreDisplay == null) {
              display = style.display;
              restoreDisplay = display === "none" ? "" : display;
            }
          }

          style.display = "inline-block";
        }
      }
    }

    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function () {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    } // Implement show/hide animations


    propTween = false;

    for (prop in orig) {
      // General show/hide setup for this element animation
      if (!propTween) {
        if (dataShow) {
          if ("hidden" in dataShow) {
            hidden = dataShow.hidden;
          }
        } else {
          dataShow = dataPriv.access(elem, "fxshow", {
            display: restoreDisplay
          });
        } // Store hidden/visible for toggle so `.stop().toggle()` "reverses"


        if (toggle) {
          dataShow.hidden = !hidden;
        } // Show elements before animating them


        if (hidden) {
          showHide([elem], true);
        }
        /* eslint-disable no-loop-func */


        anim.done(function () {
          /* eslint-enable no-loop-func */
          // The final step of a "hide" animation is actually hiding the element
          if (!hidden) {
            showHide([elem]);
          }

          dataPriv.remove(elem, "fxshow");

          for (prop in orig) {
            jQuery.style(elem, prop, orig[prop]);
          }
        });
      } // Per-property setup


      propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

      if (!(prop in dataShow)) {
        dataShow[prop] = propTween.start;

        if (hidden) {
          propTween.end = propTween.start;
          propTween.start = 0;
        }
      }
    }
  }

  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks; // camelCase, specialEasing and expand cssHook pass

    for (index in props) {
      name = camelCase(index);
      easing = specialEasing[name];
      value = props[index];

      if (Array.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }

      if (index !== name) {
        props[name] = value;
        delete props[index];
      }

      hooks = jQuery.cssHooks[name];

      if (hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete props[name]; // Not quite $.extend, this won't overwrite existing keys.
        // Reusing 'index' because we have the correct "name"

        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }

  function Animation(elem, properties, options) {
    var result,
        stopped,
        index = 0,
        length = Animation.prefilters.length,
        deferred = jQuery.Deferred().always(function () {
      // Don't match elem in the :animated selector
      delete tick.elem;
    }),
        tick = function () {
      if (stopped) {
        return false;
      }

      var currentTime = fxNow || createFxNow(),
          remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
          // Support: Android 2.3 only
      // Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
      temp = remaining / animation.duration || 0,
          percent = 1 - temp,
          index = 0,
          length = animation.tweens.length;

      for (; index < length; index++) {
        animation.tweens[index].run(percent);
      }

      deferred.notifyWith(elem, [animation, percent, remaining]); // If there's more to do, yield

      if (percent < 1 && length) {
        return remaining;
      } // If this was an empty animation, synthesize a final progress notification


      if (!length) {
        deferred.notifyWith(elem, [animation, 1, 0]);
      } // Resolve the animation and report its conclusion


      deferred.resolveWith(elem, [animation]);
      return false;
    },
        animation = deferred.promise({
      elem: elem,
      props: jQuery.extend({}, properties),
      opts: jQuery.extend(true, {
        specialEasing: {},
        easing: jQuery.easing._default
      }, options),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function (prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        animation.tweens.push(tween);
        return tween;
      },
      stop: function (gotoEnd) {
        var index = 0,
            // If we are going to the end, we want to run all the tweens
        // otherwise we skip this part
        length = gotoEnd ? animation.tweens.length : 0;

        if (stopped) {
          return this;
        }

        stopped = true;

        for (; index < length; index++) {
          animation.tweens[index].run(1);
        } // Resolve when we played the last frame; otherwise, reject


        if (gotoEnd) {
          deferred.notifyWith(elem, [animation, 1, 0]);
          deferred.resolveWith(elem, [animation, gotoEnd]);
        } else {
          deferred.rejectWith(elem, [animation, gotoEnd]);
        }

        return this;
      }
    }),
        props = animation.props;

    propFilter(props, animation.opts.specialEasing);

    for (; index < length; index++) {
      result = Animation.prefilters[index].call(animation, elem, props, animation.opts);

      if (result) {
        if (isFunction(result.stop)) {
          jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
        }

        return result;
      }
    }

    jQuery.map(props, createTween, animation);

    if (isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    } // Attach callbacks from options


    animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    jQuery.fx.timer(jQuery.extend(tick, {
      elem: elem,
      anim: animation,
      queue: animation.opts.queue
    }));
    return animation;
  }

  jQuery.Animation = jQuery.extend(Animation, {
    tweeners: {
      "*": [function (prop, value) {
        var tween = this.createTween(prop, value);
        adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
        return tween;
      }]
    },
    tweener: function (props, callback) {
      if (isFunction(props)) {
        callback = props;
        props = ["*"];
      } else {
        props = props.match(rnothtmlwhite);
      }

      var prop,
          index = 0,
          length = props.length;

      for (; index < length; index++) {
        prop = props[index];
        Animation.tweeners[prop] = Animation.tweeners[prop] || [];
        Animation.tweeners[prop].unshift(callback);
      }
    },
    prefilters: [defaultPrefilter],
    prefilter: function (callback, prepend) {
      if (prepend) {
        Animation.prefilters.unshift(callback);
      } else {
        Animation.prefilters.push(callback);
      }
    }
  });

  jQuery.speed = function (speed, easing, fn) {
    var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
      complete: fn || !fn && easing || isFunction(speed) && speed,
      duration: speed,
      easing: fn && easing || easing && !isFunction(easing) && easing
    }; // Go to the end state if fx are off

    if (jQuery.fx.off) {
      opt.duration = 0;
    } else {
      if (typeof opt.duration !== "number") {
        if (opt.duration in jQuery.fx.speeds) {
          opt.duration = jQuery.fx.speeds[opt.duration];
        } else {
          opt.duration = jQuery.fx.speeds._default;
        }
      }
    } // Normalize opt.queue - true/undefined/null -> "fx"


    if (opt.queue == null || opt.queue === true) {
      opt.queue = "fx";
    } // Queueing


    opt.old = opt.complete;

    opt.complete = function () {
      if (isFunction(opt.old)) {
        opt.old.call(this);
      }

      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };

    return opt;
  };

  jQuery.fn.extend({
    fadeTo: function (speed, to, easing, callback) {
      // Show any hidden elements after setting opacity to 0
      return this.filter(isHiddenWithinTree).css("opacity", 0).show() // Animate to the value specified
      .end().animate({
        opacity: to
      }, speed, easing, callback);
    },
    animate: function (prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop),
          optall = jQuery.speed(speed, easing, callback),
          doAnimation = function () {
        // Operate on a copy of prop so per-property easing won't be lost
        var anim = Animation(this, jQuery.extend({}, prop), optall); // Empty animations, or finishing resolves immediately

        if (empty || dataPriv.get(this, "finish")) {
          anim.stop(true);
        }
      };

      doAnimation.finish = doAnimation;
      return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function (type, clearQueue, gotoEnd) {
      var stopQueue = function (hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };

      if (typeof type !== "string") {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }

      if (clearQueue && type !== false) {
        this.queue(type || "fx", []);
      }

      return this.each(function () {
        var dequeue = true,
            index = type != null && type + "queueHooks",
            timers = jQuery.timers,
            data = dataPriv.get(this);

        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }

        for (index = timers.length; index--;) {
          if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        } // Start the next in the queue if the last step wasn't forced.
        // Timers currently will call their complete callbacks, which
        // will dequeue but only if they were gotoEnd.


        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    finish: function (type) {
      if (type !== false) {
        type = type || "fx";
      }

      return this.each(function () {
        var index,
            data = dataPriv.get(this),
            queue = data[type + "queue"],
            hooks = data[type + "queueHooks"],
            timers = jQuery.timers,
            length = queue ? queue.length : 0; // Enable finishing flag on private data

        data.finish = true; // Empty the queue first

        jQuery.queue(this, type, []);

        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        } // Look for any active animations, and finish them


        for (index = timers.length; index--;) {
          if (timers[index].elem === this && timers[index].queue === type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        } // Look for any animations in the old queue and finish them


        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        } // Turn off finishing flag


        delete data.finish;
      });
    }
  });
  jQuery.each(["toggle", "show", "hide"], function (i, name) {
    var cssFn = jQuery.fn[name];

    jQuery.fn[name] = function (speed, easing, callback) {
      return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
    };
  }); // Generate shortcuts for custom animations

  jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function (name, props) {
    jQuery.fn[name] = function (speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });
  jQuery.timers = [];

  jQuery.fx.tick = function () {
    var timer,
        i = 0,
        timers = jQuery.timers;
    fxNow = Date.now();

    for (; i < timers.length; i++) {
      timer = timers[i]; // Run the timer and safely remove it when done (allowing for external removal)

      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }

    if (!timers.length) {
      jQuery.fx.stop();
    }

    fxNow = undefined;
  };

  jQuery.fx.timer = function (timer) {
    jQuery.timers.push(timer);
    jQuery.fx.start();
  };

  jQuery.fx.interval = 13;

  jQuery.fx.start = function () {
    if (inProgress) {
      return;
    }

    inProgress = true;
    schedule();
  };

  jQuery.fx.stop = function () {
    inProgress = null;
  };

  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  }; // Based off of the plugin by Clint Helfers, with permission.
  // https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/

  jQuery.fn.delay = function (time, type) {
    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
    type = type || "fx";
    return this.queue(type, function (next, hooks) {
      var timeout = window.setTimeout(next, time);

      hooks.stop = function () {
        window.clearTimeout(timeout);
      };
    });
  };

  (function () {
    var input = document.createElement("input"),
        select = document.createElement("select"),
        opt = select.appendChild(document.createElement("option"));
    input.type = "checkbox"; // Support: Android <=4.3 only
    // Default value for a checkbox should be "on"

    support.checkOn = input.value !== ""; // Support: IE <=11 only
    // Must access selectedIndex to make default options select

    support.optSelected = opt.selected; // Support: IE <=11 only
    // An input loses its value after becoming a radio

    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";
  })();

  var boolHook,
      attrHandle = jQuery.expr.attrHandle;
  jQuery.fn.extend({
    attr: function (name, value) {
      return access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr: function (name) {
      return this.each(function () {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    attr: function (elem, name, value) {
      var ret,
          hooks,
          nType = elem.nodeType; // Don't get/set attributes on text, comment and attribute nodes

      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      } // Fallback to prop when attributes are not supported


      if (typeof elem.getAttribute === "undefined") {
        return jQuery.prop(elem, name, value);
      } // Attribute hooks are determined by the lowercase version
      // Grab necessary hook if one is defined


      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
      }

      if (value !== undefined) {
        if (value === null) {
          jQuery.removeAttr(elem, name);
          return;
        }

        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        }

        elem.setAttribute(name, value + "");
        return value;
      }

      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }

      ret = jQuery.find.attr(elem, name); // Non-existent attributes return null, we normalize to undefined

      return ret == null ? undefined : ret;
    },
    attrHooks: {
      type: {
        set: function (elem, value) {
          if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
            var val = elem.value;
            elem.setAttribute("type", value);

            if (val) {
              elem.value = val;
            }

            return value;
          }
        }
      }
    },
    removeAttr: function (elem, value) {
      var name,
          i = 0,
          // Attribute names can contain non-HTML whitespace characters
      // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
      attrNames = value && value.match(rnothtmlwhite);

      if (attrNames && elem.nodeType === 1) {
        while (name = attrNames[i++]) {
          elem.removeAttribute(name);
        }
      }
    }
  }); // Hooks for boolean attributes

  boolHook = {
    set: function (elem, value, name) {
      if (value === false) {
        // Remove boolean attributes when set to false
        jQuery.removeAttr(elem, name);
      } else {
        elem.setAttribute(name, name);
      }

      return name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
    var getter = attrHandle[name] || jQuery.find.attr;

    attrHandle[name] = function (elem, name, isXML) {
      var ret,
          handle,
          lowercaseName = name.toLowerCase();

      if (!isXML) {
        // Avoid an infinite loop by temporarily removing this function from the getter
        handle = attrHandle[lowercaseName];
        attrHandle[lowercaseName] = ret;
        ret = getter(elem, name, isXML) != null ? lowercaseName : null;
        attrHandle[lowercaseName] = handle;
      }

      return ret;
    };
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i,
      rclickable = /^(?:a|area)$/i;
  jQuery.fn.extend({
    prop: function (name, value) {
      return access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp: function (name) {
      return this.each(function () {
        delete this[jQuery.propFix[name] || name];
      });
    }
  });
  jQuery.extend({
    prop: function (elem, name, value) {
      var ret,
          hooks,
          nType = elem.nodeType; // Don't get/set properties on text, comment and attribute nodes

      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }

      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        // Fix name and attach hooks
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }

      if (value !== undefined) {
        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        }

        return elem[name] = value;
      }

      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }

      return elem[name];
    },
    propHooks: {
      tabIndex: {
        get: function (elem) {
          // Support: IE <=9 - 11 only
          // elem.tabIndex doesn't always return the
          // correct value when it hasn't been explicitly set
          // https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
          // Use proper attribute retrieval(#12072)
          var tabindex = jQuery.find.attr(elem, "tabindex");

          if (tabindex) {
            return parseInt(tabindex, 10);
          }

          if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
            return 0;
          }

          return -1;
        }
      }
    },
    propFix: {
      "for": "htmlFor",
      "class": "className"
    }
  }); // Support: IE <=11 only
  // Accessing the selectedIndex property
  // forces the browser to respect setting selected
  // on the option
  // The getter ensures a default option is selected
  // when in an optgroup
  // eslint rule "no-unused-expressions" is disabled for this code
  // since it considers such accessions noop

  if (!support.optSelected) {
    jQuery.propHooks.selected = {
      get: function (elem) {
        /* eslint no-unused-expressions: "off" */
        var parent = elem.parentNode;

        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }

        return null;
      },
      set: function (elem) {
        /* eslint no-unused-expressions: "off" */
        var parent = elem.parentNode;

        if (parent) {
          parent.selectedIndex;

          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      }
    };
  }

  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    jQuery.propFix[this.toLowerCase()] = this;
  }); // Strip and collapse whitespace according to HTML spec
  // https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace

  function stripAndCollapse(value) {
    var tokens = value.match(rnothtmlwhite) || [];
    return tokens.join(" ");
  }

  function getClass(elem) {
    return elem.getAttribute && elem.getAttribute("class") || "";
  }

  function classesToArray(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value.match(rnothtmlwhite) || [];
    }

    return [];
  }

  jQuery.fn.extend({
    addClass: function (value) {
      var classes,
          elem,
          cur,
          curValue,
          clazz,
          j,
          finalValue,
          i = 0;

      if (isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).addClass(value.call(this, j, getClass(this)));
        });
      }

      classes = classesToArray(value);

      if (classes.length) {
        while (elem = this[i++]) {
          curValue = getClass(elem);
          cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

          if (cur) {
            j = 0;

            while (clazz = classes[j++]) {
              if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
              }
            } // Only assign if different to avoid unneeded rendering.


            finalValue = stripAndCollapse(cur);

            if (curValue !== finalValue) {
              elem.setAttribute("class", finalValue);
            }
          }
        }
      }

      return this;
    },
    removeClass: function (value) {
      var classes,
          elem,
          cur,
          curValue,
          clazz,
          j,
          finalValue,
          i = 0;

      if (isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).removeClass(value.call(this, j, getClass(this)));
        });
      }

      if (!arguments.length) {
        return this.attr("class", "");
      }

      classes = classesToArray(value);

      if (classes.length) {
        while (elem = this[i++]) {
          curValue = getClass(elem); // This expression is here for better compressibility (see addClass)

          cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

          if (cur) {
            j = 0;

            while (clazz = classes[j++]) {
              // Remove *all* instances
              while (cur.indexOf(" " + clazz + " ") > -1) {
                cur = cur.replace(" " + clazz + " ", " ");
              }
            } // Only assign if different to avoid unneeded rendering.


            finalValue = stripAndCollapse(cur);

            if (curValue !== finalValue) {
              elem.setAttribute("class", finalValue);
            }
          }
        }
      }

      return this;
    },
    toggleClass: function (value, stateVal) {
      var type = typeof value,
          isValidValue = type === "string" || Array.isArray(value);

      if (typeof stateVal === "boolean" && isValidValue) {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }

      if (isFunction(value)) {
        return this.each(function (i) {
          jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
        });
      }

      return this.each(function () {
        var className, i, self, classNames;

        if (isValidValue) {
          // Toggle individual class names
          i = 0;
          self = jQuery(this);
          classNames = classesToArray(value);

          while (className = classNames[i++]) {
            // Check each className given, space separated list
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          } // Toggle whole class name

        } else if (value === undefined || type === "boolean") {
          className = getClass(this);

          if (className) {
            // Store className if set
            dataPriv.set(this, "__className__", className);
          } // If the element has a class name or if we're passed `false`,
          // then remove the whole classname (if there was one, the above saved it).
          // Otherwise bring back whatever was previously saved (if anything),
          // falling back to the empty string if nothing was stored.


          if (this.setAttribute) {
            this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
          }
        }
      });
    },
    hasClass: function (selector) {
      var className,
          elem,
          i = 0;
      className = " " + selector + " ";

      while (elem = this[i++]) {
        if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
          return true;
        }
      }

      return false;
    }
  });
  var rreturn = /\r/g;
  jQuery.fn.extend({
    val: function (value) {
      var hooks,
          ret,
          valueIsFunction,
          elem = this[0];

      if (!arguments.length) {
        if (elem) {
          hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

          if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
            return ret;
          }

          ret = elem.value; // Handle most common string cases

          if (typeof ret === "string") {
            return ret.replace(rreturn, "");
          } // Handle cases where value is null/undef or number


          return ret == null ? "" : ret;
        }

        return;
      }

      valueIsFunction = isFunction(value);
      return this.each(function (i) {
        var val;

        if (this.nodeType !== 1) {
          return;
        }

        if (valueIsFunction) {
          val = value.call(this, i, jQuery(this).val());
        } else {
          val = value;
        } // Treat null/undefined as ""; convert numbers to string


        if (val == null) {
          val = "";
        } else if (typeof val === "number") {
          val += "";
        } else if (Array.isArray(val)) {
          val = jQuery.map(val, function (value) {
            return value == null ? "" : value + "";
          });
        }

        hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]; // If set returns undefined, fall back to normal setting

        if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
          this.value = val;
        }
      });
    }
  });
  jQuery.extend({
    valHooks: {
      option: {
        get: function (elem) {
          var val = jQuery.find.attr(elem, "value");
          return val != null ? val : // Support: IE <=10 - 11 only
          // option.text throws exceptions (#14686, #14858)
          // Strip and collapse whitespace
          // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
          stripAndCollapse(jQuery.text(elem));
        }
      },
      select: {
        get: function (elem) {
          var value,
              option,
              i,
              options = elem.options,
              index = elem.selectedIndex,
              one = elem.type === "select-one",
              values = one ? null : [],
              max = one ? index + 1 : options.length;

          if (index < 0) {
            i = max;
          } else {
            i = one ? index : 0;
          } // Loop through all the selected options


          for (; i < max; i++) {
            option = options[i]; // Support: IE <=9 only
            // IE8-9 doesn't update selected after form reset (#2551)

            if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
            !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
              // Get the specific value for the option
              value = jQuery(option).val(); // We don't need an array for one selects

              if (one) {
                return value;
              } // Multi-Selects return an array


              values.push(value);
            }
          }

          return values;
        },
        set: function (elem, value) {
          var optionSet,
              option,
              options = elem.options,
              values = jQuery.makeArray(value),
              i = options.length;

          while (i--) {
            option = options[i];
            /* eslint-disable no-cond-assign */

            if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
              optionSet = true;
            }
            /* eslint-enable no-cond-assign */

          } // Force browsers to behave consistently when non-matching value is set


          if (!optionSet) {
            elem.selectedIndex = -1;
          }

          return values;
        }
      }
    }
  }); // Radios and checkboxes getter/setter

  jQuery.each(["radio", "checkbox"], function () {
    jQuery.valHooks[this] = {
      set: function (elem, value) {
        if (Array.isArray(value)) {
          return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
        }
      }
    };

    if (!support.checkOn) {
      jQuery.valHooks[this].get = function (elem) {
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  }); // Return jQuery for attributes-only inclusion

  support.focusin = "onfocusin" in window;

  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
      stopPropagationCallback = function (e) {
    e.stopPropagation();
  };

  jQuery.extend(jQuery.event, {
    trigger: function (event, data, elem, onlyHandlers) {
      var i,
          cur,
          tmp,
          bubbleType,
          ontype,
          handle,
          special,
          lastElement,
          eventPath = [elem || document],
          type = hasOwn.call(event, "type") ? event.type : event,
          namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      cur = lastElement = tmp = elem = elem || document; // Don't do events on text and comment nodes

      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      } // focus/blur morphs to focusin/out; ensure we're not firing them right now


      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }

      if (type.indexOf(".") > -1) {
        // Namespaced trigger; create a regexp to match event type in handle()
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }

      ontype = type.indexOf(":") < 0 && "on" + type; // Caller can pass in a jQuery.Event object, Object, or just an event type string

      event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event); // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)

      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null; // Clean up the event in case it is being reused

      event.result = undefined;

      if (!event.target) {
        event.target = elem;
      } // Clone any incoming data and prepend the event, creating the handler arg list


      data = data == null ? [event] : jQuery.makeArray(data, [event]); // Allow special events to draw outside the lines

      special = jQuery.event.special[type] || {};

      if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      } // Determine event propagation path in advance, per W3C events spec (#9951)
      // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)


      if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
        bubbleType = special.delegateType || type;

        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }

        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        } // Only add window if we got to document (e.g., not plain obj or detached DOM)


        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      } // Fire handlers on the event path


      i = 0;

      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
        lastElement = cur;
        event.type = i > 1 ? bubbleType : special.bindType || type; // jQuery handler

        handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");

        if (handle) {
          handle.apply(cur, data);
        } // Native handler


        handle = ontype && cur[ontype];

        if (handle && handle.apply && acceptData(cur)) {
          event.result = handle.apply(cur, data);

          if (event.result === false) {
            event.preventDefault();
          }
        }
      }

      event.type = type; // If nobody prevented the default action, do it now

      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
          // Call a native DOM method on the target with the same name as the event.
          // Don't do default actions on window, that's where global variables be (#6170)
          if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
            // Don't re-trigger an onFOO event when we call its FOO() method
            tmp = elem[ontype];

            if (tmp) {
              elem[ontype] = null;
            } // Prevent re-triggering of the same event, since we already bubbled it above


            jQuery.event.triggered = type;

            if (event.isPropagationStopped()) {
              lastElement.addEventListener(type, stopPropagationCallback);
            }

            elem[type]();

            if (event.isPropagationStopped()) {
              lastElement.removeEventListener(type, stopPropagationCallback);
            }

            jQuery.event.triggered = undefined;

            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }

      return event.result;
    },
    // Piggyback on a donor event to simulate a different one
    // Used only for `focus(in | out)` events
    simulate: function (type, elem, event) {
      var e = jQuery.extend(new jQuery.Event(), event, {
        type: type,
        isSimulated: true
      });
      jQuery.event.trigger(e, null, elem);
    }
  });
  jQuery.fn.extend({
    trigger: function (type, data) {
      return this.each(function () {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function (type, data) {
      var elem = this[0];

      if (elem) {
        return jQuery.event.trigger(type, data, elem, true);
      }
    }
  }); // Support: Firefox <=44
  // Firefox doesn't have focus(in | out) events
  // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
  //
  // Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
  // focus(in | out) events fire after focus & blur events,
  // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
  // Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857

  if (!support.focusin) {
    jQuery.each({
      focus: "focusin",
      blur: "focusout"
    }, function (orig, fix) {
      // Attach a single capturing handler on the document while someone wants focusin/focusout
      var handler = function (event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
      };

      jQuery.event.special[fix] = {
        setup: function () {
          var doc = this.ownerDocument || this,
              attaches = dataPriv.access(doc, fix);

          if (!attaches) {
            doc.addEventListener(orig, handler, true);
          }

          dataPriv.access(doc, fix, (attaches || 0) + 1);
        },
        teardown: function () {
          var doc = this.ownerDocument || this,
              attaches = dataPriv.access(doc, fix) - 1;

          if (!attaches) {
            doc.removeEventListener(orig, handler, true);
            dataPriv.remove(doc, fix);
          } else {
            dataPriv.access(doc, fix, attaches);
          }
        }
      };
    });
  }

  var location = window.location;
  var nonce = Date.now();
  var rquery = /\?/; // Cross-browser xml parsing

  jQuery.parseXML = function (data) {
    var xml;

    if (!data || typeof data !== "string") {
      return null;
    } // Support: IE 9 - 11 only
    // IE throws on parseFromString with invalid input.


    try {
      xml = new window.DOMParser().parseFromString(data, "text/xml");
    } catch (e) {
      xml = undefined;
    }

    if (!xml || xml.getElementsByTagName("parsererror").length) {
      jQuery.error("Invalid XML: " + data);
    }

    return xml;
  };

  var rbracket = /\[\]$/,
      rCRLF = /\r?\n/g,
      rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
      rsubmittable = /^(?:input|select|textarea|keygen)/i;

  function buildParams(prefix, obj, traditional, add) {
    var name;

    if (Array.isArray(obj)) {
      // Serialize array item.
      jQuery.each(obj, function (i, v) {
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v);
        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
        }
      });
    } else if (!traditional && toType(obj) === "object") {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  } // Serialize an array of form elements or a set of
  // key/values into a query string


  jQuery.param = function (a, traditional) {
    var prefix,
        s = [],
        add = function (key, valueOrFunction) {
      // If value is a function, invoke it and use its return value
      var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
      s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
    }; // If an array was passed in, assume that it is an array of form elements.


    if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      // Serialize the form elements
      jQuery.each(a, function () {
        add(this.name, this.value);
      });
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    } // Return the resulting serialization


    return s.join("&");
  };

  jQuery.fn.extend({
    serialize: function () {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        // Can add propHook for "elements" to filter or add form elements
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function () {
        var type = this.type; // Use .is( ":disabled" ) so that fieldset[disabled] works

        return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
      }).map(function (i, elem) {
        var val = jQuery(this).val();

        if (val == null) {
          return null;
        }

        if (Array.isArray(val)) {
          return jQuery.map(val, function (val) {
            return {
              name: elem.name,
              value: val.replace(rCRLF, "\r\n")
            };
          });
        }

        return {
          name: elem.name,
          value: val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  var r20 = /%20/g,
      rhash = /#.*$/,
      rantiCache = /([?&])_=[^&]*/,
      rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
      // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      rnoContent = /^(?:GET|HEAD)$/,
      rprotocol = /^\/\//,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},
      // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  allTypes = "*/".concat("*"),
      // Anchor tag for parsing the document origin
  originAnchor = document.createElement("a");
  originAnchor.href = location.href; // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport

  function addToPrefiltersOrTransports(structure) {
    // dataTypeExpression is optional and defaults to "*"
    return function (dataTypeExpression, func) {
      if (typeof dataTypeExpression !== "string") {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }

      var dataType,
          i = 0,
          dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

      if (isFunction(func)) {
        // For each dataType in the dataTypeExpression
        while (dataType = dataTypes[i++]) {
          // Prepend if requested
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || []).unshift(func); // Otherwise append
          } else {
            (structure[dataType] = structure[dataType] || []).push(func);
          }
        }
      }
    };
  } // Base inspection function for prefilters and transports


  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    var inspected = {},
        seekingTransport = structure === transports;

    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);

        if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }

    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
  } // A special extend for ajax options
  // that takes "flat" options (not to be deep extended)
  // Fixes #9887


  function ajaxExtend(target, src) {
    var key,
        deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};

    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }

    if (deep) {
      jQuery.extend(true, target, deep);
    }

    return target;
  }
  /* Handles responses to an ajax request:
   * - finds the right dataType (mediates between content-type and expected dataType)
   * - returns the corresponding response
   */


  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct,
        type,
        finalDataType,
        firstDataType,
        contents = s.contents,
        dataTypes = s.dataTypes; // Remove auto dataType and get content-type in the process

    while (dataTypes[0] === "*") {
      dataTypes.shift();

      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    } // Check if we're dealing with a known content-type


    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    } // Check to see if we have a response for the expected dataType


    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      // Try convertible dataTypes
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }

        if (!firstDataType) {
          firstDataType = type;
        }
      } // Or just use first one


      finalDataType = finalDataType || firstDataType;
    } // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response


    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }

      return responses[finalDataType];
    }
  }
  /* Chain conversions given the request and the original response
   * Also sets the responseXXX fields on the jqXHR instance
   */


  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2,
        current,
        conv,
        tmp,
        prev,
        converters = {},
        // Work with a copy of dataTypes in case we need to modify it for conversion
    dataTypes = s.dataTypes.slice(); // Create converters map with lowercased keys

    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }

    current = dataTypes.shift(); // Convert to each sequential dataType

    while (current) {
      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response;
      } // Apply the dataFilter if provided


      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }

      prev = current;
      current = dataTypes.shift();

      if (current) {
        // There's only work to do if current dataType is non-auto
        if (current === "*") {
          current = prev; // Convert response if prev dataType is non-auto and differs from current
        } else if (prev !== "*" && prev !== current) {
          // Seek a direct converter
          conv = converters[prev + " " + current] || converters["* " + current]; // If none found, seek a pair

          if (!conv) {
            for (conv2 in converters) {
              // If conv2 outputs current
              tmp = conv2.split(" ");

              if (tmp[1] === current) {
                // If prev can be converted to accepted input
                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];

                if (conv) {
                  // Condense equivalence converters
                  if (conv === true) {
                    conv = converters[conv2]; // Otherwise, insert the intermediate dataType
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }

                  break;
                }
              }
            }
          } // Apply converter (if not an equivalence)


          if (conv !== true) {
            // Unless errors are allowed to bubble, catch and return them
            if (conv && s.throws) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv ? e : "No conversion from " + prev + " to " + current
                };
              }
            }
          }
        }
      }
    }

    return {
      state: "success",
      data: response
    };
  }

  jQuery.extend({
    // Counter for holding the number of active queries
    active: 0,
    // Last-Modified header cache for next request
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: location.href,
      type: "GET",
      isLocal: rlocalProtocol.test(location.protocol),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",

      /*
      timeout: 0,
      data: null,
      dataType: null,
      username: null,
      password: null,
      cache: null,
      throws: false,
      traditional: false,
      headers: {},
      */
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /\bxml\b/,
        html: /\bhtml/,
        json: /\bjson\b/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      // Data converters
      // Keys separate source (or catchall "*") and destination types with a single space
      converters: {
        // Convert anything to text
        "* text": String,
        // Text to html (true = no transformation)
        "text html": true,
        // Evaluate text as a json expression
        "text json": JSON.parse,
        // Parse text as xml
        "text xml": jQuery.parseXML
      },
      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
        url: true,
        context: true
      }
    },
    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function (target, settings) {
      return settings ? // Building a settings object
      ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : // Extending ajaxSettings
      ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    // Main method
    ajax: function (url, options) {
      // If url is an object, simulate pre-1.5 signature
      if (typeof url === "object") {
        options = url;
        url = undefined;
      } // Force options to be an object


      options = options || {};
      var transport,
          // URL without anti-cache param
      cacheURL,
          // Response headers
      responseHeadersString,
          responseHeaders,
          // timeout handle
      timeoutTimer,
          // Url cleanup var
      urlAnchor,
          // Request state (becomes false upon send and true upon completion)
      completed,
          // To know if global events are to be dispatched
      fireGlobals,
          // Loop variable
      i,
          // uncached part of the url
      uncached,
          // Create the final options object
      s = jQuery.ajaxSetup({}, options),
          // Callbacks context
      callbackContext = s.context || s,
          // Context for global events is callbackContext if it is a DOM node or jQuery collection
      globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
          // Deferreds
      deferred = jQuery.Deferred(),
          completeDeferred = jQuery.Callbacks("once memory"),
          // Status-dependent callbacks
      statusCode = s.statusCode || {},
          // Headers (they are sent all at once)
      requestHeaders = {},
          requestHeadersNames = {},
          // Default abort message
      strAbort = "canceled",
          // Fake xhr
      jqXHR = {
        readyState: 0,
        // Builds headers hashtable if needed
        getResponseHeader: function (key) {
          var match;

          if (completed) {
            if (!responseHeaders) {
              responseHeaders = {};

              while (match = rheaders.exec(responseHeadersString)) {
                responseHeaders[match[1].toLowerCase()] = match[2];
              }
            }

            match = responseHeaders[key.toLowerCase()];
          }

          return match == null ? null : match;
        },
        // Raw string
        getAllResponseHeaders: function () {
          return completed ? responseHeadersString : null;
        },
        // Caches the header
        setRequestHeader: function (name, value) {
          if (completed == null) {
            name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
            requestHeaders[name] = value;
          }

          return this;
        },
        // Overrides response content-type header
        overrideMimeType: function (type) {
          if (completed == null) {
            s.mimeType = type;
          }

          return this;
        },
        // Status-dependent callbacks
        statusCode: function (map) {
          var code;

          if (map) {
            if (completed) {
              // Execute the appropriate callbacks
              jqXHR.always(map[jqXHR.status]);
            } else {
              // Lazy-add the new callbacks in a way that preserves old ones
              for (code in map) {
                statusCode[code] = [statusCode[code], map[code]];
              }
            }
          }

          return this;
        },
        // Cancel the request
        abort: function (statusText) {
          var finalText = statusText || strAbort;

          if (transport) {
            transport.abort(finalText);
          }

          done(0, finalText);
          return this;
        }
      }; // Attach deferreds

      deferred.promise(jqXHR); // Add protocol if not provided (prefilters might expect it)
      // Handle falsy url in the settings object (#10093: consistency with old signature)
      // We also use the url parameter if available

      s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//"); // Alias method option to type as per ticket #12004

      s.type = options.method || options.type || s.method || s.type; // Extract dataTypes list

      s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""]; // A cross-domain request is in order when the origin doesn't match the current origin.

      if (s.crossDomain == null) {
        urlAnchor = document.createElement("a"); // Support: IE <=8 - 11, Edge 12 - 15
        // IE throws exception on accessing the href property if url is malformed,
        // e.g. http://example.com:80x/

        try {
          urlAnchor.href = s.url; // Support: IE <=8 - 11 only
          // Anchor's host property isn't correctly set when s.url is relative

          urlAnchor.href = urlAnchor.href;
          s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
        } catch (e) {
          // If there is an error parsing the URL, assume it is crossDomain,
          // it can be rejected by the transport if it is invalid
          s.crossDomain = true;
        }
      } // Convert data if not already a string


      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = jQuery.param(s.data, s.traditional);
      } // Apply prefilters


      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR); // If request was aborted inside a prefilter, stop there

      if (completed) {
        return jqXHR;
      } // We can fire global events as of now if asked to
      // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)


      fireGlobals = jQuery.event && s.global; // Watch for a new set of requests

      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger("ajaxStart");
      } // Uppercase the type


      s.type = s.type.toUpperCase(); // Determine if request has content

      s.hasContent = !rnoContent.test(s.type); // Save the URL in case we're toying with the If-Modified-Since
      // and/or If-None-Match header later on
      // Remove hash to simplify url manipulation

      cacheURL = s.url.replace(rhash, ""); // More options handling for requests with no content

      if (!s.hasContent) {
        // Remember the hash so we can put it back
        uncached = s.url.slice(cacheURL.length); // If data is available and should be processed, append data to url

        if (s.data && (s.processData || typeof s.data === "string")) {
          cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data; // #9682: remove data so that it's not used in an eventual retry

          delete s.data;
        } // Add or update anti-cache param if needed


        if (s.cache === false) {
          cacheURL = cacheURL.replace(rantiCache, "$1");
          uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++ + uncached;
        } // Put hash and anti-cache on the URL that will be requested (gh-1732)


        s.url = cacheURL + uncached; // Change '%20' to '+' if this is encoded form body content (gh-2658)
      } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
        s.data = s.data.replace(r20, "+");
      } // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.


      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }

        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      } // Set the correct header, if data is being sent


      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      } // Set the Accepts header for the server, depending on the dataType


      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]); // Check for headers option

      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      } // Allow custom headers/mimetypes and early abort


      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {
        // Abort if not done already and return
        return jqXHR.abort();
      } // Aborting is no longer a cancellation


      strAbort = "abort"; // Install callbacks on deferreds

      completeDeferred.add(s.complete);
      jqXHR.done(s.success);
      jqXHR.fail(s.error); // Get transport

      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR); // If no transport, we auto-abort

      if (!transport) {
        done(-1, "No Transport");
      } else {
        jqXHR.readyState = 1; // Send global event

        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        } // If request was aborted inside ajaxSend, stop there


        if (completed) {
          return jqXHR;
        } // Timeout


        if (s.async && s.timeout > 0) {
          timeoutTimer = window.setTimeout(function () {
            jqXHR.abort("timeout");
          }, s.timeout);
        }

        try {
          completed = false;
          transport.send(requestHeaders, done);
        } catch (e) {
          // Rethrow post-completion exceptions
          if (completed) {
            throw e;
          } // Propagate others as results


          done(-1, e);
        }
      } // Callback for when everything is done


      function done(status, nativeStatusText, responses, headers) {
        var isSuccess,
            success,
            error,
            response,
            modified,
            statusText = nativeStatusText; // Ignore repeat invocations

        if (completed) {
          return;
        }

        completed = true; // Clear timeout if it exists

        if (timeoutTimer) {
          window.clearTimeout(timeoutTimer);
        } // Dereference transport for early garbage collection
        // (no matter how long the jqXHR object will be used)


        transport = undefined; // Cache response headers

        responseHeadersString = headers || ""; // Set readyState

        jqXHR.readyState = status > 0 ? 4 : 0; // Determine if successful

        isSuccess = status >= 200 && status < 300 || status === 304; // Get response data

        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        } // Convert no matter what (that way responseXXX fields are always set)


        response = ajaxConvert(s, response, jqXHR, isSuccess); // If successful, handle type chaining

        if (isSuccess) {
          // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader("Last-Modified");

            if (modified) {
              jQuery.lastModified[cacheURL] = modified;
            }

            modified = jqXHR.getResponseHeader("etag");

            if (modified) {
              jQuery.etag[cacheURL] = modified;
            }
          } // if no content


          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent"; // if not modified
          } else if (status === 304) {
            statusText = "notmodified"; // If we have data, let's convert it
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          // Extract error from statusText and normalize for non-aborts
          error = statusText;

          if (status || !statusText) {
            statusText = "error";

            if (status < 0) {
              status = 0;
            }
          }
        } // Set data for the fake xhr object


        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + ""; // Success/Error

        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
        } else {
          deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
        } // Status-dependent callbacks


        jqXHR.statusCode(statusCode);
        statusCode = undefined;

        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
        } // Complete


        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [jqXHR, s]); // Handle the global AJAX counter

          if (! --jQuery.active) {
            jQuery.event.trigger("ajaxStop");
          }
        }
      }

      return jqXHR;
    },
    getJSON: function (url, data, callback) {
      return jQuery.get(url, data, callback, "json");
    },
    getScript: function (url, callback) {
      return jQuery.get(url, undefined, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
      // Shift arguments if data argument was omitted
      if (isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      } // The url can be an options object (which then must have .url)


      return jQuery.ajax(jQuery.extend({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      }, jQuery.isPlainObject(url) && url));
    };
  });

  jQuery._evalUrl = function (url) {
    return jQuery.ajax({
      url: url,
      // Make this explicit, since user can override this through ajaxSetup (#11264)
      type: "GET",
      dataType: "script",
      cache: true,
      async: false,
      global: false,
      "throws": true
    });
  };

  jQuery.fn.extend({
    wrapAll: function (html) {
      var wrap;

      if (this[0]) {
        if (isFunction(html)) {
          html = html.call(this[0]);
        } // The elements to wrap the target around


        wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }

        wrap.map(function () {
          var elem = this;

          while (elem.firstElementChild) {
            elem = elem.firstElementChild;
          }

          return elem;
        }).append(this);
      }

      return this;
    },
    wrapInner: function (html) {
      if (isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }

      return this.each(function () {
        var self = jQuery(this),
            contents = self.contents();

        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function (html) {
      var htmlIsFunction = isFunction(html);
      return this.each(function (i) {
        jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function (selector) {
      this.parent(selector).not("body").each(function () {
        jQuery(this).replaceWith(this.childNodes);
      });
      return this;
    }
  });

  jQuery.expr.pseudos.hidden = function (elem) {
    return !jQuery.expr.pseudos.visible(elem);
  };

  jQuery.expr.pseudos.visible = function (elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  };

  jQuery.ajaxSettings.xhr = function () {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {}
  };

  var xhrSuccessStatus = {
    // File protocol always yields status code 0, assume 200
    0: 200,
    // Support: IE <=9 only
    // #1450: sometimes IE returns 1223 when it should be 204
    1223: 204
  },
      xhrSupported = jQuery.ajaxSettings.xhr();
  support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
  support.ajax = xhrSupported = !!xhrSupported;
  jQuery.ajaxTransport(function (options) {
    var callback, errorCallback; // Cross domain only allowed if supported through XMLHttpRequest

    if (support.cors || xhrSupported && !options.crossDomain) {
      return {
        send: function (headers, complete) {
          var i,
              xhr = options.xhr();
          xhr.open(options.type, options.url, options.async, options.username, options.password); // Apply custom fields if provided

          if (options.xhrFields) {
            for (i in options.xhrFields) {
              xhr[i] = options.xhrFields[i];
            }
          } // Override mime type if needed


          if (options.mimeType && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          } // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.


          if (!options.crossDomain && !headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          } // Set headers


          for (i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          } // Callback


          callback = function (type) {
            return function () {
              if (callback) {
                callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;

                if (type === "abort") {
                  xhr.abort();
                } else if (type === "error") {
                  // Support: IE <=9 only
                  // On a manual native abort, IE9 throws
                  // errors on any property access that is not readyState
                  if (typeof xhr.status !== "number") {
                    complete(0, "error");
                  } else {
                    complete( // File: protocol always yields status 0; see #8605, #14207
                    xhr.status, xhr.statusText);
                  }
                } else {
                  complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, // Support: IE <=9 only
                  // IE9 has no XHR2 but throws on binary (trac-11426)
                  // For XHR2 non-text, let the caller handle it (gh-2498)
                  (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? {
                    binary: xhr.response
                  } : {
                    text: xhr.responseText
                  }, xhr.getAllResponseHeaders());
                }
              }
            };
          }; // Listen to events


          xhr.onload = callback();
          errorCallback = xhr.onerror = xhr.ontimeout = callback("error"); // Support: IE 9 only
          // Use onreadystatechange to replace onabort
          // to handle uncaught aborts

          if (xhr.onabort !== undefined) {
            xhr.onabort = errorCallback;
          } else {
            xhr.onreadystatechange = function () {
              // Check readyState before timeout as it changes
              if (xhr.readyState === 4) {
                // Allow onerror to be called first,
                // but that will not handle a native abort
                // Also, save errorCallback to a variable
                // as xhr.onerror cannot be accessed
                window.setTimeout(function () {
                  if (callback) {
                    errorCallback();
                  }
                });
              }
            };
          } // Create the abort callback


          callback = callback("abort");

          try {
            // Do send the request (this may raise an exception)
            xhr.send(options.hasContent && options.data || null);
          } catch (e) {
            // #14683: Only rethrow if this hasn't been notified as an error yet
            if (callback) {
              throw e;
            }
          }
        },
        abort: function () {
          if (callback) {
            callback();
          }
        }
      };
    }
  }); // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)

  jQuery.ajaxPrefilter(function (s) {
    if (s.crossDomain) {
      s.contents.script = false;
    }
  }); // Install script dataType

  jQuery.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /\b(?:java|ecma)script\b/
    },
    converters: {
      "text script": function (text) {
        jQuery.globalEval(text);
        return text;
      }
    }
  }); // Handle cache's special case and crossDomain

  jQuery.ajaxPrefilter("script", function (s) {
    if (s.cache === undefined) {
      s.cache = false;
    }

    if (s.crossDomain) {
      s.type = "GET";
    }
  }); // Bind script tag hack transport

  jQuery.ajaxTransport("script", function (s) {
    // This transport only deals with cross domain requests
    if (s.crossDomain) {
      var script, callback;
      return {
        send: function (_, complete) {
          script = jQuery("<script>").prop({
            charset: s.scriptCharset,
            src: s.url
          }).on("load error", callback = function (evt) {
            script.remove();
            callback = null;

            if (evt) {
              complete(evt.type === "error" ? 404 : 200, evt.type);
            }
          }); // Use native DOM manipulation to avoid our domManip AJAX trickery

          document.head.appendChild(script[0]);
        },
        abort: function () {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var oldCallbacks = [],
      rjsonp = /(=)\?(?=&|$)|\?\?/; // Default jsonp settings

  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
      this[callback] = true;
      return callback;
    }
  }); // Detect, normalize options and install callbacks for jsonp requests

  jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {
    var callbackName,
        overwritten,
        responseContainer,
        jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data"); // Handle iff the expected data type is "jsonp" or we have a parameter to set

    if (jsonProp || s.dataTypes[0] === "jsonp") {
      // Get callback name, remembering preexisting value associated with it
      callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback; // Insert callback into url or form data

      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
      } else if (s.jsonp !== false) {
        s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
      } // Use data converter to retrieve json after script execution


      s.converters["script json"] = function () {
        if (!responseContainer) {
          jQuery.error(callbackName + " was not called");
        }

        return responseContainer[0];
      }; // Force json dataType


      s.dataTypes[0] = "json"; // Install callback

      overwritten = window[callbackName];

      window[callbackName] = function () {
        responseContainer = arguments;
      }; // Clean-up function (fires after converters)


      jqXHR.always(function () {
        // If previous value didn't exist - remove it
        if (overwritten === undefined) {
          jQuery(window).removeProp(callbackName); // Otherwise restore preexisting value
        } else {
          window[callbackName] = overwritten;
        } // Save back as free


        if (s[callbackName]) {
          // Make sure that re-using the options doesn't screw things around
          s.jsonpCallback = originalSettings.jsonpCallback; // Save the callback name for future use

          oldCallbacks.push(callbackName);
        } // Call if it was a function and we have a response


        if (responseContainer && isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }

        responseContainer = overwritten = undefined;
      }); // Delegate to script

      return "script";
    }
  }); // Support: Safari 8 only
  // In Safari 8 documents created via document.implementation.createHTMLDocument
  // collapse sibling forms: the second one becomes a child of the first one.
  // Because of that, this security measure has to be disabled in Safari 8.
  // https://bugs.webkit.org/show_bug.cgi?id=137337

  support.createHTMLDocument = function () {
    var body = document.implementation.createHTMLDocument("").body;
    body.innerHTML = "<form></form><form></form>";
    return body.childNodes.length === 2;
  }(); // Argument "data" should be string of html
  // context (optional): If specified, the fragment will be created in this context,
  // defaults to document
  // keepScripts (optional): If true, will include scripts passed in the html string


  jQuery.parseHTML = function (data, context, keepScripts) {
    if (typeof data !== "string") {
      return [];
    }

    if (typeof context === "boolean") {
      keepScripts = context;
      context = false;
    }

    var base, parsed, scripts;

    if (!context) {
      // Stop scripts or inline event handlers from being executed immediately
      // by using document.implementation
      if (support.createHTMLDocument) {
        context = document.implementation.createHTMLDocument(""); // Set the base href for the created document
        // so any parsed elements with URLs
        // are based on the document's URL (gh-2965)

        base = context.createElement("base");
        base.href = document.location.href;
        context.head.appendChild(base);
      } else {
        context = document;
      }
    }

    parsed = rsingleTag.exec(data);
    scripts = !keepScripts && []; // Single tag

    if (parsed) {
      return [context.createElement(parsed[1])];
    }

    parsed = buildFragment([data], context, scripts);

    if (scripts && scripts.length) {
      jQuery(scripts).remove();
    }

    return jQuery.merge([], parsed.childNodes);
  };
  /**
   * Load a url into a page
   */


  jQuery.fn.load = function (url, params, callback) {
    var selector,
        type,
        response,
        self = this,
        off = url.indexOf(" ");

    if (off > -1) {
      selector = stripAndCollapse(url.slice(off));
      url = url.slice(0, off);
    } // If it's a function


    if (isFunction(params)) {
      // We assume that it's the callback
      callback = params;
      params = undefined; // Otherwise, build a param string
    } else if (params && typeof params === "object") {
      type = "POST";
    } // If we have elements to modify, make the request


    if (self.length > 0) {
      jQuery.ajax({
        url: url,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: type || "GET",
        dataType: "html",
        data: params
      }).done(function (responseText) {
        // Save response for use in complete callback
        response = arguments;
        self.html(selector ? // If a selector was specified, locate the right elements in a dummy div
        // Exclude scripts to avoid IE 'Permission Denied' errors
        jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : // Otherwise use the full result
        responseText); // If the request succeeds, this function gets "data", "status", "jqXHR"
        // but they are ignored because response was set above.
        // If it fails, this function gets "jqXHR", "status", "error"
      }).always(callback && function (jqXHR, status) {
        self.each(function () {
          callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
        });
      });
    }

    return this;
  }; // Attach a bunch of functions for handling common AJAX events


  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
    jQuery.fn[type] = function (fn) {
      return this.on(type, fn);
    };
  });

  jQuery.expr.pseudos.animated = function (elem) {
    return jQuery.grep(jQuery.timers, function (fn) {
      return elem === fn.elem;
    }).length;
  };

  jQuery.offset = {
    setOffset: function (elem, options, i) {
      var curPosition,
          curLeft,
          curCSSTop,
          curTop,
          curOffset,
          curCSSLeft,
          calculatePosition,
          position = jQuery.css(elem, "position"),
          curElem = jQuery(elem),
          props = {}; // Set position first, in-case top/left are set even on static elem

      if (position === "static") {
        elem.style.position = "relative";
      }

      curOffset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1; // Need to be able to calculate position if either
      // top or left is auto and position is either absolute or fixed

      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }

      if (isFunction(options)) {
        // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
        options = options.call(elem, i, jQuery.extend({}, curOffset));
      }

      if (options.top != null) {
        props.top = options.top - curOffset.top + curTop;
      }

      if (options.left != null) {
        props.left = options.left - curOffset.left + curLeft;
      }

      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    // offset() relates an element's border box to the document origin
    offset: function (options) {
      // Preserve chaining for setter
      if (arguments.length) {
        return options === undefined ? this : this.each(function (i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }

      var rect,
          win,
          elem = this[0];

      if (!elem) {
        return;
      } // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
      // Support: IE <=11 only
      // Running getBoundingClientRect on a
      // disconnected node in IE throws an error


      if (!elem.getClientRects().length) {
        return {
          top: 0,
          left: 0
        };
      } // Get document-relative position by adding viewport scroll to viewport-relative gBCR


      rect = elem.getBoundingClientRect();
      win = elem.ownerDocument.defaultView;
      return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      };
    },
    // position() relates an element's margin box to its offset parent's padding box
    // This corresponds to the behavior of CSS absolute positioning
    position: function () {
      if (!this[0]) {
        return;
      }

      var offsetParent,
          offset,
          doc,
          elem = this[0],
          parentOffset = {
        top: 0,
        left: 0
      }; // position:fixed elements are offset from the viewport, which itself always has zero offset

      if (jQuery.css(elem, "position") === "fixed") {
        // Assume position:fixed implies availability of getBoundingClientRect
        offset = elem.getBoundingClientRect();
      } else {
        offset = this.offset(); // Account for the *real* offset parent, which can be the document or its root element
        // when a statically positioned element is identified

        doc = elem.ownerDocument;
        offsetParent = elem.offsetParent || doc.documentElement;

        while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
          offsetParent = offsetParent.parentNode;
        }

        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
          // Incorporate borders into its offset, since they are outside its content origin
          parentOffset = jQuery(offsetParent).offset();
          parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
          parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
        }
      } // Subtract parent offsets and element margins


      return {
        top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
        left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
      };
    },
    // This method will return documentElement in the following cases:
    // 1) For the element inside the iframe without offsetParent, this method will return
    //    documentElement of the parent window
    // 2) For the hidden or detached element
    // 3) For body or html element, i.e. in case of the html node - it will return itself
    //
    // but those exceptions were never presented as a real life use-cases
    // and might be considered as more preferable results.
    //
    // This logic, however, is not guaranteed and can change at any point in the future
    offsetParent: function () {
      return this.map(function () {
        var offsetParent = this.offsetParent;

        while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
          offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || documentElement;
      });
    }
  }); // Create scrollLeft and scrollTop methods

  jQuery.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (method, prop) {
    var top = "pageYOffset" === prop;

    jQuery.fn[method] = function (val) {
      return access(this, function (elem, method, val) {
        // Coalesce documents and windows
        var win;

        if (isWindow(elem)) {
          win = elem;
        } else if (elem.nodeType === 9) {
          win = elem.defaultView;
        }

        if (val === undefined) {
          return win ? win[prop] : elem[method];
        }

        if (win) {
          win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
        } else {
          elem[method] = val;
        }
      }, method, val, arguments.length);
    };
  }); // Support: Safari <=7 - 9.1, Chrome <=37 - 49
  // Add the top/left cssHooks using jQuery.fn.position
  // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
  // Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
  // getComputedStyle returns percent when specified for top/left/bottom/right;
  // rather than make the css module depend on the offset module, just check for it here

  jQuery.each(["top", "left"], function (i, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
      if (computed) {
        computed = curCSS(elem, prop); // If curCSS returns percentage, fallback to offset

        return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
      }
    });
  }); // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods

  jQuery.each({
    Height: "height",
    Width: "width"
  }, function (name, type) {
    jQuery.each({
      padding: "inner" + name,
      content: type,
      "": "outer" + name
    }, function (defaultExtra, funcName) {
      // Margin is only for outerHeight, outerWidth
      jQuery.fn[funcName] = function (margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
            extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return access(this, function (elem, type, value) {
          var doc;

          if (isWindow(elem)) {
            // $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
            return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
          } // Get document width or height


          if (elem.nodeType === 9) {
            doc = elem.documentElement; // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
            // whichever is greatest

            return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
          }

          return value === undefined ? // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css(elem, type, extra) : // Set width or height on the element
          jQuery.style(elem, type, value, extra);
        }, type, chainable ? margin : undefined, chainable);
      };
    });
  });
  jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function (i, name) {
    // Handle event binding
    jQuery.fn[name] = function (data, fn) {
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    hover: function (fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }
  });
  jQuery.fn.extend({
    bind: function (types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function (selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
      // ( namespace ) or ( selector, types [, fn] )
      return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  }); // Bind a function to a context, optionally partially applying any
  // arguments.
  // jQuery.proxy is deprecated to promote standards (specifically Function#bind)
  // However, it is not slated for removal any time soon

  jQuery.proxy = function (fn, context) {
    var tmp, args, proxy;

    if (typeof context === "string") {
      tmp = fn[context];
      context = fn;
      fn = tmp;
    } // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.


    if (!isFunction(fn)) {
      return undefined;
    } // Simulated bind


    args = slice.call(arguments, 2);

    proxy = function () {
      return fn.apply(context || this, args.concat(slice.call(arguments)));
    }; // Set the guid of unique handler to the same of original handler, so it can be removed


    proxy.guid = fn.guid = fn.guid || jQuery.guid++;
    return proxy;
  };

  jQuery.holdReady = function (hold) {
    if (hold) {
      jQuery.readyWait++;
    } else {
      jQuery.ready(true);
    }
  };

  jQuery.isArray = Array.isArray;
  jQuery.parseJSON = JSON.parse;
  jQuery.nodeName = nodeName;
  jQuery.isFunction = isFunction;
  jQuery.isWindow = isWindow;
  jQuery.camelCase = camelCase;
  jQuery.type = toType;
  jQuery.now = Date.now;

  jQuery.isNumeric = function (obj) {
    // As of jQuery 3.0, isNumeric is limited to
    // strings and numbers (primitives or objects)
    // that can be coerced to finite numbers (gh-2662)
    var type = jQuery.type(obj);
    return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    !isNaN(obj - parseFloat(obj));
  }; // Register as a named AMD module, since jQuery can be concatenated with other
  // files that may use define, but not via a proper concatenation script that
  // understands anonymous AMD modules. A named AMD is safest and most robust
  // way to register. Lowercase jquery is used because AMD module names are
  // derived from file names, and jQuery is normally delivered in a lowercase
  // file name. Do this after creating the global so that if an AMD module wants
  // to call noConflict to hide this version of jQuery, it will work.
  // Note that for maximum portability, libraries that are not jQuery should
  // declare themselves as anonymous modules, and avoid setting a global if an
  // AMD loader is present. jQuery is a special case. For more information, see
  // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon


  if (typeof define === "function" && define.amd) {
    define("jquery", [], function () {
      return jQuery;
    });
  }

  var // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,
      // Map over the $ in case of overwrite
  _$ = window.$;

  jQuery.noConflict = function (deep) {
    if (window.$ === jQuery) {
      window.$ = _$;
    }

    if (deep && window.jQuery === jQuery) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  }; // Expose jQuery and $ identifiers, even in AMD
  // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
  // and CommonJS for browser emulators (#13566)


  if (!noGlobal) {
    window.jQuery = window.$ = jQuery;
  }

  return jQuery;
});
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS style for Browserify
    module.exports = factory;
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
      toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
      slice = Array.prototype.slice,
      nullLowestDeltaTimeout,
      lowestDelta;

  if ($.event.fixHooks) {
    for (var i = toFix.length; i;) {
      $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
    }
  }

  var special = $.event.special.mousewheel = {
    version: '3.1.9',
    setup: function () {
      if (this.addEventListener) {
        for (var i = toBind.length; i;) {
          this.addEventListener(toBind[--i], handler, false);
        }
      } else {
        this.onmousewheel = handler;
      } // Store the line height and page height for this particular element


      $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
      $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
    },
    teardown: function () {
      if (this.removeEventListener) {
        for (var i = toBind.length; i;) {
          this.removeEventListener(toBind[--i], handler, false);
        }
      } else {
        this.onmousewheel = null;
      }
    },
    getLineHeight: function (elem) {
      return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
    },
    getPageHeight: function (elem) {
      return $(elem).height();
    },
    settings: {
      adjustOldDeltas: true
    }
  };
  $.fn.extend({
    mousewheel: function (fn) {
      return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
    },
    unmousewheel: function (fn) {
      return this.unbind('mousewheel', fn);
    }
  });

  function handler(event) {
    var orgEvent = event || window.event,
        args = slice.call(arguments, 1),
        delta = 0,
        deltaX = 0,
        deltaY = 0,
        absDelta = 0;
    event = $.event.fix(orgEvent);
    event.type = 'mousewheel'; // Old school scrollwheel delta

    if ('detail' in orgEvent) {
      deltaY = orgEvent.detail * -1;
    }

    if ('wheelDelta' in orgEvent) {
      deltaY = orgEvent.wheelDelta;
    }

    if ('wheelDeltaY' in orgEvent) {
      deltaY = orgEvent.wheelDeltaY;
    }

    if ('wheelDeltaX' in orgEvent) {
      deltaX = orgEvent.wheelDeltaX * -1;
    } // Firefox < 17 horizontal scrolling related to DOMMouseScroll event


    if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
      deltaX = deltaY * -1;
      deltaY = 0;
    } // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy


    delta = deltaY === 0 ? deltaX : deltaY; // New school wheel delta (wheel event)

    if ('deltaY' in orgEvent) {
      deltaY = orgEvent.deltaY * -1;
      delta = deltaY;
    }

    if ('deltaX' in orgEvent) {
      deltaX = orgEvent.deltaX;

      if (deltaY === 0) {
        delta = deltaX * -1;
      }
    } // No change actually happened, no reason to go any further


    if (deltaY === 0 && deltaX === 0) {
      return;
    } // Need to convert lines and pages to pixels if we aren't already in pixels
    // There are three delta modes:
    //   * deltaMode 0 is by pixels, nothing to do
    //   * deltaMode 1 is by lines
    //   * deltaMode 2 is by pages


    if (orgEvent.deltaMode === 1) {
      var lineHeight = $.data(this, 'mousewheel-line-height');
      delta *= lineHeight;
      deltaY *= lineHeight;
      deltaX *= lineHeight;
    } else if (orgEvent.deltaMode === 2) {
      var pageHeight = $.data(this, 'mousewheel-page-height');
      delta *= pageHeight;
      deltaY *= pageHeight;
      deltaX *= pageHeight;
    } // Store lowest absolute delta to normalize the delta values


    absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

    if (!lowestDelta || absDelta < lowestDelta) {
      lowestDelta = absDelta; // Adjust older deltas if necessary

      if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
        lowestDelta /= 40;
      }
    } // Adjust older deltas if necessary


    if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
      // Divide all the things by 40!
      delta /= 40;
      deltaX /= 40;
      deltaY /= 40;
    } // Get a whole, normalized value for the deltas


    delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
    deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
    deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta); // Add information to the event object

    event.deltaX = deltaX;
    event.deltaY = deltaY;
    event.deltaFactor = lowestDelta; // Go ahead and set deltaMode to 0 since we converted to pixels
    // Although this is a little odd since we overwrite the deltaX/Y
    // properties with normalized deltas.

    event.deltaMode = 0; // Add event and delta to the front of the arguments

    args.unshift(event, delta, deltaX, deltaY); // Clearout lowestDelta after sometime to better
    // handle multiple device types that give different
    // a different lowestDelta
    // Ex: trackpad = 3 and mouse wheel = 120

    if (nullLowestDeltaTimeout) {
      clearTimeout(nullLowestDeltaTimeout);
    }

    nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
    return ($.event.dispatch || $.event.handle).apply(this, args);
  }

  function nullLowestDelta() {
    lowestDelta = null;
  }

  function shouldAdjustOldDeltas(orgEvent, absDelta) {
    // If this is an older event and the delta is divisable by 120,
    // then we are assuming that the browser is treating this as an
    // older mouse wheel event and that we should divide the deltas
    // by 40 to try and get a more usable deltaFactor.
    // Side note, this actually impacts the reported scroll distance
    // in older browsers and can cause scrolling to be slower than native.
    // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
    return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
  }
});
/*!
	autosize 4.0.2
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.autosize = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  var map = typeof Map === "function" ? new Map() : function () {
    var keys = [];
    var values = [];
    return {
      has: function has(key) {
        return keys.indexOf(key) > -1;
      },
      get: function get(key) {
        return values[keys.indexOf(key)];
      },
      set: function set(key, value) {
        if (keys.indexOf(key) === -1) {
          keys.push(key);
          values.push(value);
        }
      },
      delete: function _delete(key) {
        var index = keys.indexOf(key);

        if (index > -1) {
          keys.splice(index, 1);
          values.splice(index, 1);
        }
      }
    };
  }();

  var createEvent = function createEvent(name) {
    return new Event(name, {
      bubbles: true
    });
  };

  try {
    new Event('test');
  } catch (e) {
    // IE does not support `new Event()`
    createEvent = function createEvent(name) {
      var evt = document.createEvent('Event');
      evt.initEvent(name, true, false);
      return evt;
    };
  }

  function assign(ta) {
    if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;
    var heightOffset = null;
    var clientWidth = null;
    var cachedHeight = null;

    function init() {
      var style = window.getComputedStyle(ta, null);

      if (style.resize === 'vertical') {
        ta.style.resize = 'none';
      } else if (style.resize === 'both') {
        ta.style.resize = 'horizontal';
      }

      if (style.boxSizing === 'content-box') {
        heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
      } else {
        heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      } // Fix when a textarea is not on document body and heightOffset is Not a Number


      if (isNaN(heightOffset)) {
        heightOffset = 0;
      }

      update();
    }

    function changeOverflow(value) {
      {
        // Chrome/Safari-specific fix:
        // When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
        // made available by removing the scrollbar. The following forces the necessary text reflow.
        var width = ta.style.width;
        ta.style.width = '0px'; // Force reflow:

        /* jshint ignore:start */

        ta.offsetWidth;
        /* jshint ignore:end */

        ta.style.width = width;
      }
      ta.style.overflowY = value;
    }

    function getParentOverflows(el) {
      var arr = [];

      while (el && el.parentNode && el.parentNode instanceof Element) {
        if (el.parentNode.scrollTop) {
          arr.push({
            node: el.parentNode,
            scrollTop: el.parentNode.scrollTop
          });
        }

        el = el.parentNode;
      }

      return arr;
    }

    function resize() {
      if (ta.scrollHeight === 0) {
        // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
        return;
      }

      var overflows = getParentOverflows(ta);
      var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

      ta.style.height = '';
      ta.style.height = ta.scrollHeight + heightOffset + 'px'; // used to check if an update is actually necessary on window.resize

      clientWidth = ta.clientWidth; // prevents scroll-position jumping

      overflows.forEach(function (el) {
        el.node.scrollTop = el.scrollTop;
      });

      if (docTop) {
        document.documentElement.scrollTop = docTop;
      }
    }

    function update() {
      resize();
      var styleHeight = Math.round(parseFloat(ta.style.height));
      var computed = window.getComputedStyle(ta, null); // Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box

      var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight; // The actual height not matching the style height (set via the resize method) indicates that 
      // the max-height has been exceeded, in which case the overflow should be allowed.

      if (actualHeight < styleHeight) {
        if (computed.overflowY === 'hidden') {
          changeOverflow('scroll');
          resize();
          actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
        }
      } else {
        // Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
        if (computed.overflowY !== 'hidden') {
          changeOverflow('hidden');
          resize();
          actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
        }
      }

      if (cachedHeight !== actualHeight) {
        cachedHeight = actualHeight;
        var evt = createEvent('autosize:resized');

        try {
          ta.dispatchEvent(evt);
        } catch (err) {// Firefox will throw an error on dispatchEvent for a detached element
          // https://bugzilla.mozilla.org/show_bug.cgi?id=889376
        }
      }
    }

    var pageResize = function pageResize() {
      if (ta.clientWidth !== clientWidth) {
        update();
      }
    };

    var destroy = function (style) {
      window.removeEventListener('resize', pageResize, false);
      ta.removeEventListener('input', update, false);
      ta.removeEventListener('keyup', update, false);
      ta.removeEventListener('autosize:destroy', destroy, false);
      ta.removeEventListener('autosize:update', update, false);
      Object.keys(style).forEach(function (key) {
        ta.style[key] = style[key];
      });
      map.delete(ta);
    }.bind(ta, {
      height: ta.style.height,
      resize: ta.style.resize,
      overflowY: ta.style.overflowY,
      overflowX: ta.style.overflowX,
      wordWrap: ta.style.wordWrap
    });

    ta.addEventListener('autosize:destroy', destroy, false); // IE9 does not fire onpropertychange or oninput for deletions,
    // so binding to onkeyup to catch most of those events.
    // There is no way that I know of to detect something like 'cut' in IE9.

    if ('onpropertychange' in ta && 'oninput' in ta) {
      ta.addEventListener('keyup', update, false);
    }

    window.addEventListener('resize', pageResize, false);
    ta.addEventListener('input', update, false);
    ta.addEventListener('autosize:update', update, false);
    ta.style.overflowX = 'hidden';
    ta.style.wordWrap = 'break-word';
    map.set(ta, {
      destroy: destroy,
      update: update
    });
    init();
  }

  function destroy(ta) {
    var methods = map.get(ta);

    if (methods) {
      methods.destroy();
    }
  }

  function update(ta) {
    var methods = map.get(ta);

    if (methods) {
      methods.update();
    }
  }

  var autosize = null; // Do nothing in Node.js environment and IE8 (or lower)

  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    autosize = function autosize(el) {
      return el;
    };

    autosize.destroy = function (el) {
      return el;
    };

    autosize.update = function (el) {
      return el;
    };
  } else {
    autosize = function autosize(el, options) {
      if (el) {
        Array.prototype.forEach.call(el.length ? el : [el], function (x) {
          return assign(x, options);
        });
      }

      return el;
    };

    autosize.destroy = function (el) {
      if (el) {
        Array.prototype.forEach.call(el.length ? el : [el], destroy);
      }

      return el;
    };

    autosize.update = function (el) {
      if (el) {
        Array.prototype.forEach.call(el.length ? el : [el], update);
      }

      return el;
    };
  }

  exports.default = autosize;
  module.exports = exports['default'];
});
/*jslint indent: 2, browser: true, bitwise: true, plusplus: true */
var twemoji = function ()
/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */

/*
https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
*/
// WARNING:   this file is generated automatically via
//            `node twemoji-generator.js`
//            please update its `createTwemoji` function
//            at the bottom of the same file instead.
{
  'use strict';
  /*jshint maxparams:4 */

  var // the exported module object
  twemoji = {
    /////////////////////////
    //      properties     //
    /////////////////////////
    // default assets url, by default will be Twitter Inc. CDN
    base: 'https://twemoji.maxcdn.com/2/',
    // default assets file extensions, by default '.png'
    ext: '.png',
    // default assets/folder size, by default "72x72"
    // available via Twitter CDN: 72
    size: '72x72',
    // default class name, by default 'emoji'
    className: 'emoji',
    // basic utilities / helpers to convert code points
    // to JavaScript surrogates and vice versa
    convert: {
      /**
       * Given an HEX codepoint, returns UTF16 surrogate pairs.
       *
       * @param   string  generic codepoint, i.e. '1F4A9'
       * @return  string  codepoint transformed into utf16 surrogates pair,
       *          i.e. \uD83D\uDCA9
       *
       * @example
       *  twemoji.convert.fromCodePoint('1f1e8');
       *  // "\ud83c\udde8"
       *
       *  '1f1e8-1f1f3'.split('-').map(twemoji.convert.fromCodePoint).join('')
       *  // "\ud83c\udde8\ud83c\uddf3"
       */
      fromCodePoint: fromCodePoint,

      /**
       * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
       *
       * @param   string  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
       * @param   string  optional separator for double code points, default='-'
       * @return  string  utf16 transformed into codepoint, i.e. '1F4A9'
       *
       * @example
       *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
       *  // "1f1e8-1f1f3"
       *
       *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
       *  // "1f1e8~1f1f3"
       */
      toCodePoint: toCodePoint
    },
    /////////////////////////
    //       methods       //
    /////////////////////////

    /**
     * User first: used to remove missing images
     * preserving the original text intent when
     * a fallback for network problems is desired.
     * Automatically added to Image nodes via DOM
     * It could be recycled for string operations via:
     *  $('img.emoji').on('error', twemoji.onerror)
     */
    onerror: function onerror() {
      if (this.parentNode) {
        this.parentNode.replaceChild(createText(this.alt, false), this);
      }
    },

    /**
     * Main method/logic to generate either <img> tags or HTMLImage nodes.
     *  "emojify" a generic text or DOM Element.
     *
     * @overloads
     *
     * String replacement for `innerHTML` or server side operations
     *  twemoji.parse(string);
     *  twemoji.parse(string, Function);
     *  twemoji.parse(string, Object);
     *
     * HTMLElement tree parsing for safer operations over existing DOM
     *  twemoji.parse(HTMLElement);
     *  twemoji.parse(HTMLElement, Function);
     *  twemoji.parse(HTMLElement, Object);
     *
     * @param   string|HTMLElement  the source to parse and enrich with emoji.
     *
     *          string              replace emoji matches with <img> tags.
     *                              Mainly used to inject emoji via `innerHTML`
     *                              It does **not** parse the string or validate it,
     *                              it simply replaces found emoji with a tag.
     *                              NOTE: be sure this won't affect security.
     *
     *          HTMLElement         walk through the DOM tree and find emoji
     *                              that are inside **text node only** (nodeType === 3)
     *                              Mainly used to put emoji in already generated DOM
     *                              without compromising surrounding nodes and
     *                              **avoiding** the usage of `innerHTML`.
     *                              NOTE: Using DOM elements instead of strings should
     *                              improve security without compromising too much
     *                              performance compared with a less safe `innerHTML`.
     *
     * @param   Function|Object  [optional]
     *                              either the callback that will be invoked or an object
     *                              with all properties to use per each found emoji.
     *
     *          Function            if specified, this will be invoked per each emoji
     *                              that has been found through the RegExp except
     *                              those follwed by the invariant \uFE0E ("as text").
     *                              Once invoked, parameters will be:
     *
     *                                iconId:string     the lower case HEX code point
     *                                                  i.e. "1f4a9"
     *
     *                                options:Object    all info for this parsing operation
     *
     *                                variant:char      the optional \uFE0F ("as image")
     *                                                  variant, in case this info
     *                                                  is anyhow meaningful.
     *                                                  By default this is ignored.
     *
     *                              If such callback will return a falsy value instead
     *                              of a valid `src` to use for the image, nothing will
     *                              actually change for that specific emoji.
     *
     *
     *          Object              if specified, an object containing the following properties
     *
     *            callback   Function  the callback to invoke per each found emoji.
     *            base       string    the base url, by default twemoji.base
     *            ext        string    the image extension, by default twemoji.ext
     *            size       string    the assets size, by default twemoji.size
     *
     * @example
     *
     *  twemoji.parse("I \u2764\uFE0F emoji!");
     *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
     *
     *
     *  twemoji.parse("I \u2764\uFE0F emoji!", function(iconId, options) {
     *    return '/assets/' + iconId + '.gif';
     *  });
     *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
     *
     *
     * twemoji.parse("I \u2764\uFE0F emoji!", {
     *   size: 72,
     *   callback: function(iconId, options) {
     *     return '/assets/' + options.size + '/' + iconId + options.ext;
     *   }
     * });
     *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"/> emoji!
     *
     */
    parse: parse,

    /**
     * Given a string, invokes the callback argument
     *  per each emoji found in such string.
     * This is the most raw version used by
     *  the .parse(string) method itself.
     *
     * @param   string    generic string to parse
     * @param   Function  a generic callback that will be
     *                    invoked to replace the content.
     *                    This calback wil receive standard
     *                    String.prototype.replace(str, callback)
     *                    arguments such:
     *  callback(
     *    rawText,  // the emoji match
     *  );
     *
     *                    and others commonly received via replace.
     */
    replace: replace,

    /**
     * Simplify string tests against emoji.
     *
     * @param   string  some text that might contain emoji
     * @return  boolean true if any emoji was found, false otherwise.
     *
     * @example
     *
     *  if (twemoji.test(someContent)) {
     *    console.log("emoji All The Things!");
     *  }
     */
    test: test
  },
      // used to escape HTML special chars in attributes
  escaper = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  },
      // RegExp based on emoji's official Unicode standards
  // http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
  re = /(?:\ud83d[\udc68\udc69])(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddb0-\uddb3])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f)|[\u0023\u002a\u0030-\u0039]\ufe0f?\u20e3|(?:[\u00a9\u00ae\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddb5\uddb6\uddb8\uddb9\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef9]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd70\udd73-\udd76\udd7a\udd7c-\udda2\uddb4\uddb7\uddc0-\uddc2\uddd0\uddde-\uddff]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,
      // avoid runtime RegExp creation for not so smart,
  // not JIT based, and old browsers / engines
  UFE0Fg = /\uFE0F/g,
      // avoid using a string literal like '\u200D' here because minifiers expand it inline
  U200D = String.fromCharCode(0x200D),
      // used to find HTML special chars in attributes
  rescaper = /[&<>'"]/g,
      // nodes with type 1 which should **not** be parsed
  shouldntBeParsed = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
      // just a private shortcut
  fromCharCode = String.fromCharCode;
  return twemoji; /////////////////////////
  //  private functions  //
  //     declaration     //
  /////////////////////////

  /**
   * Shortcut to create text nodes
   * @param   string  text used to create DOM text node
   * @return  Node  a DOM node with that text
   */

  function createText(text, clean) {
    return document.createTextNode(clean ? text.replace(UFE0Fg, '') : text);
  }
  /**
   * Utility function to escape html attribute text
   * @param   string  text use in HTML attribute
   * @return  string  text encoded to use in HTML attribute
   */


  function escapeHTML(s) {
    return s.replace(rescaper, replacer);
  }
  /**
   * Default callback used to generate emoji src
   *  based on Twitter CDN
   * @param   string    the emoji codepoint string
   * @param   string    the default size to use, i.e. "36x36"
   * @return  string    the image source to use
   */


  function defaultImageSrcGenerator(icon, options) {
    return ''.concat(options.base, options.size, '/', icon, options.ext);
  }
  /**
   * Given a generic DOM nodeType 1, walk through all children
   * and store every nodeType 3 (#text) found in the tree.
   * @param   Element a DOM Element with probably some text in it
   * @param   Array the list of previously discovered text nodes
   * @return  Array same list with new discovered nodes, if any
   */


  function grabAllTextNodes(node, allText) {
    var childNodes = node.childNodes,
        length = childNodes.length,
        subnode,
        nodeType;

    while (length--) {
      subnode = childNodes[length];
      nodeType = subnode.nodeType; // parse emoji only in text nodes

      if (nodeType === 3) {
        // collect them to process emoji later
        allText.push(subnode);
      } // ignore all nodes that are not type 1, that are svg, or that
      // should not be parsed as script, style, and others
      else if (nodeType === 1 && !('ownerSVGElement' in subnode) && !shouldntBeParsed.test(subnode.nodeName.toLowerCase())) {
          grabAllTextNodes(subnode, allText);
        }
    }

    return allText;
  }
  /**
   * Used to both remove the possible variant
   *  and to convert utf16 into code points.
   *  If there is a zero-width-joiner (U+200D), leave the variants in.
   * @param   string    the raw text of the emoji match
   * @return  string    the code point
   */


  function grabTheRightIcon(rawText) {
    // if variant is present as \uFE0F
    return toCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0Fg, '') : rawText);
  }
  /**
   * DOM version of the same logic / parser:
   *  emojify all found sub-text nodes placing images node instead.
   * @param   Element   generic DOM node with some text in some child node
   * @param   Object    options  containing info about how to parse
    *
    *            .callback   Function  the callback to invoke per each found emoji.
    *            .base       string    the base url, by default twemoji.base
    *            .ext        string    the image extension, by default twemoji.ext
    *            .size       string    the assets size, by default twemoji.size
    *
   * @return  Element same generic node with emoji in place, if any.
   */


  function parseNode(node, options) {
    var allText = grabAllTextNodes(node, []),
        length = allText.length,
        attrib,
        attrname,
        modified,
        fragment,
        subnode,
        text,
        match,
        i,
        index,
        img,
        rawText,
        iconId,
        src;

    while (length--) {
      modified = false;
      fragment = document.createDocumentFragment();
      subnode = allText[length];
      text = subnode.nodeValue;
      i = 0;

      while (match = re.exec(text)) {
        index = match.index;

        if (index !== i) {
          fragment.appendChild(createText(text.slice(i, index), true));
        }

        rawText = match[0];
        iconId = grabTheRightIcon(rawText);
        i = index + rawText.length;
        src = options.callback(iconId, options);

        if (iconId && src) {
          img = new Image();
          img.onerror = options.onerror;
          img.setAttribute('draggable', 'false');
          attrib = options.attributes(rawText, iconId);

          for (attrname in attrib) {
            if (attrib.hasOwnProperty(attrname) && // don't allow any handlers to be set + don't allow overrides
            attrname.indexOf('on') !== 0 && !img.hasAttribute(attrname)) {
              img.setAttribute(attrname, attrib[attrname]);
            }
          }

          img.className = options.className;
          img.alt = rawText;
          img.src = src;
          modified = true;
          fragment.appendChild(img);
        }

        if (!img) fragment.appendChild(createText(rawText, false));
        img = null;
      } // is there actually anything to replace in here ?


      if (modified) {
        // any text left to be added ?
        if (i < text.length) {
          fragment.appendChild(createText(text.slice(i), true));
        } // replace the text node only, leave intact
        // anything else surrounding such text


        subnode.parentNode.replaceChild(fragment, subnode);
      }
    }

    return node;
  }
  /**
   * String/HTML version of the same logic / parser:
   *  emojify a generic text placing images tags instead of surrogates pair.
   * @param   string    generic string with possibly some emoji in it
   * @param   Object    options  containing info about how to parse
   *
   *            .callback   Function  the callback to invoke per each found emoji.
   *            .base       string    the base url, by default twemoji.base
   *            .ext        string    the image extension, by default twemoji.ext
   *            .size       string    the assets size, by default twemoji.size
   *
   * @return  the string with <img tags> replacing all found and parsed emoji
   */


  function parseString(str, options) {
    return replace(str, function (rawText) {
      var ret = rawText,
          iconId = grabTheRightIcon(rawText),
          src = options.callback(iconId, options),
          attrib,
          attrname;

      if (iconId && src) {
        // recycle the match string replacing the emoji
        // with its image counter part
        ret = '<img '.concat('class="', options.className, '" ', 'draggable="false" ', // needs to preserve user original intent
        // when variants should be copied and pasted too
        'alt="', rawText, '"', ' src="', src, '"');
        attrib = options.attributes(rawText, iconId);

        for (attrname in attrib) {
          if (attrib.hasOwnProperty(attrname) && // don't allow any handlers to be set + don't allow overrides
          attrname.indexOf('on') !== 0 && ret.indexOf(' ' + attrname + '=') === -1) {
            ret = ret.concat(' ', attrname, '="', escapeHTML(attrib[attrname]), '"');
          }
        }

        ret = ret.concat('/>');
      }

      return ret;
    });
  }
  /**
   * Function used to actually replace HTML special chars
   * @param   string  HTML special char
   * @return  string  encoded HTML special char
   */


  function replacer(m) {
    return escaper[m];
  }
  /**
   * Default options.attribute callback
   * @return  null
   */


  function returnNull() {
    return null;
  }
  /**
   * Given a generic value, creates its squared counterpart if it's a number.
   *  As example, number 36 will return '36x36'.
   * @param   any     a generic value.
   * @return  any     a string representing asset size, i.e. "36x36"
   *                  only in case the value was a number.
   *                  Returns initial value otherwise.
   */


  function toSizeSquaredAsset(value) {
    return typeof value === 'number' ? value + 'x' + value : value;
  } /////////////////////////
  //  exported functions //
  //     declaration     //
  /////////////////////////


  function fromCodePoint(codepoint) {
    var code = typeof codepoint === 'string' ? parseInt(codepoint, 16) : codepoint;

    if (code < 0x10000) {
      return fromCharCode(code);
    }

    code -= 0x10000;
    return fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
  }

  function parse(what, how) {
    if (!how || typeof how === 'function') {
      how = {
        callback: how
      };
    } // if first argument is string, inject html <img> tags
    // otherwise use the DOM tree and parse text nodes only


    return (typeof what === 'string' ? parseString : parseNode)(what, {
      callback: how.callback || defaultImageSrcGenerator,
      attributes: typeof how.attributes === 'function' ? how.attributes : returnNull,
      base: typeof how.base === 'string' ? how.base : twemoji.base,
      ext: how.ext || twemoji.ext,
      size: how.folder || toSizeSquaredAsset(how.size || twemoji.size),
      className: how.className || twemoji.className,
      onerror: how.onerror || twemoji.onerror
    });
  }

  function replace(text, callback) {
    return String(text).replace(re, callback);
  }

  function test(text) {
    // IE6 needs a reset before too
    re.lastIndex = 0;
    var result = re.test(text);
    re.lastIndex = 0;
    return result;
  }

  function toCodePoint(unicodeSurrogates, sep) {
    var r = [],
        c = 0,
        p = 0,
        i = 0;

    while (i < unicodeSurrogates.length) {
      c = unicodeSurrogates.charCodeAt(i++);

      if (p) {
        r.push((0x10000 + (p - 0xD800 << 10) + (c - 0xDC00)).toString(16));
        p = 0;
      } else if (0xD800 <= c && c <= 0xDBFF) {
        p = c;
      } else {
        r.push(c.toString(16));
      }
    }

    return r.join(sep || '-');
  }
}();
"use strict";function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}var ModeManager=function(){function a(a){this.element=a,this.dataset=a.dataset,this.parse("")}return a.prototype.execute=function(a,b){var c=this.parse(a);return c.is_parsed?"1001"==c.code||(""===this.func_name?(console.log("AnalyzeError: Undefined execution function name."),12033):"function"==typeof c.cmd_list[0].execute?c.cmd_list[0].execute(b,this):(console.log("ElementError: Undefined execution function."),12034)):(console.log("AnalyzeError: "+c.message),c.code)},a.prototype.getCompletion=function(){for(var a=this.result.cmd_list,b=[],c=0;c<a.length;c++)b.push("paramater"===a[c].type?"<"+a[c].name+">":"number"===a[c].type?"["+a[c].name+"]":a[c].name);return b},a.prototype.information=function(a){for(var b,c=this.parse(a).cmd_list,d=["Exec commands:"],e=0;e<c.length;e++){if("paramater"==c[e].type)b="<"+c[e].name+">";else if("number"==c[e].type){var f=parseInt(c[e].max),g=parseInt(c[e].min);b="<"+(isNaN(g)?"":g)+"-"+(isNaN(f)?"":f)+">"}else b=c[e].name;d.push({command:b,description:c[e].description})}var h=this.line_parsed[this.line_parsed.length-1];return"undefined"!=typeof h&&"function"==typeof h.execute&&"paramater"!==h.type&&"number"!==h.type&&(2===d.length&&d.pop(),d.push({command:"<cr>",description:""})),d},a.prototype.parse=function(a,b){void 0===b&&(b=0),this.line=a,this.line_parsed=[],this.is_parsed=!0,this.err_code=0,this.err_msg="",this.position=b,this.completion="",this.cmd_list=this.dataset,this.paramaters={},this.optional={};var c=0,d="",e="",f="";if(0>=a.length)return this.result;if(a.match(/^\s*!/))return this.is_parsed=!0,this.err_code=4097,this.err_msg="comment",this.result;for(c=this.position;c<=a.length;c++){if(d=a.charAt(c)," "===d&&""===f){for(e="",f="";d=a.charAt(++c)," "===d&&""!==d;);if(this.completion=a.substring(0,c),1===this.cmd_list.length)this.line_parsed.push(this.cmd_list[0]),this.cmd_list="object"===_typeof(this.cmd_list[0].children)?this.cmd_list[0].children:[];else if(1<this.cmd_list.length){this.err_code=7938,this.err_msg="% Ambiguous command:  \""+this.line+"\"";break}}e+=d;var n=e.match(/^(?:(')[^']+|(")[^"]+)$/);f=n?n[1]?"'":n[2]?"\"":"":"";for(var g=[],h=0;h<this.cmd_list.length;h++)if("command"===this.cmd_list[h].type){var o=new RegExp("^"+e,"i");this.cmd_list[h].name.match(o)&&g.push(this.cmd_list[h])}else if("number"===this.cmd_list[h].type){var k=parseInt(e),l=parseInt(this.cmd_list[h].max),m=parseInt(this.cmd_list[h].min);if(0===e.length)this.cmd_list[h].param=parseInt(e),g.push(this.cmd_list[h]);else if(isNaN(k))continue;else if(!isNaN(l)&&l<k)continue;else if(!isNaN(m)&&m>k)continue;else this.cmd_list[h].param=parseInt(e),g.push(this.cmd_list[h])}else if("paramater"===this.cmd_list[h].type){var q=/^["']?(.*?)["']?$/;this.cmd_list[h].param=e.replace(q,"$1"),g.push(this.cmd_list[h])}else{if("description"!==this.cmd_list[h].type)return this.err_code=61441,this.err_msg="parsed error: undefined type '"+this.cmd_list[h].type+"'",this.result;if(1===this.cmd_list.length){c=a.length;break}}if(this.cmd_list=g,0===this.cmd_list.length){this.is_parsed=!1,this.err_code=7937;var r=void 0;for(r="";r.length<c;r+=" ");r+=$.terminal.active().get_prompt().replace(/\S/g," "),this.err_msg=r+"^\n% Invalid input detected at '^' marker.",this.cmd_list=[];break}}if(this.position=c,1===this.cmd_list.length){this.line_parsed.push(this.cmd_list[0]),"undefined"==typeof this.cmd_list[0].execute&&(this.is_parsed=!1,this.err_code=4353,this.err_msg="% Incomplete command.");for(var s=0;s<this.line_parsed.length;s++)("paramater"===this.line_parsed[s].type||"number"===this.line_parsed[s].type)&&(this.paramaters[this.line_parsed[s].name]=this.line_parsed[s].param),this.line_parsed[s].hasOwnProperty("optional")&&(this.optional[this.line_parsed[s].optional]=!0)}return 1===this.cmd_list.length&&"command"===this.cmd_list[0].type?this.completion+=this.cmd_list[0].name+" ":this.completion=this.line,this.result},Object.defineProperty(a.prototype,"func_name",{get:function b(){if(0!==this.err_code)return"";var a=this.line_parsed[this.line_parsed.length-1];return"undefined"==typeof a.execute?"":a.execute},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"result",{get:function a(){return{is_parsed:this.is_parsed,cmd_list:this.cmd_list,code:this.err_code.toString(16),message:this.err_msg,position:this.position,line_parsed:this.line_parsed}},enumerable:!0,configurable:!0}),a.prototype.debug=function(){console.log("**************************************************"),console.log("===== line"),console.log(this.line),console.log("===== line_parsed"),console.log(this.line_parsed),console.log("===== is_parsed"),console.log(this.is_parsed),console.log("===== err_code"),console.log(this.err_code.toString(16)),console.log("===== err_msg"),console.log(this.err_msg),console.log("===== line.length"),console.log(this.line.length),console.log("===== position"),console.log(this.position),console.log("===== completion"),console.log(this.completion),console.log("===== dataset"),console.log(this.dataset),console.log("===== cmd_list"),console.log(this.cmd_list)},a}(),ConfigManager=function(){function a(a,b){this.default=JSON.parse(JSON.stringify(a)),this.config=b?b:a,this.config=Object.assign(a,this.config)}return a.prototype.find=function(a){if("string"==typeof a&&(a=a.split(".")),!!Array.isArray(a)){for(var b=this.config,c=0;c<a.length;c++)if("undefined"!=typeof b[a[c]])b=b[a[c]];else{b=void 0;break}if("undefined"!=typeof b)return b;b=this.default;for(var d=0;d<a.length&&(b=b[a[d]],"undefined"!=typeof b);d++);return b}},a.prototype.write=function(a,b){if("string"==typeof a&&(a=a.split(".")),!Array.isArray(a))return!1;for(var c,d=this.config,e=0;e<a.length-1;e++)c=a[e],"undefined"==typeof d[c]&&(d[c]={}),d=d[c];return c=a.pop(),d[c]=b,!0},a.prototype.erase=function(a){if("string"==typeof a&&(a=a.split(".")),!Array.isArray(a))return!1;for(var b,c=this.config,d=0;d<a.length-1;d++){if(b=a[d],"undefined"==typeof c[b])return!0;c=c[b]}return b=a.pop(),delete c[b],!0},a}(),InstanceManager=function(){function a(){var a=localStorage.getItem("instances");a?(this.instances=JSON.parse(a),this.parse_acl()):this.instances={},this._ins=void 0,this._name=""}return a.prototype.parse_acl=function(){for(var e in this.acls={},this.instances)if(this.acls[e]={},!!this.instances[e].hasOwnProperty("acl"))for(var f in this.instances[e].acl){var a=this.instances[e].acl[f],b=a.regexp,c=b.match(/^\/(.+)\/([igym]*)$/),d=void 0;d=c?new RegExp(c[1],c[2]):new RegExp(b),this.acls[e][f]={type:a.type,regexp:d,notify:!0===a.notify},a.color&&(this.acls[e][f].color=a.color),a.voice&&(this.acls[e][f].voice=a.voice)}},a.prototype.ck_version=function(a){var b={is_checked:!1,type:"",compared:0,version:""};if("undefined"==typeof a||"undefined"==typeof this._ins)return b;var c;if(!this._ins.info.hasOwnProperty("version"))return b.is_checked=!0,b.type="mastodon",b.compared=-1,b;if(c=this._ins.info.version.match(/^Pleroma (\S+)/))return b.is_checked=!0,b.type="pleroma",b.version=c[1],b.compared=c[1]===a?0:-1,b;if(c=this._ins.info.version.match(/(\d+)\.(\d+)\.(\d+)/))b.is_checked=!0,b.type="mastodon",b.version=c[0];else return b;for(var d=a.match(/(\d+)\.(\d+)\.(\d+)/),e=3;0<e;e--)b.compared=d[e]>c[e]?1:d[e]<c[e]?-1:b.compared;return b},a.prototype.name=function(a){return"string"==typeof a&&(this._name=a,this._ins=this.instances[a]),this._name},a.prototype.save=function(){for(var b in this.instances)this.instances[b].hasOwnProperty("client_id")||delete this.instances[b];var a=JSON.stringify(this.instances);return localStorage.setItem("instances",a),!0},a.prototype.get=function(a){return"undefined"==typeof a?this._ins:this.instances[a]},a.prototype.set=function(a,b){return"undefined"==typeof b&&(b=this.name()),!!b&&void(this.instances[b]=a,this._ins=a,this.save())},a.prototype.delete=function(a){return"undefined"==typeof a&&(a=this._name),result=delete this.instances[a],result&&(this._name="",this._ins=void 0),this.save(),result},a.prototype.create=function(a){return this.instances.hasOwnProperty(a)||(this.instances[a]={},this.name(a)),this.instances[a]},a}();
"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var o=0,n=Array(e.length);o<e.length;o++)n[o]=e[o];return n}}function _classCallCheck(e,o){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,o){for(var n=0,d;n<o.length;n++)d=o[n],d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(e,d.key,d)}function _createClass(e,o,n){return o&&_defineProperties(e.prototype,o),n&&_defineProperties(e,n),e}var Emojis=function(){function e(){var o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];_classCallCheck(this,e),this.init_emojis().add_custom_emojis(o)}return _createClass(e,[{key:"init_emojis",value:function e(){return this._emojis=[{category:"smileys_n_people",keyword:"grinning face",code:"\uD83D\uDE00"},{category:"smileys_n_people",keyword:"beaming face with smiling eyes",code:"\uD83D\uDE01"},{category:"smileys_n_people",keyword:"face with tears of joy",code:"\uD83D\uDE02"},{category:"smileys_n_people",keyword:"rolling on the floor laughing",code:"\uD83E\uDD23"},{category:"smileys_n_people",keyword:"grinning face with big eyes",code:"\uD83D\uDE03"},{category:"smileys_n_people",keyword:"grinning face with smiling eyes",code:"\uD83D\uDE04"},{category:"smileys_n_people",keyword:"grinning face with sweat",code:"\uD83D\uDE05"},{category:"smileys_n_people",keyword:"grinning squinting face",code:"\uD83D\uDE06"},{category:"smileys_n_people",keyword:"winking face",code:"\uD83D\uDE09"},{category:"smileys_n_people",keyword:"smiling face with smiling eyes",code:"\uD83D\uDE0A"},{category:"smileys_n_people",keyword:"face savoring food",code:"\uD83D\uDE0B"},{category:"smileys_n_people",keyword:"smiling face with sunglasses",code:"\uD83D\uDE0E"},{category:"smileys_n_people",keyword:"smiling face with heart-eyes",code:"\uD83D\uDE0D"},{category:"smileys_n_people",keyword:"face blowing a kiss",code:"\uD83D\uDE18"},{category:"smileys_n_people",keyword:"smiling face with 3 hearts",code:"\uD83E\uDD70"},{category:"smileys_n_people",keyword:"kissing face",code:"\uD83D\uDE17"},{category:"smileys_n_people",keyword:"kissing face with smiling eyes",code:"\uD83D\uDE19"},{category:"smileys_n_people",keyword:"kissing face with closed eyes",code:"\uD83D\uDE1A"},{category:"smileys_n_people",keyword:"smiling face",code:"\u263A\uFE0F"},{category:"smileys_n_people",keyword:"slightly smiling face",code:"\uD83D\uDE42"},{category:"smileys_n_people",keyword:"hugging face",code:"\uD83E\uDD17"},{category:"smileys_n_people",keyword:"star-struck",code:"\uD83E\uDD29"},{category:"smileys_n_people",keyword:"thinking face",code:"\uD83E\uDD14"},{category:"smileys_n_people",keyword:"face with raised eyebrow",code:"\uD83E\uDD28"},{category:"smileys_n_people",keyword:"neutral face",code:"\uD83D\uDE10"},{category:"smileys_n_people",keyword:"expressionless face",code:"\uD83D\uDE11"},{category:"smileys_n_people",keyword:"face without mouth",code:"\uD83D\uDE36"},{category:"smileys_n_people",keyword:"face with rolling eyes",code:"\uD83D\uDE44"},{category:"smileys_n_people",keyword:"smirking face",code:"\uD83D\uDE0F"},{category:"smileys_n_people",keyword:"persevering face",code:"\uD83D\uDE23"},{category:"smileys_n_people",keyword:"sad but relieved face",code:"\uD83D\uDE25"},{category:"smileys_n_people",keyword:"face with open mouth",code:"\uD83D\uDE2E"},{category:"smileys_n_people",keyword:"zipper-mouth face",code:"\uD83E\uDD10"},{category:"smileys_n_people",keyword:"hushed face",code:"\uD83D\uDE2F"},{category:"smileys_n_people",keyword:"sleepy face",code:"\uD83D\uDE2A"},{category:"smileys_n_people",keyword:"tired face",code:"\uD83D\uDE2B"},{category:"smileys_n_people",keyword:"sleeping face",code:"\uD83D\uDE34"},{category:"smileys_n_people",keyword:"relieved face",code:"\uD83D\uDE0C"},{category:"smileys_n_people",keyword:"face with tongue",code:"\uD83D\uDE1B"},{category:"smileys_n_people",keyword:"winking face with tongue",code:"\uD83D\uDE1C"},{category:"smileys_n_people",keyword:"squinting face with tongue",code:"\uD83D\uDE1D"},{category:"smileys_n_people",keyword:"drooling face",code:"\uD83E\uDD24"},{category:"smileys_n_people",keyword:"unamused face",code:"\uD83D\uDE12"},{category:"smileys_n_people",keyword:"downcast face with sweat",code:"\uD83D\uDE13"},{category:"smileys_n_people",keyword:"pensive face",code:"\uD83D\uDE14"},{category:"smileys_n_people",keyword:"confused face",code:"\uD83D\uDE15"},{category:"smileys_n_people",keyword:"upside-down face",code:"\uD83D\uDE43"},{category:"smileys_n_people",keyword:"money-mouth face",code:"\uD83E\uDD11"},{category:"smileys_n_people",keyword:"astonished face",code:"\uD83D\uDE32"},{category:"smileys_n_people",keyword:"frowning face",code:"\u2639\uFE0F"},{category:"smileys_n_people",keyword:"slightly frowning face",code:"\uD83D\uDE41"},{category:"smileys_n_people",keyword:"confounded face",code:"\uD83D\uDE16"},{category:"smileys_n_people",keyword:"disappointed face",code:"\uD83D\uDE1E"},{category:"smileys_n_people",keyword:"worried face",code:"\uD83D\uDE1F"},{category:"smileys_n_people",keyword:"face with steam from nose",code:"\uD83D\uDE24"},{category:"smileys_n_people",keyword:"crying face",code:"\uD83D\uDE22"},{category:"smileys_n_people",keyword:"loudly crying face",code:"\uD83D\uDE2D"},{category:"smileys_n_people",keyword:"frowning face with open mouth",code:"\uD83D\uDE26"},{category:"smileys_n_people",keyword:"anguished face",code:"\uD83D\uDE27"},{category:"smileys_n_people",keyword:"fearful face",code:"\uD83D\uDE28"},{category:"smileys_n_people",keyword:"weary face",code:"\uD83D\uDE29"},{category:"smileys_n_people",keyword:"exploding head",code:"\uD83E\uDD2F"},{category:"smileys_n_people",keyword:"grimacing face",code:"\uD83D\uDE2C"},{category:"smileys_n_people",keyword:"anxious face with sweat",code:"\uD83D\uDE30"},{category:"smileys_n_people",keyword:"face screaming in fear",code:"\uD83D\uDE31"},{category:"smileys_n_people",keyword:"hot face",code:"\uD83E\uDD75"},{category:"smileys_n_people",keyword:"cold face",code:"\uD83E\uDD76"},{category:"smileys_n_people",keyword:"flushed face",code:"\uD83D\uDE33"},{category:"smileys_n_people",keyword:"zany face",code:"\uD83E\uDD2A"},{category:"smileys_n_people",keyword:"dizzy face",code:"\uD83D\uDE35"},{category:"smileys_n_people",keyword:"pouting face",code:"\uD83D\uDE21"},{category:"smileys_n_people",keyword:"angry face",code:"\uD83D\uDE20"},{category:"smileys_n_people",keyword:"face with symbols on mouth",code:"\uD83E\uDD2C"},{category:"smileys_n_people",keyword:"face with medical mask",code:"\uD83D\uDE37"},{category:"smileys_n_people",keyword:"face with thermometer",code:"\uD83E\uDD12"},{category:"smileys_n_people",keyword:"face with head-bandage",code:"\uD83E\uDD15"},{category:"smileys_n_people",keyword:"nauseated face",code:"\uD83E\uDD22"},{category:"smileys_n_people",keyword:"face vomiting",code:"\uD83E\uDD2E"},{category:"smileys_n_people",keyword:"sneezing face",code:"\uD83E\uDD27"},{category:"smileys_n_people",keyword:"smiling face with halo",code:"\uD83D\uDE07"},{category:"smileys_n_people",keyword:"cowboy hat face",code:"\uD83E\uDD20"},{category:"smileys_n_people",keyword:"partying face",code:"\uD83E\uDD73"},{category:"smileys_n_people",keyword:"woozy face",code:"\uD83E\uDD74"},{category:"smileys_n_people",keyword:"pleading face",code:"\uD83E\uDD7A"},{category:"smileys_n_people",keyword:"lying face",code:"\uD83E\uDD25"},{category:"smileys_n_people",keyword:"shushing face",code:"\uD83E\uDD2B"},{category:"smileys_n_people",keyword:"face with hand over mouth",code:"\uD83E\uDD2D"},{category:"smileys_n_people",keyword:"face with monocle",code:"\uD83E\uDDD0"},{category:"smileys_n_people",keyword:"nerd face",code:"\uD83E\uDD13"},{category:"smileys_n_people",keyword:"smiling face with horns",code:"\uD83D\uDE08"},{category:"smileys_n_people",keyword:"angry face with horns",code:"\uD83D\uDC7F"},{category:"smileys_n_people",keyword:"clown face",code:"\uD83E\uDD21"},{category:"smileys_n_people",keyword:"ogre",code:"\uD83D\uDC79"},{category:"smileys_n_people",keyword:"goblin",code:"\uD83D\uDC7A"},{category:"smileys_n_people",keyword:"skull",code:"\uD83D\uDC80"},{category:"smileys_n_people",keyword:"skull and crossbones",code:"\u2620\uFE0F"},{category:"smileys_n_people",keyword:"ghost",code:"\uD83D\uDC7B"},{category:"smileys_n_people",keyword:"alien",code:"\uD83D\uDC7D"},{category:"smileys_n_people",keyword:"alien monster",code:"\uD83D\uDC7E"},{category:"smileys_n_people",keyword:"robot face",code:"\uD83E\uDD16"},{category:"smileys_n_people",keyword:"pile of poo",code:"\uD83D\uDCA9"},{category:"smileys_n_people",keyword:"grinning cat face",code:"\uD83D\uDE3A"},{category:"smileys_n_people",keyword:"grinning cat face with smiling eyes",code:"\uD83D\uDE38"},{category:"smileys_n_people",keyword:"cat face with tears of joy",code:"\uD83D\uDE39"},{category:"smileys_n_people",keyword:"smiling cat face with heart-eyes",code:"\uD83D\uDE3B"},{category:"smileys_n_people",keyword:"cat face with wry smile",code:"\uD83D\uDE3C"},{category:"smileys_n_people",keyword:"kissing cat face",code:"\uD83D\uDE3D"},{category:"smileys_n_people",keyword:"weary cat face",code:"\uD83D\uDE40"},{category:"smileys_n_people",keyword:"crying cat face",code:"\uD83D\uDE3F"},{category:"smileys_n_people",keyword:"pouting cat face",code:"\uD83D\uDE3E"},{category:"smileys_n_people",keyword:"see-no-evil monkey",code:"\uD83D\uDE48"},{category:"smileys_n_people",keyword:"hear-no-evil monkey",code:"\uD83D\uDE49"},{category:"smileys_n_people",keyword:"speak-no-evil monkey",code:"\uD83D\uDE4A"},{category:"smileys_n_people",tone:"light",keyword:"light skin tone",code:"\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"medium-light skin tone",code:"\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"medium skin tone",code:"\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"medium-dark skin tone",code:"\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"dark skin tone",code:"\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"baby",code:"\uD83D\uDC76"},{category:"smileys_n_people",tone:"light",keyword:"baby: light skin tone",code:"\uD83D\uDC76\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"baby: medium-light skin tone",code:"\uD83D\uDC76\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"baby: medium skin tone",code:"\uD83D\uDC76\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"baby: medium-dark skin tone",code:"\uD83D\uDC76\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"baby: dark skin tone",code:"\uD83D\uDC76\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"child",code:"\uD83E\uDDD2"},{category:"smileys_n_people",tone:"light",keyword:"child: light skin tone",code:"\uD83E\uDDD2\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"child: medium-light skin tone",code:"\uD83E\uDDD2\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"child: medium skin tone",code:"\uD83E\uDDD2\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"child: medium-dark skin tone",code:"\uD83E\uDDD2\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"child: dark skin tone",code:"\uD83E\uDDD2\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"boy",code:"\uD83D\uDC66"},{category:"smileys_n_people",tone:"light",keyword:"boy: light skin tone",code:"\uD83D\uDC66\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"boy: medium-light skin tone",code:"\uD83D\uDC66\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"boy: medium skin tone",code:"\uD83D\uDC66\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"boy: medium-dark skin tone",code:"\uD83D\uDC66\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"boy: dark skin tone",code:"\uD83D\uDC66\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"girl",code:"\uD83D\uDC67"},{category:"smileys_n_people",tone:"light",keyword:"girl: light skin tone",code:"\uD83D\uDC67\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"girl: medium-light skin tone",code:"\uD83D\uDC67\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"girl: medium skin tone",code:"\uD83D\uDC67\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"girl: medium-dark skin tone",code:"\uD83D\uDC67\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"girl: dark skin tone",code:"\uD83D\uDC67\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"adult",code:"\uD83E\uDDD1"},{category:"smileys_n_people",tone:"light",keyword:"adult: light skin tone",code:"\uD83E\uDDD1\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"adult: medium-light skin tone",code:"\uD83E\uDDD1\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"adult: medium skin tone",code:"\uD83E\uDDD1\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"adult: medium-dark skin tone",code:"\uD83E\uDDD1\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"adult: dark skin tone",code:"\uD83E\uDDD1\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man",code:"\uD83D\uDC68"},{category:"smileys_n_people",tone:"light",keyword:"man: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"man: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"man: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman",code:"\uD83D\uDC69"},{category:"smileys_n_people",tone:"light",keyword:"woman: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"woman: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"woman: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"older adult",code:"\uD83E\uDDD3"},{category:"smileys_n_people",tone:"light",keyword:"older adult: light skin tone",code:"\uD83E\uDDD3\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"older adult: medium-light skin tone",code:"\uD83E\uDDD3\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"older adult: medium skin tone",code:"\uD83E\uDDD3\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"older adult: medium-dark skin tone",code:"\uD83E\uDDD3\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"older adult: dark skin tone",code:"\uD83E\uDDD3\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"old man",code:"\uD83D\uDC74"},{category:"smileys_n_people",tone:"light",keyword:"old man: light skin tone",code:"\uD83D\uDC74\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"old man: medium-light skin tone",code:"\uD83D\uDC74\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"old man: medium skin tone",code:"\uD83D\uDC74\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"old man: medium-dark skin tone",code:"\uD83D\uDC74\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"old man: dark skin tone",code:"\uD83D\uDC74\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"old woman",code:"\uD83D\uDC75"},{category:"smileys_n_people",tone:"light",keyword:"old woman: light skin tone",code:"\uD83D\uDC75\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"old woman: medium-light skin tone",code:"\uD83D\uDC75\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"old woman: medium skin tone",code:"\uD83D\uDC75\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"old woman: medium-dark skin tone",code:"\uD83D\uDC75\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"old woman: dark skin tone",code:"\uD83D\uDC75\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man health worker",code:"\uD83D\uDC68\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man health worker: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man health worker: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man health worker: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man health worker: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man health worker: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman health worker",code:"\uD83D\uDC69\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman health worker: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman health worker: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman health worker: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman health worker: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman health worker: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\u2695\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man student",code:"\uD83D\uDC68\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"light",keyword:"man student: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"medium-light",keyword:"man student: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"medium",keyword:"man student: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man student: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"dark",keyword:"man student: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"default",keyword:"woman student",code:"\uD83D\uDC69\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"light",keyword:"woman student: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman student: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"medium",keyword:"woman student: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman student: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"dark",keyword:"woman student: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDF93"},{category:"smileys_n_people",tone:"default",keyword:"man teacher",code:"\uD83D\uDC68\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"light",keyword:"man teacher: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man teacher: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"medium",keyword:"man teacher: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man teacher: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"dark",keyword:"man teacher: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"default",keyword:"woman teacher",code:"\uD83D\uDC69\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"light",keyword:"woman teacher: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman teacher: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"medium",keyword:"woman teacher: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman teacher: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"dark",keyword:"woman teacher: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDFEB"},{category:"smileys_n_people",tone:"default",keyword:"man judge",code:"\uD83D\uDC68\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man judge: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man judge: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man judge: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man judge: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man judge: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman judge",code:"\uD83D\uDC69\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman judge: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman judge: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman judge: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman judge: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman judge: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\u2696\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man farmer",code:"\uD83D\uDC68\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"light",keyword:"man farmer: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"medium-light",keyword:"man farmer: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"medium",keyword:"man farmer: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man farmer: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"dark",keyword:"man farmer: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"default",keyword:"woman farmer",code:"\uD83D\uDC69\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"light",keyword:"woman farmer: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman farmer: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"medium",keyword:"woman farmer: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman farmer: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"dark",keyword:"woman farmer: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDF3E"},{category:"smileys_n_people",tone:"default",keyword:"man cook",code:"\uD83D\uDC68\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"light",keyword:"man cook: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"medium-light",keyword:"man cook: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"medium",keyword:"man cook: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man cook: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"dark",keyword:"man cook: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"default",keyword:"woman cook",code:"\uD83D\uDC69\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"light",keyword:"woman cook: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman cook: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"medium",keyword:"woman cook: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman cook: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"dark",keyword:"woman cook: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDF73"},{category:"smileys_n_people",tone:"default",keyword:"man mechanic",code:"\uD83D\uDC68\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"light",keyword:"man mechanic: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"medium-light",keyword:"man mechanic: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"medium",keyword:"man mechanic: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man mechanic: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"dark",keyword:"man mechanic: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"default",keyword:"woman mechanic",code:"\uD83D\uDC69\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"light",keyword:"woman mechanic: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman mechanic: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"medium",keyword:"woman mechanic: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman mechanic: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"dark",keyword:"woman mechanic: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDD27"},{category:"smileys_n_people",tone:"default",keyword:"man factory worker",code:"\uD83D\uDC68\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"light",keyword:"man factory worker: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"medium-light",keyword:"man factory worker: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"medium",keyword:"man factory worker: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man factory worker: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"dark",keyword:"man factory worker: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"default",keyword:"woman factory worker",code:"\uD83D\uDC69\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"light",keyword:"woman factory worker: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman factory worker: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"medium",keyword:"woman factory worker: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman factory worker: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"dark",keyword:"woman factory worker: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDFED"},{category:"smileys_n_people",tone:"default",keyword:"man office worker",code:"\uD83D\uDC68\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"light",keyword:"man office worker: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"medium-light",keyword:"man office worker: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"medium",keyword:"man office worker: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man office worker: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"dark",keyword:"man office worker: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"default",keyword:"woman office worker",code:"\uD83D\uDC69\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"light",keyword:"woman office worker: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman office worker: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"medium",keyword:"woman office worker: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman office worker: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"dark",keyword:"woman office worker: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDCBC"},{category:"smileys_n_people",tone:"default",keyword:"man scientist",code:"\uD83D\uDC68\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"light",keyword:"man scientist: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"medium-light",keyword:"man scientist: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"medium",keyword:"man scientist: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man scientist: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"dark",keyword:"man scientist: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"default",keyword:"woman scientist",code:"\uD83D\uDC69\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"light",keyword:"woman scientist: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman scientist: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"medium",keyword:"woman scientist: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman scientist: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"dark",keyword:"woman scientist: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDD2C"},{category:"smileys_n_people",tone:"default",keyword:"man technologist",code:"\uD83D\uDC68\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"light",keyword:"man technologist: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man technologist: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"medium",keyword:"man technologist: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man technologist: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"dark",keyword:"man technologist: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"default",keyword:"woman technologist",code:"\uD83D\uDC69\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"light",keyword:"woman technologist: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman technologist: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"medium",keyword:"woman technologist: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman technologist: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"dark",keyword:"woman technologist: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDCBB"},{category:"smileys_n_people",tone:"default",keyword:"man singer",code:"\uD83D\uDC68\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"light",keyword:"man singer: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"medium-light",keyword:"man singer: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"medium",keyword:"man singer: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man singer: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"dark",keyword:"man singer: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"default",keyword:"woman singer",code:"\uD83D\uDC69\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"light",keyword:"woman singer: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman singer: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"medium",keyword:"woman singer: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman singer: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"dark",keyword:"woman singer: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDFA4"},{category:"smileys_n_people",tone:"default",keyword:"man artist",code:"\uD83D\uDC68\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"light",keyword:"man artist: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"medium-light",keyword:"man artist: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"medium",keyword:"man artist: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man artist: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"dark",keyword:"man artist: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"default",keyword:"woman artist",code:"\uD83D\uDC69\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"light",keyword:"woman artist: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman artist: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"medium",keyword:"woman artist: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman artist: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"dark",keyword:"woman artist: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83C\uDFA8"},{category:"smileys_n_people",tone:"default",keyword:"man pilot",code:"\uD83D\uDC68\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man pilot: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man pilot: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man pilot: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man pilot: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man pilot: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman pilot",code:"\uD83D\uDC69\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman pilot: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman pilot: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman pilot: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman pilot: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman pilot: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\u2708\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man astronaut",code:"\uD83D\uDC68\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"light",keyword:"man astronaut: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"medium-light",keyword:"man astronaut: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"medium",keyword:"man astronaut: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man astronaut: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"dark",keyword:"man astronaut: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"default",keyword:"woman astronaut",code:"\uD83D\uDC69\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"light",keyword:"woman astronaut: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman astronaut: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"medium",keyword:"woman astronaut: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman astronaut: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"dark",keyword:"woman astronaut: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDE80"},{category:"smileys_n_people",tone:"default",keyword:"man firefighter",code:"\uD83D\uDC68\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"light",keyword:"man firefighter: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"medium-light",keyword:"man firefighter: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"medium",keyword:"man firefighter: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man firefighter: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"dark",keyword:"man firefighter: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"default",keyword:"woman firefighter",code:"\uD83D\uDC69\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"light",keyword:"woman firefighter: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman firefighter: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"medium",keyword:"woman firefighter: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman firefighter: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"dark",keyword:"woman firefighter: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDE92"},{category:"smileys_n_people",tone:"default",keyword:"police officer",code:"\uD83D\uDC6E"},{category:"smileys_n_people",tone:"light",keyword:"police officer: light skin tone",code:"\uD83D\uDC6E\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"police officer: medium-light skin tone",code:"\uD83D\uDC6E\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"police officer: medium skin tone",code:"\uD83D\uDC6E\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"police officer: medium-dark skin tone",code:"\uD83D\uDC6E\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"police officer: dark skin tone",code:"\uD83D\uDC6E\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man police officer",code:"\uD83D\uDC6E\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man police officer: light skin tone",code:"\uD83D\uDC6E\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man police officer: medium-light skin tone",code:"\uD83D\uDC6E\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man police officer: medium skin tone",code:"\uD83D\uDC6E\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man police officer: medium-dark skin tone",code:"\uD83D\uDC6E\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man police officer: dark skin tone",code:"\uD83D\uDC6E\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman police officer",code:"\uD83D\uDC6E\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman police officer: light skin tone",code:"\uD83D\uDC6E\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman police officer: medium-light skin tone",code:"\uD83D\uDC6E\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman police officer: medium skin tone",code:"\uD83D\uDC6E\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman police officer: medium-dark skin tone",code:"\uD83D\uDC6E\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman police officer: dark skin tone",code:"\uD83D\uDC6E\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"detective",code:"\uD83D\uDD75\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"detective: light skin tone",code:"\uD83D\uDD75\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"detective: medium-light skin tone",code:"\uD83D\uDD75\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"detective: medium skin tone",code:"\uD83D\uDD75\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"detective: medium-dark skin tone",code:"\uD83D\uDD75\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"detective: dark skin tone",code:"\uD83D\uDD75\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man detective",code:"\uD83D\uDD75\uFE0F\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man detective: light skin tone",code:"\uD83D\uDD75\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man detective: medium-light skin tone",code:"\uD83D\uDD75\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man detective: medium skin tone",code:"\uD83D\uDD75\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man detective: medium-dark skin tone",code:"\uD83D\uDD75\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man detective: dark skin tone",code:"\uD83D\uDD75\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman detective",code:"\uD83D\uDD75\uFE0F\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman detective: light skin tone",code:"\uD83D\uDD75\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman detective: medium-light skin tone",code:"\uD83D\uDD75\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman detective: medium skin tone",code:"\uD83D\uDD75\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman detective: medium-dark skin tone",code:"\uD83D\uDD75\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman detective: dark skin tone",code:"\uD83D\uDD75\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"guard",code:"\uD83D\uDC82"},{category:"smileys_n_people",tone:"light",keyword:"guard: light skin tone",code:"\uD83D\uDC82\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"guard: medium-light skin tone",code:"\uD83D\uDC82\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"guard: medium skin tone",code:"\uD83D\uDC82\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"guard: medium-dark skin tone",code:"\uD83D\uDC82\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"guard: dark skin tone",code:"\uD83D\uDC82\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man guard",code:"\uD83D\uDC82\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man guard: light skin tone",code:"\uD83D\uDC82\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man guard: medium-light skin tone",code:"\uD83D\uDC82\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man guard: medium skin tone",code:"\uD83D\uDC82\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man guard: medium-dark skin tone",code:"\uD83D\uDC82\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man guard: dark skin tone",code:"\uD83D\uDC82\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman guard",code:"\uD83D\uDC82\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman guard: light skin tone",code:"\uD83D\uDC82\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman guard: medium-light skin tone",code:"\uD83D\uDC82\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman guard: medium skin tone",code:"\uD83D\uDC82\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman guard: medium-dark skin tone",code:"\uD83D\uDC82\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman guard: dark skin tone",code:"\uD83D\uDC82\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"construction worker",code:"\uD83D\uDC77"},{category:"smileys_n_people",tone:"light",keyword:"construction worker: light skin tone",code:"\uD83D\uDC77\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"construction worker: medium-light skin tone",code:"\uD83D\uDC77\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"construction worker: medium skin tone",code:"\uD83D\uDC77\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"construction worker: medium-dark skin tone",code:"\uD83D\uDC77\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"construction worker: dark skin tone",code:"\uD83D\uDC77\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man construction worker",code:"\uD83D\uDC77\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man construction worker: light skin tone",code:"\uD83D\uDC77\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man construction worker: medium-light skin tone",code:"\uD83D\uDC77\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man construction worker: medium skin tone",code:"\uD83D\uDC77\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man construction worker: medium-dark skin tone",code:"\uD83D\uDC77\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man construction worker: dark skin tone",code:"\uD83D\uDC77\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman construction worker",code:"\uD83D\uDC77\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman construction worker: light skin tone",code:"\uD83D\uDC77\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman construction worker: medium-light skin tone",code:"\uD83D\uDC77\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman construction worker: medium skin tone",code:"\uD83D\uDC77\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman construction worker: medium-dark skin tone",code:"\uD83D\uDC77\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman construction worker: dark skin tone",code:"\uD83D\uDC77\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"prince",code:"\uD83E\uDD34"},{category:"smileys_n_people",tone:"light",keyword:"prince: light skin tone",code:"\uD83E\uDD34\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"prince: medium-light skin tone",code:"\uD83E\uDD34\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"prince: medium skin tone",code:"\uD83E\uDD34\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"prince: medium-dark skin tone",code:"\uD83E\uDD34\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"prince: dark skin tone",code:"\uD83E\uDD34\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"princess",code:"\uD83D\uDC78"},{category:"smileys_n_people",tone:"light",keyword:"princess: light skin tone",code:"\uD83D\uDC78\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"princess: medium-light skin tone",code:"\uD83D\uDC78\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"princess: medium skin tone",code:"\uD83D\uDC78\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"princess: medium-dark skin tone",code:"\uD83D\uDC78\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"princess: dark skin tone",code:"\uD83D\uDC78\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"person wearing turban",code:"\uD83D\uDC73"},{category:"smileys_n_people",tone:"light",keyword:"person wearing turban: light skin tone",code:"\uD83D\uDC73\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person wearing turban: medium-light skin tone",code:"\uD83D\uDC73\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person wearing turban: medium skin tone",code:"\uD83D\uDC73\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person wearing turban: medium-dark skin tone",code:"\uD83D\uDC73\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person wearing turban: dark skin tone",code:"\uD83D\uDC73\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man wearing turban",code:"\uD83D\uDC73\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man wearing turban: light skin tone",code:"\uD83D\uDC73\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man wearing turban: medium-light skin tone",code:"\uD83D\uDC73\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man wearing turban: medium skin tone",code:"\uD83D\uDC73\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man wearing turban: medium-dark skin tone",code:"\uD83D\uDC73\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man wearing turban: dark skin tone",code:"\uD83D\uDC73\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman wearing turban",code:"\uD83D\uDC73\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman wearing turban: light skin tone",code:"\uD83D\uDC73\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman wearing turban: medium-light skin tone",code:"\uD83D\uDC73\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman wearing turban: medium skin tone",code:"\uD83D\uDC73\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman wearing turban: medium-dark skin tone",code:"\uD83D\uDC73\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman wearing turban: dark skin tone",code:"\uD83D\uDC73\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man with Chinese cap",code:"\uD83D\uDC72"},{category:"smileys_n_people",tone:"light",keyword:"man with Chinese cap: light skin tone",code:"\uD83D\uDC72\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man with Chinese cap: medium-light skin tone",code:"\uD83D\uDC72\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"man with Chinese cap: medium skin tone",code:"\uD83D\uDC72\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man with Chinese cap: medium-dark skin tone",code:"\uD83D\uDC72\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"man with Chinese cap: dark skin tone",code:"\uD83D\uDC72\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman with headscarf",code:"\uD83E\uDDD5"},{category:"smileys_n_people",tone:"light",keyword:"woman with headscarf: light skin tone",code:"\uD83E\uDDD5\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman with headscarf: medium-light skin tone",code:"\uD83E\uDDD5\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"woman with headscarf: medium skin tone",code:"\uD83E\uDDD5\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman with headscarf: medium-dark skin tone",code:"\uD83E\uDDD5\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"woman with headscarf: dark skin tone",code:"\uD83E\uDDD5\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"bearded person",code:"\uD83E\uDDD4"},{category:"smileys_n_people",tone:"light",keyword:"bearded person: light skin tone",code:"\uD83E\uDDD4\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"bearded person: medium-light skin tone",code:"\uD83E\uDDD4\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"bearded person: medium skin tone",code:"\uD83E\uDDD4\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"bearded person: medium-dark skin tone",code:"\uD83E\uDDD4\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"bearded person: dark skin tone",code:"\uD83E\uDDD4\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"blond-haired person",code:"\uD83D\uDC71"},{category:"smileys_n_people",tone:"light",keyword:"blond-haired person: light skin tone",code:"\uD83D\uDC71\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"blond-haired person: medium-light skin tone",code:"\uD83D\uDC71\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"blond-haired person: medium skin tone",code:"\uD83D\uDC71\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"blond-haired person: medium-dark skin tone",code:"\uD83D\uDC71\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"blond-haired person: dark skin tone",code:"\uD83D\uDC71\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"blond-haired man",code:"\uD83D\uDC71\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"blond-haired man: light skin tone",code:"\uD83D\uDC71\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"blond-haired man: medium-light skin tone",code:"\uD83D\uDC71\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"blond-haired man: medium skin tone",code:"\uD83D\uDC71\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"blond-haired man: medium-dark skin tone",code:"\uD83D\uDC71\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"blond-haired man: dark skin tone",code:"\uD83D\uDC71\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"blond-haired woman",code:"\uD83D\uDC71\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"blond-haired woman: light skin tone",code:"\uD83D\uDC71\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"blond-haired woman: medium-light skin tone",code:"\uD83D\uDC71\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"blond-haired woman: medium skin tone",code:"\uD83D\uDC71\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"blond-haired woman: medium-dark skin tone",code:"\uD83D\uDC71\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"blond-haired woman: dark skin tone",code:"\uD83D\uDC71\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man, red haired",code:"\uD83D\uDC68\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"light",keyword:"man, red haired: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"medium-light",keyword:"man, red haired: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"medium",keyword:"man, red haired: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man, red haired: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"dark",keyword:"man, red haired: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"default",keyword:"woman, red haired",code:"\uD83D\uDC69\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"light",keyword:"woman, red haired: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman, red haired: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"medium",keyword:"woman, red haired: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman, red haired: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"dark",keyword:"woman, red haired: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDDB0"},{category:"smileys_n_people",tone:"default",keyword:"man, curly haired",code:"\uD83D\uDC68\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"light",keyword:"man, curly haired: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"medium-light",keyword:"man, curly haired: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"medium",keyword:"man, curly haired: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man, curly haired: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"dark",keyword:"man, curly haired: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"default",keyword:"woman, curly haired",code:"\uD83D\uDC69\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"light",keyword:"woman, curly haired: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman, curly haired: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"medium",keyword:"woman, curly haired: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman, curly haired: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"dark",keyword:"woman, curly haired: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDDB1"},{category:"smileys_n_people",tone:"default",keyword:"man, bald",code:"\uD83D\uDC68\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"light",keyword:"man, bald: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"medium-light",keyword:"man, bald: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"medium",keyword:"man, bald: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man, bald: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"dark",keyword:"man, bald: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"default",keyword:"woman, bald",code:"\uD83D\uDC69\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"light",keyword:"woman, bald: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman, bald: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"medium",keyword:"woman, bald: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman, bald: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"dark",keyword:"woman, bald: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDDB2"},{category:"smileys_n_people",tone:"default",keyword:"man, white haired",code:"\uD83D\uDC68\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"light",keyword:"man, white haired: light skin tone",code:"\uD83D\uDC68\uD83C\uDFFB\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"medium-light",keyword:"man, white haired: medium-light skin tone",code:"\uD83D\uDC68\uD83C\uDFFC\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"medium",keyword:"man, white haired: medium skin tone",code:"\uD83D\uDC68\uD83C\uDFFD\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man, white haired: medium-dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFE\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"dark",keyword:"man, white haired: dark skin tone",code:"\uD83D\uDC68\uD83C\uDFFF\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"default",keyword:"woman, white haired",code:"\uD83D\uDC69\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"light",keyword:"woman, white haired: light skin tone",code:"\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman, white haired: medium-light skin tone",code:"\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"medium",keyword:"woman, white haired: medium skin tone",code:"\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman, white haired: medium-dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"dark",keyword:"woman, white haired: dark skin tone",code:"\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDDB3"},{category:"smileys_n_people",tone:"default",keyword:"man in tuxedo",code:"\uD83E\uDD35"},{category:"smileys_n_people",tone:"light",keyword:"man in tuxedo: light skin tone",code:"\uD83E\uDD35\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man in tuxedo: medium-light skin tone",code:"\uD83E\uDD35\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"man in tuxedo: medium skin tone",code:"\uD83E\uDD35\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man in tuxedo: medium-dark skin tone",code:"\uD83E\uDD35\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"man in tuxedo: dark skin tone",code:"\uD83E\uDD35\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"bride with veil",code:"\uD83D\uDC70"},{category:"smileys_n_people",tone:"light",keyword:"bride with veil: light skin tone",code:"\uD83D\uDC70\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"bride with veil: medium-light skin tone",code:"\uD83D\uDC70\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"bride with veil: medium skin tone",code:"\uD83D\uDC70\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"bride with veil: medium-dark skin tone",code:"\uD83D\uDC70\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"bride with veil: dark skin tone",code:"\uD83D\uDC70\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"pregnant woman",code:"\uD83E\uDD30"},{category:"smileys_n_people",tone:"light",keyword:"pregnant woman: light skin tone",code:"\uD83E\uDD30\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"pregnant woman: medium-light skin tone",code:"\uD83E\uDD30\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"pregnant woman: medium skin tone",code:"\uD83E\uDD30\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"pregnant woman: medium-dark skin tone",code:"\uD83E\uDD30\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"pregnant woman: dark skin tone",code:"\uD83E\uDD30\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"breast-feeding",code:"\uD83E\uDD31"},{category:"smileys_n_people",tone:"light",keyword:"breast-feeding: light skin tone",code:"\uD83E\uDD31\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"breast-feeding: medium-light skin tone",code:"\uD83E\uDD31\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"breast-feeding: medium skin tone",code:"\uD83E\uDD31\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"breast-feeding: medium-dark skin tone",code:"\uD83E\uDD31\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"breast-feeding: dark skin tone",code:"\uD83E\uDD31\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"baby angel",code:"\uD83D\uDC7C"},{category:"smileys_n_people",tone:"light",keyword:"baby angel: light skin tone",code:"\uD83D\uDC7C\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"baby angel: medium-light skin tone",code:"\uD83D\uDC7C\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"baby angel: medium skin tone",code:"\uD83D\uDC7C\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"baby angel: medium-dark skin tone",code:"\uD83D\uDC7C\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"baby angel: dark skin tone",code:"\uD83D\uDC7C\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"Santa Claus",code:"\uD83C\uDF85"},{category:"smileys_n_people",tone:"light",keyword:"Santa Claus: light skin tone",code:"\uD83C\uDF85\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"Santa Claus: medium-light skin tone",code:"\uD83C\uDF85\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"Santa Claus: medium skin tone",code:"\uD83C\uDF85\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"Santa Claus: medium-dark skin tone",code:"\uD83C\uDF85\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"Santa Claus: dark skin tone",code:"\uD83C\uDF85\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"Mrs. Claus",code:"\uD83E\uDD36"},{category:"smileys_n_people",tone:"light",keyword:"Mrs. Claus: light skin tone",code:"\uD83E\uDD36\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"Mrs. Claus: medium-light skin tone",code:"\uD83E\uDD36\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"Mrs. Claus: medium skin tone",code:"\uD83E\uDD36\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"Mrs. Claus: medium-dark skin tone",code:"\uD83E\uDD36\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"Mrs. Claus: dark skin tone",code:"\uD83E\uDD36\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"superhero",code:"\uD83E\uDDB8"},{category:"smileys_n_people",tone:"light",keyword:"superhero: light skin tone",code:"\uD83E\uDDB8\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"superhero: medium-light skin tone",code:"\uD83E\uDDB8\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"superhero: medium skin tone",code:"\uD83E\uDDB8\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"superhero: medium-dark skin tone",code:"\uD83E\uDDB8\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"superhero: dark skin tone",code:"\uD83E\uDDB8\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman superhero",code:"\uD83E\uDDB8\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman superhero: light skin tone",code:"\uD83E\uDDB8\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman superhero: medium-light skin tone",code:"\uD83E\uDDB8\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman superhero: medium skin tone",code:"\uD83E\uDDB8\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman superhero: medium-dark skin tone",code:"\uD83E\uDDB8\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman superhero: dark skin tone",code:"\uD83E\uDDB8\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man superhero",code:"\uD83E\uDDB8\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man superhero: light skin tone",code:"\uD83E\uDDB8\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man superhero: medium-light skin tone",code:"\uD83E\uDDB8\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man superhero: medium skin tone",code:"\uD83E\uDDB8\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man superhero: medium-dark skin tone",code:"\uD83E\uDDB8\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man superhero: dark skin tone",code:"\uD83E\uDDB8\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"supervillain",code:"\uD83E\uDDB9"},{category:"smileys_n_people",tone:"light",keyword:"supervillain: light skin tone",code:"\uD83E\uDDB9\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"supervillain: medium-light skin tone",code:"\uD83E\uDDB9\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"supervillain: medium skin tone",code:"\uD83E\uDDB9\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"supervillain: medium-dark skin tone",code:"\uD83E\uDDB9\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"supervillain: dark skin tone",code:"\uD83E\uDDB9\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman supervillain",code:"\uD83E\uDDB9\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman supervillain: light skin tone",code:"\uD83E\uDDB9\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman supervillain: medium-light skin tone",code:"\uD83E\uDDB9\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman supervillain: medium skin tone",code:"\uD83E\uDDB9\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman supervillain: medium-dark skin tone",code:"\uD83E\uDDB9\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman supervillain: dark skin tone",code:"\uD83E\uDDB9\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man supervillain",code:"\uD83E\uDDB9\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man supervillain: light skin tone",code:"\uD83E\uDDB9\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man supervillain: medium-light skin tone",code:"\uD83E\uDDB9\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man supervillain: medium skin tone",code:"\uD83E\uDDB9\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man supervillain: medium-dark skin tone",code:"\uD83E\uDDB9\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man supervillain: dark skin tone",code:"\uD83E\uDDB9\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"mage",code:"\uD83E\uDDD9"},{category:"smileys_n_people",tone:"light",keyword:"mage: light skin tone",code:"\uD83E\uDDD9\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"mage: medium-light skin tone",code:"\uD83E\uDDD9\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"mage: medium skin tone",code:"\uD83E\uDDD9\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"mage: medium-dark skin tone",code:"\uD83E\uDDD9\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"mage: dark skin tone",code:"\uD83E\uDDD9\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman mage",code:"\uD83E\uDDD9\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman mage: light skin tone",code:"\uD83E\uDDD9\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman mage: medium-light skin tone",code:"\uD83E\uDDD9\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman mage: medium skin tone",code:"\uD83E\uDDD9\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman mage: medium-dark skin tone",code:"\uD83E\uDDD9\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman mage: dark skin tone",code:"\uD83E\uDDD9\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man mage",code:"\uD83E\uDDD9\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man mage: light skin tone",code:"\uD83E\uDDD9\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man mage: medium-light skin tone",code:"\uD83E\uDDD9\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man mage: medium skin tone",code:"\uD83E\uDDD9\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man mage: medium-dark skin tone",code:"\uD83E\uDDD9\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man mage: dark skin tone",code:"\uD83E\uDDD9\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"fairy",code:"\uD83E\uDDDA"},{category:"smileys_n_people",tone:"light",keyword:"fairy: light skin tone",code:"\uD83E\uDDDA\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"fairy: medium-light skin tone",code:"\uD83E\uDDDA\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"fairy: medium skin tone",code:"\uD83E\uDDDA\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"fairy: medium-dark skin tone",code:"\uD83E\uDDDA\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"fairy: dark skin tone",code:"\uD83E\uDDDA\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman fairy",code:"\uD83E\uDDDA\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman fairy: light skin tone",code:"\uD83E\uDDDA\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman fairy: medium-light skin tone",code:"\uD83E\uDDDA\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman fairy: medium skin tone",code:"\uD83E\uDDDA\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman fairy: medium-dark skin tone",code:"\uD83E\uDDDA\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman fairy: dark skin tone",code:"\uD83E\uDDDA\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man fairy",code:"\uD83E\uDDDA\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man fairy: light skin tone",code:"\uD83E\uDDDA\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man fairy: medium-light skin tone",code:"\uD83E\uDDDA\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man fairy: medium skin tone",code:"\uD83E\uDDDA\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man fairy: medium-dark skin tone",code:"\uD83E\uDDDA\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man fairy: dark skin tone",code:"\uD83E\uDDDA\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"vampire",code:"\uD83E\uDDDB"},{category:"smileys_n_people",tone:"light",keyword:"vampire: light skin tone",code:"\uD83E\uDDDB\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"vampire: medium-light skin tone",code:"\uD83E\uDDDB\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"vampire: medium skin tone",code:"\uD83E\uDDDB\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"vampire: medium-dark skin tone",code:"\uD83E\uDDDB\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"vampire: dark skin tone",code:"\uD83E\uDDDB\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman vampire",code:"\uD83E\uDDDB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman vampire: light skin tone",code:"\uD83E\uDDDB\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman vampire: medium-light skin tone",code:"\uD83E\uDDDB\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman vampire: medium skin tone",code:"\uD83E\uDDDB\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman vampire: medium-dark skin tone",code:"\uD83E\uDDDB\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman vampire: dark skin tone",code:"\uD83E\uDDDB\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man vampire",code:"\uD83E\uDDDB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man vampire: light skin tone",code:"\uD83E\uDDDB\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man vampire: medium-light skin tone",code:"\uD83E\uDDDB\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man vampire: medium skin tone",code:"\uD83E\uDDDB\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man vampire: medium-dark skin tone",code:"\uD83E\uDDDB\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man vampire: dark skin tone",code:"\uD83E\uDDDB\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"merperson",code:"\uD83E\uDDDC"},{category:"smileys_n_people",tone:"light",keyword:"merperson: light skin tone",code:"\uD83E\uDDDC\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"merperson: medium-light skin tone",code:"\uD83E\uDDDC\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"merperson: medium skin tone",code:"\uD83E\uDDDC\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"merperson: medium-dark skin tone",code:"\uD83E\uDDDC\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"merperson: dark skin tone",code:"\uD83E\uDDDC\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"mermaid",code:"\uD83E\uDDDC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"mermaid: light skin tone",code:"\uD83E\uDDDC\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"mermaid: medium-light skin tone",code:"\uD83E\uDDDC\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"mermaid: medium skin tone",code:"\uD83E\uDDDC\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"mermaid: medium-dark skin tone",code:"\uD83E\uDDDC\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"mermaid: dark skin tone",code:"\uD83E\uDDDC\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"merman",code:"\uD83E\uDDDC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"merman: light skin tone",code:"\uD83E\uDDDC\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"merman: medium-light skin tone",code:"\uD83E\uDDDC\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"merman: medium skin tone",code:"\uD83E\uDDDC\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"merman: medium-dark skin tone",code:"\uD83E\uDDDC\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"merman: dark skin tone",code:"\uD83E\uDDDC\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"elf",code:"\uD83E\uDDDD"},{category:"smileys_n_people",tone:"light",keyword:"elf: light skin tone",code:"\uD83E\uDDDD\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"elf: medium-light skin tone",code:"\uD83E\uDDDD\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"elf: medium skin tone",code:"\uD83E\uDDDD\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"elf: medium-dark skin tone",code:"\uD83E\uDDDD\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"elf: dark skin tone",code:"\uD83E\uDDDD\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman elf",code:"\uD83E\uDDDD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman elf: light skin tone",code:"\uD83E\uDDDD\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman elf: medium-light skin tone",code:"\uD83E\uDDDD\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman elf: medium skin tone",code:"\uD83E\uDDDD\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman elf: medium-dark skin tone",code:"\uD83E\uDDDD\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman elf: dark skin tone",code:"\uD83E\uDDDD\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man elf",code:"\uD83E\uDDDD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man elf: light skin tone",code:"\uD83E\uDDDD\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man elf: medium-light skin tone",code:"\uD83E\uDDDD\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man elf: medium skin tone",code:"\uD83E\uDDDD\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man elf: medium-dark skin tone",code:"\uD83E\uDDDD\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man elf: dark skin tone",code:"\uD83E\uDDDD\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",keyword:"genie",code:"\uD83E\uDDDE"},{category:"smileys_n_people",keyword:"woman genie",code:"\uD83E\uDDDE\u200D\u2640\uFE0F"},{category:"smileys_n_people",keyword:"man genie",code:"\uD83E\uDDDE\u200D\u2642\uFE0F"},{category:"smileys_n_people",keyword:"zombie",code:"\uD83E\uDDDF"},{category:"smileys_n_people",keyword:"woman zombie",code:"\uD83E\uDDDF\u200D\u2640\uFE0F"},{category:"smileys_n_people",keyword:"man zombie",code:"\uD83E\uDDDF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person frowning",code:"\uD83D\uDE4D"},{category:"smileys_n_people",tone:"light",keyword:"person frowning: light skin tone",code:"\uD83D\uDE4D\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person frowning: medium-light skin tone",code:"\uD83D\uDE4D\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person frowning: medium skin tone",code:"\uD83D\uDE4D\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person frowning: medium-dark skin tone",code:"\uD83D\uDE4D\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person frowning: dark skin tone",code:"\uD83D\uDE4D\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man frowning",code:"\uD83D\uDE4D\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man frowning: light skin tone",code:"\uD83D\uDE4D\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man frowning: medium-light skin tone",code:"\uD83D\uDE4D\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man frowning: medium skin tone",code:"\uD83D\uDE4D\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man frowning: medium-dark skin tone",code:"\uD83D\uDE4D\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man frowning: dark skin tone",code:"\uD83D\uDE4D\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman frowning",code:"\uD83D\uDE4D\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman frowning: light skin tone",code:"\uD83D\uDE4D\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman frowning: medium-light skin tone",code:"\uD83D\uDE4D\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman frowning: medium skin tone",code:"\uD83D\uDE4D\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman frowning: medium-dark skin tone",code:"\uD83D\uDE4D\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman frowning: dark skin tone",code:"\uD83D\uDE4D\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person pouting",code:"\uD83D\uDE4E"},{category:"smileys_n_people",tone:"light",keyword:"person pouting: light skin tone",code:"\uD83D\uDE4E\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person pouting: medium-light skin tone",code:"\uD83D\uDE4E\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person pouting: medium skin tone",code:"\uD83D\uDE4E\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person pouting: medium-dark skin tone",code:"\uD83D\uDE4E\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person pouting: dark skin tone",code:"\uD83D\uDE4E\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man pouting",code:"\uD83D\uDE4E\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man pouting: light skin tone",code:"\uD83D\uDE4E\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man pouting: medium-light skin tone",code:"\uD83D\uDE4E\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man pouting: medium skin tone",code:"\uD83D\uDE4E\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man pouting: medium-dark skin tone",code:"\uD83D\uDE4E\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man pouting: dark skin tone",code:"\uD83D\uDE4E\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman pouting",code:"\uD83D\uDE4E\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman pouting: light skin tone",code:"\uD83D\uDE4E\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman pouting: medium-light skin tone",code:"\uD83D\uDE4E\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman pouting: medium skin tone",code:"\uD83D\uDE4E\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman pouting: medium-dark skin tone",code:"\uD83D\uDE4E\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman pouting: dark skin tone",code:"\uD83D\uDE4E\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person gesturing NO",code:"\uD83D\uDE45"},{category:"smileys_n_people",tone:"light",keyword:"person gesturing NO: light skin tone",code:"\uD83D\uDE45\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person gesturing NO: medium-light skin tone",code:"\uD83D\uDE45\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person gesturing NO: medium skin tone",code:"\uD83D\uDE45\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person gesturing NO: medium-dark skin tone",code:"\uD83D\uDE45\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person gesturing NO: dark skin tone",code:"\uD83D\uDE45\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man gesturing NO",code:"\uD83D\uDE45\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man gesturing NO: light skin tone",code:"\uD83D\uDE45\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man gesturing NO: medium-light skin tone",code:"\uD83D\uDE45\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man gesturing NO: medium skin tone",code:"\uD83D\uDE45\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man gesturing NO: medium-dark skin tone",code:"\uD83D\uDE45\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man gesturing NO: dark skin tone",code:"\uD83D\uDE45\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman gesturing NO",code:"\uD83D\uDE45\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman gesturing NO: light skin tone",code:"\uD83D\uDE45\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman gesturing NO: medium-light skin tone",code:"\uD83D\uDE45\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman gesturing NO: medium skin tone",code:"\uD83D\uDE45\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman gesturing NO: medium-dark skin tone",code:"\uD83D\uDE45\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman gesturing NO: dark skin tone",code:"\uD83D\uDE45\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person gesturing OK",code:"\uD83D\uDE46"},{category:"smileys_n_people",tone:"light",keyword:"person gesturing OK: light skin tone",code:"\uD83D\uDE46\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person gesturing OK: medium-light skin tone",code:"\uD83D\uDE46\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person gesturing OK: medium skin tone",code:"\uD83D\uDE46\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person gesturing OK: medium-dark skin tone",code:"\uD83D\uDE46\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person gesturing OK: dark skin tone",code:"\uD83D\uDE46\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man gesturing OK",code:"\uD83D\uDE46\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man gesturing OK: light skin tone",code:"\uD83D\uDE46\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man gesturing OK: medium-light skin tone",code:"\uD83D\uDE46\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man gesturing OK: medium skin tone",code:"\uD83D\uDE46\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man gesturing OK: medium-dark skin tone",code:"\uD83D\uDE46\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man gesturing OK: dark skin tone",code:"\uD83D\uDE46\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman gesturing OK",code:"\uD83D\uDE46\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman gesturing OK: light skin tone",code:"\uD83D\uDE46\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman gesturing OK: medium-light skin tone",code:"\uD83D\uDE46\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman gesturing OK: medium skin tone",code:"\uD83D\uDE46\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman gesturing OK: medium-dark skin tone",code:"\uD83D\uDE46\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman gesturing OK: dark skin tone",code:"\uD83D\uDE46\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person tipping hand",code:"\uD83D\uDC81"},{category:"smileys_n_people",tone:"light",keyword:"person tipping hand: light skin tone",code:"\uD83D\uDC81\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person tipping hand: medium-light skin tone",code:"\uD83D\uDC81\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person tipping hand: medium skin tone",code:"\uD83D\uDC81\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person tipping hand: medium-dark skin tone",code:"\uD83D\uDC81\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person tipping hand: dark skin tone",code:"\uD83D\uDC81\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man tipping hand",code:"\uD83D\uDC81\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man tipping hand: light skin tone",code:"\uD83D\uDC81\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man tipping hand: medium-light skin tone",code:"\uD83D\uDC81\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man tipping hand: medium skin tone",code:"\uD83D\uDC81\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man tipping hand: medium-dark skin tone",code:"\uD83D\uDC81\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man tipping hand: dark skin tone",code:"\uD83D\uDC81\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman tipping hand",code:"\uD83D\uDC81\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman tipping hand: light skin tone",code:"\uD83D\uDC81\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman tipping hand: medium-light skin tone",code:"\uD83D\uDC81\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman tipping hand: medium skin tone",code:"\uD83D\uDC81\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman tipping hand: medium-dark skin tone",code:"\uD83D\uDC81\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman tipping hand: dark skin tone",code:"\uD83D\uDC81\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person raising hand",code:"\uD83D\uDE4B"},{category:"smileys_n_people",tone:"light",keyword:"person raising hand: light skin tone",code:"\uD83D\uDE4B\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person raising hand: medium-light skin tone",code:"\uD83D\uDE4B\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person raising hand: medium skin tone",code:"\uD83D\uDE4B\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person raising hand: medium-dark skin tone",code:"\uD83D\uDE4B\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person raising hand: dark skin tone",code:"\uD83D\uDE4B\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man raising hand",code:"\uD83D\uDE4B\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man raising hand: light skin tone",code:"\uD83D\uDE4B\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man raising hand: medium-light skin tone",code:"\uD83D\uDE4B\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man raising hand: medium skin tone",code:"\uD83D\uDE4B\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man raising hand: medium-dark skin tone",code:"\uD83D\uDE4B\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man raising hand: dark skin tone",code:"\uD83D\uDE4B\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman raising hand",code:"\uD83D\uDE4B\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman raising hand: light skin tone",code:"\uD83D\uDE4B\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman raising hand: medium-light skin tone",code:"\uD83D\uDE4B\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman raising hand: medium skin tone",code:"\uD83D\uDE4B\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman raising hand: medium-dark skin tone",code:"\uD83D\uDE4B\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman raising hand: dark skin tone",code:"\uD83D\uDE4B\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person bowing",code:"\uD83D\uDE47"},{category:"smileys_n_people",tone:"light",keyword:"person bowing: light skin tone",code:"\uD83D\uDE47\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person bowing: medium-light skin tone",code:"\uD83D\uDE47\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person bowing: medium skin tone",code:"\uD83D\uDE47\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person bowing: medium-dark skin tone",code:"\uD83D\uDE47\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person bowing: dark skin tone",code:"\uD83D\uDE47\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man bowing",code:"\uD83D\uDE47\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man bowing: light skin tone",code:"\uD83D\uDE47\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man bowing: medium-light skin tone",code:"\uD83D\uDE47\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man bowing: medium skin tone",code:"\uD83D\uDE47\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man bowing: medium-dark skin tone",code:"\uD83D\uDE47\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man bowing: dark skin tone",code:"\uD83D\uDE47\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman bowing",code:"\uD83D\uDE47\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman bowing: light skin tone",code:"\uD83D\uDE47\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman bowing: medium-light skin tone",code:"\uD83D\uDE47\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman bowing: medium skin tone",code:"\uD83D\uDE47\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman bowing: medium-dark skin tone",code:"\uD83D\uDE47\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman bowing: dark skin tone",code:"\uD83D\uDE47\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person facepalming",code:"\uD83E\uDD26"},{category:"smileys_n_people",tone:"light",keyword:"person facepalming: light skin tone",code:"\uD83E\uDD26\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person facepalming: medium-light skin tone",code:"\uD83E\uDD26\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person facepalming: medium skin tone",code:"\uD83E\uDD26\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person facepalming: medium-dark skin tone",code:"\uD83E\uDD26\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person facepalming: dark skin tone",code:"\uD83E\uDD26\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man facepalming",code:"\uD83E\uDD26\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man facepalming: light skin tone",code:"\uD83E\uDD26\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man facepalming: medium-light skin tone",code:"\uD83E\uDD26\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man facepalming: medium skin tone",code:"\uD83E\uDD26\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man facepalming: medium-dark skin tone",code:"\uD83E\uDD26\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man facepalming: dark skin tone",code:"\uD83E\uDD26\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman facepalming",code:"\uD83E\uDD26\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman facepalming: light skin tone",code:"\uD83E\uDD26\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman facepalming: medium-light skin tone",code:"\uD83E\uDD26\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman facepalming: medium skin tone",code:"\uD83E\uDD26\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman facepalming: medium-dark skin tone",code:"\uD83E\uDD26\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman facepalming: dark skin tone",code:"\uD83E\uDD26\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person shrugging",code:"\uD83E\uDD37"},{category:"smileys_n_people",tone:"light",keyword:"person shrugging: light skin tone",code:"\uD83E\uDD37\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person shrugging: medium-light skin tone",code:"\uD83E\uDD37\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person shrugging: medium skin tone",code:"\uD83E\uDD37\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person shrugging: medium-dark skin tone",code:"\uD83E\uDD37\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person shrugging: dark skin tone",code:"\uD83E\uDD37\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man shrugging",code:"\uD83E\uDD37\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man shrugging: light skin tone",code:"\uD83E\uDD37\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man shrugging: medium-light skin tone",code:"\uD83E\uDD37\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man shrugging: medium skin tone",code:"\uD83E\uDD37\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man shrugging: medium-dark skin tone",code:"\uD83E\uDD37\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man shrugging: dark skin tone",code:"\uD83E\uDD37\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman shrugging",code:"\uD83E\uDD37\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman shrugging: light skin tone",code:"\uD83E\uDD37\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman shrugging: medium-light skin tone",code:"\uD83E\uDD37\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman shrugging: medium skin tone",code:"\uD83E\uDD37\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman shrugging: medium-dark skin tone",code:"\uD83E\uDD37\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman shrugging: dark skin tone",code:"\uD83E\uDD37\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person getting massage",code:"\uD83D\uDC86"},{category:"smileys_n_people",tone:"light",keyword:"person getting massage: light skin tone",code:"\uD83D\uDC86\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person getting massage: medium-light skin tone",code:"\uD83D\uDC86\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person getting massage: medium skin tone",code:"\uD83D\uDC86\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person getting massage: medium-dark skin tone",code:"\uD83D\uDC86\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person getting massage: dark skin tone",code:"\uD83D\uDC86\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man getting massage",code:"\uD83D\uDC86\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man getting massage: light skin tone",code:"\uD83D\uDC86\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man getting massage: medium-light skin tone",code:"\uD83D\uDC86\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man getting massage: medium skin tone",code:"\uD83D\uDC86\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man getting massage: medium-dark skin tone",code:"\uD83D\uDC86\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man getting massage: dark skin tone",code:"\uD83D\uDC86\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman getting massage",code:"\uD83D\uDC86\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman getting massage: light skin tone",code:"\uD83D\uDC86\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman getting massage: medium-light skin tone",code:"\uD83D\uDC86\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman getting massage: medium skin tone",code:"\uD83D\uDC86\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman getting massage: medium-dark skin tone",code:"\uD83D\uDC86\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman getting massage: dark skin tone",code:"\uD83D\uDC86\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person getting haircut",code:"\uD83D\uDC87"},{category:"smileys_n_people",tone:"light",keyword:"person getting haircut: light skin tone",code:"\uD83D\uDC87\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person getting haircut: medium-light skin tone",code:"\uD83D\uDC87\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person getting haircut: medium skin tone",code:"\uD83D\uDC87\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person getting haircut: medium-dark skin tone",code:"\uD83D\uDC87\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person getting haircut: dark skin tone",code:"\uD83D\uDC87\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man getting haircut",code:"\uD83D\uDC87\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man getting haircut: light skin tone",code:"\uD83D\uDC87\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man getting haircut: medium-light skin tone",code:"\uD83D\uDC87\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man getting haircut: medium skin tone",code:"\uD83D\uDC87\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man getting haircut: medium-dark skin tone",code:"\uD83D\uDC87\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man getting haircut: dark skin tone",code:"\uD83D\uDC87\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman getting haircut",code:"\uD83D\uDC87\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman getting haircut: light skin tone",code:"\uD83D\uDC87\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman getting haircut: medium-light skin tone",code:"\uD83D\uDC87\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman getting haircut: medium skin tone",code:"\uD83D\uDC87\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman getting haircut: medium-dark skin tone",code:"\uD83D\uDC87\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman getting haircut: dark skin tone",code:"\uD83D\uDC87\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person walking",code:"\uD83D\uDEB6"},{category:"smileys_n_people",tone:"light",keyword:"person walking: light skin tone",code:"\uD83D\uDEB6\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person walking: medium-light skin tone",code:"\uD83D\uDEB6\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person walking: medium skin tone",code:"\uD83D\uDEB6\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person walking: medium-dark skin tone",code:"\uD83D\uDEB6\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person walking: dark skin tone",code:"\uD83D\uDEB6\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man walking",code:"\uD83D\uDEB6\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man walking: light skin tone",code:"\uD83D\uDEB6\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man walking: medium-light skin tone",code:"\uD83D\uDEB6\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man walking: medium skin tone",code:"\uD83D\uDEB6\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man walking: medium-dark skin tone",code:"\uD83D\uDEB6\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man walking: dark skin tone",code:"\uD83D\uDEB6\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman walking",code:"\uD83D\uDEB6\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman walking: light skin tone",code:"\uD83D\uDEB6\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman walking: medium-light skin tone",code:"\uD83D\uDEB6\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman walking: medium skin tone",code:"\uD83D\uDEB6\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman walking: medium-dark skin tone",code:"\uD83D\uDEB6\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman walking: dark skin tone",code:"\uD83D\uDEB6\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person running",code:"\uD83C\uDFC3"},{category:"smileys_n_people",tone:"light",keyword:"person running: light skin tone",code:"\uD83C\uDFC3\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person running: medium-light skin tone",code:"\uD83C\uDFC3\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person running: medium skin tone",code:"\uD83C\uDFC3\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person running: medium-dark skin tone",code:"\uD83C\uDFC3\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person running: dark skin tone",code:"\uD83C\uDFC3\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man running",code:"\uD83C\uDFC3\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man running: light skin tone",code:"\uD83C\uDFC3\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man running: medium-light skin tone",code:"\uD83C\uDFC3\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man running: medium skin tone",code:"\uD83C\uDFC3\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man running: medium-dark skin tone",code:"\uD83C\uDFC3\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man running: dark skin tone",code:"\uD83C\uDFC3\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman running",code:"\uD83C\uDFC3\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman running: light skin tone",code:"\uD83C\uDFC3\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman running: medium-light skin tone",code:"\uD83C\uDFC3\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman running: medium skin tone",code:"\uD83C\uDFC3\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman running: medium-dark skin tone",code:"\uD83C\uDFC3\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman running: dark skin tone",code:"\uD83C\uDFC3\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman dancing",code:"\uD83D\uDC83"},{category:"smileys_n_people",tone:"light",keyword:"woman dancing: light skin tone",code:"\uD83D\uDC83\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman dancing: medium-light skin tone",code:"\uD83D\uDC83\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"woman dancing: medium skin tone",code:"\uD83D\uDC83\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman dancing: medium-dark skin tone",code:"\uD83D\uDC83\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"woman dancing: dark skin tone",code:"\uD83D\uDC83\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man dancing",code:"\uD83D\uDD7A"},{category:"smileys_n_people",tone:"light",keyword:"man dancing: light skin tone",code:"\uD83D\uDD7A\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man dancing: medium-light skin tone",code:"\uD83D\uDD7A\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"man dancing: medium skin tone",code:"\uD83D\uDD7A\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man dancing: medium-dark skin tone",code:"\uD83D\uDD7A\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"man dancing: dark skin tone",code:"\uD83D\uDD7A\uD83C\uDFFF"},{category:"smileys_n_people",keyword:"people with bunny ears",code:"\uD83D\uDC6F"},{category:"smileys_n_people",keyword:"men with bunny ears",code:"\uD83D\uDC6F\u200D\u2642\uFE0F"},{category:"smileys_n_people",keyword:"women with bunny ears",code:"\uD83D\uDC6F\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person in steamy room",code:"\uD83E\uDDD6"},{category:"smileys_n_people",tone:"light",keyword:"person in steamy room: light skin tone",code:"\uD83E\uDDD6\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person in steamy room: medium-light skin tone",code:"\uD83E\uDDD6\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person in steamy room: medium skin tone",code:"\uD83E\uDDD6\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person in steamy room: medium-dark skin tone",code:"\uD83E\uDDD6\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person in steamy room: dark skin tone",code:"\uD83E\uDDD6\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman in steamy room",code:"\uD83E\uDDD6\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman in steamy room: light skin tone",code:"\uD83E\uDDD6\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman in steamy room: medium-light skin tone",code:"\uD83E\uDDD6\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman in steamy room: medium skin tone",code:"\uD83E\uDDD6\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman in steamy room: medium-dark skin tone",code:"\uD83E\uDDD6\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman in steamy room: dark skin tone",code:"\uD83E\uDDD6\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man in steamy room",code:"\uD83E\uDDD6\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man in steamy room: light skin tone",code:"\uD83E\uDDD6\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man in steamy room: medium-light skin tone",code:"\uD83E\uDDD6\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man in steamy room: medium skin tone",code:"\uD83E\uDDD6\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man in steamy room: medium-dark skin tone",code:"\uD83E\uDDD6\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man in steamy room: dark skin tone",code:"\uD83E\uDDD6\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person climbing",code:"\uD83E\uDDD7"},{category:"smileys_n_people",tone:"light",keyword:"person climbing: light skin tone",code:"\uD83E\uDDD7\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person climbing: medium-light skin tone",code:"\uD83E\uDDD7\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person climbing: medium skin tone",code:"\uD83E\uDDD7\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person climbing: medium-dark skin tone",code:"\uD83E\uDDD7\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person climbing: dark skin tone",code:"\uD83E\uDDD7\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman climbing",code:"\uD83E\uDDD7\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman climbing: light skin tone",code:"\uD83E\uDDD7\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman climbing: medium-light skin tone",code:"\uD83E\uDDD7\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman climbing: medium skin tone",code:"\uD83E\uDDD7\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman climbing: medium-dark skin tone",code:"\uD83E\uDDD7\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman climbing: dark skin tone",code:"\uD83E\uDDD7\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man climbing",code:"\uD83E\uDDD7\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man climbing: light skin tone",code:"\uD83E\uDDD7\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man climbing: medium-light skin tone",code:"\uD83E\uDDD7\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man climbing: medium skin tone",code:"\uD83E\uDDD7\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man climbing: medium-dark skin tone",code:"\uD83E\uDDD7\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man climbing: dark skin tone",code:"\uD83E\uDDD7\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person in lotus position",code:"\uD83E\uDDD8"},{category:"smileys_n_people",tone:"light",keyword:"person in lotus position: light skin tone",code:"\uD83E\uDDD8\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person in lotus position: medium-light skin tone",code:"\uD83E\uDDD8\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person in lotus position: medium skin tone",code:"\uD83E\uDDD8\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person in lotus position: medium-dark skin tone",code:"\uD83E\uDDD8\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person in lotus position: dark skin tone",code:"\uD83E\uDDD8\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"woman in lotus position",code:"\uD83E\uDDD8\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman in lotus position: light skin tone",code:"\uD83E\uDDD8\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman in lotus position: medium-light skin tone",code:"\uD83E\uDDD8\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman in lotus position: medium skin tone",code:"\uD83E\uDDD8\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman in lotus position: medium-dark skin tone",code:"\uD83E\uDDD8\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman in lotus position: dark skin tone",code:"\uD83E\uDDD8\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"man in lotus position",code:"\uD83E\uDDD8\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man in lotus position: light skin tone",code:"\uD83E\uDDD8\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man in lotus position: medium-light skin tone",code:"\uD83E\uDDD8\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man in lotus position: medium skin tone",code:"\uD83E\uDDD8\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man in lotus position: medium-dark skin tone",code:"\uD83E\uDDD8\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man in lotus position: dark skin tone",code:"\uD83E\uDDD8\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person taking bath",code:"\uD83D\uDEC0"},{category:"smileys_n_people",tone:"light",keyword:"person taking bath: light skin tone",code:"\uD83D\uDEC0\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person taking bath: medium-light skin tone",code:"\uD83D\uDEC0\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person taking bath: medium skin tone",code:"\uD83D\uDEC0\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person taking bath: medium-dark skin tone",code:"\uD83D\uDEC0\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person taking bath: dark skin tone",code:"\uD83D\uDEC0\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"person in bed",code:"\uD83D\uDECC"},{category:"smileys_n_people",tone:"light",keyword:"person in bed: light skin tone",code:"\uD83D\uDECC\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person in bed: medium-light skin tone",code:"\uD83D\uDECC\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person in bed: medium skin tone",code:"\uD83D\uDECC\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person in bed: medium-dark skin tone",code:"\uD83D\uDECC\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person in bed: dark skin tone",code:"\uD83D\uDECC\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man in suit levitating",code:"\uD83D\uDD74\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man in suit levitating: light skin tone",code:"\uD83D\uDD74\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"man in suit levitating: medium-light skin tone",code:"\uD83D\uDD74\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"man in suit levitating: medium skin tone",code:"\uD83D\uDD74\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man in suit levitating: medium-dark skin tone",code:"\uD83D\uDD74\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"man in suit levitating: dark skin tone",code:"\uD83D\uDD74\uD83C\uDFFF"},{category:"smileys_n_people",keyword:"speaking head",code:"\uD83D\uDDE3\uFE0F"},{category:"smileys_n_people",keyword:"bust in silhouette",code:"\uD83D\uDC64"},{category:"smileys_n_people",keyword:"busts in silhouette",code:"\uD83D\uDC65"},{category:"smileys_n_people",keyword:"person fencing",code:"\uD83E\uDD3A"},{category:"smileys_n_people",keyword:"horse racing",code:"\uD83C\uDFC7"},{category:"smileys_n_people",tone:"light",keyword:"horse racing: light skin tone",code:"\uD83C\uDFC7\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"horse racing: medium-light skin tone",code:"\uD83C\uDFC7\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"horse racing: medium skin tone",code:"\uD83C\uDFC7\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"horse racing: medium-dark skin tone",code:"\uD83C\uDFC7\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"horse racing: dark skin tone",code:"\uD83C\uDFC7\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"skier",code:"\u26F7\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"snowboarder",code:"\uD83C\uDFC2"},{category:"smileys_n_people",tone:"light",keyword:"snowboarder: light skin tone",code:"\uD83C\uDFC2\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"snowboarder: medium-light skin tone",code:"\uD83C\uDFC2\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"snowboarder: medium skin tone",code:"\uD83C\uDFC2\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"snowboarder: medium-dark skin tone",code:"\uD83C\uDFC2\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"snowboarder: dark skin tone",code:"\uD83C\uDFC2\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"person golfing",code:"\uD83C\uDFCC\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"person golfing: light skin tone",code:"\uD83C\uDFCC\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person golfing: medium-light skin tone",code:"\uD83C\uDFCC\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person golfing: medium skin tone",code:"\uD83C\uDFCC\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person golfing: medium-dark skin tone",code:"\uD83C\uDFCC\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person golfing: dark skin tone",code:"\uD83C\uDFCC\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man golfing",code:"\uD83C\uDFCC\uFE0F\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man golfing: light skin tone",code:"\uD83C\uDFCC\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man golfing: medium-light skin tone",code:"\uD83C\uDFCC\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man golfing: medium skin tone",code:"\uD83C\uDFCC\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man golfing: medium-dark skin tone",code:"\uD83C\uDFCC\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man golfing: dark skin tone",code:"\uD83C\uDFCC\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman golfing",code:"\uD83C\uDFCC\uFE0F\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman golfing: light skin tone",code:"\uD83C\uDFCC\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman golfing: medium-light skin tone",code:"\uD83C\uDFCC\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman golfing: medium skin tone",code:"\uD83C\uDFCC\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman golfing: medium-dark skin tone",code:"\uD83C\uDFCC\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman golfing: dark skin tone",code:"\uD83C\uDFCC\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person surfing",code:"\uD83C\uDFC4"},{category:"smileys_n_people",tone:"light",keyword:"person surfing: light skin tone",code:"\uD83C\uDFC4\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person surfing: medium-light skin tone",code:"\uD83C\uDFC4\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person surfing: medium skin tone",code:"\uD83C\uDFC4\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person surfing: medium-dark skin tone",code:"\uD83C\uDFC4\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person surfing: dark skin tone",code:"\uD83C\uDFC4\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man surfing",code:"\uD83C\uDFC4\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man surfing: light skin tone",code:"\uD83C\uDFC4\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man surfing: medium-light skin tone",code:"\uD83C\uDFC4\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man surfing: medium skin tone",code:"\uD83C\uDFC4\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man surfing: medium-dark skin tone",code:"\uD83C\uDFC4\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man surfing: dark skin tone",code:"\uD83C\uDFC4\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman surfing",code:"\uD83C\uDFC4\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman surfing: light skin tone",code:"\uD83C\uDFC4\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman surfing: medium-light skin tone",code:"\uD83C\uDFC4\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman surfing: medium skin tone",code:"\uD83C\uDFC4\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman surfing: medium-dark skin tone",code:"\uD83C\uDFC4\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman surfing: dark skin tone",code:"\uD83C\uDFC4\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person rowing boat",code:"\uD83D\uDEA3"},{category:"smileys_n_people",tone:"light",keyword:"person rowing boat: light skin tone",code:"\uD83D\uDEA3\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person rowing boat: medium-light skin tone",code:"\uD83D\uDEA3\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person rowing boat: medium skin tone",code:"\uD83D\uDEA3\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person rowing boat: medium-dark skin tone",code:"\uD83D\uDEA3\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person rowing boat: dark skin tone",code:"\uD83D\uDEA3\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man rowing boat",code:"\uD83D\uDEA3\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man rowing boat: light skin tone",code:"\uD83D\uDEA3\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man rowing boat: medium-light skin tone",code:"\uD83D\uDEA3\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man rowing boat: medium skin tone",code:"\uD83D\uDEA3\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man rowing boat: medium-dark skin tone",code:"\uD83D\uDEA3\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man rowing boat: dark skin tone",code:"\uD83D\uDEA3\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman rowing boat",code:"\uD83D\uDEA3\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman rowing boat: light skin tone",code:"\uD83D\uDEA3\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman rowing boat: medium-light skin tone",code:"\uD83D\uDEA3\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman rowing boat: medium skin tone",code:"\uD83D\uDEA3\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman rowing boat: medium-dark skin tone",code:"\uD83D\uDEA3\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman rowing boat: dark skin tone",code:"\uD83D\uDEA3\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person swimming",code:"\uD83C\uDFCA"},{category:"smileys_n_people",tone:"light",keyword:"person swimming: light skin tone",code:"\uD83C\uDFCA\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person swimming: medium-light skin tone",code:"\uD83C\uDFCA\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person swimming: medium skin tone",code:"\uD83C\uDFCA\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person swimming: medium-dark skin tone",code:"\uD83C\uDFCA\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person swimming: dark skin tone",code:"\uD83C\uDFCA\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man swimming",code:"\uD83C\uDFCA\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man swimming: light skin tone",code:"\uD83C\uDFCA\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man swimming: medium-light skin tone",code:"\uD83C\uDFCA\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man swimming: medium skin tone",code:"\uD83C\uDFCA\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man swimming: medium-dark skin tone",code:"\uD83C\uDFCA\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man swimming: dark skin tone",code:"\uD83C\uDFCA\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman swimming",code:"\uD83C\uDFCA\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman swimming: light skin tone",code:"\uD83C\uDFCA\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman swimming: medium-light skin tone",code:"\uD83C\uDFCA\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman swimming: medium skin tone",code:"\uD83C\uDFCA\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman swimming: medium-dark skin tone",code:"\uD83C\uDFCA\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman swimming: dark skin tone",code:"\uD83C\uDFCA\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person bouncing ball",code:"\u26F9\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"person bouncing ball: light skin tone",code:"\u26F9\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person bouncing ball: medium-light skin tone",code:"\u26F9\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person bouncing ball: medium skin tone",code:"\u26F9\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person bouncing ball: medium-dark skin tone",code:"\u26F9\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person bouncing ball: dark skin tone",code:"\u26F9\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man bouncing ball",code:"\u26F9\uFE0F\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man bouncing ball: light skin tone",code:"\u26F9\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man bouncing ball: medium-light skin tone",code:"\u26F9\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man bouncing ball: medium skin tone",code:"\u26F9\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man bouncing ball: medium-dark skin tone",code:"\u26F9\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man bouncing ball: dark skin tone",code:"\u26F9\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman bouncing ball",code:"\u26F9\uFE0F\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman bouncing ball: light skin tone",code:"\u26F9\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman bouncing ball: medium-light skin tone",code:"\u26F9\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman bouncing ball: medium skin tone",code:"\u26F9\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman bouncing ball: medium-dark skin tone",code:"\u26F9\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman bouncing ball: dark skin tone",code:"\u26F9\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person lifting weights",code:"\uD83C\uDFCB\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"person lifting weights: light skin tone",code:"\uD83C\uDFCB\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person lifting weights: medium-light skin tone",code:"\uD83C\uDFCB\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person lifting weights: medium skin tone",code:"\uD83C\uDFCB\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person lifting weights: medium-dark skin tone",code:"\uD83C\uDFCB\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person lifting weights: dark skin tone",code:"\uD83C\uDFCB\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man lifting weights",code:"\uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man lifting weights: light skin tone",code:"\uD83C\uDFCB\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man lifting weights: medium-light skin tone",code:"\uD83C\uDFCB\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man lifting weights: medium skin tone",code:"\uD83C\uDFCB\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man lifting weights: medium-dark skin tone",code:"\uD83C\uDFCB\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man lifting weights: dark skin tone",code:"\uD83C\uDFCB\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman lifting weights",code:"\uD83C\uDFCB\uFE0F\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman lifting weights: light skin tone",code:"\uD83C\uDFCB\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman lifting weights: medium-light skin tone",code:"\uD83C\uDFCB\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman lifting weights: medium skin tone",code:"\uD83C\uDFCB\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman lifting weights: medium-dark skin tone",code:"\uD83C\uDFCB\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman lifting weights: dark skin tone",code:"\uD83C\uDFCB\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person biking",code:"\uD83D\uDEB4"},{category:"smileys_n_people",tone:"light",keyword:"person biking: light skin tone",code:"\uD83D\uDEB4\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person biking: medium-light skin tone",code:"\uD83D\uDEB4\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person biking: medium skin tone",code:"\uD83D\uDEB4\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person biking: medium-dark skin tone",code:"\uD83D\uDEB4\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person biking: dark skin tone",code:"\uD83D\uDEB4\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man biking",code:"\uD83D\uDEB4\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man biking: light skin tone",code:"\uD83D\uDEB4\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man biking: medium-light skin tone",code:"\uD83D\uDEB4\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man biking: medium skin tone",code:"\uD83D\uDEB4\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man biking: medium-dark skin tone",code:"\uD83D\uDEB4\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man biking: dark skin tone",code:"\uD83D\uDEB4\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman biking",code:"\uD83D\uDEB4\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman biking: light skin tone",code:"\uD83D\uDEB4\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman biking: medium-light skin tone",code:"\uD83D\uDEB4\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman biking: medium skin tone",code:"\uD83D\uDEB4\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman biking: medium-dark skin tone",code:"\uD83D\uDEB4\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman biking: dark skin tone",code:"\uD83D\uDEB4\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person mountain biking",code:"\uD83D\uDEB5"},{category:"smileys_n_people",tone:"light",keyword:"person mountain biking: light skin tone",code:"\uD83D\uDEB5\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person mountain biking: medium-light skin tone",code:"\uD83D\uDEB5\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person mountain biking: medium skin tone",code:"\uD83D\uDEB5\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person mountain biking: medium-dark skin tone",code:"\uD83D\uDEB5\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person mountain biking: dark skin tone",code:"\uD83D\uDEB5\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man mountain biking",code:"\uD83D\uDEB5\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man mountain biking: light skin tone",code:"\uD83D\uDEB5\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man mountain biking: medium-light skin tone",code:"\uD83D\uDEB5\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man mountain biking: medium skin tone",code:"\uD83D\uDEB5\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man mountain biking: medium-dark skin tone",code:"\uD83D\uDEB5\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man mountain biking: dark skin tone",code:"\uD83D\uDEB5\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman mountain biking",code:"\uD83D\uDEB5\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman mountain biking: light skin tone",code:"\uD83D\uDEB5\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman mountain biking: medium-light skin tone",code:"\uD83D\uDEB5\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman mountain biking: medium skin tone",code:"\uD83D\uDEB5\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman mountain biking: medium-dark skin tone",code:"\uD83D\uDEB5\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman mountain biking: dark skin tone",code:"\uD83D\uDEB5\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"racing car",code:"\uD83C\uDFCE\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"motorcycle",code:"\uD83C\uDFCD\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person cartwheeling",code:"\uD83E\uDD38"},{category:"smileys_n_people",tone:"light",keyword:"person cartwheeling: light skin tone",code:"\uD83E\uDD38\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person cartwheeling: medium-light skin tone",code:"\uD83E\uDD38\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person cartwheeling: medium skin tone",code:"\uD83E\uDD38\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person cartwheeling: medium-dark skin tone",code:"\uD83E\uDD38\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person cartwheeling: dark skin tone",code:"\uD83E\uDD38\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man cartwheeling",code:"\uD83E\uDD38\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man cartwheeling: light skin tone",code:"\uD83E\uDD38\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man cartwheeling: medium-light skin tone",code:"\uD83E\uDD38\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man cartwheeling: medium skin tone",code:"\uD83E\uDD38\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man cartwheeling: medium-dark skin tone",code:"\uD83E\uDD38\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man cartwheeling: dark skin tone",code:"\uD83E\uDD38\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman cartwheeling",code:"\uD83E\uDD38\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman cartwheeling: light skin tone",code:"\uD83E\uDD38\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman cartwheeling: medium-light skin tone",code:"\uD83E\uDD38\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman cartwheeling: medium skin tone",code:"\uD83E\uDD38\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman cartwheeling: medium-dark skin tone",code:"\uD83E\uDD38\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman cartwheeling: dark skin tone",code:"\uD83E\uDD38\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",keyword:"people wrestling",code:"\uD83E\uDD3C"},{category:"smileys_n_people",keyword:"men wrestling",code:"\uD83E\uDD3C\u200D\u2642\uFE0F"},{category:"smileys_n_people",keyword:"women wrestling",code:"\uD83E\uDD3C\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person playing water polo",code:"\uD83E\uDD3D"},{category:"smileys_n_people",tone:"light",keyword:"person playing water polo: light skin tone",code:"\uD83E\uDD3D\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person playing water polo: medium-light skin tone",code:"\uD83E\uDD3D\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person playing water polo: medium skin tone",code:"\uD83E\uDD3D\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person playing water polo: medium-dark skin tone",code:"\uD83E\uDD3D\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person playing water polo: dark skin tone",code:"\uD83E\uDD3D\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man playing water polo",code:"\uD83E\uDD3D\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man playing water polo: light skin tone",code:"\uD83E\uDD3D\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man playing water polo: medium-light skin tone",code:"\uD83E\uDD3D\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man playing water polo: medium skin tone",code:"\uD83E\uDD3D\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man playing water polo: medium-dark skin tone",code:"\uD83E\uDD3D\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man playing water polo: dark skin tone",code:"\uD83E\uDD3D\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman playing water polo",code:"\uD83E\uDD3D\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman playing water polo: light skin tone",code:"\uD83E\uDD3D\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman playing water polo: medium-light skin tone",code:"\uD83E\uDD3D\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman playing water polo: medium skin tone",code:"\uD83E\uDD3D\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman playing water polo: medium-dark skin tone",code:"\uD83E\uDD3D\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman playing water polo: dark skin tone",code:"\uD83E\uDD3D\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person playing handball",code:"\uD83E\uDD3E"},{category:"smileys_n_people",tone:"light",keyword:"person playing handball: light skin tone",code:"\uD83E\uDD3E\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person playing handball: medium-light skin tone",code:"\uD83E\uDD3E\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person playing handball: medium skin tone",code:"\uD83E\uDD3E\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person playing handball: medium-dark skin tone",code:"\uD83E\uDD3E\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person playing handball: dark skin tone",code:"\uD83E\uDD3E\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man playing handball",code:"\uD83E\uDD3E\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man playing handball: light skin tone",code:"\uD83E\uDD3E\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man playing handball: medium-light skin tone",code:"\uD83E\uDD3E\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man playing handball: medium skin tone",code:"\uD83E\uDD3E\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man playing handball: medium-dark skin tone",code:"\uD83E\uDD3E\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man playing handball: dark skin tone",code:"\uD83E\uDD3E\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman playing handball",code:"\uD83E\uDD3E\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman playing handball: light skin tone",code:"\uD83E\uDD3E\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman playing handball: medium-light skin tone",code:"\uD83E\uDD3E\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman playing handball: medium skin tone",code:"\uD83E\uDD3E\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman playing handball: medium-dark skin tone",code:"\uD83E\uDD3E\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman playing handball: dark skin tone",code:"\uD83E\uDD3E\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"person juggling",code:"\uD83E\uDD39"},{category:"smileys_n_people",tone:"light",keyword:"person juggling: light skin tone",code:"\uD83E\uDD39\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"person juggling: medium-light skin tone",code:"\uD83E\uDD39\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"person juggling: medium skin tone",code:"\uD83E\uDD39\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"person juggling: medium-dark skin tone",code:"\uD83E\uDD39\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"person juggling: dark skin tone",code:"\uD83E\uDD39\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"man juggling",code:"\uD83E\uDD39\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"man juggling: light skin tone",code:"\uD83E\uDD39\uD83C\uDFFB\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"man juggling: medium-light skin tone",code:"\uD83E\uDD39\uD83C\uDFFC\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"man juggling: medium skin tone",code:"\uD83E\uDD39\uD83C\uDFFD\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"man juggling: medium-dark skin tone",code:"\uD83E\uDD39\uD83C\uDFFE\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"man juggling: dark skin tone",code:"\uD83E\uDD39\uD83C\uDFFF\u200D\u2642\uFE0F"},{category:"smileys_n_people",tone:"default",keyword:"woman juggling",code:"\uD83E\uDD39\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"woman juggling: light skin tone",code:"\uD83E\uDD39\uD83C\uDFFB\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-light",keyword:"woman juggling: medium-light skin tone",code:"\uD83E\uDD39\uD83C\uDFFC\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium",keyword:"woman juggling: medium skin tone",code:"\uD83E\uDD39\uD83C\uDFFD\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"medium-dark",keyword:"woman juggling: medium-dark skin tone",code:"\uD83E\uDD39\uD83C\uDFFE\u200D\u2640\uFE0F"},{category:"smileys_n_people",tone:"dark",keyword:"woman juggling: dark skin tone",code:"\uD83E\uDD39\uD83C\uDFFF\u200D\u2640\uFE0F"},{category:"smileys_n_people",keyword:"man and woman holding hands",code:"\uD83D\uDC6B"},{category:"smileys_n_people",keyword:"two men holding hands",code:"\uD83D\uDC6C"},{category:"smileys_n_people",keyword:"two women holding hands",code:"\uD83D\uDC6D"},{category:"smileys_n_people",keyword:"kiss",code:"\uD83D\uDC8F"},{category:"smileys_n_people",keyword:"kiss: woman, man",code:"\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68"},{category:"smileys_n_people",keyword:"kiss: man, man",code:"\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68"},{category:"smileys_n_people",keyword:"kiss: woman, woman",code:"\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69"},{category:"smileys_n_people",keyword:"couple with heart",code:"\uD83D\uDC91"},{category:"smileys_n_people",keyword:"couple with heart: woman, man",code:"\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC68"},{category:"smileys_n_people",keyword:"couple with heart: man, man",code:"\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC68"},{category:"smileys_n_people",keyword:"couple with heart: woman, woman",code:"\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69"},{category:"smileys_n_people",keyword:"family",code:"\uD83D\uDC6A"},{category:"smileys_n_people",keyword:"family: man, woman, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, woman, girl",code:"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: man, woman, girl, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, woman, boy, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, woman, girl, girl",code:"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: man, man, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, man, girl",code:"\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: man, man, girl, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, man, boy, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, man, girl, girl",code:"\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: woman, woman, boy",code:"\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: woman, woman, girl",code:"\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: woman, woman, girl, boy",code:"\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: woman, woman, boy, boy",code:"\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: woman, woman, girl, girl",code:"\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: man, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, boy, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, girl",code:"\uD83D\uDC68\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: man, girl, boy",code:"\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: man, girl, girl",code:"\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: woman, boy",code:"\uD83D\uDC69\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: woman, boy, boy",code:"\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: woman, girl",code:"\uD83D\uDC69\u200D\uD83D\uDC67"},{category:"smileys_n_people",keyword:"family: woman, girl, boy",code:"\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66"},{category:"smileys_n_people",keyword:"family: woman, girl, girl",code:"\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67"},{category:"smileys_n_people",tone:"default",keyword:"selfie",code:"\uD83E\uDD33"},{category:"smileys_n_people",tone:"light",keyword:"selfie: light skin tone",code:"\uD83E\uDD33\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"selfie: medium-light skin tone",code:"\uD83E\uDD33\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"selfie: medium skin tone",code:"\uD83E\uDD33\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"selfie: medium-dark skin tone",code:"\uD83E\uDD33\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"selfie: dark skin tone",code:"\uD83E\uDD33\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"flexed biceps",code:"\uD83D\uDCAA"},{category:"smileys_n_people",tone:"light",keyword:"flexed biceps: light skin tone",code:"\uD83D\uDCAA\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"flexed biceps: medium-light skin tone",code:"\uD83D\uDCAA\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"flexed biceps: medium skin tone",code:"\uD83D\uDCAA\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"flexed biceps: medium-dark skin tone",code:"\uD83D\uDCAA\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"flexed biceps: dark skin tone",code:"\uD83D\uDCAA\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"leg",code:"\uD83E\uDDB5"},{category:"smileys_n_people",tone:"light",keyword:"leg: light skin tone",code:"\uD83E\uDDB5\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"leg: medium-light skin tone",code:"\uD83E\uDDB5\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"leg: medium skin tone",code:"\uD83E\uDDB5\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"leg: medium-dark skin tone",code:"\uD83E\uDDB5\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"leg: dark skin tone",code:"\uD83E\uDDB5\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"foot",code:"\uD83E\uDDB6"},{category:"smileys_n_people",tone:"light",keyword:"foot: light skin tone",code:"\uD83E\uDDB6\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"foot: medium-light skin tone",code:"\uD83E\uDDB6\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"foot: medium skin tone",code:"\uD83E\uDDB6\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"foot: medium-dark skin tone",code:"\uD83E\uDDB6\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"foot: dark skin tone",code:"\uD83E\uDDB6\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"backhand index pointing left",code:"\uD83D\uDC48"},{category:"smileys_n_people",tone:"light",keyword:"backhand index pointing left: light skin tone",code:"\uD83D\uDC48\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"backhand index pointing left: medium-light skin tone",code:"\uD83D\uDC48\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"backhand index pointing left: medium skin tone",code:"\uD83D\uDC48\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"backhand index pointing left: medium-dark skin tone",code:"\uD83D\uDC48\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"backhand index pointing left: dark skin tone",code:"\uD83D\uDC48\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"backhand index pointing right",code:"\uD83D\uDC49"},{category:"smileys_n_people",tone:"light",keyword:"backhand index pointing right: light skin tone",code:"\uD83D\uDC49\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"backhand index pointing right: medium-light skin tone",code:"\uD83D\uDC49\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"backhand index pointing right: medium skin tone",code:"\uD83D\uDC49\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"backhand index pointing right: medium-dark skin tone",code:"\uD83D\uDC49\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"backhand index pointing right: dark skin tone",code:"\uD83D\uDC49\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"index pointing up",code:"\u261D\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"index pointing up: light skin tone",code:"\u261D\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"index pointing up: medium-light skin tone",code:"\u261D\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"index pointing up: medium skin tone",code:"\u261D\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"index pointing up: medium-dark skin tone",code:"\u261D\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"index pointing up: dark skin tone",code:"\u261D\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"backhand index pointing up",code:"\uD83D\uDC46"},{category:"smileys_n_people",tone:"light",keyword:"backhand index pointing up: light skin tone",code:"\uD83D\uDC46\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"backhand index pointing up: medium-light skin tone",code:"\uD83D\uDC46\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"backhand index pointing up: medium skin tone",code:"\uD83D\uDC46\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"backhand index pointing up: medium-dark skin tone",code:"\uD83D\uDC46\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"backhand index pointing up: dark skin tone",code:"\uD83D\uDC46\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"middle finger",code:"\uD83D\uDD95"},{category:"smileys_n_people",tone:"light",keyword:"middle finger: light skin tone",code:"\uD83D\uDD95\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"middle finger: medium-light skin tone",code:"\uD83D\uDD95\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"middle finger: medium skin tone",code:"\uD83D\uDD95\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"middle finger: medium-dark skin tone",code:"\uD83D\uDD95\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"middle finger: dark skin tone",code:"\uD83D\uDD95\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"backhand index pointing down",code:"\uD83D\uDC47"},{category:"smileys_n_people",tone:"light",keyword:"backhand index pointing down: light skin tone",code:"\uD83D\uDC47\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"backhand index pointing down: medium-light skin tone",code:"\uD83D\uDC47\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"backhand index pointing down: medium skin tone",code:"\uD83D\uDC47\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"backhand index pointing down: medium-dark skin tone",code:"\uD83D\uDC47\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"backhand index pointing down: dark skin tone",code:"\uD83D\uDC47\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"victory hand",code:"\u270C\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"victory hand: light skin tone",code:"\u270C\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"victory hand: medium-light skin tone",code:"\u270C\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"victory hand: medium skin tone",code:"\u270C\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"victory hand: medium-dark skin tone",code:"\u270C\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"victory hand: dark skin tone",code:"\u270C\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"crossed fingers",code:"\uD83E\uDD1E"},{category:"smileys_n_people",tone:"light",keyword:"crossed fingers: light skin tone",code:"\uD83E\uDD1E\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"crossed fingers: medium-light skin tone",code:"\uD83E\uDD1E\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"crossed fingers: medium skin tone",code:"\uD83E\uDD1E\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"crossed fingers: medium-dark skin tone",code:"\uD83E\uDD1E\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"crossed fingers: dark skin tone",code:"\uD83E\uDD1E\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"vulcan salute",code:"\uD83D\uDD96"},{category:"smileys_n_people",tone:"light",keyword:"vulcan salute: light skin tone",code:"\uD83D\uDD96\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"vulcan salute: medium-light skin tone",code:"\uD83D\uDD96\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"vulcan salute: medium skin tone",code:"\uD83D\uDD96\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"vulcan salute: medium-dark skin tone",code:"\uD83D\uDD96\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"vulcan salute: dark skin tone",code:"\uD83D\uDD96\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"sign of the horns",code:"\uD83E\uDD18"},{category:"smileys_n_people",tone:"light",keyword:"sign of the horns: light skin tone",code:"\uD83E\uDD18\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"sign of the horns: medium-light skin tone",code:"\uD83E\uDD18\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"sign of the horns: medium skin tone",code:"\uD83E\uDD18\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"sign of the horns: medium-dark skin tone",code:"\uD83E\uDD18\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"sign of the horns: dark skin tone",code:"\uD83E\uDD18\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"call me hand",code:"\uD83E\uDD19"},{category:"smileys_n_people",tone:"light",keyword:"call me hand: light skin tone",code:"\uD83E\uDD19\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"call me hand: medium-light skin tone",code:"\uD83E\uDD19\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"call me hand: medium skin tone",code:"\uD83E\uDD19\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"call me hand: medium-dark skin tone",code:"\uD83E\uDD19\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"call me hand: dark skin tone",code:"\uD83E\uDD19\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"hand with fingers splayed",code:"\uD83D\uDD90\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"hand with fingers splayed: light skin tone",code:"\uD83D\uDD90\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"hand with fingers splayed: medium-light skin tone",code:"\uD83D\uDD90\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"hand with fingers splayed: medium skin tone",code:"\uD83D\uDD90\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"hand with fingers splayed: medium-dark skin tone",code:"\uD83D\uDD90\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"hand with fingers splayed: dark skin tone",code:"\uD83D\uDD90\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"raised hand",code:"\u270B"},{category:"smileys_n_people",tone:"light",keyword:"raised hand: light skin tone",code:"\u270B\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"raised hand: medium-light skin tone",code:"\u270B\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"raised hand: medium skin tone",code:"\u270B\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"raised hand: medium-dark skin tone",code:"\u270B\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"raised hand: dark skin tone",code:"\u270B\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"OK hand",code:"\uD83D\uDC4C"},{category:"smileys_n_people",tone:"light",keyword:"OK hand: light skin tone",code:"\uD83D\uDC4C\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"OK hand: medium-light skin tone",code:"\uD83D\uDC4C\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"OK hand: medium skin tone",code:"\uD83D\uDC4C\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"OK hand: medium-dark skin tone",code:"\uD83D\uDC4C\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"OK hand: dark skin tone",code:"\uD83D\uDC4C\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"thumbs up",code:"\uD83D\uDC4D"},{category:"smileys_n_people",tone:"light",keyword:"thumbs up: light skin tone",code:"\uD83D\uDC4D\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"thumbs up: medium-light skin tone",code:"\uD83D\uDC4D\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"thumbs up: medium skin tone",code:"\uD83D\uDC4D\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"thumbs up: medium-dark skin tone",code:"\uD83D\uDC4D\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"thumbs up: dark skin tone",code:"\uD83D\uDC4D\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"thumbs down",code:"\uD83D\uDC4E"},{category:"smileys_n_people",tone:"light",keyword:"thumbs down: light skin tone",code:"\uD83D\uDC4E\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"thumbs down: medium-light skin tone",code:"\uD83D\uDC4E\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"thumbs down: medium skin tone",code:"\uD83D\uDC4E\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"thumbs down: medium-dark skin tone",code:"\uD83D\uDC4E\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"thumbs down: dark skin tone",code:"\uD83D\uDC4E\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"raised fist",code:"\u270A"},{category:"smileys_n_people",tone:"light",keyword:"raised fist: light skin tone",code:"\u270A\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"raised fist: medium-light skin tone",code:"\u270A\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"raised fist: medium skin tone",code:"\u270A\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"raised fist: medium-dark skin tone",code:"\u270A\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"raised fist: dark skin tone",code:"\u270A\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"oncoming fist",code:"\uD83D\uDC4A"},{category:"smileys_n_people",tone:"light",keyword:"oncoming fist: light skin tone",code:"\uD83D\uDC4A\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"oncoming fist: medium-light skin tone",code:"\uD83D\uDC4A\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"oncoming fist: medium skin tone",code:"\uD83D\uDC4A\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"oncoming fist: medium-dark skin tone",code:"\uD83D\uDC4A\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"oncoming fist: dark skin tone",code:"\uD83D\uDC4A\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"left-facing fist",code:"\uD83E\uDD1B"},{category:"smileys_n_people",tone:"light",keyword:"left-facing fist: light skin tone",code:"\uD83E\uDD1B\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"left-facing fist: medium-light skin tone",code:"\uD83E\uDD1B\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"left-facing fist: medium skin tone",code:"\uD83E\uDD1B\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"left-facing fist: medium-dark skin tone",code:"\uD83E\uDD1B\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"left-facing fist: dark skin tone",code:"\uD83E\uDD1B\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"right-facing fist",code:"\uD83E\uDD1C"},{category:"smileys_n_people",tone:"light",keyword:"right-facing fist: light skin tone",code:"\uD83E\uDD1C\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"right-facing fist: medium-light skin tone",code:"\uD83E\uDD1C\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"right-facing fist: medium skin tone",code:"\uD83E\uDD1C\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"right-facing fist: medium-dark skin tone",code:"\uD83E\uDD1C\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"right-facing fist: dark skin tone",code:"\uD83E\uDD1C\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"raised back of hand",code:"\uD83E\uDD1A"},{category:"smileys_n_people",tone:"light",keyword:"raised back of hand: light skin tone",code:"\uD83E\uDD1A\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"raised back of hand: medium-light skin tone",code:"\uD83E\uDD1A\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"raised back of hand: medium skin tone",code:"\uD83E\uDD1A\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"raised back of hand: medium-dark skin tone",code:"\uD83E\uDD1A\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"raised back of hand: dark skin tone",code:"\uD83E\uDD1A\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"waving hand",code:"\uD83D\uDC4B"},{category:"smileys_n_people",tone:"light",keyword:"waving hand: light skin tone",code:"\uD83D\uDC4B\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"waving hand: medium-light skin tone",code:"\uD83D\uDC4B\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"waving hand: medium skin tone",code:"\uD83D\uDC4B\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"waving hand: medium-dark skin tone",code:"\uD83D\uDC4B\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"waving hand: dark skin tone",code:"\uD83D\uDC4B\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"love-you gesture",code:"\uD83E\uDD1F"},{category:"smileys_n_people",tone:"light",keyword:"love-you gesture: light skin tone",code:"\uD83E\uDD1F\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"love-you gesture: medium-light skin tone",code:"\uD83E\uDD1F\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"love-you gesture: medium skin tone",code:"\uD83E\uDD1F\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"love-you gesture: medium-dark skin tone",code:"\uD83E\uDD1F\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"love-you gesture: dark skin tone",code:"\uD83E\uDD1F\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"writing hand",code:"\u270D\uFE0F"},{category:"smileys_n_people",tone:"light",keyword:"writing hand: light skin tone",code:"\u270D\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"writing hand: medium-light skin tone",code:"\u270D\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"writing hand: medium skin tone",code:"\u270D\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"writing hand: medium-dark skin tone",code:"\u270D\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"writing hand: dark skin tone",code:"\u270D\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"clapping hands",code:"\uD83D\uDC4F"},{category:"smileys_n_people",tone:"light",keyword:"clapping hands: light skin tone",code:"\uD83D\uDC4F\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"clapping hands: medium-light skin tone",code:"\uD83D\uDC4F\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"clapping hands: medium skin tone",code:"\uD83D\uDC4F\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"clapping hands: medium-dark skin tone",code:"\uD83D\uDC4F\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"clapping hands: dark skin tone",code:"\uD83D\uDC4F\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"open hands",code:"\uD83D\uDC50"},{category:"smileys_n_people",tone:"light",keyword:"open hands: light skin tone",code:"\uD83D\uDC50\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"open hands: medium-light skin tone",code:"\uD83D\uDC50\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"open hands: medium skin tone",code:"\uD83D\uDC50\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"open hands: medium-dark skin tone",code:"\uD83D\uDC50\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"open hands: dark skin tone",code:"\uD83D\uDC50\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"raising hands",code:"\uD83D\uDE4C"},{category:"smileys_n_people",tone:"light",keyword:"raising hands: light skin tone",code:"\uD83D\uDE4C\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"raising hands: medium-light skin tone",code:"\uD83D\uDE4C\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"raising hands: medium skin tone",code:"\uD83D\uDE4C\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"raising hands: medium-dark skin tone",code:"\uD83D\uDE4C\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"raising hands: dark skin tone",code:"\uD83D\uDE4C\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"palms up together",code:"\uD83E\uDD32"},{category:"smileys_n_people",tone:"light",keyword:"palms up together: light skin tone",code:"\uD83E\uDD32\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"palms up together: medium-light skin tone",code:"\uD83E\uDD32\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"palms up together: medium skin tone",code:"\uD83E\uDD32\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"palms up together: medium-dark skin tone",code:"\uD83E\uDD32\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"palms up together: dark skin tone",code:"\uD83E\uDD32\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"folded hands",code:"\uD83D\uDE4F"},{category:"smileys_n_people",tone:"light",keyword:"folded hands: light skin tone",code:"\uD83D\uDE4F\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"folded hands: medium-light skin tone",code:"\uD83D\uDE4F\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"folded hands: medium skin tone",code:"\uD83D\uDE4F\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"folded hands: medium-dark skin tone",code:"\uD83D\uDE4F\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"folded hands: dark skin tone",code:"\uD83D\uDE4F\uD83C\uDFFF"},{category:"smileys_n_people",keyword:"handshake",code:"\uD83E\uDD1D"},{category:"smileys_n_people",tone:"default",keyword:"nail polish",code:"\uD83D\uDC85"},{category:"smileys_n_people",tone:"light",keyword:"nail polish: light skin tone",code:"\uD83D\uDC85\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"nail polish: medium-light skin tone",code:"\uD83D\uDC85\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"nail polish: medium skin tone",code:"\uD83D\uDC85\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"nail polish: medium-dark skin tone",code:"\uD83D\uDC85\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"nail polish: dark skin tone",code:"\uD83D\uDC85\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"ear",code:"\uD83D\uDC42"},{category:"smileys_n_people",tone:"light",keyword:"ear: light skin tone",code:"\uD83D\uDC42\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"ear: medium-light skin tone",code:"\uD83D\uDC42\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"ear: medium skin tone",code:"\uD83D\uDC42\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"ear: medium-dark skin tone",code:"\uD83D\uDC42\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"ear: dark skin tone",code:"\uD83D\uDC42\uD83C\uDFFF"},{category:"smileys_n_people",tone:"default",keyword:"nose",code:"\uD83D\uDC43"},{category:"smileys_n_people",tone:"light",keyword:"nose: light skin tone",code:"\uD83D\uDC43\uD83C\uDFFB"},{category:"smileys_n_people",tone:"medium-light",keyword:"nose: medium-light skin tone",code:"\uD83D\uDC43\uD83C\uDFFC"},{category:"smileys_n_people",tone:"medium",keyword:"nose: medium skin tone",code:"\uD83D\uDC43\uD83C\uDFFD"},{category:"smileys_n_people",tone:"medium-dark",keyword:"nose: medium-dark skin tone",code:"\uD83D\uDC43\uD83C\uDFFE"},{category:"smileys_n_people",tone:"dark",keyword:"nose: dark skin tone",code:"\uD83D\uDC43\uD83C\uDFFF"},{category:"smileys_n_people",keyword:"footprints",code:"\uD83D\uDC63"},{category:"smileys_n_people",keyword:"eyes",code:"\uD83D\uDC40"},{category:"smileys_n_people",keyword:"eye",code:"\uD83D\uDC41\uFE0F"},{category:"smileys_n_people",keyword:"eye in speech bubble",code:"\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8\uFE0F"},{category:"smileys_n_people",keyword:"brain",code:"\uD83E\uDDE0"},{category:"smileys_n_people",keyword:"bone",code:"\uD83E\uDDB4"},{category:"smileys_n_people",keyword:"tooth",code:"\uD83E\uDDB7"},{category:"smileys_n_people",keyword:"tongue",code:"\uD83D\uDC45"},{category:"smileys_n_people",keyword:"mouth",code:"\uD83D\uDC44"},{category:"smileys_n_people",keyword:"kiss mark",code:"\uD83D\uDC8B"},{category:"smileys_n_people",keyword:"heart with arrow",code:"\uD83D\uDC98"},{category:"smileys_n_people",keyword:"red heart",code:"\u2764\uFE0F"},{category:"smileys_n_people",keyword:"beating heart",code:"\uD83D\uDC93"},{category:"smileys_n_people",keyword:"broken heart",code:"\uD83D\uDC94"},{category:"smileys_n_people",keyword:"two hearts",code:"\uD83D\uDC95"},{category:"smileys_n_people",keyword:"sparkling heart",code:"\uD83D\uDC96"},{category:"smileys_n_people",keyword:"growing heart",code:"\uD83D\uDC97"},{category:"smileys_n_people",keyword:"blue heart",code:"\uD83D\uDC99"},{category:"smileys_n_people",keyword:"green heart",code:"\uD83D\uDC9A"},{category:"smileys_n_people",keyword:"yellow heart",code:"\uD83D\uDC9B"},{category:"smileys_n_people",keyword:"orange heart",code:"\uD83E\uDDE1"},{category:"smileys_n_people",keyword:"purple heart",code:"\uD83D\uDC9C"},{category:"smileys_n_people",keyword:"black heart",code:"\uD83D\uDDA4"},{category:"smileys_n_people",keyword:"heart with ribbon",code:"\uD83D\uDC9D"},{category:"smileys_n_people",keyword:"revolving hearts",code:"\uD83D\uDC9E"},{category:"smileys_n_people",keyword:"heart decoration",code:"\uD83D\uDC9F"},{category:"smileys_n_people",keyword:"heavy heart exclamation",code:"\u2763\uFE0F"},{category:"smileys_n_people",keyword:"love letter",code:"\uD83D\uDC8C"},{category:"smileys_n_people",keyword:"zzz",code:"\uD83D\uDCA4"},{category:"smileys_n_people",keyword:"anger symbol",code:"\uD83D\uDCA2"},{category:"smileys_n_people",keyword:"bomb",code:"\uD83D\uDCA3"},{category:"smileys_n_people",keyword:"collision",code:"\uD83D\uDCA5"},{category:"smileys_n_people",keyword:"sweat droplets",code:"\uD83D\uDCA6"},{category:"smileys_n_people",keyword:"dashing away",code:"\uD83D\uDCA8"},{category:"smileys_n_people",keyword:"dizzy",code:"\uD83D\uDCAB"},{category:"smileys_n_people",keyword:"speech balloon",code:"\uD83D\uDCAC"},{category:"smileys_n_people",keyword:"left speech bubble",code:"\uD83D\uDDE8\uFE0F"},{category:"smileys_n_people",keyword:"right anger bubble",code:"\uD83D\uDDEF\uFE0F"},{category:"smileys_n_people",keyword:"thought balloon",code:"\uD83D\uDCAD"},{category:"smileys_n_people",keyword:"hole",code:"\uD83D\uDD73\uFE0F"},{category:"smileys_n_people",keyword:"glasses",code:"\uD83D\uDC53"},{category:"smileys_n_people",keyword:"sunglasses",code:"\uD83D\uDD76\uFE0F"},{category:"smileys_n_people",keyword:"goggles",code:"\uD83E\uDD7D"},{category:"smileys_n_people",keyword:"lab coat",code:"\uD83E\uDD7C"},{category:"smileys_n_people",keyword:"necktie",code:"\uD83D\uDC54"},{category:"smileys_n_people",keyword:"t-shirt",code:"\uD83D\uDC55"},{category:"smileys_n_people",keyword:"jeans",code:"\uD83D\uDC56"},{category:"smileys_n_people",keyword:"scarf",code:"\uD83E\uDDE3"},{category:"smileys_n_people",keyword:"gloves",code:"\uD83E\uDDE4"},{category:"smileys_n_people",keyword:"coat",code:"\uD83E\uDDE5"},{category:"smileys_n_people",keyword:"socks",code:"\uD83E\uDDE6"},{category:"smileys_n_people",keyword:"dress",code:"\uD83D\uDC57"},{category:"smileys_n_people",keyword:"kimono",code:"\uD83D\uDC58"},{category:"smileys_n_people",keyword:"bikini",code:"\uD83D\uDC59"},{category:"smileys_n_people",keyword:"woman\u2019s clothes",code:"\uD83D\uDC5A"},{category:"smileys_n_people",keyword:"purse",code:"\uD83D\uDC5B"},{category:"smileys_n_people",keyword:"handbag",code:"\uD83D\uDC5C"},{category:"smileys_n_people",keyword:"clutch bag",code:"\uD83D\uDC5D"},{category:"smileys_n_people",keyword:"shopping bags",code:"\uD83D\uDECD\uFE0F"},{category:"smileys_n_people",keyword:"school backpack",code:"\uD83C\uDF92"},{category:"smileys_n_people",keyword:"man\u2019s shoe",code:"\uD83D\uDC5E"},{category:"smileys_n_people",keyword:"running shoe",code:"\uD83D\uDC5F"},{category:"smileys_n_people",keyword:"hiking boot",code:"\uD83E\uDD7E"},{category:"smileys_n_people",keyword:"woman\u2019s flat shoe",code:"\uD83E\uDD7F"},{category:"smileys_n_people",keyword:"high-heeled shoe",code:"\uD83D\uDC60"},{category:"smileys_n_people",keyword:"woman\u2019s sandal",code:"\uD83D\uDC61"},{category:"smileys_n_people",keyword:"woman\u2019s boot",code:"\uD83D\uDC62"},{category:"smileys_n_people",keyword:"crown",code:"\uD83D\uDC51"},{category:"smileys_n_people",keyword:"woman\u2019s hat",code:"\uD83D\uDC52"},{category:"smileys_n_people",keyword:"top hat",code:"\uD83C\uDFA9"},{category:"smileys_n_people",keyword:"graduation cap",code:"\uD83C\uDF93"},{category:"smileys_n_people",keyword:"billed cap",code:"\uD83E\uDDE2"},{category:"smileys_n_people",keyword:"rescue worker\u2019s helmet",code:"\u26D1\uFE0F"},{category:"smileys_n_people",keyword:"prayer beads",code:"\uD83D\uDCFF"},{category:"smileys_n_people",keyword:"lipstick",code:"\uD83D\uDC84"},{category:"smileys_n_people",keyword:"ring",code:"\uD83D\uDC8D"},{category:"smileys_n_people",keyword:"gem stone",code:"\uD83D\uDC8E"},{category:"animals_n_nature",keyword:"monkey face",code:"\uD83D\uDC35"},{category:"animals_n_nature",keyword:"monkey",code:"\uD83D\uDC12"},{category:"animals_n_nature",keyword:"gorilla",code:"\uD83E\uDD8D"},{category:"animals_n_nature",keyword:"dog face",code:"\uD83D\uDC36"},{category:"animals_n_nature",keyword:"dog",code:"\uD83D\uDC15"},{category:"animals_n_nature",keyword:"poodle",code:"\uD83D\uDC29"},{category:"animals_n_nature",keyword:"wolf face",code:"\uD83D\uDC3A"},{category:"animals_n_nature",keyword:"fox face",code:"\uD83E\uDD8A"},{category:"animals_n_nature",keyword:"raccoon",code:"\uD83E\uDD9D"},{category:"animals_n_nature",keyword:"cat face",code:"\uD83D\uDC31"},{category:"animals_n_nature",keyword:"cat",code:"\uD83D\uDC08"},{category:"animals_n_nature",keyword:"lion face",code:"\uD83E\uDD81"},{category:"animals_n_nature",keyword:"tiger face",code:"\uD83D\uDC2F"},{category:"animals_n_nature",keyword:"tiger",code:"\uD83D\uDC05"},{category:"animals_n_nature",keyword:"leopard",code:"\uD83D\uDC06"},{category:"animals_n_nature",keyword:"horse face",code:"\uD83D\uDC34"},{category:"animals_n_nature",keyword:"horse",code:"\uD83D\uDC0E"},{category:"animals_n_nature",keyword:"unicorn face",code:"\uD83E\uDD84"},{category:"animals_n_nature",keyword:"zebra",code:"\uD83E\uDD93"},{category:"animals_n_nature",keyword:"deer",code:"\uD83E\uDD8C"},{category:"animals_n_nature",keyword:"cow face",code:"\uD83D\uDC2E"},{category:"animals_n_nature",keyword:"ox",code:"\uD83D\uDC02"},{category:"animals_n_nature",keyword:"water buffalo",code:"\uD83D\uDC03"},{category:"animals_n_nature",keyword:"cow",code:"\uD83D\uDC04"},{category:"animals_n_nature",keyword:"pig face",code:"\uD83D\uDC37"},{category:"animals_n_nature",keyword:"pig",code:"\uD83D\uDC16"},{category:"animals_n_nature",keyword:"boar",code:"\uD83D\uDC17"},{category:"animals_n_nature",keyword:"pig nose",code:"\uD83D\uDC3D"},{category:"animals_n_nature",keyword:"ram",code:"\uD83D\uDC0F"},{category:"animals_n_nature",keyword:"ewe",code:"\uD83D\uDC11"},{category:"animals_n_nature",keyword:"goat",code:"\uD83D\uDC10"},{category:"animals_n_nature",keyword:"camel",code:"\uD83D\uDC2A"},{category:"animals_n_nature",keyword:"two-hump camel",code:"\uD83D\uDC2B"},{category:"animals_n_nature",keyword:"llama",code:"\uD83E\uDD99"},{category:"animals_n_nature",keyword:"giraffe",code:"\uD83E\uDD92"},{category:"animals_n_nature",keyword:"elephant",code:"\uD83D\uDC18"},{category:"animals_n_nature",keyword:"rhinoceros",code:"\uD83E\uDD8F"},{category:"animals_n_nature",keyword:"hippopotamus",code:"\uD83E\uDD9B"},{category:"animals_n_nature",keyword:"mouse face",code:"\uD83D\uDC2D"},{category:"animals_n_nature",keyword:"mouse",code:"\uD83D\uDC01"},{category:"animals_n_nature",keyword:"rat",code:"\uD83D\uDC00"},{category:"animals_n_nature",keyword:"hamster face",code:"\uD83D\uDC39"},{category:"animals_n_nature",keyword:"rabbit face",code:"\uD83D\uDC30"},{category:"animals_n_nature",keyword:"rabbit",code:"\uD83D\uDC07"},{category:"animals_n_nature",keyword:"chipmunk",code:"\uD83D\uDC3F\uFE0F"},{category:"animals_n_nature",keyword:"hedgehog",code:"\uD83E\uDD94"},{category:"animals_n_nature",keyword:"bat",code:"\uD83E\uDD87"},{category:"animals_n_nature",keyword:"bear face",code:"\uD83D\uDC3B"},{category:"animals_n_nature",keyword:"koala",code:"\uD83D\uDC28"},{category:"animals_n_nature",keyword:"panda face",code:"\uD83D\uDC3C"},{category:"animals_n_nature",keyword:"kangaroo",code:"\uD83E\uDD98"},{category:"animals_n_nature",keyword:"badger",code:"\uD83E\uDDA1"},{category:"animals_n_nature",keyword:"paw prints",code:"\uD83D\uDC3E"},{category:"animals_n_nature",keyword:"turkey",code:"\uD83E\uDD83"},{category:"animals_n_nature",keyword:"chicken",code:"\uD83D\uDC14"},{category:"animals_n_nature",keyword:"rooster",code:"\uD83D\uDC13"},{category:"animals_n_nature",keyword:"hatching chick",code:"\uD83D\uDC23"},{category:"animals_n_nature",keyword:"baby chick",code:"\uD83D\uDC24"},{category:"animals_n_nature",keyword:"front-facing baby chick",code:"\uD83D\uDC25"},{category:"animals_n_nature",keyword:"bird",code:"\uD83D\uDC26"},{category:"animals_n_nature",keyword:"penguin",code:"\uD83D\uDC27"},{category:"animals_n_nature",keyword:"dove",code:"\uD83D\uDD4A\uFE0F"},{category:"animals_n_nature",keyword:"eagle",code:"\uD83E\uDD85"},{category:"animals_n_nature",keyword:"duck",code:"\uD83E\uDD86"},{category:"animals_n_nature",keyword:"swan",code:"\uD83E\uDDA2"},{category:"animals_n_nature",keyword:"owl",code:"\uD83E\uDD89"},{category:"animals_n_nature",keyword:"peacock",code:"\uD83E\uDD9A"},{category:"animals_n_nature",keyword:"parrot",code:"\uD83E\uDD9C"},{category:"animals_n_nature",keyword:"frog face",code:"\uD83D\uDC38"},{category:"animals_n_nature",keyword:"crocodile",code:"\uD83D\uDC0A"},{category:"animals_n_nature",keyword:"turtle",code:"\uD83D\uDC22"},{category:"animals_n_nature",keyword:"lizard",code:"\uD83E\uDD8E"},{category:"animals_n_nature",keyword:"snake",code:"\uD83D\uDC0D"},{category:"animals_n_nature",keyword:"dragon face",code:"\uD83D\uDC32"},{category:"animals_n_nature",keyword:"dragon",code:"\uD83D\uDC09"},{category:"animals_n_nature",keyword:"sauropod",code:"\uD83E\uDD95"},{category:"animals_n_nature",keyword:"T-Rex",code:"\uD83E\uDD96"},{category:"animals_n_nature",keyword:"spouting whale",code:"\uD83D\uDC33"},{category:"animals_n_nature",keyword:"whale",code:"\uD83D\uDC0B"},{category:"animals_n_nature",keyword:"dolphin",code:"\uD83D\uDC2C"},{category:"animals_n_nature",keyword:"fish",code:"\uD83D\uDC1F"},{category:"animals_n_nature",keyword:"tropical fish",code:"\uD83D\uDC20"},{category:"animals_n_nature",keyword:"blowfish",code:"\uD83D\uDC21"},{category:"animals_n_nature",keyword:"shark",code:"\uD83E\uDD88"},{category:"animals_n_nature",keyword:"octopus",code:"\uD83D\uDC19"},{category:"animals_n_nature",keyword:"spiral shell",code:"\uD83D\uDC1A"},{category:"animals_n_nature",keyword:"crab",code:"\uD83E\uDD80"},{category:"animals_n_nature",keyword:"lobster",code:"\uD83E\uDD9E"},{category:"animals_n_nature",keyword:"shrimp",code:"\uD83E\uDD90"},{category:"animals_n_nature",keyword:"squid",code:"\uD83E\uDD91"},{category:"animals_n_nature",keyword:"snail",code:"\uD83D\uDC0C"},{category:"animals_n_nature",keyword:"butterfly",code:"\uD83E\uDD8B"},{category:"animals_n_nature",keyword:"bug",code:"\uD83D\uDC1B"},{category:"animals_n_nature",keyword:"ant",code:"\uD83D\uDC1C"},{category:"animals_n_nature",keyword:"honeybee",code:"\uD83D\uDC1D"},{category:"animals_n_nature",keyword:"lady beetle",code:"\uD83D\uDC1E"},{category:"animals_n_nature",keyword:"cricket",code:"\uD83E\uDD97"},{category:"animals_n_nature",keyword:"spider",code:"\uD83D\uDD77\uFE0F"},{category:"animals_n_nature",keyword:"spider web",code:"\uD83D\uDD78\uFE0F"},{category:"animals_n_nature",keyword:"scorpion",code:"\uD83E\uDD82"},{category:"animals_n_nature",keyword:"mosquito",code:"\uD83E\uDD9F"},{category:"animals_n_nature",keyword:"microbe",code:"\uD83E\uDDA0"},{category:"animals_n_nature",keyword:"bouquet",code:"\uD83D\uDC90"},{category:"animals_n_nature",keyword:"cherry blossom",code:"\uD83C\uDF38"},{category:"animals_n_nature",keyword:"white flower",code:"\uD83D\uDCAE"},{category:"animals_n_nature",keyword:"rosette",code:"\uD83C\uDFF5\uFE0F"},{category:"animals_n_nature",keyword:"rose",code:"\uD83C\uDF39"},{category:"animals_n_nature",keyword:"wilted flower",code:"\uD83E\uDD40"},{category:"animals_n_nature",keyword:"hibiscus",code:"\uD83C\uDF3A"},{category:"animals_n_nature",keyword:"sunflower",code:"\uD83C\uDF3B"},{category:"animals_n_nature",keyword:"blossom",code:"\uD83C\uDF3C"},{category:"animals_n_nature",keyword:"tulip",code:"\uD83C\uDF37"},{category:"animals_n_nature",keyword:"seedling",code:"\uD83C\uDF31"},{category:"animals_n_nature",keyword:"evergreen tree",code:"\uD83C\uDF32"},{category:"animals_n_nature",keyword:"deciduous tree",code:"\uD83C\uDF33"},{category:"animals_n_nature",keyword:"palm tree",code:"\uD83C\uDF34"},{category:"animals_n_nature",keyword:"cactus",code:"\uD83C\uDF35"},{category:"animals_n_nature",keyword:"sheaf of rice",code:"\uD83C\uDF3E"},{category:"animals_n_nature",keyword:"herb",code:"\uD83C\uDF3F"},{category:"animals_n_nature",keyword:"shamrock",code:"\u2618\uFE0F"},{category:"animals_n_nature",keyword:"four leaf clover",code:"\uD83C\uDF40"},{category:"animals_n_nature",keyword:"maple leaf",code:"\uD83C\uDF41"},{category:"animals_n_nature",keyword:"fallen leaf",code:"\uD83C\uDF42"},{category:"animals_n_nature",keyword:"leaf fluttering in wind",code:"\uD83C\uDF43"},{category:"food_n_drink",keyword:"grapes",code:"\uD83C\uDF47"},{category:"food_n_drink",keyword:"melon",code:"\uD83C\uDF48"},{category:"food_n_drink",keyword:"watermelon",code:"\uD83C\uDF49"},{category:"food_n_drink",keyword:"tangerine",code:"\uD83C\uDF4A"},{category:"food_n_drink",keyword:"lemon",code:"\uD83C\uDF4B"},{category:"food_n_drink",keyword:"banana",code:"\uD83C\uDF4C"},{category:"food_n_drink",keyword:"pineapple",code:"\uD83C\uDF4D"},{category:"food_n_drink",keyword:"mango",code:"\uD83E\uDD6D"},{category:"food_n_drink",keyword:"red apple",code:"\uD83C\uDF4E"},{category:"food_n_drink",keyword:"green apple",code:"\uD83C\uDF4F"},{category:"food_n_drink",keyword:"pear",code:"\uD83C\uDF50"},{category:"food_n_drink",keyword:"peach",code:"\uD83C\uDF51"},{category:"food_n_drink",keyword:"cherries",code:"\uD83C\uDF52"},{category:"food_n_drink",keyword:"strawberry",code:"\uD83C\uDF53"},{category:"food_n_drink",keyword:"kiwi fruit",code:"\uD83E\uDD5D"},{category:"food_n_drink",keyword:"tomato",code:"\uD83C\uDF45"},{category:"food_n_drink",keyword:"coconut",code:"\uD83E\uDD65"},{category:"food_n_drink",keyword:"avocado",code:"\uD83E\uDD51"},{category:"food_n_drink",keyword:"eggplant",code:"\uD83C\uDF46"},{category:"food_n_drink",keyword:"potato",code:"\uD83E\uDD54"},{category:"food_n_drink",keyword:"carrot",code:"\uD83E\uDD55"},{category:"food_n_drink",keyword:"ear of corn",code:"\uD83C\uDF3D"},{category:"food_n_drink",keyword:"hot pepper",code:"\uD83C\uDF36\uFE0F"},{category:"food_n_drink",keyword:"cucumber",code:"\uD83E\uDD52"},{category:"food_n_drink",keyword:"leafy green",code:"\uD83E\uDD6C"},{category:"food_n_drink",keyword:"broccoli",code:"\uD83E\uDD66"},{category:"food_n_drink",keyword:"mushroom",code:"\uD83C\uDF44"},{category:"food_n_drink",keyword:"peanuts",code:"\uD83E\uDD5C"},{category:"food_n_drink",keyword:"chestnut",code:"\uD83C\uDF30"},{category:"food_n_drink",keyword:"bread",code:"\uD83C\uDF5E"},{category:"food_n_drink",keyword:"croissant",code:"\uD83E\uDD50"},{category:"food_n_drink",keyword:"baguette bread",code:"\uD83E\uDD56"},{category:"food_n_drink",keyword:"pretzel",code:"\uD83E\uDD68"},{category:"food_n_drink",keyword:"bagel",code:"\uD83E\uDD6F"},{category:"food_n_drink",keyword:"pancakes",code:"\uD83E\uDD5E"},{category:"food_n_drink",keyword:"cheese wedge",code:"\uD83E\uDDC0"},{category:"food_n_drink",keyword:"meat on bone",code:"\uD83C\uDF56"},{category:"food_n_drink",keyword:"poultry leg",code:"\uD83C\uDF57"},{category:"food_n_drink",keyword:"cut of meat",code:"\uD83E\uDD69"},{category:"food_n_drink",keyword:"bacon",code:"\uD83E\uDD53"},{category:"food_n_drink",keyword:"hamburger",code:"\uD83C\uDF54"},{category:"food_n_drink",keyword:"french fries",code:"\uD83C\uDF5F"},{category:"food_n_drink",keyword:"pizza",code:"\uD83C\uDF55"},{category:"food_n_drink",keyword:"hot dog",code:"\uD83C\uDF2D"},{category:"food_n_drink",keyword:"sandwich",code:"\uD83E\uDD6A"},{category:"food_n_drink",keyword:"taco",code:"\uD83C\uDF2E"},{category:"food_n_drink",keyword:"burrito",code:"\uD83C\uDF2F"},{category:"food_n_drink",keyword:"stuffed flatbread",code:"\uD83E\uDD59"},{category:"food_n_drink",keyword:"egg",code:"\uD83E\uDD5A"},{category:"food_n_drink",keyword:"cooking",code:"\uD83C\uDF73"},{category:"food_n_drink",keyword:"shallow pan of food",code:"\uD83E\uDD58"},{category:"food_n_drink",keyword:"pot of food",code:"\uD83C\uDF72"},{category:"food_n_drink",keyword:"bowl with spoon",code:"\uD83E\uDD63"},{category:"food_n_drink",keyword:"green salad",code:"\uD83E\uDD57"},{category:"food_n_drink",keyword:"popcorn",code:"\uD83C\uDF7F"},{category:"food_n_drink",keyword:"salt",code:"\uD83E\uDDC2"},{category:"food_n_drink",keyword:"canned food",code:"\uD83E\uDD6B"},{category:"food_n_drink",keyword:"bento box",code:"\uD83C\uDF71"},{category:"food_n_drink",keyword:"rice cracker",code:"\uD83C\uDF58"},{category:"food_n_drink",keyword:"rice ball",code:"\uD83C\uDF59"},{category:"food_n_drink",keyword:"cooked rice",code:"\uD83C\uDF5A"},{category:"food_n_drink",keyword:"curry rice",code:"\uD83C\uDF5B"},{category:"food_n_drink",keyword:"steaming bowl",code:"\uD83C\uDF5C"},{category:"food_n_drink",keyword:"spaghetti",code:"\uD83C\uDF5D"},{category:"food_n_drink",keyword:"roasted sweet potato",code:"\uD83C\uDF60"},{category:"food_n_drink",keyword:"oden",code:"\uD83C\uDF62"},{category:"food_n_drink",keyword:"sushi",code:"\uD83C\uDF63"},{category:"food_n_drink",keyword:"fried shrimp",code:"\uD83C\uDF64"},{category:"food_n_drink",keyword:"fish cake with swirl",code:"\uD83C\uDF65"},{category:"food_n_drink",keyword:"moon cake",code:"\uD83E\uDD6E"},{category:"food_n_drink",keyword:"dango",code:"\uD83C\uDF61"},{category:"food_n_drink",keyword:"dumpling",code:"\uD83E\uDD5F"},{category:"food_n_drink",keyword:"fortune cookie",code:"\uD83E\uDD60"},{category:"food_n_drink",keyword:"takeout box",code:"\uD83E\uDD61"},{category:"food_n_drink",keyword:"soft ice cream",code:"\uD83C\uDF66"},{category:"food_n_drink",keyword:"shaved ice",code:"\uD83C\uDF67"},{category:"food_n_drink",keyword:"ice cream",code:"\uD83C\uDF68"},{category:"food_n_drink",keyword:"doughnut",code:"\uD83C\uDF69"},{category:"food_n_drink",keyword:"cookie",code:"\uD83C\uDF6A"},{category:"food_n_drink",keyword:"birthday cake",code:"\uD83C\uDF82"},{category:"food_n_drink",keyword:"shortcake",code:"\uD83C\uDF70"},{category:"food_n_drink",keyword:"cupcake",code:"\uD83E\uDDC1"},{category:"food_n_drink",keyword:"pie",code:"\uD83E\uDD67"},{category:"food_n_drink",keyword:"chocolate bar",code:"\uD83C\uDF6B"},{category:"food_n_drink",keyword:"candy",code:"\uD83C\uDF6C"},{category:"food_n_drink",keyword:"lollipop",code:"\uD83C\uDF6D"},{category:"food_n_drink",keyword:"custard",code:"\uD83C\uDF6E"},{category:"food_n_drink",keyword:"honey pot",code:"\uD83C\uDF6F"},{category:"food_n_drink",keyword:"baby bottle",code:"\uD83C\uDF7C"},{category:"food_n_drink",keyword:"glass of milk",code:"\uD83E\uDD5B"},{category:"food_n_drink",keyword:"hot beverage",code:"\u2615"},{category:"food_n_drink",keyword:"teacup without handle",code:"\uD83C\uDF75"},{category:"food_n_drink",keyword:"sake",code:"\uD83C\uDF76"},{category:"food_n_drink",keyword:"bottle with popping cork",code:"\uD83C\uDF7E"},{category:"food_n_drink",keyword:"wine glass",code:"\uD83C\uDF77"},{category:"food_n_drink",keyword:"cocktail glass",code:"\uD83C\uDF78"},{category:"food_n_drink",keyword:"tropical drink",code:"\uD83C\uDF79"},{category:"food_n_drink",keyword:"beer mug",code:"\uD83C\uDF7A"},{category:"food_n_drink",keyword:"clinking beer mugs",code:"\uD83C\uDF7B"},{category:"food_n_drink",keyword:"clinking glasses",code:"\uD83E\uDD42"},{category:"food_n_drink",keyword:"tumbler glass",code:"\uD83E\uDD43"},{category:"food_n_drink",keyword:"cup with straw",code:"\uD83E\uDD64"},{category:"food_n_drink",keyword:"chopsticks",code:"\uD83E\uDD62"},{category:"food_n_drink",keyword:"fork and knife with plate",code:"\uD83C\uDF7D\uFE0F"},{category:"food_n_drink",keyword:"fork and knife",code:"\uD83C\uDF74"},{category:"food_n_drink",keyword:"spoon",code:"\uD83E\uDD44"},{category:"food_n_drink",keyword:"kitchen knife",code:"\uD83D\uDD2A"},{category:"food_n_drink",keyword:"amphora",code:"\uD83C\uDFFA"},{category:"travel_n_places",keyword:"globe showing Europe-Africa",code:"\uD83C\uDF0D"},{category:"travel_n_places",keyword:"globe showing Americas",code:"\uD83C\uDF0E"},{category:"travel_n_places",keyword:"globe showing Asia-Australia",code:"\uD83C\uDF0F"},{category:"travel_n_places",keyword:"globe with meridians",code:"\uD83C\uDF10"},{category:"travel_n_places",keyword:"world map",code:"\uD83D\uDDFA\uFE0F"},{category:"travel_n_places",keyword:"map of Japan",code:"\uD83D\uDDFE"},{category:"travel_n_places",keyword:"compass",code:"\uD83E\uDDED"},{category:"travel_n_places",keyword:"snow-capped mountain",code:"\uD83C\uDFD4\uFE0F"},{category:"travel_n_places",keyword:"mountain",code:"\u26F0\uFE0F"},{category:"travel_n_places",keyword:"volcano",code:"\uD83C\uDF0B"},{category:"travel_n_places",keyword:"mount fuji",code:"\uD83D\uDDFB"},{category:"travel_n_places",keyword:"camping",code:"\uD83C\uDFD5\uFE0F"},{category:"travel_n_places",keyword:"beach with umbrella",code:"\uD83C\uDFD6\uFE0F"},{category:"travel_n_places",keyword:"desert",code:"\uD83C\uDFDC\uFE0F"},{category:"travel_n_places",keyword:"desert island",code:"\uD83C\uDFDD\uFE0F"},{category:"travel_n_places",keyword:"national park",code:"\uD83C\uDFDE\uFE0F"},{category:"travel_n_places",keyword:"stadium",code:"\uD83C\uDFDF\uFE0F"},{category:"travel_n_places",keyword:"classical building",code:"\uD83C\uDFDB\uFE0F"},{category:"travel_n_places",keyword:"building construction",code:"\uD83C\uDFD7\uFE0F"},{category:"travel_n_places",keyword:"bricks",code:"\uD83E\uDDF1"},{category:"travel_n_places",keyword:"houses",code:"\uD83C\uDFD8\uFE0F"},{category:"travel_n_places",keyword:"derelict house",code:"\uD83C\uDFDA\uFE0F"},{category:"travel_n_places",keyword:"house",code:"\uD83C\uDFE0"},{category:"travel_n_places",keyword:"house with garden",code:"\uD83C\uDFE1"},{category:"travel_n_places",keyword:"office building",code:"\uD83C\uDFE2"},{category:"travel_n_places",keyword:"Japanese post office",code:"\uD83C\uDFE3"},{category:"travel_n_places",keyword:"post office",code:"\uD83C\uDFE4"},{category:"travel_n_places",keyword:"hospital",code:"\uD83C\uDFE5"},{category:"travel_n_places",keyword:"bank",code:"\uD83C\uDFE6"},{category:"travel_n_places",keyword:"hotel",code:"\uD83C\uDFE8"},{category:"travel_n_places",keyword:"love hotel",code:"\uD83C\uDFE9"},{category:"travel_n_places",keyword:"convenience store",code:"\uD83C\uDFEA"},{category:"travel_n_places",keyword:"school",code:"\uD83C\uDFEB"},{category:"travel_n_places",keyword:"department store",code:"\uD83C\uDFEC"},{category:"travel_n_places",keyword:"factory",code:"\uD83C\uDFED"},{category:"travel_n_places",keyword:"Japanese castle",code:"\uD83C\uDFEF"},{category:"travel_n_places",keyword:"castle",code:"\uD83C\uDFF0"},{category:"travel_n_places",keyword:"wedding",code:"\uD83D\uDC92"},{category:"travel_n_places",keyword:"Tokyo tower",code:"\uD83D\uDDFC"},{category:"travel_n_places",keyword:"Statue of Liberty",code:"\uD83D\uDDFD"},{category:"travel_n_places",keyword:"church",code:"\u26EA"},{category:"travel_n_places",keyword:"mosque",code:"\uD83D\uDD4C"},{category:"travel_n_places",keyword:"synagogue",code:"\uD83D\uDD4D"},{category:"travel_n_places",keyword:"shinto shrine",code:"\u26E9\uFE0F"},{category:"travel_n_places",keyword:"kaaba",code:"\uD83D\uDD4B"},{category:"travel_n_places",keyword:"fountain",code:"\u26F2"},{category:"travel_n_places",keyword:"tent",code:"\u26FA"},{category:"travel_n_places",keyword:"foggy",code:"\uD83C\uDF01"},{category:"travel_n_places",keyword:"night with stars",code:"\uD83C\uDF03"},{category:"travel_n_places",keyword:"cityscape",code:"\uD83C\uDFD9\uFE0F"},{category:"travel_n_places",keyword:"sunrise over mountains",code:"\uD83C\uDF04"},{category:"travel_n_places",keyword:"sunrise",code:"\uD83C\uDF05"},{category:"travel_n_places",keyword:"cityscape at dusk",code:"\uD83C\uDF06"},{category:"travel_n_places",keyword:"sunset",code:"\uD83C\uDF07"},{category:"travel_n_places",keyword:"bridge at night",code:"\uD83C\uDF09"},{category:"travel_n_places",keyword:"hot springs",code:"\u2668\uFE0F"},{category:"travel_n_places",keyword:"milky way",code:"\uD83C\uDF0C"},{category:"travel_n_places",keyword:"carousel horse",code:"\uD83C\uDFA0"},{category:"travel_n_places",keyword:"ferris wheel",code:"\uD83C\uDFA1"},{category:"travel_n_places",keyword:"roller coaster",code:"\uD83C\uDFA2"},{category:"travel_n_places",keyword:"barber pole",code:"\uD83D\uDC88"},{category:"travel_n_places",keyword:"circus tent",code:"\uD83C\uDFAA"},{category:"travel_n_places",keyword:"locomotive",code:"\uD83D\uDE82"},{category:"travel_n_places",keyword:"railway car",code:"\uD83D\uDE83"},{category:"travel_n_places",keyword:"high-speed train",code:"\uD83D\uDE84"},{category:"travel_n_places",keyword:"bullet train",code:"\uD83D\uDE85"},{category:"travel_n_places",keyword:"train",code:"\uD83D\uDE86"},{category:"travel_n_places",keyword:"metro",code:"\uD83D\uDE87"},{category:"travel_n_places",keyword:"light rail",code:"\uD83D\uDE88"},{category:"travel_n_places",keyword:"station",code:"\uD83D\uDE89"},{category:"travel_n_places",keyword:"tram",code:"\uD83D\uDE8A"},{category:"travel_n_places",keyword:"monorail",code:"\uD83D\uDE9D"},{category:"travel_n_places",keyword:"mountain railway",code:"\uD83D\uDE9E"},{category:"travel_n_places",keyword:"tram car",code:"\uD83D\uDE8B"},{category:"travel_n_places",keyword:"bus",code:"\uD83D\uDE8C"},{category:"travel_n_places",keyword:"oncoming bus",code:"\uD83D\uDE8D"},{category:"travel_n_places",keyword:"trolleybus",code:"\uD83D\uDE8E"},{category:"travel_n_places",keyword:"minibus",code:"\uD83D\uDE90"},{category:"travel_n_places",keyword:"ambulance",code:"\uD83D\uDE91"},{category:"travel_n_places",keyword:"fire engine",code:"\uD83D\uDE92"},{category:"travel_n_places",keyword:"police car",code:"\uD83D\uDE93"},{category:"travel_n_places",keyword:"oncoming police car",code:"\uD83D\uDE94"},{category:"travel_n_places",keyword:"taxi",code:"\uD83D\uDE95"},{category:"travel_n_places",keyword:"oncoming taxi",code:"\uD83D\uDE96"},{category:"travel_n_places",keyword:"automobile",code:"\uD83D\uDE97"},{category:"travel_n_places",keyword:"oncoming automobile",code:"\uD83D\uDE98"},{category:"travel_n_places",keyword:"sport utility vehicle",code:"\uD83D\uDE99"},{category:"travel_n_places",keyword:"delivery truck",code:"\uD83D\uDE9A"},{category:"travel_n_places",keyword:"articulated lorry",code:"\uD83D\uDE9B"},{category:"travel_n_places",keyword:"tractor",code:"\uD83D\uDE9C"},{category:"travel_n_places",keyword:"bicycle",code:"\uD83D\uDEB2"},{category:"travel_n_places",keyword:"kick scooter",code:"\uD83D\uDEF4"},{category:"travel_n_places",keyword:"skateboard",code:"\uD83D\uDEF9"},{category:"travel_n_places",keyword:"motor scooter",code:"\uD83D\uDEF5"},{category:"travel_n_places",keyword:"bus stop",code:"\uD83D\uDE8F"},{category:"travel_n_places",keyword:"motorway",code:"\uD83D\uDEE3\uFE0F"},{category:"travel_n_places",keyword:"railway track",code:"\uD83D\uDEE4\uFE0F"},{category:"travel_n_places",keyword:"oil drum",code:"\uD83D\uDEE2\uFE0F"},{category:"travel_n_places",keyword:"fuel pump",code:"\u26FD"},{category:"travel_n_places",keyword:"police car light",code:"\uD83D\uDEA8"},{category:"travel_n_places",keyword:"horizontal traffic light",code:"\uD83D\uDEA5"},{category:"travel_n_places",keyword:"vertical traffic light",code:"\uD83D\uDEA6"},{category:"travel_n_places",keyword:"stop sign",code:"\uD83D\uDED1"},{category:"travel_n_places",keyword:"construction",code:"\uD83D\uDEA7"},{category:"travel_n_places",keyword:"anchor",code:"\u2693"},{category:"travel_n_places",keyword:"sailboat",code:"\u26F5"},{category:"travel_n_places",keyword:"canoe",code:"\uD83D\uDEF6"},{category:"travel_n_places",keyword:"speedboat",code:"\uD83D\uDEA4"},{category:"travel_n_places",keyword:"passenger ship",code:"\uD83D\uDEF3\uFE0F"},{category:"travel_n_places",keyword:"ferry",code:"\u26F4\uFE0F"},{category:"travel_n_places",keyword:"motor boat",code:"\uD83D\uDEE5\uFE0F"},{category:"travel_n_places",keyword:"ship",code:"\uD83D\uDEA2"},{category:"travel_n_places",keyword:"airplane",code:"\u2708\uFE0F"},{category:"travel_n_places",keyword:"small airplane",code:"\uD83D\uDEE9\uFE0F"},{category:"travel_n_places",keyword:"airplane departure",code:"\uD83D\uDEEB"},{category:"travel_n_places",keyword:"airplane arrival",code:"\uD83D\uDEEC"},{category:"travel_n_places",keyword:"seat",code:"\uD83D\uDCBA"},{category:"travel_n_places",keyword:"helicopter",code:"\uD83D\uDE81"},{category:"travel_n_places",keyword:"suspension railway",code:"\uD83D\uDE9F"},{category:"travel_n_places",keyword:"mountain cableway",code:"\uD83D\uDEA0"},{category:"travel_n_places",keyword:"aerial tramway",code:"\uD83D\uDEA1"},{category:"travel_n_places",keyword:"satellite",code:"\uD83D\uDEF0\uFE0F"},{category:"travel_n_places",keyword:"rocket",code:"\uD83D\uDE80"},{category:"travel_n_places",keyword:"flying saucer",code:"\uD83D\uDEF8"},{category:"travel_n_places",keyword:"bellhop bell",code:"\uD83D\uDECE\uFE0F"},{category:"travel_n_places",keyword:"luggage",code:"\uD83E\uDDF3"},{category:"travel_n_places",keyword:"hourglass done",code:"\u231B"},{category:"travel_n_places",keyword:"hourglass not done",code:"\u23F3"},{category:"travel_n_places",keyword:"watch",code:"\u231A"},{category:"travel_n_places",keyword:"alarm clock",code:"\u23F0"},{category:"travel_n_places",keyword:"stopwatch",code:"\u23F1\uFE0F"},{category:"travel_n_places",keyword:"timer clock",code:"\u23F2\uFE0F"},{category:"travel_n_places",keyword:"mantelpiece clock",code:"\uD83D\uDD70\uFE0F"},{category:"travel_n_places",keyword:"twelve o\u2019clock",code:"\uD83D\uDD5B"},{category:"travel_n_places",keyword:"twelve-thirty",code:"\uD83D\uDD67"},{category:"travel_n_places",keyword:"one o\u2019clock",code:"\uD83D\uDD50"},{category:"travel_n_places",keyword:"one-thirty",code:"\uD83D\uDD5C"},{category:"travel_n_places",keyword:"two o\u2019clock",code:"\uD83D\uDD51"},{category:"travel_n_places",keyword:"two-thirty",code:"\uD83D\uDD5D"},{category:"travel_n_places",keyword:"three o\u2019clock",code:"\uD83D\uDD52"},{category:"travel_n_places",keyword:"three-thirty",code:"\uD83D\uDD5E"},{category:"travel_n_places",keyword:"four o\u2019clock",code:"\uD83D\uDD53"},{category:"travel_n_places",keyword:"four-thirty",code:"\uD83D\uDD5F"},{category:"travel_n_places",keyword:"five o\u2019clock",code:"\uD83D\uDD54"},{category:"travel_n_places",keyword:"five-thirty",code:"\uD83D\uDD60"},{category:"travel_n_places",keyword:"six o\u2019clock",code:"\uD83D\uDD55"},{category:"travel_n_places",keyword:"six-thirty",code:"\uD83D\uDD61"},{category:"travel_n_places",keyword:"seven o\u2019clock",code:"\uD83D\uDD56"},{category:"travel_n_places",keyword:"seven-thirty",code:"\uD83D\uDD62"},{category:"travel_n_places",keyword:"eight o\u2019clock",code:"\uD83D\uDD57"},{category:"travel_n_places",keyword:"eight-thirty",code:"\uD83D\uDD63"},{category:"travel_n_places",keyword:"nine o\u2019clock",code:"\uD83D\uDD58"},{category:"travel_n_places",keyword:"nine-thirty",code:"\uD83D\uDD64"},{category:"travel_n_places",keyword:"ten o\u2019clock",code:"\uD83D\uDD59"},{category:"travel_n_places",keyword:"ten-thirty",code:"\uD83D\uDD65"},{category:"travel_n_places",keyword:"eleven o\u2019clock",code:"\uD83D\uDD5A"},{category:"travel_n_places",keyword:"eleven-thirty",code:"\uD83D\uDD66"},{category:"travel_n_places",keyword:"new moon",code:"\uD83C\uDF11"},{category:"travel_n_places",keyword:"waxing crescent moon",code:"\uD83C\uDF12"},{category:"travel_n_places",keyword:"first quarter moon",code:"\uD83C\uDF13"},{category:"travel_n_places",keyword:"waxing gibbous moon",code:"\uD83C\uDF14"},{category:"travel_n_places",keyword:"full moon",code:"\uD83C\uDF15"},{category:"travel_n_places",keyword:"waning gibbous moon",code:"\uD83C\uDF16"},{category:"travel_n_places",keyword:"last quarter moon",code:"\uD83C\uDF17"},{category:"travel_n_places",keyword:"waning crescent moon",code:"\uD83C\uDF18"},{category:"travel_n_places",keyword:"crescent moon",code:"\uD83C\uDF19"},{category:"travel_n_places",keyword:"new moon face",code:"\uD83C\uDF1A"},{category:"travel_n_places",keyword:"first quarter moon face",code:"\uD83C\uDF1B"},{category:"travel_n_places",keyword:"last quarter moon face",code:"\uD83C\uDF1C"},{category:"travel_n_places",keyword:"thermometer",code:"\uD83C\uDF21\uFE0F"},{category:"travel_n_places",keyword:"sun",code:"\u2600\uFE0F"},{category:"travel_n_places",keyword:"full moon face",code:"\uD83C\uDF1D"},{category:"travel_n_places",keyword:"sun with face",code:"\uD83C\uDF1E"},{category:"travel_n_places",keyword:"star",code:"\u2B50"},{category:"travel_n_places",keyword:"glowing star",code:"\uD83C\uDF1F"},{category:"travel_n_places",keyword:"shooting star",code:"\uD83C\uDF20"},{category:"travel_n_places",keyword:"cloud",code:"\u2601\uFE0F"},{category:"travel_n_places",keyword:"sun behind cloud",code:"\u26C5"},{category:"travel_n_places",keyword:"cloud with lightning and rain",code:"\u26C8\uFE0F"},{category:"travel_n_places",keyword:"sun behind small cloud",code:"\uD83C\uDF24\uFE0F"},{category:"travel_n_places",keyword:"sun behind large cloud",code:"\uD83C\uDF25\uFE0F"},{category:"travel_n_places",keyword:"sun behind rain cloud",code:"\uD83C\uDF26\uFE0F"},{category:"travel_n_places",keyword:"cloud with rain",code:"\uD83C\uDF27\uFE0F"},{category:"travel_n_places",keyword:"cloud with snow",code:"\uD83C\uDF28\uFE0F"},{category:"travel_n_places",keyword:"cloud with lightning",code:"\uD83C\uDF29\uFE0F"},{category:"travel_n_places",keyword:"tornado",code:"\uD83C\uDF2A\uFE0F"},{category:"travel_n_places",keyword:"fog",code:"\uD83C\uDF2B\uFE0F"},{category:"travel_n_places",keyword:"wind face",code:"\uD83C\uDF2C\uFE0F"},{category:"travel_n_places",keyword:"cyclone",code:"\uD83C\uDF00"},{category:"travel_n_places",keyword:"rainbow",code:"\uD83C\uDF08"},{category:"travel_n_places",keyword:"closed umbrella",code:"\uD83C\uDF02"},{category:"travel_n_places",keyword:"umbrella",code:"\u2602\uFE0F"},{category:"travel_n_places",keyword:"umbrella with rain drops",code:"\u2614"},{category:"travel_n_places",keyword:"umbrella on ground",code:"\u26F1\uFE0F"},{category:"travel_n_places",keyword:"high voltage",code:"\u26A1"},{category:"travel_n_places",keyword:"snowflake",code:"\u2744\uFE0F"},{category:"travel_n_places",keyword:"snowman",code:"\u2603\uFE0F"},{category:"travel_n_places",keyword:"snowman without snow",code:"\u26C4"},{category:"travel_n_places",keyword:"comet",code:"\u2604\uFE0F"},{category:"travel_n_places",keyword:"fire",code:"\uD83D\uDD25"},{category:"travel_n_places",keyword:"droplet",code:"\uD83D\uDCA7"},{category:"travel_n_places",keyword:"water wave",code:"\uD83C\uDF0A"},{category:"activities",keyword:"jack-o-lantern",code:"\uD83C\uDF83"},{category:"activities",keyword:"Christmas tree",code:"\uD83C\uDF84"},{category:"activities",keyword:"fireworks",code:"\uD83C\uDF86"},{category:"activities",keyword:"sparkler",code:"\uD83C\uDF87"},{category:"activities",keyword:"firecracker",code:"\uD83E\uDDE8"},{category:"activities",keyword:"sparkles",code:"\u2728"},{category:"activities",keyword:"balloon",code:"\uD83C\uDF88"},{category:"activities",keyword:"party popper",code:"\uD83C\uDF89"},{category:"activities",keyword:"confetti ball",code:"\uD83C\uDF8A"},{category:"activities",keyword:"tanabata tree",code:"\uD83C\uDF8B"},{category:"activities",keyword:"pine decoration",code:"\uD83C\uDF8D"},{category:"activities",keyword:"Japanese dolls",code:"\uD83C\uDF8E"},{category:"activities",keyword:"carp streamer",code:"\uD83C\uDF8F"},{category:"activities",keyword:"wind chime",code:"\uD83C\uDF90"},{category:"activities",keyword:"moon viewing ceremony",code:"\uD83C\uDF91"},{category:"activities",keyword:"red envelope",code:"\uD83E\uDDE7"},{category:"activities",keyword:"ribbon",code:"\uD83C\uDF80"},{category:"activities",keyword:"wrapped gift",code:"\uD83C\uDF81"},{category:"activities",keyword:"reminder ribbon",code:"\uD83C\uDF97\uFE0F"},{category:"activities",keyword:"admission tickets",code:"\uD83C\uDF9F\uFE0F"},{category:"activities",keyword:"ticket",code:"\uD83C\uDFAB"},{category:"activities",keyword:"military medal",code:"\uD83C\uDF96\uFE0F"},{category:"activities",keyword:"trophy",code:"\uD83C\uDFC6"},{category:"activities",keyword:"sports medal",code:"\uD83C\uDFC5"},{category:"activities",keyword:"1st place medal",code:"\uD83E\uDD47"},{category:"activities",keyword:"2nd place medal",code:"\uD83E\uDD48"},{category:"activities",keyword:"3rd place medal",code:"\uD83E\uDD49"},{category:"activities",keyword:"soccer ball",code:"\u26BD"},{category:"activities",keyword:"baseball",code:"\u26BE"},{category:"activities",keyword:"softball",code:"\uD83E\uDD4E"},{category:"activities",keyword:"basketball",code:"\uD83C\uDFC0"},{category:"activities",keyword:"volleyball",code:"\uD83C\uDFD0"},{category:"activities",keyword:"american football",code:"\uD83C\uDFC8"},{category:"activities",keyword:"rugby football",code:"\uD83C\uDFC9"},{category:"activities",keyword:"tennis",code:"\uD83C\uDFBE"},{category:"activities",keyword:"flying disc",code:"\uD83E\uDD4F"},{category:"activities",keyword:"bowling",code:"\uD83C\uDFB3"},{category:"activities",keyword:"cricket game",code:"\uD83C\uDFCF"},{category:"activities",keyword:"field hockey",code:"\uD83C\uDFD1"},{category:"activities",keyword:"ice hockey",code:"\uD83C\uDFD2"},{category:"activities",keyword:"lacrosse",code:"\uD83E\uDD4D"},{category:"activities",keyword:"ping pong",code:"\uD83C\uDFD3"},{category:"activities",keyword:"badminton",code:"\uD83C\uDFF8"},{category:"activities",keyword:"boxing glove",code:"\uD83E\uDD4A"},{category:"activities",keyword:"martial arts uniform",code:"\uD83E\uDD4B"},{category:"activities",keyword:"goal net",code:"\uD83E\uDD45"},{category:"activities",keyword:"flag in hole",code:"\u26F3"},{category:"activities",keyword:"ice skate",code:"\u26F8\uFE0F"},{category:"activities",keyword:"fishing pole",code:"\uD83C\uDFA3"},{category:"activities",keyword:"running shirt",code:"\uD83C\uDFBD"},{category:"activities",keyword:"skis",code:"\uD83C\uDFBF"},{category:"activities",keyword:"sled",code:"\uD83D\uDEF7"},{category:"activities",keyword:"curling stone",code:"\uD83E\uDD4C"},{category:"activities",keyword:"direct hit",code:"\uD83C\uDFAF"},{category:"activities",keyword:"pool 8 ball",code:"\uD83C\uDFB1"},{category:"activities",keyword:"crystal ball",code:"\uD83D\uDD2E"},{category:"activities",keyword:"nazar amulet",code:"\uD83E\uDDFF"},{category:"activities",keyword:"video game",code:"\uD83C\uDFAE"},{category:"activities",keyword:"joystick",code:"\uD83D\uDD79\uFE0F"},{category:"activities",keyword:"slot machine",code:"\uD83C\uDFB0"},{category:"activities",keyword:"game die",code:"\uD83C\uDFB2"},{category:"activities",keyword:"jigsaw",code:"\uD83E\uDDE9"},{category:"activities",keyword:"teddy bear",code:"\uD83E\uDDF8"},{category:"activities",keyword:"spade suit",code:"\u2660\uFE0F"},{category:"activities",keyword:"heart suit",code:"\u2665\uFE0F"},{category:"activities",keyword:"diamond suit",code:"\u2666\uFE0F"},{category:"activities",keyword:"club suit",code:"\u2663\uFE0F"},{category:"activities",keyword:"chess pawn",code:"\u265F\uFE0F"},{category:"activities",keyword:"joker",code:"\uD83C\uDCCF"},{category:"activities",keyword:"mahjong red dragon",code:"\uD83C\uDC04"},{category:"activities",keyword:"flower playing cards",code:"\uD83C\uDFB4"},{category:"activities",keyword:"performing arts",code:"\uD83C\uDFAD"},{category:"activities",keyword:"framed picture",code:"\uD83D\uDDBC\uFE0F"},{category:"activities",keyword:"artist palette",code:"\uD83C\uDFA8"},{category:"activities",keyword:"thread",code:"\uD83E\uDDF5"},{category:"activities",keyword:"yarn",code:"\uD83E\uDDF6"},{category:"objects",keyword:"muted speaker",code:"\uD83D\uDD07"},{category:"objects",keyword:"speaker low volume",code:"\uD83D\uDD08"},{category:"objects",keyword:"speaker medium volume",code:"\uD83D\uDD09"},{category:"objects",keyword:"speaker high volume",code:"\uD83D\uDD0A"},{category:"objects",keyword:"loudspeaker",code:"\uD83D\uDCE2"},{category:"objects",keyword:"megaphone",code:"\uD83D\uDCE3"},{category:"objects",keyword:"postal horn",code:"\uD83D\uDCEF"},{category:"objects",keyword:"bell",code:"\uD83D\uDD14"},{category:"objects",keyword:"bell with slash",code:"\uD83D\uDD15"},{category:"objects",keyword:"musical score",code:"\uD83C\uDFBC"},{category:"objects",keyword:"musical note",code:"\uD83C\uDFB5"},{category:"objects",keyword:"musical notes",code:"\uD83C\uDFB6"},{category:"objects",keyword:"studio microphone",code:"\uD83C\uDF99\uFE0F"},{category:"objects",keyword:"level slider",code:"\uD83C\uDF9A\uFE0F"},{category:"objects",keyword:"control knobs",code:"\uD83C\uDF9B\uFE0F"},{category:"objects",keyword:"microphone",code:"\uD83C\uDFA4"},{category:"objects",keyword:"headphone",code:"\uD83C\uDFA7"},{category:"objects",keyword:"radio",code:"\uD83D\uDCFB"},{category:"objects",keyword:"saxophone",code:"\uD83C\uDFB7"},{category:"objects",keyword:"guitar",code:"\uD83C\uDFB8"},{category:"objects",keyword:"musical keyboard",code:"\uD83C\uDFB9"},{category:"objects",keyword:"trumpet",code:"\uD83C\uDFBA"},{category:"objects",keyword:"violin",code:"\uD83C\uDFBB"},{category:"objects",keyword:"drum",code:"\uD83E\uDD41"},{category:"objects",keyword:"mobile phone",code:"\uD83D\uDCF1"},{category:"objects",keyword:"mobile phone with arrow",code:"\uD83D\uDCF2"},{category:"objects",keyword:"telephone",code:"\u260E\uFE0F"},{category:"objects",keyword:"telephone receiver",code:"\uD83D\uDCDE"},{category:"objects",keyword:"pager",code:"\uD83D\uDCDF"},{category:"objects",keyword:"fax machine",code:"\uD83D\uDCE0"},{category:"objects",keyword:"battery",code:"\uD83D\uDD0B"},{category:"objects",keyword:"electric plug",code:"\uD83D\uDD0C"},{category:"objects",keyword:"laptop computer",code:"\uD83D\uDCBB"},{category:"objects",keyword:"desktop computer",code:"\uD83D\uDDA5\uFE0F"},{category:"objects",keyword:"printer",code:"\uD83D\uDDA8\uFE0F"},{category:"objects",keyword:"keyboard",code:"\u2328\uFE0F"},{category:"objects",keyword:"computer mouse",code:"\uD83D\uDDB1\uFE0F"},{category:"objects",keyword:"trackball",code:"\uD83D\uDDB2\uFE0F"},{category:"objects",keyword:"computer disk",code:"\uD83D\uDCBD"},{category:"objects",keyword:"floppy disk",code:"\uD83D\uDCBE"},{category:"objects",keyword:"optical disk",code:"\uD83D\uDCBF"},{category:"objects",keyword:"dvd",code:"\uD83D\uDCC0"},{category:"objects",keyword:"abacus",code:"\uD83E\uDDEE"},{category:"objects",keyword:"movie camera",code:"\uD83C\uDFA5"},{category:"objects",keyword:"film frames",code:"\uD83C\uDF9E\uFE0F"},{category:"objects",keyword:"film projector",code:"\uD83D\uDCFD\uFE0F"},{category:"objects",keyword:"clapper board",code:"\uD83C\uDFAC"},{category:"objects",keyword:"television",code:"\uD83D\uDCFA"},{category:"objects",keyword:"camera",code:"\uD83D\uDCF7"},{category:"objects",keyword:"camera with flash",code:"\uD83D\uDCF8"},{category:"objects",keyword:"video camera",code:"\uD83D\uDCF9"},{category:"objects",keyword:"videocassette",code:"\uD83D\uDCFC"},{category:"objects",keyword:"magnifying glass tilted left",code:"\uD83D\uDD0D"},{category:"objects",keyword:"magnifying glass tilted right",code:"\uD83D\uDD0E"},{category:"objects",keyword:"candle",code:"\uD83D\uDD6F\uFE0F"},{category:"objects",keyword:"light bulb",code:"\uD83D\uDCA1"},{category:"objects",keyword:"flashlight",code:"\uD83D\uDD26"},{category:"objects",keyword:"red paper lantern",code:"\uD83C\uDFEE"},{category:"objects",keyword:"notebook with decorative cover",code:"\uD83D\uDCD4"},{category:"objects",keyword:"closed book",code:"\uD83D\uDCD5"},{category:"objects",keyword:"open book",code:"\uD83D\uDCD6"},{category:"objects",keyword:"green book",code:"\uD83D\uDCD7"},{category:"objects",keyword:"blue book",code:"\uD83D\uDCD8"},{category:"objects",keyword:"orange book",code:"\uD83D\uDCD9"},{category:"objects",keyword:"books",code:"\uD83D\uDCDA"},{category:"objects",keyword:"notebook",code:"\uD83D\uDCD3"},{category:"objects",keyword:"ledger",code:"\uD83D\uDCD2"},{category:"objects",keyword:"page with curl",code:"\uD83D\uDCC3"},{category:"objects",keyword:"scroll",code:"\uD83D\uDCDC"},{category:"objects",keyword:"page facing up",code:"\uD83D\uDCC4"},{category:"objects",keyword:"newspaper",code:"\uD83D\uDCF0"},{category:"objects",keyword:"rolled-up newspaper",code:"\uD83D\uDDDE\uFE0F"},{category:"objects",keyword:"bookmark tabs",code:"\uD83D\uDCD1"},{category:"objects",keyword:"bookmark",code:"\uD83D\uDD16"},{category:"objects",keyword:"label",code:"\uD83C\uDFF7\uFE0F"},{category:"objects",keyword:"money bag",code:"\uD83D\uDCB0"},{category:"objects",keyword:"yen banknote",code:"\uD83D\uDCB4"},{category:"objects",keyword:"dollar banknote",code:"\uD83D\uDCB5"},{category:"objects",keyword:"euro banknote",code:"\uD83D\uDCB6"},{category:"objects",keyword:"pound banknote",code:"\uD83D\uDCB7"},{category:"objects",keyword:"money with wings",code:"\uD83D\uDCB8"},{category:"objects",keyword:"credit card",code:"\uD83D\uDCB3"},{category:"objects",keyword:"receipt",code:"\uD83E\uDDFE"},{category:"objects",keyword:"chart increasing with yen",code:"\uD83D\uDCB9"},{category:"objects",keyword:"currency exchange",code:"\uD83D\uDCB1"},{category:"objects",keyword:"heavy dollar sign",code:"\uD83D\uDCB2"},{category:"objects",keyword:"envelope",code:"\u2709\uFE0F"},{category:"objects",keyword:"e-mail",code:"\uD83D\uDCE7"},{category:"objects",keyword:"incoming envelope",code:"\uD83D\uDCE8"},{category:"objects",keyword:"envelope with arrow",code:"\uD83D\uDCE9"},{category:"objects",keyword:"outbox tray",code:"\uD83D\uDCE4"},{category:"objects",keyword:"inbox tray",code:"\uD83D\uDCE5"},{category:"objects",keyword:"package",code:"\uD83D\uDCE6"},{category:"objects",keyword:"closed mailbox with raised flag",code:"\uD83D\uDCEB"},{category:"objects",keyword:"closed mailbox with lowered flag",code:"\uD83D\uDCEA"},{category:"objects",keyword:"open mailbox with raised flag",code:"\uD83D\uDCEC"},{category:"objects",keyword:"open mailbox with lowered flag",code:"\uD83D\uDCED"},{category:"objects",keyword:"postbox",code:"\uD83D\uDCEE"},{category:"objects",keyword:"ballot box with ballot",code:"\uD83D\uDDF3\uFE0F"},{category:"objects",keyword:"pencil",code:"\u270F\uFE0F"},{category:"objects",keyword:"black nib",code:"\u2712\uFE0F"},{category:"objects",keyword:"fountain pen",code:"\uD83D\uDD8B\uFE0F"},{category:"objects",keyword:"pen",code:"\uD83D\uDD8A\uFE0F"},{category:"objects",keyword:"paintbrush",code:"\uD83D\uDD8C\uFE0F"},{category:"objects",keyword:"crayon",code:"\uD83D\uDD8D\uFE0F"},{category:"objects",keyword:"memo",code:"\uD83D\uDCDD"},{category:"objects",keyword:"briefcase",code:"\uD83D\uDCBC"},{category:"objects",keyword:"file folder",code:"\uD83D\uDCC1"},{category:"objects",keyword:"open file folder",code:"\uD83D\uDCC2"},{category:"objects",keyword:"card index dividers",code:"\uD83D\uDDC2\uFE0F"},{category:"objects",keyword:"calendar",code:"\uD83D\uDCC5"},{category:"objects",keyword:"tear-off calendar",code:"\uD83D\uDCC6"},{category:"objects",keyword:"spiral notepad",code:"\uD83D\uDDD2\uFE0F"},{category:"objects",keyword:"spiral calendar",code:"\uD83D\uDDD3\uFE0F"},{category:"objects",keyword:"card index",code:"\uD83D\uDCC7"},{category:"objects",keyword:"chart increasing",code:"\uD83D\uDCC8"},{category:"objects",keyword:"chart decreasing",code:"\uD83D\uDCC9"},{category:"objects",keyword:"bar chart",code:"\uD83D\uDCCA"},{category:"objects",keyword:"clipboard",code:"\uD83D\uDCCB"},{category:"objects",keyword:"pushpin",code:"\uD83D\uDCCC"},{category:"objects",keyword:"round pushpin",code:"\uD83D\uDCCD"},{category:"objects",keyword:"paperclip",code:"\uD83D\uDCCE"},{category:"objects",keyword:"linked paperclips",code:"\uD83D\uDD87\uFE0F"},{category:"objects",keyword:"straight ruler",code:"\uD83D\uDCCF"},{category:"objects",keyword:"triangular ruler",code:"\uD83D\uDCD0"},{category:"objects",keyword:"scissors",code:"\u2702\uFE0F"},{category:"objects",keyword:"card file box",code:"\uD83D\uDDC3\uFE0F"},{category:"objects",keyword:"file cabinet",code:"\uD83D\uDDC4\uFE0F"},{category:"objects",keyword:"wastebasket",code:"\uD83D\uDDD1\uFE0F"},{category:"objects",keyword:"locked",code:"\uD83D\uDD12"},{category:"objects",keyword:"unlocked",code:"\uD83D\uDD13"},{category:"objects",keyword:"locked with pen",code:"\uD83D\uDD0F"},{category:"objects",keyword:"locked with key",code:"\uD83D\uDD10"},{category:"objects",keyword:"key",code:"\uD83D\uDD11"},{category:"objects",keyword:"old key",code:"\uD83D\uDDDD\uFE0F"},{category:"objects",keyword:"hammer",code:"\uD83D\uDD28"},{category:"objects",keyword:"pick",code:"\u26CF\uFE0F"},{category:"objects",keyword:"hammer and pick",code:"\u2692\uFE0F"},{category:"objects",keyword:"hammer and wrench",code:"\uD83D\uDEE0\uFE0F"},{category:"objects",keyword:"dagger",code:"\uD83D\uDDE1\uFE0F"},{category:"objects",keyword:"crossed swords",code:"\u2694\uFE0F"},{category:"objects",keyword:"pistol",code:"\uD83D\uDD2B"},{category:"objects",keyword:"bow and arrow",code:"\uD83C\uDFF9"},{category:"objects",keyword:"shield",code:"\uD83D\uDEE1\uFE0F"},{category:"objects",keyword:"wrench",code:"\uD83D\uDD27"},{category:"objects",keyword:"nut and bolt",code:"\uD83D\uDD29"},{category:"objects",keyword:"gear",code:"\u2699\uFE0F"},{category:"objects",keyword:"clamp",code:"\uD83D\uDDDC\uFE0F"},{category:"objects",keyword:"balance scale",code:"\u2696\uFE0F"},{category:"objects",keyword:"link",code:"\uD83D\uDD17"},{category:"objects",keyword:"chains",code:"\u26D3\uFE0F"},{category:"objects",keyword:"toolbox",code:"\uD83E\uDDF0"},{category:"objects",keyword:"magnet",code:"\uD83E\uDDF2"},{category:"objects",keyword:"alembic",code:"\u2697\uFE0F"},{category:"objects",keyword:"test tube",code:"\uD83E\uDDEA"},{category:"objects",keyword:"petri dish",code:"\uD83E\uDDEB"},{category:"objects",keyword:"dna",code:"\uD83E\uDDEC"},{category:"objects",keyword:"microscope",code:"\uD83D\uDD2C"},{category:"objects",keyword:"telescope",code:"\uD83D\uDD2D"},{category:"objects",keyword:"satellite antenna",code:"\uD83D\uDCE1"},{category:"objects",keyword:"syringe",code:"\uD83D\uDC89"},{category:"objects",keyword:"pill",code:"\uD83D\uDC8A"},{category:"objects",keyword:"door",code:"\uD83D\uDEAA"},{category:"objects",keyword:"bed",code:"\uD83D\uDECF\uFE0F"},{category:"objects",keyword:"couch and lamp",code:"\uD83D\uDECB\uFE0F"},{category:"objects",keyword:"toilet",code:"\uD83D\uDEBD"},{category:"objects",keyword:"shower",code:"\uD83D\uDEBF"},{category:"objects",keyword:"bathtub",code:"\uD83D\uDEC1"},{category:"objects",keyword:"lotion bottle",code:"\uD83E\uDDF4"},{category:"objects",keyword:"safety pin",code:"\uD83E\uDDF7"},{category:"objects",keyword:"broom",code:"\uD83E\uDDF9"},{category:"objects",keyword:"basket",code:"\uD83E\uDDFA"},{category:"objects",keyword:"roll of paper",code:"\uD83E\uDDFB"},{category:"objects",keyword:"soap",code:"\uD83E\uDDFC"},{category:"objects",keyword:"sponge",code:"\uD83E\uDDFD"},{category:"objects",keyword:"fire extinguisher",code:"\uD83E\uDDEF"},{category:"objects",keyword:"shopping cart",code:"\uD83D\uDED2"},{category:"objects",keyword:"cigarette",code:"\uD83D\uDEAC"},{category:"objects",keyword:"coffin",code:"\u26B0\uFE0F"},{category:"objects",keyword:"funeral urn",code:"\u26B1\uFE0F"},{category:"objects",keyword:"moai",code:"\uD83D\uDDFF"},{category:"symbols",keyword:"ATM sign",code:"\uD83C\uDFE7"},{category:"symbols",keyword:"litter in bin sign",code:"\uD83D\uDEAE"},{category:"symbols",keyword:"potable water",code:"\uD83D\uDEB0"},{category:"symbols",keyword:"wheelchair symbol",code:"\u267F"},{category:"symbols",keyword:"men\u2019s room",code:"\uD83D\uDEB9"},{category:"symbols",keyword:"women\u2019s room",code:"\uD83D\uDEBA"},{category:"symbols",keyword:"restroom",code:"\uD83D\uDEBB"},{category:"symbols",keyword:"baby symbol",code:"\uD83D\uDEBC"},{category:"symbols",keyword:"water closet",code:"\uD83D\uDEBE"},{category:"symbols",keyword:"passport control",code:"\uD83D\uDEC2"},{category:"symbols",keyword:"customs",code:"\uD83D\uDEC3"},{category:"symbols",keyword:"baggage claim",code:"\uD83D\uDEC4"},{category:"symbols",keyword:"left luggage",code:"\uD83D\uDEC5"},{category:"symbols",keyword:"warning",code:"\u26A0\uFE0F"},{category:"symbols",keyword:"children crossing",code:"\uD83D\uDEB8"},{category:"symbols",keyword:"no entry",code:"\u26D4"},{category:"symbols",keyword:"prohibited",code:"\uD83D\uDEAB"},{category:"symbols",keyword:"no bicycles",code:"\uD83D\uDEB3"},{category:"symbols",keyword:"no smoking",code:"\uD83D\uDEAD"},{category:"symbols",keyword:"no littering",code:"\uD83D\uDEAF"},{category:"symbols",keyword:"non-potable water",code:"\uD83D\uDEB1"},{category:"symbols",keyword:"no pedestrians",code:"\uD83D\uDEB7"},{category:"symbols",keyword:"no mobile phones",code:"\uD83D\uDCF5"},{category:"symbols",keyword:"no one under eighteen",code:"\uD83D\uDD1E"},{category:"symbols",keyword:"radioactive",code:"\u2622\uFE0F"},{category:"symbols",keyword:"biohazard",code:"\u2623\uFE0F"},{category:"symbols",keyword:"up arrow",code:"\u2B06\uFE0F"},{category:"symbols",keyword:"up-right arrow",code:"\u2197\uFE0F"},{category:"symbols",keyword:"right arrow",code:"\u27A1\uFE0F"},{category:"symbols",keyword:"down-right arrow",code:"\u2198\uFE0F"},{category:"symbols",keyword:"down arrow",code:"\u2B07\uFE0F"},{category:"symbols",keyword:"down-left arrow",code:"\u2199\uFE0F"},{category:"symbols",keyword:"left arrow",code:"\u2B05\uFE0F"},{category:"symbols",keyword:"up-left arrow",code:"\u2196\uFE0F"},{category:"symbols",keyword:"up-down arrow",code:"\u2195\uFE0F"},{category:"symbols",keyword:"left-right arrow",code:"\u2194\uFE0F"},{category:"symbols",keyword:"right arrow curving left",code:"\u21A9\uFE0F"},{category:"symbols",keyword:"left arrow curving right",code:"\u21AA\uFE0F"},{category:"symbols",keyword:"right arrow curving up",code:"\u2934\uFE0F"},{category:"symbols",keyword:"right arrow curving down",code:"\u2935\uFE0F"},{category:"symbols",keyword:"clockwise vertical arrows",code:"\uD83D\uDD03"},{category:"symbols",keyword:"counterclockwise arrows button",code:"\uD83D\uDD04"},{category:"symbols",keyword:"BACK arrow",code:"\uD83D\uDD19"},{category:"symbols",keyword:"END arrow",code:"\uD83D\uDD1A"},{category:"symbols",keyword:"ON! arrow",code:"\uD83D\uDD1B"},{category:"symbols",keyword:"SOON arrow",code:"\uD83D\uDD1C"},{category:"symbols",keyword:"TOP arrow",code:"\uD83D\uDD1D"},{category:"symbols",keyword:"place of worship",code:"\uD83D\uDED0"},{category:"symbols",keyword:"atom symbol",code:"\u269B\uFE0F"},{category:"symbols",keyword:"om",code:"\uD83D\uDD49\uFE0F"},{category:"symbols",keyword:"star of David",code:"\u2721\uFE0F"},{category:"symbols",keyword:"wheel of dharma",code:"\u2638\uFE0F"},{category:"symbols",keyword:"yin yang",code:"\u262F\uFE0F"},{category:"symbols",keyword:"latin cross",code:"\u271D\uFE0F"},{category:"symbols",keyword:"orthodox cross",code:"\u2626\uFE0F"},{category:"symbols",keyword:"star and crescent",code:"\u262A\uFE0F"},{category:"symbols",keyword:"peace symbol",code:"\u262E\uFE0F"},{category:"symbols",keyword:"menorah",code:"\uD83D\uDD4E"},{category:"symbols",keyword:"dotted six-pointed star",code:"\uD83D\uDD2F"},{category:"symbols",keyword:"Aries",code:"\u2648"},{category:"symbols",keyword:"Taurus",code:"\u2649"},{category:"symbols",keyword:"Gemini",code:"\u264A"},{category:"symbols",keyword:"Cancer",code:"\u264B"},{category:"symbols",keyword:"Leo",code:"\u264C"},{category:"symbols",keyword:"Virgo",code:"\u264D"},{category:"symbols",keyword:"Libra",code:"\u264E"},{category:"symbols",keyword:"Scorpio",code:"\u264F"},{category:"symbols",keyword:"Sagittarius",code:"\u2650"},{category:"symbols",keyword:"Capricorn",code:"\u2651"},{category:"symbols",keyword:"Aquarius",code:"\u2652"},{category:"symbols",keyword:"Pisces",code:"\u2653"},{category:"symbols",keyword:"Ophiuchus",code:"\u26CE"},{category:"symbols",keyword:"shuffle tracks button",code:"\uD83D\uDD00"},{category:"symbols",keyword:"repeat button",code:"\uD83D\uDD01"},{category:"symbols",keyword:"repeat single button",code:"\uD83D\uDD02"},{category:"symbols",keyword:"play button",code:"\u25B6\uFE0F"},{category:"symbols",keyword:"fast-forward button",code:"\u23E9"},{category:"symbols",keyword:"next track button",code:"\u23ED\uFE0F"},{category:"symbols",keyword:"play or pause button",code:"\u23EF\uFE0F"},{category:"symbols",keyword:"reverse button",code:"\u25C0\uFE0F"},{category:"symbols",keyword:"fast reverse button",code:"\u23EA"},{category:"symbols",keyword:"last track button",code:"\u23EE\uFE0F"},{category:"symbols",keyword:"upwards button",code:"\uD83D\uDD3C"},{category:"symbols",keyword:"fast up button",code:"\u23EB"},{category:"symbols",keyword:"downwards button",code:"\uD83D\uDD3D"},{category:"symbols",keyword:"fast down button",code:"\u23EC"},{category:"symbols",keyword:"pause button",code:"\u23F8\uFE0F"},{category:"symbols",keyword:"stop button",code:"\u23F9\uFE0F"},{category:"symbols",keyword:"record button",code:"\u23FA\uFE0F"},{category:"symbols",keyword:"eject button",code:"\u23CF\uFE0F"},{category:"symbols",keyword:"cinema",code:"\uD83C\uDFA6"},{category:"symbols",keyword:"dim button",code:"\uD83D\uDD05"},{category:"symbols",keyword:"bright button",code:"\uD83D\uDD06"},{category:"symbols",keyword:"antenna bars",code:"\uD83D\uDCF6"},{category:"symbols",keyword:"vibration mode",code:"\uD83D\uDCF3"},{category:"symbols",keyword:"mobile phone off",code:"\uD83D\uDCF4"},{category:"symbols",keyword:"female sign",code:"\u2640\uFE0F"},{category:"symbols",keyword:"male sign",code:"\u2642\uFE0F"},{category:"symbols",keyword:"medical symbol",code:"\u2695\uFE0F"},{category:"symbols",keyword:"infinity",code:"\u267E\uFE0F"},{category:"symbols",keyword:"recycling symbol",code:"\u267B\uFE0F"},{category:"symbols",keyword:"fleur-de-lis",code:"\u269C\uFE0F"},{category:"symbols",keyword:"trident emblem",code:"\uD83D\uDD31"},{category:"symbols",keyword:"name badge",code:"\uD83D\uDCDB"},{category:"symbols",keyword:"Japanese symbol for beginner",code:"\uD83D\uDD30"},{category:"symbols",keyword:"heavy large circle",code:"\u2B55"},{category:"symbols",keyword:"white heavy check mark",code:"\u2705"},{category:"symbols",keyword:"ballot box with check",code:"\u2611\uFE0F"},{category:"symbols",keyword:"heavy check mark",code:"\u2714\uFE0F"},{category:"symbols",keyword:"heavy multiplication x",code:"\u2716\uFE0F"},{category:"symbols",keyword:"cross mark",code:"\u274C"},{category:"symbols",keyword:"cross mark button",code:"\u274E"},{category:"symbols",keyword:"heavy plus sign",code:"\u2795"},{category:"symbols",keyword:"heavy minus sign",code:"\u2796"},{category:"symbols",keyword:"heavy division sign",code:"\u2797"},{category:"symbols",keyword:"curly loop",code:"\u27B0"},{category:"symbols",keyword:"double curly loop",code:"\u27BF"},{category:"symbols",keyword:"part alternation mark",code:"\u303D\uFE0F"},{category:"symbols",keyword:"eight-spoked asterisk",code:"\u2733\uFE0F"},{category:"symbols",keyword:"eight-pointed star",code:"\u2734\uFE0F"},{category:"symbols",keyword:"sparkle",code:"\u2747\uFE0F"},{category:"symbols",keyword:"double exclamation mark",code:"\u203C\uFE0F"},{category:"symbols",keyword:"exclamation question mark",code:"\u2049\uFE0F"},{category:"symbols",keyword:"question mark",code:"\u2753"},{category:"symbols",keyword:"white question mark",code:"\u2754"},{category:"symbols",keyword:"white exclamation mark",code:"\u2755"},{category:"symbols",keyword:"exclamation mark",code:"\u2757"},{category:"symbols",keyword:"wavy dash",code:"\u3030\uFE0F"},{category:"symbols",keyword:"copyright",code:"%A9\uFE0F"},{category:"symbols",keyword:"registered",code:"%AE\uFE0F"},{category:"symbols",keyword:"trade mark",code:"\u2122\uFE0F"},{category:"symbols",keyword:"keycap: #",code:"%23\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: *",code:"*\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 0",code:"0\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 1",code:"1\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 2",code:"2\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 3",code:"3\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 4",code:"4\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 5",code:"5\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 6",code:"6\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 7",code:"7\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 8",code:"8\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 9",code:"9\uFE0F\u20E3"},{category:"symbols",keyword:"keycap: 10",code:"\uD83D\uDD1F"},{category:"symbols",keyword:"hundred points",code:"\uD83D\uDCAF"},{category:"symbols",keyword:"input latin uppercase",code:"\uD83D\uDD20"},{category:"symbols",keyword:"input latin lowercase",code:"\uD83D\uDD21"},{category:"symbols",keyword:"input numbers",code:"\uD83D\uDD22"},{category:"symbols",keyword:"input symbols",code:"\uD83D\uDD23"},{category:"symbols",keyword:"input latin letters",code:"\uD83D\uDD24"},{category:"symbols",keyword:"A button (blood type)",code:"\uD83C\uDD70\uFE0F"},{category:"symbols",keyword:"AB button (blood type)",code:"\uD83C\uDD8E"},{category:"symbols",keyword:"B button (blood type)",code:"\uD83C\uDD71\uFE0F"},{category:"symbols",keyword:"CL button",code:"\uD83C\uDD91"},{category:"symbols",keyword:"COOL button",code:"\uD83C\uDD92"},{category:"symbols",keyword:"FREE button",code:"\uD83C\uDD93"},{category:"symbols",keyword:"information",code:"\u2139\uFE0F"},{category:"symbols",keyword:"ID button",code:"\uD83C\uDD94"},{category:"symbols",keyword:"circled M",code:"\u24C2\uFE0F"},{category:"symbols",keyword:"NEW button",code:"\uD83C\uDD95"},{category:"symbols",keyword:"NG button",code:"\uD83C\uDD96"},{category:"symbols",keyword:"O button (blood type)",code:"\uD83C\uDD7E\uFE0F"},{category:"symbols",keyword:"OK button",code:"\uD83C\uDD97"},{category:"symbols",keyword:"P button",code:"\uD83C\uDD7F\uFE0F"},{category:"symbols",keyword:"SOS button",code:"\uD83C\uDD98"},{category:"symbols",keyword:"UP! button",code:"\uD83C\uDD99"},{category:"symbols",keyword:"VS button",code:"\uD83C\uDD9A"},{category:"symbols",keyword:"Japanese \u201Chere\u201D button",code:"\uD83C\uDE01"},{category:"symbols",keyword:"Japanese \u201Cservice charge\u201D button",code:"\uD83C\uDE02\uFE0F"},{category:"symbols",keyword:"Japanese \u201Cmonthly amount\u201D button",code:"\uD83C\uDE37\uFE0F"},{category:"symbols",keyword:"Japanese \u201Cnot free of charge\u201D button",code:"\uD83C\uDE36"},{category:"symbols",keyword:"Japanese \u201Creserved\u201D button",code:"\uD83C\uDE2F"},{category:"symbols",keyword:"Japanese \u201Cbargain\u201D button",code:"\uD83C\uDE50"},{category:"symbols",keyword:"Japanese \u201Cdiscount\u201D button",code:"\uD83C\uDE39"},{category:"symbols",keyword:"Japanese \u201Cfree of charge\u201D button",code:"\uD83C\uDE1A"},{category:"symbols",keyword:"Japanese \u201Cprohibited\u201D button",code:"\uD83C\uDE32"},{category:"symbols",keyword:"Japanese \u201Cacceptable\u201D button",code:"\uD83C\uDE51"},{category:"symbols",keyword:"Japanese \u201Capplication\u201D button",code:"\uD83C\uDE38"},{category:"symbols",keyword:"Japanese \u201Cpassing grade\u201D button",code:"\uD83C\uDE34"},{category:"symbols",keyword:"Japanese \u201Cvacancy\u201D button",code:"\uD83C\uDE33"},{category:"symbols",keyword:"Japanese \u201Ccongratulations\u201D button",code:"\u3297\uFE0F"},{category:"symbols",keyword:"Japanese \u201Csecret\u201D button",code:"\u3299\uFE0F"},{category:"symbols",keyword:"Japanese \u201Copen for business\u201D button",code:"\uD83C\uDE3A"},{category:"symbols",keyword:"Japanese \u201Cno vacancy\u201D button",code:"\uD83C\uDE35"},{category:"symbols",keyword:"black small square",code:"\u25AA\uFE0F"},{category:"symbols",keyword:"white small square",code:"\u25AB\uFE0F"},{category:"symbols",keyword:"white medium square",code:"\u25FB\uFE0F"},{category:"symbols",keyword:"black medium square",code:"\u25FC\uFE0F"},{category:"symbols",keyword:"white medium-small square",code:"\u25FD"},{category:"symbols",keyword:"black medium-small square",code:"\u25FE"},{category:"symbols",keyword:"black large square",code:"\u2B1B"},{category:"symbols",keyword:"white large square",code:"\u2B1C"},{category:"symbols",keyword:"large orange diamond",code:"\uD83D\uDD36"},{category:"symbols",keyword:"large blue diamond",code:"\uD83D\uDD37"},{category:"symbols",keyword:"small orange diamond",code:"\uD83D\uDD38"},{category:"symbols",keyword:"small blue diamond",code:"\uD83D\uDD39"},{category:"symbols",keyword:"red triangle pointed up",code:"\uD83D\uDD3A"},{category:"symbols",keyword:"red triangle pointed down",code:"\uD83D\uDD3B"},{category:"symbols",keyword:"diamond with a dot",code:"\uD83D\uDCA0"},{category:"symbols",keyword:"radio button",code:"\uD83D\uDD18"},{category:"symbols",keyword:"black square button",code:"\uD83D\uDD32"},{category:"symbols",keyword:"white square button",code:"\uD83D\uDD33"},{category:"symbols",keyword:"white circle",code:"\u26AA"},{category:"symbols",keyword:"black circle",code:"\u26AB"},{category:"symbols",keyword:"red circle",code:"\uD83D\uDD34"},{category:"symbols",keyword:"blue circle",code:"\uD83D\uDD35"},{category:"flags",keyword:"chequered flag",code:"\uD83C\uDFC1"},{category:"flags",keyword:"triangular flag",code:"\uD83D\uDEA9"},{category:"flags",keyword:"crossed flags",code:"\uD83C\uDF8C"},{category:"flags",keyword:"black flag",code:"\uD83C\uDFF4"},{category:"flags",keyword:"white flag",code:"\uD83C\uDFF3\uFE0F"},{category:"flags",keyword:"rainbow flag",code:"\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08"},{category:"flags",keyword:"pirate flag",code:"\uD83C\uDFF4\u200D\u2620\uFE0F"},{category:"flags",keyword:"Ascension Island",code:"\uD83C\uDDE6\uD83C\uDDE8"},{category:"flags",keyword:"Andorra",code:"\uD83C\uDDE6\uD83C\uDDE9"},{category:"flags",keyword:"United Arab Emirates",code:"\uD83C\uDDE6\uD83C\uDDEA"},{category:"flags",keyword:"Afghanistan",code:"\uD83C\uDDE6\uD83C\uDDEB"},{category:"flags",keyword:"Antigua & Barbuda",code:"\uD83C\uDDE6\uD83C\uDDEC"},{category:"flags",keyword:"Anguilla",code:"\uD83C\uDDE6\uD83C\uDDEE"},{category:"flags",keyword:"Albania",code:"\uD83C\uDDE6\uD83C\uDDF1"},{category:"flags",keyword:"Armenia",code:"\uD83C\uDDE6\uD83C\uDDF2"},{category:"flags",keyword:"Angola",code:"\uD83C\uDDE6\uD83C\uDDF4"},{category:"flags",keyword:"Antarctica",code:"\uD83C\uDDE6\uD83C\uDDF6"},{category:"flags",keyword:"Argentina",code:"\uD83C\uDDE6\uD83C\uDDF7"},{category:"flags",keyword:"American Samoa",code:"\uD83C\uDDE6\uD83C\uDDF8"},{category:"flags",keyword:"Austria",code:"\uD83C\uDDE6\uD83C\uDDF9"},{category:"flags",keyword:"Australia",code:"\uD83C\uDDE6\uD83C\uDDFA"},{category:"flags",keyword:"Aruba",code:"\uD83C\uDDE6\uD83C\uDDFC"},{category:"flags",keyword:"\xC5land Islands",code:"\uD83C\uDDE6\uD83C\uDDFD"},{category:"flags",keyword:"Azerbaijan",code:"\uD83C\uDDE6\uD83C\uDDFF"},{category:"flags",keyword:"Bosnia & Herzegovina",code:"\uD83C\uDDE7\uD83C\uDDE6"},{category:"flags",keyword:"Barbados",code:"\uD83C\uDDE7\uD83C\uDDE7"},{category:"flags",keyword:"Bangladesh",code:"\uD83C\uDDE7\uD83C\uDDE9"},{category:"flags",keyword:"Belgium",code:"\uD83C\uDDE7\uD83C\uDDEA"},{category:"flags",keyword:"Burkina Faso",code:"\uD83C\uDDE7\uD83C\uDDEB"},{category:"flags",keyword:"Bulgaria",code:"\uD83C\uDDE7\uD83C\uDDEC"},{category:"flags",keyword:"Bahrain",code:"\uD83C\uDDE7\uD83C\uDDED"},{category:"flags",keyword:"Burundi",code:"\uD83C\uDDE7\uD83C\uDDEE"},{category:"flags",keyword:"Benin",code:"\uD83C\uDDE7\uD83C\uDDEF"},{category:"flags",keyword:"St. Barth\xE9lemy",code:"\uD83C\uDDE7\uD83C\uDDF1"},{category:"flags",keyword:"Bermuda",code:"\uD83C\uDDE7\uD83C\uDDF2"},{category:"flags",keyword:"Brunei",code:"\uD83C\uDDE7\uD83C\uDDF3"},{category:"flags",keyword:"Bolivia",code:"\uD83C\uDDE7\uD83C\uDDF4"},{category:"flags",keyword:"Caribbean Netherlands",code:"\uD83C\uDDE7\uD83C\uDDF6"},{category:"flags",keyword:"Brazil",code:"\uD83C\uDDE7\uD83C\uDDF7"},{category:"flags",keyword:"Bahamas",code:"\uD83C\uDDE7\uD83C\uDDF8"},{category:"flags",keyword:"Bhutan",code:"\uD83C\uDDE7\uD83C\uDDF9"},{category:"flags",keyword:"Bouvet Island",code:"\uD83C\uDDE7\uD83C\uDDFB"},{category:"flags",keyword:"Botswana",code:"\uD83C\uDDE7\uD83C\uDDFC"},{category:"flags",keyword:"Belarus",code:"\uD83C\uDDE7\uD83C\uDDFE"},{category:"flags",keyword:"Belize",code:"\uD83C\uDDE7\uD83C\uDDFF"},{category:"flags",keyword:"Canada",code:"\uD83C\uDDE8\uD83C\uDDE6"},{category:"flags",keyword:"Cocos (Keeling) Islands",code:"\uD83C\uDDE8\uD83C\uDDE8"},{category:"flags",keyword:"Congo - Kinshasa",code:"\uD83C\uDDE8\uD83C\uDDE9"},{category:"flags",keyword:"Central African Republic",code:"\uD83C\uDDE8\uD83C\uDDEB"},{category:"flags",keyword:"Congo - Brazzaville",code:"\uD83C\uDDE8\uD83C\uDDEC"},{category:"flags",keyword:"Switzerland",code:"\uD83C\uDDE8\uD83C\uDDED"},{category:"flags",keyword:"C\xF4te d\u2019Ivoire",code:"\uD83C\uDDE8\uD83C\uDDEE"},{category:"flags",keyword:"Cook Islands",code:"\uD83C\uDDE8\uD83C\uDDF0"},{category:"flags",keyword:"Chile",code:"\uD83C\uDDE8\uD83C\uDDF1"},{category:"flags",keyword:"Cameroon",code:"\uD83C\uDDE8\uD83C\uDDF2"},{category:"flags",keyword:"China",code:"\uD83C\uDDE8\uD83C\uDDF3"},{category:"flags",keyword:"Colombia",code:"\uD83C\uDDE8\uD83C\uDDF4"},{category:"flags",keyword:"Clipperton Island",code:"\uD83C\uDDE8\uD83C\uDDF5"},{category:"flags",keyword:"Costa Rica",code:"\uD83C\uDDE8\uD83C\uDDF7"},{category:"flags",keyword:"Cuba",code:"\uD83C\uDDE8\uD83C\uDDFA"},{category:"flags",keyword:"Cape Verde",code:"\uD83C\uDDE8\uD83C\uDDFB"},{category:"flags",keyword:"Cura\xE7ao",code:"\uD83C\uDDE8\uD83C\uDDFC"},{category:"flags",keyword:"Christmas Island",code:"\uD83C\uDDE8\uD83C\uDDFD"},{category:"flags",keyword:"Cyprus",code:"\uD83C\uDDE8\uD83C\uDDFE"},{category:"flags",keyword:"Czechia",code:"\uD83C\uDDE8\uD83C\uDDFF"},{category:"flags",keyword:"Germany",code:"\uD83C\uDDE9\uD83C\uDDEA"},{category:"flags",keyword:"Diego Garcia",code:"\uD83C\uDDE9\uD83C\uDDEC"},{category:"flags",keyword:"Djibouti",code:"\uD83C\uDDE9\uD83C\uDDEF"},{category:"flags",keyword:"Denmark",code:"\uD83C\uDDE9\uD83C\uDDF0"},{category:"flags",keyword:"Dominica",code:"\uD83C\uDDE9\uD83C\uDDF2"},{category:"flags",keyword:"Dominican Republic",code:"\uD83C\uDDE9\uD83C\uDDF4"},{category:"flags",keyword:"Algeria",code:"\uD83C\uDDE9\uD83C\uDDFF"},{category:"flags",keyword:"Ceuta & Melilla",code:"\uD83C\uDDEA\uD83C\uDDE6"},{category:"flags",keyword:"Ecuador",code:"\uD83C\uDDEA\uD83C\uDDE8"},{category:"flags",keyword:"Estonia",code:"\uD83C\uDDEA\uD83C\uDDEA"},{category:"flags",keyword:"Egypt",code:"\uD83C\uDDEA\uD83C\uDDEC"},{category:"flags",keyword:"Western Sahara",code:"\uD83C\uDDEA\uD83C\uDDED"},{category:"flags",keyword:"Eritrea",code:"\uD83C\uDDEA\uD83C\uDDF7"},{category:"flags",keyword:"Spain",code:"\uD83C\uDDEA\uD83C\uDDF8"},{category:"flags",keyword:"Ethiopia",code:"\uD83C\uDDEA\uD83C\uDDF9"},{category:"flags",keyword:"European Union",code:"\uD83C\uDDEA\uD83C\uDDFA"},{category:"flags",keyword:"Finland",code:"\uD83C\uDDEB\uD83C\uDDEE"},{category:"flags",keyword:"Fiji",code:"\uD83C\uDDEB\uD83C\uDDEF"},{category:"flags",keyword:"Falkland Islands",code:"\uD83C\uDDEB\uD83C\uDDF0"},{category:"flags",keyword:"Micronesia",code:"\uD83C\uDDEB\uD83C\uDDF2"},{category:"flags",keyword:"Faroe Islands",code:"\uD83C\uDDEB\uD83C\uDDF4"},{category:"flags",keyword:"France",code:"\uD83C\uDDEB\uD83C\uDDF7"},{category:"flags",keyword:"Gabon",code:"\uD83C\uDDEC\uD83C\uDDE6"},{category:"flags",keyword:"United Kingdom",code:"\uD83C\uDDEC\uD83C\uDDE7"},{category:"flags",keyword:"Grenada",code:"\uD83C\uDDEC\uD83C\uDDE9"},{category:"flags",keyword:"Georgia",code:"\uD83C\uDDEC\uD83C\uDDEA"},{category:"flags",keyword:"French Guiana",code:"\uD83C\uDDEC\uD83C\uDDEB"},{category:"flags",keyword:"Guernsey",code:"\uD83C\uDDEC\uD83C\uDDEC"},{category:"flags",keyword:"Ghana",code:"\uD83C\uDDEC\uD83C\uDDED"},{category:"flags",keyword:"Gibraltar",code:"\uD83C\uDDEC\uD83C\uDDEE"},{category:"flags",keyword:"Greenland",code:"\uD83C\uDDEC\uD83C\uDDF1"},{category:"flags",keyword:"Gambia",code:"\uD83C\uDDEC\uD83C\uDDF2"},{category:"flags",keyword:"Guinea",code:"\uD83C\uDDEC\uD83C\uDDF3"},{category:"flags",keyword:"Guadeloupe",code:"\uD83C\uDDEC\uD83C\uDDF5"},{category:"flags",keyword:"Equatorial Guinea",code:"\uD83C\uDDEC\uD83C\uDDF6"},{category:"flags",keyword:"Greece",code:"\uD83C\uDDEC\uD83C\uDDF7"},{category:"flags",keyword:"South Georgia & South Sandwich Islands",code:"\uD83C\uDDEC\uD83C\uDDF8"},{category:"flags",keyword:"Guatemala",code:"\uD83C\uDDEC\uD83C\uDDF9"},{category:"flags",keyword:"Guam",code:"\uD83C\uDDEC\uD83C\uDDFA"},{category:"flags",keyword:"Guinea-Bissau",code:"\uD83C\uDDEC\uD83C\uDDFC"},{category:"flags",keyword:"Guyana",code:"\uD83C\uDDEC\uD83C\uDDFE"},{category:"flags",keyword:"Hong Kong SAR China",code:"\uD83C\uDDED\uD83C\uDDF0"},{category:"flags",keyword:"Heard & McDonald Islands",code:"\uD83C\uDDED\uD83C\uDDF2"},{category:"flags",keyword:"Honduras",code:"\uD83C\uDDED\uD83C\uDDF3"},{category:"flags",keyword:"Croatia",code:"\uD83C\uDDED\uD83C\uDDF7"},{category:"flags",keyword:"Haiti",code:"\uD83C\uDDED\uD83C\uDDF9"},{category:"flags",keyword:"Hungary",code:"\uD83C\uDDED\uD83C\uDDFA"},{category:"flags",keyword:"Canary Islands",code:"\uD83C\uDDEE\uD83C\uDDE8"},{category:"flags",keyword:"Indonesia",code:"\uD83C\uDDEE\uD83C\uDDE9"},{category:"flags",keyword:"Ireland",code:"\uD83C\uDDEE\uD83C\uDDEA"},{category:"flags",keyword:"Israel",code:"\uD83C\uDDEE\uD83C\uDDF1"},{category:"flags",keyword:"Isle of Man",code:"\uD83C\uDDEE\uD83C\uDDF2"},{category:"flags",keyword:"India",code:"\uD83C\uDDEE\uD83C\uDDF3"},{category:"flags",keyword:"British Indian Ocean Territory",code:"\uD83C\uDDEE\uD83C\uDDF4"},{category:"flags",keyword:"Iraq",code:"\uD83C\uDDEE\uD83C\uDDF6"},{category:"flags",keyword:"Iran",code:"\uD83C\uDDEE\uD83C\uDDF7"},{category:"flags",keyword:"Iceland",code:"\uD83C\uDDEE\uD83C\uDDF8"},{category:"flags",keyword:"Italy",code:"\uD83C\uDDEE\uD83C\uDDF9"},{category:"flags",keyword:"Jersey",code:"\uD83C\uDDEF\uD83C\uDDEA"},{category:"flags",keyword:"Jamaica",code:"\uD83C\uDDEF\uD83C\uDDF2"},{category:"flags",keyword:"Jordan",code:"\uD83C\uDDEF\uD83C\uDDF4"},{category:"flags",keyword:"Japan",code:"\uD83C\uDDEF\uD83C\uDDF5"},{category:"flags",keyword:"Kenya",code:"\uD83C\uDDF0\uD83C\uDDEA"},{category:"flags",keyword:"Kyrgyzstan",code:"\uD83C\uDDF0\uD83C\uDDEC"},{category:"flags",keyword:"Cambodia",code:"\uD83C\uDDF0\uD83C\uDDED"},{category:"flags",keyword:"Kiribati",code:"\uD83C\uDDF0\uD83C\uDDEE"},{category:"flags",keyword:"Comoros",code:"\uD83C\uDDF0\uD83C\uDDF2"},{category:"flags",keyword:"St. Kitts & Nevis",code:"\uD83C\uDDF0\uD83C\uDDF3"},{category:"flags",keyword:"North Korea",code:"\uD83C\uDDF0\uD83C\uDDF5"},{category:"flags",keyword:"South Korea",code:"\uD83C\uDDF0\uD83C\uDDF7"},{category:"flags",keyword:"Kuwait",code:"\uD83C\uDDF0\uD83C\uDDFC"},{category:"flags",keyword:"Cayman Islands",code:"\uD83C\uDDF0\uD83C\uDDFE"},{category:"flags",keyword:"Kazakhstan",code:"\uD83C\uDDF0\uD83C\uDDFF"},{category:"flags",keyword:"Laos",code:"\uD83C\uDDF1\uD83C\uDDE6"},{category:"flags",keyword:"Lebanon",code:"\uD83C\uDDF1\uD83C\uDDE7"},{category:"flags",keyword:"St. Lucia",code:"\uD83C\uDDF1\uD83C\uDDE8"},{category:"flags",keyword:"Liechtenstein",code:"\uD83C\uDDF1\uD83C\uDDEE"},{category:"flags",keyword:"Sri Lanka",code:"\uD83C\uDDF1\uD83C\uDDF0"},{category:"flags",keyword:"Liberia",code:"\uD83C\uDDF1\uD83C\uDDF7"},{category:"flags",keyword:"Lesotho",code:"\uD83C\uDDF1\uD83C\uDDF8"},{category:"flags",keyword:"Lithuania",code:"\uD83C\uDDF1\uD83C\uDDF9"},{category:"flags",keyword:"Luxembourg",code:"\uD83C\uDDF1\uD83C\uDDFA"},{category:"flags",keyword:"Latvia",code:"\uD83C\uDDF1\uD83C\uDDFB"},{category:"flags",keyword:"Libya",code:"\uD83C\uDDF1\uD83C\uDDFE"},{category:"flags",keyword:"Morocco",code:"\uD83C\uDDF2\uD83C\uDDE6"},{category:"flags",keyword:"Monaco",code:"\uD83C\uDDF2\uD83C\uDDE8"},{category:"flags",keyword:"Moldova",code:"\uD83C\uDDF2\uD83C\uDDE9"},{category:"flags",keyword:"Montenegro",code:"\uD83C\uDDF2\uD83C\uDDEA"},{category:"flags",keyword:"St. Martin",code:"\uD83C\uDDF2\uD83C\uDDEB"},{category:"flags",keyword:"Madagascar",code:"\uD83C\uDDF2\uD83C\uDDEC"},{category:"flags",keyword:"Marshall Islands",code:"\uD83C\uDDF2\uD83C\uDDED"},{category:"flags",keyword:"Macedonia",code:"\uD83C\uDDF2\uD83C\uDDF0"},{category:"flags",keyword:"Mali",code:"\uD83C\uDDF2\uD83C\uDDF1"},{category:"flags",keyword:"Myanmar (Burma)",code:"\uD83C\uDDF2\uD83C\uDDF2"},{category:"flags",keyword:"Mongolia",code:"\uD83C\uDDF2\uD83C\uDDF3"},{category:"flags",keyword:"Macau SAR China",code:"\uD83C\uDDF2\uD83C\uDDF4"},{category:"flags",keyword:"Northern Mariana Islands",code:"\uD83C\uDDF2\uD83C\uDDF5"},{category:"flags",keyword:"Martinique",code:"\uD83C\uDDF2\uD83C\uDDF6"},{category:"flags",keyword:"Mauritania",code:"\uD83C\uDDF2\uD83C\uDDF7"},{category:"flags",keyword:"Montserrat",code:"\uD83C\uDDF2\uD83C\uDDF8"},{category:"flags",keyword:"Malta",code:"\uD83C\uDDF2\uD83C\uDDF9"},{category:"flags",keyword:"Mauritius",code:"\uD83C\uDDF2\uD83C\uDDFA"},{category:"flags",keyword:"Maldives",code:"\uD83C\uDDF2\uD83C\uDDFB"},{category:"flags",keyword:"Malawi",code:"\uD83C\uDDF2\uD83C\uDDFC"},{category:"flags",keyword:"Mexico",code:"\uD83C\uDDF2\uD83C\uDDFD"},{category:"flags",keyword:"Malaysia",code:"\uD83C\uDDF2\uD83C\uDDFE"},{category:"flags",keyword:"Mozambique",code:"\uD83C\uDDF2\uD83C\uDDFF"},{category:"flags",keyword:"Namibia",code:"\uD83C\uDDF3\uD83C\uDDE6"},{category:"flags",keyword:"New Caledonia",code:"\uD83C\uDDF3\uD83C\uDDE8"},{category:"flags",keyword:"Niger",code:"\uD83C\uDDF3\uD83C\uDDEA"},{category:"flags",keyword:"Norfolk Island",code:"\uD83C\uDDF3\uD83C\uDDEB"},{category:"flags",keyword:"Nigeria",code:"\uD83C\uDDF3\uD83C\uDDEC"},{category:"flags",keyword:"Nicaragua",code:"\uD83C\uDDF3\uD83C\uDDEE"},{category:"flags",keyword:"Netherlands",code:"\uD83C\uDDF3\uD83C\uDDF1"},{category:"flags",keyword:"Norway",code:"\uD83C\uDDF3\uD83C\uDDF4"},{category:"flags",keyword:"Nepal",code:"\uD83C\uDDF3\uD83C\uDDF5"},{category:"flags",keyword:"Nauru",code:"\uD83C\uDDF3\uD83C\uDDF7"},{category:"flags",keyword:"Niue",code:"\uD83C\uDDF3\uD83C\uDDFA"},{category:"flags",keyword:"New Zealand",code:"\uD83C\uDDF3\uD83C\uDDFF"},{category:"flags",keyword:"Oman",code:"\uD83C\uDDF4\uD83C\uDDF2"},{category:"flags",keyword:"Panama",code:"\uD83C\uDDF5\uD83C\uDDE6"},{category:"flags",keyword:"Peru",code:"\uD83C\uDDF5\uD83C\uDDEA"},{category:"flags",keyword:"French Polynesia",code:"\uD83C\uDDF5\uD83C\uDDEB"},{category:"flags",keyword:"Papua New Guinea",code:"\uD83C\uDDF5\uD83C\uDDEC"},{category:"flags",keyword:"Philippines",code:"\uD83C\uDDF5\uD83C\uDDED"},{category:"flags",keyword:"Pakistan",code:"\uD83C\uDDF5\uD83C\uDDF0"},{category:"flags",keyword:"Poland",code:"\uD83C\uDDF5\uD83C\uDDF1"},{category:"flags",keyword:"St. Pierre & Miquelon",code:"\uD83C\uDDF5\uD83C\uDDF2"},{category:"flags",keyword:"Pitcairn Islands",code:"\uD83C\uDDF5\uD83C\uDDF3"},{category:"flags",keyword:"Puerto Rico",code:"\uD83C\uDDF5\uD83C\uDDF7"},{category:"flags",keyword:"Palestinian Territories",code:"\uD83C\uDDF5\uD83C\uDDF8"},{category:"flags",keyword:"Portugal",code:"\uD83C\uDDF5\uD83C\uDDF9"},{category:"flags",keyword:"Palau",code:"\uD83C\uDDF5\uD83C\uDDFC"},{category:"flags",keyword:"Paraguay",code:"\uD83C\uDDF5\uD83C\uDDFE"},{category:"flags",keyword:"Qatar",code:"\uD83C\uDDF6\uD83C\uDDE6"},{category:"flags",keyword:"R\xE9union",code:"\uD83C\uDDF7\uD83C\uDDEA"},{category:"flags",keyword:"Romania",code:"\uD83C\uDDF7\uD83C\uDDF4"},{category:"flags",keyword:"Serbia",code:"\uD83C\uDDF7\uD83C\uDDF8"},{category:"flags",keyword:"Russia",code:"\uD83C\uDDF7\uD83C\uDDFA"},{category:"flags",keyword:"Rwanda",code:"\uD83C\uDDF7\uD83C\uDDFC"},{category:"flags",keyword:"Saudi Arabia",code:"\uD83C\uDDF8\uD83C\uDDE6"},{category:"flags",keyword:"Solomon Islands",code:"\uD83C\uDDF8\uD83C\uDDE7"},{category:"flags",keyword:"Seychelles",code:"\uD83C\uDDF8\uD83C\uDDE8"},{category:"flags",keyword:"Sudan",code:"\uD83C\uDDF8\uD83C\uDDE9"},{category:"flags",keyword:"Sweden",code:"\uD83C\uDDF8\uD83C\uDDEA"},{category:"flags",keyword:"Singapore",code:"\uD83C\uDDF8\uD83C\uDDEC"},{category:"flags",keyword:"St. Helena",code:"\uD83C\uDDF8\uD83C\uDDED"},{category:"flags",keyword:"Slovenia",code:"\uD83C\uDDF8\uD83C\uDDEE"},{category:"flags",keyword:"Svalbard & Jan Mayen",code:"\uD83C\uDDF8\uD83C\uDDEF"},{category:"flags",keyword:"Slovakia",code:"\uD83C\uDDF8\uD83C\uDDF0"},{category:"flags",keyword:"Sierra Leone",code:"\uD83C\uDDF8\uD83C\uDDF1"},{category:"flags",keyword:"San Marino",code:"\uD83C\uDDF8\uD83C\uDDF2"},{category:"flags",keyword:"Senegal",code:"\uD83C\uDDF8\uD83C\uDDF3"},{category:"flags",keyword:"Somalia",code:"\uD83C\uDDF8\uD83C\uDDF4"},{category:"flags",keyword:"Suriname",code:"\uD83C\uDDF8\uD83C\uDDF7"},{category:"flags",keyword:"South Sudan",code:"\uD83C\uDDF8\uD83C\uDDF8"},{category:"flags",keyword:"S\xE3o Tom\xE9 & Pr\xEDncipe",code:"\uD83C\uDDF8\uD83C\uDDF9"},{category:"flags",keyword:"El Salvador",code:"\uD83C\uDDF8\uD83C\uDDFB"},{category:"flags",keyword:"Sint Maarten",code:"\uD83C\uDDF8\uD83C\uDDFD"},{category:"flags",keyword:"Syria",code:"\uD83C\uDDF8\uD83C\uDDFE"},{category:"flags",keyword:"Swaziland",code:"\uD83C\uDDF8\uD83C\uDDFF"},{category:"flags",keyword:"Tristan da Cunha",code:"\uD83C\uDDF9\uD83C\uDDE6"},{category:"flags",keyword:"Turks & Caicos Islands",code:"\uD83C\uDDF9\uD83C\uDDE8"},{category:"flags",keyword:"Chad",code:"\uD83C\uDDF9\uD83C\uDDE9"},{category:"flags",keyword:"French Southern Territories",code:"\uD83C\uDDF9\uD83C\uDDEB"},{category:"flags",keyword:"Togo",code:"\uD83C\uDDF9\uD83C\uDDEC"},{category:"flags",keyword:"Thailand",code:"\uD83C\uDDF9\uD83C\uDDED"},{category:"flags",keyword:"Tajikistan",code:"\uD83C\uDDF9\uD83C\uDDEF"},{category:"flags",keyword:"Tokelau",code:"\uD83C\uDDF9\uD83C\uDDF0"},{category:"flags",keyword:"Timor-Leste",code:"\uD83C\uDDF9\uD83C\uDDF1"},{category:"flags",keyword:"Turkmenistan",code:"\uD83C\uDDF9\uD83C\uDDF2"},{category:"flags",keyword:"Tunisia",code:"\uD83C\uDDF9\uD83C\uDDF3"},{category:"flags",keyword:"Tonga",code:"\uD83C\uDDF9\uD83C\uDDF4"},{category:"flags",keyword:"Turkey",code:"\uD83C\uDDF9\uD83C\uDDF7"},{category:"flags",keyword:"Trinidad & Tobago",code:"\uD83C\uDDF9\uD83C\uDDF9"},{category:"flags",keyword:"Tuvalu",code:"\uD83C\uDDF9\uD83C\uDDFB"},{category:"flags",keyword:"Taiwan",code:"\uD83C\uDDF9\uD83C\uDDFC"},{category:"flags",keyword:"Tanzania",code:"\uD83C\uDDF9\uD83C\uDDFF"},{category:"flags",keyword:"Ukraine",code:"\uD83C\uDDFA\uD83C\uDDE6"},{category:"flags",keyword:"Uganda",code:"\uD83C\uDDFA\uD83C\uDDEC"},{category:"flags",keyword:"U.S. Outlying Islands",code:"\uD83C\uDDFA\uD83C\uDDF2"},{category:"flags",keyword:"United Nations",code:"\uD83C\uDDFA\uD83C\uDDF3"},{category:"flags",keyword:"United States",code:"\uD83C\uDDFA\uD83C\uDDF8"},{category:"flags",keyword:"Uruguay",code:"\uD83C\uDDFA\uD83C\uDDFE"},{category:"flags",keyword:"Uzbekistan",code:"\uD83C\uDDFA\uD83C\uDDFF"},{category:"flags",keyword:"Vatican City",code:"\uD83C\uDDFB\uD83C\uDDE6"},{category:"flags",keyword:"St. Vincent & Grenadines",code:"\uD83C\uDDFB\uD83C\uDDE8"},{category:"flags",keyword:"Venezuela",code:"\uD83C\uDDFB\uD83C\uDDEA"},{category:"flags",keyword:"British Virgin Islands",code:"\uD83C\uDDFB\uD83C\uDDEC"},{category:"flags",keyword:"U.S. Virgin Islands",code:"\uD83C\uDDFB\uD83C\uDDEE"},{category:"flags",keyword:"Vietnam",code:"\uD83C\uDDFB\uD83C\uDDF3"},{category:"flags",keyword:"Vanuatu",code:"\uD83C\uDDFB\uD83C\uDDFA"},{category:"flags",keyword:"Wallis & Futuna",code:"\uD83C\uDDFC\uD83C\uDDEB"},{category:"flags",keyword:"Samoa",code:"\uD83C\uDDFC\uD83C\uDDF8"},{category:"flags",keyword:"Kosovo",code:"\uD83C\uDDFD\uD83C\uDDF0"},{category:"flags",keyword:"Yemen",code:"\uD83C\uDDFE\uD83C\uDDEA"},{category:"flags",keyword:"Mayotte",code:"\uD83C\uDDFE\uD83C\uDDF9"},{category:"flags",keyword:"South Africa",code:"\uD83C\uDDFF\uD83C\uDDE6"},{category:"flags",keyword:"Zambia",code:"\uD83C\uDDFF\uD83C\uDDF2"},{category:"flags",keyword:"Zimbabwe",code:"\uD83C\uDDFF\uD83C\uDDFC"},{category:"flags",keyword:"England",code:"\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F"},{category:"flags",keyword:"Scotland",code:"\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F"},{category:"flags",keyword:"Wales",code:"\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73\uDB40\uDC7F"}],this._filterd=this._emojis,this._custom_emojis=[],this}},{key:"find",value:function r(e){var o=e.category||"all",n=e.tone||"default",d=e.keyword?new RegExp(e.keyword):void 0;return this._filterd=this._emojis.filter(function(r){return("all"===o||r.category===o)&&(!r.tone||r.tone===n)&&(!d||d.test(r.keyword))}),this}},{key:"add_custom_emojis",value:function d(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],o,n;return e=e.filter(function(o){return"undefined"!=typeof o.code}).map(function(o){return{category:"custom",keyword:o.keyword||o.code||"",code:o.code,payload:o.payload||void 0}}),(o=this._emojis).push.apply(o,_toConsumableArray(e)),(n=this._custom_emojis).push.apply(n,_toConsumableArray(e)),this}},{key:"toString",value:function e(){return this.filterd.map(function(o){return o.code}).join("")}},{key:"custom_emojis",get:function e(){return this._custom_emojis}},{key:"payload",get:function e(){return this.custom_emojis.map(function(o){return o.payload})}},{key:"filterd",get:function e(){return this._filterd}}]),e}();
"use strict";function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}(function(e){function n(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}function t(e,n){for(var t=[];0<n;t[--n]=e);return t.join("")}var o=function(){return o.cache.hasOwnProperty(arguments[0])||(o.cache[arguments[0]]=o.parse(arguments[0])),o.format.call(null,o.cache[arguments[0]],arguments)};o.format=function(e,r){var a=1,s=e.length,l="",d=[],c,p,m,h,u,g,f;for(p=0;p<s;p++)if(l=n(e[p]),"string"===l)d.push(e[p]);else if("array"===l){if(h=e[p],h[2])for(c=r[a],m=0;m<h[2].length;m++){if(!c.hasOwnProperty(h[2][m]))throw o("[sprintf] property \"%s\" does not exist",h[2][m]);c=c[h[2][m]]}else c=h[1]?r[h[1]]:r[a++];if(/[^s]/.test(h[8])&&"number"!==n(c))throw o("[sprintf] expecting number but found %s",n(c));switch(h[8]){case"b":c=c.toString(2);break;case"c":c=String.fromCharCode(c);break;case"d":c=parseInt(c,10);break;case"e":c=h[7]?c.toExponential(h[7]):c.toExponential();break;case"f":c=h[7]?parseFloat(c).toFixed(h[7]):parseFloat(c);break;case"o":c=c.toString(8);break;case"s":c=(c+="")&&h[7]?c.substring(0,h[7]):c;break;case"u":c>>>=0;break;case"x":c=c.toString(16);break;case"X":c=c.toString(16).toUpperCase();}c=/[def]/.test(h[8])&&h[3]&&0<=c?" +"+c:c,g=h[4]?"0"===h[4]?"0":h[4].charAt(1):" ",f=h[6]-(c+"").length,u=h[6]?t(g,f):"",d.push(h[5]?c+u:u+c)}return d.join("")},o.cache={},o.parse=function(e){for(var n=e,t=[],i=[],o=0;n;){if(null!==(t=/^[^\x25]+/.exec(n)))i.push(t[0]);else if(null!==(t=/^\x25{2}/.exec(n)))i.push("%");else if(null!==(t=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(n))){if(t[2]){o|=1;var r=[],a=t[2],s=[];if(null!==(s=/^([a-z_][a-z_\d]*)/i.exec(a))){for(r.push(s[1]);""!==(a=a.substring(s[0].length));)if(null!==(s=/^\.([a-z_][a-z_\d]*)/i.exec(a)))r.push(s[1]);else if(null!==(s=/^\[(\d+)\]/.exec(a)))r.push(s[1]);else throw"[sprintf] huh?";}else throw"[sprintf] huh?";t[2]=r}else o|=2;if(3===o)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";i.push(t)}else throw"[sprintf] huh?";n=n.substring(t[0].length)}return i};e.sprintf=o,e.vsprintf=function i(e,n,t){return t=n.slice(0),t.splice(0,0,e),o.apply(null,t)}})("undefined"==typeof global?window:global),function(e){var n="undefined"==typeof window?global:window;"function"==typeof define&&define.amd?define(["jquery","wcwidth"],e):"object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports?module.exports=function(n,t,i){return void 0===t&&(void 0===window?t=require("jquery")(n):t=require("jquery")),void 0===i&&(i=require("wcwidth")),e(t,i),t}:e(n.jQuery,n.wcwidth)}(function($,wcwidth,undefined){"use strict";function debug(){}function DelayQueue(){var e=$.Callbacks(),n=!1;this.resolve=function(){e.fire(),n=!0},this.add=function(t){n?t():e.add(t)}}function a11y_hide(e){e.attr({role:"presentation","aria-hidden":"true"})}function alert_exception(n,t){var e=(n?n+": ":"")+exception_message(t);-1===excepctions.indexOf(e)&&(excepctions.push(e),alert(e+(t.stack?"\n"+t.stack:"")))}function scrollbar_event(n,e){var t=e.offset().left;return e.outerWidth()<=n.clientX-t}function exception_message(n){return"string"==typeof n?n:"string"==typeof n.fileName?n.fileName+": "+n.message:n.message}function Cycle(){var e=[].slice.call(arguments),n=0;$.extend(this,{get:function n(){return e},index:function e(){return n},rotate:function o(t){if(!t){var i=e.filter(function(e){return"undefined"!=typeof e});if(!i.length)return}return e.length?1===e.length?e[0]:(n===e.length-1?n=0:++n,"undefined"==typeof e[n]?this.rotate(!0):e[n]):void 0},length:function n(){return e.length},remove:function t(n){delete e[n]},set:function r(t){for(var o=e.length;o--;)if(e[o]===t)return void(n=o);this.append(t),n=e.length-1},front:function o(){if(e.length){for(var t=n,i=!1;!e[t];)if(t++,t>e.length){if(i)break;t=0,i=!0}return e[t]}},map:function t(n){return e.map(function(e,t){return"undefined"==typeof e?null:n(e,t)}).filter(Boolean)},forEach:function t(n){return e.forEach(function(e,t){"undefined"!=typeof e&&n(e,t)})},append:function t(n){e.push(n)}})}function Stack(e){var n=e instanceof Array?e:e?[e]:[];$.extend(this,{data:function e(){return n},map:function t(e){return $.map(n,e)},size:function e(){return n.length},pop:function t(){if(0===n.length)return null;var e=n[n.length-1];return n=n.slice(0,n.length-1),e},push:function t(e){return n=n.concat([e]),e},top:function e(){return 0<n.length?n[n.length-1]:null},clone:function(){return new Stack(n.slice(0))}})}function History(e,n,t){var i=!0,o="";"string"==typeof e&&""!==e&&(o=e+"_"),o+="commands";var r;t?r=[]:(r=$.Storage.get(o),r=r?JSON.parse(r):[]);var a=r.length-1;$.extend(this,{append:function s(e){i&&r[r.length-1]!==e&&(r.push(e),n&&r.length>n&&(r=r.slice(-n)),a=r.length-1,!t&&$.Storage.set(o,JSON.stringify(r)))},set:function n(e){e instanceof Array&&(r=e,!t&&$.Storage.set(o,JSON.stringify(r)))},data:function e(){return r},reset:function e(){a=r.length-1},last:function e(){return r[r.length-1]},end:function e(){return a==r.length-1},position:function e(){return a},current:function e(){return r[a]},next:function n(){var e=a;if(a<r.length-1&&++a,e!=a)return r[a]},previous:function n(){var e=a;if(0<a&&--a,e!=a)return r[a]},clear:function e(){r=[],this.purge()},enabled:function e(){return i},enable:function e(){i=!0},purge:function e(){t||$.Storage.remove(o)},disable:function e(){i=!1},toggle:function n(e){i="undefined"==typeof e?!i:e}})}function bare_text(e){return e.match(/&/)?$("<span>"+safe(e)+"</span>").text():e}function text(e){return bare_text($.terminal.strip(e))}function safe(e){return e.match(/[<>&]/)?e.replace(/&(?![^;]+;)/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;"):e}function crlf(e){return e.replace(/\r/g,"")}function get_next_character(e){var n=e.match(emoji_re);if(n)return n[1];if(1===e.substring(0,2).replace(astral_symbols_re,"_"))return e.substring(1).match(combine_chr_re)?e.substring(0,3):e.substring(0,2);var t=e.match(combine_chr_re);return t?t[1]:e[0]}function normalize_position(e,n){if(0===n)return n;e=$.terminal.strip(e);var t=$.terminal.split_characters(e).reduce(function(e,t){if("number"==typeof e)return e;var i=e.length+t.length;return i>=n?e.position+1:{position:e.position+1,length:i}},{position:0,length:0});return"number"==typeof t?t:t.position}function char_width_prop(e,n){if(is_ch_unit_supported)return"width: "+e+"ch";if(!!is_css_variables_supported)return"--length: "+e;return n.char_width?"width: "+n.char_width*e+"px":""}function extra_css(e,n){if("undefined"!=typeof wcwidth){var t=bare_text(e),i=strlen(t);if(i!==$.terminal.length(t))return char_width_prop(i,n)}return""}function wide_characters(e,n){if("undefined"!=typeof wcwidth){var t=bare_text(e),i=$.terminal.split_characters(t);if(1===i.length)return e;var o=i.map(function(e){return{len:strlen(e),chr:e}}).reduce(function(e,n){var t=e[e.length-1];return t?t.len===n.len?(e.pop(),e.concat([{sum:t.sum+n.len,len:t.len,str:t.str+n.chr}])):e.concat([{sum:n.len,len:n.len,str:n.chr}]):[{sum:n.len,str:n.chr,len:n.len}]},[]);return o.map(function(e){if(1===e.len)return e.str;var t=char_width_prop(e.sum,n);return e.sum!==i.length&&t.length?"<span style=\""+t+"\">"+e.str+"</span>":"<span>"+e.str+"</span>"}).join("")}return e}function binary_search(e,n,t,i){var o=n-e,r=e+_Mathfloor(o/2),a=i(t,r);return 0===a?r:0<a&&1<o?binary_search(r,n,t,i):0>a&&1<o?binary_search(e,r,t,i):-1}function text_to_clipboard(e,n){var t=$("<div>"+n.replace(/\n/,"<br/>")+"<div>");t.appendTo("body"),select_all(t[0]);try{document.execCommand("copy")}catch(n){}t.remove()}function clear_textarea_selection(e){e.selectionStart=e.selectionEnd=0}function common_string(e,n,t){if(!n.length)return"";for(var o=string_case(e),r=[],a=e.length;a<n[0].length;++a){for(var s=!1,l=n[0].charAt(a),d=l.toLowerCase(),c=1;c<n.length;++c){s=!0;var p=n[c].charAt(a),m=p.toLowerCase();if(l!==p)if(t||"mixed"===o){s=!1;break}else if(d!==m){s=!1;break}else if("lower"===o)l=l.toLowerCase();else if("upper"===o)l=l.toUpperCase();else{s=!1;break}}if(s)r.push(l);else break}return e+r.join("")}function trigger_terminal_change(e){terminals.forEach(function(n){n.settings().onTerminalChange.call(n,e)})}function select_all(e){if(window.getSelection){var n=window.getSelection();if(n.setBaseAndExtent)n.setBaseAndExtent(e,0,e,1);else if(document.createRange){var t=document.createRange();t.selectNodeContents(e),n.removeAllRanges(),n.addRange(t)}}}function process_command(e,n){var t=e.match(command_re)||[];if(t.length){var i=t.shift(),o=$.map(t,function(e){return e.match(/^["']/)?(e=e.replace(/\n/g,"\\u0000\\u0000\\u0000\\u0000"),e=n(e),e.replace(/\x00\x00\x00\x00/g,"\n")):n(e)}),r=$.map(t,function(e){var n=e.match(/^(['"]).*\1$/);return n&&n[1]||""}),a=e.substring(i.length).trim();return{command:e,name:i,args:o,args_quotes:r,rest:a}}return{command:e,name:"",args:[],args_quotes:r,rest:""}}function warn(e){e="[jQuery Terminal] "+e,-1===warnings.indexOf(e)&&(warnings.push(e),console?console.warn?console.warn(e):console.log&&console.log(e):setTimeout(function(){throw new Error("WARN: "+e)},0))}function get_char_size(e){var n=$("<div class=\"terminal temp\"><div class=\"terminal-output\"><div><div class=\"line\" style=\"float: left\"><span>&nbsp;</span></div></div></div></div>").appendTo("body");if(n.addClass(e.attr("class")),e){var t=e.attr("style");t&&(t=t.split(/\s*;\s*/).filter(function(e){return!e.match(/display\s*:\s*none/i)}).join(";"),n.attr("style",t))}var i=n.find(".line")[0].getBoundingClientRect(),o={width:i.width,height:i.height};return n.remove(),o}function get_num_chars(e,n){var t=e.find(".terminal-fill").width(),i=_Mathfloor(t/n.width);return i||1e3}function get_num_rows(e,n){return _Mathfloor(e.find(".terminal-fill").height()/n.height)}function all(e,n){var t=e.filter(function(e){return e[n]()===e});return t.length===e.length}function string_case(e){var n=e.split("");return all(n,"toLowerCase")?"lower":all(n,"toUpperCase")?"upper":"mixed"}function same_case(e){return"mixed"!==string_case(e)}function is_function(e){return"function"===get_type(e)}function get_type(e){return"function"==typeof e?"function":$.type(e)}var _Mathmax=Math.max,_Mathfloor=Math.floor,_StringfromCharCode=String.fromCharCode;$.omap=function(e,n){var t={};return $.each(e,function(i,o){t[i]=n.call(e,i,o)}),t},$.fn.text_length=function(){return this.map(function(){return $(this).text().length}).get().reduce(function(e,n){return e+n},0)};var Clone={clone_object:function i(e){var n={};if("object"===_typeof(e)){if($.isArray(e))return this.clone_array(e);if(null===e)return e;for(var t in e)n[t]=$.isArray(e[t])?this.clone_array(e[t]):"object"===_typeof(e[t])?this.clone_object(e[t]):e[t]}return n},clone_array:function n(e){if(!is_function(Array.prototype.map))throw new Error("Your browser don't support ES5 array map use es5-shim");return e.slice(0).map(function(e){return"object"===_typeof(e)?this.clone_object(e):e}.bind(this))}},clone=function(e){return Clone.clone_object(e)},localStorage;(function(){function e(e,n){if("string"==typeof e&&"string"==typeof n)return localStorage[e]=n,!0;if("object"===_typeof(e)&&"undefined"==typeof n){for(var t in e)e.hasOwnProperty(t)&&(localStorage[t]=e[t]);return!0}return!1}function t(t,n){var i,o,r;if(i=new Date,i.setTime(i.getTime()+31536e6),o="; expires="+i.toGMTString(),"string"==typeof t&&"string"==typeof n)return document.cookie=t+"="+n+o+"; path=/",!0;if("object"===_typeof(t)&&"undefined"==typeof n){for(r in t)t.hasOwnProperty(r)&&(document.cookie=r+"="+t[r]+o+"; path=/");return!0}return!1}function n(e){return localStorage[e]}function i(e){return delete localStorage[e]}var o=function n(){try{var e=window.localStorage;return e.setItem("test","1"),e.removeItem("test"),!0}catch(e){return!1}}();(function e(){try{return document.cookie.split(";"),!0}catch(n){return!1}})()||o?(o&&(localStorage=window.localStorage),$.extend({Storage:{set:o?e:t,get:o?n:function(e){var n,t,o,r;for(n=e+"=",t=document.cookie.split(";"),o=0;o<t.length;o++){for(r=t[o];" "===r.charAt(0);)r=r.substring(1,r.length);if(0===r.indexOf(n))return r.substring(n.length,r.length)}return null},remove:o?i:function(e){return t(e,"",-1)}}})):(localStorage={},$.extend({Storage:{set:e,get:n,remove:i}}))})();var jQuery=$;(function(e){jQuery.fn.extend({everyTime:function r(e,n,t,i,o){return this.each(function(){jQuery.timer.add(this,e,n,t,i,o)})},oneTime:function i(e,n,t){return this.each(function(){jQuery.timer.add(this,e,n,t,1)})},stopTime:function t(e,n){return this.each(function(){jQuery.timer.remove(this,e,n)})}}),jQuery.extend({timer:{guid:1,global:{},regex:/^([0-9]+)\s*(.*s)?$/,powers:{ms:1,cs:10,ds:100,s:1e3,das:1e4,hs:1e5,ks:1e6},timeParse:function o(e){if(e===void 0||null===e)return null;var n=this.regex.exec(jQuery.trim(e.toString()));if(n[2]){var t=parseInt(n[1],10),i=this.powers[n[2]]||1;return t*i}return e},add:function l(e,n,t,i,o,r){var a=0;if(jQuery.isFunction(t)&&(!o&&(o=i),i=t,t=n),n=jQuery.timer.timeParse(n),!("number"!=typeof n||isNaN(n)||0>=n)){o&&o.constructor!==Number&&(r=!!o,o=0),o=o||0,r=r||!1,e.$timers||(e.$timers={}),e.$timers[t]||(e.$timers[t]={}),i.$timerID=i.$timerID||this.guid++;var s=function(){r&&s.inProgress||(s.inProgress=!0,(++a>o&&0!==o||!1===i.call(e,a))&&jQuery.timer.remove(e,t,i),s.inProgress=!1)};s.$timerID=i.$timerID,e.$timers[t][i.$timerID]||(e.$timers[t][i.$timerID]=window.setInterval(s,n)),this.global[t]||(this.global[t]=[]),this.global[t].push(e)}},remove:function s(e,n,t){var i=e.$timers,o;if(i){if(!n)for(var r in i)i.hasOwnProperty(r)&&this.remove(e,r,t);else if(i[n]){if(t)t.$timerID&&(window.clearInterval(i[n][t.$timerID]),delete i[n][t.$timerID]);else for(var a in i[n])i[n].hasOwnProperty(a)&&(window.clearInterval(i[n][a]),delete i[n][a]);for(o in i[n])if(i[n].hasOwnProperty(o))break;o||(o=null,delete i[n])}for(o in i)if(i.hasOwnProperty(o))break;o||(e.$timers=null)}}}}),/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase())&&e(window).one("unload",function(){var e=jQuery.timer.global;for(var n in e)if(e.hasOwnProperty(n))for(var t=e[n],o=t.length;--o;)jQuery.timer.remove(t[o],n)})})(jQuery),function(e){var n=String.prototype;if(n.split.toString().match(/\[native/)){var t=n.split,i=/()??/.exec("")[1]===e,o;return o=function(n,o,r){if("[object RegExp]"!==Object.prototype.toString.call(o))return t.call(n,o,r);var a=[],s=(o.ignoreCase?"i":"")+(o.multiline?"m":"")+(o.extended?"x":"")+(o.sticky?"y":""),l=0,d,c,p,m;for(o=new RegExp(o.source,s+"g"),n+="",i||(d=new RegExp("^"+o.source+"$(?!\\s)",s)),r=r===e?4294967295:r>>>0;(c=o.exec(n))&&(p=c.index+c[0].length,!(p>l&&(a.push(n.slice(l,c.index)),!i&&1<c.length&&c[0].replace(d,function(){for(var n=1;n<arguments.length-2;n++)arguments[n]===e&&(c[n]=e)}),1<c.length&&c.index<n.length&&Array.prototype.push.apply(a,c.slice(1)),m=c[0].length,l=p,a.length>=r)));)o.lastIndex===c.index&&o.lastIndex++;return l===n.length?(m||!o.test(""))&&a.push(""):a.push(n.slice(l)),a.length>r?a.slice(0,r):a},n.split=function(e,n){return o(this,e,n)},o}}(),$.fn.caret=function(e){var n=this[0],t="true"===n.contentEditable;if(0===arguments.length){if(window.getSelection){if(t){n.focus();var i=window.getSelection().getRangeAt(0),o=i.cloneRange();return o.selectNodeContents(n),o.setEnd(i.endContainer,i.endOffset),o.toString().length}return n.selectionStart}if(document.selection){if(n.focus(),t){var i=document.selection.createRange(),o=document.body.createTextRange();return o.moveToElementText(n),o.setEndPoint("EndToEnd",i),o.text.length}var e=0,r=n.createTextRange(),o=document.selection.createRange().duplicate(),a=o.getBookmark();for(r.moveToBookmark(a);0!==r.moveStart("character",-1);)e++;return e}return 0}if(-1===e&&(e=this[t?"text":"val"]().length),window.getSelection)t?(n.focus(),window.getSelection().collapse(n.firstChild,e)):n.setSelectionRange(e,e);else if(document.body.createTextRange){var r=document.body.createTextRange();r.moveToElementText(n),r.moveStart("character",e),r.collapse(!0),r.select()}return t||this.is(":focus")||n.focus(),e},$.fn.resizer=function(e){var n="unbind"===arguments[0];if(!n&&!is_function(e))throw new Error("Invalid argument, it need to a function or string \"unbind\".");return n&&(e=is_function(arguments[1])?arguments[1]:null),this.each(function(){function t(){r.fire()}var i=$(this),o,r;if(n){if(r=i.data("callbacks"),e&&r?(r.remove(e),!r.has()&&(r=null)):r=null,!r)if(i.removeData("callbacks"),window.ResizeObserver){var a=i.data("observer");a&&(a.unobserve(this),i.removeData("observer"))}else o=i.find("> iframe"),o.length?($(o[0].contentWindow).off("resize").remove(),o.remove()):i.is("body")&&$(window).off("resize.resizer");}else if(i.data("callbacks"))$(this).data("callbacks").add(e);else{r=$.Callbacks(),r.add(e),i.data("callbacks",r);var s=!0,l;window.ResizeObserver?(l=new ResizeObserver(function(){s||t(),s=!1}),l.observe(this),i.data("observer",l)):i.is("body")?$(window).on("resize.resizer",t):(o=$("<iframe/>").addClass("resizer").appendTo(this)[0],$(o.contentWindow).on("resize",t))}})};var excepctions=[],cmd_index=0;$.cmd={defaults:{mask:!1,caseSensitiveSearch:!0,historySize:60,prompt:"> ",enabled:!0,history:!0,onPositionChange:$.noop,onCommandChange:$.noop,clickTimeout:200,holdTimeout:400,holdRepeatTimeout:200,tabs:4}},$.fn.cmd=function(e){function n(n){var e=$(n.target);if(e.is("span"))return e=e.closest("[data-text]"),e.index()+e.parent("span").prevAll().find("[data-text]").length+e.closest("[role=\"presentation\"]").prevUntil(".prompt").find("[data-text]").length;if(e.is("div[role=\"presentation\"]")){var t=!e.nextUntil("textarea").length;return e.find("span[data-text]").length+e.prevUntil(".prompt").find("span[data-text]").length-(t?0:1)}}function t(n){if(n.key){var e=n.key.toUpperCase();if(ee[e]&&(e=ee[e]),"CONTROL"===e)return"CTRL";var t=[];return n.ctrlKey&&t.push("CTRL"),n.metaKey&&"META"!==e&&t.push("META"),n.shiftKey&&"SHIFT"!==e&&t.push("SHIFT"),n.altKey&&"ALT"!==e&&t.push("ALT"),t.length&&" "===e&&(e="SPACEBAR"),n.key&&t.push(e),t.join("+")}}function i(e){return function(){var n=/ *[^ ]+ *(?= )|[^ ]+$/,t=G.slice(V),i=t.match(n);return i&&(J=i[0],e&&text_to_clipboard(H,J)),H.set(G.slice(0,V)+G.slice(V).replace(n,""),!0),!1}}function o(e){return function(){if(""!==G&&0!==V){var n=G.slice(0,V).match(/([^ ]+ *$)/);n[0].length&&(J=H["delete"](-n[0].length),e&&text_to_clipboard(H,J))}return!1}}function r(){return!0}function a(){return W.val(""),Z=0,H.isenabled()&&!W.is(":focus")&&W.trigger("focus",[!0]),W.one("input",A),!0}function s(){return ye?(se=G,H.set(pe.current())):H.set(pe.previous()),ye=!1,!1}function l(){return H.set(pe.end()?se:pe.next()),!1}function d(){K?(q=q.slice(0,-1),b()):""!==G&&0<V&&H["delete"](-1),H.oneTime(1,function(){Ce=!0})}function c(){0<V&&(H.position(-1,!0),fe())}function p(){return V<G.length&&H.position(1,!0),!1}function m(){H.position(0)}function h(){H.position(G.length)}function u(){var e=W.is(":focus");de?(!e,H.oneTime(10,function(){W.is(":focus")||de})):e&&(is_mobile||!de)&&W.trigger("blur",[!0])}function g(){if(animation_supported){var e=window.getComputedStyle(Q[0]),n=e.getPropertyValue("--animation");n=n.replace(/^\s*|\s*$/g,"");var t=H.attr("class");if(t.match(/-animation/)&&(t=t.replace(/[a-z]+-animation/g,"")),n&&!n.match(/blink/)){var i=n.replace(/terminal-/,"")+"-animation";t.match(i)||(t+=" "+i)}t!==H.attr("class")&&H.attr("class",t)}}function f(e){H.isenabled()&&H.oneTime(10,function(){W.val()===G||e||W.val(" "+G),de&&H.oneTime(10,function(){try{W.caret()!==V+1&&W.caret(V+1)}catch(n){}})})}function _(){Q.toggleClass("inverted")}function b(){le="(reverse-i-search)`"+q+"': ",be()}function y(){le=ae,K=!1,Y=null,q=""}function k(e){var n=pe.data(),t=n.length,o,r;if(e&&0<Y&&(t-=Y),0<q.length)for(var a=q.length;0<a;a--){r=$.terminal.escape_regex(q.substring(0,a)),o=N.caseSensitiveSearch?new RegExp(r):new RegExp(r,"i");for(var s=t;s--;)if(o.test(n[s]))return Y=n.length-s,H.position(n[s].indexOf(r)),H.set(n[s],!0),fe(),void(q.length!==a&&(q=q.substring(0,a),b()))}q=""}function x(){var e=H.find(".prompt").html("<span>&nbsp;</span>"),n=H.width(),t=e.find("span")[0].getBoundingClientRect().width;te=_Mathfloor(n/t)}function v(e){function n(e){return $.terminal.split_equal(e,te)}function t(e){return e.filter(function(e){return!$.terminal.strip(e).match(/^ $/)})}var o=M.find(".line"),r;r=o.length?o.nextUntil(".line").text():M.text(),r=$.terminal.escape_brackets(r);var a=new RegExp("^"+$.terminal.escape_regex(r)),s;if(e.match(/\n/)){for(var l=e.split("\n"),d=te-re-1,c=0;c<l.length-1;++c)l[c]+=" ";for(strlen(l[0])>d?(s=n(r+l[0]),s[0]=s[0].replace(a,""),s=t(s)):s=[l[0]],c=1;c<l.length;++c)if(strlen(l[c])>te){var p=n(l[c]);c<l.length-1&&(p=t(p)),s=s.concat(p)}else s.push(l[c])}else s=n(r+e,te),s[0]=s[0].replace(a,"");return 1<s.length&&s[s.length-1].length===te&&s.push(""),s}function w(n,e){try{n=$.terminal.escape_formatting(n);var t=$.extend({},N,{unixFormattingEscapeBrackets:!0,position:V}),i=$.terminal.apply_formatters(n,t);n=i[0],e||(X=i[1]),n=$.terminal.normalize(n);var o=$.terminal.length(n);return X>o&&(X=o),n}catch(t){return alert_exception("[Formatting]",t.stack),n}}function T(e,n){var t=$.terminal.encode(C(e),{tabs:N.tabs,before:n});e=$.terminal.format(t,{char_width:N.char_width});var i=/(<span[^>]+data-text[^>]+>)(.*?)(<\/span>)/g;return e.replace(i,"$1<span>$2</span>$3")}function C(e){function n(e){return $.terminal.is_formatting(e)?e.match(/\]\\\]/)&&(e=e.replace(/\]\\\]/g,"]\\\\]")):(e.match(/\\$/)&&(e+="\\"),e="[[;;]"+e+"]"),e}var t=E(e);if(1===t)return n(e);for(var o=[],r=0,a;r<t;++r)a=$.terminal.substring(e,r,r+1),o.push(n(a));return o.join("")}function E(e){return $.terminal.length(e)}function R(e,n,t){return $.terminal.substring(e,n,t)}function A(){0<Z++||H.isenabled()&&H.oneTime(100,function(){H.insert(W.val()),W.val(G),f()})}function S(){is_function(N.onCommandChange)&&N.onCommandChange.call(H,G)}function L(n){return"BACKSPACE"===n.key.toUpperCase()||8===n.which}function j(n){return n.key&&1===n.key.length&&!n.ctrlKey}function O(n){return 35===n.which||36===n.which||37===n.which||38===n.which||39===n.which||40===n.which||13===n.which||27===n.which}function P(n){debug("keydown \""+n.key+"\" "+n.fake+" "+n.which),Re="process"===(n.key||"").toLowerCase()||0===n.which;var e;xe=we&&ve&&!L(n);try{n.fake||(ve=j(n),Te="unidentified"===(n.key+"").toLowerCase(),Ee=L(n))}catch(e){}if("Unidentified"===n.key)return void(Ce=!0);n.fake||(we=!0,Ce=!1),W.off("input",A);var i=t(n);if(is_function(N.keydown)&&(e=N.keydown.call(H,n),void 0!==e))return e||(Oe=!0),e;if(de){if(H.oneTime(N.holdTimeout,"hold",function(){Ae=!0}),Ae){if(i="HOLD+"+i,Se)return;0<N.holdRepeatTimeout&&(Se=!0,H.oneTime(N.holdRepeatTimeout,"delay",function(){Se=!1}))}if(he(),Oe=-1!==["CTRL+V","META+V"].indexOf(i),38===n.which||80===n.which&&n.ctrlKey||(ye=!0),K&&O(n))y(),be(),27===n.which&&H.set(""),fe(),13===n.which&&P.call(this,n);else if(is_function(ue[i])){if(e=ue[i](n),!0===e)return;if(void 0!==e)return e}else return n.altKey?void 0:void(ke=!1)}}function I(){H.stopTime("hold"),Se=Ae=!1}function z(n){debug("keypress \""+n.key+"\" "+n.fake),I();var e;if((n.fake||(we=!1),!((n.ctrlKey||n.metaKey)&&!n.altKey))&&!ke){if(is_function(N.keypress)&&(e=N.keypress.call(H,n),void 0!==e))return e||(Oe=!0),e;if(de){if(n.fake)return;var t;if(is_key_native||n.fake){t=n.key;var i=t.toUpperCase();ee[i]&&(t=ee[i])}if((!t||Te)&&(t=_StringfromCharCode(n.which)),-1<$.inArray(n.which,[13,0,8]))return 123===n.keyCode&&void 0;t&&(!n.ctrlKey||n.ctrlKey&&n.ctrlKey)&&(!(n.altKey&&100===n.which)||n.altKey)&&!xe&&(K?(q+=t,k(),b()):1===t.length&&H.insert(t))}}}function F(e,n,t){var i=$.Event(e);i.which=t,i.key=n,i.fake=!0,je.trigger(i)}function D(){debug("input "+Ce+" || "+Re+" (("+we+" || "+xe+") && !"+Oe+" && ("+ve+" || "+Te+") && !"+Ee+")");var e=W.val().replace(/^ /,"");if((Ce||Re||(we||xe)&&!Oe&&(ve||Te)&&!Ee)&&e!==G){var n=V;if(Ce){var t=Le;Ee=t.substring(0,t.length-1).length===e.length}if(K)q=e,k(),b();else{var i=e.substring(V);if(1===i.length||Ee){if(Ce){var o;o=Ee?8:i.toUpperCase().charCodeAt(0),F("keydown",Ee?"Backspace":i,o)}we&&!Ee&&F("keypress",i,i.charCodeAt(0))}if(Ee)return void(Le=G);if(Oe)return void(Oe=!1);H.set(e)}Ee?H.position(n-1):H.position(n+Math.abs(e.length-Le.length))}Le=G,Oe=!1,Ce=!0}var N=$.extend({},$.cmd.defaults,e),H=this,U=H.data("cmd");if(U)return U;var B=cmd_index++;H.addClass("cmd"),H.append("<span class=\"prompt\"></span>"),H.append("<div class=\"cursor-line\"><span></span><span class=\"cursor\">&nbsp;</span><span></span></div>"),a11y_hide(H.find(".cursor-line"));var W=$("<textarea>").attr({autocapitalize:"off",spellcheck:"false",tabindex:1}).addClass("clipboard").appendTo(H).val(" ");N.width&&H.width(N.width);var M=H.find(".prompt"),K=!1,q="",Y=null,G="",J="",V=0,X=0,Q=H.find(".cursor"),Z=0,ee={SPACEBAR:" ",UP:"ARROWUP",DOWN:"ARROWDOWN",LEFT:"ARROWLEFT",RIGHT:"ARROWRIGHT",DEL:"DELETE",MULTIPLY:"*",DIVIDE:"/",SUBTRACT:"-",ADD:"+"},ne={"ALT+D":i(!0),"HOLD+DELETE":i(!1),"HOLD+SHIFT+DELETE":i(!1),ENTER:function n(){(pe&&G&&!N.mask&&is_function(N.historyFilter)&&N.historyFilter(G)||N.historyFilter instanceof RegExp&&G.match(N.historyFilter)||!N.historyFilter)&&pe.append(G);var e=G;return pe.reset(),Le="",Ce=!0,H.set(""),N.commands&&N.commands.call(H,e),is_function(le)&&be(),W.val(""),!1},"SHIFT+ENTER":function e(){return H.insert("\n"),!0},BACKSPACE:d,"SHIFT+BACKSPACE":d,TAB:function e(){H.insert("\t")},"CTRL+D":function e(){return H["delete"](1),!1},DELETE:function e(){return H["delete"](1),!0},ARROWUP:s,"CTRL+P":s,ARROWDOWN:l,"CTRL+N":l,ARROWLEFT:c,"HOLD+ARROWLEFT":c,"CTRL+B":c,"CTRL+ARROWLEFT":function o(){var e=V-1,n=0;" "===G[e]&&--e;for(var t=e;0<t;--t)if(" "===G[t]&&" "!==G[t+1]){n=t+1;break}else if("\n"===G[t]&&"\n"!==G[t+1]){n=t;break}H.position(n)},"CTRL+R":function e(){return K?k(!0):(ae=le,b(),se=G,H.set(""),fe(),K=!0),!1},"CTRL+G":function e(){if(K)return le=ae,be(),H.set(se),fe(),K=!1,q="",!1},ARROWRIGHT:p,"HOLD+ARROWRIGHT":p,"CTRL+F":p,"CTRL+ARROWRIGHT":function t(){" "===G[V]&&++V;var e=/\S[\n\s]{2,}|[\n\s]+\S?/,n=G.slice(V).match(e);!n||n[0].match(/^\s+$/)?H.position(G.length):" "===n[0][0]?(V+=n.index+n[0].length-1," "!==n[0][n[0].length-1]&&--V):V+=n.index+1,fe()},F12:r,END:h,"CTRL+E":h,HOME:m,"CTRL+A":m,"SHIFT+INSERT":a,"CTRL+SHIFT+T":r,"CTRL+W":o(!0),"HOLD+BACKSPACE":o(!1),"HOLD+SHIFT+BACKSPACE":o(!1),"CTRL+H":function e(){return""!==G&&0<V&&H["delete"](-1),!1},"CTRL+X":r,"CTRL+C":r,"CTRL+T":r,"CTRL+Y":function e(){""!==J&&H.insert(J)},"CTRL+V":a,"META+V":a,"CTRL+K":function e(){return G.length-V&&(J=H["delete"](G.length-V),text_to_clipboard(H,J)),!1},"CTRL+U":function e(){return""!==G&&0!==V&&(J=H["delete"](-V),text_to_clipboard(H,J)),!1},"CTRL+TAB":function e(){return!1},"META+`":r,"META+R":r,"META+L":r},te,ie,oe,re,ae,se,le,de,ce,pe,me,he,ue;if(animation_supported&&!is_android)me=function(e){e?Q.addClass("blink"):Q.removeClass("blink")},he=function(){var e=Q.clone();e.insertBefore(Q),Q.remove(),Q=e};else{var ge=!1;me=function(e){e&&!ge?(ge=!0,Q.addClass("inverted blink"),H.everyTime(500,"blink",_)):ge&&!e&&(ge=!1,H.stopTime("blink",_),Q.removeClass("inverted blink"))},he=function(){me(!1),me(!0)}}var fe=function(){function e(e,n){var t=$.extend({prompt:"",last:!1},n),i=t.position,o=E(e),s=t.prompt,l;if(i===o)r.html(T(e)),Q.html("<span><span>&nbsp;</span></span>"),a.html("");else if(0===i)r.html(""),l=R(e,0,1),Q.html(T(l)),a.html(T(R(e,1),s+l));else{var d=$.terminal.substring(e,0,i);r.html(T(d,s)),l=R(e,i,i+1);var p=(s+d).replace(/^.*\t/,"");Q.html(T(l,p)),i===o-1?a.html(""):(l.match(/\t/)?p="":p+=l,a.html(T(R(e,i+1),p)))}var m=t.position===(t.last?o:o-1);Q.toggleClass("noselect",m),g(),he()}function n(e,n){return"<div role=\"presentation\" aria-hidden=\"true\">"+T(e,n||"")+"</div>"}function t(e){var t=s;$.each(e,function(e,i){t=$(n(i)).insertAfter(t)})}function o(e){$.each(e,function(e,t){s.before(n(t,0===e?oe:""))})}var r=Q.prev(),a=Q.next(),s=Q.parent();return function(){var l;switch(_typeof(N.mask)){case"boolean":l=N.mask?G.replace(/./g,"*"):G;break;case"string":l=G.replace(/./g,N.mask);}l=w(l);var d=X,c;if(H.find("div:not(.cursor-line,.clipboard-wrapper)").remove(),r.html(""),strlen(text(l))>te-re-1||l.match(/\n/)){var p=l.match(/\t/g),m=l;p&&(l=l.replace(/\t/g,"\0\0\0\0"));var h=v(l);p&&(h=$.map(h,function(e){return e.replace(/\x00\x00\x00\x00/g,"\t")}));var u=E(h[0]);if(0===u&&1===h.length);else if(d<u)e(h[0],{position:d,prompt:oe}),t(h.slice(1));else if(d===u)s.before(n(h[0],oe)),e(h[1]||"",{position:0}),1<h.length&&t(h.slice(2));else{var g=h.slice(-1)[0],f=E(m),_=f-d,b=E(g),y=0;if(-1===_&&(_=0),_<=b)o(h.slice(0,-1)),y=b===_?0:b-_,e(g,{position:y,last:!0});else{var k,x;for(y=d,c=0;c<h.length;++c){var T=$.terminal.length(h[c]);if(y>T)y-=T;else break}if(x=h[c],k=c,y===E(x)&&(y=0,x=h[++k],void 0===x)){var C=$.terminal.defaults.strings.redrawError;throw new Error(C)}e(x,{position:y}),o(h.slice(0,k)),t(h.slice(k+1))}}H.find(".cursor-line ~ div:last-of-type").append("<span></span>")}else""===l?(r.html(""),Q.html("<span><span>&nbsp;</span></span>"),a.html("")):e(l,{position:d})}}(),_e=function(){function e(e,n){var t=$.extend({},N,{position:n}),i=$.terminal.apply_formatters(G,t)[1];return i===e?0:i<e?1:-1}return function(n,t){if(0===t)return 0;n=text(n);var o=n.length,r=binary_search(0,o,t,e),a=$.terminal.split_characters(n);if(o>a.length)for(var s=0,l=0;l<a.length;++l)if(s+=a[l].length,s>=r)return s;return r}}(),be=function(){function e(e){e=$.terminal.apply_formatters(e,{}),e=$.terminal.normalize(e),e=crlf(e),ie=e;var n=$.terminal.split_equal(e,te),t={char_width:N.char_width};oe=n[n.length-1];var i=$.terminal.encode(n[n.length-1],{tabs:N.tabs}),o=$.terminal.format(i,t),r=n.slice(0,-1).map(function(e){return e=$.terminal.encode(e,{tabs:N.tabs}),"<span class=\"line\">"+$.terminal.format(e,t)+"</span>"}).concat([o]).join("\n");M.html()!==r&&(M.html(r),re=strlen(text(i)))}return function(){switch(_typeof(le)){case"string":e(le);break;case"function":le.call(H,e);}}}();$.extend(H,{option:function t(e,n){return"undefined"==typeof n?N[e]:(N[e]=n,H)},name:function t(e){if(void 0!==e){ce=e;var n=pe&&pe.enabled()||!pe;return pe=new History(ce,N.historySize,"memory"===N.history),n||pe.disable(),H}return ce},purge:function e(){return pe.clear(),H},history:function e(){return pe},delete:function i(e,n){var t;return 0===e?"":(0>e?0<V&&(t=G.slice(0,V).slice(e),G=G.slice(0,V+e)+G.slice(V,G.length),!n&&H.position(V+e),S()):""!==G&&V<G.length&&(t=G.slice(V).slice(0,e),G=G.slice(0,V)+G.slice(V+e,G.length),S()),fe(),f(),t)},set:function i(e,n,t){return void 0!==e&&(G=e,!n&&H.position(G.length),fe(),f(),!t&&S()),H},keymap:function i(e,n){function t(e,n){var t=ne[e];return is_function(t)&&(t=t.bind(H)),function(i){return n.call(H,i,t)}}if("undefined"==typeof e)return ue;if("string"!=typeof e)return ue=$.extend({},ue?ue:ne,$.omap(e||{},t)),H;if("undefined"==typeof n){if(ue[e])return ue[e];if(ne[e])return ne[e]}else ue[e]=t(e,n)},insert:function t(e,n){return V===G.length?G+=e:0===V?G=e+G:G=G.slice(0,V)+e+G.slice(V),n?f():H.position(e.length,!0,!0),fe(),S(),f(),H},get:function e(){return G},commands:function n(e){return e?(N.commands=e,H):e},destroy:function e(){return je.unbind("keypress.cmd",z),je.unbind("keydown.cmd",P),je.unbind("input.cmd",D),H.stopTime("blink",_),H.find(".cursor").next().remove().end().prev().remove().end().remove(),H.find(".prompt, .clipboard").remove(),H.removeClass("cmd").removeData("cmd").off(".cmd"),H},prompt:function n(e){if(!0===e)return ie;if(void 0===e)return le;if("string"==typeof e||"function"==typeof e)le=e;else throw new Error("prompt must be a function or string");return be(),fe(),H},kill_text:function e(){return J},position:function o(e,n,t){if("number"==typeof e){var i=V;return n?V+=e:0>e?V=0:e>G.length?V=G.length:V=e,i===V||t||(fe(),is_function(N.onPositionChange)&&N.onPositionChange(V,X),f(!0)),H}return V},refresh:function e(){return be(),fe(),H},display_position:function s(e,n){if(void 0===e)return X;var t=w(G,!0),i=$.terminal.length(t),o=text(G).length,r;if(r=n?X+e:e>i?i:e,i===r)return X=r,H.position(o);var a=_e(G,r);return-1!==a&&(X=r,H.position(a)),H},visible:function(){var e=H.visible;return function(){return e.apply(H,[]),fe(),be(),H}}(),show:function(){var e=H.show;return function(){return e.apply(H,[]),fe(),be(),H}}(),resize:function n(e){return e?te=e:x(),fe(),be(),H},enable:function n(e){if(!de){de=!0,H.addClass("enabled");try{W.caret(V)}catch(n){}me(!0),e||be(),g(),f()}return u(),H},isenabled:function e(){return de},disable:function n(e){return de=!1,H.removeClass("enabled"),me(!1),e||u(),H},mask:function n(e){return"undefined"==typeof e?N.mask:(N.mask=e,fe(),H)}}),H.name(N.name||N.prompt||""),le="string"==typeof N.prompt?N.prompt:"> ",be(),!0===N.enabled&&H.enable(),N.history||pe.disable();var ye=!0,ke=!1,xe=!1,ve=!1,we=!1,Te=!1,Ce=!0,Ee=!1,Re=!1,Ae=!1,Se=!1,Le="",je=$(document.documentElement||window),Oe;return H.keymap(N.keymap||{}),je.bind("keypress.cmd",z).bind("keydown.cmd",P).bind("keyup.cmd",I).bind("input.cmd",D),function(){var t=!1,i=0;H.on("mousedown.cmd",function(){t=!0}).on("mouseup.cmd",function(o){function e(){var e=$(o.target);!e.is(".prompt")&&s&&de&&(e.is(".cmd")?H.position(G.length):H.display_position(n(o))),i=0}var r;if(r=void 0===o.originalEvent?o.button:o.originalEvent.button,0===r&&""===get_selected_text()){var a="click_"+B;if(1==++i){var s=t;de?0===N.clickTimeout?e():H.oneTime(N.clickTimeout,a,e):i=0}else H.stopTime(a),i=0}t=!1})}(),H.data("cmd",H),"KeyboardEvent"in window&&"key"in window.KeyboardEvent.prototype||setTimeout(function(){throw new Error("key event property not supported try https://github.com/inexorabletash/polyfill/blob/master/keyboard.js")},0),H};var combine_chr_re=/^(.(?:[\u0300-\u036F]|[\u1AB0-\u1abE]|[\u1DC0-\u1DF9]|[\u1DFB-\u1DFF]|[\u20D0-\u20F0]|[\uFE20-\uFE2F])+)/,astral_symbols_re=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,emoji_re=/^(\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD]))/,mobile_re=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,tablet_re=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,format_split_re=/(\[\[[!gbiuso]*;[^;]*;[^\]]*\](?:[^\]]*[^\\](\\\\)*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?)/i,format_parts_re=/\[\[([!gbiuso]*);([^;]*);([^;\]]*);?([^;\]]*);?([^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi,format_re=/\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi,format_exist_re=/\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]/gi,format_full_re=/^\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]$/gi,color_hex_re=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i,url_re=/(\bhttps?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+)/gi,url_nf_re=/\b(?![^\s[\]]*])(https?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+)/gi,email_re=/((?:@?([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+))|(?:@([a-zA-Z0-9_]+)))/g,command_re=/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimsuy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/gi,extended_command_re=/^\s*((terminal|cmd)::([a-z_]+)\(([\s\S]*)\))\s*$/,format_begin_re=/(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i,format_start_re=/^(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i,format_end_re=/\[\[[!gbiuso]*;[^;]*;[^\]]*\]?$/i,format_exec_re=/(\[\[(?:[^\][]|\\\])+\]\])/,float_re=/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,re_re=/^\/((?:\\\/|[^/]|\[[^\]]*\/[^\]]*\])+)\/([gimsuy]*)$/,string_re=/("(?:[^"\\]|\\(?:\\\\)*"|\\\\)*"|'(?:[^'\\]|\\(?:\\\\)*'|\\\\)*')/,unclosed_strings_re=/^(?=((?:[^"']+|"[^"\\]*(?:\\[^][^"\\]*)*"|'[^'\\]*(?:\\[^][^'\\]*)*')*))\1./,animation_supported=function(){var e=!1,n=["Webkit","Moz","O","ms","Khtml"],t=document.createElement("div");if(t.style.animationName&&(e=!0),!1==e)for(var o=0,r;o<n.length;o++)if(r=n[o]+"AnimationName",void 0!==t.style[r]){e=!0;break}return t=null,e}(),is_ch_unit_supported=function(){var e=window.navigator.userAgent;if(e.match(/MSIE|Trident/)&&!e.match(/IEMobile/))return!1;var n=document.createElement("div");return n.style.width="1ch","1ch"===n.style.width}(),is_css_variables_supported=window.CSS&&window.CSS.supports&&window.CSS.supports("--fake-var",0),is_android=-1!==navigator.userAgent.toLowerCase().indexOf("android"),is_safari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),is_key_native=function(){if(!("KeyboardEvent"in window&&"key"in window.KeyboardEvent.prototype))return!1;var e=window.KeyboardEvent.prototype,n=Object.getOwnPropertyDescriptor(e,"key").get;return n.toString().match(/\[native code\]/)}(),is_mobile=function(e){var n=!1;return(mobile_re.test(e)||tablet_re.test(e.substr(0,4)))&&(n=!0),n}(navigator.userAgent||navigator.vendor||window.opera),strlen=function(){return"undefined"==typeof wcwidth?function(e){return $.terminal.length(e)}:wcwidth}(),get_selected_text=function(){if(window.getSelection||document.getSelection)return function(){var e=(window.getSelection||document.getSelection)();return e.text?e.text:e.toString()};return document.selection&&"Control"!==document.selection.type?function(){return document.selection.createRange().text}:function(){return""}}(),get_textarea_selection=function(){var e=document.createElement("textarea"),n="selectionStart"in e;return e=null,n?function(e){var n=e.selectionEnd-e.selectionStart;return e.value.substr(e.selectionStart,n)}:document.selection?function(){var e=document.selection.createRange();return e.text()}:function(){return""}}(),select=function(){if(window.getSelection){var e=window.getSelection();return e.setBaseAndExtent?function(e,n){var t=window.getSelection();t.setBaseAndExtent(e,0,n,1)}:function(e,n){var t=window.getSelection(),i=document.createRange();i.setStart(e,0),i.setEnd(n,n.childNodes.length),t.removeAllRanges(),t.addRange(i)}}return $.noop}();$.terminal={version:"1.23.1",date:"Mon, 17 Sep 2018 22:01:48 +0000",color_names:["transparent","currentcolor","black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"],Cycle:Cycle,History:History,Stack:Stack,valid_color:function(e){return!!e.match(color_hex_re)||-1!==$.inArray(e.toLowerCase(),$.terminal.color_names)},unclosed_strings:function(e){return!!e.match(unclosed_strings_re)},escape_regex:function(e){if("string"==typeof e){var n=/([-\\^$[\]()+{}?*.|])/g;return e.replace(n,"\\$1")}},have_formatting:function(e){return"string"==typeof e&&!!e.match(format_exist_re)},is_formatting:function(e){return"string"==typeof e&&!!e.match(format_full_re)},format_split:function(e){return e.split(format_split_re).filter(Boolean)},tracking_replace:function(e,n,t,o){function r(e,n,t){return e.substring(n,t)}function a(e){return $.terminal.strip(e).length}function s(n){for(var t=a(e.substring(0,n)),o=n,r;o<e.length;++o){if(r=a(e.substring(0,o)),r===t+1)return t;t=r}return t}var l="",d=0,c=s(o),p,m,h;for(n.lastIndex=0;p=n.exec(e);){if(n.global){var u=s(n.lastIndex),i=a(r(e,0,u));h=i-a(p[0])}else h=s(p.index),i=h+a(p[0]);if(d<h&&(l+=r(e,d,h)),d=i,m="function"==typeof t?t.apply(null,p):t.replace(/\$(\$|\d)/g,function(e,n){return"$"===n?"$":p[n]}),l+=m,h<o&&(i<o?c=_Mathmax(0,c+a(m)-a(p[0])):c+=a(m)-(o-h)),!n.global)break}return d<a(e)&&(l+=r(e,d)),e===l?[e,o]:[l,c]},iterate_formatting:function(e,n){function t(n){return"&nbsp;"===e.substring(n-6,n)||e.substring(n-1,n).match(/\s/)}function o(n){return e.substring(n).match(l)}function r(n){return"["===e[n]&&"["===e[n+1]}function a(n){return"]"===e[n]&&"\\"===e[n-1]}function s(n){return y&&("]"!==e[n]||!d)&&!k}for(var l=/^(&(?:[a-z\d]+|#\d+|#x[a-f\d]+);)/i,d=$.terminal.have_formatting(e),c="",p=!1,m=0,h=-1,u=0,g=0,f,_,b;g<e.length;g++){b=e.substring(g),f=b.match(format_start_re),f?(c=f[1],p=!1):c?"]"===e[g]&&(p?(c="",p=!1):p=!0):p=!0;var y=c&&p||!c,k=r(g);t(g)&&(y||k)&&(-1===h&&_!==g||-1!==h)&&(h=g);var x=e[g].match(/[[\]]/);if(y)if("&"===e[g]){if(f=o(g),f){g+=f[1].length-2;continue}++m,++u}else a(g)?(--m,--u):x&&d||(++m,++u);if(s(g)){2===strlen(e[g])&&u++;var v={count:m,index:g,formatting:c,length:u,text:p,space:h},w=n(v);if(!1===w)break;else if(w&&(void 0!==w.count&&(m=w.count),void 0!==w.length&&(u=w.length),void 0!==w.space&&(_=h,h=w.space),void 0!==w.index)){g=w.index;continue}}else g===e.length-1&&n({count:m+1,index:g,formatting:c,length:0,text:p,space:h});var T=get_next_character(b);1<T.length&&(g+=T.length-1)}},substring:function(e,n,t){var i=$.terminal.split_characters(text(e));if(!i.slice(n,t).length)return"";var o=0,r="",a="",s=/(&[^;]+);$/,l,d;return($.terminal.iterate_formatting(e,function(i){var c;n&&i.count===n+1&&(o=i.index,c=e.substring(0,o+1).match(s),c&&(o-=c[1].length),i.formatting&&(r=i.formatting)),t&&i.count===t&&(a=i.formatting,d=i.index),i.count===t+1&&(l=i.index,c=e.substring(0,l+1).match(s),c&&(l-=c[1].length),i.formatting&&(l=d+1))}),n&&!o)?"":(void 0===l&&(l=e.length),e=r+e.substring(o,l),a&&(e=e.replace(/(\[\[^\]]+)?\]$/,""),e+="]"),e)},normalize:function(e){return e.replace(format_re,function(e,n,t){function i(e){return e.replace(/\\\]/g,"&#93;").replace(/\n/g,"\\n").replace(/&nbsp;/g," ")}if(""===t)return"";n=i(n);var o=n.match(/;/g).length;if(4<=o){var r=n.split(/;/),a=r.slice(0,4).join(";"),s=r.slice(4).join(";");return"[["+a+";"+(s||t)+"]"+t+"]"}return o=2===o?";;":3===o?";":"","[["+n+o+i(t)+"]"+t+"]"})},split_equal:function(e,n,t){for(var o="",r=[],a=$.terminal.normalize(e).split(/\n/g),s=0,l=a.length;s<l;++s){if(""===a[s]){r.push("");continue}var d=a[s],c=0,p=d.length,m=$.terminal.split_characters(text(d)),h=m[m.length-1],u;$.terminal.iterate_formatting(d,function(e){var i=e.index===p-h.length,a,s;if(e.length>=n||i||e.length===n-1&&2===strlen(d[e.index+1])){var l=!1;if(t&&-1!==e.space){var m=text(d.substring(e.space)),g=m.length,f=e.index+n+1;m=m.substring(0,f),(m.match(/\s|&nbsp;/)||f>g)&&(l=!0)}var _;if(t&&-1!==e.space&&e.index!==p-1&&l?(u=d.substring(c,e.space),_=e.space-1):(s=d.substring(e.index),a=get_next_character(s),u=d.substring(c,e.index)+a,_=e.index+a.length-1),t&&(u=u.replace(/^(&nbsp;|\s)+|(&nbsp;|\s)+$/g,"")),c=(_||e.index)+1,o){var b=u.match(/^[^\]]*\]/);u=o+u,b&&(o="")}var y=u.match(format_re);if(y){var k=y[y.length-1];"]"===k[k.length-1]?u.match(format_end_re)&&(u=u.replace(format_end_re,""),o=k.match(format_begin_re)[1]):(o=k.match(format_begin_re)[1],u+="]")}return r.push(u),{index:_,length:0,space:-1}}})}return r},amp:function(e){return e.replace(/&(?!#[0-9]+;|[a-zA-Z]+;)/g,"&amp;")},encode:function(e,n){var t=$.extend({tabs:4,before:""},n);return $.terminal.amp(e).replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").split("\n").map(function(e){var n=e.split(/((?:\[\[[^\]]+\])?\t(?:\])?)/);return n=n.filter(Boolean),n.map(function(e,o){return e.match(/\t/)?e.replace(/\t([^\t]*)$/,function(e,i){if(0!==o&&n[o-1].match(/\t\]?$/)){var r=Array(t.tabs+1).join("&nbsp;");return r+i}var a=n.slice(o-1,o).join("");t.before&&1>=o&&(a=t.before+a);var s=$.terminal.length(a),l=t.tabs-s%t.tabs;return 0===l&&(l=4),Array(l+1).join("&nbsp;")+i}):e}).join("")}).join("\n")},nested_formatting:function(e){if(!$.terminal.have_formatting(e))return e;var n=[],t=/((?:\[\[(?:[^\][]|\\\])+\])?(?:[^\][]|\\\])*\]?)/,i=/(\[\[(?:[^\][]|\\\])+\])[\s\S]*/;return e.split(t).filter(Boolean).map(function(e){if(e.match(/^\[\[/))$.terminal.is_formatting(e)||(e+="]",n.push(e.replace(i,"$1")));else{var t=!1;e.match(/\]/)&&(t=!0),n.length&&(e=n[n.length-1]+e),t?n.pop():n.length&&(e+="]")}return e}).join("")},escape_formatting:function(e){return $.terminal.escape_brackets(e)},apply_formatters:function(e,n){function t(e,n,t,i){e.__no_warn__||$.terminal.length(t)===$.terminal.length(i)||warn("Your formatter["+n+"] change length of the string, you should use [regex, replacement] formatter or function  that return [replacement, position] instead")}function o(e,i){var o=$.extend({},n,{position:i[1]}),r=e(i[0],o);return"string"==typeof r?(t(e,a-1,r,i[0]),"string"==typeof r?[r,o.position]:i):r instanceof Array&&2===r.length?r:i}if(""===e)return"number"==typeof n.position?["",n.position]:"";var r=$.terminal.defaults.formatters;n=n||{};var a=0,s;s="number"==typeof n.position?[e,n.position]:[e,0];try{var l=r.reduce(function(e,n){if(a++,"function"==typeof n&&n.__meta__)return o(n,e);var t=0,i=!1,r=$.terminal.format_split(e[0]),s=r.map(function(r){var a=text(r).length,s;e[1]<=t+a&&!i?(s=e[1]-t,i=!0):s=-1;var l=t,d;if(t+=a,$.terminal.is_formatting(r))return[r,-1];if(n instanceof Array){var c=n[2]||{};if(d=[r,0>s?0:s],d[0].match(n[0]))if(c.loop)for(;d[0].match(n[0]);)d=$.terminal.tracking_replace(d[0],n[0],n[1],d[1]);else d=$.terminal.tracking_replace(d[0],n[0],n[1],d[1]);if(0>s)return[d[0],-1]}else"function"==typeof n&&(d=o(n,[r,s]));return"undefined"==typeof d?[r,-1]:(-1!==d[1]&&(d[1]+=l),d)}),l=s.filter(function(e){return-1!==e[1]})[0],d=s.map(function(e){return e[0]}).join(""),c;c="undefined"==typeof l?e[1]:l[1];var p=text(d).length;return c>p&&(c=p),d===e[0]?e:[d,c]},s);if("number"==typeof n.position){var d=$.terminal.strip(l[0]).length;if($.terminal.length(l[0])<d){var c=l[1];c=normalize_position(l[0],c);var p=$.terminal.length(l[0]);c>p&&(c=p),l[1]=c}return l}return l[0]}catch(n){var m="Error in formatter ["+(a-1)+"]";throw r.splice(a-1),new $.terminal.Exception("formatting",m,n.stack)}},format:function(e,n){function t(e){return e.match(/\\]/)&&(e=e.replace(/(\\+)]/g,function(e,n){return 1==n.length%2?"]":n.replace(/../,"\\")})),safe(e)}var i=$.extend({},{linksNoReferrer:!1,linksNoFollow:!1,anyLinks:!1},n||{});if("string"==typeof e){var o=$.terminal.format_split(e);return e=$.map(o,function(e){if(""===e)return e;if($.terminal.is_formatting(e))return e=e.replace(/\[\[[^\]]+\]/,function(e){return e.replace(/&nbsp;/g," ")}),e.replace(format_parts_re,function(e,o,r,a,s,l,d){if(""===d)return"";d=t(d);var c="";-1!==o.indexOf("b")&&(c+="font-weight:bold;");var p=[];-1!==o.indexOf("u")&&p.push("underline"),-1!==o.indexOf("s")&&p.push("line-through"),-1!==o.indexOf("o")&&p.push("overline"),p.length&&(c+="text-decoration:"+p.join(" ")+";"),-1!==o.indexOf("i")&&(c+="font-style:italic;"),$.terminal.valid_color(r)&&(c+="color:"+r+";--color:"+r+";",-1!==o.indexOf("g")&&(c+="text-shadow:0 0 5px "+r+";")),$.terminal.valid_color(a)&&(c+="background-color:"+a);var m=""===l?d:l.replace(/&#93;/g,"]").replace(/>/g,"&gt;").replace(/</g,"&lt;");var h=extra_css(d,n);h&&(d=wide_characters(d,n),c+=h);var u;if(-1!==o.indexOf("!")){if(m.match(url_re)){i.anyLinks||m.match(/^(https?|ftp):\/\//)||(m=""),u="<a target=\"_blank\" href=\""+m+"\"";var g=["noopener"];i.linksNoReferrer&&g.unshift("noreferrer"),i.linksNoFollow&&g.unshift("nofollow"),u+=" rel=\""+g.join(" ")+"\""}else u="<a class=\"a_acct\" name=\"a_acct\"";u+=" tabindex=\"1000\""}else u="<span";return""!==c&&(u+=" style=\""+c+"\""),""!==s&&(u+=" class=\""+s+"\""),u+=-1===o.indexOf("!")?" data-text=\""+m.replace(/"/g,"&quote;")+"\">"+d+"</span>":">"+d+"</a>",u});e=t(e);var o=extra_css(e,n);return o.length?(e=wide_characters(e,n),"<span style=\""+o+"\">"+e+"</span>"):"<span>"+e+"</span>"}).join(""),e.replace(/<span><br\s*\/?><\/span>/gi,"<br/>")}return""},escape_brackets:function(e){return e.replace(/\[/g,"&#91;").replace(/\]/g,"&#93;")},unescape_brackets:function(e){return e.replace(/&#91;/g,"[").replace(/&#93;/g,"]")},length:function n(e){return $.terminal.split_characters(text(e)).length},split_characters:function(e){for(var n=[];e.length;){var t=get_next_character(e);e=e.substring(t.length),n.push(t)}return n},columns:function h(e,n,t){var o=e.map(function(e){return $.terminal.strip(e)}),r=o.map(function(e){return strlen(e)});"undefined"==typeof t&&(t=4);var a=_Mathmax.apply(null,r)+t,s=_Mathfloor(n/a)-1;if(1>s)return e.join("\n");for(var l=[],d=0,c=e.length;d<c;d+=s){var p=e.slice(d,d+s),m=p.pop();l.push(p.reduce(function(e,n){var t=$.terminal.strip(n),i=Array(a-t.length+1).join(" ");return e.push(n+i),e},[]).join("")+m)}return l.join("\n")},strip:function(e){return e=e.replace(format_parts_re,"$6"),e.replace(/\\([[\]])/g,function(e,n){return n})},active:function(){return terminals.front()},last_id:function(){var e=terminals.length();return e-1},parse_argument:function(e,n){function t(e){return e.split(string_re).map(function(e){if(e.match(/^['"]/)){if("\"\""===e||"''"===e)return"";var n=e[0],t=new RegExp("(^|(?:\\\\(?:\\\\)*)?)"+n,"g");e=e.replace(t,"$1")}return e="\""+e+"\"",JSON.parse(e)}).join("")}if(!1===n)return"'"===e[0]&&"'"===e[e.length-1]?e.replace(/^'|'$/g,""):"\""===e[0]&&"\""===e[e.length-1]?e.replace(/^"|"$/g,"").replace(/\\([" ])/g,"$1"):e.match(/\/.*\/[gimy]*$/)?e:e.match(/['"]]/)?t(e):e.replace(/\\ /g," ");var i=e.match(re_re);return i?new RegExp(i[1],i[2]):e.match(/['"]/)?t(e):e.match(/^-?[0-9]+$/)?parseInt(e,10):e.match(float_re)?parseFloat(e):e.replace(/\\(['"() ])/g,"$1")},parse_arguments:function(e){return $.map(e.match(command_re)||[],$.terminal.parse_argument)},split_arguments:function(e){return $.map(e.match(command_re)||[],function(e){return $.terminal.parse_argument(e,!1)})},parse_command:function(e){return process_command(e,$.terminal.parse_argument)},split_command:function(e){return process_command(e,function(e){return $.terminal.parse_argument(e,!1)})},parse_options:function e(n,t){function i(e){this.value=e}var o=$.extend({},{boolean:[]},t);if("string"==typeof n)return e($.terminal.split_arguments(n),t);var r={_:[]},a=n.reduce(function(e,n){if("string"!=typeof n&&(n+=""),n.match(/^-/)&&e instanceof i&&(r[e.value]=!0),n.match(/^--/)){var t=n.replace(/^--/,"");if(-1===o.boolean.indexOf(t))return new i(t);r[t]=!0}else if(n.match(/^-/)){var a=n.replace(/^-/,"").split("");if(-1===o.boolean.indexOf(a.slice(-1)[0]))var s=a.pop();if(a.forEach(function(e){r[e]=!0}),s)return new i(s)}else e instanceof i?r[e.value]=n:n&&r._.push(n);return null},null);return a instanceof i&&(r[a.value]=!0),r},extended_command:function(term,string,options){var settings=$.extend({invokeMethods:!1},options);try{change_hash=!1;var m=string.match(extended_command_re);if(m){if(!settings.invokeMethods)return void warn("To invoke terminal or cmd methods you need to enable invokeMethods option");string=m[1];var obj="terminal"===m[2]?term:term.cmd(),fn=m[3];try{var args=eval("["+m[4]+"]");obj[fn]?obj[fn].apply(term,args):term.error("Unknow function "+fn)}catch(n){term.error("Invalid invocation in "+$.terminal.escape_brackets(string))}}else term.exec(string,!0).done(function(){change_hash=!0})}catch(n){}},iterator:function a(e){function n(e){return $.terminal.is_formatting(e)&&e.match(/\]\\\]/)&&(e=e.replace(/\]\\\]/g,"]\\\\]")),e}if("function"==typeof Symbol&&"symbol"===_typeof(Symbol.iterator)){var t=$.terminal.length(e),o=0,r={};return r[Symbol.iterator]=function(){return{next:function r(){if(o<t){var i=$.terminal.substring(e,o,o+1);return o++,{value:n(i)}}return{done:!0}}}},r}},formatter:new function(){try{this[Symbol.split]=function(e){return $.terminal.format_split(e)},this[Symbol.match]=function(e){return e.match(format_re)},this[Symbol.replace]=function(e,n){return e.replace(format_parts_re,n)},this[Symbol.search]=function(e){return e.search(format_re)}}catch(n){}},new_formatter:function o(e){for(var n=$.terminal.defaults.formatters,t=0;t<n.length;++t)if(n[t]===$.terminal.nested_formatting)return void n.splice(t,0,e);n.push(e)}},$.terminal.Exception=function(e,n,t){1===arguments.length?(this.message=arguments[0],this.type="TERMINAL"):(this.type=e,this.message=n,t&&(this.stack=t))},$.terminal.Exception.prototype=new Error,$.terminal.Exception.prototype.toString=function(){return this.message+"\n"+this.stack},$.fn.visible=function(){return this.css("visibility","visible")},$.fn.hidden=function(){return this.css("visibility","hidden")};var warnings=[],ids={};$.jrpc=function(e,n,t,i,o){function r(e){return $.isNumeric(e.id)&&("undefined"!=typeof e.result||"undefined"!=typeof e.error)}var a=new $.Deferred,s;s=$.isPlainObject(e)?e:{url:e,method:n,params:t,success:i,error:o},ids[s.url]=ids[s.url]||0;var l={jsonrpc:"2.0",method:s.method,params:s.params,id:++ids[s.url]};return $.ajax({url:s.url,beforeSend:function(e,n){is_function(s.request)&&s.request(e,l),n.data=JSON.stringify(l)},success:function(n,e,t){var i=t.getResponseHeader("Content-Type");i.match(/(application|text)\/json/)||warn("Response Content-Type is neither application/json nor text/json");var o;try{o=JSON.parse(n)}catch(i){if(s.error)s.error(t,"Invalid JSON",i);else throw new $.terminal.Exception("JSON","Invalid JSON",i.stack);return void a.reject({message:"Invalid JSON",response:n})}is_function(s.response)&&s.response(t,o),r(o)||"system.describe"===s.method?(s.success&&s.success(o,e,t),a.resolve(o)):(s.error&&s.error(t,"Invalid JSON-RPC"),a.reject({message:"Invalid JSON-RPC",response:n}))},error:s.error,contentType:"application/json",dataType:"text",async:!0,cache:!1,type:"POST"}),a.promise()};var version_set=!$.terminal.version.match(/^\{\{/),copyright="Copyright (c) 2011-2018 Jakub Jankiewicz <http://jcubic.pl/me>",version_string=version_set?" v. "+$.terminal.version:" ",reg=new RegExp(" {"+version_string.length+"}$"),name_ver="jQuery Terminal Emulator"+(version_set?version_string:""),signatures=[["jQuery Terminal","(c) 2011-2018 jcubic"],[name_ver,copyright.replace(/^Copyright | *<.*>/g,"")],[name_ver,copyright.replace(/^Copyright /,"")],["      _______                 ________                        __","     / / _  /_ ____________ _/__  ___/______________  _____  / /"," __ / / // / // / _  / _/ // / / / _  / _/     / /  \\/ / _ \\/ /","/  / / // / // / ___/ // // / / / ___/ // / / / / /\\  / // / /__","\\___/____ \\\\__/____/_/ \\__ / /_/____/_//_/_/_/_/_/  \\/\\__\\_\\___/","         \\/          /____/                                   ".replace(reg," ")+version_string,copyright],["      __ _____                     ________                              __","     / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /"," __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /","/  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__","\\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/","          \\/              /____/                                          ".replace(reg,"")+version_string,copyright]];$.terminal.nested_formatting.__meta__=!0,$.terminal.nested_formatting.__no_warn__=!0,$.terminal.defaults={prompt:"> ",history:!0,exit:!0,clear:!0,enabled:!0,maskChar:"*",wrap:!0,checkArity:!0,raw:!1,invokeMethods:!1,exceptionHandler:null,pauseEvents:!0,softPause:!1,memory:!1,cancelableAjax:!0,processArguments:!0,linksNoReferrer:!1,anyLinks:!1,linksNoFollow:!1,processRPCResponse:null,completionEscape:!0,onCommandChange:null,convertLinks:!0,extra:{},tabs:4,historySize:60,scrollObject:null,historyState:!1,importHistory:!1,historyFilter:null,echoCommand:!0,scrollOnEcho:!0,login:null,outputLimit:-1,formatters:[$.terminal.nested_formatting],onAjaxError:null,pasteImage:!0,scrollBottomOffset:20,wordAutocomplete:!0,caseSensitiveAutocomplete:!0,caseSensitiveSearch:!0,clickTimeout:200,holdTimeout:400,holdRepeatTimeout:200,request:$.noop,response:$.noop,describe:"procs",onRPCError:null,doubleTab:null,completion:!1,onInit:$.noop,onClear:$.noop,onBlur:$.noop,onFocus:$.noop,onTerminalChange:$.noop,onExit:$.noop,onPush:$.noop,onPop:$.noop,keypress:$.noop,keydown:$.noop,onAfterRedraw:$.noop,onEchoCommand:$.noop,onFlush:$.noop,strings:{comletionParameters:"From version 1.0.0 completion function need to have two arguments",wrongPasswordTryAgain:"Wrong password try again!",wrongPassword:"Wrong password!",ajaxAbortError:"Error while aborting ajax call!",wrongArity:"Wrong number of arguments. Function '%s' expects %s got %s!",commandNotFound:"Command '%s' Not Found!",oneRPCWithIgnore:"You can use only one rpc with describe == false or rpc without system.describe",oneInterpreterFunction:"You can't use more than one function (rpc without system.describe or with option describe == false counts as one)",loginFunctionMissing:"You didn't specify a login function",noTokenError:"Access denied (no token)",serverResponse:"Server responded",wrongGreetings:"Wrong value of greetings parameter",notWhileLogin:"You can't call `%s' function while in login",loginIsNotAFunction:"Authenticate must be a function",canExitError:"You can't exit from main interpreter",invalidCompletion:"Invalid completion",invalidSelector:"Sorry, but terminal said that you use invalid selector!",invalidTerminalId:"Invalid Terminal ID",login:"login",password:"password",recursiveCall:"Recursive call detected, skip",notAString:"%s function: argument is not a string",redrawError:"Internal error, wrong position in cmd redraw",invalidStrings:"Command %s have unclosed strings",defunctTerminal:"You can't call method on terminal that was destroyed"}};var requests=[],terminals=new Cycle,_save_state=[],change_hash=!1,fire_hash_change=!0,first_instance=!0,hash_commands;$.fn.terminal=function(e,n){function t(e){if($.terminal.unclosed_strings(e)){var n=$.terminal.escape_brackets(e),t=sprintf(z().invalidStrings,"`"+n+"`");throw new $.terminal.Exception(t)}else return is_function(ie.processArguments)?process_command(e,ie.processArguments):ie.processArguments?$.terminal.parse_command(e):$.terminal.split_command(e)}function o(e){"string"==typeof e?M.echo(e):e instanceof Array?M.echo($.map(e,function(e){return JSON.stringify(e)}).join(" ")):"object"===_typeof(e)?M.echo(JSON.stringify(e)):M.echo(e)}function r(e){var n=/(.*):([0-9]+):([0-9]+)$/,t=e.match(n);t&&(M.pause(ie.softPause),$.get(t[1],function(e){var i=t[1];M.echo("[[b;white;]"+i+"]");var o=e.split("\n"),r=+t[2]-1;M.echo(o.slice(r-2,r+3).map(function(e,n){return 2===n&&(e="[[;#f00;]"+$.terminal.escape_brackets(e)+"]"),"["+(r+n-1)+"]: "+e}).join("\n")).resume()},"text"))}function a(e){if(is_function(ie.onRPCError))ie.onRPCError.call(M,e);else if(M.error("&#91;RPC&#93; "+e.message),e.error&&e.error.message){e=e.error;var n="\t"+e.message;e.file&&(n+=" in file \""+e.file.replace(/.*\//,"")+"\""),e.at&&(n+=" at line "+e.at),M.error(n)}}function s(e,n){var i=function(n,t){M.pause(ie.softPause),$.jrpc({url:e,method:n,params:t,request:function t(e,n){try{ie.request.call(M,e,n,M)}catch(n){h(n,"USER")}},response:function t(e,n){try{ie.response.call(M,e,n,M)}catch(n){h(n,"USER")}},success:function(e){e.error?a(e.error):is_function(ie.processRPCResponse)?ie.processRPCResponse.call(M,e.result,M):o(e.result),M.resume()},error:d})};return function(e,o){if(""!==e){try{e=t(e)}catch(n){return void h(n,"TERMINAL (get_processed_command)")}if(!n||"help"===e.name)i(e.name,e.args);else{var r=o.token();r?i(e.name,[r].concat(e.args)):o.error("&#91;AUTH&#93; "+z().noTokenError)}}}}function l(e,n,i,o){return function(r,a){if(""!==r){var s;try{s=t(r)}catch(n){return void(is_function(ie.exception)?ie.exception(n,M):M.error("Error: "+(n.message||n)))}var d=e[s.name],c=get_type(d);if("function"===c){if(n&&d.length!==s.args.length)M.error("&#91;Arity&#93; "+sprintf(z().wrongArity,s.name,d.length,s.args.length));else return d.apply(M,s.args);}else if("object"===c||"string"===c){var p=[];"object"===c&&(p=Object.keys(d),d=l(d,n,i)),a.push(d,{prompt:s.name+"> ",name:s.name,completion:"object"===c?p:void 0})}else is_function(o)?o(r,M):is_function(ie.onCommandNotFound)?ie.onCommandNotFound.call(M,r,M):a.error(sprintf(z().commandNotFound,s.name))}}}function d(e,n,t){M.resume(),is_function(ie.onAjaxError)?ie.onAjaxError.call(M,e,n,t):"abort"!==n&&M.error("&#91;AJAX&#93; "+n+" - "+z().serverResponse+":\n"+$.terminal.escape_brackets(e.responseText))}function c(e,n,t){function i(e){e.error?a(e.error):is_function(ie.processRPCResponse)?ie.processRPCResponse.call(M,e.result,M):o(e.result),M.resume()}function r(e,n){try{ie.request.call(M,e,n,M)}catch(n){h(n,"USER")}}function s(e,n){try{ie.response.call(M,e,n,M)}catch(n){h(n,"USER")}}function l(o){var a=o;if(""!==ie.describe&&ie.describe.split(".").forEach(function(e){a=a[e]}),a&&a.length){var l={};$.each(a,function(t,o){$.isPlainObject(o)&&"string"==typeof o.name&&(l[o.name]=function(){var t=n&&"help"!==o.name,a=Array.prototype.slice.call(arguments),l=a.length+(t?1:0);if(ie.checkArity&&o.params&&o.params.length!==l)M.error("&#91;Arity&#93; "+sprintf(z().wrongArity,o.name,o.params.length,l));else{if(M.pause(ie.softPause),t){var c=M.token(!0);c?a=[c].concat(a):M.error("&#91;AUTH&#93; "+z().noTokenError)}$.jrpc({url:e,method:o.name,params:a,request:r,response:s,success:i,error:d})}})});var c="string"==typeof n?n:"login";l.help=l.help||function(e){if("undefined"==typeof e){var t=o.procs.map(function(e){return e.name}).join(", ")+", help";M.echo("Available commands: "+t)}else{var i=!1;if($.each(a,function(t,o){if(o.name===e){i=!0;var r="";if(r+="[[bu;;]"+o.name+"]",o.params){var a=o.params;n&&o.name!==c&&(a=a.slice(1)),r+=" "+a.join(" ")}return o.help&&(r+="\n"+o.help),M.echo(r),!1}}),!i)if("help"===e)M.echo("[[bu;;]help] [method]\ndisplay help for the method or list of methods if not specified");else{M.error("Method `"+e+"' not found ")}}},t(l)}else t(null)}return $.jrpc({url:e,method:"system.describe",params:[],success:l,request:r,response:s,error:function(){t(null)}})}function p(e,n,t){t=t||$.noop;var i=get_type(e),o={},r=0,a,d;if("array"===i)a={},function e(t,i){if(t.length){var o=t[0],l=t.slice(1),p=get_type(o);"string"===p?(M.pause(ie.softPause),!1===ie.describe?(1==++r?d=s(o,n):M.error(z().oneRPCWithIgnore),e(l,i)):c(o,n,function(t){t?$.extend(a,t):1==++r?d=s(o,n):M.error(z().oneRPCWithIgnore),M.resume(),e(l,i)})):"function"===p?(d?M.error(z().oneInterpreterFunction):d=o,e(l,i)):"object"===p&&($.extend(a,o),e(l,i))}else i()}(e,function(){t({interpreter:l(a,!1,n,d.bind(M)),completion:Object.keys(a)})});else if("string"===i)ie.ignoreSystemDescribe?(a={interpreter:s(e,n)},$.isArray(ie.completion)&&(a.completion=ie.completion),t(a)):(M.pause(ie.softPause),c(e,n,function(i){i?(o.interpreter=l(i,!1,n),o.completion=Object.keys(i)):o.interpreter=s(e,n),t(o),M.resume()}));else if("object"===i)t({interpreter:l(e,ie.checkArity,n),completion:Object.keys(e)});else{if("undefined"===i)e=$.noop;else if("function"!==i){throw new $.terminal.Exception(i+" is invalid interpreter value")}t({interpreter:e,completion:ie.completion})}}function m(e,n){var t="boolean"===get_type(n)?"login":n;return function(n,i,o){M.pause(ie.softPause),$.jrpc({url:e,method:t,params:[n,i],request:function t(e,n){try{ie.request.call(M,e,n,M)}catch(n){h(n,"USER")}},response:function t(e,n){try{ie.response.call(M,e,n,M)}catch(n){h(n,"USER")}},success:function(e){!e.error&&e.result?o(e.result):o(null),M.resume()},error:d})}}function h(n,e,t){is_function(ie.exceptionHandler)?ie.exceptionHandler.call(M,n,e):(M.exception(n,e),!t&&setTimeout(function(){throw n},0))}function u(e,n,t){var o,r;if(H.push(1),""===e);else if(!t.raw){var a={linksNoReferrer:ie.linksNoReferrer,linksNoFollow:ie.linksNoFollow,anyLinks:ie.anyLinks,char_width:Q.width},s=M.cols();if((strlen(e)>s||e.match(/\n/))&&(!0===ie.wrap&&void 0===t.wrap||!1===ie.wrap&&!0===t.wrap)){var l=t.keepWords,d=$.terminal.split_equal(e,s,l);for(o=0,r=d.length;o<r;++o)""===d[o]||"\r"===d[o]?H.push("<span></span>"):H.push($.terminal.format(d[o],a))}else e=$.terminal.normalize(e),e=$.terminal.format(e,a),e.split(/\n/).forEach(function(e){H.push(e)})}else H.push(e);H.push({finalize:t.finalize,index:n})}function g(e){try{var n=$.extend({exec:!0,raw:!1,finalize:$.noop},e.options||{}),t=e.string,i=is_function(t),o;if(i&&(t=t()),"string"===get_type(t))o=t;else if(is_function(ie.parseObject)){var r=ie.parseObject(t);"string"===get_type(r)&&(o=r)}else o=t instanceof Array?$.terminal.columns(t,M.cols(),ie.tabs):t+"";if(""!==o&&""!==o){if(!n.raw){if(ie.convertLinks&&(o.match(url_nf_re)?o=o.replace(url_nf_re,"[[!;;]$1]"):o.match(email_re)&&(o=o.replace(email_re,"[[!;;]$1]"))),n.formatters)try{o=$.terminal.apply_formatters(o,ie)}catch(n){h(n,"FORMATTING")}o.split(format_exec_re)}""!==o&&u(o,e.index,n)}""===o&&i&&u(o,e.index,n)}catch(n){H=[],is_function(ie.exceptionHandler)?ie.exceptionHandler.call(M,n,"TERMINAL"):alert_exception("[Internal Exception(process_line)]",n)}}function f(e){if(e=$.extend({},{update:!1,scroll:!0},e||{}),!e.update){ke.resize(se);var n=ae.empty().detach()}var t=[];if(0<=ie.outputLimit){var i;i=0===ie.outputLimit?M.rows():ie.outputLimit,he.forEach(function(e,n){var i=e[0],o=e[1];"function"===get_type(i)&&(i=i()),"string"!==get_type(i)&&(i+=""),t.push({string:i,index:n,options:o})}),t=t.slice(t.length-i-1)}else t=he.map(function(e,n){return{string:e[0],index:n,options:e[1]}});try{H=[],$.each(t,function(e,n){g(n)}),e.update||ke.before(n),M.flush(e);try{ie.onAfterRedraw.call(M,M)}catch(n){ie.onAfterRedraw=$.noop,h(n,"onAfterRedraw")}}catch(n){is_function(ie.exceptionHandler)?ie.exceptionHandler.call(M,n,"TERMINAL (redraw)"):alert_exception("[redraw]",n)}}function _(){if(0<=ie.outputLimit){var e=0===ie.outputLimit?M.rows():ie.outputLimit;var n=ae.find("> div > div");if(n.length+1>e){var t=n.length-e+1,i=n.slice(0,t),o=i.parent();i.remove(),o.each(function(){var e=$(this);e.is(":empty")&&e.remove()})}}}function b(){if(void 0===ie.greetings)M.echo(M.signature,{finalize:a11y_hide,formatters:!1});else if(ie.greetings){var e=_typeof(ie.greetings);if("string"===e)M.echo(ie.greetings);else if("function"===e)try{ie.greetings.call(M,M.echo)}catch(n){ie.greetings=null,h(n,"greetings")}else M.error(z().wrongGreetings)}}function y(e){"undefined"==typeof e&&(e=M.get_command());var n=ke.prompt(!0),t=ke.mask();switch(_typeof(t)){case"string":e=e.replace(/./g,t);break;case"boolean":e=t?e.replace(/./g,ie.maskChar):$.terminal.escape_formatting(e);}var i={finalize:function(n){a11y_hide(n.addClass("command"));try{ie.onEchoCommand.call(M,n,e)}catch(n){ie.onEchoCommand=$.noop,M.exception(n)}}};if(is_function(n)){var o=n(function(n){M.echo(n+e,i)});o&&is_function(o.then)&&o.then(function(n){"string"==typeof n&&M.echo(n+e,i)})}else M.echo(n+e,i)}function k(){return M.is("body")?0<window.innerWidth-document.documentElement.clientWidth:Se.outerWidth()!==M.outerWidth()}function x(e){var n=terminals.get()[e[0]];if(!n)throw new $.terminal.Exception(z().invalidTerminalId);var t=e[1];if(_save_state[t])n.import_view(_save_state[t]);else{change_hash=!1;var i=e[2];i&&n.exec(i).done(function(){change_hash=!0,_save_state[t]=n.export_view()})}}function v(){change_hash&&(fire_hash_change=!1,location.hash="#"+JSON.stringify(hash_commands),setTimeout(function(){fire_hash_change=!0},100))}function w(e,n,t){function i(){(ie.historyState||ie.execHash&&t)&&(_save_state.length?M.save_state(null):M.save_state())}function r(){t||(change_hash=!0,ie.historyState&&M.save_state(e,!1),change_hash=c),d.resolve(),is_function(ie.onAfterCommand)&&ie.onAfterCommand.call(M,M,e)}function a(e){"undefined"!=typeof e&&o(e),r(),M.resume()}function s(){var n=l.interpreter.call(M,e,M);if(!n)_e?B.push(function(){r()}):r();else if(M.pause(ie.softPause),is_function(n.done||n.then))(n.done||n.then).call(n,a);else return $.when(n).done(a)}U&&(U=!1,i());try{if(is_function(ie.onBeforeCommand)&&!1===ie.onBeforeCommand.call(M,M,e))return;t||(re=$.terminal.split_command(e)),!L()&&t&&(is_function(ie.historyFilter)&&ie.historyFilter(e)||e.match(ie.historyFilter))&&ke.history().append(e);var l=ye.top();!n&&ie.echoCommand&&y(e);var d=new $.Deferred,c=change_hash;if(e.match(/^\s*login\s*$/)&&M.token(!0))1<M.level()?M.logout(!0):M.logout(),r();else if(ie.exit&&e.match(/^\s*exit\s*$/)&&!ee){var p=M.level();(1===p&&M.get_token()||1<p)&&(M.get_token(!0)&&M.set_token(void 0,!0),M.pop()),r()}else if(ie.clear&&e.match(/^\s*clear\s*$/)&&!ee)M.clear(),r();else{var m=s();if(m)return m}return d.promise()}catch(n){if(h(n,"USER",t),M.resume(),t)throw n}}function T(){if(is_function(ie.onBeforeLogout))try{if(!1===ie.onBeforeLogout.call(M,M))return}catch(n){ie.onBeforeLogout=$.noop,h(n,"onBeforeLogout")}if(C(),is_function(ie.onAfterLogout))try{ie.onAfterLogout.call(M,M)}catch(n){ie.onAfterLogout=$.noop,h(n,"onAfterlogout")}M.login(Pe,!0,S)}function C(){var e=M.prefix_name(!0)+"_";ue.remove(e+"token"),ue.remove(e+"login")}function E(e){var n=M.prefix_name()+"_interpreters",t=ue.get(n);t=t?JSON.parse(t):[],-1===$.inArray(e,t)&&(t.push(e),ue.set(n,JSON.stringify(t)))}function R(e){var n=ye.top(),t=M.prefix_name(!0);L()||E(t);var i=M.login_name(!0);ke.name(t+(i?"_"+i:"")),n.prompt!==ke.prompt()&&(is_function(n.prompt)?ke.prompt(function(e){var t=n.prompt.call(M,e,M);t&&is_function(t.then)&&t.then(function(n){"string"==typeof n&&e(n)})}):ke.prompt(n.prompt)),"undefined"!=typeof n.history&&M.history().toggle(n.history),$.isPlainObject(n.keymap)&&ke.keymap($.omap(n.keymap,function(e,n){return function(){var e=[].slice.call(arguments);try{return n.apply(M,e)}catch(n){h(n,"USER KEYMAP")}}})),ke.set(""),V.resolve(),!e&&is_function(n.onStart)&&n.onStart.call(M,M)}function A(){if(fire_hash_change&&ie.execHash)try{if(location.hash){var e=location.hash.replace(/^#/,"");hash_commands=JSON.parse(decodeURIComponent(e))}else hash_commands=[];hash_commands.length?x(hash_commands[hash_commands.length-1]):_save_state[0]&&M.import_view(_save_state[0])}catch(n){h(n,"TERMINAL")}}function S(){R(),b(),he.length&&M.refresh();var e=!1;if(is_function(ie.onInit)){ne=function(){e=!0};try{ie.onInit.call(M,M)}catch(n){h(n,"OnInit")}finally{ne=$.noop,!e&&M.enabled()&&M.resume()}}first_instance&&(first_instance=!1,$(window).on("hashchange",A))}function L(){return ee||!1!==ke.mask()}function j(n){var e=ye.top(),t;if(is_function(e.keydown)){if(t=e.keydown.call(M,n,M),void 0!==t)return t;}else if(is_function(ie.keydown)&&(t=ie.keydown.call(M,n,M),void 0!==t))return t}function O(n){var e,t;if(M.enabled())if(!M.paused()){if(e=j(n),void 0!==e)return e;9!==n.which&&(q=0)}else{if(!ie.pauseEvents&&(e=j(n),void 0!==e))return e;if(68===n.which&&n.ctrlKey){if(ie.pauseEvents&&(e=j(n),void 0!==e))return e;if(requests.length){for(t=requests.length;t--;){var o=requests[t];if(4!==o.readyState)try{o.abort()}catch(e){is_function(ie.exceptionHandler)?ie.exceptionHandler.call(M,n,"AJAX ABORT"):M.error(z().ajaxAbortError)}}requests=[]}M.resume()}return!1}}function P(n){var e=ye.top();if(ge&&(!_e||!ie.pauseEvents)){if(is_function(e.keypress))return e.keypress.call(M,n,M);if(is_function(ie.keypress))return ie.keypress.call(M,n,M)}}function I(e){return function(n){e.add(n)}}function z(){return $.extend({},$.terminal.defaults.strings,ie&&ie.strings||{})}function F(){}function D(){xe=ge,M.disable().find(".cmd textarea").trigger("blur",[!0])}function N(n){function t(e,n){return-1!==e.type.indexOf(n)}if(n=n.originalEvent,n.clipboardData&&M.enabled()){var o=n.clipboardData.items;if(o){for(var r=0;r<o.length;r++)if(t(o[r],"image")&&ie.pasteImage){var a=o[r].getAsFile(),s=window.URL||window.webkitURL,l=s.createObjectURL(a);M.echo("<img src=\""+l+"\"/>",{raw:!0})}else t(o[r],"text/plain")&&o[r].getAsString(M.insert);}else if(n.clipboardData.getData){var d=n.clipboardData.getData("text/plain");M.insert(d)}return!1}}var H=[],U=!0,B=[],W={"CTRL+D":function t(n,e){return ee||(""===ke.get()?1<ye.size()||is_function(Pe)?M.pop(""):(M.resume(),M.echo("")):e()),!1},"CTRL+C":function t(){if(""===get_selected_text()){var e=M.get_command(),n=M.get_position();e=e.substring(0,n)+"^C"+e.substring(n+2),y(e),M.set_command("")}},"CTRL+L":function e(){M.clear()},TAB:function d(n,e){function t(e){M.complete(e,{echo:!0,word:ie.wordAutocomplete,escape:ie.completionEscape,caseSensitive:r,doubleTab:ie.doubleTab})}var i=ye.top(),o,r;if(r="undefined"==typeof i.caseSensitiveAutocomplete?ie.caseSensitiveAutocomplete:i.caseSensitiveAutocomplete,o=ie.completion&&"boolean"!==get_type(ie.completion)&&void 0===i.completion?ie.completion:i.completion,"settings"===o&&(o=ie.completion),o)switch(get_type(o)){case"function":var a=M.before_cursor(ie.wordAutocomplete);if(3===o.length){var s=new Error(z().comletionParameters);return h(s,"USER"),!1}var l=o.call(M,a,t);l&&is_function(l.then)&&l.then(t);break;case"array":t(o);break;default:throw new $.terminal.Exception(z().invalidCompletion);}else e();return!1},"CTRL+V":function t(n,e){return e(n),M.oneTime(200,function(){M.scroll_to_bottom()}),!0},"CTRL+TAB":function e(){if(1<terminals.length())return M.focus(!1),!1},PAGEDOWN:function e(){M.scroll(M.height())},PAGEUP:function e(){M.scroll(-M.height())}},M=this;if(1<this.length)return this.each(function(){$.fn.terminal.call($(this),e,$.extend({name:M.selector},n))});if(M.data("terminal"))return M.data("terminal");if(0===M.length){var K=sprintf(z().invalidSelector);throw new $.terminal.Exception(K)}var q=0,Y=terminals.length(),G=new Stack,J=new DelayQueue,V=new DelayQueue,X=I(V),Q=get_char_size(M),Z=I(J),ee=!1,ne=$.noop,te=[],ie=$.extend({},$.terminal.defaults,{name:M.selector,exit:!!(n&&n.login||!n)},n||{}),oe,re,ae,se,le,de,ce,pe;delete ie.formatters;var me=!1,he=[],ue=new function(e){e&&(this.storage={}),this.set=function(n,t){e?this.storage[n]=t:$.Storage.set(n,t)},this.get=function(n){return e?this.storage[n]:$.Storage.get(n)},this.remove=function(n){e?delete this.storage[n]:$.Storage.remove(n)}}(ie.memory),ge=ie.enabled,fe=!1,_e=!1,be=!0,ye,ke,xe,ve,we;$.extend(M,$.omap({id:function e(){return Y},clear:function e(){ae.html(""),he=[];try{ie.onClear.call(M,M)}catch(n){h(n,"onClear")}return M.attr({scrollTop:0}),M},export_view:function n(){var e={};if(is_function(ie.onExport))try{e=ie.onExport.call(M)}catch(n){h(n,"onExport")}return $.extend({},{focus:ge,mask:ke.mask(),prompt:M.get_prompt(),command:M.get_command(),position:ke.position(),lines:clone(he),interpreters:ye.clone(),history:ke.history().data},e)},import_view:function n(e){if(ee)throw new Error(sprintf(z().notWhileLogin,"import_view"));if(is_function(ie.onImport))try{ie.onImport.call(M,e)}catch(n){ie.onImport=$.noop,h(n,"onImport")}return X(function(){M.set_prompt(e.prompt),M.set_command(e.command),ke.position(e.position),ke.mask(e.mask),e.focus&&M.focus(),he=clone(e.lines).filter(function(e){return e[0]}),e.interpreters instanceof Stack&&(ye=e.interpreters),ie.importHistory&&ke.history().set(e.history),f()}),M},save_state:function o(e,n,t){if("undefined"==typeof t?_save_state.push(M.export_view()):_save_state[t]=M.export_view(),$.isArray(hash_commands)||(hash_commands=[]),void 0!==e&&!n){var i=[Y,_save_state.length-1,e];hash_commands.push(i),v()}return M},exec:function o(e,n,t){var i=t||new $.Deferred;return Z(function(){if($.isArray(e))(function t(){var o=e.shift();o?M.exec(o,n).done(t):i.resolve()})();else if(_e)te.push([e,n,i]);else{var t=w(e,n,!0);t&&(t.done||t.then)&&(t.done||t.then).call(t,function(){i.resolve(M)})}}),i.promise()},autologin:function(e,n,t){return M.trigger("terminal.autologin",[e,n,t]),M},login:function a(e,n,t,i){function o(e,o,a){if(o){for(;M.level()>r;)M.pop(void 0,!0);ie.history&&ke.history().enable();var s=M.prefix_name(!0)+"_";ue.set(s+"token",o),ue.set(s+"login",e),ee=!1,is_function(t)&&t()}else n?(!a&&M.error(z().wrongPasswordTryAgain),M.pop(void 0,!0).set_mask(!1)):(ee=!1,!a&&M.error(z().wrongPassword),M.pop(void 0,!0).pop(void 0,!0)),is_function(i)&&i();M.off("terminal.autologin")}if(G.push([].slice.call(arguments)),ee)throw new Error(sprintf(z().notWhileLogin,"login"));if(!is_function(e))throw new Error(z().loginIsNotAFunction);if(ee=!0,M.token()&&1===M.level()&&!be)ee=!1,M.logout(!0);else if(M.token(!0)&&M.login_name(!0))return ee=!1,is_function(t)&&t(),M;ie.history&&ke.history().disable();var r=M.level();return M.on("terminal.autologin",function(e,n,t,i){o(n,t,i)}),M.push(function(n){M.set_mask(ie.maskChar).push(function(t){try{var i=e.call(M,n,t,function(e,t){o(n,e,t)});i&&is_function(i.then)&&(M.pause(),i.then(function(e){o(n,e),M.resume()}))}catch(n){h(n,"AUTH")}},{prompt:z().password+": ",name:"password"})},{prompt:z().login+": ",name:"login"}),M},settings:function e(){return ie},before_cursor:function d(e){var n=ke.position(),t=ke.get().substring(0,n),i=t.split(" "),o;if(!e)o=t;else if(1===i.length)o=i[0];else{var r=t.match(/(\\?")/g),a=r?r.filter(function(e){return!e.match(/^\\/)}).length:0;r=t.match(/'/g);var s=r?r.length:0;if(1==s%2)o=t.match(/('[^']*)$/)[0];else if(1==a%2)o=t.match(/("(?:[^"]|\\")*)$/)[0];else for(o=i[i.length-1],je=i.length-1;0<je;je--){var l=i[je-1];if("\\"===l[l.length-1])o=i[je-1]+" "+o;else break}}return o},complete:function g(e,n){function t(){for(var t=[],s=e.length;s--;)if(c.test(e[s])){var l=e[s];"\""===a&&(l=l.replace(/"/g,"\\\"")),!a&&n.escape&&(l=l.replace(/(["'() ])/g,"\\$1")),!o&&same_case(l)&&(r.toLowerCase()===r?l=l.toLowerCase():r.toUpperCase()===r&&(l=l.toUpperCase())),t.push(l)}return t}function i(e,n){var t=M.get_command(),i=M.get_position(),o=new RegExp("^"+e,"i"),r=t.substring(0,i),s=t.substring(i),l=n.replace(o,"")+(a||"");M.set_command(r+l+s),M.set_position((r+l).length)}n=$.extend({word:!0,echo:!1,escape:!0,caseSensitive:!0,doubleTab:null},n||{});var o=n.caseSensitive,r=M.before_cursor(n.word).replace(/\\"/g,"\""),a=!1;if(n.word&&(r.match(/^"/)?a="\"":r.match(/^'/)&&(a="'"),a&&(r=r.replace(/^["']/,""))),e=e.slice(),ie.clear&&-1===$.inArray("clear",e)&&e.push("clear"),ie.exit&&-1===$.inArray("exit",e)&&e.push("exit"),0==q%2)de=M.before_cursor(n.word);else{var s=M.before_cursor(n.word);if(s!==de)return}var l=$.terminal.escape_regex(r);n.escape&&(l=l.replace(/(\\+)(["'() ])/g,function(e,n,t){return t.match(/[()]/)?n+"\\?\\"+t:n+"?"+t}));var d=o?"":"i",c=new RegExp("^"+l,d),p=t();if(1===p.length)return n.escape?i(l,p[0]):M.insert(p[0].replace(c,"")+(a||"")),de=M.before_cursor(n.word),!0;if(1<p.length)if(!(2<=++q)){var m=common_string(r,p,o);if(m)return i(r,m),de=M.before_cursor(n.word),!0}else if(q=0,n.echo){if(is_function(n.doubleTab)){var h=n.doubleTab.call(M,r,p,y);return"undefined"==typeof h||h}if(!1!==n.doubleTab){y();var u=p.reverse().join("\t");M.echo($.terminal.escape_brackets(u),{keepWords:!0,formatters:!1})}return!0}},commands:function(){return ye.top().interpreter},set_interpreter:function i(e,n){function t(){M.pause(ie.softPause),p(e,n,function(e){M.resume();var n=ye.top();$.extend(n,e),R(!0)})}return is_function(n)?M.login(n,!0,t):"string"===get_type(e)&&n?M.login(m(e,n),!0,t):t(),M},greetings:function e(){return b(),M},paused:function e(){return _e},pause:function n(e){return Z(function(){ne(),_e=!0,ke.disable(e||is_android),e||ke.find(".prompt").hidden(),is_function(ie.onPause)&&ie.onPause.call(M)}),M},resume:function e(){return Z(function(){_e=!1,ge&&terminals.front()===M&&ke.enable(!0),ke.find(".prompt").visible();var e=te;te=[];for(var n=0;n<e.length;++n)M.exec.apply(M,e[n]);M.trigger("resume");var t=B.shift();t&&t(),M.scroll_to_bottom(),is_function(ie.onResume)&&ie.onResume.call(M)}),M},cols:function e(){return ie.numChars?ie.numChars:(("undefined"==typeof se||1e3===se)&&(se=get_num_chars(M,Q)),se)},rows:function e(){return ie.numRows?ie.numRows:("undefined"==typeof le&&(le=get_num_rows(M,Q)),le)},history:function e(){return ke.history()},history_state:function t(e){function n(){ie.historyState=!0,_save_state.length?1<terminals.length()&&M.save_state(null):M.save_state()}return e?"undefined"==typeof window.setImmediate?setTimeout(n,0):setImmediate(n):ie.historyState=!1,M},clear_history_state:function e(){return hash_commands=[],_save_state=[],M},next:function(){if(1===terminals.length())return M;terminals.front().disable();var e=terminals.rotate().enable(),n=e.offset().top-50;$("html,body").animate({scrollTop:n},500);try{trigger_terminal_change(e)}catch(n){h(n,"onTerminalChange")}return e},focus:function t(e,n){return Z(function(){if(1===terminals.length())!1===e?M.disable(n):M.enable(n);else if(!1===e)M.next();else{var t=terminals.front();if(t!==M&&(terminals.forEach(function(e){e!==M&&e.enabled()&&e.disable(n)}),!n))try{trigger_terminal_change(M)}catch(n){h(n,"onTerminalChange")}terminals.set(M),M.enable(n)}}),M},freeze:function n(e){return X(function(){e?(M.disable(),fe=!0):(fe=!1,M.enable())}),M},frozen:function e(){return fe},enable:function n(e){return ge||fe||(void 0===se&&M.resize(),Z(function(){var n;if(!e&&!ge)try{n=ie.onFocus.call(M,M)}catch(n){ie.onFocus=$.noop,h(n,"onFocus")}(!e&&void 0===n||e)&&(ge=!0,!M.paused()&&ke.enable(!0))})),M},disable:function n(e){return Z(function(){var n;if(!e&&ge)try{n=ie.onBlur.call(M,M)}catch(n){ie.onBlur=$.noop,h(n,"onBlur")}(!e&&void 0===n||e)&&(ge=!1,ke.disable())}),M},enabled:function e(){return ge},signature:function o(){for(var e=M.cols(),n=signatures.length,t;n--;)if(t=signatures[n].map(function(e){return e.length}),_Mathmax.apply(null,t)<=e)return signatures[n].join("\n")+"\n";return""},version:function e(){return $.terminal.version},cmd:function e(){return ke},get_command:function e(){return ke.get()},set_command:function t(e,n){return X(function(){"string"!=typeof e&&(e=JSON.stringify(e)),ke.set(e,void 0,n)}),M},set_position:function t(e,n){return X(function(){ke.position(e,n)}),M},get_position:function e(){return ke.position()},insert:function t(e,n){if("string"==typeof e)return X(function(){var t=M.is_bottom();ke.insert(e,n),(ie.scrollOnEcho||t)&&M.scroll_to_bottom()}),M;throw new Error(sprintf(z().notAString,"insert"))},set_prompt:function n(e){return X(function(){is_function(e)?ke.prompt(function(n){e.call(M,n,M)}):ke.prompt(e),ye.top().prompt=e}),M},get_prompt:function e(){return ye.top().prompt},set_mask:function n(e){return X(function(){ke.mask(!0===e?ie.maskChar:e)}),M},get_output:function n(e){return e?he:$.map(he,function(e){return is_function(e[0])?e[0]():e[0]}).join("\n")},resize:function r(e,n){if(!M.is(":visible"))M.stopTime("resize"),M.oneTime(500,"resize",function(){M.resize(e,n)});else{if(e&&n&&(M.width(e),M.height(n)),e=M.width(),n=M.height(),"undefined"!=typeof ie.numChars||"undefined"!=typeof ie.numRows)return ke.resize(ie.numChars),void M.refresh();var t=get_num_chars(M,Q),i=get_num_rows(M,Q);if(t!==se||i!==le){se=t,le=i,ke.resize(se),M.refresh();var o=ye.top();is_function(o.resize)?o.resize.call(M,M):is_function(ie.onResize)&&ie.onResize.call(M,M)}}return M},refresh:function e(){return 0!==Q.width&&M[0].style.setProperty("--char-width",Q.width),f({scroll:!1,update:!0}),M},flush:function i(e){e=$.extend({},{update:!1,scroll:!0},e||{});try{var n=M.is_bottom(),t;$.each(H,function(n,i){if(i===1)t=$("<div></div>");else if($.isPlainObject(i)&&is_function(i.finalize)){if(e.update){var o="> div[data-index="+i.index+"]",r=ae.find(o);r.html()!==t.html()&&r.replaceWith(t)}else t.appendTo(ae);i.finalize(t.attr("data-index",i.index))}else $("<div/>").html(i).appendTo(t).width("100%")}),_();try{ie.onFlush.call(M,M)}catch(n){ie.onFlush=$.noop,h(n,"onFlush")}(ie.scrollOnEcho&&e.scroll||n)&&M.scroll_to_bottom(),H=[]}catch(n){is_function(ie.exceptionHandler)?ie.exceptionHandler.call(M,n,"TERMINAL (Flush)"):alert_exception("[Flush]",n)}return M},update:function i(e,n,t){return X(function(){0>e&&(e=he.length+e),he[e]?null===n?(he.splice(e,1),ae.find("[data-index="+e+"]").remove()):(he[e][0]=n,t&&(he[e][1]=t),g({string:n,index:e,options:t}),M.flush({scroll:!1,update:!0})):M.error("Invalid line number "+e)}),M},remove_line:function n(e){return M.update(e,null)},last_index:function e(){return he.length-1},echo:function(e,n){function t(e){try{var t=$.extend({flush:!0,raw:ie.raw,finalize:$.noop,keepWords:!1,formatters:!0},n||{});(function(n){t.finalize=function(e){t.raw&&e.addClass("raw");try{is_function(n)&&n(e)}catch(t){h(t,"USER:echo(finalize)"),n=null}}})(t.finalize),t.flush&&(H.length&&M.flush(),H=[]),"function"==typeof e&&(e=e.bind(M)),g({string:e,options:t,index:he.length}),he.push([e,$.extend(t,{exec:!1})]),t.flush&&M.flush()}catch(n){is_function(ie.exceptionHandler)?ie.exceptionHandler.call(M,n,"TERMINAL (echo)"):alert_exception("[Terminal.echo]",n)}}return void 0!==e&&is_function(e.then)?$.when(e).done(t):t(e),M},error:function i(e,n){function t(e){"string"!=typeof e&&(e+="");var n=$.terminal.escape_brackets(e).replace(/\\$/,"&#92;").replace(url_re,"]$1[[;;;error]");return"[[;;;error]"+n+"]"}return n=$.extend({},n,{raw:!1,formatters:!1}),"function"==typeof e?M.echo(function(){return t(e.call(M))},n):e&&e.then?(e.then(function(e){M.echo(t(e))}),M):M.echo(t(e),n)},exception:function o(n,e){var t=exception_message(n);if(e&&(t="&#91;"+e+"&#93;: "+t),t&&M.error(t,{finalize:function n(e){e.addClass("exception message")},keepWords:!0}),"string"==typeof n.fileName&&(M.pause(ie.softPause),$.get(n.fileName,function(e){var t=n.lineNumber-1,i=e.split("\n")[t];i&&M.error("["+n.lineNumber+"]: "+i),M.resume()},"text")),n.stack){var i=$.terminal.escape_brackets(n.stack);M.echo(i.split(/\n/g).map(function(e){return"[[;;;error]"+e.replace(url_re,function(e){return"]"+e+"[[;;;error]"})+"]"}).join("\n"),{finalize:function n(e){e.addClass("exception stack-trace")},formatters:!1})}return M},scroll:function t(e){var n;return e=Math.round(e),oe.prop?(e>oe.prop("scrollTop")&&0<e&&oe.prop("scrollTop",0),n=oe.prop("scrollTop"),oe.scrollTop(n+e)):(e>oe.attr("scrollTop")&&0<e&&oe.attr("scrollTop",0),n=oe.attr("scrollTop"),oe.scrollTop(n+e)),M},logout:function n(e){if(ee)throw new Error(sprintf(z().notWhileLogin,"logout"));return X(function(){if(e){var n=G.pop();M.set_token(void 0,!0),M.login.apply(M,n)}else if(1===ye.size()&&M.token())M.logout(!0);else for(;1<ye.size();)M.token()?M.logout(!0).pop().pop():M.pop()}),M},token:function n(e){return ue.get(M.prefix_name(e)+"_token")},set_token:function i(e,n){var t=M.prefix_name(n)+"_token";return"undefined"==typeof e?ue.remove(t):ue.set(t,e),M},get_token:function n(e){return M.token(e)},login_name:function n(e){return ue.get(M.prefix_name(e)+"_login")},name:function e(){return ye.top().name},prefix_name:function i(e){var n=(ie.name?ie.name+"_":"")+Y;if(e&&1<ye.size()){var t=ye.map(function(e){return e.name||""}).slice(1).join("_");t&&(n+="_"+t)}return n},read:function(e,n,t){var i=jQuery.Deferred(),o=!1;return M.push(function(e){o=!0,i.resolve(e),is_function(n)&&n(e),M.pop(),ie.history&&ke.history().enable()},{name:"read",history:!1,prompt:e||"",onExit:function e(){o||(i.reject(),is_function(t)&&t())}}),ie.history&&ke.history().disable(),i.promise()},push:function t(e,n){return Z(function(){function t(){ie.onPush.call(M,o,ye.top(),M),R()}n=n||{};var i=$.extend({},{infiniteLogin:!1},n);!i.name&&re&&(i.name=re.name),void 0===i.prompt&&(i.prompt=(i.name||">")+" ");var o=ye.top();o&&(o.mask=ke.mask());var r=_e;p(e,n.login,function(n){if(ye.push($.extend({},n,i)),!0===i.completion&&($.isArray(n.completion)?ye.top().completion=n.completion:!n.completion&&(ye.top().completion=!1)),i.login){var o=get_type(i.login),a;"function"===o?(a=i.infiniteLogin?$.noop:M.pop,M.login(i.login,i.infiniteLogin,t,a)):("string"===get_type(e)&&"string"===o||"boolean"===o)&&(a=i.infiniteLogin?$.noop:M.pop,M.login(m(e,i.login),i.infiniteLogin,t,a))}else t();!r&&M.enabled()&&M.resume()})}),M},pop:function r(e,n){void 0!==e&&y(e);var t=M.token(!0),i;if(1!==ye.size()){t&&C();var o=ye.pop();if(i=ye.top(),R(),n||ie.onPop.call(M,o,i),ee&&M.get_prompt()!==z().login+": "&&(ee=!1),is_function(o.onExit))try{o.onExit.call(M,M)}catch(n){o.onExit=$.noop,h(n,"onExit")}M.set_mask(i.mask)}else if(i=ye.top(),!ie.login)M.error(z().canExitError);else if(n||ie.onPop.call(M,i,null,M),T(),is_function(ie.onExit))try{ie.onExit.call(M,M)}catch(n){ie.onExit=$.noop,h(n,"onExit")}return M},option:function t(e,n){if("undefined"==typeof n){if("string"==typeof e)return ie[e];"object"===_typeof(e)&&$.each(e,function(e,n){ie[e]=n})}else ie[e]=n,e.match(/^num(Chars|Rows)$/)&&f();return M},invoke_key:function c(n){var t=n.toUpperCase().split("+"),i=t.pop(),o=-1!==t.indexOf("CTRL"),r=-1!==t.indexOf("SHIFT"),a=-1!==t.indexOf("ALT"),s=-1!==t.indexOf("META"),l=$.Event("keydown",{ctrlKey:o,shiftKey:r,altKey:a,metaKey:s,which:Ee[i],key:i}),d=$(document.documentElement||window);return d.trigger(l),l=$.Event("keypress"),l.key=i,l.which=l.keyCode=0,d.trigger(l),M},keymap:function(e,n){if(0===arguments.length)return ke.keymap();if("undefined"==typeof n){if("string"==typeof e)return ke.keymap(e);$.isPlainObject(e)&&(e=$.omap(e||{},function(n,t){return Ie[n]?function(i,e){return t.call(M,i,function(){return Ie[n](i,e)})}:t.bind(M)}),ke.keymap(e))}else if("function"==typeof n){var t=e;Ie[t]?ke.keymap(t,function(i,e){return n.call(M,i,function(){return Ie[t](i,e)})}):ke.keymap(t,n.bind(M))}},level:function e(){return ye.size()},reset:function e(){return X(function(){for(M.clear();1<ye.size();)ye.pop();S()}),M},purge:function e(){return X(function(){var e=M.prefix_name()+"_",n=ue.get(e+"interpreters");n&&$.each(JSON.parse(n),function(e,n){ue.remove(n+"_commands"),ue.remove(n+"_token"),ue.remove(n+"_login")}),ke.purge(),ue.remove(e+"interpreters")}),M},destroy:function e(){return X(function(){ke.destroy().remove(),ae.remove(),Re.remove(),$(document).unbind(".terminal_"+M.id()),$(window).unbind(".terminal_"+M.id()),M.unbind("click wheel mousewheel mousedown mouseup"),M.removeData("terminal").removeClass("terminal").unbind(".terminal"),ie.width&&M.css("width",""),ie.height&&M.css("height",""),$(window).off("blur",D).off("focus",F),M.find(".terminal-fill").remove(),M.stopTime(),terminals.remove(Y),ve&&(ve.unobserve?ve.unobserve(M[0]):clearInterval(ve)),we&&we.disconnect(),M.resizer("unbind"),Ae.resizer("unbind").remove(),terminals.length()||$(window).off("hashchange"),me=!0}),M},scroll_to_bottom:function n(){var e;return e=oe.prop?oe.prop("scrollHeight"):oe.attr("scrollHeight"),oe.scrollTop(e),M},is_bottom:function o(){if(-1===ie.scrollBottomOffset)return!1;var e,n,t;M.is("body")?(e=$(document).height(),n=$(window).scrollTop(),t=window.innerHeight):(e=oe[0].scrollHeight,n=oe.scrollTop(),t=oe.outerHeight());var i=e-ie.scrollBottomOffset;return n+t>i}},function(n,e){return function(){if(me&&!ie.exceptionHandler)throw new $.terminal.Exception(z().defunctTerminal);try{return e.apply(M,[].slice.apply(arguments))}catch(t){if("exec"!==n&&"resume"!==n&&h(t,t.type||"TERMINAL",!0),!ie.exceptionHandler)throw t}}}));var Te={3:"Cancel",6:"Help",8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",28:"Convert",29:"NonConvert",30:"Accept",31:"ModeChange",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",41:"Select",42:"Print",43:"Execute",44:"PrintScreen",45:"Insert",46:"Delete",48:["0",")"],49:["1","!"],50:["2","@"],51:["3","#"],52:["4","$"],53:["5","%"],54:["6","^"],55:["7","&"],56:["8","*"],57:["9","("],91:"OS",93:"ContextMenu",144:"NumLock",145:"ScrollLock",181:"VolumeMute",182:"VolumeDown",183:"VolumeUp",186:[";",":"],187:["=","+"],188:[",","<"],189:["-","_"],190:[".",">"],191:["/","?"],192:["`","~"],219:["[","{"],220:["\\","|"],221:["]","}"],222:["'","\""],224:"Meta",225:"AltGraph",246:"Attn",247:"CrSel",248:"ExSel",249:"EraseEof",250:"Play",251:"ZoomOut"};for(je=1;25>je;je++)Te[111+je]="F"+je;var Ce="";for(je=65;91>je;je++)Ce=_StringfromCharCode(je),Te[je]=[Ce.toLowerCase(),Ce.toUpperCase()];var Ee={};Object.keys(Te).forEach(function(e){Te[e]instanceof Array?Te[e].forEach(function(n){Ee[n.toUpperCase()]=e}):Ee[Te[e].toUpperCase()]=e}),!0===ie.ignoreSystemDescribe&&(ie.describe=!1),ie.width&&M.width(ie.width),ie.height&&M.height(ie.height),oe=null===ie.scrollObject?M:$(ie.scrollObject),oe.is("body")&&!is_safari&&(oe=$("html,body")),$(document).bind("ajaxSend.terminal_"+M.id(),function(n,e){requests.push(e)});var Re=$("<div class=\"terminal-wrapper\"/>").appendTo(M),Ae=$("<div class=\"font\">&nbsp;</div>").appendTo(M),Se=$("<div class=\"terminal-fill\"/>").appendTo(M);if(ae=$("<div>").addClass("terminal-output").attr("role","log").appendTo(Re),M.addClass("terminal"),ie.login&&is_function(ie.onBeforeLogin))try{!1===ie.onBeforeLogin.call(M,M)&&(be=!1)}catch(n){ie.onBeforeLogin=$.noop,h(n,"onBeforeLogin")}var Le;if("string"==typeof e)Le=e;else if(e instanceof Array)for(var je=0,Oe=e.length;je<Oe;++je)if("string"==typeof e[je]){Le=e[je];break}var Pe;is_function(ie.login)?Pe=ie.login:Le&&("string"==typeof ie.login||!0===ie.login)&&(Pe=m(Le,ie.login)),terminals.append(M),$(document).on("paste.terminal_"+M.id(),N);var Ie=$.extend({},W,$.omap(ie.keymap||{},function(n,t){return W[n]?function(i,e){return t.call(M,i,function(){return W[n](i,e)})}:t.bind(M)}));return p(e,ie.login,function(e){function n(n){if(n=n.originalEvent,n){var t=document.elementFromPoint(n.clientX,n.clientY);!$(t).closest(".terminal").length&&M.enabled()&&M.disable()}}function t(){var e=Q.width;Q=get_char_size(M),e!==Q.width&&ke.option("char_width",Q.width).refresh()}function i(){if(M.is(":visible")){var e=Se.width(),n=Se.height();(pe!==n||ce!==e)&&M.resize(),pe=n,ce=e}}function o(){M.resizer("unbind").resizer(i),Ae.resizer("unbind").resizer(function(){t(),M.resize()})}function a(){function e(){M.is(":visible")&&!r?(r=!0,o(),t(),i(),n&&M.enable()):r&&!M.is(":visible")&&(r=!1,n=$.terminal.active()===M&&M.enabled(),M.disable())}ve&&(ve.unobserve?ve.unobserve(M[0]):clearInterval(ve));var n=M.enabled(),r=M.is(":visible");r&&o(),window.IntersectionObserver?(ve=new IntersectionObserver(e,{root:document.body}),ve.observe(M[0])):ve=setInterval(e,400)}function s(e){var n=terminals.get()[e[0]];if(n&&Y===n.id()){if(!e[2])return t.resolve(),t.promise();if(_e){var t=$.Deferred();return B.push(function(){return n.exec(e[2]).done(function(){n.save_state(e[2],!0,e[1]),t.resolve()})}),t.promise()}return n.exec(e[2]).done(function(){n.save_state(e[2],!0,e[1])})}}(ie.completion&&"boolean"!=typeof ie.completion||!ie.completion)&&(e.completion="settings"),ye=new Stack($.extend({},ie.extra,{name:ie.name,prompt:ie.prompt,keypress:ie.keypress,keydown:ie.keydown,resize:ie.onResize,greetings:ie.greetings,mousewheel:ie.mousewheel,history:ie.history,keymap:Ie},e)),ke=$("<div/>").appendTo(Re).cmd({prompt:ie.prompt,history:ie.memory?"memory":ie.history,historyFilter:ie.historyFilter,historySize:ie.historySize,caseSensitiveSearch:ie.caseSensitiveSearch,width:"100%",enabled:!1,char_width:Q.width,keydown:O,keymap:Ie,clickTimeout:ie.clickTimeout,holdTimeout:ie.holdTimeout,holdRepeatTimeout:ie.holdRepeatTimeout,keypress:P,tabs:ie.tabs,onCommandChange:function n(e){if(is_function(ie.onCommandChange))try{ie.onCommandChange.call(M,e,M)}catch(n){ie.onCommandChange=$.noop,h(n,"onCommandChange")}M.scroll_to_bottom()},commands:w}),M.oneTime(100,function(){$(document).bind("click.terminal_"+M.id(),n).bind("contextmenu.terminal_"+M.id(),n)});var l=$(window);document.addEventListener("resume",function(){M.disable()}),is_mobile?M.click(function(){fe||(M.enabled()?M.disable():ke.enable())}):(l.on("focus.terminal_"+M.id(),F).on("blur.terminal_"+M.id(),D),function(){function e(){if(r.is(".terminal")||r.is(".terminal-wrapper")){var e=M.get_command().length;M.set_position(e)}else r.closest(".prompt").length&&M.set_position(0);o.is(":focus")||o.focus(),n()}function n(){t=0,r=null}var t=0,i="click_"+M.id(),o=M.find(".cmd textarea"),r,a;M.find(".cmd textarea").on("focus",function(){"undefined"!=typeof a&&oe.scrollTop(a)}).on("blur",function(){a=oe.scrollTop()}),M.mousedown(function(n){scrollbar_event(n,Se)||(r=$(n.target))}).mouseup(function(){if(""===get_selected_text()&&r)if(1!=++t)M.stopTime(i);else if(!fe)if(!ge);else{var o=ie.clickTimeout;return void M.oneTime(o,i,e)}n()}).dblclick(function(){n(),M.stopTime(i)})}(),function(){var n=M.find(".cmd textarea");M.on("contextmenu.terminal",function(t){if(""===get_selected_text()&&!$(t.target).is("img,value,audio,object,canvas,a")){M.enabled()||M.enable();var e=ke.offset();n.css({left:t.pageX-e.left-20,top:t.pageY-e.top-20,width:"5em",height:"4em"}),n.is(":focus")||n.focus(),M.stopTime("textarea"),M.oneTime(100,"textarea",function(){n.css({left:"",top:"",width:"",height:""})}),M.stopTime("selection"),M.everyTime(20,"selection",function(){n[0].selection!==n[0].value&&get_textarea_selection(n[0])&&(clear_textarea_selection(n[0]),select(M.find(".terminal-output")[0],M.find(".cmd div:last-of-type")[0]),M.stopTime("selection"))})}})}()),M.on("click","a",function(n){var e=$(this);if(e.closest(".exception").length){var t=e.attr("href");t.match(/:[0-9]+$/)&&(n.preventDefault(),r(t))}ge&&M.find(".cmd textarea").focus()}),i(),M.is(":visible")&&o();var d=!!M.closest("body").length,c=window.MutationObserver||window.WebKitMutationObserver;c&&(we=new c(function(){M.closest("body").length?(!d&&(M.scroll_to_bottom(),window.IntersectionObserver&&a(),i()),d=!0):d&&(d=!1)}),we.observe(document.body,{childList:!0})),d&&a(),J.resolve(),ge&&M.is(":visible")&&!is_mobile?M.focus(void 0,!0):M.disable(),is_function(Pe)?M.login(Pe,!0,S):S(),ie.execHash?location.hash?setTimeout(function(){try{var e=location.hash.replace(/^#/,"");hash_commands=JSON.parse(decodeURIComponent(e));var n=0;(function e(){var t=hash_commands[n++];t?s(t).done(e):change_hash=!0})()}catch(n){}}):change_hash=!0:change_hash=!0,function(){function n(e,n){if(!t){var i=ye.top(),o;if(is_function(i.mousewheel)?o=i.mousewheel(e,n,M):is_function(ie.mousewheel)&&(o=ie.mousewheel(e,n,M)),(k()||!1===o)&&(e.stopPropagation(),e.preventDefault()),!1===o)return!1;if(!0===o)return;0<n?M.scroll(-40):M.scroll(40)}}var t=!1;if($(document).bind("keydown.terminal_"+M.id(),function(n){n.shiftKey&&(t=!0)}).bind("keyup.terminal_"+M.id(),function(n){(n.shiftKey||16===n.which)&&(t=!1)}),$.event.special.mousewheel)M.on("mousewheel",n);else{var e=document.createElement("div"),i;i="onwheel"in e?"wheel":void 0===document.onmousewheel?"DOMMouseScroll":"mousewheel",e=null,M.on(i,function(t){var e;e="mousewheel"===i?-1/40*t.originalEvent.wheelDelta:t.originalEvent.deltaY||t.originalEvent.detail,n(t,-e)})}}()}),M.data("terminal",M),M}});
"use strict";var ws={stream:[],startup:"local",monitor:{home:!1,local:!1,public:!1,tag:!1,notification:!1,list:!1}};function stream_errmsg(a){return 1005===a?"No Status Recvd":1006===a?"Abnormal Closure":"Undefined error"}function push_monitor(a,b,c){var d=$.terminal.active();if("tag"===a&&"string"!=typeof b)return d.error("Hashtag is undefined."),!1;var e={};if("home"===a||"notification"===a){for(var q=0;q<ws.stream.length;q++)if("user"===ws.stream[q].type)return ws.monitor[a]=!0,!0;e.type="user"}else if("tag"===a){for(var i=0;i<ws.stream.length;i++)if("tag"===ws.stream[i].type&&ws.stream[i].name===b)return ws.monitor.tag=!0,!0;e.type="tag",e.name=b}else if("list"===a){for(var r=0;r<ws.stream.length;r++)if("list"===ws.stream[r].type&&ws.stream[r].list_id===c)return ws.monitor.list=!0,!0;e.type="list",e.list_id=c}else{for(var s=0;s<ws.stream.length;s++)if(ws.stream[s].type===a)return ws.monitor[a]=!0,!0;e.type=a}var f=ins.get(),g="wss://"+f.domain+"/api/v1/streaming?access_token="+f.access_token;if("home"===a||"notification"===a)g+="&stream=user";else if("local"===a)g+="&stream=public:local";else if("public"===a)g+="&stream=public";else if("tag"===a)g+="&stream=hashtag&tag="+b;else if("list"===a)g+="&stream=list&list="+c;else if("direct"===a)g+="&stream=direct";else return d.error("Monitor stream type error."),!1;var h="home"===a||"notification"===a?"<i class=\"fa fa-home\" aria-hidden=\"true\"></i> USER":"local"===a?"<i class=\"fa fa-users\" aria-hidden=\"true\"></i> LOCAL":"public"===a?"<i class=\"fa fa-globe\" aria-hidden=\"true\"></i> GLOBAL":"tag"===a?"<i class=\"fa fa-tag\" aria-hidden=\"true\"></i> HASHTAG: "+b:"list"===a?"<i class=\"fa fa-list\" aria-hidden=\"true\"></i> LIST: "+c:"???";ws.monitor[a]=!0;var j=config_notify(),k=!1;for(var t in j)k=k||t;var l="home"===a||"notification"===a?function(a){var b,c=JSON.parse(a.data);if("delete"===c.event)b=c.payload,$("[name=id_"+b+"]").addClass("status_deleted"),j.delete&&d.error("deleted ID:"+b);else if("notification"===c.event&&!0===ws.monitor.notification){b=JSON.parse(c.payload);var i=make_notification(b,j);d.echo(i.html,{raw:!0});var k=config.find(["instances","terminal","notification"]);if("undefined"==typeof k&&(k={}),beep_buf&&!0===config.find(["instances","terminal","boop"])){var l=context.createBufferSource();l.buffer=beep_buf,l.connect(context.destination),l.start(0)}var e,f;if("favourite"===b.type&&k.favourite&&i.html?(e="\u304A\u6C17\u306B\u5165\u308A\uFF1A ",f=b.status.content):"reblog"===b.type&&k.reblog&&i.html?(e="\u30D6\u30FC\u30B9\u30C8\uFF1A ",f=b.status.content):"mention"===b.type&&k.mention&&i.html?(e="\u30EA\u30D7\u30E9\u30A4\uFF1A ",f=b.status.content):"follow"===b.type&&k.following&&i.html&&(e="\u30D5\u30A9\u30ED\u30FC\uFF1A "),"string"==typeof f&&(f=$(f).text(),100<f.length&&(f=f.slice(0,100))),"undefined"!=typeof e){e+=b.account.display_name+" @"+b.account.acct;var m=new Notification(e,{body:f,icon:b.account.avatar_static,data:b});m.onclick=function(a){a.srcElement.close()}}}else if("update"===c.event&&!0===ws.monitor.home){b=JSON.parse(c.payload);var n=makeStatus(b,{tl_name:h});if(n.visibility){if(d.echo(n.html,{raw:!0}),n.notification.voice){var g=new SpeechSynthesisUtterance(n.notification.voice);g.rate=1.3,g.lang="ja-JP",speechSynthesis.speak(g)}if(n.notification.desktop){var o=new Notification(n.notification.desktop.title,{body:n.notification.desktop.body,icon:n.notification.desktop.icon,data:n.payload});o.onclick=function(a){a.srcElement.close()}}}}reduce_output()}:function(a){var b,c=JSON.parse(a.data);if("delete"===c.event)b=c.payload,$("[name=id_"+b+"]").addClass("status_deleted"),j.delete&&d.error("deleted ID:"+b);else if("update"===c.event){b=JSON.parse(c.payload);var f=makeStatus(b,{tl_name:h});if(f.visibility){if(d.echo(f.html,{raw:!0}),f.notification.voice){var e=new SpeechSynthesisUtterance(f.notification.voice);e.rate=1.3,e.lang="ja-JP",speechSynthesis.speak(e)}if(f.notification.desktop){var g=new Notification(f.notification.desktop.title,{body:f.notification.desktop.body,icon:f.notification.desktop.icon,data:f.payload});g.onclick=function(a){a.srcElement.close()}}}}reduce_output()},m=function(){d.echo(a+" Streaming start.")},n=function(b){d.echo(a+" Streaming closed."),1006===b.code&&(d.error("Abnormal error. reconnecting..."),setTimeout(p,1e4))},o=function(b){d.error(a+" Streaming error. closed."),term_error("streaming error",b),1006===b.code&&(d.error("Abnormal error. reconnecting..."),setTimeout(p,1e4))},p=function(){var a=ws.stream.findIndex(function(a){return a.ws.url===g});0<=a&&ws.stream.splice(a,1);var b=new WebSocket(g);b.onmessage=l,b.onopen=m,b.onerror=o,b.onclose=n,e.ws=b,ws.stream.push(e)};p()}
"use strict";String.prototype.column_text=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:20;5<a||(a=20);var b=this,c=b.mlength,d=a-3;for(c>a&&(b=b.msubstr(0,d,!0),b+="..."+(b.mlength===d?"":" "));a>b.mlength;)b+=" ";return b},String.prototype.mdash=function(){return this.replace(/\u200D([\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]\uFE0F?)/g,"").replace(/\uFE0F?\u20E3|\uD83C[\uDDE6-\uDDFF]/g,"-").replace(/\uD83C\uDFF4(\uDB40[\uDC61-\uDC7A])+?\uDB40\uDC7F|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"--").replace(/[\u0100-\uFF60\uFFE0-\uFFE6]/g,"--")},String.prototype.mCharAt=function(){for(var a,b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:-1,d=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],e=this,f="",g="",h=!0;e&&0<=b;){if(a=e.match(/^(\ud83d[\udc68-\udc69](?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92])|(?:\ud83c[\udfcb\udfcc]|\ud83d\udd75|\u26f9)(?:\ufe0f|\ud83c[\udffb-\udfff])\u200d[\u2640\u2642]\ufe0f|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd37-\udd39\udd3d\udd3e\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|(?:[\u0023\u002a\u0030-\u0039])\ufe0f?\u20e3|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddd1-\udddd]|[\u270a\u270b])(?:\ud83c[\udffb-\udfff]|)|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud800\udc00|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef8]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd4c\udd50-\udd6b\udd80-\udd97\uddc0\uddd0\uddde-\udde6]|[\u23e9-\u23ec\u23f0\u23f3\u2640\u2642\u2695\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a]|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u00a9\u00ae\u203c\u2049\u2122\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2694\u2696\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|.)/),g=f,f=a?a[0]:"",b--,0<f.length&&!f.match(/^[\u0000-\u0100\uFF61-\uFFDC\uFFE8-\uFFEE]$/))if(d&&h){f=g,h=!1;continue}else d||b--;h=!0,e=e.replace(RegExp("^"+f),"")}return e||0>b?f:""},String.prototype.msubstr=function(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:void 0,d=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],e="",f="";"undefined"==typeof b&&(b=this.mlength);for(var g=a+b;g>a;)f=this.mCharAt(a++),f.match(/^[\u0000-\u0100\uFF61-\uFFDC\uFFE8-\uFFEE]$/)||a++,e+=f;return d&&e.mlength!==pos_to&&(e=e.replace(RegExp(f+"$"),"")),e},String.prototype.escape_html=function(){return this.replace(/[&'`"<>]/g,function(a){return{"&":"&amp;","'":"&#x27;","`":"&#x60;",'"':"&quot;","<":"&lt;",">":"&gt;"}[a]})},Object.defineProperty(String.prototype,"mlength",{get:function a(){return this.mdash().length},enumerable:!0,configurable:!0});
"use strict";Date.prototype.passing_total_seconds=function(){return parseInt((Date.now()-this.getTime())/1e3)},Date.prototype.passing_total_days=function(){return parseInt(this.passing_total_seconds()/86400)},Date.prototype.passing_minutes=function(){return parseInt(this.passing_total_seconds()/60)%60},Date.prototype.passing_hours=function(){return parseInt(this.passing_total_seconds()/3600)%24},Date.prototype.passing_days=function(){return parseInt(this.passing_total_seconds()/86400)%7},Date.prototype.passing_weeks=function(){return parseInt(this.passing_total_seconds()/604800)},Date.prototype.getDayName=function(){return["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][this.getDay()]},Date.prototype.getDayName=function(){return["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][this.getDay()]},Date.prototype.getMonthName=function(){return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][this.getMonth()]},Date.prototype.getTimeFormat=function(){var a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],b=("0"+this.getHours().toString()).substr(-2,2)+":"+("0"+this.getMinutes().toString()).substr(-2,2)+":"+("0"+this.getSeconds().toString()).substr(-2,2);return a&&(b+=" "+("00"+this.getMilliseconds().toString()).substr(-3,3)),b},Date.prototype.term_date=function(){var a=new Date;return"".concat(a.getMonthName()," ").concat(a.getDate()," ").concat(a.getTimeFormat(!0))},Date.prototype.snowflake=function(){var a=!!(0<arguments.length&&arguments[0]!==void 0)&&arguments[0],b=65535*this.valueOf()+parseInt(a?65536*Math.random():0);return b.toString()};
"use strict";var cnt,GlobalModeElement=function(){function a(){this._cmd_mode="global",this._dataset=[{type:"command",name:"show",description:"\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"instances",description:"\u5168\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u306E\u6982\u8981\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_instance_statistics,children:[{type:"command",name:"statistics",description:"\u5168\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u306E\u6982\u8981\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_instance_statistics},{type:"paramater",name:"instance_name",description:"\u6307\u5B9A\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u306E\u8A73\u7D30\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_instance_detail}]},{type:"command",name:"running-config",description:"\u8A2D\u5B9A\u3055\u308C\u305F\u30B3\u30F3\u30D5\u30A3\u30B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",execute:this.show_running_config},{type:"command",name:"startup-config",description:"\u4FDD\u5B58\u3055\u308C\u305F\u30B3\u30F3\u30D5\u30A3\u30B0\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",execute:this.show_startup_config},{type:"command",name:"version",description:"\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_version},{type:"command",name:"clock",description:"\u73FE\u5728\u6642\u523B\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_clock},{type:"command",name:"tech-support",description:"\u30B5\u30DD\u30FC\u30C8\u554F\u3044\u5408\u308F\u305B\u7528\u30EC\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u3092\u51FA\u529B\u3057\u307E\u3059\u3002",execute:this.show_tech,children:[{type:"command",name:"encrypt",optional:"encrypt",description:"\u30D5\u30A1\u30A4\u30EB\u3092\u6697\u53F7\u5316\u3057\u307E\u3059\u3002",execute:this.show_tech}]}]},{type:"command",name:"instance",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u30E2\u30FC\u30C9\u306B\u79FB\u884C\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"instance_name",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u540D",execute:this.entry_instance}]},{type:"command",name:"delete",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u306E\u524A\u9664\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"instance",children:[{type:"paramater",name:"instance_name",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u540D",execute:this.delete_instance}]}]},{type:"command",name:"configure",description:"\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059",children:[{type:"command",name:"terminal",description:"\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059",execute:this.configure_terminal}]},{type:"command",name:"reload",description:"\u753B\u9762\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u307E\u3059\u3002",execute:this.reload},{type:"command",name:"clear",description:"\u753B\u9762\u3092\u6D88\u53BB\u3057\u307E\u3059\u3002",execute:this.clear},{type:"command",name:"write",description:"\u8A2D\u5B9A\u3092\u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",execute:this.write_memory,children:[{type:"command",name:"memory",description:"\u8A2D\u5B9A\u3092\u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002",execute:this.write_memory},{type:"command",name:"erase",description:"\u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306B\u4FDD\u5B58\u3055\u308C\u305F\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",execute:this.write_erase}]},{type:"command",name:"reset",description:"\u30BF\u30FC\u30DF\u30CA\u30EB\u306E\u72B6\u614B\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u307E\u3059\u3002",children:[{type:"command",name:"display-size",description:"\u30BF\u30FC\u30DF\u30CA\u30EB\u30B5\u30A4\u30BA\u3092\u81EA\u52D5\u8ABF\u6574\u3057\u307E\u3059\u3002",execute:this.reset_display_size}]},{type:"command",name:"help",description:"\u30D8\u30EB\u30D7\u30A6\u30A4\u30F3\u30C9\u30A6\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.help}]}return Object.defineProperty(a.prototype,"dataset",{get:function a(){return this._dataset},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"cmd_mode",{get:function a(){return this._cmd_mode},enumerable:!0,configurable:!0}),a.prototype.show_running_config=function(a){var b=JSON.stringify(config.config,null,"    ").replace(/\[/g,"\uFF3B");return a.echo(b),!0},a.prototype.show_startup_config=function(a){var b,c=localStorage,d=c.getItem("configuration");return d?(b=JSON.parse(d),b=JSON.stringify(b,null,"    ")):b="startup-config is not present",a.echo(b),!0},a.prototype.show_version=function(a){return a.echo(["Mastodon Client Tooterminal, Version "+client_info.version+", RELEASE SERVICE(Beta)","Technical Support: "+client_info.website,"Copyright (c) "+client_info.modified.getFullYear()+" by "+client_info.auther,"Updated "+client_info.modified.toDateString()+" by "+client_info.acct,"","Powered by:","jQuery ("+$.fn.jquery+")","https://jquery.org","jQuery Terminal Emulator Plugin ("+$.terminal.version+")","http://terminal.jcubic.pl","autosize (4.0.2)","http://www.jacklmoore.com/autosize","twemoji(v11.0.1)","https://twitter.github.io/twemoji/","","License info:","Tooterminal, jQuery, jQuery Terminal Emulator Plugin, autosize is licensed by MIT LICENSE","https://tldrlegal.com/license/mit-license"].join("\n")),!0},a.prototype.reset_display_size=function(a){return a.resize(window.innerWidth-36,window.innerHeight-36),!0},a.prototype.show_instance_statistics=function(a){var b=["","name      | domain                      | scope | username","--------------------------------------------------------------------"],c=0;for(var d in ins.instances){var e=ins.get(d);b.push(("| "+("undefined"==typeof e.user?"":"@"+e.user.username)).addTab("|  "+(e.application.scopes.read?"r":"-")+(e.application.scopes.write?"w":"-")+(e.application.scopes.follow?"f":"-"),8).addTab("| "+e.domain,30).addTab(d,10)),c++}return b.push("--------------------------------------------------------------------"),b.push(" \u767B\u9332\u4EF6\u6570: "+c+"\u4EF6"),b.push(""),a.echo(b.join("\n")),!0},a.prototype.show_instance_detail=function(a,b){var c=ins.name(b.paramaters.instance_name),d=ins.get();if(!d)return a.error("instance has no regist"),!1;var e=["Instance",tab("Name:",c,15),tab("Domain:",d.domain,15),"","Application",tab("Client Name:",d.application.name,17),tab("Client ID:",d.client_id,17),tab("Client Secret:",d.client_secret,17),tab("Website:",d.application.website,17),tab("Redirect URI:",d.application.uris,17),tab("Read:",d.application.scopes.read,17),tab("Write:",d.application.scopes.write,17),tab("Follow:",d.application.scopes.follow,17),"","Autheorized user",tab("Access Token:",d.access_token,20),tab("Monitor defaults:",d.monitor,20),tab("User Account:","@"+d.user.acct,20),tab("User ID:",d.user.id,20)];return more(a,e,!0),!0},a.prototype.entry_instance=function(a,b){function c(){var b=this,c=callAPI("/api/v1/accounts/verify_credentials"),e=callAPI("/api/v1/instance"),f=callAPI("/api/v1/custom_emojis");$.when(c,e,f).then(function(c,e,f){var g=c[0],h=parse_account(g),i=f[0]||[];a.echo("<span>Hello! ".concat(h.parsed_display_name," @").concat(h.acct_full,"</span>"),{raw:!0}),d.user=g,d.info=e[0],emojis.add_custom_emojis(i.map(function(a){return{keyword:a.shortcode,code:":".concat(a.shortcode,":"),payload:a}})),ins.save(),a.resume();var j=d.user.username;return j+="@"+d.domain+"# ",delete d.auth_code,a.push(enterCommand,{name:"instance",prompt:j,onStart:init_instance,onExit:exit_instance,exit:!1}),b},function(c){return console.log(c),a.error("Getting user status failed.("+c.status+")"),a.resume(),b})}ins.name(b.paramaters.instance_name);var d=ins.get();if("undefined"==typeof d)ins.create(b.paramaters.instance_name),a.push(regist_instance,{prompt:"Input instance domain: ",onExit:function a(){ins.save()},keydown:function c(a,b){67===a.keyCode&&a.ctrlKey&&(b.echo(b.get_prompt()+b.get_command()),b.pop(),b.set_command(""))}});else if(d.hasOwnProperty("auth_code"))a.pause(),$.ajax({url:"https://"+d.domain+"/oauth/token",type:"POST",dataType:"json",data:{grant_type:"authorization_code",client_id:d.client_id,client_secret:d.client_secret,code:d.auth_code,redirect_uri:d.application.uris}}).then(function(a){return d.access_token=a.access_token,d.token_type=a.token_type,delete d.auth_code,ins.save(),c()},function(b){a.error("User token updating error.("+b.status+")"),delete d.auth_code,console.log(b)}).then(function(){},function(){a.push(enterCommand,{name:"instance",prompt:prompt,onStart:function b(a){term_mode=mode_instance,a.exec("login")},onExit:exit_instance,exit:!1})});else if(d.hasOwnProperty("access_token"))a.pause(),c();else{var e="@"+d.domain+"# ";a.echo("Enter 'login' and regist your access_token"),a.resume(),a.push(enterCommand,{name:"instance",prompt:e,onStart:function b(a){term_mode=mode_instance,a.exec("login")},onExit:exit_instance,exit:!1})}return!0},a.prototype.delete_instance=function(a,b){var c=ins.name(b.paramaters.instance_name),d=ins.get(),e="Instance \""+c+"\" registration will delete! Continue? [confirm]";return"undefined"==typeof d?(a.error("no instance registration."),!1):(a.push(function(){ins.delete(),a.echo("[OK]"),a.echo("Erase of instance: complete"),a.pop()},{prompt:e,keypress:function c(a,b){b.set_command(""),b.echo(e+a.key),b.echo("File system erase is not confirmed or Could not be completed"),b.pop()}}),!0)},a.prototype.configure_terminal=function(a){return a.push(enterCommand,{name:"configuration",prompt:"Tooterminal(config)# ",onStart:function a(){term_mode=mode_configuration},onExit:function a(){term_mode=mode_global},exit:!0}),!0},a.prototype.write_memory=function(a){var b=localStorage;return a.echo("Building configuration..."),b.setItem("configuration",JSON.stringify(config.config)),a.echo("[OK]"),!0},a.prototype.write_erase=function(a){a.push(function(){var b=localStorage;b.removeItem("configuration"),a.echo("[OK]"),a.echo("Erase of nvram: complete"),a.pop()},{prompt:"Erasing the localStorage will remove all configuration files! Continue? [confirm]",keypress:function c(a,b){b.set_command(""),b.echo("Erasing the localStorage will remove all configuration files! Continue? [confirm]"+a.key),b.echo("File system erase is not confirmed or Could not be completed"),b.pop()}})},a.prototype.reload=function(){return location.reload(),!0},a.prototype.clear=function(a){return a.clear(),!0},a.prototype.show_clock=function(a){return a.echo(Date().toString()),!0},a.prototype.show_tech=function(a,b){var c=localStorage.getItem("configuration");c=c?JSON.parse(c):{};var d=new Date,e=localStorage.getItem("term_error");e=e?JSON.parse(e):[];var f=JSON.stringify({running_config:config.config,startup_config:c,default_config:config.default,instances:ins.instances,status:{created_at:d.getTime(),location:location.href},errors:e}),g="tech-support_"+d.getFullYear()+("0"+(d.getMonth()+1)).substr(-2)+("0"+d.getDate()).substr(-2)+("0"+d.getHours()).substr(-2)+("0"+d.getMinutes()).substr(-2)+("0"+d.getSeconds()).substr(-2)+".txt",h="";if(b.optional.encrypt){var j=[];for(f=encodeURIComponent(f);f.length;){var i=f.slice(0,30);j.push(i.cipher),f=f.slice(30)}h=j.join("\n")}else h=f;return OutputText(h,g),!0},a.prototype.help=function(a){return $("#help").slideDown("first"),a.disable(),$(document).on("keydown.help",function(a){27===a.keyCode&&$("#help_close").trigger("click")}),!0},a}(),regist_instance=function(a,b){if(a=a.trim(),!a.match(/^([A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+$/))b.error("domain couldn't unrecognize"),ins.delete();else if(0<a.length){b.pause();var c="https://"+a+"/api/v1/apps",d=location.origin+location.pathname,e=d.match(/^https?:\/\/([^\/:]+)(?::(\d+))?/),f=e&&!e[1].match(/(?:\d+\.){3}\d+$/);f||(d="urn:ietf:wg:oauth:2.0:oob");var g={client_name:config.find("application.name"),redirect_uris:d,website:config.find("application.website"),scopes:(config.find("application.scopes.read")?"read ":"")+(config.find("application.scopes.write")?"write ":"")+(config.find("application.scopes.follow")?"follow":"")};$.ajax({url:c,dataType:"json",type:"POST",data:g}).then(function(c){var d=c.redirect_uri,e=ins.name();"undefined"==typeof d&&(d=g.redirect_uris),f&&(d+="?instance_name="+e);var h=JSON.parse(JSON.stringify(config.find("instances")));h.client_id=c.client_id,h.client_secret=c.client_secret,h.domain=a,h.application=config.find("application"),h.application.uris=d;var i="@"+h.domain+"# ";b.echo("New instance registed. enter 'login' and regist your access_token"),ins.set(h),b.resume(),b.push(enterCommand,{name:"instance",prompt:i,onStart:function b(a){term_mode=mode_instance,i="@"+h.domain+"# ",h.hasOwnProperty("user")?(i=h.user.username+i,a.set_prompt(i)):a.exec("login")},onExit:function a(){term_mode=mode_global,ins.name("")},exit:!1})},function(d){var e="Failed to connect the instance \""+a+"\"";ins.delete(),b.error(e),term_error(e,{path:c,opts:data,jqxhr:d}),b.resume()})}b.pop()};
"use strict";function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}var ConfigurationModeElement=function(){function a(){this._cmd_mode="configuration",this._dataset=[{type:"command",name:"application",description:"\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u767B\u9332\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"name",description:"\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u540D\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"string",description:"\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u540D",execute:this.set_paramater}]},{type:"command",name:"website",description:"\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3Web\u30DA\u30FC\u30B8\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"string",description:"URL",execute:this.set_paramater}]},{type:"command",name:"scopes",description:"\u30A2\u30AF\u30BB\u30B9\u6A29\u9650\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"read",description:"\u8AAD\u307F\u53D6\u308A",execute:this.set_default},{type:"command",name:"write",description:"\u66F8\u304D\u8FBC\u307F",execute:this.set_default},{type:"command",name:"follow",description:"\u30D5\u30A9\u30ED\u30FC",execute:this.set_default}]}]},{type:"command",name:"terminal",description:"\u30BF\u30FC\u30DF\u30CA\u30EB\u8868\u793A\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"length",description:"\u30C8\u30A5\u30FC\u30C8\u8868\u793A\u4EF6\u6570\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"number",name:"posts",min:1,max:40,description:"\u8868\u793A\u4EF6\u6570(\u30C7\u30D5\u30A9\u30EB\u30C820)",execute:this.set_number}]}]},{type:"command",name:"instances",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u767B\u9332\u306E\u969B\u306E\u96DB\u5F62\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"terminal",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"monitor",description:"\u53D6\u5F97\u3059\u308B\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"home",description:"\u30DB\u30FC\u30E0\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"local",description:"\u30ED\u30FC\u30AB\u30EB\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"public",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"notification",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array}]},{type:"command",name:"logging",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u8868\u793A\u3059\u308B\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"delete",description:"\u524A\u9664\u3055\u308C\u305F\u30C8\u30A5\u30FC\u30C8ID\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default}]},{type:"command",name:"notification",optional:"desktop_notification",description:"\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"boop",description:"\u901A\u77E5\u97F3\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"length",description:"\u30C8\u30A5\u30FC\u30C8\u306E\u53D6\u5F97\u6570\u306B\u3064\u3044\u3066\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"number",name:"number",max:100,min:0,description:"\u53D6\u5F97\u6570(\u521D\u671F\u502420)",execute:this.set_number}]},{type:"command",name:"auto",description:"\u30ED\u30B0\u30A4\u30F3\u5F8C\u3001terminal monitor\u3092\u81EA\u52D5\u767A\u884C\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"status",description:"\u30C8\u30A5\u30FC\u30C8\u8868\u793A\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"avatar",description:"\u30A2\u30A4\u30B3\u30F3\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true,children:[{type:"command",name:"standard",description:"\u5E38\u306B\u30A2\u30A4\u30B3\u30F3\u3092\u8868\u793A\u3057\u3001\u30DE\u30A6\u30B9\u30AA\u30FC\u30D0\u30FC\u3067\u52D5\u753BGIF\u3092\u518D\u751F\u3057\u307E\u3059\u3002",execute:this.set_command},{type:"command",name:"animation",description:"\u5E38\u306B\u52D5\u753BGIF\u3092\u518D\u751F\u3057\u307E\u3059\u3002",execute:this.set_command},{type:"command",name:"mouseover",description:"\u30A2\u30A4\u30B3\u30F3\u306F\u975E\u8868\u793A\u3001\u30DE\u30A6\u30B9\u30AA\u30FC\u30D0\u30FC\u3067\u8868\u793A\u3068\u52D5\u753BGIF\u3092\u518D\u751F\u3057\u307E\u3059\u3002",execute:this.set_command}]},{type:"command",name:"thumbnail",description:"\u30B5\u30E0\u30CD\u30A4\u30EB\u753B\u50CF\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"separator",description:"\u30B9\u30C6\u30FC\u30BF\u30B9\u8868\u793A\u306B\u533A\u5207\u308A\u7DDA\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"visibility",description:"\u6295\u7A3F\u7BC4\u56F2\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"public",description:"\u516C\u958B",execute:this.set_command},{type:"command",name:"unlisted",description:"\u672A\u53CE\u8F09",execute:this.set_command},{type:"command",name:"private",description:"\u975E\u516C\u958B",execute:this.set_command},{type:"command",name:"direct",description:"\u30C0\u30A4\u30EC\u30AF\u30C8",execute:this.set_command}]},{type:"command",name:"request-timeout",description:"\u30EA\u30AF\u30A8\u30B9\u30C8\u306B\u5BFE\u3059\u308B\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u6642\u9593\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"number",name:"number",max:300,min:1,description:"\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u6642\u9593(\u79D2)",execute:this.set_number}]}]},{type:"command",name:"emojis",description:"\u7D75\u6587\u5B57\u95A2\u9023\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"visible_in_picker",description:"unlisted\u30AB\u30B9\u30BF\u30E0\u7D75\u6587\u5B57\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"debug",description:"\u30C7\u30D0\u30C3\u30B0\u95A2\u9023\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"development",description:"\u958B\u767A\u8005\u30E2\u30FC\u30C9\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"tofu-on-fire",description:"\u8C46\u8150\u30AA\u30F3\u30D5\u30A1\u30A4\u30A2",execute:this.set_true}]},{type:"command",name:"no",optional:"is_no",description:"\u8A2D\u5B9A\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"terminal",description:"\u30BF\u30FC\u30DF\u30CA\u30EB\u8868\u793A\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"length",description:"\u30BF\u30FC\u30DF\u30CA\u30EB\u8868\u793A\u884C\u6570\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",execute:this.set_default}]},{type:"command",name:"instances",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u767B\u9332\u306E\u969B\u306E\u96DB\u5F62\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"terminal",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"monitor",description:"\u53D6\u5F97\u3059\u308B\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"home",description:"\u30DB\u30FC\u30E0\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"local",description:"\u30ED\u30FC\u30AB\u30EB\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"public",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"notification",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array}]},{type:"command",name:"logging",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u8868\u793A\u3059\u308B\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",execute:this.set_false,children:[{type:"command",name:"delete",description:"\u524A\u9664\u3055\u308C\u305F\u30C8\u30A5\u30FC\u30C8ID\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false}]},{type:"command",name:"notification",optional:"desktop_notification",description:"\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",execute:this.set_false,children:[{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default}]},{type:"command",name:"boop",description:"\u901A\u77E5\u97F3\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_default}]},{type:"command",name:"broadcast-to",description:"\u6295\u7A3F\u7BC4\u56F2\u3092\u524A\u9664\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"status",description:"\u30C8\u30A5\u30FC\u30C8\u8868\u793A\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"avatar",description:"\u30A2\u30A4\u30B3\u30F3\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"thumbnail",description:"\u30B5\u30E0\u30CD\u30A4\u30EB\u753B\u50CF\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"separator",description:"\u30B9\u30C6\u30FC\u30BF\u30B9\u8868\u793A\u306B\u533A\u5207\u308A\u7DDA\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default}]}]},{type:"command",name:"emojis",description:"\u7D75\u6587\u5B57\u95A2\u9023\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"visible_in_picker",description:"unlisted\u30AB\u30B9\u30BF\u30E0\u7D75\u6587\u5B57\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default}]},{type:"command",name:"debug",description:"\u30C7\u30D0\u30C3\u30B0\u95A2\u9023\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"development",description:"\u958B\u767A\u8005\u30E2\u30FC\u30C9\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"tofu-on-fire",description:"\u8C46\u8150\u30AA\u30F3\u30D5\u30A1\u30A4\u30A2",execute:this.set_default}]}]},{type:"command",name:"exit",description:"\u30B3\u30F3\u30D5\u30A3\u30AE\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30E2\u30FC\u30C9\u306B\u623B\u308A\u307E\u3059\u3002",execute:this.exit_configuration},{type:"command",name:"end",description:"\u30B3\u30F3\u30D5\u30A3\u30AE\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30E2\u30FC\u30C9\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002",execute:this.exit_configuration}]}return Object.defineProperty(a.prototype,"dataset",{get:function a(){return this._dataset},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"cmd_mode",{get:function a(){return this._cmd_mode},enumerable:!0,configurable:!0}),a.prototype.set_paramater=function(a,b){for(var c=b.line_parsed.length-1,d=[],e=0;e<b.line_parsed.length-1;e++)d.push(b.line_parsed[e].name);return config.write(d,b.paramaters.string)},a.prototype.set_default=function(a,b){"no"===b.line_parsed[0].name&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length-1;d++)c.push(b.line_parsed[d].name);return config.erase(c)},a.prototype.set_number=function(a,b){var c=b.line_parsed.length-1,d=b.line_parsed[c];console.log(d);for(var e=[],f=0;f<c;f++)e.push(b.line_parsed[f].name);return config.write(e,d.param)},a.prototype.set_true=function(a,b){"no"===b.line_parsed[0].name&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length;d++)c.push(b.line_parsed[d].name);return!0===b.optional.desktop_notification?Notification.requestPermission(function(a){"granted"===a?config.write(c,!0):console.log("Desktop-Notification is rejected: "+a)}):config.write(c,!0),!0},a.prototype.set_false=function(a,b){"no"===b.line_parsed[0].name&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length;d++)c.push(b.line_parsed[d].name);return config.write(c,!1)},a.prototype.set_command=function(a,b){for(var c=[],d=0;d<b.line_parsed.length-1;d++)c.push(b.line_parsed[d].name);return config.write(c,b.line_parsed.pop().name)},a.prototype.set_object=function(a,b){for(var c=[],d=0;d<b.line_parsed.length;d++)c.push(b.line_parsed[d].name);return"object"===_typeof(config.find(c))||config.write(c,{})},a.prototype.set_array=function(a,b){!0===b.optional.is_no&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length-1;d++)c.push(b.line_parsed[d].name);var e=config.find(c);return"object"!==_typeof(e)&&(e=[]),e=e.filter(function(a){return a!==b.line_parsed[3].name}),!0!==b.optional.is_no&&e.unshift(b.line_parsed[3].name),config.write(c,e)},a.prototype.entry_instance=function(a,b){return ins.instances.hasOwnProperty(b.paramaters.instance_name)?(a.push(enterCommand,{name:"ins_config",prompt:"Tooterminal(config-ins)# ",onStart:function a(){term_mode=mode_config_instance,ins.name(b.paramaters.instance_name)},onExit:function a(){term_mode=mode_configuration,ins.name("")}}),!0):(a.error("No instance name."),!1)},a.prototype.set_broadcast=function(a){return a.echo("executed!"),!0},a.prototype.exit_configuration=function(a){return a.pop(),!0},a}();
"use strict";function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}var InstanceConfigModeElement=function(){function a(){this._cmd_mode="configuration",this._dataset=[{type:"command",name:"terminal",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"monitor",description:"\u53D6\u5F97\u3059\u308B\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"home",description:"\u30DB\u30FC\u30E0\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"local",description:"\u30ED\u30FC\u30AB\u30EB\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"public",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"notification",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array}]},{type:"command",name:"logging",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u8868\u793A\u3059\u308B\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"delete",description:"\u524A\u9664\u3055\u308C\u305F\u30C8\u30A5\u30FC\u30C8ID\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_default}]},{type:"command",name:"notification",optional:"desktop_notification",description:"\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u306E\u901A\u77E5\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"length",description:"\u30C8\u30A5\u30FC\u30C8\u306E\u53D6\u5F97\u6570\u306B\u3064\u3044\u3066\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"number",name:"number",max:100,min:0,description:"\u53D6\u5F97\u6570(\u521D\u671F\u502420)",execute:this.set_number}]},{type:"command",name:"auto",description:"\u30ED\u30B0\u30A4\u30F3\u5F8C\u3001terminal monitor\u3092\u81EA\u52D5\u767A\u884C\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"status",description:"\u30C8\u30A5\u30FC\u30C8\u8868\u793A\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",children:[{type:"command",name:"avatar",description:"\u30A2\u30A4\u30B3\u30F3\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true,children:[{type:"command",name:"standard",description:"\u5E38\u306B\u30A2\u30A4\u30B3\u30F3\u3092\u8868\u793A\u3057\u3001\u30DE\u30A6\u30B9\u30AA\u30FC\u30D0\u30FC\u3067\u52D5\u753BGIF\u3092\u518D\u751F\u3057\u307E\u3059\u3002",execute:this.set_command},{type:"command",name:"animation",description:"\u5E38\u306B\u52D5\u753BGIF\u3092\u518D\u751F\u3057\u307E\u3059\u3002",execute:this.set_command},{type:"command",name:"mouseover",description:"\u30A2\u30A4\u30B3\u30F3\u306F\u975E\u8868\u793A\u3001\u30DE\u30A6\u30B9\u30AA\u30FC\u30D0\u30FC\u3067\u8868\u793A\u3068\u52D5\u753BGIF\u3092\u518D\u751F\u3057\u307E\u3059\u3002",execute:this.set_command}]},{type:"command",name:"thumbnail",description:"\u30B5\u30E0\u30CD\u30A4\u30EB\u753B\u50CF\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true},{type:"command",name:"separator",description:"\u30B9\u30C6\u30FC\u30BF\u30B9\u8868\u793A\u306B\u533A\u5207\u308A\u7DDA\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.set_true}]},{type:"command",name:"visibility",description:"\u6295\u7A3F\u7BC4\u56F2\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"public",description:"\u516C\u958B",execute:this.set_command},{type:"command",name:"unlisted",description:"\u672A\u53CE\u8F09",execute:this.set_command},{type:"command",name:"private",description:"\u975E\u516C\u958B",execute:this.set_command},{type:"command",name:"direct",description:"\u30C0\u30A4\u30EC\u30AF\u30C8",execute:this.set_command}]},{type:"command",name:"no",optional:"is_no",description:"\u8A2D\u5B9A\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"terminal",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"monitor",description:"\u53D6\u5F97\u3059\u308B\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"home",description:"\u30DB\u30FC\u30E0\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"local",description:"\u30ED\u30FC\u30AB\u30EB\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"public",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array},{type:"command",name:"notification",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.set_array}]},{type:"command",name:"logging",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306B\u8868\u793A\u3059\u308B\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",execute:this.set_false,children:[{type:"command",name:"delete",description:"\u524A\u9664\u3055\u308C\u305F\u30C8\u30A5\u30FC\u30C8ID\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_false}]},{type:"command",name:"notification",optional:"desktop_notification",description:"\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u901A\u77E5\u306E\u8A2D\u5B9A\u3092\u3057\u307E\u3059\u3002",execute:this.set_false,children:[{type:"command",name:"favourite",description:"\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"reblog",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"mention",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u901A\u77E5\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default}]}]},{type:"command",name:"broadcast-to",description:"\u6295\u7A3F\u7BC4\u56F2\u3092\u524A\u9664\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"status",description:"\u30C8\u30A5\u30FC\u30C8\u8868\u793A\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"avatar",description:"\u30A2\u30A4\u30B3\u30F3\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"thumbnail",description:"\u30B5\u30E0\u30CD\u30A4\u30EB\u753B\u50CF\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default},{type:"command",name:"separator",description:"\u30B9\u30C6\u30FC\u30BF\u30B9\u8868\u793A\u306B\u533A\u5207\u308A\u7DDA\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",execute:this.set_default}]}]},{type:"command",name:"exit",description:"\u30B3\u30F3\u30D5\u30A3\u30AE\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30E2\u30FC\u30C9\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002",execute:this.exit_configuration},{type:"command",name:"end",description:"\u30B3\u30F3\u30D5\u30A3\u30AE\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30E2\u30FC\u30C9\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002",execute:this.exit_configuration}]}return Object.defineProperty(a.prototype,"dataset",{get:function a(){return this._dataset},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"cmd_mode",{get:function a(){return this._cmd_mode},enumerable:!0,configurable:!0}),a.prototype.set_paramater=function(a,b){for(var c=b.line_parsed.length-1,d=[],e=0;e<b.line_parsed.length-1;e++)d.push(b.line_parsed[e].name);return config.write(d,b.paramaters.string)},a.prototype.set_default=function(a,b){"no"===b.line_parsed[0].name&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length-1;d++)c.push(b.line_parsed[d].name);return config.erase(c)},a.prototype.set_number=function(a,b){var c=parseInt(b.paramaters.number);return config.write(["instances","terminal","length"],c)},a.prototype.set_true=function(a,b){"no"===b.line_parsed[0].name&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length;d++)c.push(b.line_parsed[d].name);return!0===b.optional.desktop_notification?Notification.requestPermission(function(a){"granted"===a?config.write(c,!0):console.log("Desktop-Notification is rejected: "+a)}):config.write(c,!0),!0},a.prototype.set_false=function(a,b){"no"===b.line_parsed[0].name&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length;d++)c.push(b.line_parsed[d].name);return config.write(c,!1)},a.prototype.set_command=function(a,b){for(var c=[],d=0;d<b.line_parsed.length-1;d++)c.push(b.line_parsed[d].name);return config.write(c,b.line_parsed.pop().name)},a.prototype.set_object=function(a,b){for(var c=[],d=0;d<b.line_parsed.length;d++)c.push(b.line_parsed[d].name);return"object"===_typeof(config.find(c))||config.write(c,{})},a.prototype.set_array=function(a,b){!0===b.optional.is_no&&b.line_parsed.shift();for(var c=[],d=0;d<b.line_parsed.length-1;d++)c.push(b.line_parsed[d].name);var e=config.find(c);return"object"!==_typeof(e)&&(e=[]),e=e.filter(function(a){return a!==b.line_parsed[3].name}),!0!==b.optional.is_no&&e.unshift(b.line_parsed[3].name),config.write(c,e)},a.prototype.set_broadcast=function(a){return a.echo("executed!"),!0},a.prototype.exit_configuration=function(a){return a.pop(),!0},a}();
"use strict";function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}var InstanceModeElement=function(){function e(){this._cmd_mode="global",this._user_max=9999999,this._list_max=99999,this._sh_stats_opt=[{type:"command",name:"limit",optional:"limit",description:"\u53D6\u5F97\u30C8\u30A5\u30FC\u30C8\u6570",children:[{type:"number",name:"post_limits",min:1,max:40,description:"\u30C8\u30A5\u30FC\u30C8\u6570(\u521D\u671F\u502420)",execute:this.show_statuses,children:[{type:"command",name:"max_id",optional:"max_id",description:"\u6307\u5B9AID\u4EE5\u524D\u306E\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A",children:[{type:"paramater",name:"status_id",description:"\u30C8\u30A5\u30FC\u30C8ID",execute:this.show_statuses}]},{type:"command",name:"max_date",optional:"max_date",description:"\u6307\u5B9A\u65E5\u6642\u4EE5\u524D\u306E\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A(SnowFlake\u6E96\u62E0)",children:[{type:"paramater",name:"datetime",description:"\u65E5\u4ED8\u6642\u523B",execute:this.show_statuses}]}]}]},{type:"command",name:"max_id",optional:"max_id",description:"\u6307\u5B9AID\u4EE5\u524D\u306E\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A",children:[{type:"paramater",name:"status_id",description:"\u30C8\u30A5\u30FC\u30C8ID",execute:this.show_statuses,children:[{type:"command",name:"limit",optional:"limit",description:"\u53D6\u5F97\u30C8\u30A5\u30FC\u30C8\u6570",children:[{type:"number",name:"post_limits",min:1,max:40,description:"\u30C8\u30A5\u30FC\u30C8\u6570(\u521D\u671F\u502420)",execute:this.show_statuses}]}]}]},{type:"command",name:"max_date",optional:"max_date",description:"\u6307\u5B9A\u65E5\u6642\u4EE5\u524D\u306E\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A(SnowFlake\u6E96\u62E0)",children:[{type:"paramater",name:"datetime",description:"\u65E5\u4ED8\u6642\u523B",execute:this.show_statuses,children:[{type:"command",name:"limit",optional:"limit",description:"\u53D6\u5F97\u30C8\u30A5\u30FC\u30C8\u6570",children:[{type:"number",name:"post_limits",min:1,max:40,description:"\u30C8\u30A5\u30FC\u30C8\u6570(\u521D\u671F\u502420)",execute:this.show_statuses}]}]}]}],this._acl_opts=[{type:"command",name:"color",optional:"is_color",description:"\u80CC\u666F\u8272\u3092\u8A2D\u5B9A\u3057\u307E\u3059",children:[{type:"command",name:"red",description:"\u8D64\u8272",execute:this.set_acl},{type:"command",name:"green",description:"\u7DD1\u8272",execute:this.set_acl},{type:"command",name:"blue",description:"\u9752\u8272",execute:this.set_acl},{type:"command",name:"yellow",description:"\u9EC4\u8272",execute:this.set_acl},{type:"command",name:"purple",description:"\u7D2B\u8272",execute:this.set_acl},{type:"command",name:"cyan",description:"\u6C34\u8272",execute:this.set_acl},{type:"command",name:"dark-red",description:"\u6FC3\u8D64\u8272",execute:this.set_acl},{type:"command",name:"dark-blue",description:"\u7D3A\u8272",execute:this.set_acl},{type:"command",name:"dark-green",description:"\u6DF1\u7DD1\u8272",execute:this.set_acl},{type:"command",name:"dark-yellow",description:"\u5C71\u5439\u8272",execute:this.set_acl},{type:"command",name:"dark-purple",description:"\u7D2B\u7D3A\u8272",execute:this.set_acl},{type:"command",name:"dark-cyan",description:"\u85CD\u8272",execute:this.set_acl}]},{type:"command",name:"notification",optional:"is_notify",description:"\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7\u901A\u77E5\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",execute:this.set_acl},{type:"command",name:"voice",optional:"is_voice",description:"\u5408\u6210\u97F3\u58F0\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"voice_text",description:"\u6587\u5B57",execute:this.set_acl}]}],this._request_api=[{type:"paramater",name:"path",description:"API\u306E\u30D1\u30B9\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002",execute:this.request_api,children:[{type:"command",name:"json",optional:"json",description:"JSON\u5F62\u5F0F\u306E\u30C7\u30FC\u30BF\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"json",description:"JSON\u5F62\u5F0F\u306E\u30C7\u30FC\u30BF\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002",execute:this.request_api}]}]}],this._lists=[{type:"command",name:"delete",description:"\u30EA\u30B9\u30C8\u3092\u524A\u9664\u3057\u307E\u3059\u3002",execute:this.list_delete},{type:"command",name:"add_account",description:"\u30EA\u30B9\u30C8\u306B\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u8FFD\u52A0\u3057\u307E\u3059\u3002",children:[{type:"command",name:"id",description:"\u30E6\u30FC\u30B6\u30FCID\u3092\u6307\u5B9A",children:[{type:"number",name:"user_id",max:this._user_max,min:1,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.list_account}]}]},{type:"command",name:"remove_account",description:"\u30EA\u30B9\u30C8\u304B\u3089\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"id",description:"\u30E6\u30FC\u30B6\u30FCID\u3092\u6307\u5B9A",children:[{type:"number",name:"user_id",max:this._user_max,min:1,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.list_account}]}]}],this._dataset=[{type:"command",name:"toot",description:"\u66F8\u304D\u8FBC\u307F\u3092\u6295\u7A3F\u3057\u307E\u3059\u3002",execute:this.toot,children:[{type:"command",name:"public",description:"\u516C\u958B\u7BC4\u56F2\u3092 \"\u516C\u958B\" \u306B\u8A2D\u5B9A\u3057\u307E\u3059\u3002",execute:this.toot},{type:"command",name:"unlisted",description:"\u516C\u958B\u7BC4\u56F2\u3092 \"\u672A\u53CE\u8F09\" \u306B\u8A2D\u5B9A\u3057\u307E\u3059\u3002",execute:this.toot},{type:"command",name:"private",description:"\u516C\u958B\u7BC4\u56F2\u3092 \"\u975E\u516C\u958B\" \u306B\u8A2D\u5B9A\u3057\u307E\u3059\u3002",execute:this.toot}]},{type:"command",name:"show",description:"\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"access-list",description:"\u6B63\u898F\u8868\u73FE\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_acl},{type:"command",name:"terminal",description:"\u518D\u751F\u4E2D\u306E\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_terminal},{type:"command",name:"emojis",description:"\u7D75\u6587\u5B57\u3092\u8868\u793A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"custom",description:"\u30AB\u30B9\u30BF\u30E0\u7D75\u6587\u5B57\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_emojis_custom,children:[{type:"command",name:"picker",description:"\u7D75\u6587\u5B57\u30D1\u30EC\u30C3\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_emojis_custom,children:[{type:"paramater",name:"keyword",description:"\u691C\u7D22\u30EF\u30FC\u30C9",execute:this.show_emojis_custom}]},{type:"command",name:"summary",description:"\u30AB\u30B9\u30BF\u30E0\u7D75\u6587\u5B57\u306E\u4E00\u89A7\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_emojis_custom,children:[{type:"paramater",name:"keyword",description:"\u691C\u7D22\u30EF\u30FC\u30C9",execute:this.show_emojis_custom}]},{type:"command",name:"detail",description:"\u30AB\u30B9\u30BF\u30E0\u7D75\u6587\u5B57\u306E\u8A73\u7D30\u3092\u8868\u793A\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"shortcode",description:"\u30B7\u30E7\u30FC\u30C8\u30B3\u30FC\u30C9",execute:this.show_emojis_custom_detail}]}]}]},{type:"command",name:"user",description:"\u30E6\u30FC\u30B6\u30FC\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_user,children:[{type:"command",name:"id",description:"\u30E6\u30FC\u30B6\u30FCID\u3092\u6307\u5B9A",children:[{type:"number",name:"userid",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6ID",execute:this.show_user,children:[{type:"command",name:"statuses",description:"\u30E6\u30FC\u30B6\u306E\u6700\u65B0\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A",execute:this.show_statuses,children:this._sh_stats_opt.concat([{type:"command",name:"pinned",optional:"pinned",description:"\u56FA\u5B9A\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_statuses},{type:"command",name:"media",optional:"media",description:"\u30E1\u30C7\u30A3\u30A2\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_statuses}])},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_follows},{type:"command",name:"followers",description:"\u30D5\u30A9\u30ED\u30EF\u30FC\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_follows}]}]},{type:"command",name:"self",description:"\u30ED\u30B0\u30A4\u30F3\u30E6\u30FC\u30B6\u30FC",execute:this.show_user,children:[{type:"command",name:"statuses",description:"\u30E6\u30FC\u30B6\u306E\u6700\u65B0\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A",execute:this.show_statuses,children:this._sh_stats_opt.concat([{type:"command",name:"pinned",optional:"pinned",description:"\u56FA\u5B9A\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_statuses},{type:"command",name:"media",optional:"media",description:"\u30E1\u30C7\u30A3\u30A2\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_statuses}])},{type:"command",name:"following",description:"\u30D5\u30A9\u30ED\u30FC\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_follows},{type:"command",name:"followers",description:"\u30D5\u30A9\u30ED\u30EF\u30FC\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_follows}]},{type:"command",name:"name",description:"\u30E6\u30FC\u30B6\u540D\u30FB\u30A2\u30AB\u30A6\u30F3\u30C8\u540D\u304B\u3089\u691C\u7D22\u8868\u793A",children:[{type:"paramater",name:"account",description:"\u30E6\u30FC\u30B6\u540D\u30FB\u30A2\u30AB\u30A6\u30F3\u30C8\u540D",execute:this.show_user}]}]},{type:"command",name:"instance",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_instance},{type:"command",name:"application",description:"\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_application},{type:"command",name:"timeline",description:"\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306E\u6700\u65B0\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_statuses,children:[{type:"command",name:"home",description:"\u30DB\u30FC\u30E0\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3",execute:this.show_statuses,children:this._sh_stats_opt},{type:"command",name:"local",description:"\u30ED\u30FC\u30AB\u30EB\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3",execute:this.show_statuses,children:this._sh_stats_opt},{type:"command",name:"public",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3",execute:this.show_statuses,children:this._sh_stats_opt},{type:"command",name:"tag",description:"\u30CF\u30C3\u30B7\u30E5\u30BF\u30B0",children:[{type:"paramater",name:"tag_name",description:"\u30BF\u30B0\u540D",execute:this.show_statuses,children:this._sh_stats_opt}]},{type:"command",name:"notifications",description:"\u901A\u77E5\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3",execute:this.show_notifications,children:this._sh_stats_opt.concat([{type:"command",name:"mention",optional:"exclude_types",description:"\u30EA\u30D7\u30E9\u30A4\u306E\u307F\u8868\u793A",execute:this.show_notifications},{type:"command",name:"reblog",optional:"exclude_types",description:"\u30D6\u30FC\u30B9\u30C8\u306E\u307F\u8868\u793A",execute:this.show_notifications},{type:"command",name:"favourite",optional:"exclude_types",description:"\u304A\u6C17\u306B\u5165\u308A\u306E\u307F\u8868\u793A",execute:this.show_notifications},{type:"command",name:"follow",optional:"exclude_types",description:"\u30D5\u30A9\u30ED\u30FC\u306E\u307F\u8868\u793A",execute:this.show_notifications}])},{type:"command",name:"list",description:"\u30EA\u30B9\u30C8",children:[{type:"number",name:"list_id",max:this._list_max,min:1,description:"\u30EA\u30B9\u30C8ID",execute:this.show_statuses,children:this._sh_stats_opt}]},{type:"command",name:"direct",description:"\u30C0\u30A4\u30EC\u30AF\u30C8\u30E1\u30C3\u30BB\u30FC\u30B8",execute:this.show_statuses,children:this._sh_stats_opt}]},{type:"command",name:"statuses",description:"\u30C8\u30A5\u30FC\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002",children:[{type:"command",name:"id",description:"\u30C8\u30A5\u30FC\u30C8ID\u3092\u6307\u5B9A",children:[{type:"paramater",name:"status_id",description:"\u30C8\u30A5\u30FC\u30C8ID",execute:this.show_status_id,children:[{type:"command",name:"favourited",description:"\u304A\u6C17\u306B\u5165\u308A\u30E6\u30FC\u30B6\u30FC\u4E00\u89A7",execute:this.show_follows},{type:"command",name:"reblogged",description:"\u30D6\u30FC\u30B9\u30C8\u30E6\u30FC\u30B6\u30FC\u4E00\u89A7",execute:this.show_follows}]}]}]},{type:"command",name:"lists",description:"\u30EA\u30B9\u30C8\u306E\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002",execute:this.show_lists,children:[{type:"number",name:"list_id",max:this._list_max,min:1,description:"\u30EA\u30B9\u30C8ID",execute:this.show_list_accounts,children:[{type:"command",name:"accounts",description:"\u30EA\u30B9\u30C8ID",execute:this.show_list_accounts}]}]}]},{type:"command",name:"search",description:"\u691C\u7D22\u3092\u884C\u3044\u307E\u3059",children:[{type:"command",name:"local",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u5185\u304B\u3089\u691C\u7D22\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"query",description:"\u691C\u7D22\u30AD\u30FC\u30EF\u30FC\u30C9",execute:this.search_query}]},{type:"command",name:"tootsearch",description:"tootsearch\u30A8\u30F3\u30B8\u30F3\u3092\u5229\u7528\u3057\u3066\u691C\u7D22\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"query",description:"\u691C\u7D22\u30AD\u30FC\u30EF\u30FC\u30C9",execute:this.search_query}]}]},{type:"command",name:"login",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u306B\u30ED\u30B0\u30A4\u30F3\u3092\u3057\u3001\u30A2\u30AF\u30BB\u30B9\u30C8\u30FC\u30AF\u30F3\u3092\u66F4\u65B0\u3057\u307E\u3059",execute:this.login},{type:"command",name:"list",description:"\u30EA\u30B9\u30C8\u306B\u95A2\u3059\u308B\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059\u3002",children:[{type:"command",name:"create",description:"\u30EA\u30B9\u30C8\u3092\u65B0\u898F\u4F5C\u6210\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"list_name",description:"\u30EA\u30B9\u30C8\u540D",execute:this.list_create}]},{type:"command",name:"id",description:"\u4F5C\u6210\u6E08\u307F\u306E\u30EA\u30B9\u30C8ID\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"number",name:"list_id",max:this._list_max,min:1,description:"\u30EA\u30B9\u30C8ID",children:this._lists}]}]},{type:"command",name:"terminal",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u306E\u8A2D\u5B9A\u3092\u884C\u3044\u307E\u3059\u3002",execute:this.terminal_monitor,children:[{type:"command",name:"monitor",optional:"on_monitor",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u6709\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.terminal_monitor,children:[{type:"command",name:"notification",description:"\u901A\u77E5\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",execute:this.terminal_monitor},{type:"command",name:"home",description:"\u30DB\u30FC\u30E0\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",execute:this.terminal_monitor},{type:"command",name:"local",description:"\u30ED\u30FC\u30AB\u30EB\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",execute:this.terminal_monitor},{type:"command",name:"public",description:"\u9023\u5408\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",execute:this.terminal_monitor},{type:"command",name:"tag",description:"\u30CF\u30C3\u30B7\u30E5\u30BF\u30B0\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"hashtag",description:"\u30CF\u30C3\u30B7\u30E5\u30BF\u30B0\u6587\u5B57\u5217",execute:this.terminal_monitor}]},{type:"command",name:"list",description:"\u30EA\u30B9\u30C8\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"list_id",description:"\u30EA\u30B9\u30C8ID",execute:this.terminal_monitor}]},{type:"command",name:"direct",description:"\u30C0\u30A4\u30EC\u30AF\u30C8\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u30E2\u30CB\u30BF\u30FC\u3057\u307E\u3059\u3002",execute:this.terminal_monitor}]},{type:"command",name:"no",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.terminal_monitor,optional:"no_monitor",children:[{type:"command",name:"monitor",description:"\u30B9\u30C8\u30EA\u30FC\u30DF\u30F3\u30B0\u3092\u7121\u52B9\u306B\u3057\u307E\u3059\u3002",execute:this.terminal_monitor}]}]},{type:"command",name:"request",description:"\u4ED6\u30E6\u30FC\u30B6\u30FC\u306B\u5BFE\u3057\u3066\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u9001\u4FE1\u3057\u307E\u3059\u3002",children:[{type:"command",name:"follow",description:"\u30D5\u30A9\u30ED\u30FC\u3057\u307E\u3059\u3002",children:[{type:"number",name:"user_id",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.request_relationship}]},{type:"command",name:"unfollow",description:"\u30D5\u30A9\u30ED\u30FC\u3092\u89E3\u9664\u3057\u307E\u3059\u3002",children:[{type:"number",name:"user_id",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.request_relationship}]},{type:"command",name:"mute",description:"\u30DF\u30E5\u30FC\u30C8\u3057\u307E\u3059",children:[{type:"number",name:"user_id",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.request_relationship,children:[{type:"command",name:"notification",optional:"notifications",description:"\u901A\u77E5\u3082\u30DF\u30E5\u30FC\u30C8\u3057\u307E\u3059",execute:this.request_relationship}]}]},{type:"command",name:"unmute",description:"\u30DF\u30E5\u30FC\u30C8\u3092\u89E3\u9664\u3057\u307E\u3059\u3002",children:[{type:"number",name:"user_id",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.request_relationship}]},{type:"command",name:"block",description:"\u30D6\u30ED\u30C3\u30AF\u3057\u307E\u3059\u3002",children:[{type:"number",name:"user_id",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.request_relationship}]},{type:"command",name:"unblock",description:"\u30D6\u30ED\u30C3\u30AF\u89E3\u9664\u3057\u307E\u3059\u3002",children:[{type:"number",name:"user_id",min:1,max:this._user_max,description:"\u30E6\u30FC\u30B6\u30FCID",execute:this.request_relationship}]},{type:"command",name:"remote-follow",description:"\u30EA\u30E2\u30FC\u30C8\u30D5\u30A9\u30ED\u30FC\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"acct",description:"\u30A2\u30AB\u30A6\u30F3\u30C8ID",execute:this.request_remote_follow}]},{type:"command",name:"delete",description:"\u30C8\u30A5\u30FC\u30C8\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"paramater",name:"status_id",description:"\u30C8\u30A5\u30FC\u30C8ID",execute:this.request_delete_status}]},{type:"command",name:"api",description:"\u76F4\u63A5API\u3092\u767A\u884C\u3057\u307E\u3059(\u8981\u958B\u767A\u8005\u30E2\u30FC\u30C9)",children:[{type:"command",name:"get",description:"GET\u30E1\u30BD\u30C3\u30C9\u3067\u30EA\u30AF\u30A8\u30B9\u30C8\u3057\u307E\u3059\u3002",children:this._request_api},{type:"command",name:"post",description:"POST\u30E1\u30BD\u30C3\u30C9\u3067\u30EA\u30AF\u30A8\u30B9\u30C8\u3057\u307E\u3059\u3002",children:this._request_api},{type:"command",name:"delete",description:"DELETE\u30E1\u30BD\u30C3\u30C9\u3067\u30EA\u30AF\u30A8\u30B9\u30C8\u3057\u307E\u3059\u3002",children:this._request_api}]}]},{type:"command",name:"access-list",description:"\u6B63\u898F\u8868\u73FE\u30D5\u30A3\u30EB\u30BF\u3092\u8A2D\u5B9A\u3057\u307E\u3059\u3002",children:[{type:"number",name:"acl_num",description:"ACL\u756A\u53F7",min:1,max:99,children:[{type:"command",name:"deny",description:"\u975E\u8868\u793A\u306B\u3059\u308B\u30C8\u30A5\u30FC\u30C8",children:[{type:"paramater",name:"regular_expression",description:"\u6B63\u898F\u8868\u73FE\u6587\u5B57\u5217",execute:this.set_acl}]},{type:"command",name:"permit",description:"\u5F37\u8ABF\u3059\u308B\u30C8\u30A5\u30FC\u30C8",children:[{type:"paramater",name:"regular_expression",description:"\u6B63\u898F\u8868\u73FE\u6587\u5B57\u5217",execute:this.set_acl,children:this._acl_opts}]},{type:"command",name:"add",optional:"is_add",description:"\u65E2\u5B58ACL\u306B\u901A\u77E5\u65B9\u6CD5\u3092\u8FFD\u52A0",children:this._acl_opts},{type:"command",name:"drop",description:"\u30D5\u30A3\u30EB\u30BF\u30FC\u306E\u7121\u52B9\u5316",children:[{type:"paramater",name:"regular_expression",description:"\u6B63\u898F\u8868\u73FE\u6587\u5B57\u5217",execute:this.set_acl}]}]}]},{type:"command",name:"no",description:"\u8A2D\u5B9A\u3092\u524A\u9664\u3057\u307E\u3059\u3002",children:[{type:"command",name:"access-list",description:"\u6B63\u898F\u8868\u73FE\u30D5\u30A3\u30EB\u30BF\u3092\u524A\u9664\u3057\u307E\u3059\u3002",execute:this.set_acl,children:[{type:"number",name:"acl_num",description:"\u6B63\u898F\u8868\u73FE\u6587\u5B57\u5217",min:1,max:99,execute:this.set_acl}]}]},{type:"command",name:"clear",description:"\u753B\u9762\u3092\u6D88\u53BB\u3057\u307E\u3059\u3002",execute:this.clear},{type:"command",name:"exit",description:"\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u30E2\u30FC\u30C9\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002",execute:this.exit}]}return Object.defineProperty(e.prototype,"dataset",{get:function e(){return this._dataset},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"cmd_mode",{get:function e(){return this._cmd_mode},enumerable:!0,configurable:!0}),e.prototype.login=function(e){e.pause();var t=ins.get(),a=encodeURIComponent(t.application.uris),o="https://"+t.domain+"/oauth/authorize?response_type=code&client_id="+t.client_id+"&redirect_uri="+a+"&scope="+(t.application.scopes.read?"read ":"")+(t.application.scopes.write?"write ":"")+(t.application.scopes.follow?"follow":"");return a.match(/^https?%3A%2F%2F/)?(location.href=o,e.pause(),!0):(window.open(o,"_blank"),e.push(function(e,a){0==e.trim().length&&a.pop(),a.pause(),a.prompt="",$.ajax({url:"https://"+t.domain+"/oauth/token",type:"POST",dataType:"json",data:{grant_type:"authorization_code",redirect_uri:t.application.uris,client_id:t.client_id,client_secret:t.client_secret,code:e.trim()}}).then(function(e){return t.access_token=e.access_token,t.token_type=e.token_type,ins.save(),callAPI("/api/v1/accounts/verify_credentials")},function(e){a.error("User token updating error.("+e.status+")"),console.log(e)}).then(function(e){var o=parse_account(e);a.echo("<span>Hello! ".concat(o.parsed_display_name," @").concat(o.acct_full,"</span>"),{raw:!0}),t.user=e,ins.save(),a.resume();var s=t.user.username;s+="@"+t.domain+"# ",delete t.auth_code,a.pop()},function(e){console.log(e),a.error("Getting user status failed.("+e.status+")"),a.resume()})},{prompt:"Input Authentication Code: "}),!0)},e.prototype.terminal_monitor=function(e,t){if(!0===t.optional.on_monitor){var a,o,s=ins.get(),n=[],r=ws.startup;if("undefined"==typeof t.line_parsed[2]){var h=config.find("instances.terminal.monitor");"string"==typeof h&&(h=h?h.match(/(home|local|public|notification)/g):void 0),"undefined"==typeof h&&(h=[]);for(var _=0;_<h.length;_++)ws.monitor[h[_]]=!0;for(var i in ws.monitor)ws.monitor[i]&&n.push({type:i});!url_params.terminal&&0<h.length&&(r=h[0])}else"tag"===t.line_parsed[2].name?(n.push({type:t.line_parsed[2].name,hashtag:t.paramaters.hashtag}),r=t.line_parsed[2].name,a=t.paramaters.hashtag):"list"===t.line_parsed[2].name?(n.push({type:t.line_parsed[2].name,list_id:t.paramaters.list_id}),r=t.line_parsed[2].name,o=t.paramaters.list_id):(n.push({type:t.line_parsed[2].name}),r=t.line_parsed[2].name);var c=config_notify(),p=!1;for(var m in c)p=p||m;for(var y=0;y<n.length;y++)push_monitor(n[y].type,n[y].hashtag,n[y].list_id);if(r){var d=r,l="/api/v1/timelines/"+("local"===d?"public":d),u=config.find(["instances","terminal","length"]);u=0<u?u:20,params={limit:u},"local"===d?params.local=!0:"tag"===d?l+="/"+a:"list"===d?l+="/"+o:"notification"===d&&(l="/api/v1/notifications"),e.pause(),callAPI(l,{data:params}).then(function(a){for(var o=config_notify(),n=a.length-1;0<=n;n--)if(!t.optional.pinned||a[n].pinned)if("notification"===d){var i=make_notification(a[n],o);e.echo(i.html,{raw:!0,flush:!1})}else{var s=makeStatus(a[n]);e.echo(s.html,{raw:!0,flush:!1})}e.resume(),e.flush()},function(t,a){e.error("List ".concat(o," is Not Found: ").concat(a)),e.resume()})}}else if(!0===t.optional.no_monitor){for(var f=0;f<ws.stream.length;f++)ws.stream[f].ws.close(),ws.stream[f]=void 0;for(var g in ws.monitor)ws.monitor[g]=!1;ws.stream=[]}},e.prototype.toot=function(e,t){var a;a="undefined"==typeof t.line_parsed[1]?config.find("instances.visibility"):t.line_parsed[1].name,"undefined"==typeof a&&(a="public"),$("#toot_visibility").val(a),$("#toot").slideDown("first"),$("#toot_box").focus(),e.focus(!1)},e.prototype.monitor=function(e,t){ins.get().monitor="tag"===t.line_parsed[1].name?t.paramaters.hashtag:t.line_parsed[1].name,ins.save()},e.prototype.show_user=function(e,t){function a(t){var a,o,n=ins.get().user;a=callAPI("/api/v1/accounts/"+t,{type:"GET"}),o=callAPI("/api/v1/accounts/relationships?id[]="+t,{type:"GET"}),api_pinned=callAPI("/api/v1/accounts/"+t+"/statuses",{data:{pinned:!0}}),$.when(a,o,api_pinned).then(function(t,a,o){var r=parse_account(t[0]),c=t[2],m=a[0],p=a[2],d=o[0],l=o[2],u=new Date(r.created_at),h=parseInt((Date.now()-u.getTime())/6e4),_=h%60,y=(h=(h-_)/60)%24,g=(h=(h-y)/24)%7,w=(h-g)/7,x="<span>Relationship ";if(x+=m[0].id===n.id?"self.</span>":(m[0].following&&m[0].followed_by?"friendly":m[0].following?"following":m[0].followed_by?"followed":"others")+".<br /><a name=\"cmd_link\" data-uid=\""+r.id+"\" data-type=\"request\" data-req=\""+(m[0].following?"unfollow\">":"follow\">No ")+"following</a>, "+(m[0].followed_by?"":"No ")+"followed, "+(m[0].requested?"":"No ")+"requesting, <a name=\"cmd_link\" data-uid=\""+r.id+"\" data-type=\"request\" data-req=\""+(m[0].muting?"unmute\">":"mute\">No ")+"muting</a>, <a name=\"cmd_link\" data-uid=\""+r.id+"\" data-type=\"request\" data-req=\""+(m[0].blocking?"unblock\">":"block\">No ")+"blocking</a></span>",e.echo("<span>".concat(r.parsed_display_name," ID:").concat(r.id," is ").concat(r.locked?"locked":"unlocked","</span>"),{raw:!0,flush:!1}),e.echo("Username is ".concat(r.username,", Fullname is ").concat(r.acct_full),{flush:!1}),e.echo("Created at ".concat(u.toString()),{flush:!1}),e.echo("Uptime is ".concat(w," weeks, ").concat(g," days, ").concat(y," hours, ").concat(_," minutes (").concat(h," days have passed)"),{flush:!1}),e.echo("<span>"+$("<a />").attr("name","cmd_link").attr("data-uid",r.id).attr("data-type","show_statuses").text(r.statuses_count+" statuses posted").prop("outerHTML")+", "+$("<a />").attr("name","cmd_link").attr("data-uid",r.id).attr("data-type","show_following").text(r.following_count+" accounts are following").prop("outerHTML")+", "+$("<a />").attr("name","cmd_link").attr("data-uid",r.id).attr("data-type","show_followed").text(r.followers_count+" accounts are followed").prop("outerHTML")+"</span>",{raw:!0,flush:!1}),e.echo("1 day toot rate "+parseInt(r.statuses_count/h)+" posts/day",{flush:!1}),e.echo(x,{raw:!0,flush:!1}),e.echo("<span>Note: ".concat(r.parsed_note,"</span>"),{raw:!0,flush:!1}),r.fields&&0<r.fields.length)for(var b in e.echo("[[ub;;]Fields]",{flush:!1}),r.fields){var i=r.fields[b];e.echo("<span class=\"fields\">".concat(i.name.column_text(20)," ").concat(i.value,"</span>"),{raw:!0,flush:!1})}if(e.echo("URL: "+r.url,{raw:!1,flush:!1}),0<d.length&&d[0].pinned){e.echo("<br />",{raw:!0,flush:!1}),e.echo("[[ub;;]Pinned statuses]",{flush:!1});for(var f=0;f<d.length;f++)if(2<f){var v=$("<a />").attr("target","out_of_term").attr("name","cmd_link").attr("data-uid",d[f].account.id).attr("data-type","show_statuses_pinned").text("... and more pinned status");e.echo(v.prop("outerHTML"),{raw:!0,flush:!1});break}else{var k=makeStatus(d[f]);e.echo(k.html,{raw:!0,flush:!1})}}e.echo("[OK]",{flush:!1}),e.flush(),e.resume()},function(t){console.log(t);JSON.parse(t.responseText);e.echo("Getting user data failed.("+t+")"),e.resume()})}e.pause();"undefined"==typeof t.line_parsed[2]||"self"===t.line_parsed[2].name?a(ins.get().user.id):"name"===t.line_parsed[2].name?callAPI("/api/v1/search",{type:"GET",data:{q:t.paramaters.account,limit:1}}).then(function(t){0<t.accounts.length?a(t.accounts[0].id):(e.echo("No Accounts."),e.resume())}):a(t.paramaters.userid)},e.prototype.search_query=function(e,t){if(e.pause(),"local"===t.line_parsed[1].name)callAPI("/api/v1/search",{type:"GET",data:{q:t.paramaters.query}}).then(function(t){for(var a=15,o=0;o<t.accounts.length;o++)a<t.accounts[o].acct.length&&(a=t.accounts[o].acct.length);if(a+=7,0<t.statuses.length){e.echo("[[b;;]Statuses:]",{flush:!1});for(var c,s=0;s<t.statuses.length;s++)c=makeStatus(t.statuses[s]),e.echo(c.html,{raw:!0,flush:!1});e.flush()}else{var m;for(m="---------------";m.length<a;m+="-");m+="----------------------------";for(var n=["[[bu;;]Accounts:]","| display name".addTab("| account name",a).addTab("id",9),m],r=0;r<t.accounts.length;r++)n.push(("| "+t.accounts[r].display_name).addTab("| @"+t.accounts[r].acct,a).addTab(t.accounts[r].id,9));n.push("----------------------------------------------------------"),n.push("  \u8A72\u5F53\u4EF6\u6570\uFF1A"+t.accounts.length+"\u4EF6"),n.push(""),n.push("[[bu;;]Hash tags:]"),n.push("-----------------------------------");for(var p=0;p<t.hashtags.length;p++)n.push("#"+t.hashtags[p]);n.push("-----------------------------------"),n.push("  \u8A72\u5F53\u4EF6\u6570\uFF1A"+t.hashtags.length+"\u4EF6"),e.echo(n.join("\n"))}e.resume()},function(t){e.error("Search request is failed.("+t.status+")"),console.log(t),e.resume()});else{var a,o=function(t){if(0<t){t=r.length<t?r.length:t;for(var a,o=0;o<t;o++)a=r.shift(),e.echo(a,{raw:!0,flush:!1});e.flush()}},n=0,r=[],s=parseInt(e.rows()/5);if("https://wd-shiroma.github.io"!==window.location.origin)return e.error("Sorry! tootsearch permit only acceess from \"https://wd-shiroma.github.io\""),e.resume(),!1;if("tootsearch"===t.line_parsed[1].name)a="https://tootsearch.chotto.moe/api/v1/search?sort=created_at%3Adesc&q="+encodeURIComponent(t.paramaters.query);else return e.error("Invalid search source."),e.resume(),!1;e.echo("[[b;;]Searching powered by tootsearch:]",{flush:!1}),e.push(function(){},{name:"more",prompt:"--More-- ",onStart:function t(e){e.pause(),$.ajax({url:a+"&from="+n,dataType:"json",timeout:15e3}).then(function(t){var a=t.hits.hits,c=[];if(0<a.length){for(var m=0;m<a.length;m++)if("toot"===a[m]._type&&(a[m]._source.id=0,0>c.indexOf(a[m]._source.uri))){var i=makeStatus(a[m]._source);r.push(i.html),c.push(a[m]._source.uri)}o(s),n=a.length,t.hits.total<=a.length&&e.pop()}else e.echo("no hits."),e.pop();e.resume()},function(t){e.error("Search request is failed.("+t.status+")"),console.log(t),e.pop(),e.resume()})},keydown:function i(e,t){switch(e.keyCode){case 27:case 81:t.pop(),t.set_command("");case 16:case 17:case 18:break;case 13:default:t.pause();var c=13===e.keyCode?1:s;0<r.length?(o(c),t.resume(),0===r.length&&n>=data.hits.total&&t.pop()):$.ajax({url:a+"&from="+n,dataType:"json",timeout:15e3}).then(function(e){var a=[],m=e.hits.hits;if(0===m.length)return void t.pop();r=[];for(var p=0;p<m.length;p++)if(m[p]._source.id=0,0>a.indexOf(m[p]._source.uri)){var i=makeStatus(m[p]._source);i.html.length&&(r.push(i.html),a.push(m[p]._source.uri))}o(c),t.resume(),n+=m.length,0===r.length&&n>=e.hits.total&&t.pop()},function(e){console.log(e),t.error("Getting data is failed.("+e.status+")")}),setTimeout(function(){t.set_command("")},10);}return!0}})}},e.prototype.show_instance=function(e){e.pause(),callAPI("/api/v1/instance",{type:"GET"}).then(function(t){var a=parse_account(t.contact_account);e.echo("======== Instance Information ========",{flush:!1}),e.echo("Instance name: "+t.title,{flush:!1}),e.echo("Version: "+t.version,{flush:!1}),e.echo("E-mail: "+t.email,{flush:!1}),e.echo("URI: "+t.uri,{flush:!1}),t.hasOwnProperty("stats")&&(e.echo("Connection instances: "+t.stats.domain_count,{flush:!1}),e.echo("Posted toots: "+t.stats.status_count,{flush:!1}),e.echo("Registed users: "+t.stats.user_count,{flush:!1})),e.echo("Streaming uri: "+t.urls.streaming_api,{flush:!1}),e.echo("Contact: ".concat(a.parsed_display_name," @").concat(a.acct_full),{flush:!1,raw:!0}),e.echo("Description: "+t.description,{flush:!1}),e.echo("[OK]",{flush:!1}),e.flush(),e.resume()},function(t){e.error("Getting instance data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.show_application=function(e){e.pause(),callAPI("/api/v1/apps/verify_credentials",{type:"GET"}).then(function(t){var a=JSON.stringify(t,null,"    ");e.echo(a),e.resume()},function(t){console.log(t),e.resume()})},e.prototype.exit=function(e){e.pop()},e.prototype.show_statuses=function(e,t){e.pause();var a,o,s=t.optional.limit&&0<t.paramaters.post_limits?t.paramaters.post_limits:config.find(["instances","terminal","length"]);if(s=0<s?s:20,"timeline"===t.line_parsed[1].name){var n="undefined"==typeof t.line_parsed[2]?"local":t.line_parsed[2].name;a="/api/v1/timelines/"+("local"===n?"public":n),o={limit:s},"local"===n?o.local=!0:"tag"===n?a+="/"+t.paramaters.tag_name:"list"===n&&(a+="/"+t.paramaters.list_id)}else if("user"===t.line_parsed[1].name){var i=2===t.line_parsed.length||"self"===t.line_parsed[2].name?ins.get().user.id:"id"===t.line_parsed[2].name?t.paramaters.userid:-1;if(0<i)o={limit:s},!0===t.optional.pinned&&(o.pinned=!0),!0===t.optional.media&&(o.only_media=!0),a="/api/v1/accounts/"+i+"/statuses";else return void e.error("no login.")}if(t.optional.max_id)o.max_id=t.paramaters.status_id;else if(t.optional.max_date)try{var r=new Date(t.paramaters.datetime);o.max_id=r.snowflake()}catch(t){return void e.error("Invalid datetime format.")}return"undefined"==typeof a?void e.error("show status error."):void callMore(a,function(e){if(!0===t.optional.pinned&&!0!==e.pinned)return!1;var a=makeStatus(e);return a.visibility?a.html:""},{params:o,term:e,limit:s,footer:"[OK]"})},e.prototype.show_status_id=function(e,t){e.pause();var a=t.paramaters.status_id;$.when(callAPI("/api/v1/statuses/"+a,{type:"GET"}),callAPI("/api/v1/statuses/"+a+"/context",{type:"GET"}),callAPI("/api/v1/statuses/"+a+"/card",{type:"GET"})).then(function(t,a,o){for(var n,r=t[0],c=a[0],m=o[0],p=0;p<c.ancestors.length;p++)n=makeStatus(c.ancestors[p]),e.echo(n.html,{raw:!0,flush:!1});if(n=makeStatus(r),e.echo(n.html,{raw:!0,flush:!1}),m.hasOwnProperty("url")){var h=$("<a />").attr("href",m.url).attr("target","out_of_term").addClass("status_card").append($("<div />").append($("<span />").text("[ "+m.title+" ]")).append($("<br />")).append($("<span />").text(m.description)));!0===config.find(["instances","status","avater"])&&h.append($("<img />").attr("src",m.image));var _=new Image;_.onload=function(){$("[name=card_"+r.id+"] img").attr("src",m.image)},_.onerror=function(t){console.log(t)},_.src=m.image,e.echo(h.prop("outerHTML"),{raw:!0,flush:!1}),e.echo("<br />",{raw:!0,flush:!1})}var d=0<r.favourites_count?$("<a />").attr("name","cmd_link").attr("data-type","show_faved").attr("data-sid",r.id):$("<span />");d.text(r.favourites_count+" account favourited,");var l=0<r.reblogs_count?$("<a />").attr("name","cmd_link").attr("data-type","show_rebbed").attr("data-sid",r.id):$("<span />");l.text(r.reblogs_count+" account reblogged.");var u=$("<a />").attr("name","cmd_link").attr("data-type","show_att").attr("data-sid",r.id).text("> check the LTL of the time.");if(e.echo(d.prop("outerHTML")+" "+l.prop("outerHTML"),{raw:!0,flush:!1}),e.echo(u.prop("outerHTML"),{raw:!0,flush:!1}),e.echo("URL: "+r.url,{flush:!1}),r.account.id===ins.get().user.id){var y=$("<a />").attr("name","cmd_link").attr("data-type","del_status").attr("data-sid",r.id).text("> delete this status.");e.echo("<br />"+y.prop("outerHTML"),{raw:!0,flush:!1})}config.find("instances.status.separator")&&e.echo(Array($.terminal.active().cols()-5).join("-"),{flush:!1});for(var f=0;f<c.descendants.length;f++)n=makeStatus(c.descendants[f]),e.echo(n.html,{raw:!0,flush:!1});e.flush(),e.resume()},function(t){e.error("Getting statuses is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.show_follows=function(e,t){e.pause();var a,o,s;if("user"===t.line_parsed[1].name)2===t.line_parsed.length||"self"===t.line_parsed[2].name?(o=ins.get().user.id,s=t.line_parsed[3].name):(o=t.paramaters.userid,s=t.line_parsed[4].name),a="/api/v1/accounts/"+o+"/"+s;else if("statuses"===t.line_parsed[1].name)o=t.paramaters.status_id,a="/api/v1/statuses/"+o+("favourited"===t.line_parsed[4].name?"/favourited_by":"reblogged"===t.line_parsed[4].name?"/reblogged_by":"");else return e.error("Invalid Command"),!0;return callMore(a,function(e){var t=e.display_name;return 20<t.length&&(t=t.substr(0,20)+"..."),t=("| "+t+" @"+e.acct).addTab(e.id,9),t},{limit:40,header:"Accounts:\n"+"| account name".addTab("id",9)+"\n"+Array(35).join("-"),term:e,raw:!1,next:function s(e,t){var a=t.getResponseHeader("link"),o=a.match(/max_id=(\d+)/);return null===o?0:parseInt(o[1])}}),!0},e.prototype.show_notifications=function(e,t){e.pause();var a={},o=config_notify(),s=20;return t.paramaters.post_limits&&(s=t.paramaters.post_limits),t.optional.exclude_types&&(a.exclude_types=["follow","reblog","mention","favourite"].filter(function(a){return t.line_parsed[3].name!==a})),a.limit=s,callMore("/api/v1/notifications",function(e){var t=make_notification(e,o);return t.html},{limit:s,term:e,params:a}),!0},e.prototype.show_acl=function(e){var t=ins.acls[ins.name()];if(t){for(var a in t)e.echo("Standard Status access list "+a),e.echo("    "+t[a].type+" regexp "+t[a].regexp.toString()+("permit"===t[a].type&&t[a].hasOwnProperty("color")?", color "+t[a].color:"")+("permit"===t[a].type&&t[a].notify?", notification":"")+("permit"===t[a].type&&t[a].hasOwnProperty("voice")?", voice \""+t[a].voice+"\"":""));return!0}},e.prototype.set_acl=function(e,t){function a(e){t.optional.is_color?e.color=t.line_parsed[5].name:t.optional.is_notify?(e.notify=!0,Notification.requestPermission()):t.optional.is_voice?e.voice=t.paramaters.voice_text:e.color="dark-blue"}var o=ins.get();if(o.hasOwnProperty("acl")||(o.acl={}),"no"===t.line_parsed[0].name)t.paramaters.hasOwnProperty("acl_num")?delete o.acl[t.paramaters.acl_num]:(delete o.acl,o.acl={});else if(t.optional.is_add){if(!o.acl[t.paramaters.acl_num])return e.error("access-list has no rule."),!1;"permit"!==o.acl[t.paramaters.acl_num].type&&e.error("add option apply to permit lists.");var s=o.acl[t.paramaters.acl_num];a(s)}else{o.acl[t.paramaters.acl_num]={};var n=o.acl[t.paramaters.acl_num];n.type=t.line_parsed[2].name,n.regexp=t.paramaters.regular_expression,"permit"===n.type&&a(n)}return ins.parse_acl(),ins.save(),!0},e.prototype.show_terminal=function(e){e.echo("Monitoring streams"),e.echo(tab("Home:",ws.monitor.home?"ON":"OFF",15)),e.echo(tab("Notification:",ws.monitor.notification?"ON":"OFF",15)),e.echo(tab("Local:",ws.monitor.local?"ON":"OFF",15)),e.echo(tab("Public:",ws.monitor.public?"ON":"OFF",15)),e.echo(tab("Tags:",ws.monitor.tag?"ON":"OFF",15)),e.echo(tab("Lists:",ws.monitor.list?"ON":"OFF",15)),e.echo("\n",{raw:!0}),e.echo("WebSocket objects");for(var o=0;o<ws.stream.length;o++){var t=ws.stream[o],a="Line "+(o+1).toString()+", type "+t.type;"tag"===t.type&&(a+=" \""+t.name+"\""),e.echo("\n",{raw:!0}),e.echo(a),e.echo("Connecting url, "+t.ws.url),e.echo("Ready Stete, "+(t.ws.readyState===WebSocket.CONNECTING?"CONNECTING":t.ws.readyState===WebSocket.OPEN?"OPEN":t.ws.readyState===WebSocket.CLOSING?"CLOSING":t.ws.readyState===WebSocket.CLOSED?"CLOSED":"UNKNOWN("+t.ws.readyState+")")),e.echo("Protocol type, "+t.ws.protocol),e.echo("Binary type, "+t.ws.binaryType),e.echo("Extensions, "+t.ws.extensions)}},e.prototype.request_relationship=function(e,t){if(t.paramaters.user_id===ins.get().user.id)return e.error("Request ID is yourself."),!1;var a;"mute"===t.line_parsed[1].name.slice(-4)&&(a={notifications:!!t.optional.hasOwnProperty("notifications")&&t.optional.notifications}),e.pause();var o="/api/v1/accounts/"+t.paramaters.user_id+"/"+t.line_parsed[1].name;callAPI(o,{type:"POST",data:a}).then(function(t){e.echo("Request was accepted.\n"+tab("Following",t.following?"Yes":"No",14)+"\n"+tab("Followed",t.followed_by?"Yes":"No",14)+"\n"+tab("Requested",t.requested?"Yes":"No",14)+"\n"+tab("Mute",t.muting?"Yes":"No",14)+"\n"+tab("Block",t.blocking?"Yes":"No",14)),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.request_remote_follow=function(e,t){var a=t.paramaters.acct;if(!a.match(/^((?:@?([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+))|(?:@([a-zA-Z0-9_]+)))$/))return e.error("Invalid Account ID. (username@domain)"),!1;e.pause();callAPI("/api/v1/follows?uri="+a,{type:"POST"}).then(function(t){console.log(t);e.echo("Request was accepted.\nFollowing "+t.acct),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.show_status_actions=function(e){e.pause(),callMore(path,function(){}),callAPI(path,{type:"GET"}).then(function(t){for(var a=0;a<t.length;a++)callMore();e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.request_delete_status=function(e,t){var a=t.paramaters.status_id;e.push(function(){e.echo("Canceled."),e.pop()},{prompt:"ID "+a+" status will delete! Continue? Y/[N]: ",keypress:function o(e,t){t.echo(t.get_prompt()+e.key),89===e.keyCode||121===e.keyCode?(t.pause(),t.echo("[OK]"),callAPI("/api/v1/statuses/"+a,{type:"DELETE"}).then(function(){t.echo("Erase of status: complete"),t.resume()},function(e){t.error("Deleteing status is failed("+e.status+")"),console.log(e),t.resume()})):t.echo("Canceled."),t.pop()},onExit:function t(e){setTimeout(function(){e.set_command("")},10)}})},e.prototype.show_emojis_custom=function(e,t){var a=ins.get(),o=ins.ck_version("2.0.0"),s="undefined"==typeof t.line_parsed[3]?"picker":t.line_parsed[3].name,n=t.paramaters.hasOwnProperty("keyword")?new RegExp(t.paramaters.keyword):null;return!0===t.optional.custom&&("mastodon"!==o.type||0>o.compared)?(e.error("This instance version has no support for Custom Emojis.(< Mastodon 2.0.0)"),!1):void(e.pause(),callAPI("/api/v1/custom_emojis",{type:"GET"}).then(function(t){t=t.sort(function(e,t){return e.shortcode>t.shortcode?1:-1});for(var a,o=[],r=0;r<t.length;r++){if(!0!==config.find(["emojis","visible_in_picker"])&&!1===t[r].visible_in_picker)continue;else if(n&&!t[r].shortcode.match(n))continue;a=":"+t[r].shortcode+":",o.push($("<div />").addClass("emoji_"+s).attr("data-tag",a).append($("<img />").attr("alt",a).attr("title",a).attr("src",t[r].url)).append($("<span />").text(t[r].shortcode)).prop("outerHTML"))}"summary"===s?more(e,o,{echo_opt:{raw:!0}}):(e.echo("<span>"+o.join("")+"</span>",{raw:!0}),e.resume())},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()}))},e.prototype.show_emojis_custom_detail=function(t,e){var a=ins.get(),o=ins.ck_version("2.0.0"),s=e.paramaters.shortcode;return!0===e.optional.custom&&("mastodon"!==o.type||0>o.compared)?(t.error("This instance version has no support for Custom Emojis.(< Mastodon 2.0.0)"),!1):void(t.pause(),callAPI("/api/v1/custom_emojis",{type:"GET"}).then(function(e){e=e.sort(function(e,t){return e.shortcode>t.shortcode?1:-1});var a=e.find(function(t){return t.shortcode===s});if("undefined"==typeof a)return t.error("No emoji's shortcode."),void t.resume();var o=new Image;o.onload=function(o){t.echo($(o.path[0]).css("max-height","4em").prop("outerHTML"),{raw:!0,flush:!1}),t.echo("shortcode is "+a.shortcode,{flush:!1}),t.echo("size is width: "+o.path[0].width+", height: "+o.path[0].height,{flush:!1}),t.echo("static image url: "+a.static_url,{flush:!1}),t.echo("image url: "+a.url,{flush:!1}),t.echo("[OK]"),t.flush(),t.resume()},o.onerror=function(a){t.error("Custom emoji couldn't get."),t.resume(),console.log(a)},o.src=a.url},function(e){t.error("Getting data is failed.("+e.status+")"),console.log(e),t.resume()}))},e.prototype.request_api=function(e,t){if(!0!==config.find(["debug","development"]))return e.error("you are no development mode..."),!1;e.pause();var a=t.paramaters.path,o=t.line_parsed[2].name,s=t.optional.json?t.paramaters.json:"";callAPI(a,{type:o,data:s}).then(function(t,a,o){var s=JSON.stringify(t,null,"    ");e.echo("request ok! ("+o.status+")"),e.echo(s),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.show_lists=function(e){e.pause(),callAPI("/api/v1/lists",{type:"GET"}).then(function(t){if(0===t.length)return e.echo("no lists..."),void e.resume();for(var a=["id    | title","----------------------------------"],o=0;o<t.length;o++)a.push(("| "+t[o].title).addTab(t[o].id,6));more(e,a)},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.show_list_accounts=function(e,t){e.pause();var a="/api/v1/lists/"+t.paramaters.list_id+"/accounts";callMore(a,function(e){return("| "+e.acct).addTab("| "+e.display_name,30).addTab(e.id,7)},{raw:!1,header:"id     | display_name"+Array(17).join(" ")+"| acct\n"+Array(48).join("-")})},e.prototype.list_create=function(e,t){e.pause(),callAPI("/api/v1/lists",{type:"POST",data:{title:t.paramaters.list_name}}).then(function(t){e.echo("Created new list '"+t.title+"'\nList ID is: "+t.id),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.list_delete=function(e,t){e.pause();var a=t.paramaters.list_id;callAPI("/api/v1/lists/"+a,{type:"DELETE"}).then(function(){e.echo("Deleted list ID is: "+a),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.list_account=function(e,t){e.pause();var a="remove_account"===t.line_parsed[3].name?"DELETE":"POST";callAPI("/api/v1/lists/"+t.paramaters.list_id+"/accounts",{type:a,data:{account_ids:[t.paramaters.user_id]}}).then(function(){var o=("DELETE"==a?"Removed":"Appended")+" account, ID is: "+t.paramaters.user_id;e.echo(o),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.template=function(e){e.pause(),callAPI("/api/v1/instance",{type:"GET"}).then(function(t){var a=JSON.stringify(t,null,"    ");e.echo(a),e.resume()},function(t){e.error("Getting data is failed.("+t.status+")"),console.log(t),e.resume()})},e.prototype.clear=function(e){return e.clear(),!0},e}();function config_notify(){var e={},t=config.find(["instances","terminal","logging"]);return url_params.hasOwnProperty("notification")?(t=url_params.notification.split(","),e={delete:0<=t.indexOf("del"),favourite:0<=t.indexOf("fav"),reblog:0<=t.indexOf("reb"),mention:0<=t.indexOf("men"),following:0<=t.indexOf("fol")}):"object"===_typeof(t)?e={delete:!1!==t&&!0===t.delete,favourite:!1!==t&&!1!==t.favourite,reblog:!1!==t&&!1!==t.reblog,mention:!1!==t&&!1!==t.mention,following:!1!==t&&!1!==t.following}:e={delete:!1,favourite:!0,reblog:!0,mention:!0,following:!0},e}function is_monitoring(e){var t=!1;if("undefined"!=typeof e)t=!0===ws.monitor[e];else for(var a in ws.stream)t=t||ws.stream[a].ws.readyState===WebSocket.OPEN;return t}function talk(e){var t=new SpeechSynthesisUtterance(e);t.rate=1.3,t.lang="ja-JP",speechSynthesis.speak(t)}
"use strict";var client_info={modified:new Date("2019-02-27"),version:"2.3.1",auther:"Guskma",acct:"guskma@abyss.fun",website:"https://blog.drdr.work/"};
"use strict";var defconf={application:{name:"Tooterminal",website:"https://blog.drdr.work/",uris:"urn:ietf:wg:oauth:2.0:oob",scopes:{read:!0,write:!0,follow:!0}},terminal:{length:0},instances:{terminal:{logging:{favourite:!0,reblog:!0,mention:!0,following:!0},monitor:["local","notification"]},status:{}}};
"use strict";function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}var config,ins,url_params,acls,term_mode,mode_global,mode_configuration,mode_instance,mode_config_instance,instance_name,beep_buf,emojis,resize_term=function(a){var b=window.innerWidth,c=window.innerHeight,d=350<b&&450<window.parent.screen.width;b-=d?36:6,c-=d?36:20,b=200>b?200:b,a.resize(b,c)},enterCommand=function(a,b){if(a=a.trim(),reduce_output(),resize_term(b),0!==a.length){var c=term_mode.execute(a,b);!0!==c&&b.error(term_mode.result.message)}},completion=function(a,b){var c=term_mode.getCompletion(a);1===c.length?$.terminal.active().set_command(term_mode.completion):b(c.sort().filter(function(a){return a?a:"<cr>"}))},initConfig=function(a){var b=localStorage,c=b.getItem("configuration"),d=new XMLHttpRequest;if(d.responseType="arraybuffer",d.onreadystatechange=function(){4===d.readyState&&(0===d.status||200===d.status)&&(d.response?context.decodeAudioData(d.response,function(a){beep_buf=a}):($.terminal.active().error("Error: \u30DD\u30B3\u30DD\u30B3\u3067\u304D\u307E\u305B\u3093"),console.log("error"),beep_buf=void 0))},d.open("GET","./sounds/boop.ogg",!0),d.send(""),config=new ConfigManager(defconf,c?JSON.parse(c):{}),url_params={},!!location.search.match(/^\?.+=.+/)){for(var e=location.search.replace(/^\?/,"").split(/[=&]/),f=0;f<e.length;f+=2)url_params[e[f]]=e[f+1];url_params.hasOwnProperty("code")&&ins.name(url_params.instance_name)?(ins.get().auth_code=url_params.code,a.exec("instance "+ins.name()),history.replaceState("","",location.pathname)):url_params.hasOwnProperty("instance")&&ins.name(url_params.instance)&&a.exec("instance "+ins.name())}},filterKey=function(a,b){if(63===a.charCode){var c=term_mode.information(b.get_command()),d=c.map(function(a){return"undefined"==typeof a.command?a:"  "+tab(a.command,a.description,22)});d.unshift(b.get_prompt()+b.get_command()+"?"),d.push(""),more(b,d,{reverse:!0});var e=b.get_command();b.set_command(""),setTimeout(function(){b.set_command(e)},10)}},parseCommand=function(a,b){try{term_mode.parse(a.replace(/\?$/,""))}catch(a){b.error("Invalid command characters. ([, \\)"),b.set_command("")}},init_instance=function(a){term_mode=mode_instance;var b=ins.get();b.hasOwnProperty("config")||(b.config=JSON.parse(JSON.stringify(config.find(["instances"]))),ins.save());var c;if(config.find(["instances","terminal","auto"])&&(c=config.find(["instances","terminal","monitor"]),c=c.match(/(home|local|public|notification)/g)),url_params.hasOwnProperty("terminal")&&(c=url_params.terminal.match(/(home|local|public|notification)/g)),c=c?c:[],0<c.length&&b.hasOwnProperty("access_token")){"string"==typeof c&&(c=[c]);for(var d=0;d<c.length;d++)ws.monitor[c[d]]=!0;ws.startup=c[0],is_monitoring()||a.exec("terminal monitor")}},exit_instance=function(){term_mode=mode_global,closeTootbox(),ins.name("")},update_toot_status=function(){var a=500-$("#toot_box").val().length-$("#toot_cw").val().length;$("#toot_size").css("color",0>a?"#F00":"#bbb").text(a);var b=$("#toot_preview");if(b.is(":visible")){var c=$("#toot_cw").val().escape_html(),d=$("#toot_box").val().escape_html();c=c.replace(/: {1,2}:/g,"\u200B"),c=parse_emojis_from_content(c,emojis.payload),c=parse_twemoji(c),b.children(".sensitive").html(c),d=d.replace(/: {1,2}:/g,":\u200B:"),d=parse_emojis_from_content(d,emojis.payload),d=parse_twemoji(d),b.children(".content").html(d)}},update_emoji_picker=function(){var a={category:$("#toot_emoji_category").val(),tone:$("#toot_emoji_tone").val(),keyword:$("#toot_emoji_keyword").val()||""},b=$("#toot_emoji_list"),c=emojis.find(a).filterd;if("all"===a.category&&""===a.keyword||0===c.length)return b.html("").hide(),!0;var d=c.map(function(a){return"<li class=\"emoji_picker\">".concat(a.code,"</li>")}).join("");d=parse_emojis(d,emojis.payload),d=parse_twemoji(d),b.html(d).slideDown("fast")};function upload_img(a){var b=new FormData,c=ins.get(),d=$(".toot_media img").length;$("#toot_media").append($("<img />").attr("id","media_"+d)).slideDown("first"),b.append("file",a),$.ajax("https://"+c.domain+"/api/v1/media",{type:"POST",contentType:!1,processData:!1,headers:{Authorization:c.token_type+" "+c.access_token},data:b}).then(function(a){$("#media_"+d).attr("data-id",a.id).attr("data-url",a.text_url);var b=new Image;b.onload=function(){$("#media_"+d).attr("src",a.preview_url),$("#toot_box").val($("#toot_box").val()+" "+a.text_url),autosize.update($("#toot_box")),update_toot_status()},b.onerror=function(a){console.log(a)},b.src=a.preview_url},function(a){$.terminal.active().error("Media upload error.("+a.status+")"),$("#media_"+d).remove(),console.log(a)})}var tl;$(function(){mode_global=new ModeManager(new GlobalModeElement()),mode_configuration=new ModeManager(new ConfigurationModeElement()),mode_instance=new ModeManager(new InstanceModeElement()),ins=new InstanceManager,term_mode=mode_global,emojis=new Emojis;var a="=== CiscoIOS\u98A8 \u30DE\u30B9\u30C8\u30C9\u30F3\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8 ===\n _____      _                 _          _ \n|_   _|_ __| |_ ____ _ _ __ _(_) __  __ | |\n  | / _ / _| __/ _| '_| '_ ` || '_ \\/ _`| |\n  || (_) (_| ||  _| | | | | ||| | || (_|| |\n  |_\\___\\___\\__\\__|_| |_| |_|||_|_|_\\__,|_|\n         Version "+client_info.version+", modified "+client_info.modified.getFullYear()+"/"+("0"+(client_info.modified.getMonth()+1)).slice(-2)+"/"+("0"+client_info.modified.getDate()).slice(-2)+"\n\n\u4F7F\u3044\u65B9\u306F\"help\"\u30B3\u30DE\u30F3\u30C9\u307E\u305F\u306F\"?\"\u30AD\u30FC\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n\n";tl=$("#timeline").terminal(enterCommand,{name:"global",greetings:a,login:!1,onInit:initConfig,prompt:"Tooterminal# ",completion:completion,height:window.innerHeight-18,onResize:resize_term,exit:!1,clear:!1,scrollOnEcho:!1,keypress:filterKey,onFocus:function a(){return!0},onCommandChange:parseCommand}),$("#toot").on("keydown",function(a){27===a.keyCode?closeTootbox():13===a.keyCode&&a.ctrlKey&&post_status()}).on("paste",function(a){if(!(4<=$(".toot_media img").length)&&"undefined"!=typeof a.originalEvent.clipboardData&&"undefined"!=typeof a.originalEvent.clipboardData.types&&1===a.originalEvent.clipboardData.types.length&&"Files"===a.originalEvent.clipboardData.types[0]){var b=a.originalEvent.clipboardData.items[0].getAsFile();upload_img(b)}}),$("#toot_box").on("dragenter",function(a){a.preventDefault(),$("#toot_box").addClass("toot_imghover")}).on("dragover",function(){}).on("dragleave",function(){$("#toot_box").removeClass("toot_imghover")}).on("drop",function(a){a.preventDefault(),$("#toot_box").removeClass("toot_imghover");for(var b=a.originalEvent.dataTransfer.files,c=4-$("#toot_media img").length,d=c<b.length?c:b.length,e=0;e<d;e++)b[e].type.match(/^(video|image)\//)&&upload_img(b[e])}),$("#toot_cw").on("keyup",update_toot_status),$("#toot_box").on("keyup",update_toot_status),$("#toot_post").on("click",function(){post_status()}),$("#util_selector button").on("click",function(a){var b=$(a.currentTarget);b.hasClass("active")?(b.removeClass("active"),$("#".concat(b.attr("name"))).slideUp("fast")):(b.addClass("active"),$("#".concat(b.attr("name"))).slideDown("fast"))}),$("#help_close").on("click",function(){$("#help").slideUp("first"),$.terminal.active().focus()}),$("#reply_close").on("click",function(){$("#sid").text(""),$("#reply").hide(),$("#toot_box").val($("#toot_box").val().replace(/^@[a-zA-Z0-9_]+(?:@(?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z0-9]+)?\s+/,""))}),$(".img_background").on("click",function(){$("#img_view").fadeOut("first"),$("#pre_view").fadeOut("first"),$("#video_view").fadeOut("first"),$(".img_background").fadeOut("first"),$.terminal.active().enable()}),$(document).on("click",".read_more",function(){$(this).next().toggle("fast")}).on("mouseover",".status",function(){var a=config.find("instances.status.thumbnail");"undefined"==typeof a&&$(this).find(".status_thumbnail").show()}).on("mouseout",".status",function(){var a=config.find("instances.status.thumbnail");"undefined"==typeof a&&$(this).find(".status_thumbnail").hide()}).on("click",".status",function(a){if(!$(this).hasClass("status_deleted")){$(this).data("sid");if(a.shiftKey){var b="@"+$(this).data("acct").toString(),c=/((?:@([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+))|(?:@([a-zA-Z0-9_]+)))/g,d=$(this).find(".status_contents")[0].textContent.replace(new RegExp(b,"g"),"").match(c);$.terminal.active().disable(),$("#toot").slideDown("first"),$("#reply").show(),$("#sid").text($(this).data("sid")),$("#reply_head").text("reply to: "+$(this).data("dispname")),$("#reply_body").text($(this).find("#status_contents")[0].textContent),$("#toot_box").focus().val("@"+$(this).data("acct")+" "+$(this).data("reply")),$($(this).find(".status_head i")[2]).hasClass("fa-envelope")?$("#toot_visibility").val("direct"):$($(this).find(".status_head i")[2]).hasClass("fa-lock")?$("#toot_visibility").val("private"):$($(this).find(".status_head i")[2]).hasClass("fa-unlock")?$("#toot_visibility").val("unlisted"):$("#toot_visibility").val("public")}(a.ctrlKey||a.metaKey)&&favourite(this),a.altKey&&boost(this)}}).on("click",".status .actions",function(a){console.log(a);var b=$(a.target),c=b.parents(".status");b.hasClass("fa-star")?favourite(c):b.hasClass("fa-check-circle")||b.hasClass("fa-retweet")?boost(c):b.hasClass("tofu")&&tofu_on_fire(c)}).on("dblclick",".status",function(){var a=$.terminal.active();"more"===a.name()&&a.pop();"instance"!==a.name()||(0<$(this).data("sid")?a.exec("show status id "+$(this).data("sid")):(a.pause(),callAPI("/api/v1/search",{type:"GET",data:{q:$(this).data("uri"),limit:1}}).then(function(b){0<b.statuses.length?(a.resume(),a.exec("show status id "+b.statuses[0].id)):(a.echo("No status found. (Perhaps status was deleted)"),a.resume())})))}).on("click",".status img",function(){var a=$(this);if($.terminal.active().disable(),$(".img_background").fadeIn("first"),$("#pre_view").attr("src",a.attr("src")).fadeIn("first"),"gifv"===a.data("type")){var b=$("#video_view")[0];b.src=a.data("url"),b.loop=!0,b.autoplay=!0,b.muted=!0,b.controls=!0,b.oncanplay=function(){$("#pre_view").fadeOut("first")},$("#video_view").fadeIn("first")}else if("video"===a.data("type")){var c=$("#video_view")[0];c.src=a.data("url"),c.loop=!1,c.autoplay=!0,c.muted=!0,c.controls=!0,c.oncanplay=function(){$("#pre_view").fadeOut("first")},$("#video_view").fadeIn("first")}else if("undefined"!=typeof a.data("url")){var d=new Image;d.onload=function(){$("#img_view").attr("src",a.data("url"))},d.onerror=function(b){console.log(a),console.log(b)},d.src=a.data("url")}}).on("click",".emoji_picker",function(){var a=$.terminal.active();if("instance"===a.name()){$("#toot").is(":hidden")&&a.exec("toot");var b=$(this).children("img"),c=$("#toot_box").val(),d=$("#toot_box").prop("selectionStart"),e=c.slice(0,d),f=c.slice(d);0<e.length&&e.slice(-1).match(/[^ \n]/)&&(e+=" ")," "!==f.slice(0,1)&&(f=" "+f);var g=e+b.attr("alt")+f;d=g.length-f.length+1,$("#toot_box").val(g).prop("selectionStart",d).prop("selectionEnd",d).focus(),setTimeout(update_toot_status,10)}}).on("click",".emoji_summary",function(){var a=$.terminal.active();if("more"===a.name()&&a.pop(),"instance"===a.name()){var b=$(this).children("span").text();a.exec("show emojis custom detail "+b)}}).on("click",".a_acct",function(){var a=$.terminal.active();if("more"===a.name()&&a.pop(),"instance"===a.name()){var b=$(this).text().match(/((?:@?([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z0-9]+))|(?:@([a-zA-Z0-9_]+)))/);callAPI("/api/v1/accounts/search",{data:{q:b[0],limit:1}}).then(function(b){a.exec("show user id "+b[0].id)})}}).on("click","[name=cmd_link]",function(a){var b=$.terminal.active(),c=$(a.target).data("type"),d=parseInt(b.rows()/5),e=parse_sid($(a.target).data("sid")),f="show_followed"===c?"show user id "+$(a.target).data("uid")+" followers":"show_following"===c?"show user id "+$(a.target).data("uid")+" following":"show_statuses_pinned"===c?"show user id "+$(a.target).data("uid")+" statuses pinned":"show_statuses"===c?"show user id "+$(a.target).data("uid")+" statuses limit "+d:"request"===c?"request "+$(a.target).data("req")+" "+$(a.target).data("uid"):"show_faved"===c?"show statuses id "+e.id+" favourited":"show_att"===c&&"unix_id"===e.type?"show timeline local max_id "+e.front+("000000"+(parseInt(e.rear)+1)).slice(-6):"show_att"===c&&"number"===e.type?"show timeline local max_id "+(parseInt(e.id)+1):"show_rebbed"===c?"show statuses id "+e.id+" reblogged":!("del_status"!==c)&&"request delete "+e.id;"more"===b.name()&&b.pop(),"instance"===b.name()&&f&&b.exec(f)}).on("change","#toot_emoji_category, #toot_emoji_tone",update_emoji_picker).on("keyup","#toot_emoji_keyword",update_emoji_picker).on("keydown",".img_background",function(a){27===a.keyCode&&$(".img_background").trigger("click")}).on("keyup",function(a){if(18===a.keyCode)return!1}).on("click",".status_enquete span",function(a){var b=$(a.target).parent(),c=$(b).children().index(a.target),d=b.parents(".status"),e=Date.now()-Date.parse($(b).data("created")),f=$.terminal.active();if(3e4<e)return void f.error("The vote has expired.");var g="/api/v1/votes/"+$(d).data("sid");callAPI(g,{type:"POST",data:{item_index:c}}).then(function(b){b.valid?f.echo("Vote: "+$(a.target).text()):f.error(b.message)},function(a){console.log(a)})}).on("click",".toot_media img",function(a){$(a.target).remove(),$("#toot_box").val($("#toot_box").val().replace($(a.target).data("url"),"")),0===$("#toot_media img").length&&$("#toot_media").slideUp("first")}).on("keydown",function(a){65===a.keyCode&&a.altKey&&term_mode===mode_instance?"none"===$("#toot").css("display")?$.terminal.active().exec("toot"):($("#toot_box").focus(),$.terminal.active().focus(!1)):!$(a.target).parents("#toot").length&&!a.ctrlKey&&17!==a.keyCode&&!a.altKey&&18!==a.keyCode&&$.terminal.active().focus(!0,!0)}).on("click","a",function(a){var b=$(a.currentTarget).prop("href"),c=$(a.currentTarget).prop("target"),d=b.replace(/https?:\/\//,"").split("/"),e=$(a.currentTarget).parents(".status:first"),f={},g="";if(""===d[0])return!1;if("out_of_term"===c)return window.open(b),!1;if("users"===d[1]&&(f.user=d[2]),d[1].match(/^@/)&&(f.user=d[1].replace("@",""),"undefined"!=typeof d[2]&&(f.status=d[2])),"accounts"===d[2]&&(f.account=d[3]),"statuses"===d[3]&&(f.status=d[4]),"statuses"===d[2]&&(f.status=d[3]),"tags"===d[1]&&(f.tag=d[2]),f.tag?g="show timeline tag "+f.tag:d[0]===ins.get().domain&&f.status?g="show status id "+f.status:f.status?g="search local "+b:d[0]===ins.get().domain&&f.account?g="show user id "+f.account:f.user&&(g="show user name "+f.user+"@"+d[0]),""!==g){var h=$.terminal.active();"more"===h.name()&&h.pop(),"instance"===h.name()&&h.exec(g)}else window.open(b);return!1}),window.onerror=function(a,b,c,d,e){console.log([a,b,c,d,e])},autosize($("#toot_box"))});function makeStatus(a,b){var c=null!==a.reblog,d="mention"===a.type,e=c?a.reblog:d?a.status:a,f=new Date(e.created_at),g=config.find("debug.tofu-on-fire");"object"!==_typeof(b)&&(b={});var h,j="undefined"==typeof b.ins_name?ins.name():b.ins_name,k=ins.get(b.ins_name),l={html:"",text:"",is_reblog:c,is_mention:d,instance:j,visibility:!0,payload:a,notification:{voice:!1,desktop:!1,color:!1}};e.application?e.application.website?(h=$("<a />").text(e.application.name).attr("href",e.application.website).attr("target","_blank").prop("outerHTML"),h=" via "+h):h=" via "+e.application.name:h="";var m=(c?$.terminal.format("[[!i;;]reblogged by "+escapeHtml(a.account.display_name)+" @"+a.account.acct+"]")+"<br />":"")+"[ "+(!0===g?"<span class=\"tofu actions\">(\u25A1)</span> ":"")+("undefined"==typeof e.account.display_name?"":escapeHtml(e.account.display_name))+" "+$.terminal.format("[[!;;]@"+e.account.acct+"]")+" "+$("<i />").addClass((e.favourited?"fas":"far")+" fa-star actions").attr("aria-hidden","true").prop("outerHTML")+" "+$("<i />").addClass("fas fa-"+("direct"===e.visibility||"private"===e.visibility?"times-circle":e.reblogged?"check-circle actions":"retweet actions")).attr("aria-hidden","true").prop("outerHTML")+" "+$("<i />").addClass("fa fa-"+("public"===e.visibility?"globe":"unlisted"===e.visibility?"unlock":"private"===e.visibility?"lock":"direct"===e.visibility?"envelope":"question")).attr("aria-hidden","true").prop("outerHTML")+" "+(!0===e.account.bot?"<i class=\"fas fa-robot\" aria-hidden=\"true\"></i> ":"")+(e.in_reply_to_id?$($("<i />").addClass("fas fa-comment-dots")).attr("aria-hidden","true").prop("outerHTML")+" ":"")+" "+f.getFullYear()+"-"+("0"+(f.getMonth()+1)).slice(-2)+"-"+("0"+f.getDate()).slice(-2)+" "+("0"+f.getHours()).slice(-2)+":"+("0"+f.getMinutes()).slice(-2)+":"+("0"+f.getSeconds()).slice(-2)+"."+("00"+f.getMilliseconds()).slice(-3)+" ]"+h;m="<span>"+m+"</span>",l.text=$(m).text(),m=parse_twemoji(m);var n="";if(0<e.mentions.length){for(var H=0;H<e.mentions.length;H++)n+="@"+e.mentions[H].acct+" ";n=n.replace("@"+k.user.acct+" ","")}var o=$("<div />").addClass("status_cell status_avatar"),p=config.find("instances.status.avatar");if("undefined"==typeof p)o.hide();else{var q=e.account.avatar_static,r=e.account.avatar;q.match(/^http/)||(q="https://"+k.domain+q),r.match(/^http/)||(r="https://"+k.domain+r),o.append($("<img />").addClass("avatar_static").attr("name","avatar_s_"+e.account.id).attr("src",q)).append($("<img />").addClass("avatar_animate").attr("name","avatar_m_"+e.account.id).attr("src",r));var i=new Image;if(i.onload=function(){$("[name=avatar_s_"+e.account.id+"]").attr("src",q),q===r&&$("[name=avatar_m_"+e.account.id+"]").attr("src",q)},i.onerror=function(a){console.log(a)},i.src=q,e.account.avatar_static!==e.account.avatar){var I=new Image;I.onload=function(){$("[name=avatar_m_"+e.account.id+"]").attr("src",r)},I.onerror=function(a){console.log(a)},I.src=r}if(a.reblog){var s=a.account.avatar_static,t=$("<div />").append($("<img />").addClass("avatar_reblog").attr("name","avatar_s_"+a.account.id).attr("src",s)),u=new Image;u.onload=function(){$("[name=avatar_m_"+a.account.id+"]").attr("src",s)},u.onerror=function(a){console.log(a)},u.src=s,o.append(t)}}var v,w;if("undefined"!=typeof e.enquete&&null!==e.enquete){w=JSON.parse(e.enquete),question=w.question,$(question).find("span.fa-spin").length&&(question=$("<p />").append($(question).find("span").text()).prop("outerHTML")),question=question.replace(/^(?:<p>)?(.*?)(?:<\/p>)?$/g,"<p><span>$1"+("enquete"===w.type?"(\u56DE\u7B54\u67A0)":"(\u7D50\u679C)")+"</span></p>"),v=$("<div />").append(question);for(var x=$("<div />").addClass("status_"+w.type).attr("data-created",e.created_at),y=0;y<w.items.length;y++)"enquete"===w.type?x.append($("<span />").html(w.items[y])):x.append($("<span />").append($("<span />").addClass("progress ratio").text(w.ratios[y]+"%")).append($("<span />").addClass("progress item").text(w.items[y])).append($("<span />").addClass("proceed").css("width",w.ratios[y].toString()+"%")));v=v.append(x).prop("outerHTML")}else v=e.content,v=v.match(/^<.+>$/)?v.replace(/<p>(.*?)<\/p>/g,"<p><span>$1</span></p>"):$("<p />").append($("<span />").html(v)).prop("outerHTML"),$(v).find("span.fa-spin").length&&(v=$("<p />").append($(v).find("span").text()).prop("outerHTML"));var z;if(0<e.media_attachments.length){z=$("<div />").addClass("status_thumbnail"),e.media_attachments.forEach(function(a){var b=a.preview_url.match(/^https?:\/\//)?a.preview_url:"https://"+k.domain+a.preview_url,c=a.remote_url?a.remote_url:a.url,d="media_"+a.id;z.append($("<img />").attr("id",d).attr("src",b).attr("data-url",c).attr("data-type",a.type));var e=new Image;e.onload=function(){$("#"+d).attr("src",b)},e.onerror=function(a){console.log(a)},e.src=b});var J=config.find("instances.status.thumbnail");"undefined"==typeof J&&z.hide()}var A,B=$("<div />").addClass("status_contents").attr("id","status_contents"),C=e.spoiler_text;l.text+=(C.length?$("<div />").html(C).text():"")+$(v).text(),e.account.hasOwnProperty("profile_emojis")&&0<e.account.profile_emojis.length&&(m=parse_emojis(m,e.account.profile_emojis)),e.hasOwnProperty("profile_emojis")&&0<e.profile_emojis.length&&(v=parse_emojis(v,e.profile_emojis),C=parse_emojis(C,e.profile_emojis)),e.account.hasOwnProperty("emojis")&&0<e.account.emojis.length&&(m=parse_emojis(m,e.account.emojis)),e.hasOwnProperty("emojis")&&0<e.emojis.length&&(v=parse_emojis(v,e.emojis),C=parse_emojis(C,e.emojis)),v=parse_twemoji(v),C=parse_twemoji(C),A=$("<div />"),0<C.length?(B.append("<span>"+C+"</span>"),A.append(v)):B.append(v),"undefined"!=typeof z&&e.sensitive?A.append(z):"undefined"!=typeof z&&B.append(z),0<A.children().length&&B.append($("<div />").addClass("read_more").append($("<span/>").text("-- More --"))).append(A.hide());var D=$("<div />").addClass("status_cell status_main").append($("<div />").addClass("status_head").html(m)).append(B),E=$("<div />").attr("name","id_"+e.id).attr("data-sid",e.id).attr("data-instance",j).attr("data-uid",e.account.id).attr("data-dispname",e.account.display_name).attr("data-acct",e.account.acct).attr("data-fav",e.favorited?"1":"0").attr("data-reb",e.reblogged?"1":"0").attr("data-reply",n).addClass("status").append($("<div />").addClass("status_table").append(o).append($(D)));if(0===e.id&&E.attr("data-uri",e.uri),"mouseover"===p?E.addClass("status_mouseover"):"animation"===p?E.addClass("status_animation"):("standard"===p||!0===p)&&E.addClass("status_standard"),"string"==typeof b.tl_name){var K="stream_"+e.id;if(0<$("[name="+K+"]").length)return l.visibility=!1,l;var L=ws.stream.length-(!ws.monitor.home&&ws.monitor.notification?1:0);if(1<L){var M=$("<div />").attr("name",K).append($("<span />").html(b.tl_name+" streaming updated."));l.text=M.text()+l.text,E.prepend(M)}}if(ins.acls.hasOwnProperty(j))for(var N in ins.acls[j]){var O=ins.acls[j][N];if(l.text.match(O.regexp)){if("deny"===O.type){l.visibility=!1;break}else if("drop"===O.type)break;var P=url_params.hasOwnProperty("acl")?url_params.acl:"";P=P.split(","),"permit"===O.type&&O.hasOwnProperty("color")&&0>P.indexOf("col")&&(E.addClass("status_"+O.color),l.notification.color=O.color);config.find(["instances","terminal","monitor","notification"]);if("permit"===O.type&&O.notify&&0>P.indexOf("not")){var F="ACL "+N+": "+e.account.display_name+" @"+e.account.acct,G=$(e.content).text();100<G.length&&(G=G.slice(0,100)),l.notification.desktop={title:F,body:G,icon:e.account.avatar_static}}"permit"===O.type&&O.hasOwnProperty("voice")&&0>P.indexOf("voi")&&(l.notification.voice=O.voice);break}}return config.find("instances.status.separator")&&E.addClass("separator"),E.append($("<div />").addClass("status_all").css("display","none").text(JSON.stringify(a))),l.html=E.prop("outerHTML"),l}function make_notification(a,b){var c="favourite"===a.type&&b.favourite,d="reblog"===a.type&&b.reblog,e="follow"===a.type&&b.following,f="mention"===a.type&&b.mention,g={html:""},h="";if(c||d||e||f){var i=a.status?parse_status(a.status):{},j=a.account?parse_account(a.account):{};h="<i class=\"fas fa-"+("favourite"===a.type?"star":"reblog"===a.type?"retweet":"mention"===a.type?"comment-dots":"follow"===a.type?"handshake":"bell")+"\" aria-hidden=\"true\"></i> "+j.parsed_display_name+" "+$.terminal.format("[[!;;]@"+j.acct_full+"]")+"<br />"+(i.parsed_content||""),h=$("<span />").html(h).addClass("status_notify").prop("outerHTML"),"mention"===a.type&&(g.status=makeStatus(a.status),h+=g.status.html)}return g.html=h,g}function parse_emojis(a){for(var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:[],c=0;c<b.length;c++){var d="emoji_"+b[c].shortcode.replace(/^@/,"p-"),e=b[c].url,f=":"+b[c].shortcode+":",g=$("<img />").addClass("emoji").attr("name",d).attr("alt",f).attr("title",f).attr("src",e),h=new RegExp(f+"(?!\")","g");a=a.replace(h,g.prop("outerHTML"))}return a}function parse_emojis_from_content(a){for(var b,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],d=(a.match(/.?:@?[a-zA-Z0-9_]+:.?/g)||[]).map(function(a){var b=a.match(/^(.)?(:(.+):)(.)?/),d=b[3],e=c.find(function(a){return a.shortcode===d}),f=(void 0===b[1]||b[1].match(/[ ​]/))&&(void 0===b[4]||b[4].match(/[ ​]/));return{matches:b,valid:f,shortcode:d,target:e}}),e=0;e<d.length;e++)if(b=d[e],b.valid&&b.target){var f="emoji_"+b.target.shortcode.replace(/^@/,"p-"),g=b.target.url,h=":".concat(b.shortcode,":"),j=$("<img />").addClass("emoji").attr("name",f).attr("alt",h).attr("title",h).attr("src",g),k=new RegExp(h+"(?!\")","g");a=a.replace(k,j.prop("outerHTML"))}return a}function parse_account(a){var b=a.acct,c=escapeHtml(a.display_name),d=a.note,e=a.url.match(/https?:\/\/([^\/]+)\/@([^\/]+)/);c=parse_twemoji(c),d=parse_twemoji(d),e&&(b="".concat(e[2],"@").concat(e[1]));var f=a.emojis||[];return f=f.concat(a.profile_emojis||[]),0<f.length&&(c=parse_emojis(c,f),d=parse_emojis(d,f)),a.acct_full=b,a.parsed_display_name=c,a.parsed_note=d,a}function parse_status(a){var b=a.content,c=a.spoiler_text||"";b=parse_twemoji(b),c=parse_twemoji(c);var d=a.emojis||[];return d=d.concat(a.profile_emojis||[]),0<d.length&&(b=parse_emojis(b,d),c=parse_emojis(c,d)),a.parsed_content=b,a.parsed_spoiler_text=c,a.account=parse_account(a.account),a}function parse_twemoji(a){return twemoji.parse(a,{attributes:function c(a,b){return{title:b}}})}function parse_sid(a){var b=new String(a),c={};return 16<b.length?(c.type="unix_id",c.unix=parseInt(b/65536),c.front=b.slice(0,-6),c.rear=b.slice(-6),c.id=b.toString()):parseInt(b.toString())?(c.type="number",c.id=b.toString()):c.type="error",c}function post_status(){var a=$("#toot_box").val().trim(),b=ins.get(),c=500-$("#toot_box").val().length-$("#toot_cw").val().length;if(0===a.length||0>c)return!1;if("undefined"==typeof b&&"undefined"==typeof b.access_token)return!1;a=a.replace(/(:[a-zA-Z0-9_]{2,}:) /g,"$1\u200B").replace(/ (:[a-zA-Z0-9_]{2,}:)/g,"\u200B$1");var d=$("#toot_cw").val().trim(),e=$("#toot_visibility").val(),f={status:a,visibility:e};0!==d.length&&(d=d.replace(/(:[a-zA-Z0-9_]{2,}:) /g,"$1\u200B").replace(/ (:[a-zA-Z0-9_]{2,}:)/g,"\u200B$1"),f.spoiler_text=d);var g=$(".reply #sid").text();""!==g&&(f.in_reply_to_id=g),f.media_ids=[];for(var h=$("#toot_media img"),j=0;j<h.length;j++)f.media_ids.push($(h[j]).data("id"));return 0<f.media_ids.length&&(f.sensitive=$("#nsfw").prop("checked")),$.ajax({url:"https://"+b.domain+"/api/v1/statuses",type:"POST",headers:{Authorization:b.token_type+" "+b.access_token},data:f,timeout:5e3}).then(function(){var a=config.find("instances.visibility");"undefined"==typeof a&&(a="public"),$("#toot_cw").val(""),$("#toot_visibility").val(a),$("#reply_close").trigger("click"),$("#toot_media").html(""),$("#toot_box").val("").trigger("keyup").focus(),autosize.update($("#toot_box"))},function(a){$.terminal.active().error("Toot post error.("+a.status+")"),console.log(a)})}function reduce_output(){for(var a=$(".terminal-output>div"),b=a.length-220,c=0;c<b;c++)$(a[c]).remove()}function callAPI(a){var b,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},d="undefined"==typeof c.instance_name?ins.get():ins.get(c.instance_name),e=config.find("instances.request-timeout")||10;return e*=1e3,"undefined"==typeof a?(b=new $.Deferred,b.reject("Undefined path")):"undefined"==typeof d?(b=new $.Deferred,b.reject("No instance")):"undefined"==typeof d.access_token?(b=new $.Deferred,b.reject("No login")):b=$.ajax({url:"https://"+d.domain+a,type:"undefined"==typeof c.type?"GET":c.type,headers:{Authorization:d.token_type+" "+d.access_token},data:_typeof(c.data)?c.data:"",dataType:"json",timeout:e}).then(function(a,b,c){return c},function(b){return term_error("API Request Error",{path:a,opts:c}),b}),b}function callMore(a,b){var c,d,e=2<arguments.length&&arguments[2]!==void 0?arguments[2]:{},f=20,g=[],h={},j=!0;e.hasOwnProperty("params")&&(h=e.params),e.hasOwnProperty("limit")&&(f=e.limit),c=e.hasOwnProperty("term")?e.term:$.terminal.active(),e.hasOwnProperty("raw")&&(j=e.raw),c.push(function(){reduce_output()},{name:"more",prompt:"--More-- ",onStart:function g(c){c.pause(),h.limit=f,callAPI(a,{type:"GET",data:h}).then(function(a,f,g){e.hasOwnProperty("header")&&c.echo(e.header);for(var h,k=0;k<a.length;k++)h=b(a[k]),h&&c.echo(h,{raw:j}),d=e.hasOwnProperty("next")?e.next(a,g):a[k].id;0>=d&&c.pop(),c.resume()},function(a){c.error("Getting data is failed.("+a.status+")"),console.log(a),c.pop(),c.resume()})},onExit:function b(a){e.hasOwnProperty("footer")&&a.echo(e.footer),setTimeout(function(){a.set_command("")},10),a.resume()},keydown:function i(c,k){function l(a){if(0<a){a=g.length<a?g.length:a;for(var b,c=0;c<a;c++)b=g.shift(),k.echo(b,{raw:j,flush:!1});k.flush()}}switch(c.keyCode){case 27:case 81:k.pop(),k.set_command("");case 16:case 17:case 18:break;case 13:default:k.pause();var m=13===c.keyCode?1:f;h.limit=100,0<d?h.max_id=d:0===g.length&&k.pop(),0<g.length?(l(m),k.resume(),0===g.length&&0>=d&&k.pop()):callAPI(a,{type:"GET",data:h}).then(function(a,c,f){if(0===a.length)return void k.pop();g=[];for(var h,j=0;j<a.length;j++)h=b(a[j]),h&&g.push(h),d=e.hasOwnProperty("next")?e.next(a,f):a[j].id;l(m),k.resume(),0===g.length&&0>=d&&k.pop()},function(a){console.log(a),k.error("Getting data is failed.("+a.status+")")}),setTimeout(function(){k.set_command("")},10);}return reduce_output(),!0}})}function favourite(a,b){if(0>=$(a).data("sid"))return void b.error("couldn't send a request (search engine status).");var c=1==$(a).data("fav"),d=$(a).find(".status_head i"),e="/api/v1/statuses/"+$(a).data("sid").toString()+(c?"/unfavourite":"/favourite");"undefined"==typeof b&&(b=$.terminal.active()),$(d[0]).removeClass().addClass("fas fa-spinner fa-pulse"),callAPI(e,{instance_name:$(a).data("instance"),type:"POST"}).then(function(e){$("[name=id_"+$(a).data("sid").toString()+"]").each(function(a,b){$(d[0]).removeClass().addClass((e.favourited?"fas":"far")+" fa-star actions"),$(b).data("fav",e.favourited?"1":"0")}),c===e.favourited&&b.error("favourited missed...")},function(a){$.terminal.active().error("Favorite failed.("+a.status+")"),$(d[0]).removeClass().addClass((c?"fas":"far")+" fa-star actions"),console.log(a)})}function closeTootbox(){$("#sid").text(""),$("#reply").hide(),$("#toot_box").val(""),$("#toot").slideUp("first"),$.terminal.active().enable()}function boost(a){if(0>=$(a).data("sid"))return void term.error("couldn't send a request (search engine status).");var b=$(a).find(".status_head i");if(!$(b[1]).hasClass("fa-times-circle")){var c=1==$(a).data("reb"),d="/api/v1/statuses/"+$(a).data("sid").toString()+(c?"/unreblog":"/reblog");"undefined"==typeof term&&(term=$.terminal.active()),$(b[1]).removeClass().addClass("fas fa-spinner fa-pulse"),callAPI(d,{instance_name:$(a).data("instance"),type:"POST"}).then(function(d){$("[name=id_"+$(a).data("sid").toString()+"]").each(function(a,c){$(b[1]).removeClass().addClass("actions fas fa-"+(d.reblogged?"check-circle":"retweet")),$(c).data("reb",d.reblogged?"1":"0")}),c===d.reblogged&&term.error("reblogged missed...")},function(a){$.terminal.active().error("Reblogged failed.("+a.status+")"),$(b[1]).removeClass().addClass("actions fas fa-"+(c?"check-circle":"retweet")),console.log(a)})}}function tofu_on_fire(a){var b=$("<div>").append($("<div>").addClass("status_table").append($("<div>").addClass("status_cell status_avatar").append($("<img>").addClass("avatar_static avatar_animate").attr("src","https://twemoji.maxcdn.com/2/72x72/1f525.png"))).append($("<div>").addClass("status_cell status_main").append($("<div>").addClass("status_head").append($("<span>").html(twemoji.parse("[ \uD83D\uDCDB \uD83D\uDD25\uD83D\uDD25\uD83D\uDD25 \uD83D\uDD25\uD83D\uDD25\uD83D\uDD25@\uD83D\uDD25\uD83D\uDD25 \uD83D\uDD25\uD83D\uDD25\uD83D\uDD25 \uD83D\uDD25\uD83D\uDD25-\uD83D\uDD25-\uD83D\uDD25 \uD83D\uDD25:\uD83D\uDD25:\uD83D\uDD25.\uD83D\uDD25 ]")))).append($("<div>").addClass("status_contents").append($("<p>").html(twemoji.parse("<span>\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25</span>"))))));$(a).html(b.html())}function tab(a,b,c){for(var d=escape(a).replace(/%u[0-9a-f]{2,6}/ig,"xx").replace(/%[0-9a-f]{2}/ig,"x"),e=d.length,f=c<=e?a.substr(0,c-4)+"... ":a,g=e;g<c;g++,f+=" ");return f+b}String.prototype.addTab=function(a,b){return tab(a,this,b)};function term_error(a,b){var c,d=new Date,e=localStorage.getItem("configuration"),f=localStorage.getItem("term_error");f=f?JSON.parse(f):[],e=e?e:{},c="object"===_typeof(b)?JSON.parse(JSON.stringify(b)):b?b:{};var g=JSON.stringify({running_config:config.config,startup_config:e,default_config:config.default,instances:ins.instances,status:{message:a,created_at:d.getTime()},params:c});f.push(JSON.parse(g)),5<f.length&&f.shift(),localStorage.setItem("term_error",JSON.stringify(f))}function OutputText(c,d){var e=new Blob(["\uFEFF",c]);if(navigator.msSaveBlob)navigator.msSaveOrOpenBlob(e,d);else{var b=$("<a />").attr("href",URL.createObjectURL(e)).attr("download",d).attr("target","_blank");$("body").append(b),b[0].click(),b.remove()}}function escapeHtml(a){return"string"==typeof a?a.replace(/[&'`"<>]/g,function(a){return{"&":"&amp;","'":"&#x27;","`":"&#x60;",'"':"&quot;","<":"&lt;",">":"&gt;"}[a]}):a}function more(a,b){var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:{},d=a.rows(),e=a.get_command(),f=0;a.push(function(){},{name:"more",prompt:"--More-- ",onStart:function g(a){a.echo(b.slice(f,f+d).join("\n"),c.echo_opt),f+=d,f>b.length&&(a.pop(),c.reverse&&a.set_command(e)),a.resume()},keydown:function h(a,g){switch(a.keyCode){case 81:g.pop(),c.reverse&&g.set_command(e);break;case 13:g.echo(b.slice(f,f+1).join("\n"),c.echo_opt),f++,f>b.length&&(g.pop(),c.reverse&&g.set_command(e));break;default:g.echo(b.slice(f,f+d).join("\n"),c.echo_opt),f+=d,f>b.length&&(g.pop(),c.reverse&&g.set_command(e)),g.set_command("");}return!1}})}function begin(a,b,c,d){var e=0;for(e=0;e<b.length&&!b[e].match(d);e++);more(a,b.slice(e),c,d)}function include(a,b,c,d){for(var e=[],f=0;f<b.length;f++)b[f].match(d)&&e.push(b[f]);more(a,e,c)}function exclude(a,b,c,d){for(var e=[],f=0;f<b.length;f++)b[f].match(d)||e.push(b[f]);more(a,e,c)}
//# sourceMappingURL=main.js.map
