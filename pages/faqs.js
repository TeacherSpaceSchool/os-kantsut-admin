import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import CardFaq from '../components/CardFaq';
import pageListStyle from '../src/styleMUI/list'
import {getFaqs} from '../src/gql/faq'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardFaqPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'

const Faqs = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.faqs);
    const initialRender = useRef(true);
    const { search, } = props.app;
    const { profile, pinCode } = props.user;
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setList((await getFaqs({search: search})).faqs)
            }
        })()
    },[pinCode])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                setList((await getFaqs({search: search})).faqs)
            }
        })()
    },[  search, ])
    useEffect(()=>{
        setPagination(100)
        forceCheck()
    },[list])
    let height = profile.role==='admin'?244:125
    let [pagination, setPagination] = useState(100);
    const checkPagination = ()=>{
        if(pagination<list.length){
            setPagination(pagination+100)
        }
    }
    return (
        <App checkPagination={checkPagination} searchShow={true} pageName='Инструкции'>
            <Head>
                <title>Инструкции</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content='Инструкции' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/faq`} />
                <link rel='canonical' href={`${urlMain}/faq`}/>
            </Head>
            <div className={classes.page}>
                {profile.role==='admin'?<CardFaq setList={setList}/>:null}
                {list?list.map((element, idx)=> {
                        if(idx<=pagination)
                            return(
                                <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardFaqPlaceholder height={height}/>}>
                                    <CardFaq setList={setList} key={element._id} element={element}/>
                                </LazyLoad>
                            )}
                ):null}
            </div>
        </App>
    )
})

Faqs.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: await getFaqs({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Faqs);