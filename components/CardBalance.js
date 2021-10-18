import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardBalanceStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Button from '@material-ui/core/Button';
import Router from 'next/router'
import { pdDDMMYYHHMM } from '../src/lib'

const CardBalance = React.memo((props) => {
    const classes = cardBalanceStyle();
    const { element, C1, history } = props;
    const { isMobileApp } = props.app;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            {
                                history?
                                    null
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Дата:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                                    </div>
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>Снабженец:&nbsp;</div>
                                <div className={classes.value}>{element.supplier.name}</div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>Сумма:&nbsp;</div>
                                <div className={classes.column}>
                                    {
                                        element.amount.map((amount, idx) =>
                                            <div key={idx} className={classes.value}>{`${amount.value} ${amount.name}`}</div>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                element.error?
                                    <Button size='small' color='secondary' className={classes.pinRightTop}>
                                        Ошибка
                                    </Button>
                                    :
                                    null
                            }
                            {
                                history?
                                    <Button onClick={async()=> {
                                        Router.push(`/${C1?'balance1Chistory':'balancehistory'}/${element.supplier._id}`)
                                    }} size='small' color='primary'>
                                        История
                                    </Button>
                                    :
                                    null
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(CardBalance)