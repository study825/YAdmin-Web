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
      <el-table-column label="公司简称" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.simple_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司全称" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="公司介绍"
        width="80px"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="logo" width="200px" align="center">
        <template slot-scope="{ row }">
          <span><pan-thumb :image="row.logo" /></span>
        </template>
      </el-table-column>
      <el-table-column label="官网地址" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.home_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成立时间" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.build_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="搜索次数" width="50px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.click_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行业领域" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.industry_tags }}</span>
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
        <el-form-item label="公司简称">
          <el-input v-model="temp.simple_name" />
        </el-form-item>

        <el-form-item label="公司全称">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="行业领域">
          <el-drag-select
            v-model="temp.industry_tags"
            style="width: 500px"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionsIndustry"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-drag-select>
        </el-form-item>
        <el-form-item label="创立时间">
          <el-date-picker
            v-model="temp.build_date"
            type="date"
            placeholder="Please pick a date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="注册资本">
          <el-input v-model="temp.regiter_money" placeholder="万" />
        </el-form-item>
        <el-form-item label="公司介绍">
          <el-input
            v-model="temp.content"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>

        <el-form-item label="公司logo">
          <pan-thumb :image="image" />
          <el-button
            type="primary"
            icon="el-icon-upload"
            style="position: absolute; bottom: 15px; margin-left: 40px"
            @click="imagecropperShow = true"
          >
            上传logo图片
          </el-button>

          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            :url="imageUploadUrl"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </el-form-item>

        <el-form-item label="官网地址">
          <el-input
            v-model="temp.home_url"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>

        <el-form-item label="公司法人">
          <el-input v-model="temp.law_people" />
        </el-form-item>

        <el-form-item label="融资阶段">
          <el-select
            v-model="temp.financing_level"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in financingLevelOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="工作地点" prop="location">
          <el-input v-model="temp.format_address" :disabled="true" />
          <el-input v-model="temp.address" :disabled="true" />
          <div class="map-container">
            <amap
              cache-key="coord-picker-map"
              mmap-style="amap://styles/whitesmoke"
              async
              :center.sync="center"
              :zoom.sync="zoom"
              is-hotspot
              @click="onMapClick"
            >
              <amap-satellite-layer :visible="satellite" />

              <amap-marker
                v-if="position"
                :position.sync="position"
                draggable
              />

              <a-card
                :body-style="{
                  'max-height': '450px',
                  'padding-top': 0,
                }"
                class="result-panel"
              >
                <template slot="title">
                  <template v-if="mode === 'search'">
                    <a-input-group compact style="display: flex">
                      <a-auto-complete
                        v-model="query"
                        :data-source="tips"
                        placeholder="输入关键词"
                        style="flex: 1"
                        @search="autoComplete"
                      />
                      <a-button
                        :disabled="!query"
                        type="primary"
                        @click="search(true)"
                      >
                        搜索
                      </a-button>
                    </a-input-group>
                  </template>
                  <template v-if="mode === 'result'">
                    <div class="search-bar">
                      <a-button
                        icon="left"
                        style="margin-right: 6px"
                        @click="reset"
                      />
                      <span class="text"
                        >搜索 {{ query }} 共
                        {{ searching ? "..." : maptotal }} 条结果</span
                      >
                    </div>
                  </template>
                </template>

                <a-list
                  v-if="mode === 'result'"
                  :data-source="results"
                  :loading="searching"
                  item-layout="vertical"
                  size="small"
                  class="result-list"
                >
                  <a-pagination
                    v-if="total > 0"
                    slot="header"
                    v-model="pageIndex"
                    :page-size="pageSize"
                    :total="maptotal"
                    size="small"
                  />
                  <a-list-item
                    slot="renderItem"
                    :key="item.id"
                    slot-scope="item"
                  >
                    <a-list-item-meta :description="item.address">
                      <span
                        slot="title"
                        style="cursor: pointer"
                        @click="focus(item)"
                        >{{ item.name }}</span
                      >
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-card>
            </amap>
          </div>
        </el-form-item>

        <el-form-item label="人员规模">
          <el-select
            v-model="temp.office_worker_num"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in peopleNumOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="背景墙">
          <el-upload
            :action="companyImageUploadUrl"
            list-type="picture-card"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="temp.image_list"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false && reset()"> 取消 </el-button>
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
        :file-list="fileListExcel"
        :http-request="uploadFileExcel"
      >
        <el-button size="mini" type="primary" style="margin: 5px" attr="1"
          >导入</el-button
        >
      </el-upload>

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
  companyListPage,
  companyDetail,
  createCompany,
  updateCompany,
  deleteCompany,
  importCompanyData,
  industryAllList,
} from "@/api/important-data";

