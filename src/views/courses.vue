<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="课程名称" prop="course_name">
        <el-input v-model="formData.course_name" placeholder="请输入课程名称" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      
      <el-form-item label="教学大纲" prop="course_point">
        <el-input v-model="formData.course_point" type="textarea" placeholder="请输入教学大纲"
          :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>

      <el-form-item label="课程介绍" prop="course_intro">
        <el-input v-model="formData.course_intro" type="textarea" placeholder="请输入课程介绍"
          :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
 
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCourseInfo, updateCourseInfo } from '@/api/course'

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        course_name: '',
        course_point: '',
        course_intro: ''
      },
      rules: {
        
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    getCourseInfo().then(res => {
      this.formData = res.data;
    });
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
        updateCourseInfo(this.formData).then(res => {
          if(res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style>
</style>
