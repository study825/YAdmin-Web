import request from '@/utils/request'
export function getStudentList(data) {
  return request({
    url: '/student/list',
    method: 'post',
    data
  })
}


export function updateStudent(data) {
  return request({
    url: '/student/update',
    method: 'post',
    data
  })
}


export function deleteStudent(data) {
  return request({
    url: '/student/delete',
    method: 'post',
    data
  })
}

export function getSchoolList() {
  return request({
    url: '/school/list',
    method: 'get'
  })
}
