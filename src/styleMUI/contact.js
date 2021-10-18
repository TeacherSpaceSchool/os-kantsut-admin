import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    page: {
        margin: '20px'
    },
    row:{
        alignItems: 'baseline',
        display: 'flex',
        flexDirection: 'row',
    },
    column:{
        display: 'flex',
        flexDirection: 'column',
    },
    mediaM: {
        objectFit: 'cover',
        height: 'calc(100vw - 72px)',
        width: 'calc(100vw - 72px)',
        marginBottom: 10,
    },
    mediaD: {
        objectFit: 'cover',
        height: 300,
        width: 300,
        marginRight: 10,
        marginBottom: 10,
        cursor: 'pointer'
    },
    name: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1.25rem',
        fontFamily: 'Roboto'
    },
    value: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1rem',
        fontFamily: 'Roboto',
        wordBreak: 'break-all'
    },
    nameField: {
        width: 80,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    info: {
        color: '#455A64',
        marginBottom: 10,
        fontSize: '1rem',
        fontFamily: 'Roboto',
        whiteSpace: 'pre-wrap'
    },
    input: {
        marginBottom: 10,
        width: '100%',
    },
    mediaSocial: {
        objectFit: 'cover',
        height: 32,
        width: 32,
        margin: 10,
    },

})