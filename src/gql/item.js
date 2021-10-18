import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getItems = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($category: ID, $search: String!, $skip: Int) {
                        items(category: $category, search: $search, skip: $skip) {
                            _id
                            createdAt 
                            lastPrice {name value}
                            category
                                {_id name}
                            name
                            GUID
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getFilterItem = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        filterItem {
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

export const unloadingItem = async({document}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .mutate({
                variables: {document: document},
                mutation: gql`
                    mutation ($document: Upload!) {
                        unloadingItem(document: $document) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getItemsTrash = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!) {
                        itemsTrash( search: $search) {
                            _id
                            createdAt 
                            category
                                {_id name}
                            name
                            lastPrice {name value}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getItem = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query (_id: ID!) {
                        item(_id: $_id) {
                            _id
                            createdAt 
                            category
                                {_id name}
                            name
                            lastPrice {name value}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteItem = async(ids, subCategory)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteItem(_id: $_id) {
                             data
                        }
                    }`})
        return await getItems({subCategory: subCategory, ...(new SingletonStore().getStore().getState().app)})
    } catch(err){
        console.error(err)
    }
}

export const addItem = async(element, subCategory)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: {...element, subCategory: subCategory},
            mutation : gql`
                    mutation ($name: String!, $category: ID!) {
                        addItem(name: $name, category: $category) {
                            _id
                            createdAt 
                            category
                                {_id name}
                            name
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setItem = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {...element},
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $category: ID) {
                        setItem(_id: $_id, name: $name, category: $category) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}