import { Config } from 'apollo-server'

export type Entity = Pick<Config, 'typeDefs' | 'resolvers'>
