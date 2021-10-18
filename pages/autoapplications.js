import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { getAutoApplications } from '../src/gql/autoApplication'
import { getRoles } from '../src/gql/role'
import { getDivisions } from '../src/gql/division'
import { getUnits } from '../src/gql/unit'
import { getItems } from '../src/gql/item'
import pageListStyle from '../src/styleMUI/list'
import CardAutoApplication from '../components/CardAutoApplication'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import { forceCheck } from 'react-lazyload';
import LazyLoad from 'react-lazyload';
import CardRoutePlaceholder from '../components/CardPlaceholder'
import { connect } from 'react-redux'

const AutoApplications = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const { pinCode } = props.user;
    const height = 174
    const initialRender = useRef(true);
    let [roles, setRoles] = useState(['специалист', 'бухгалтерия', 'кассир', 'снабженец', 'завсклад', 'генеральный директор', 'финансовый директор',... data.roles?data.roles.map(element=>element.name):[]]);
    let [divisions, setDivisions] = useState(data.divisions);
    let [items, setItems] = useState(data.items);
    let [units, setUnits] = useState(data.units);
    let [list, setList] = useState(data.autoApplications);
    let [paginationWork, setPaginationWork] = useState(true);
    const getList = async()=>{
        setList((await getAutoApplications({skip: 0})).autoApplications)
        forceCheck()
        setPaginationWork(true);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else if(pinCode) {
                setRoles(['специалист', 'бухгалтерия', 'кассир', 'снабженец', 'завсклад', 'генеральный директор', 'финансовый директор',... (await getRoles({search: ''})).roles.map(element=>element.name)])
                setDivisions((await getDivisions({search: ''})).divisions)
                setItems((await getItems({search: ''})).items)
                units = (await getUnits({search: ''})).units
                units = units.map(unit=>unit.name)
                setUnits(units)
                await getList()
            }
        })()
    },[pinCode])
    useEffect(()=>{
        forceCheck()
    },[list])
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = (await getAutoApplications({skip: list.length})).autoApplications
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} pageName='Автозакуп'>
            <Head>
                <title>Автозакуп</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Автозакуп' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/autoapplications`} />
                <link rel='canonical' href={`${urlMain}/autoapplications`}/>
            </Head>
            <div className={classes.page}>
                <CardAutoApplication units={units} divisions={divisions} roles={roles} setList={setList} items={items} list={list}/>
                {list?list.map((element, idx)=> {
                    return (
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                                  offset={[height, 0]} debounce={0} once={true}
                                          placeholder={<CardRoutePlaceholder height={height}/>}>
                                    <CardAutoApplication divisions={divisions}
                                                         roles={roles}
                                                         key={element._id}
                                                         items={items}
                                                         units={units}
                                                         setList={setList}
                                                         list={list}
                                                         idx={idx}
                                                         element={element}/>
                                </LazyLoad>
                            )

                    }
                ):null}
            </div>
        </App>
    )
})

AutoApplications.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    return {
        data: {
            ...await getAutoApplications({search: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getRoles({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getDivisions({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getItems({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getUnits({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
}
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(AutoApplications);