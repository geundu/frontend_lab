// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app4.js":[function(require,module,exports) {
var ajax = new XMLHttpRequest();
var container = document.getElementById('root');
var content = document.createElement('div');
var NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
var CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function newsFeed() {
  var newsFeed = getData(NEWS_URL);
  var newsList = [];
  newsList.push('<ul>');

  for (var i = 0; i < 10; i++) {
    var div = document.createElement('div');
    newsList.push("\n      <li>\n      <a href='#".concat(newsFeed[i].id, "'>").concat(newsFeed[i].title, "(").concat(newsFeed[i].comments_count, ")</a>\n    </li>\n    "));
  }

  newsList.push('</ul>');
  container.innerHTML = newsList.join('');
}
/*
또 한 가지는 라우터에서 글 내용 화면도 호출해야 하고
글 내용은 함수로 되어있기는 하지만 이벤트 핸들러에게 묶여있어
이렇게 익명함수로 되어있음녀 다른 한쪽에서 이 함수를 부를 방법이 없다.
그래서 함수로 빼야 한다.
*/


function newsDetail() {
  var id = location.hash.substr(1);
  var newsContent = getData(CONTENT_URL.replace('@id', id));
  var title = document.createElement('h1');
  container.innerHTML = "\n  <h1>".concat(newsContent.title, "</h1>\n  <div>\n  <a href='#'>\uBAA9\uB85D\uC73C\uB85C</a>\n  </div>\n  ");
} // end of newsDetail()


function router() {
  var routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else {
    newsDetail();
  }
} // end of router()


window.addEventListener('hashchange', router);
router();
/*
이 상태로 실행하면 아무것도 안보인다.
이제 함수를 호출하는 라우터 코드를 만들어보자.
라우터를 동작하는 방식을 생각해보면 라우터는 화면이 전환되어야 할 때 라우터가 판단해서 해당하는 화면으로
전환시키면 된다. 그런데 화면이 전환되어야 할 때라는 건 무엇인가?
기존의 hashchange 해시가 바뀌는 걸 화면의 전환을 위한 트리거로써 사용하고 있었다.
그런데 지금 hashchange에 뭐가 걸려있냐면 newDetail이 걸려있다.
즉, 해시가 바뀌면 무조건 글 내용을 보는 것이다. 이렇게 되어있는 거다.
그러다 화면이 여러 개 있으면 해시가 바뀌면 글 내용을 보여줄 수도 있고 목록을 보여줄 수도 있고,
이렇게 되면 해시의 종류가 많아진다. 페이지의 종류가 늘어날테니까 바로 이 해시를 router에게 주면 된다.
바로 hashchange가 일어났을 때 동작하는 함수를 기존의 enwsDetail이 아니라 라우터한테 주면 라우터가
해시가 바뀔 때마다 동작하게 되고 그럼 그 라우터 안에서 어떤 해시냐에 따라 글목록을
보여줄 수도 있고 내용을 보여줄 수도 있게 될 것이다.
*/
// for (let i = 0; i < 10; i++) {
//   const div = document.createElement('div');
//   /*
//   이 부분에 는 구조가 거의 개발자 도구에서 보는 것과 비슷하다.
//   내가 만들고있던 마크업의 구조가 이런 것이구나 알 수 있다.
//   월씬 더 개선된 구조라고 할 수 있다.
//   <li> 하위의 UI가 복잡해지면 마크업 구조가 복잡해질 것이고,
//   여러 가지가 들고갈텐데 그럼에도 문제가 될 건 없다.
//   양이 늘어날뿐 복잡도는 거의 그대로이기때문.
//   이렇게 DOM API를 최소한으로만 사용하고 문자열을 이용해서
//   마크업구조를 선명하게 드러내보일 수 있다.
//   */
//   div.innerHTML = `
//   <li>
//     <a href='#${newsFeed[i].id}'>${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
//   </li>
//   `;
//   ul.appendChild(div.firstElementChild);
// }
// container.appendChild(ul);
// container.appendChild(content);
// /*
// DOM API를 이용해서 UI 구조가 자 ㄹ드러나지 않는 문제접을
// 해결하는 방법은 DAOM API 자체를 최대한 사용하지 않는 것이다
// */
},{}],"C:/Users/GEUNDU-HOME/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "8435" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/GEUNDU-HOME/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app4.js"], null)
//# sourceMappingURL=/app4.6201dd59.js.map