import { loadAmap, loadPlugins, gen } from "@amap/amap-vue";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import ElDragSelect from "@/components/DragSelect"; // base on element-ui
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  name: "company",
  components: {
    Pagination,
    UploadExcelComponent,
    ElDragSelect,
    PanThumb,
    ImageCropper,
  },
  directives: { waves },
  filters: {},
  data() {
    return {
      mode: "search",
      center: null,
      zoom: 10,
      query: "",
      searching: false,
      tips: [],
      results: [],
      position: null,
      pageIndex: 1,
      pageSize: 2,
      maptotal: 0,
      satellite: false,
      total: 0,
      fileList: [],
      fileListExcel: [],
      dialogImageUrl: "",
      dialogVisible: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      image: "",
      path: "",
      baseUrl: process.env.VUE_APP_BASE_API.replace(
        "/api/admin",
        "/company-example.xlsx"
      ),
      imageUploadUrl: process.env.VUE_APP_BASE_API + "/data/image/upload",
      companyImageUploadUrl:
        process.env.VUE_APP_BASE_API + "/data/banner/upload",
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
      dialogCreate: false,
      dialogImport: false,
      temp: {
        id: undefined,
        simple_name: "",
        name: "",
        office_worker_num: "",
        law_people: "",
        financing_level: "",
        home_url: "",
        content: "",
        regiter_money: "",
        build_date: "",
        logo: "",
        image_list: [],
        location: "",
        industry_tags: [],
        work_province: "",
        work_city: '',
        work_space: "",
        format_address: "",
      },
      visible: false,
      tableData: [],
      tableHeader: [],
      filename: null,
      peopleNumOptions: [
        { label: "0-20人", key: "0-20人" },
        { label: "20-99人", key: "0-20人" },
        { label: "100-499人", key: "100-499人" },
        { label: "500-999人", key: "500-999人" },
        { label: "1000-9999人", key: "1000-9999人" },
        { label: "10000人以上", key: "10000人以上" },
      ],
      financingLevelOptions: [
        { label: "天使轮", key: "天使轮" },
        { label: "A轮", key: "A轮" },
        { label: "B轮", key: "B轮" },
        { label: "C轮", key: "C轮" },
        { label: "D轮及以上", key: "D轮及以上" },
        { label: "上市公司", key: "上市公司" },
        { label: "不需要融资", key: "不需要融资" },
        { label: "未融资", key: "未融资" },
      ],
      optionsIndustry: [],
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      tagType: undefined,
      address: "",
      location: "",
    };
  },
  computed: {
    wrapper() {
      return this.$refs.wrapper;
    },
  },
  watch: {
    pageIndex(value) {
      this.$ready.then(() => {
        this.ps.setPageIndex(value);
        this.search(false);
      });
    },
  },
  created() {
    this.$ready = new Promise(async (resolve) => {
      const AMap = await loadAmap();
      await loadPlugins([
        "AMap.PlaceSearch",
        "AMap.AutoComplete",
        "AMap.Geocoder",
      ]);

      this.ps = new AMap.PlaceSearch({
        pageSize: this.pageSize,
      });
      this.ac = new AMap.AutoComplete();

      resolve();
    });
    this.getList();
    this.getIndustryList();
  },
  mounted() {},
  methods: {
    onMapClick(e) {
      if (e.lnglat) {
        this.position = [e.lnglat.lng, e.lnglat.lat];
      } else {
        this.position = null;
      }
    },
    async search(clear = false) {
      this.mode = "result";
      await this._ready;

      if (clear) {
        this.results = [];
        this.maptotal = 0;
        this.pageIndex = 1;
        this.ps.setPageIndex(1);
      }

      this.searching = true;
      const { query } = this;
      this.ps.search(query, (status, result) => {
        this.searching = false;
        if (query !== this.query) return;

        if (status === "complete" && result.poiList) {
          console.log(result);
          this.results = result.poiList.pois;
          this.maptotal = result.poiList.count;
        } else {
          this.results = [];
          this.maptotal = 0;
        }
      });
    },
    async autoComplete(kw) {
      if (!kw) {
        this.tips = [];
      } else {
        this.ac.search(kw, (status, result) => {
          if (kw !== this.query) return;
          if (status === "complete" && result.tips) {
            this.tips = Array.from(new Set(result.tips.map((tip) => tip.name)));
          } else {
            this.tips = [];
          }
        });
      }
    },
    focus(poi) {
      this.temp.address = poi.name;
      const pos = [poi.location.lng, poi.location.lat];
      this.temp.location = `${poi.location.lng}, ${poi.location.lat}`;
      this.position = [...pos];
      this.center = [...pos];

      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all",
      });

      let self = this;
      geocoder.getAddress(
        [poi.location.lng, poi.location.lat],
        function (status, result) {
          if (status === "complete" && result.info === "OK") {
            if (result && result.regeocode) {
              self.temp.work_province =
                result.regeocode.addressComponent.province;
              self.temp.work_city = result.regeocode.addressComponent.city;
              self.temp.work_space = result.regeocode.addressComponent.district;
              self.temp.format_address =
                result.regeocode.addressComponent.province +
                result.regeocode.addressComponent.city +
                result.regeocode.addressComponent.district;
            }
          }
        }
      );
    },
    reset() {
      this.ps.setPageIndex(1);
      this.results = [];
      this.tips = [];
      this.maptotal = 0;
      this.mode = "search";
      this.query = "";
    },
    handleAvatarSuccess(res, file) {
      this.temp.image_list.push({ name: 1, url: res.data.banner_url });
    },
    handleRemove(file, fileList) {
      for (var i = 0; i < this.temp.image_list.length; i++) {
        if (this.temp.image_list[i].url == file.url) {
          this.temp.image_list.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.image_url;
      this.temp.logo = resData.path;
    },
    close() {
      this.imagecropperShow = false;
    },
    getList() {
      this.listLoading = true;

      companyListPage(this.listQuery).then((response) => {
        this.list = response.data.data;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });

      industryAllList().then((res) => {
        this.optionsIndustry = res.data;
      });
    },
    handleCreateDialog() {
      this.dialogStatus = "create";
      this.dialogCreate = true;
      this.temp.id = undefined;
      this.temp.industry_tags = "";
      this.temp.simple_name = "";
      this.temp.name = "";
      this.temp.office_worker_num = "";
      this.temp.law_people = "";
      this.temp.financing_level = "";
      this.temp.home_url = "";
      this.temp.content = "";
      this.temp.build_date = "";
      this.temp.regiter_money = "";
      this.image = "";
      this.temp.image_list = [];
      this.fileList = [];
      this.temp.address = "";
      this.temp.location = "";
      this.temp.work_province = "";
      this.temp.work_city = "";
      this.temp.work_space = "";
      this.temp.format_address = "";
      reset();
    },
    handleImportDialog() {
      this.dialogImport = true;
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogCreate = true;
      companyDetail(row.id).then((res) => {
        this.temp.id = res.data.id;
        this.temp.simple_name = res.data.simple_name;
        this.temp.name = res.data.name;
        this.temp.office_worker_num = res.data.office_worker_num;
        this.temp.industry_tags = res.data.industry_tags;
        this.temp.content = res.data.content;
        this.temp.home_url = res.data.home_url;
        this.temp.financing_level = res.data.financing_level;
        this.temp.regiter_money = res.data.regiter_money;
        this.temp.law_people = res.data.law_people;
        this.temp.build_date = res.data.build_date;
        this.image = res.data.logo_url;
        this.temp.logo = res.data.logo;
        this.temp.image_list = res.data.image_list;
        this.query = res.data.address;
        this.temp.work_province = res.data.work_province;
        this.temp.work_city = res.data.work_city;
        this.temp.work_space = res.data.work_space;
        this.temp.format_address =
          res.data.work_province + res.data.work_city + res.data.work_space;
      });
    },
    createData() {
      createCompany(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    updateData() {
      updateCompany(this.temp).then((res) => {
        this.dialogCreate = false;
        this.getList();
      });
    },
    handleDelete(row, index) {
      this.delete_ids = {
        ids: row.id,
      };
      deleteCompany(this.delete_ids).then((response) => {
        if (response.code == 200) {
          this.$notify({
            title: "Success",
            message: "已删除",
            type: "success",
            duration: 2000,
          });
          this.list.splice(index, 1);
        } else if (response.code == 500) {
          this.$notify({
            title: "Error",
            message: response.message,
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    uploadFileExcel(item) {
      importCompanyData(item).then((response) => {
        this.fileList = [];
        if (response.code != 200) {
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
    resetTemp() {
      this.dialogStatus = "create";
      this.dialogCreate = true;
      this.temp.id = undefined;
      this.temp.industry_tags = "";
      this.temp.simple_name = "";
      this.temp.name = "";
      this.temp.office_worker_num = "";
      this.temp.law_people = "";
      this.temp.financing_level = "";
      this.temp.home_url = "";
      this.temp.content = "";
      this.temp.build_date = "";
      this.temp.regiter_money = "";
      this.image = "";
      this.temp.image_list = [];
      this.temp.work_province = "";
      this.temp.work_city = '';
      this.temp.work_space = "";
      this.temp.format_address = "";
    },
    getIndustryList() {},
  },
};
</script>
<style>
.ant-select-dropdown {
  z-index: 10000;
}
</style>
<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 600px;
}
.result-panel {
  position: absolute;
  left: 0px;
  top: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;

  .search-bar {
    display: flex;
    align-items: center;
    .text {
      text-overflow: ellipsis;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .result-list.ant-list-loading {
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.info {
  position: absolute;
  right: 10px;
  top: 10px;
  padding-left: 24px;
}
</style>
