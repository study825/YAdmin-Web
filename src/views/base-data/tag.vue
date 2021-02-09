<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        style="float: right; margin-left: 50px"
        type="primary"
        icon="el-icon-coin"
        @click="handleCreateDialog"
        >单个新增</el-button
      >
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="id" align="center" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="360px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type == "job" ? "岗位" : "公司" }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogCreate" :title="textMap[dialogStatus]">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option key="job" label="岗位" value="job"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tagList, createTag, updateTag, tagDetail,deleteTag } from "@/api/base-data";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "tag",
  components: {
    Pagination,
  },
  directives: { waves },
  filters: {},
  data() {
    return {
      oneList: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        type: undefined,
      },
      dialogCreate: false,
      dialogImport: false,
      temp: {
        id: undefined,
        name: "",
        type: "",
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
      tagList(this.listQuery).then((response) => {
        this.list = response.data.data;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleCreateDialog() {
      this.dialogStatus = "create";
      this.dialogCreate = true;
      this.temp.id = undefined;
      this.temp.name = undefined;
      this.temp.type = "";
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogCreate = true;
      tagDetail(row.id).then((res) => {
        this.temp.id = res.data.id;
        this.temp.name = res.data.name;
        this.temp.type = res.data.type;
      });
    },
    createData() {
      createTag(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    updateData() {
      updateTag(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    selectChanged() {
      this.listLoading = true;
      tagList(this.listQuery).then((response) => {
        this.list = response.data.data;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleDelete(row, index) {
      this.delete_ids = {
        ids: row.id,
      };
      deleteTag(this.delete_ids).then((response) => {
        if (response.code == 200) {
          this.$notify({
            title: "Success",
            message: "已删除",
            type: "success",
            duration: 2000,
          });
          this.getList();
        } else {
          this.$notify({
            title: "Error",
            message: response.message,
            type: "error",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>