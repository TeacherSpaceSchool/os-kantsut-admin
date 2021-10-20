import { urlGQL } from '../redux/constants/other';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { getJWT } from './lib'
import { setContext } from 'apollo-link-context';
import { ApolloLink  } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client'

export const getClientGqlSsr = (req) => {
    const uploadLink = createUploadLink({
        uri: urlGQL,
        fetch: fetch,
        credentials: 'include'
    });
    const authLink = setContext((_, { headers }) => {
        let jwt = getJWT(req.headers.cookie)
        return {
            headers: {
                ...headers,
                authorization: jwt ? `Bearer ${jwt}` : '',
            }
        }
    });
    const link = ApolloLink.from([
        authLink,
        uploadLink
    ]);
    return new ApolloClient({
        ssrMode: true,
        link: link,
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all',
            },
        },

    })
}