<template>
  <div
    class="iview-modal-container">
    <div>
      <a href="https://www.iviewui.com/components/modal"
        target="_blank">https://www.iviewui.com/components/modal</a>
    </div>
    <button
      @click="modal1 = true">modal1</button>
    <button
      @click="modal2 = true">modal2</button>
    <button
      @click="modal3 = true">modal3</button>
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
    <Modal
      v-model="modal2"
      sticky
      reset-drag-position
      footer-hide
      scrollable
      class-name="vertical-center-modal"
      :title="'title'"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change"
      :width="500">
      <div>
        modal2
      </div>
    </Modal>
    <Modal
      v-model="modal3"
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
      :width="600"
      :styles="{top: '240px'}">
      <div>
        modal3
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'iviewModal',

  data () {
    return {
      modal1: false,
      modal2: false,
      modal3: false,
    }
  },

  mounted () {

  },

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
}
</script>

<style lang="scss">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>