import { SET_MINI_DIALOG, SHOW_MINI_DIALOG, SET_FULL_DIALOG, SHOW_FULL_DIALOG } from '../constants/mini_dialog'

const initialState = {
    title:'',
    child:null,
    show: false,
    titleFull:'',
    childFull:null,
    showFull: false,
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case SHOW_MINI_DIALOG:
            return {...state, show: action.payload}
        case SET_MINI_DIALOG:
            return {...state, title: action.payload.title, child: action.payload.child}
        case SHOW_FULL_DIALOG:
            return {...state, showFull: action.payload}
        case SET_FULL_DIALOG:
            return {...state, titleFull: action.payload.title, childFull: action.payload.child}
        default:
            return state
    }
}