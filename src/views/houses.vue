<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="formInline" :inline="true" :model="formInline">
          <el-form-item>
            <el-button v-permission="'admin.create'" type="primary" icon="el-icon-circle-plus-outline"
              @click="createDialog()">
              {{ $t('common.create') }}
            </el-button>
          </el-form-item>

          <!-- <el-form-item :label="$t('admin.name')" prop="name">
            <el-input v-model="formInline.name" :placeholder="$t('admin.name')" />
          </el-form-item> -->
          <!-- <el-form-item :label="$t('common.createTime')" prop="time">
            <el-date-picker v-model="formInline.time" type="datetimerange" :picker-options="pickerOptions"
              range-separator="~" :start-placeholder="$t('common.startTime')" :end-placeholder="$t('common.endTime')"
              align="right" />
          </el-form-item> -->
          <!-- <el-col>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ $t('common.search') }}</el-button>
              <el-button @click="resetForm('formInline')">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col> -->
        </el-form>
      </el-col>
      <el-col v-loading="loading" :span="24">
        <el-col :span="24">
          <el-table highlight-current-row :data="tableData" style="width: 100%"
            :default-sort="{ prop: sort, order: order }" @sort-change="tableSortChange">
            <el-table-column prop="house_id" label="ID" />
            <el-table-column prop="house_name" label="建筑名称" />
            <el-table-column prop="big_city_name" label="市" />
            <el-table-column prop="city_name" label="县" />
            <el-table-column prop="address_name" label="地址" />
            <el-table-column prop="created_at" :label="$t('common.createdAt')" :formatter="rTime" />
            <el-table-column prop="updated_at" :label="$t('common.updatedAt')" :formatter="rTime" />
            <el-table-column :label="$t('common.handle')" width="600px">
              <template slot-scope="scope">
                <el-button v-permission="'admin.update'" icon="el-icon-edit-outline" type="primary"
                  @click="handleEdit(scope.row)">
                  {{ $t('common.update') }}
                </el-button>
                <el-popconfirm v-permission="'admin.delete'" :title="$t('common.confirmDelete')"
                  :confirm-button-text="$t('common.confirmButtonText')"
                  :cancel-button-text="$t('common.cancelButtonText')" @onConfirm="handleDelete(scope.row.house_id)">
                  <el-button slot="reference" icon="el-icon-delete" type="danger">
                    {{ $t('common.delete') }}
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24" class="margin-t-10">
          <el-pagination :page-sizes="[10, 25, 50]" :page-size="10" :current-page="offset"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </el-col>
      </el-col>
    </el-row>

    <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="updateForm" :model="updateForm" label-width="auto" @submit.native.prevent>
        <el-form-item label="建筑名称" prop="house_name">
          <el-input v-model="updateForm.house_name" />
        </el-form-item>

        <el-form-item label="地区">
          <el-cascader v-model="updateForm.area" :options="options" @change="handleChange">
          </el-cascader>
        </el-form-item>

        <el-form-item label="地址" prop="address_name">
          <el-input v-model="updateForm.address_name" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onUpdate()">{{ $t('common.submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { rTime } from '@/utils'
import { list, getAreaList, updateHouseData, addHouseData, deleteHouseData } from '@/api/house'

export default {
  name: 'Houses',
  components: {},
  data() {
    return {
      options: undefined,
      updateForm: {
        // name: '',
        // email: '',
        // password: '',
        // status: 0
      },
      formInline: {
        name: '',
        time: ''
      },
      dialogTitle: '',
      total: 0,
      loading: true,
      order: 'descending',
      sort: 'created_at',
      offset: 0,
      limit: 10,
      tableData: [],
      pickerOptions: {
        shortcuts: [{
          text: this.$t('common.week'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('common.oneMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('common.threeMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      error: {},
      dialogVisible: false,
      createVisible: false,
      updateVisible: false,
      updateId: 0,
      syncRolesId: 0,
      syncRolesVisible: false,
      syncRolesTitle: '',
      syncPermissionsId: 0,
      syncPermissionsVisible: false,
      syncPermissionsTitle: '',
      seeMoreRoles: [],
      seeMoreRolesVisible: false
    }
  },
  mounted() {
    this.getAdmins()
    this.getAreaList()
  },
  methods: {
    createDialog() {
      this.dialogTitle = "创建"
      this.dialogVisible = true
      this.updateForm = {}
    },
    onUpdate() {
      if (!this.updateForm.house_name) {
        this.$message({
          message: '请输入建筑名称',
          type: 'error'
        })
        return
      }

      if (!this.updateForm.area) {
        this.$message({
          message: '请选择地区',
          type: 'error'
        })
        return
      }
    
      if (!this.updateForm.address_name) {
        this.$message({
          message: '请输入地址',
          type: 'error'
        })
        return
      }

      if (this.dialogTitle == '创建') {
        addHouseData(this.updateForm).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getAdmins()
        })
      } else {
        updateHouseData(this.updateForm).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getAdmins()
        })
      }
    },
    handleChange(value) {
      console.log(value);
    },
    onSubmit() {
      this.offset = 0
      this.getAdmins()
    },
    tableSortChange(column) {
      this.order = column.order ? column.order : 'descending'
      this.sort = column.prop
      this.offset = 0
      this.getAdmins()
    },
    getAdmins() {
      this.loading = true
      const requestData = {
        offset: this.offset,
        limit: this.limit,
        order: this.order,
        sort: this.sort,
        name: this.formInline.name,
        guard_name: 'admin'
      }
      if (rTime(this.formInline.time[0]) !== '') {
        requestData['start_at'] = rTime(this.formInline.time[0])
      }
      if (rTime(this.formInline.time[1]) !== '') {
        requestData['end_at'] = rTime(this.formInline.time[1])
      }
      list(requestData).then(response => {
        const { data } = response
        this.loading = false
        this.tableData = data.houses
        this.total = data.total
      })
    },
    getAreaList() {
      getAreaList().then(res => {
        this.options = res.data
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getAdmins()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.getAdmins()
    },
    rTime(row, column) {
      return rTime(row[column.property])
    },
    handleDelete(id) {
      deleteHouseData({
        house_id: id
      }).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.getAdmins()
      })
    },
    handleEdit(row) {
      this.dialogTitle = '修改'
      this.dialogVisible = true
      this.updateForm = row
      this.updateForm.area = [row.province_code, row.big_city_code, row.city_code]
    },
    success() {
      this.syncRolesId = 0
      this.syncRolesVisible = false
      this.getAdmins()
    },

    syncPermissions(row) {
      const { id, name } = row
      this.syncPermissionsId = id
      this.syncPermissionsVisible = true
      this.syncPermissionsTitle = name
    },

    syncPermissionSuccess() {
      this.syncPermissionsId = 0
      this.syncPermissionsVisible = false
      this.getAdmins()
    },

    seeMoreRole(roles) {
      this.seeMoreRoles = roles
      this.seeMoreRolesVisible = true
    },

    seeMoreRolesClose() {
      this.seeMoreRoles = []
      this.seeMoreRolesVisible = false
    }

  }
}
</script>

<style scoped>
.el-tags {
  margin-left: 5px;
  margin-top: 5px;
}

.see-more-text {
  font-size: 12px;
}

.see-more-tag .el-tag {
  margin-left: 5px;
  margin-top: 5px;
}
</style>
