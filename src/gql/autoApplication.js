import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getAutoApplications = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query($skip: Int) {
                        autoApplications(skip: $skip) {
                            _id
                            createdAt
                            roles
                            division {_id name suppliers {_id name} staffs {_id name}}
                            supplier {_id name}
                            specialist {_id name}
                            items {item name type triggerCount triggerDays count unit GUID}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setAutoApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $roles: [String]!, $division: ID, $supplier: ID, $specialist: ID, $items: [InputItemAutoApplication]!) {
                        setAutoApplication(_id: $_id, roles: $roles, division: $division, specialist: $specialist, supplier: $supplier, items: $items) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addAutoApplication = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($roles: [String]!, $division: ID!, $supplier: ID!, $specialist: ID!, $items: [InputItemAutoApplication]!) {
                        addAutoApplication(roles: $roles, division: $division, supplier: $supplier, specialist: $specialist, items: $items) {
                            _id
                            createdAt
                            roles
                            division {_id name suppliers {_id name} staffs {_id name}}
                            supplier {_id name}
                            specialist {_id name}
                            items {item name type triggerCount triggerDays count unit GUID}
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteAutoApplication = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteAutoApplication(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}