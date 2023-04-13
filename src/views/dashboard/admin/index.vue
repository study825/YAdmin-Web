<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" :online-num="count"/>
  </div>
</template>

<script>
// import PanelGroup from './components/PanelGroup'

export default {
  name: 'DashboardAdmin',
  components: {
    // PanelGroup
  },
  data() {
    return {
     count: 0
    }
  },
  mounted() {
    // WebSocket
    if ('WebSocket' in window) {
      const uri = process.env.VUE_APP_WEBSOCKET_API

      // this.websocket = new WebSocket(`${uri}`)
      // this.initWebSocket()
    } else {
      // this.$message.error('当前浏览器不支持websocket')
    }
  },
  beforeDestroy() {
    this.onbeforeunload();
  },
  methods: {
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage;

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage;

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage;

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage;

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload;
    },
    setErrorMessage() {
      this.$message.error("WebSocket连接发生错误");
    },
    setOnopenMessage() {
      this.$message({
        message: "连接成功",
        type: "success",
      });
    },
    setOnmessageMessage(event) {
      this.count = event.data
    },
    setOncloseMessage() {
      this.$message("连接关闭");
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    closeWebSocket() {
      this.websocket.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
