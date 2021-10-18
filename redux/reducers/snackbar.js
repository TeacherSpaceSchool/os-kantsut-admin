import { CLOSE_SNACKBAR, SHOW_SNACKBAR } from '../constants/snackbar'

const initialState = {
    title:'',
    show: false
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case CLOSE_SNACKBAR:
            return {...state, show: false}
        case SHOW_SNACKBAR:
            return {...state, title: action.payload.title, show: true}
        default:
            return state
    }
}