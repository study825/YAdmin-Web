import request from '@/utils/request'

export function jobList(query) {
  return request({
    url: '/data/job',
    method: 'get',
    params: query
  })
}

export function delectJob(data) {
  return request({
    url: '/data/job/delete',
    method: 'post',
    data
  })
}

export function commitJobData(data) {
  return request({
    url: '/data/job/import',
    method: 'post',
    data
  })
}

export function jobDetail(jobId) {
  return request({
    url: '/data/job/' + jobId,
    method: 'get'
  })
}

export function createJob(data) {
  return request({
    url: '/data/job',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: '/data/job',
    method: 'put',
    data
  })
}

export function tagList(query) {
  return request({
    url: '/data/tag/all',
    method: 'get',
    params: query
  })
}

export function companyList(query) {
  return request({
    url: '/data/company/all',
    method: 'get',
    params: query
  })
}

export function companyListPage(query) {
  return request({
    url: '/data/company',
    method: 'get',
    params: query
  })
}

export function companyDetail(companyId) {
  return request({
    url: '/data/company/' + companyId,
    method: 'get'
  })
}

export function createCompany(data) {
  return request({
    url: '/data/company',
    method: 'post',
    data
  })
}

export function updateCompany(data) {
  return request({
    url: '/data/company',
    method: 'put',
    data
  })
}

export function deleteCompany(data) {
  return request({
    url: '/data/company/delete',
    method: 'post',
    data
  })
}

export function importJobData(data) {
  const fileObj = data.file

  // FormData 对象
  const form = new FormData()
  // 文件对象
  form.append('file', fileObj)

  return request({
    method: 'post',
    url: '/data/job/import',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function importCompanyData(data) {
  const fileObj = data.file

  // FormData 对象
  const form = new FormData()
  // 文件对象
  form.append('file', fileObj)

  return request({
    method: 'post',
    url: '/data/company/import',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getCourseList() {
  return request({
    url: '/data/course',
    method: 'get'
  })
}

export function categoryList() {
  return request({
    url: '/data/category/all',
    method: 'get'
  })
}

export function industryAllList() {
  return request({
      url: '/data/industry/all',
      method: 'get'
  })
}