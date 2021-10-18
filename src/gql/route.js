import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getRoutes = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query($search: String!, $skip: Int) {
                        routes(search: $search, skip: $skip) {
                            _id
                            createdAt
                            roles
                            specialists {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getSpecialistsForRoute = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        specialistsForRoute {
                            _id
                            createdAt
                            login
                            name
                            role
                            status
                            phone
                            del
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setRoute = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $roles: [String]!, $specialists: [ID]) {
                        setRoute(_id: $_id, roles: $roles, specialists: $specialists) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addRoute = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($roles: [String]!, $specialists: [ID]!) {
                        addRoute(roles: $roles, specialists: $specialists) {
                            _id
                            createdAt
                            roles
                            specialists {_id name}
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteRoute = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteRoute(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}