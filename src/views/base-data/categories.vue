<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button
          v-permission="'permission.create'"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="createVisible = true;temp.name = ''"
          >{{ $t("common.create") }}
        </el-button>
      </el-col>
      <el-col :span="22" class="margin-t-5">
        <el-tooltip :content="$t('permission.startSortText')" placement="left">
          <el-switch
            v-model="sortStatus"
            class="fr"
            active-text="开启排序"
            @change="sortHandle"
          />
        </el-tooltip>
      </el-col>
    </el-row>

    <el-tree
      ref="tree"
      v-loading="loading"
      :empty-text="$t('common.emptyText')"
      :data="data"
      :props="defaultProps"
      node-key="id"
      :default-expand-all="expand"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      :draggable="sortStatus"
      @node-drop="handleDrop"
      :allow-drag="allowDrag"
    >
      <span
        slot-scope="{
          node,
          // eslint-disable-next-line vue/no-template-shadow
          data,
        }"
        class="custom-tree-node"
      >
        <span> <i :class="data.icon" /> {{ node.label }} </span>
        <span>
          <el-button
            v-if="data.pid == 0"
            type="text"
            size="mini"
            @click="() => createSub(data)"
          >
            创建子类别
          </el-button>
          <el-button type="text" size="mini" @click="() => update(data)">
            修改
          </el-button>
          <el-popconfirm
            :title="$t('common.confirmDelete')"
            :confirm-button-text="$t('common.confirmButtonText')"
            :cancel-button-text="$t('common.cancelButtonText')"
            @onConfirm="handleDelete(data)"
          >
            <el-button slot="reference" type="text" size="mini">
              删除
            </el-button>
          </el-popconfirm>
        </span>
      </span>
    </el-tree>
    <el-dialog v-el-drag-dialog title="新增" :visible.sync="createVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="分类名称">
          <el-input type="input" autosize v-model="temp.name"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="createData()"> 确认 </el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="修改" :visible.sync="updateVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="分类名称">
          <el-input type="input" autosize v-model="temp.name"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="updateData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  categoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  detailCategory,
  sortCategory,
} from "@/api/base-data";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "category",
  components: {
    Pagination,
  },
  directives: { waves },
  filters: {},
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      filterText: "",
      loading: true,
      createVisible: false,
      pid: 0,
      updateId: 0,
      updateVisible: false,
      sortStatus: false,
      expand: true,
      oneList: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      temp: {
        id: undefined,
        name: "",
      },
      visible: false,
      tableData: [],
      tableHeader: [],
      filename: null,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      tagType: undefined,
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true;
      categoryList(this.listQuery).then((response) => {
        this.loading = false;
        this.data = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    createData() {
      createCategory(this.temp).then((res) => {
        this.createVisible = false;
        this.getList();
      });
    },
    updateData() {
      updateCategory(this.temp).then((res) => {
        this.updateVisible = false;
        this.getList();
      });
    },
    handleDelete(row) {
      this.delete_ids = {
        ids: row.id,
      };
      deleteCategory(this.delete_ids).then((res) => {
        this.$notify({
          title: "Success",
          message: "已删除",
          type: "success",
          duration: 2000,
        });
        this.getList();
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },

    // 拖拽成功完成时触发的事件
    handleDrop(draggingNode, dropNode, dropType, ev) {
      sortCategory({
        dragging: draggingNode.key,
        drop: dropNode.key,
        type: dropType,
      }).then((response) => {
        if (response.code == 200) {
          this.$message({
            message: '成功',
            type: "success",
          });
        } else {
          this.$message({
            message: response.message,
            type: "error",
          });
          this.getList();
        }
      });
    },
    createSub(data) {
      this.temp.id = undefined;
      this.temp.pid = data.id;
      this.temp.name = "";
      this.createVisible = true;
    },
    update(row) {
      detailCategory(row.id).then((res) => {
        this.temp.id = res.data.id;
        this.temp.name = res.data.name;
        this.updateVisible = true;
      });
    },
    sortHandle(value) {
      this.sortStatus = value;
    },
    allowDrop(draggingNode, dropNode, type) {
      // console.log(type)
      // if (type == "before") {
      //   return true;
      // }
      // return false;
      return true;
    },
    allowDrag(draggingNode) {
      return true;
      // console.log(draggingNode)
      // return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
  },
};
</script>


<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
