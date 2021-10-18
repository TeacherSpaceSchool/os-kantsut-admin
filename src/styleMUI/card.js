import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    cardM: {
        width: 'calc(100vw - 40px)',
        marginBottom: 20
    },
    cardD: {
        width: 400,
        margin: 10
    },
    input: {
        width: '100%',
        marginBottom: 10
    },
    halfInput: {
        width: 224,
        marginBottom: 10
    },
    icon: {
        width: '50%',
        marginBottom: 10
    },
    column: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    row: {
        alignItems: 'baseline',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    value: {
        marginBottom: 10,
        fontWeight: '500',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        wordBreak: 'break-all'
    },
    nameField: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    number: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1rem',
        fontFamily: 'Roboto',
    },
    date: {
        marginBottom: 10,
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    listStatus: {
        position: 'absolute',
        top: 10,
        right: 10,
        height: 256,
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
    },
    pinRightTop: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    status: {
        marginBottom: 5,
        padding: 4,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',

    },
})