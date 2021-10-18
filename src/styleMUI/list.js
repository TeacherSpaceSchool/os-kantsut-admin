import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
    page: {
        paddingTop: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    fab: {
        position: 'fixed!important',
        bottom: '20px',
        right: '20px'
    },
    row:{
        alignItems: 'baseline',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    tableName:{
        alignItems: 'baseline',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 20
    },
    column:{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    inputSwitch: {
        fontSize: '0.875rem',
        margin: 10,
        width: 100
    },
    noteImageDiv: {
        position: 'relative'
    },
    noteImage: {
        marginLeft: 10,
        width: 80,
        height: 80,
        cursor: 'pointer'
    },
    noteImageButton: {
        top: 0,
        right: 0,
        position: 'absolute',
        marginLeft: 10,
        width: 24,
        height: 24,
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noteImageList: {
        display: 'flex',
        overflowX: 'auto'
    },
    cell: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        wordBreak: 'break-all',
        flexDirection: 'column'
    },
    cellRow: {
        marginBottom: 5
    },
    tableRow:{
        display: 'flex',
        flexDirection: 'row',
        flex: 'none',
        border: '0.1px solid rgba(0, 0, 0, 0.12)',
    },
    zoomBtn:{
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginLeft: '10px',
        marginBottom: '10px',
        border: '1px solid black',
        width: 24,
        height: 24
    },
    table: {
        background: 'white',
        width: '100%',
        overflowX: 'scroll',
        flex: 'none',
        marginBottom: 30,
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        overflowY: 'hidden'
    },
    input: {
        fontSize: '0.875rem',
        margin: 10,
        width: 'calc(100% - 20px)',
    },
    inputTable: {
        fontSize: '0.875rem',
        width: '100%',
    },
    inputHalf: {
        fontSize: '0.875rem',
        margin: 10,
        width: 'calc(50% - 20px)'
    },
    inputThird: {
        fontSize: '0.875rem',
        margin: 10,
        width: 'calc((100% / 3) - 20px)'
    },
    value: {
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: '500',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        wordBreak: 'break-all'
    },
    nameField: {
        marginLeft: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    nameTable: {
        fontWeight: 'bold',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        textAlign: 'center',
        color: '#A0A0A0'
    },
    bodyTable: {
        height: 40,
    },
    bottomDivD: {
        width: 'calc(100vw - 300px)',
        borderTop: '1px #aeaeae solid',
        background: '#fff',
        height: 70,
        position: 'fixed',
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingRight: 16,
        zIndex: 10000
    },
    bottomDivM: {
        width: '100vw',
        borderTop: '1px #aeaeae solid',
        background: '#fff',
        height: 70,
        position: 'fixed',
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingRight: 16,
        zIndex: 10000
    },
})