<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="岗位名称"
        style="width: 200px"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >{{ $t("table.search") }}</el-button
      >

      <el-button
        v-waves
        class="filter-item"
        style="float: right; margin-left: 50px"
        type="primary"
        icon="el-icon-coin"
        @click="handleCreateDialog"
        >单个新增</el-button
      >

      <el-button
        v-waves
        class="filter-item"
        style="float: right"
        type="primary"
        icon="el-icon-coin"
        @click="handleImportDialog"
        >批量导入</el-button
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

      <el-table-column label="职位名称" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学历要求" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.school_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="岗位性质" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.work_nature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作经验" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.work_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="薪资范围" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.money_start }} - {{ row.money_end }}k</span>
        </template>
      </el-table-column>

      <el-table-column label="搜索次数" width="50px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.click_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐职位" width="80px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.is_recommend == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>

      <el-table-column label="公司名称" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.company != null ? row.company.simple_name : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位标签" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.tags }}</span>
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
        style="width: 100%"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="学历要求" prop="school_level">
          <el-select
            v-model="temp.school_level"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in schoolLevelOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="课程类别" prop="course">
          <treeselect
            v-model="temp.course_id"
            :multiple="false"
            :options="options"
          />
        </el-form-item>

        <el-form-item label="工作地点" prop="address">
          <el-cascader
            size="large"
            v-model="temp.selected_options"
            :options="areaOptions"
            @change="handleChange"
            scoped
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="岗位性质" prop="school">
          <el-select
            v-model="temp.work_nature"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in workNatureOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="工作经验" prop="school">
          <el-select
            v-model="temp.work_time"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in workTimeOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="薪资范围" prop="title">
          <el-input
            v-model="temp.money_start"
            placeholder="请输入金额数字"
          >
            <template slot="append">K(千)</template>
          </el-input>
          至
          <el-input
            v-model="temp.money_end"
            placeholder="请输入金额数字"
          >
            <template slot="append">K(千)</template>
          </el-input>
        </el-form-item>

        <el-form-item label="是否推荐" prop="school">
          <el-select
            v-model="temp.is_recommend"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in recommendOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="职位类别" prop="category">
          <treeselect
            v-model="temp.category_id"
            :multiple="false"
            :options="categoryOptions"
          />
        </el-form-item>

        <el-form-item label="所属公司" prop="company">
          <el-select
            v-model="temp.company_id"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in companiesOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="职位标签" prop="school">
          <el-drag-select
            v-model="temp.tags"
            style="width: 500px"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in jobtags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-drag-select>
        </el-form-item>

        <el-form-item label="岗位职责">
          <el-input
            v-model="temp.job_duty"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="岗位亮点">
          <el-input
            v-model="temp.job_light"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="岗位要求">
          <el-input
            v-model="temp.job_requirement"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
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

    <el-dialog :visible.sync="dialogImport" title="批量导入">
      <el-upload
        class="upload-demo"
        action
        :on-preview="handlePreviewExcel"
        :on-remove="handleRemoveExcel"
        :before-remove="beforeRemoveExcel"
        multiple
        :limit="1"
        :on-exceed="handleExceedExcel"
        :file-list="fileList"
        :http-request="uploadFileExcel"
      >
        <el-button
          size="mini"
          type="primary"
          style="margin: 5px"
          attr="1"
          @click="handleClick(row)"
          >导入</el-button
        >
      </el-upload>

      <p>{{ filename }}</p>
      <a :href="baseUrl"
        ><button
          class="filter-item"
          style="margin-top: 50px; margin-left: 16px"
        >
          下载模板
        </button></a
      >
    </el-dialog>
  </div>
</template>

<script>
import {
  jobList,
  delectJob,
  tagList,
  jobDetail,
  companyList,
  createJob,
  updateJob,
  importJobData,
  getCourseList,
  categoryList,
} from "@/api/important-data";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import ElDragSelect from "@/components/DragSelect"; // base on element-ui
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";

