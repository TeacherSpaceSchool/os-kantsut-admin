import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getFaqs = async({search: search}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {search: search},
                query: gql`
                    query ($search: String!) {
                        faqs(search: $search) {
                            _id
                            url
                            title
                            video
                            createdAt
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteFaq = async(ids)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteFaq(_id: $_id) {
                             data
                        }
                    }`})
        return await getFaqs(new SingletonStore().getStore().getState().app)
    } catch(err){
        console.error(err)
    }
}

export const addFaq = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($file: Upload, $title: String!, $video: String) {
                        addFaq(file: $file, title: $title, video: $video) {
                             data
                        }
                    }`})
        return await getFaqs(new SingletonStore().getStore().getState().app)
    } catch(err){
        console.error(err)
    }
}

export const setFaq = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $file: Upload, $title: String, $video: String) {
                        setFaq(_id: $_id, file: $file, title: $title, video: $video) {
                             data
                        }
                    }`})
        return await getFaqs(new SingletonStore().getStore().getState().app)
    } catch(err){
        console.error(err)
    }
}