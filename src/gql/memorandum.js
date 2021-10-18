import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getMemorandums = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $filter: String!, $sort: String!, $date: String!, $skip: Int!) {
                        memorandums(search: $search, filter: $filter, sort: $sort, date: $date, skip: $skip) {
                            _id
                            createdAt
                            status
                            number
                            name
                            dateClose
                            comment
                            term
                            who {_id name}
                            whom {_id name}
                            notifiables {_id name}
                            routes {user {_id} confirmation cancel comment}
                            approve
                            completed
                            checked
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getMemorandum = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        memorandum(_id: $_id) {
                            _id
                            createdAt
                            status
                            number
                            name
                            comment
                            note
                            term
                            who {_id name}
                            whom {_id name}
                            notifiables {_id name}
                            routes {user {_id} confirmation cancel comment}
                            approve
                            completed
                            dateClose
                            checked
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getUnloadingMemorandum = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($_id: ID!) {
                        unloadingMemorandum(_id: $_id) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteMemorandum = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteMemorandum(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addMemorandum = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!, $comment: String!, $note: [String], $term: Date!, $whom: ID!, $notifiables: [ID]!, $routes: [ID]!) {
                        addMemorandum(name: $name, comment: $comment, note: $note, term: $term, whom: $whom, notifiables: $notifiables, routes: $routes) {
                            data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setMemorandum = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $comment: String, $note: [String], $term: Date, $routes: [InputRoutes]!, $completed: Boolean, $checked: Boolean) {
                        setMemorandum(_id: $_id, name: $name, comment: $comment, note: $note, term: $term, routes: $routes, completed: $completed, checked: $checked) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}