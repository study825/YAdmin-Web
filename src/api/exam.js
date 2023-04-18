import request from '@/utils/request'
export function getExamList(data) {
  return request({
    url: '/exam/list',
    method: 'post',
    data
  })
}
