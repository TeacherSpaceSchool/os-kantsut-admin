import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getExpenseReports = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $filter: String!, $sort: String!, $date: String!, $skip: Int!) {
                        expenseReports(search: $search, filter: $filter, sort: $sort, date: $date, skip: $skip) {
                            _id
                            createdAt
                            number
                            status
                            acceptHead
                            supplier {_id name}
                            sync
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getUnloadingExpenseReport = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        unloadingExpenseReport(_id: $_id) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getExpenseReport = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        expenseReport(_id: $_id) {
                            _id
                            createdAt
                            status
                            number
                            dateClose
                            acceptHead
                            applications {_id number amount {name value} createdAt}
                            waybills { _id createdAt number seller patent amount {name value} items {name unit price count comment status currency} }
                            cashConsumables {_id number amount currencyType createdAt comment}
                            cashExchanges {_id createdAt number supplier {_id name} comment exchangeFrom sync currencyTypeFrom exchangeTo currencyTypeTo exchangeRate currencyTypeRate note}
                            supplier {_id name}
                            balanceStart {name value}
                            receivedAmount {name value}
                            expense {name value}
                            overExpense {name value}
                            outCashbox {name value}
                            balanceEnd {name value}
                            addedItems {name unit price count comment status currency GUID} 
                            sync
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteExpenseReport = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteExpenseReport(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addExpenseReport = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($outCashbox: [InputCurrency]!, $addedItems: [InputItems]!) {
                        addExpenseReport(outCashbox: $outCashbox, addedItems: $addedItems) {
                            data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setExpenseReport = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $acceptHead: Date) {
                        setExpenseReport(_id: $_id, acceptHead: $acceptHead) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}