export default {
  name: "Job",
  components: { Pagination, ElDragSelect, Treeselect },
  directives: { waves },
  filters: {},
  data() {
    return {
      optionsIndustry: [],
      categoryOptions: [],
      areaOptions: regionData,
      total: 0,
      fileList: [],
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      delete_ids: undefined,
      temp: {
        id: undefined,
        name: "",
        work_province: "",
        work_city: "",
        work_space: "",
        work_nature: "",
        work_time: "",
        school_level: "",
        job_duty: "",
        job_light: "",
        job_requirement: "",
        money_start: "",
        money_end: "",
        tags: "",
        company_id: undefined,
        is_recommend: "",
        course_id: "",
        selected_options: [],
        category_id: undefined,
      },
      options: [],
      dialogCreate: false,
      dialogImport: false,
      visible: false,
      tableData: [],
      tableHeader: [],
      baseUrl: process.env.VUE_APP_BASE_API.replace(
        "/api/admin",
        "/job-example.xlsx"
      ),
      filename: null,
      schoolLevelOptions: [
        { label: "初中及以下", key: "1", value: "初中及以下" },
        { label: "中专/中技", key: "2", value: "中专/中技" },
        { label: "高中", key: "3", value: "高中" },
        { label: "大专", key: "4", value: "大专" },
        { label: "本科", key: "5", value: "本科" },
        { label: "硕士", key: "6", value: "硕士" },
        { label: "博士", key: "7", value: "博士" },
      ],
      workNatureOptions: [
        { label: "不限", key: "不限" },
        { label: "全职", key: "全职" },
        { label: "兼职", key: "兼职" },
      ],
      workTimeOptions: [
        { label: "在校生", key: "在校生" },
        { label: "应届生", key: "应届生" },
        { label: "1年以内", key: "1年以内" },
        { label: "1-3年", key: "1-3年" },
        { label: "3-5年", key: "3-5年" },
        { label: "5-10年", key: "5-10年" },
        { label: "10年以上", key: "10年以上" },
      ],
      recommendOptions: [
        { label: "是", key: 1 },
        { label: "否", key: 0 },
      ],
      companiesOptions: [],
      jobtags: [],
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增",
      },
    };
  },
  created() {
    this.getList();
    this.courseList();
    this.getCategoryList();
  },
  mounted() {},
  methods: {
    handleChange(value) {
      if (value.length == 2) {
        this.temp.work_province = CodeToText[value[0]];
        this.temp.work_space = CodeToText[value[1]];
      } else if (value.length == 3) {
        this.temp.work_province = CodeToText[value[0]];
        this.temp.work_city = CodeToText[value[1]];
        this.temp.work_space = CodeToText[value[2]];
      }
    },
    getList() {
      this.listLoading = true;
      companyList().then((response) => {
        this.companiesOptions = response.data;
      });

      this.tagType = {
        type: "job",
      };
      tagList(this.tagType).then((res) => {
        this.jobtags = res.data;
      });
      jobList(this.listQuery).then((response) => {
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
      delectJob(this.delete_ids).then((response) => {
        this.$notify({
          title: "Success",
          message: "已删除",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      });
    },
    handleCreateDialog() {
      this.dialogStatus = "create";
      this.dialogCreate = true;
      this.temp.id = "";
      this.temp.name = "";
      this.temp.work_nature = "";
      this.temp.work_time = "";
      this.temp.school_level = "";
      this.temp.job_duty = "";
      this.temp.job_light = "";
      this.temp.job_requirement = "";
      this.temp.tags = "";
      this.temp.company_id = "";
      this.temp.money_start = "";
      this.temp.money_end = "";
      this.temp.is_recommend = "";
      this.temp.course_id = "";
      this.temp.work_province = "";
      this.temp.work_city = "";
      this.temp.work_space = "";
      this.temp.selected_options = [];
      this.temp.category_id = "";
    },
    handleImportDialog() {
      this.dialogImport = true;
      this.fileList = [];
    },
    beforeUpload(file) {
      this.filename = file.name;
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "文件大小请小于1MB",
        type: "warning",
      });
      return false;
    },
    handleImportSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
    },
    handleFilter() {
      this.getList();
    },
    handleUpdate(row) {
      jobDetail(row.id).then((res) => {
        this.dialogStatus = "update";
        this.dialogCreate = true;
        this.temp.id = res.data.id;
        this.temp.name = res.data.name;
        this.temp.work_nature = res.data.work_nature;
        this.temp.work_time = res.data.work_time;
        this.temp.school_level = res.data.school_level;
        this.temp.job_duty = res.data.job_duty;
        this.temp.job_light = res.data.job_light;
        this.temp.job_requirement = res.data.job_requirement;
        this.temp.tags = res.data.tags;
        this.temp.company_id = res.data.company_id;
        this.temp.money_start = res.data.money_start;
        this.temp.money_end = res.data.money_end;
        this.temp.is_recommend = res.data.is_recommend;
        this.temp.course_id = res.data.course_id;
        this.temp.work_province = res.data.work_province;
        this.temp.work_city = res.data.work_city;
        this.temp.work_space = res.data.work_space;
        if (res.data.selected_options) {
          this.temp.selected_options = res.data.selected_options;
        } else {
          this.temp.selected_options = new Array(
            TextToCode[res.data.work_province].code,
            TextToCode[res.data.work_province][res.data.work_city].code,
            TextToCode[res.data.work_province][res.data.work_city][
              res.data.work_space
            ].code
          );
        }
        this.temp.category_id = res.data.category_id;
      });
    },
    commitData() {},
    createData() {
      createJob(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    updateData() {
      updateJob(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    uploadFileExcel(item) {
      importJobData(item).then((response) => {
        this.fileList = [];
        if (response.code !== 200) {
          this.$notify({
            title: "失败",
            message: response.message,
            type: "error",
            duration: 2000,
          });
        } else {
          this.$notify({
            title: "成功",
            type: "success",
            duration: 2000,
          });
        }

        this.dialogImport = false;
        this.getList();
      });
    },
    handlePreviewExcel(file) {},
    beforeRemoveExcel(files, fileList) {},
    handleRemoveExcel(file, fileList) {},
    handleExceedExcel(files, fileList) {},
    courseList() {
      getCourseList().then((response) => {
        this.options = response.data;
      });
    },
    getCategoryList() {
      categoryList().then((res) => {
        console.log(res.data);
        this.categoryOptions = res.data;
      });
    },
    getIndustryList() {
      industryAllList().then((res) => {
        this.optionsIndustry = res.data;
      });
    },
  },
};
</script>
