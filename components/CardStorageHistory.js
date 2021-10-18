import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStorageStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import { pdDDMMYYHHMM } from '../src/lib'

const CardStorage = React.memo((props) => {
    const classes = cardStorageStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            <div className={classes.row}>
                                <div className={classes.nameField}>Дата:&nbsp;</div>
                                <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>Товар:&nbsp;</div>
                                <div className={classes.value}>{element.item.name}</div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>Количество:&nbsp;</div>
                                <div className={classes.column}>{element.count}</div>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardStorage)