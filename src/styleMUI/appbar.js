import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    appBar: {
        zIndex: 1201,
    },
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        height: 28,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '1.125rem!important'
    },
    searchD: {
        position: 'fixed',
        top: 6,
        right: 6
    },
    searchM: {
        position: 'fixed',
        top: 0,
        right: 0,
        height: '56px',
        width: '100vw'
    },
    textField: {
        width: 'calc(100% - 20px)',
        margin: 10,
    },
    searchField: {
        width: 'calc(100% - 20px)',
        margin: 10,
    },
})