import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getWaybillsForExpenseReport = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        waybillsForExpenseReport {
                            _id
                            createdAt
                            status
                            number
                            dateClose
                            acceptSpecialist
                            application {_id number amount {name value}}
                            seller
                            comment
                            patent
                            specialist {_id name}
                            supplier {_id name}
                            items {name unit price count comment status currency GUID} 
                            amount {name value}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getWaybills = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $filter: String!, $sort: String!, $date: String!, $skip: Int!) {
                        waybills(search: $search, filter: $filter, sort: $sort, date: $date, skip: $skip) {
                            _id
                            createdAt
                            status
                            number
                            dateClose
                            comment
                            acceptSpecialist
                            application {_id number amount {name value}}
                            seller
                            patent
                            specialist {_id name}
                            supplier {_id name}
                            amount {name value}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getUnloadingWaybill = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        unloadingWaybill(_id: $_id) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getWaybill = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        waybill(_id: $_id) {
                            _id
                            createdAt
                            status
                            number
                            dateClose
                            acceptSpecialist
                            application {_id number amount {name value} items {name unit price count comment status currency}}
                            seller
                            patent
                            comment
                            specialist {_id name}
                            supplier {_id name}
                            items {name unit price count comment status currency GUID} 
                            amount {name value}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteWaybill = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteWaybill(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addWaybill = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($application: ID!, $seller: String!, $patent: [String], $items: [InputItems]!) {
                        addWaybill(application: $application, seller: $seller, patent: $patent, items: $items) {
                            data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setWaybill = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $acceptSpecialist: Date, $comment: String, $seller: String, $patent: [String], $items: [InputItems]) {
                        setWaybill(_id: $_id, acceptSpecialist: $acceptSpecialist, comment: $comment, seller: $seller, patent: $patent, items: $items) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}