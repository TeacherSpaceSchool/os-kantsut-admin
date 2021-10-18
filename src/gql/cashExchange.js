import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getCashExchangeForExpenseReport = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        cashExchangesForExpenseReport {
                            _id
                            createdAt
                            number
                            supplier {_id name}
                            comment
                            exchangeFrom
                            sync
                            currencyTypeFrom
                            exchangeTo
                            currencyTypeTo
                            exchangeRate
                            currencyTypeRate
                            note
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getCashExchanges = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $date: String!, $skip: Int!) {
                        cashExchanges(search: $search, date: $date, skip: $skip) {
                             _id
                            createdAt
                            number
                            supplier {_id name}
                            comment
                            exchangeFrom
                            sync
                            currencyTypeFrom
                            exchangeTo
                            currencyTypeTo
                            exchangeRate
                            currencyTypeRate
                            note
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getCashExchange = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        cashExchange(_id: $_id) {
                             _id
                            createdAt
                            number
                            supplier {_id name}
                            comment
                            exchangeFrom
                            sync
                            currencyTypeFrom
                            exchangeTo
                            currencyTypeTo
                            exchangeRate
                            currencyTypeRate
                            note
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteCashExchange = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteCashExchange(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const getUnloadingCashExchange = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        unloadingCashExchange(_id: $_id) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const addCashExchange = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($exchangeFrom: Float!, $currencyTypeFrom: String!, $currencyTypeTo: String!, $exchangeTo: Float!, $comment: String!, $note: [String]!) {
                        addCashExchange(exchangeFrom: $exchangeFrom, currencyTypeFrom: $currencyTypeFrom, currencyTypeTo: $currencyTypeTo, exchangeTo: $exchangeTo, comment: $comment, note: $note) {
                            data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}