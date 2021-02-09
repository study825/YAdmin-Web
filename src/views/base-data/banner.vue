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
      <el-table-column label="图片" width="360px" align="center">
        <template slot-scope="{ row }">
          <img :src="row.image_url" alt="" width="300px" height="160px" />
        </template>
      </el-table-column>
      <el-table-column label="链接地址" width="200px" align="center">
        <template slot-scope="{ row }">
          <el-link type="primary">{{ row.connect_url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="{ row, $index }">
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
    <el-dialog :visible.sync="dialogCreate" :title="textMap[dialogStatus]">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="轮播图片">
          <el-upload
            class="avatar-uploader"
            :action="imageUploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="官网地址">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入网址"
            v-model="temp.connect_url"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入序号。数字越小，优先级越高。"
            v-model="temp.sort"
          >
          </el-input>
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
import {
  bannerList,
  deleteBanner,
  createBanner,
  updateBanner,
  bannerDetail,
} from "@/api/base-data";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "banner",
  components: {
    Pagination,
  },
  directives: { waves },
  filters: {},
  data() {
    return {
      imageUrl: "",
      imageUploadUrl: process.env.VUE_APP_BASE_API + "/data/banner/upload",
      imageHeight: 0,
      imageWidth: 0,
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
      dialogCreate: false,
      dialogImport: false,
      temp: {
        id: undefined,
        image_url: "",
        connect_url: "",
        sort: undefined,
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
      bannerList(this.listQuery).then((response) => {
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
      this.temp.image_url = "";
      this.temp.connect_url = "";
      this.temp.sort = undefined;
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogCreate = true;
      bannerDetail(row.id).then((res) => {
        this.temp.id = res.data.id;
        this.imageUrl = res.data.path;
        this.temp.image_url = res.data.image_url;
        this.temp.connect_url = res.data.connect_url;
        this.temp.sort = res.data.sort;
      });
    },
    createData() {
      createBanner(this.temp).then((res) => {
        this.data.imageWidth = 0;
        this.data.imageHeight = 0;
        this.dialogCreate = false;
        this.getList();
      });
    },
    updateData() {
      updateBanner(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    handleDelete(row, index) {
      this.delete_ids = {
        ids: row.id,
      };
      deleteBanner(this.delete_ids).then((res) => {
        this.$notify({
          title: "Success",
          message: "已删除",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      });
    },
    handleAvatarSuccess(res, file) {
      this.temp.image_url = res.data.path;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      var self = this;
      if (isJPG && isLt2M) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var txt = event.target.result;
          var img = document.createElement("img");
          img.src = txt;
          img.onload = function () {
            self.data.imageWidth = img.width;
            self.data.imageHeight = img.height;
          };
        };
        reader.readAsDataURL(file);
      }

      return isJPG && isLt2M;
    },
  },
};
</script>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>