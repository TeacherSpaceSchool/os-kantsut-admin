import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addSeller, deleteSeller, setSeller } from '../src/gql/seller'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'

const CardSeller = React.memo((props) => {
    const classes = cardStyle();
    const { element, setList, idx, list } = props;
    const { isMobileApp } = props.app;
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [phone, setPhone] = useState(element?element.phone:'');
    let handlePhone =  (event) => {
        setPhone(event.target.value)
    };
    let [address, setAddress] = useState(element?element.address:'');
    let handleAddress = (event) => {
        setAddress(event.target.value)
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            <TextField
                                label='Имя'
                                value={name}
                                className={classes.input}
                                onChange={handleName}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                            <TextField
                                label='Телефон'
                                value={phone}
                                className={classes.input}
                                onChange={handlePhone}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                            <TextField
                                label='Адрес'
                                value={address}
                                className={classes.input}
                                onChange={handleAddress}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        element!==undefined?
                            <>
                            <Button onClick={async()=>{
                                let editElement = {_id: element._id}
                                if(name.length>0&&name!==element.name)editElement.name = name
                                if(address.length>0&&address!==element.address)editElement.address = address
                                if(phone.length>0&&phone!==element.phone)editElement.phone = phone
                                const action = async() => {
                                    await setSeller(editElement)
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                Сохранить
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteSeller([element._id])
                                    list.splice(idx, 1);
                                    setList([...list])
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }}>
                                Удалить
                            </Button>
                            </>:
                            <Button onClick={async()=> {
                                if (name.length>0) {
                                    const action = async() => {
                                        let seller = (await addSeller({name, phone, address})).addSeller
                                        setName('')
                                        setAddress('')
                                        setPhone('')
                                        setList([seller, ...list])
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                } else
                                    showSnackBar('Заполните все поля')

                            }
                            } size='small' color='primary'>
                                Добавить
                            </Button>}
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

export default connect(mapStateToProps, mapDispatchToProps)(CardSeller)