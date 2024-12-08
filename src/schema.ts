import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Course {
    id: ID!
    title: String!
    description: String!
    duration: String!
    outcome: String!
    userId: Int! 
  }

  type Collection {
    id: ID!
    name: String!
    courses: [Course]
  }

  type Query {
    courses(limit: Int, sortOrder: String): [Course]
    course(id: ID!): Course
    collections: [Collection]
    collection(id: ID!): Collection
  }

  input CourseInput {
    title: String!
    description: String!
    duration: String!
    outcome: String!
  }

type AuthPayload {
  token: String!
  userId: Int!
}

type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): String 
  }
`;
