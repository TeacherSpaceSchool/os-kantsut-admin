import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addSubdivision, deleteSubdivision, setSubdivision } from '../src/gql/subdivision'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import Autocomplete from '@material-ui/lab/Autocomplete';

const CardSubdivision = React.memo((props) => {
    const classes = cardStyle();
    const { element, setList, idx, list, divisions } = props;
    const { isMobileApp } = props.app;
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [division, setDivision] = useState(element?element.division:undefined);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
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
                                if(name.length>0&&name!==element.name)editElement.name = name
                                if(division&&division._id!==element.division._id)editElement.division = division._id
                                const action = async() => {
                                    await setSubdivision(editElement)
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                Сохранить
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteSubdivision([element._id])
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
                                if (name.length>0&&division) {
                                    const action = async() => {
                                        let res = (await addSubdivision({name: name, division: division._id})).addSubdivision
                                        if(res) {
                                            setName('')
                                            setDivision(undefined)
                                            setList([res, ...list])
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

export default connect(mapStateToProps, mapDispatchToProps)(CardSubdivision)