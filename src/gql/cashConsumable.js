import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getCashConsumablesForExpenseReport = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        cashConsumablesForExpenseReport {
                            _id
                            createdAt
                            number
                            amount
                            currencyType
                            supplier {_id name}
                            comment
                            budget
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getCashConsumables = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $date: String!, $skip: Int!) {
                        cashConsumables(search: $search, date: $date, skip: $skip) {
                            _id
                            createdAt
                            number
                            currencyType
                            amount
                            supplier {_id name}
                            dateClose
                            comment
                            budget
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getCashConsumable = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        cashConsumable(_id: $_id) {
                            _id
                            createdAt
                            number
                            currencyType
                            amount
                            supplier {_id name}
                            dateClose
                            comment
                            budget
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteCashConsumable = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteCashConsumable(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const getUnloadingCashConsumable = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        unloadingCashConsumable(_id: $_id) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const addCashConsumable = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($supplier: ID!, $amount: Int!, $comment: String!, $budget: String!, $currencyType: String!) {
                        addCashConsumable(supplier: $supplier, amount: $amount, budget: $budget, comment: $comment, currencyType: $currencyType) {
                            data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}