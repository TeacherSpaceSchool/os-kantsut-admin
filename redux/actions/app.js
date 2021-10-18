import { SHOW_DRAWER, SHOW_APPBAR, SET_SEARCH, SET_FILTER, SET_SORT, SET_IS_MOBILE_APP, SHOW_LOAD, SET_COUNT_BASKET, SET_DATE, SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SET_SHOW_LIGHTBOX } from '../constants/app'

export function showDrawer(data) {
    return {
        type: SHOW_DRAWER,
        payload: data
    }
}

export function setFilter(data) {
    return {
        type: SET_FILTER,
        payload: data
    }
}

export function setShowAppBar(data) {
    return {
        type: SHOW_APPBAR,
        payload: data
    }
}

export function setShowLightbox(data) {
    return {
        type: SET_SHOW_LIGHTBOX,
        payload: data
    }
}

export function setImagesLightbox(data) {
    return {
        type: SET_IMAGES_LIGHTBOX,
        payload: data
    }
}

export function setIndexLightbox(data) {
    return {
        type: SET_INDEX_LIGHTBOX,
        payload: data
    }
}

export function setDate(data) {
    return {
        type: SET_DATE,
        payload: data
    }
}

export function setCountBasket(data) {
    return {
        type: SET_COUNT_BASKET,
        payload: data
    }
}

export function setSort(data) {
    return {
        type: SET_SORT,
        payload: data
    }
}

export function setSearch(data) {
    return {
        type: SET_SEARCH,
        payload: data
    }
}

export function setIsMobileApp(data) {
    return {
        type: SET_IS_MOBILE_APP,
        payload: data
    }
}

export function showLoad(show) {
    return {
        type: SHOW_LOAD,
        payload: show
    }
}