import {
    SHOW_DRAWER, SET_FILTER, SET_SORT, SET_SEARCH, SET_IS_MOBILE_APP, SHOW_LOAD, SET_COUNT_BASKET, SET_DATE,
    SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SET_SHOW_LIGHTBOX, SHOW_APPBAR
} from '../constants/app'

const initialState = {
    showAppBar: true,
    drawer: false,
    search: '',
    filter: '',
    sort: '-createdAt',
    isMobileApp: undefined,
    load: false,
    countBasket: 0,
    date: '',
    showLightbox: false,
    imagesLightbox: [],
    indexLightbox: 0,
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case SHOW_DRAWER:
            return {...state, drawer: action.payload}
        case SET_SORT:
            return {...state, sort: action.payload}
        case SET_FILTER:
            return {...state, filter: action.payload}
        case SET_SEARCH:
            return {...state, search: action.payload}
        case SET_IS_MOBILE_APP:
            return {...state, isMobileApp: action.payload}
        case SHOW_LOAD:
            return {...state, load: action.payload}
        case SET_COUNT_BASKET:
            return {...state, countBasket: action.payload}
        case SET_DATE:
            return {...state, date: action.payload}
        case SHOW_APPBAR:
            return {...state, showAppBar: action.payload}
        case SET_SHOW_LIGHTBOX:
            return {...state, showLightbox: action.payload}
        case SET_INDEX_LIGHTBOX:
            return {...state, indexLightbox: action.payload}
        case SET_IMAGES_LIGHTBOX:
            return {...state, imagesLightbox: action.payload}
        default:
            return state
    }
}