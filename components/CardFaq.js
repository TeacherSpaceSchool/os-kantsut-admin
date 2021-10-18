import React, {useState, useRef} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import cardFaqStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { deleteFaq, addFaq, setFaq } from '../src/gql/faq'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import PdfViewer from './dialog/PdfViewer'
import VideoViewer from './dialog/VideoViewer'

const CardFaq = React.memo((props) => {
    const classes = cardFaqStyle();
    const { element, setList } = props;
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    //addCard
    let [file, setFile] = useState(undefined);
    let handleChangeFile = ((event) => {
        if(event.target.files[0].size/1024/1024<50){
            setFile(event.target.files[0])
            setUrl(true)
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [title, setTitle] = useState(element&&element.title?element.title:'');
    let [video, setVideo] = useState(element&&element.video?element.video:'');
    let handleVideo =  (event) => {
        setVideo(event.target.value)
    };
    let [url, setUrl] = useState(element&&element.url?element.url:false);
    let handleTitle =  (event) => {
        setTitle(event.target.value)
    };
    let types = ['клиенты', 'сотрудники']
    let [typex, setTypex] = useState(element&&element.typex?element.typex:'клиенты');
    let handleTypex =  (event) => {
        setTypex(event.target.value)
    };
    const { setMiniDialog, showMiniDialog, showFullDialog, setFullDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let faqRef = useRef(null);
    return (
          <>
          {
              profile.role === 'admin' ?
                  <Card className={isMobileApp?classes.cardM:classes.cardD}>
                      <CardContent>
                          <TextField
                              label='Имя'
                              value={title}
                              className={classes.input}
                              onChange={handleTitle}
                              inputProps={{
                                  'aria-label': 'description',
                              }}
                          />
                          <br/>
                          <br/>
                          <TextField
                              label='Видео'
                              value={video}
                              className={classes.input}
                              onChange={handleVideo}
                              inputProps={{
                                  'aria-label': 'description',
                              }}
                          />
                          <br/>
                          <br/>
                          <Button size='small' color={url?'primary':'secondary'} onClick={async()=>{faqRef.current.click()}}>
                              Загрузить инструкцию
                          </Button>
                      </CardContent>
                      <CardActions>
                          {
                              element!==undefined?
                                  <>
                                  <Button onClick={async()=>{
                                      let editElement = {_id: element._id}
                                      if(title.length>0&&title!==element.title)editElement.title = title
                                      if(video!==element.video)editElement.video = video
                                      if(file!==undefined)editElement.file = file
                                      if(typex!==element.typex)editElement.typex = typex
                                      const action = async() => {
                                          setList((await setFaq(editElement)).faqs)
                                      }
                                      setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                      showMiniDialog(true)
                                  }} size='small' color='primary'>
                                      Сохранить
                                  </Button>
                                  <Button onClick={async()=>{
                                      const action = async() => {
                                          setList((await deleteFaq([element._id])).faqs)
                                      }
                                      setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                      showMiniDialog(true)
                                  }} size='small' color='primary'>
                                      Удалить
                                  </Button>
                                  </>
                                  :
                                  <Button onClick={async()=> {
                                      if (title.length > 0) {
                                          const action = async() => {
                                              setList((await addFaq({typex: typex, video: video, file: file, title: title})).faqs)
                                          }
                                          setFile(undefined)
                                          setTitle('')
                                          setTypex('клиенты')
                                          setVideo('')
                                          setUrl(false)
                                          setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                          showMiniDialog(true)
                                      } else {
                                          showSnackBar('Заполните все поля')
                                      }
                                  }} size='small' color='primary'>
                                      Добавить
                                  </Button>
                          }
                      </CardActions>
                      <input
                          accept='application/pdf'
                          style={{ display: 'none' }}
                          ref={faqRef}
                          type='file'
                          onChange={handleChangeFile}
                      />
                  </Card>
                  :
                  element!==undefined?
                      <Card className={isMobileApp?classes.cardM:classes.cardD}>
                          <CardActionArea>
                          <CardContent>
                              <h3 className={classes.input}>
                                  {element.title}
                              </h3>
                              {
                                  video?
                                      <>
                                      <br/>
                                      <Button onClick={async()=> {
                                          setFullDialog(element.title, <VideoViewer video={element.video}/>)
                                          showFullDialog(true)
                                      }} size='small' color='primary'>
                                          Просмотреть видео инструкцию
                                      </Button>
                                      </>
                                      :
                                      null
                              }
                              <br/>
                              <Button onClick={async()=> {
                                  setFullDialog(element.title, <PdfViewer pdf={element.url}/>)
                                  showFullDialog(true)
                              }} size='small' color='primary'>
                                  Прочитать инструкцию
                              </Button>
                          </CardContent>
                          </CardActionArea>
                      </Card>
                      :null
            }</>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardFaq)