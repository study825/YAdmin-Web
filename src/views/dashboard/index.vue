<template>
  <div style="text-align: center; font-size: 30px">管理后台</div>
</template>

<script>
import { connectionSocket } from "../../utils/websocket";

export default {
  name: "Dashboard",
  created() {
    connectionSocket()
  },
};
</script>
