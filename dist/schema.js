"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  enum SortOrder {
    ASC
    DESC
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    duration: String!
    outcome: String!
  }

  type Collection {
    id: ID!
    title: String!
    courses: [Course!]!
  }

  type Query {
    courses(limit: Int, sortOrder: SortOrder): [Course!]!
    course(id: ID!): Course
    collections: [Collection!]!
    collection(id: ID!): Collection
  }

  input AddCourseInput {
    title: String!
    description: String!
    duration: String!
    outcome: String!
  }

  input UpdateCourseInput {
    title: String
    description: String
    duration: String
    outcome: String
  }

  type Mutation {
    addCourse(input: AddCourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
exports.default = typeDefs;
