const { GraphQLServer } = require('graphql-yoga')
const{ request } = require('request');

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

const RECAPTCHA_SECRET_KEY="6LdpenAUAAAAAK63IoBWQTUzOCJDo-CUh712o2b7" 

const typeDefs = `
  type Query {
    hello(name: String): String!
    forms: [Form]
    formById(id: ID): [Form]
    fullfiledForms : [FullFiledForms]
    verification(req: String): String!
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

const verifyHumanity = (req) => {
  
  const d = Q.defer();
  const recaptchaResponse = req.body['g-recaptcha-response'];
 
 request.post('https://www.google.com/recaptcha/api/siteverify', {
    form: {
      secret: RECAPTCHA_SECRET_KEY,
      response: recaptchaResponse,
      remoteip: req.connection.remoteAddress
    }
  }, (err, httpResponse, body)=>{
    if(err) {
      d.reject(new Error(err));
    } else {
      const r = JSON.parse(body);
      if (r.success) {
        d.resolve(r.success);
      } else {
         d.reject(new Error());
     }
    }
  });
 
   return d.promise;
 }

const resolvers = {
  Query: {
    hello: (_, { req }) => { 
      verifyHumanity(req)
            .then(()=>{
              return "Succsess";
            })
             .catch(()=>{
               
                 // failure
                 res.status(400);
                 res.send({
                     error: 'Please verify that you\'re a human'
                 });
                 return "Failure";
              });
      
  },
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

