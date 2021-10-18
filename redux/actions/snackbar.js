import { CLOSE_SNACKBAR, SHOW_SNACKBAR } from '../constants/snackbar'

export function showSnackBar(title) {
    return {
        type: SHOW_SNACKBAR,
        payload: {title: title}
    }
}

export function closeSnackBar() {
    return {
        type: CLOSE_SNACKBAR,
    }
}
