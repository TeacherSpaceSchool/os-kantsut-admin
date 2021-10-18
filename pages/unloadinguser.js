import Head from 'next/head';
import React, { useState, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import pageListStyle from '../src/styleMUI/list'
import * as userActions from '../redux/actions/user'
import * as snackbarActions from '../redux/actions/snackbar'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import { unloadingUser } from '../src/gql/user'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import Confirmation from '../components/dialog/Confirmation'

const UnloadingUser = React.memo((props) => {
    const classes = pageListStyle();
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    let [document, setDocument] = useState(undefined);
    let documentRef = useRef(null);
    let handleChangeDocument = ((event) => {
        if(event.target.files[0].size/1024/1024<50){
            setDocument(event.target.files[0])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    return (
        <App pageName='Загрузка снабженцев'>
            <Head>
                <title>Загрузка снабженцев</title>
                <meta name='description' content='Азык – это онлайн платформа для заказа товаров оптом, разработанная специально для малого и среднего бизнеса.  Она объединяет производителей и торговые точки напрямую, сокращая расходы и повышая продажи. Азык предоставляет своим пользователям мощные технологии для масштабирования и развития своего бизнеса.' />
                <meta property='og:title' content='Загрузка снабженцев' />
                <meta property='og:description' content='Азык – это онлайн платформа для заказа товаров оптом, разработанная специально для малого и среднего бизнеса.  Она объединяет производителей и торговые точки напрямую, сокращая расходы и повышая продажи. Азык предоставляет своим пользователям мощные технологии для масштабирования и развития своего бизнеса.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/statistic/integrate/unloadinguser`} />
                <link rel='canonical' href={`${urlMain}/statistic/integrate/unloadinguser`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignUsers: 'flex-start'}}>
                    <div className={classes.row}>
                        Формат xlsx: имя пользователя, GUID пользователя из 1C.
                    </div>
                    <div className={classes.row}>
                        <Button size='small' color={document?'primary':'secondary'} onClick={()=>{documentRef.current.click()}}>
                            {document?document.name:'Прикрепить файл'}
                        </Button>
                    </div>
                    <br/>
                    <div className={classes.row}>
                        <Button variant='contained' size='small' color='primary' onClick={async()=>{
                            if(document) {
                                const action = async() => {
                                    let res = await unloadingUser({
                                        document: document
                                    });
                                    if(res.unloadingUser.data==='OK')
                                        showSnackBar('Все данные загруженны')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }
                            else showSnackBar('Прикрепите документ')
                        }}>
                            Загрузить
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <input
                ref={documentRef}
                accept='*/*'
                style={{ display: 'none' }}
                id='contained-button-file'
                type='file'
                onChange={handleChangeDocument}
            />
        </App>
    )
})

UnloadingUser.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {}
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnloadingUser);