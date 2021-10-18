import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { setRoute, addRoute, deleteRoute } from '../src/gql/route'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import VerticalAlignBottom from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTop from '@material-ui/icons/VerticalAlignTop';
import Delete from '@material-ui/icons/Delete';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

const CardApplicationRoute = React.memo((props) => {
    const classes = cardStyle();
    const { element, roles, setList, idx, list, specialistsForRoute } = props;
    const { isMobileApp } = props.app;
    let [newRoles, setNewRoles] = useState(element?element.roles:[]);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let [specialists, setSpecialists] = useState(element?element.specialists:[]);
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            <FormControl className={classes.input}>
                                <InputLabel>Заявители</InputLabel>
                                <Select
                                    multiple
                                    className={classes.input}
                                    value={specialists}
                                    onChange={(event)=>{
                                        console.log(event.target.value)
                                        setSpecialists(event.target.value)
                                    }}
                                    input={<Input/>}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 500,
                                                width: 250,
                                            },
                                        },
                                    }}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value.name} className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {specialistsForRoute.map((user) => {
                                        return <MenuItem key={user._id} value={user}
                                                         style={{background: specialists.includes(user._id) ? '#009ADC2b' : '#ffffff'}}>
                                            {user.name}
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            {
                                newRoles.map((element, idx) =>
                                    <div style={{alignItems: 'end'}} key={idx} className={classes.row}>
                                        <Autocomplete
                                            value={newRoles[idx]}
                                            className={classes.halfInput}
                                            options={roles}
                                            getOptionLabel={option => option}
                                            onChange={(event, newValue) => {
                                                newRoles[idx]=newValue
                                                setNewRoles([...newRoles])
                                            }}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={params => (
                                                <TextField {...params} label='Выберите роль' variant='outlined' fullWidth />
                                            )}
                                        />
                                            <Tooltip title='Вверх'>
                                                <IconButton
                                                    onClick={()=>{
                                                        if(idx!==0) {
                                                            let _newRoles = [...newRoles]
                                                            _newRoles[idx] = newRoles[idx - 1]
                                                            _newRoles[idx - 1] = newRoles[idx]
                                                            setNewRoles([..._newRoles])
                                                        }
                                                    }}
                                                    color='primary'
                                                >
                                                    <VerticalAlignTop />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Вниз'>
                                                <IconButton
                                                    onClick={()=>{
                                                        if(idx!==(newRoles.length-1)) {
                                                            let _newRoles = [...newRoles]
                                                            _newRoles[idx] = newRoles[idx + 1]
                                                            _newRoles[idx + 1] = newRoles[idx]
                                                            setNewRoles([..._newRoles])
                                                        }
                                                    }}
                                                    color='primary'
                                                >
                                                    <VerticalAlignBottom />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Удалить'>
                                                <IconButton
                                                    onClick={()=>{
                                                        newRoles.splice(idx, 1)
                                                        setNewRoles([...newRoles])
                                                    }}
                                                    color='primary'
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                    </div>
                                )
                            }
                            <Button onClick={async()=>{
                                setNewRoles([...newRoles, ''])
                            }} size='small' color='primary'>
                                Добавить роль
                            </Button>
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        element!==undefined?
                            <>
                            <Button onClick={async()=>{
                                let editElement = {_id: element._id, roles: newRoles}
                                if(specialists.length&&JSON.stringify(specialists)!==JSON.stringify(element.specialists))editElement.specialists = specialists.map(specialist=>specialist._id)
                                const action = async() => {
                                    await setRoute(editElement)
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                Сохранить
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteRoute([element._id])
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
                                if (specialists.length) {
                                    const action = async() => {
                                        let res = (await addRoute({roles: newRoles, specialists: specialists.map(specialist=>specialist._id)})).addRoute
                                        setNewRoles([])
                                        setSpecialists([])
                                        setList([res, ...list])
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

export default connect(mapStateToProps, mapDispatchToProps)(CardApplicationRoute)