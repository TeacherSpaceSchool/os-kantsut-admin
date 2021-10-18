import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { setAutoApplication, addAutoApplication, deleteAutoApplication } from '../src/gql/autoApplication'
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
import InputLabel from '@material-ui/core/InputLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {inputFloat, checkFloat} from '../src/lib'

const CardAutoApplication = React.memo((props) => {
    const classes = cardStyle();
    const { element, roles, setList, idx, list, divisions, items, units } = props;
    const { isMobileApp } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const types = ['Количество', 'Дни'];
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
     let [specialist, setSpecialist] = useState(element?element.specialist:undefined);
    let [newRoles, setNewRoles] = useState(element?element.roles:[]);
    let [division, setDivision] = useState(element?element.division:undefined);
    let [supplier, setSupplier] = useState(element?element.supplier:undefined);
    let [newItems, setNewItems] = useState(element?element.items:[]);
    useEffect(()=>{
        setSpecialist(undefined)
        setSupplier(undefined)
    },[division])
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            <Autocomplete
                                defaultValue={division}
                                className={classes.input}
                                options={divisions}
                                getOptionLabel={option => option.name}
                                onChange={(event, newValue) => {
                                    setDivision(newValue)
                                }}
                                noOptionsText='Ничего не найдено'
                                renderInput={params => (
                                    <TextField {...params} label='Выберите подразделение' variant='outlined' fullWidth />
                                )}
                            />
                            {
                                division?
                                    <>
                                    <Autocomplete
                                        defaultValue={supplier}
                                        className={classes.input}
                                        options={division.suppliers}
                                        getOptionLabel={option => option.name}
                                        onChange={(event, newValue) => {
                                            setSupplier(newValue)
                                        }}
                                        noOptionsText='Ничего не найдено'
                                        renderInput={params => (
                                            <TextField {...params} label='Выберите снабженца' variant='outlined' fullWidth />
                                        )}
                                    />
                                    <Autocomplete
                                        defaultValue={specialist}
                                        className={classes.input}
                                        options={division.staffs}
                                        getOptionLabel={option => option.name}
                                        onChange={(event, newValue) => {
                                            setSpecialist(newValue)
                                        }}
                                        noOptionsText='Ничего не найдено'
                                        renderInput={params => (
                                            <TextField {...params} label='Выберите специалиста' variant='outlined' fullWidth />
                                        )}
                                    />
                                    </>
                                    :
                                    null
                            }
                            <ExpansionPanel style={{width: '100%', marginBottom: 10}}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <div className={classes.value}>
                                        Товары: {newItems.length}
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <div>
                                        {
                                            newItems.map((element, idx) =>
                                                <div style={{width: '100%', ...idx!==newItems.length-1?{borderBottom: '1px solid #949494', marginBottom: 10}:{}}} key={idx} className={classes.column}>
                                                    <Autocomplete
                                                        defaultValue={element}
                                                        className={classes.input}
                                                        options={items}
                                                        getOptionLabel={option => option.name}
                                                        onChange={(event, newValue) => {
                                                            if(newValue) {
                                                                newItems[idx].item = newValue._id
                                                                newItems[idx].name = newValue.name
                                                                newItems[idx].GUID = newValue.GUID
                                                                setNewItems([...newItems])
                                                            }
                                                        }}
                                                        noOptionsText='Ничего не найдено'
                                                        renderInput={params => (
                                                            <TextField {...params} label='Выберите товар' variant='outlined' fullWidth />
                                                        )}
                                                    />
                                                    <FormControl className={classes.input}>
                                                        <InputLabel>Триггер</InputLabel>
                                                        <Select value={element.type} onChange={(event)=>{
                                                            newItems[idx].type=event.target.value
                                                            setNewItems([...newItems])
                                                        }}>
                                                            {types.map((element, idx) => {
                                                                return <MenuItem key={idx} value={element}>{element}</MenuItem>
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                    {
                                                        element.type==='Количество'?
                                                            <TextField
                                                                label='Количество триггер'
                                                                type={isMobileApp?'number':'text'}
                                                                className={classes.input}
                                                                value={element.triggerCount}
                                                                onChange={(event)=>{
                                                                    newItems[idx].triggerCount = inputFloat(event.target.value)
                                                                    setNewItems([...newItems])
                                                                }}
                                                            />
                                                            :
                                                            <FormControl className={classes.input}>
                                                                <InputLabel>Дни</InputLabel>
                                                                <Select multiple value={element.triggerDays} onChange={(event)=>{
                                                                    newItems[idx].triggerDays=event.target.value
                                                                    setNewItems([...newItems])
                                                                }}>
                                                                    {days.map((element, idx) => {
                                                                        return <MenuItem key={idx} value={element}>
                                                                        {element}
                                                                            </MenuItem>
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                    }
                                                    <div style={{width: '100%'}} key={idx} className={classes.row}>
                                                        <TextField
                                                            label='Количество закупа'
                                                            type={isMobileApp?'number':'text'}
                                                            style={{width: 'calc(100% - 110px)', marginBottom: 10, marginRight: 10}}
                                                            value={element.count}
                                                            onChange={(event)=>{
                                                                newItems[idx].count = inputFloat(event.target.value)
                                                                setNewItems([...newItems])
                                                            }}
                                                        />
                                                        <FormControl style={{width: 100}}>
                                                            <InputLabel>Ед. изм.</InputLabel>
                                                            <Select value={element.unit} onChange={(event)=>{
                                                                newItems[idx].unit=event.target.value
                                                                setNewItems([...newItems])
                                                            }}>
                                                                {units.map((element, idx) => {
                                                                    return <MenuItem key={idx} value={element}>{element}</MenuItem>
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <Button onClick={async()=>{
                                            setNewItems([...newItems, {GUID: '', item: undefined, type: 'Количество', triggerCount: 0, triggerDays: [], count: 0, unit: 'шт'}])
                                        }} size='small' color='primary'>
                                            Добавить товар
                                        </Button>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <div className={classes.value}>
                                        Маршрут: {newRoles.length}
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                <div>
                                    {
                                        newRoles.map((element, idx) =>
                                            <div style={{alignItems: 'end'}} key={idx} className={classes.row}>
                                                <Autocomplete
                                                    value={newRoles[idx]}
                                                    className={classes.halfInput}
                                                    options={roles}
                                                    getOptionLabel={option => option}
                                                    onChange={(event, newValue) => {
                                                        if(newValue) {
                                                            newRoles[idx] = newValue
                                                            setNewRoles([...newRoles])
                                                        }
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
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        element!==undefined?
                            <>
                            <Button onClick={async()=>{
                                newItems = newItems.map(newItem=>{
                                    return {
                                        GUID: newItem.GUID, item: newItem.item, name: newItem.name, type: newItem.type, triggerCount: checkFloat(newItem.triggerCount), triggerDays: newItem.triggerDays, count: checkFloat(newItem.count), unit: newItem.unit
                                    }
                                })
                                let editElement = {_id: element._id, roles: newRoles, items: newItems}
                                if(supplier&&supplier._id!==element.supplier._id)editElement.supplier = supplier._id
                                if(specialist&&specialist._id!==element.specialist._id)editElement.specialist = specialist._id
                                if(division&&division._id!==element.division._id)editElement.division = division._id
                                const action = async() => {
                                    await setAutoApplication(editElement)
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                Сохранить
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteAutoApplication([element._id])
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
                                if (division&&supplier&&specialist&&newItems.length&&newRoles.length) {
                                    const action = async() => {
                                        newItems = newItems.map(newItem=>{
                                            newItem.triggerCount = checkFloat(newItem.triggerCount); newItem.count = checkFloat(newItem.count); return newItem
                                        })
                                        let res = (await addAutoApplication({roles: newRoles, division: division._id, items: newItems, supplier: supplier._id, specialist: specialist._id})).addAutoApplication
                                        setNewRoles([])
                                        setDivision(undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(CardAutoApplication)