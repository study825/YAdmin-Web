import request from '@/utils/request'
export function list(data) {
  return request({
    url: '/house/list',
    method: 'post',
    data
  })
}

export function updateHouseData(data) {
  return request({
    url: '/house/update',
    method: 'post',
    data
  })
}


export function getAreaList(data) {
  return request({
    url: '/area',
    method: 'get'
  })
}

export function addHouseData(data) {
  return request({
    url: '/house/add',
    method: 'post',
    data
  })
}

export function deleteHouseData(data) {
  return request({
    url: '/house/delete',
    method: 'post',
    data
  })
}