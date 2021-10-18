import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getSubdivisions = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($division: ID, $search: String!, $skip: Int) {
                        subdivisions(division: $division, search: $search, skip: $skip) {
                            _id
                            createdAt 
                            division
                                {_id name}
                            name
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getFilterSubdivisions = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        filterSubdivision {
                           name
                           value
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteSubdivision = async(ids, division)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteSubdivision(_id: $_id) {
                             data
                        }
                    }`})
        return await getSubdivisions({division: division, ...(new SingletonStore().getStore().getState().app)})
    } catch(err){
        console.error(err)
    }
}

export const addSubdivision = async(element, subCategory)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {...element, subCategory: subCategory},
            mutation : gql`
                    mutation ($name: String!, $division: ID!) {
                        addSubdivision(name: $name, division: $division) {
                            _id
                            createdAt 
                            division
                                {_id name}
                            name
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setSubdivision = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {...element},
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $division: ID) {
                        setSubdivision(_id: $_id, name: $name, division: $division) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}