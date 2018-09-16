
import React, { Component } from 'react';
import gql from "graphql-tag";
import { graphql , compose} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { browserHistory } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ReCAPTCHA from "react-google-recaptcha";

/* Queries: */
const addNewForm = gql`
mutation($formId: String! , $name: String! , $fields: [inputField]!){
  createForm(formId: $formId , name: $name , fields: $fields ) 
}`;

const req = gql`
query hello($req: String!){
    hello(req: $req)
  }`;


class ExperimentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ver: false,
      label: '',
      Input_Name: '',
      kind: '',
      Form_Name: '',
      data: '',
      Form: []
    };
  }

// Function to be called when submit the *Form*
  createForm = async form => {
    await this.props.createFormDB({
      variables: {
        formId: '_' + Math.random().toString(36).substr(2, 9), // Uniqe key function
        name: form.Form_Name,
        fields: form.Form
      }
    })
    

    // Update the cache
    this.props.updateMethod();

    // Return to Home Page
    browserHistory.goBack()
  };

  verification = async req => {
    console.log(req)
    await this.props.hello({
      variables: {
        req: req
      }
    }).then(()=> console.log("sueccess"))
    
  };

  onChange(value) {
    //this.verification(value)

  }

    // Update the contet of the new to come field
  handleChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  // Function to be called when submit the *Field*
  submit = (event) => {
    event.preventDefault();

    const field = {
      label: this.state.label.trim(),
      kind: this.state.kind.trim(),
      Input_Name: this.state.Input_Name.trim(),
      data: this.state.Input_Name.trim()

    }
    const refresfData = {
      Form: this.state.Form.push(field)
    };

    // Reset fields
    this.setState({ label: '', kind: '', Input_Name: '' })
    this.setState({ refresfData });
  };


  render() {
    return (
      <div style={{ margin: "auto", width: 400 }}>
        <Paper>
          <div>
            <center>
              <div>
                <form>
                  <h1> Form Builder </h1>

                  {/* Create the properties of new field*/}
                  <TextField
                    id="label"
                    label="Enter Label Name"
                    name="label"
                    value={this.state.label}
                    onChange={this.handleChange}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  /><br />
                  <TextField
                    id="Input Name"
                    label="Enter Input Name"
                    name="Input_Name"
                    value={this.state.Input_Name}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  /><br />
                  <div style={{ margin: "auto", width: 180 }}>
                    <FormControl fullWidth={true}>
                      <InputLabel shrink={true} >Type</InputLabel>
                      <Select value={this.state.kind} onChange={this.handleChange}
                        inputProps={{
                          name: 'kind',
                          id: 'Input type',
                        }} >
                        <MenuItem value={"text"}>text</MenuItem>
                        <MenuItem value={"tel"}>tel</MenuItem>
                        <MenuItem value={"number"}>number</MenuItem>
                        <MenuItem value={"email"}>email</MenuItem>
                        <MenuItem value={"date"}>date</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <br /><br />

                  <Button label="Add Field" variant="contained" color="default" onClick={this.submit}>                   
                    Add Field
                  </Button>

                  <Button
                    label="Cancel" variant="contained" color="default" onClick={browserHistory.goBack}>
                    Cancel
                  </Button>

                </form>
              </div>
              <br />

              {/* Update the table of the submmited fields*/}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell  >Field Label</TableCell>
                    <TableCell >Input Name</TableCell>
                    <TableCell >Input type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.Form.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell >{row.label}</TableCell>
                        <TableCell > {row.Input_Name}</TableCell>
                        <TableCell > {row.kind}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Submit new form*/}
              <div>
                <br />
                <TextField
                  id="Form Name"
                  label="Enter Form Name"
                  name="Form_Name"
                  value={this.state.Form_Name}
                  onChange={this.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                /><br /><br />
                <ReCAPTCHA
    sitekey="6LdpenAUAAAAAOVunp7WcVaD9VdFV-7i-kqhnrRi"
    onChange={this.verification}
  />
   /><br /><br />
                <Button label="Done" variant="contained" color="default" onClick={() => this.createForm(this.state)}>
                  Done
                </Button>
              <br /><br />
              </div>
            </center>
          </div>
        </Paper>
      </div>
    );
  }
}

export default compose(graphql(addNewForm, { name: "createFormDB" }) , graphql(req, { name: "hello" }))(ExperimentForm);
