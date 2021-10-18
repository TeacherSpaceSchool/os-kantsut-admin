import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addUser, deleteUser, setUser, onoffUser, restoreUser } from '../src/gql/user'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

const CardUser = React.memo((props) => {
    const classes = cardStyle();
    const { element, setList, idx, list, roles } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    let [status, setStatus] = useState(element?element.status:'deactive');
    let [addApplication, setAddApplication] = useState(element?element.addApplication:false);
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };
    let [login, setLogin] = useState(element?element.login:'');
    let handleLogin =  (event) => {
        setLogin(event.target.value)
    };
    let [role, setRole] = useState(element?element.role:'');
    let handleRole =  (event) => {
        setRole(event.target.value)
    };
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [phone, setPhone] = useState(element?element.phone:'');
    let handlePhone =  (event) => {
        setPhone(event.target.value)
    };
    let [password, setPassword] = useState('');
    let handlePassword =  (event) => {
        setPassword(event.target.value)
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        {
                            profile.role === 'admin' ?
                                <div className={classes.column}>
                                    {
                                        element&&element.del?
                                            <div className={classes.value}>{login}</div>
                                            :
                                            <TextField
                                                label='Логин'
                                                value={login}
                                                className={classes.input}
                                                onChange={handleLogin}
                                                inputProps={{
                                                    'aria-label': 'description',
                                                }}
                                            />
                                    }
                                    {
                                        element&&element.del?
                                            null
                                            :
                                            <Input
                                                placeholder='Пароль'
                                                type={hide ? 'password' : 'text'}
                                                value={password}
                                                onChange={handlePassword}
                                                className={classes.input}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="Toggle password visibility"
                                                                    onClick={handleHide}>
                                                            {hide ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                    }
                                    {
                                        element?
                                            <TextField
                                                label='PIN-код'
                                                value={element.pinCode}
                                                className={classes.input}
                                                inputProps={{
                                                    'aria-label': 'description',
                                                }}
                                            />
                                            :
                                            null
                                    }
                                    {
                                        element&&element.del?
                                            <div className={classes.value}>{name}</div>
                                            :
                                            <TextField
                                                label='Имя'
                                                value={name}
                                                className={classes.input}
                                                onChange={handleName}
                                                inputProps={{
                                                    'aria-label': 'description',
                                                }}
                                            />
                                    }
                                    {
                                        element&&element.del?
                                            <div className={classes.value}>{phone}</div>
                                            :
                                            <TextField
                                                label='Телефон'
                                                value={phone}
                                                className={classes.input}
                                                onChange={handlePhone}
                                                inputProps={{
                                                    'aria-label': 'description',
                                                }}
                                            />
                                    }
                                    {
                                        element?
                                            <TextField
                                                label='Роль'
                                                value={role}
                                                className={classes.input}
                                                inputProps={{
                                                    'aria-label': 'description',
                                                }}
                                            />
                                            :
                                            <FormControl className={classes.input}>
                                                <InputLabel>Роль</InputLabel>
                                                <Select value={role} onChange={handleRole}>
                                                    {roles.map((element, idx) => {
                                                        return <MenuItem key={idx} value={element}>{element}</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                    }
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>Подача заявки:&nbsp;</div>
                                        <Checkbox
                                            size='small'
                                            checked={addApplication}
                                            onChange={()=>{setAddApplication(!addApplication)}}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                </div>
                                :
                                <div className={classes.column}>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Роль:&nbsp;</div>
                                        <div className={classes.value}>{role}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Имя:&nbsp;</div>
                                        <div className={classes.value}>{name}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Телефон:&nbsp;</div>
                                        <div className={classes.value}>{phone}</div>
                                    </div>
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>Подача заявки:&nbsp;</div>
                                        <Checkbox
                                            size='small'
                                            checked={addApplication}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                </div>
                        }
                    </CardContent>
                </CardActionArea>
                {
                    profile.role==='admin'?
                        <CardActions>
                            {
                                element!==undefined?
                                    element.del?
                                        <Button onClick={async()=> {
                                            const action = async() => {
                                                await restoreUser([element._id])
                                                list.splice(idx, 1);
                                                setList([...list])
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} size='small' color='primary'>
                                            Востановить
                                        </Button>
                                        :
                                        <>
                                        <Button onClick={async()=>{
                                            let editElement = {_id: element._id}
                                            if(name.length>0&&name!==element.name)editElement.name = name
                                            if(element.phone&&phone.length>0&&phone!==element.phone)editElement.phone = phone
                                            if(login.length>0&&login!==element.login)editElement.login = login
                                            if(role!==element.role)editElement.role = role
                                            if(status!==element.status)editElement.status = status
                                            if(addApplication!==element.addApplication)editElement.addApplication = addApplication
                                            if(password.length>0)editElement.password = password
                                            const action = async() => {
                                                await setUser(editElement)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} size='small' color='primary'>
                                            Сохранить
                                        </Button>
                                        <Button onClick={async()=>{
                                            const action = async() => {
                                                await onoffUser([element._id])
                                                setStatus(status==='active'?'deactive':'active')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} size='small' color={status==='active'?'primary':'secondary'}>
                                            {status==='active'?'Отключить':'Включить'}
                                        </Button>
                                        {
                                            role!=='снабженец'?
                                                <Button size='small' color='primary' onClick={()=>{
                                                    const action = async() => {
                                                        await deleteUser([element._id])
                                                        list.splice(idx, 1);
                                                        setList([...list])
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }}>
                                                    Удалить
                                                </Button>
                                                :
                                                null
                                        }
                                        </>
                                    :
                                    <Button onClick={async()=> {
                                        if (name.length>0&&login.length>0&&password.length>0&&role.length>0) {
                                            const action = async() => {
                                                let user = (await addUser({addApplication, phone, name, login, password, role})).addUser
                                                if(user) {
                                                    setAddApplication(false)
                                                    setName('')
                                                    setLogin('')
                                                    setPassword('')
                                                    setRole('')
                                                    setPhone('')
                                                    setList([user, ...list])
                                                }
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
                        :
                        null
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(CardUser)