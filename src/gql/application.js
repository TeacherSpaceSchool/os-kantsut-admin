import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getApplications = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $filter: String!, $sort: String!, $date: String!, $skip: Int!, $dateEnd: String, $supplier: ID) {
                        applications(search: $search, filter: $filter, sort: $sort, date: $date, skip: $skip, dateEnd: $dateEnd, supplier: $supplier) {
                            _id
                            createdAt
                            status
                            number
                            subdivision
                            division {_id name}
                            category {_id name}
                            budget
                            note
                            paymentType
                            comment
                            official
                            dateClose
                            term
                            amount {name value}
                            specialist {_id name}
                            supplier {_id name}
                            routes {role confirmation cancel comment}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getApplicationsForWaybill = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        applicationsForWaybill {
                            _id
                            createdAt
                            status
                            number
                            subdivision
                            division {_id name}
                            category {_id name}
                            budget
                            note
                            paymentType
                            comment
                            official
                            dateClose
                            term
                            amount {name value}
                            specialist {_id name}
                            supplier {_id name}
                            items {currency name unit price count comment status GUID} 
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getApplication = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        application(_id: $_id) {
                            _id
                            createdAt
                            status
                            number
                            division {_id name suppliers {_id name}}
                            subdivision
                            category {_id name}
                            budget
                            note
                            paymentType
                            comment
                            official
                            dateClose
                            term
                            amount {name value}
                            specialist {_id name}
                            supplier {_id name}
                            items {currency name unit price count comment status GUID} 
                            routes {role confirmation cancel comment}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getUnloadingApplication = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        unloadingApplication(_id: $_id) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getItemsFromApplications = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        itemsFromApplications
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteApplication = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteApplication(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($category: ID!, $comment: String!, $term: String!, $division: ID!, $subdivision: String, $items: [InputItems]!, $budget: Boolean, $paymentType: String, $official: Boolean, $note: [String]) {
                        addApplication(category: $category, comment: $comment, term: $term, division: $division, subdivision: $subdivision, items: $items, budget: $budget, paymentType: $paymentType, official: $official, note: $note) {
                            data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $budget: Boolean, $term: String, $comment: String, $paymentType: String, $official: Boolean, $note: [String], $supplier: ID, $items: [InputItems], $routes: [InputRoutes]) {
                        setApplication(budget: $budget, comment: $comment, term: $term, paymentType: $paymentType, official: $official, _id: $_id, note: $note, supplier: $supplier, items: $items, routes: $routes) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}