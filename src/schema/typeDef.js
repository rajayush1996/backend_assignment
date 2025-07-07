import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum SortOrder {
    ASC
    DESC
  }

  enum EmployeeSortField {
    NAME
    AGE
    CLASS
    ATTENDANCE
  }

  input EmployeeSortInput {
    field: EmployeeSortField!
    order: SortOrder! = ASC
  }

  type PageInfo {
    page: Int!
    limit: Int!
    totalItems: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type EmployeeConnection {
    items: [Employee!]!
    pageInfo: PageInfo!
  }

  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Int!
  }

  type User {
    id: ID!
    username: String!
    role: String!
    token: String
  }

  type Query {
    employees(
      page: Int = 1,
      limit: Int = 20,
      sort: EmployeeSortInput,
      filter: String
    ): EmployeeConnection!

    employee(id: ID!): Employee
    me: User
  }

  input NewEmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Int!
  }

  input UpdateEmployeeInput {
    name: String
    age: Int
    class: String
    subjects: [String!]
    attendance: Int
    id: ID! 
  }

  type Mutation {
    login(username: String!, password: String!): User
    addEmployee(input: NewEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;
