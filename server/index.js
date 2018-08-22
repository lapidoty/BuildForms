const { GraphQLServer } = require('graphql-yoga')

// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test4', { useNewUrlParser: true });

const Field = {
  label: String,
  kind: String,
  data: String
};

const Form = mongoose.model('Form', {
  formId: String,
  name: String,
  fields: [Field],
});

const FullFiledForms = mongoose.model('FullFiledForms', {
  formId: String,
  fields: [Field],
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    forms: [Form]
    formById(id: ID): [Form]
    fullfiledForms : [FullFiledForms]
  }

  input inputField{
    label: String!
    kind: String!
    data: String!
    Input_Name: String!
    
  }

  type Field{
    id: ID!
    label: String!
    kind: String!
    data: String!
    Input_Name: String!
  }
  
  type Form{
      id: ID!
      formId: String!
      name: String!
      fields: [Field]!
  }

  type FullFiledForms{
    id: ID!
    formId: String!
    fields: [Field]!
}
  type Mutation{
      createForm(formId: String! , name: String! , fields: [inputField]! ): String
      createfullfiledForm(formId: String! , fields: [inputField]!): String
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    forms: () => Form.find(),
    formById: (id) => Form.findById(id),
    fullfiledForms: () => FullFiledForms.find()
  },
  Mutation: {
    createForm: async (_, { formId, name, fields }) => {
      const form = new Form({ formId, name, fields });
      await form.save();
      return name;
    },
    createfullfiledForm: async (_, { formId, fields }) => {
      const form = new FullFiledForms({ formId, fields });
      await form.save();
      return form;
    }
  }
}

const server = new GraphQLServer({
  typeDefs, resolvers, resolverValidationOptions: {
    requireResolversForResolveType: false
  }
})

mongoose.connection.once('open', function () {
  server.start(() => console.log('Server is running on localhost:4000'))
});

