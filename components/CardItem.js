import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addItem, deleteItem, setItem } from '../src/gql/item'
import { checkFloat } from '../src/lib'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import Autocomplete from '@material-ui/lab/Autocomplete';

const CardItem = React.memo((props) => {
    const classes = cardStyle();
    const { element, /*setList, idx, list, categorys*/ } = props;
    const { isMobileApp } = props.app;
    let [name, setName] = useState(element?element.name:'');
    let [category, setCategory] = useState(element?element.category:undefined);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            {/*<Autocomplete
                                defaultValue={category}
                                className={classes.input}
                                options={categorys}
                                getOptionLabel={option => option.name}
                                onChange={(event, newValue) => {
                                    setCategory(newValue)
                                }}
                                noOptionsText='Ничего не найдено'
                                renderInput={params => (
                                    <TextField {...params} label='Выберите категорию' variant='outlined' fullWidth />
                                )}
                            />*/}
                            <TextField
                                label='Категория'
                                value={category.name}
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                            <TextField
                                label='Название'
                                value={name}
                                className={classes.input}
                                onChange={(event) => {
                                    //setName(event.target.value)
                                }}
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
                            {/*<Button onClick={async()=>{
                                let editElement = {_id: element._id}
                                if(name.length>0&&name!==element.name)editElement.name = name
                                if(category&&category._id!==element.category._id)editElement.category = category._id
                                const action = async() => {
                                    await setItem(editElement)
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                Сохранить
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteItem([element._id])
                                    list.splice(idx, 1);
                                    setList([...list])
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }}>
                                Удалить
                            </Button>*/}
                            </>
                            :
                            <Button onClick={async()=> {
                                if (name.length>0&&category) {
                                    const action = async() => {
                                        let res = (await addItem({name: name, category: category._id})).addItem
                                        if(res) {
                                            setName('')
                                            setCategory(undefined)
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
                            </Button>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(CardItem)