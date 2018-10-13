const { GraphQLServer } = require('graphql-yoga')
var fs = require('fs')
var https = require("https")
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true });

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


var options = {
  host: "reports4u.bgu.ac.il",
    path: "/reports/rwservlet?cmdkey=PROD&server=rep_aristo4stu4_FRHome1&report=acrr008w&desformat=pdf&DESTYPE=cache&P_YEAR=2019&P_SEMESTER=1&P_INSTITUTION=0&P_DEGREE_LEVEL=1&P_DEPARTMENT=373&P_GLOBAL_COURSES=2&P_PATH=&P_SPEC=&P_YEAR_DEGREE=&P_SORT=1&P_WEB=1&P_SPECIAL_PATH=0&P_KEY=",
    method: "GET"
};

var req = https.request(options, function(res) {
      var resBody="";
      res.setEncoding("UTF-8")
      res.once('data', function(chunk) {
    });

    res.on('data', function(chunk) {
      resBody+=chunk
    });

    res.on("end" , function(){
        fs.writeFile("ex.pdf" , resBody , function (err){
            if(err){
                throw err;
            }
            console.log("done")
        });
    } );
  });

  req.end()

mongoose.connection.once('open', function () {
  server.start(() => console.log('Server is running on localhost:4000'))
});

