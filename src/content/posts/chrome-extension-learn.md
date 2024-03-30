---
title: Chrome Extension 入门
description: Chrome Extension 入门，通过介绍插件的组成以及插件之间的通信方式来快速的编写一个属于自己的插件。
pubDate: 2023-12-10
categories: ['Chrome Extension']
---

# Chrome插件开发入门

一个 `Chrome Extension`[^1]包含如下内容

![示例图](/Xnip2023-12-10_19-50-20.png)


## manifest.json

这个文件是插件的配置文件（官方称之为清单文件），里面包含了插件的名称、版本、所用到的权限等等
```json
{
    "name": "Getting Started Example",
    "description": "Build an Extension!",
    "version": "1.0",
    "manifest_version": 3,
    "permissions": ["scripting", "activeTab", "contextMenus"],
    "host_permissions": ["<all_urls>"],
    "background": {
        "service_worker": "background.js"
    },
    "action": {
        "default_popup": "popup.html",
        "default_icon": "/images/hello.png"
    },
    "content_scripts": [{
        "js": ["content.js"],
        "matches": ["https://juejin.cn/*"]
    }]
}
```
## backgoround.js
`background`是背景脚本，顾名思义也就是在幕后做一些事情，通常运行作为一个扩展进程运行在后台，并且全局只运行一次。它可以与 `content_scripts` 以及 `action`进行通信，稍后会讲到。

## content.js
`content`脚本则是作用于台前，它可以改变网页的`dom`元素以及网页的`css`，并且每次打开一个网页他都会运行。

## popup.js
`popup`也就是插件的弹出页，由html、css、js组成，右上角点击插件的icon就会弹出这个页面，而这个页面通常也需要绑定对应的脚本，由于插件本身不支持内联的`js`，因此脚本的`js`只能以`js`文件导入的形式进行引入。popup还有个特点，它的dom元素是与页面的dom元素是隔离的。
```html
<body>
    <script src="./popup.js"></script>
</body>
```

## 通信

![示例图](/Xnip2023-12-10_19-52-13.png)
通信需要双方合作才能通信，什么意思呢，在插件中要是想通信，那么一方必须是发送而另一方必须接收，也就是说两者缺一不可。


- 发送方：
    background 发送消息进行通信需要调用`chrome.runtime.sendMessage`这个API，传入action（动作）和payload（载荷），如下所示：

    ```js
    btn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
                action: 'content click',
                payload: 'I come from content.js',
        })
    })
    ```

    popup发送消息通常是发送给当前激活的tab，也就是浏览器当前所在的页面，发送消息多了一个`tabId`，因为要指定发送给哪个tab，代码示例如下：
    ```js
    btn2.addEventListener('click', async event => {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })
    chrome.tabs.sendMessage(tab.id, {
        action: 'click',
        payload: 'i come form popop',
    })
    })
    ```

- 接收方
    有发送方，必定需要有接收方，接收方可能有多个，比如content发送消息时background和popup都能收到，那么由谁来处理呢，这时候就可以根据action来判断到底是哪一个接收方去处理，代码如下：
    ```js
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { action, payload } = request
        console.log(action, payload, 'popop got!')
        sendResponse('popop got!')
    })
    ```

## 示例代码

- chrome-extension-learn[^2]
- Chrome插件合集[^3]
- 基于 ChatGPT 实现一个划词翻译 Chrome 插件[^4]

<center>
	<p>欢迎关注我的公众号: <span style="font-weight: 600;color: blue;">小付同学的开发日常</span>，原创技术文章第一时间推送。</p>
    <img src="https://pic.ziyuan.wang/user/guest/2024/01/傅1_1932a233b5837.jpeg" style="width: 300px;">
</center>


# 参考
[^1]: Chrome Developer Document: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts?hl=zh-cn
[^2]: chrome-extension-learn: https://github.com/towelong/chrome-extension-learn
[^3]: Chrome插件合集: https://juejin.cn/column/7204445469099098167
[^4]: 基于 ChatGPT 实现一个划词翻译 Chrome 插件: https://www.aneasystone.com/archives/2023/06/chrome-extension-with-chatgpt.html

