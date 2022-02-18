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