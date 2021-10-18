import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardSettingStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { setSetting } from '../src/gql/setting'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

const CardSetting = React.memo((props) => {
    const classes = cardSettingStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    const suppliers = ['подразделение', 'категория']
    let [supplier, setSupplier] = useState(element.supplier?element.supplier:'подразделение');
    let handleSupplier = (async (event) => {
        setSupplier(event.target.value)
    })
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column} style={{width: '100%'}}>
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button onClick={async()=>{
                        let editElement = {}
                        if(supplier!==element.supplier)editElement.supplier = supplier
                        const action = async() => {
                            await setSetting(editElement)
                        }
                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                        showMiniDialog(true)
                    }} size='small' color='primary'>
                        Сохранить
                    </Button>
                </CardActions>
            </Card>
    );
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardSetting)