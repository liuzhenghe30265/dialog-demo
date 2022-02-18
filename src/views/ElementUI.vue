<template>
  <div
    class="home">
    <button
      @click="dialog1 = true">dialog1</button>
    <button
      @click="dialog2 = true">dialog2</button>
    <el-dialog
      v-DialogDrag
      :title="'title'"
      :visible.sync="dialog1"
      width="30%"
      center>
      dialog1
    </el-dialog>
    <el-dialog
      :title="'title'"
      :visible.sync="dialog2"
      width="50%">
      dialog2
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      dialog2: false,
      dialog1: false
    }
  }
}
</script>
