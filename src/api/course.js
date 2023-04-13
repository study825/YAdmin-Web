import request from '@/utils/request'
export function getCourseInfo() {
  return request({
    url: '/course',
    method: 'get'
  })
}

export function updateCourseInfo(data) {
  return request({
    url: '/course/update',
    method: 'post',
    data
  })
}
