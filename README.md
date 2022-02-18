# 弹窗拖拽缩放

[![]()](https://liuzhenghe30265.github.io/dialog-demo)

[Github](https://github.com/liuzhenghe30265/dialog-demo.git)

-   Element 给 Dialog 添加自定义指令可以实现拖拽功能，但无法去掉遮罩层，下方元素不可点击。
-   View UI Modal 去除遮罩层，可以点击下方元素，可添加自定义指令扩展缩放功能和 ios 设备的拖拽功能。且多个弹窗互不影响。

## iview Modal

View UI 的弹窗支持拖拽功能，多个弹窗也互不影响，如果项目使用的是 Element，可以按需加载 View UI 的弹窗组件。

```bash
npm install view-design --save
npm install babel-plugin-import --save-dev
```

### vue-cli2

.babelrc

```
{
  "presets": [],
  "plugins": [["import", {
    "libraryName": "view-design",
    "libraryDirectory": "src/components"
  }]]
}
```

### vue-cli3

babel.config.js

```
module.exports = {
  presets: [
    // ...
  ],
  plugins: [
    ['import', {
      libraryName: 'view-design',
      libraryDirectory: 'src/components'
    }]
  ]
}
```

main.js

```
import 'view-design/dist/styles/iview.css'
import { Modal } from 'view-design'
Vue.component('Modal', Modal)
```

防止 iview.css 影响项目原本样式，可单独加 Modal 的样式：

```
.ivu-modal {
  width: auto;
  margin: 0 auto;
  position: relative;
  outline: 0;
  top: 100px
}

.ivu-modal-hidden {
  display: none !important
}

.ivu-modal-wrap {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  -webkit-overflow-scrolling: touch;
  outline: 0
}

.ivu-modal-wrap * {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent
}

.ivu-modal-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 1000
}

.ivu-modal-mask-hidden {
  display: none
}

.ivu-modal-content {
  position: relative;
  border: 0;
}

.ivu-modal-content-no-mask {
  pointer-events: auto
}

.ivu-modal-content-drag {
  position: absolute
}

.ivu-modal-content-drag .ivu-modal-header {
  cursor: move
}

.ivu-modal-content-dragging {
  user-select: none
}

.ivu-modal-header p,
.ivu-modal-header-inner {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.ivu-modal-close {
  z-index: 1;
  position: absolute;
  right: 8px;
  top: 8px;
  overflow: hidden;
  cursor: pointer
}

.ivu-modal-close .ivu-icon-ios-close {
  transition: color .2s ease;
  position: relative;
  top: 1px
}

.ivu-modal-close .ivu-icon-ios-close:hover {
  color: #444
}

.ivu-modal-fullscreen {
  width: 100% !important;
  top: 0;
  bottom: 0;
  position: absolute
}

.ivu-modal-fullscreen .ivu-modal-content {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0
}

.ivu-modal-fullscreen .ivu-modal-body {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 51px;
  bottom: 61px
}

.ivu-modal-fullscreen-no-header .ivu-modal-body {
  top: 0
}

.ivu-modal-fullscreen-no-footer .ivu-modal-body {
  bottom: 0
}

.ivu-modal-fullscreen .ivu-modal-footer {
  position: absolute;
  width: 100%;
  bottom: 0
}

.ivu-modal-no-mask {
  pointer-events: none
}
```

使用：

```
    <Modal
      v-model="modal1"
      draggable
      sticky
      reset-drag-position
      footer-hide
      scrollable
      :mask="false"
      class-name=""
      :title="'title'"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change"
      :width="400"
      :styles="{top: '200px'}">
      <div>
        modal1
      </div>
    </Modal>
```

### 扩展缩放和 ios 设备拖拽功能

DragAndZoom.js

```
/* eslint-disable */
import Vue from 'vue'

/**
v-DragAndZoom: 弹窗拖拽和缩放
该指令针对 iview Modal，修改 dialogHeaderEl，dragDom 等配置适配其他弹窗
使用示例：
    <Modal
      v-model="visible.show"
      v-DragAndZoom="DragAndZoom"
      draggable
      sticky
      reset-drag-position
      footer-hide
      scrollable
      :mask="false"
      class-name="custom_modal_style"
      :title="title"
      @on-ok="ok"
      @on-cancel="cancel"
      :width="width">
      <div>
        <slot
          name="content" />
      </div>
    </Modal>

  methods: {
    // 接收通过 binding.value() 传递过来的值
    DragAndZoom (data) {
      console.log('.............data', data)
    },
  }
 */
Vue.directive('DragAndZoom', {
  bind (el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.ivu-modal-header')
    const dragDom = el.querySelector('.ivu-modal-content')
    dialogHeaderEl.style.cursor = 'move'
    // 元素初始的宽（再次打开弹窗时，还原弹窗最初的尺寸）
    const initWidth = parseInt(dragDom.getAttribute('style').replace(/[^0-9]/ig, ''))
    binding.value({
      el,
      initWidth
    })

    // 获取原有属性 ie dom 元素 currentStyle，火狐谷歌 window.getComputedStyle(dom元素, null)
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    // PC 端（iview Modal 自带拖拽功能，仅需兼容下 ios 设备）
    // dialogHeaderEl.onmousedown = (e) => {
    //   // 鼠标按下，计算当前元素距离可视区的距离
    //   const disX = e.clientX - dialogHeaderEl.offsetLeft
    //   const disY = e.clientY - dialogHeaderEl.offsetTop

    //   let styL, styT
    //   // 在 ie 中第一次获取到的值为组件自带 50%，移动之后赋值为 px
    //   if (sty.left.includes('%')) {
    //     styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
    //     styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
    //   } else {
    //     // 获取到的值带 px 正则匹配替换
    //     styL = +sty.left.replace(/\px/g, '')
    //     styT = +sty.top.replace(/\px/g, '')
    //   }

    //   document.onmousemove = function (e) {
    //     const l = e.clientX - disX
    //     const t = e.clientY - disY
    //     dragDom.style.left = `${l + styL}px`
    //     dragDom.style.top = `${t + styT}px`

    //     // 将位置数据传出去
    //     // binding.value({x:e.pageX,y:e.pageY})
    //   }

    //   document.onmouseup = function (e) {
    //     document.onmousemove = null
    //     document.onmouseup = null
    //   }
    // }

    // ios 设备
    dialogHeaderEl.ontouchstart = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.touches[0].clientX - dialogHeaderEl.offsetLeft
      const disY = e.touches[0].clientY - dialogHeaderEl.offsetTop

      let styL, styT

      // 获取到的值带px 正则匹配替换
      styL = +sty.left.replace(/\px/g, '')
      styT = +sty.top.replace(/\px/g, '')

      document.ontouchmove = function (moveE) {
        const l = moveE.touches[0].clientX - disX
        const t = moveE.touches[0].clientY - disY
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.ontouchend = function (e) {
        document.ontouchend = null
        document.ontouchmove = null
      }
    }

    // 右下角加一个缩放按钮
    const zoomBtn = document.createElement('a')
    zoomBtn.style.cssText = 'width: 20px;height: 20px;display: block;position: absolute;right: 0;bottom: 0;'
    dragDom.appendChild(zoomBtn)

    // PC 端
    zoomBtn.onmousedown = (e) => {
      const mouseDownX = e.clientX
      const mouseDownY = e.clientY
      const clickBoxWeight = dragDom.offsetWidth
      const clickBoxHeight = dragDom.offsetHeight
      document.onmousemove = function (e) {
        const xx = e.clientX
        const yy = e.clientY
        let W = clickBoxWeight + xx - mouseDownX
        let H = clickBoxHeight + yy - mouseDownY
        if (W < 300) {
          W = 300
        }
        if (H < 160) {
          H = 160
        }
        dragDom.style.width = W + 'px'
        dragDom.style.height = H + 'px'
        // 将变化的宽高传递出去
        binding.value({
          W,
          H
        })
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
    }

    // ios 设备
    zoomBtn.ontouchstart = (e) => {
      const mouseDownX = e.touches[0].clientX
      const mouseDownY = e.touches[0].clientY
      const clickBoxWeight = dragDom.offsetWidth
      const clickBoxHeight = dragDom.offsetHeight
      document.ontouchmove = function (e) {
        const xx = e.touches[0].clientX
        const yy = e.touches[0].clientY
        let W = clickBoxWeight + xx - mouseDownX
        let H = clickBoxHeight + yy - mouseDownY
        if (W < 300) {
          W = 300
        }
        if (H < 160) {
          H = 160
        }
        dragDom.style.width = W + 'px'
        dragDom.style.height = H + 'px'
        binding.value({
          W,
          H
        })
      }
      document.ontouchend = function () {
        document.ontouchend = null
        document.ontouchmove = null
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
    }
  }
})
```

main.js

```
import '@/utils/DragAndZoom.js'
```

使用：

```
    <Modal
      v-model="modal1"
      draggable
      v-DragAndZoom="DragAndZoom"
      sticky
      reset-drag-position
      footer-hide
      scrollable
      :mask="false"
      class-name=""
      :title="'title'"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change"
      :width="400"
      :styles="{top: '200px'}">
      <div>
        modal1
      </div>
    </Modal>
```

```
  methods: {
    // 接收自定义指令传递的数据
    DragAndZoom (data) {
      if (data.el) {
        this.el = data.el
      }
      if (data.initWidth) {
        this.initWidth = data.initWidth
      }
    },
    ok () { },
    cancel () { },
    change () {
      // 当弹窗状态改变时，重置弹窗尺寸（根据 v-DragAndZoom binding 传过来的 el 和 窗口初始宽度来设置）
      let DOM = this.el.querySelector('.ivu-modal-content')
      DOM.style.width = this.initWidth + 'px'
      DOM.style.height = 'auto'
    }
  }
```

## ElementUI Dialog

DialogDrag.js

```
import Vue from 'vue'

/**
v-DialogDrag: 弹窗拖拽缩放（Element Dialog）
 */
Vue.directive('DialogDrag', {
  // eslint-disable-next-line no-unused-vars
  bind (el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom 元素 currentStyle，火狐谷歌 window.getComputedStyle(dom元素, null)
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    // PC 端
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      let styL, styT
      // 在 ie 中第一次获取到的值为组件自带 50%，移动之后赋值为 px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\\%/g, '') / 100)
      } else {
        // 获取到的值带 px 正则匹配替换
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        const l = e.clientX - disX
        const t = e.clientY - disY
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }

    // ios 设备
    dialogHeaderEl.ontouchstart = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.touches[0].clientX - dialogHeaderEl.offsetLeft
      const disY = e.touches[0].clientY - dialogHeaderEl.offsetTop

      let styL, styT

      // 获取到的值带px 正则匹配替换
      styL = +sty.left.replace(/\px/g, '')
      styT = +sty.top.replace(/\px/g, '')

      document.ontouchmove = function (moveE) {
        const l = moveE.touches[0].clientX - disX
        const t = moveE.touches[0].clientY - disY
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.ontouchend = function () {
        document.ontouchend = null
        document.ontouchmove = null
      }
    }

    // 右下角加一个缩放按钮
    const zoomBtn = document.createElement('a')
    zoomBtn.style.cssText = 'width: 20px;height: 20px;display: block;position: absolute;right: 0;bottom: 0;'
    dragDom.appendChild(zoomBtn)

    // PC 端
    zoomBtn.onmousedown = (e) => {
      const mouseDownX = e.clientX
      const mouseDownY = e.clientY
      const clickBoxWeight = dragDom.offsetWidth
      const clickBoxHeight = dragDom.offsetHeight
      document.onmousemove = function (e) {
        const xx = e.clientX
        const yy = e.clientY
        let W = clickBoxWeight + xx - mouseDownX
        let H = clickBoxHeight + yy - mouseDownY
        if (W < 300) {
          W = 300
        }
        if (H < 160) {
          H = 160
        }
        dragDom.style.width = W + 'px'
        dragDom.style.height = H + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
    }

    // ios 设备
    zoomBtn.ontouchstart = (e) => {
      const mouseDownX = e.touches[0].clientX
      const mouseDownY = e.touches[0].clientY
      const clickBoxWeight = dragDom.offsetWidth
      const clickBoxHeight = dragDom.offsetHeight
      document.ontouchmove = function (e) {
        const xx = e.touches[0].clientX
        const yy = e.touches[0].clientY
        let W = clickBoxWeight + xx - mouseDownX
        let H = clickBoxHeight + yy - mouseDownY
        if (W < 300) {
          W = 300
        }
        if (H < 160) {
          H = 160
        }
        dragDom.style.width = W + 'px'
        dragDom.style.height = H + 'px'
        binding.value({
          W,
          H
        })
      }
      document.ontouchend = function () {
        document.ontouchend = null
        document.ontouchmove = null
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
    }
  }
})
```

main.js

```
import '@/utils/DialogDrag.js'
```

使用：
```
    <el-dialog
      v-DialogDrag
      :title="'title'"
      :visible.sync="dialog1"
      width="30%"
      center>
      dialog1
    </el-dialog>
```

## 注意

-   View UI 添加水平垂直居中样式的 Modal 拖动会有问题（vertical-center-modal 和 draggable 不能一起使用）。
