import { combineReducers } from 'redux'
import app from './app'
import user from './user'
import mini_dialog from './mini_dialog'
import snackbar from './snackbar'

export default combineReducers({
    app,
    user,
    mini_dialog,
    snackbar,
})