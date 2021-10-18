import { makeStyles } from '@material-ui/core/styles';
import { urlMain } from '../../redux/constants/other'

export default makeStyles({
    page: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        flexDirection: 'column',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '1.125rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        //textShadow: '1px 1px 2px black, 0 0 1em black'
    },
    logo: {
        width: 200
    }

})