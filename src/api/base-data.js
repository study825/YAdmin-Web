import request from '@/utils/request'

export function bannerList(query) {
    return request({
        url: '/data/banner',
        method: 'get',
        params: query
    })
}

export function createBanner(data) {
    return request({
        url: '/data/banner',
        method: 'post',
        data
    })
}

export function updateBanner(data) {
    return request({
        url: '/data/banner',
        method: 'put',
        data
    })
}

export function deleteBanner(data) {
    return request({
        url: '/data/banner/delete',
        method: 'post',
        data
    })
}

export function bannerDetail(bannerId) {
    return request({
        url: '/data/banner/' + bannerId,
        method: 'get'
    })
}

export function categoryList(query) {
    return request({
        url: '/data/category',
        method: 'get',
        params: query
    })
}

export function createCategory(data) {
    return request({
        url: '/data/category',
        method: 'post',
        data
    })
}

export function updateCategory(data) {
    return request({
        url: '/data/category',
        method: 'put',
        data
    })
}

export function deleteCategory(data) {
    return request({
        url: '/data/category/delete',
        method: 'post',
        data
    })
}

export function detailCategory(id) {
    return request({
        url: '/data/category/' + id,
        method: 'get'
    })
}

export function sortCategory(data) {
    return request({
        url: '/data/category/sort',
        method: 'post',
        data
    })
}



export function tagList(query) {
    return request({
        url: '/data/tag',
        method: 'get',
        params: query
    })
}

export function createTag(data) {
    return request({
        url: '/data/tag',
        method: 'post',
        data
    })
}

export function deleteTag(data) {
    return request({
        url: '/data/tag/delete',
        method: 'post',
        data
    })
}


export function updateTag(data) {
    return request({
        url: '/data/tag',
        method: 'put',
        data
    })
}

export function tagDetail(id) {
    return request({
        url: '/data/tag/' + id,
        method: 'get'
    })
}

export function industryList(query) {
    return request({
        url: '/data/industry',
        method: 'get',
        params: query
    })
}

export function industryDetail(id) {
    return request({
        url: '/data/industry/'+id,
        method: 'get'
    })
}

export function createIndustry(data) {
    return request({
        url: '/data/industry',
        method: 'post',
        data
    })
}

export function deleteIndustry(data) {
    return request({
        url: '/data/industry/delete',
        method: 'post',
        data
    })
}

export function updateIndustry(data) {
    return request({
        url: '/data/industry',
        method: 'put',
        data
    })
}

