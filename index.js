// ==UserScript==
// @name         外链直跳
// @namespace    https://github.com/melon95
// @version      0.1
// @description  遇到所谓的“外部链接安全提示”页面直接跳转
// @author       melon95
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/*
// @match        https://juejin.cn/*
// @match        https://www.jianshu.com/*
// @match        https://blog.csdn.net/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  const siteMap = {
    'zhuanlan.zhihu.com': {
      key: 'target',
      hrefPrefix: 'https://link.zhihu.com'
    },
    'www.zhihu.com': {
      key: 'target',
      hrefPrefix: 'https://link.zhihu.com'
    },
    'juejin.cn': {
      key: 'target',
      hrefPrefix: 'https://link.juejin.cn'
    },
    'www.jianshu.com': {
      key: 'to',
      hrefPrefix: 'https://links.jianshu.com'
    },
    // CSDN 是通过事件委托来实现跳转到安全中心的，要单独处理
    'blog.csdn.net': {
      key: '',
      hrefPrefix: ''
    },
    'segmentfault.com': {
      key: 'enc',
      hrefPrefix: 'https://link.segmentfault.com'
    }
  }

  const hasClickEnventListenerList = ['blog.csdn.net']


  function replaceOutsideHref({ key, hrefPrefix }) {
    const list = getAllOutsideDom(hrefPrefix)
    const hasClickEnvenListener = hasClickEnventListenerList.includes(currentDomain)
    list.map(dom => {
      const uglyHref = dom.getAttribute('href')
      const prettierHref = parseHrefFromHref(uglyHref, key)
      if (prettierHref) {
        dom.setAttribute('href', prettierHref)
        dom.setAttribute('target', '_blank')
        if (hasClickEnvenListener) {
          dom.addEventListener('click', e => {
            // 阻止事件冒泡，防止在冒泡中给链接添加前缀
            e.stopPropagation()
          })
        }
      }
    })
  }

  function getAllOutsideDom(hrefPrefix) {
    // 兼容通过事件委托来控制跳转
    const attrValue = hrefPrefix ? `^="${hrefPrefix}"` : ''
    const aList = document.querySelectorAll(`a[href${attrValue}]`)
    return Array.from(aList)
  }

  function parseHrefFromHref(uglyHref, key) {
    let prettierHref
    try {
      const val = new URL(uglyHref).searchParams.get(key)
      prettierHref = val || uglyHref
    } catch (e) {
      console.log('Invalid URL: ', uglyHref)
      console.log(e)
    }
    return prettierHref
  }

  const currentDomain = window.location.host
  // 掘金同步下获取不到DOM节点。所以干脆就异步处理，不影响体验
  setTimeout(() => {
    if (siteMap[currentDomain]) {
      replaceOutsideHref(siteMap[currentDomain])
    }
  }, 2000)
})();