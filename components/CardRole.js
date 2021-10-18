import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addRole, deleteRole, setRole } from '../src/gql/role'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'

const CardRole = React.memo((props) => {
    const classes = cardStyle();
    const { element, setList, idx, list } = props;
    const { isMobileApp } = props.app;
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
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
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        element!==undefined?
                            <>
                            <Button onClick={async()=>{
                                let editElement = {_id: element._id}
                                if(name.length>0&&name!==element.name&&!['admin', 'менеджер', 'специалист', 'бухгалтерия', 'кассир', 'снабженец', 'завсклад', 'генеральный директор', 'финансовый директор', 'начальник отдела'].includes(name))editElement.name = name
                                const action = async() => {
                                    await setRole(editElement)
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                Сохранить
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteRole([element._id])
                                    list.splice(idx, 1);
                                    setList([...list])
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }}>
                                Удалить
                            </Button>
                            </>
                            :
                            <Button onClick={async()=> {
                                if (name.length>0&&!['admin', 'менеджер', 'специалист', 'бухгалтерия', 'кассир', 'снабженец', 'завсклад', 'генеральный директор', 'финансовый директор', 'начальник отдела'].includes(name)) {
                                    const action = async() => {
                                        let category = (await addRole({name: name})).addRole
                                        setName('')
                                        setList([category, ...list])
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

export default connect(mapStateToProps, mapDispatchToProps)(CardRole)