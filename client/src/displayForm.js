import React, { Component } from 'react';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { browserHistory } from 'react-router';
import Paper from '@material-ui/core/Paper';

/* Queries: */
const retrive = gql`
{
    forms {
      id
      formId
      name
      fields{
        label
        kind
      }
    }
      fullfiledForms{
      formId
      }
  }`;


const addNewFullFiledForm = gql`
mutation($formId: String! , $fields: [inputField]!){
    createfullfiledForm(formId: $formId , fields: $fields ) 
}`;

class DisplayForm extends Component {

    constructor(props) {
        super(props);
        var myMap = new Map();
        this.state = {
            Form: myMap
        };
    }

    // Function to be called when submit the Form
    createfullFiledFormDB = async (form, formId) => {
        console.log(Array.from(form.Form.values()))

        // Send the query to update the data base
        await this.props.createfullFiledFormDB({
            variables: {
                formId: formId,
                fields: Array.from(form.Form.values())
            }
        })

        // Return to Home Page
        browserHistory.goBack() 

        // Update the cache
        this.props.updateMethod(); 

    };

    defaultTypes = (kind, label) => {
        switch (kind) {
            case "email":
                return "Enter a Email";
            case "color":
                this.state.Form.set(label,
                    {
                        label: label,
                        kind: '',
                        Input_Name: '',
                        data: "#000000"
                    });
                return "#000000";
            case "tel":
                return "Enter a Phone";
            case "number":
                return "number";
            default:
                return "text";
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        this.state.Form.set(event.target.name,
            {
                label: event.target.name,
                kind: '',
                Input_Name: '',
                data: event.target.value
            });
    };

    render() {

        // Init local vars
        const parts = window.location.href.split('/');
        const lastSegment = parts.pop() || parts.pop();
        const forms = this.props.retriveDB.forms;
        const isLoading = this.props.retriveDB.loading

        if (isLoading) {
            return null;
        }

        const filterForm = forms.filter(form => form.formId === lastSegment)
        const currentForm = filterForm[0];
        const formName = currentForm.name;

        return (
            <center>
                <div style = {{ margin: "auto" , width: 300}}>
                <Paper>
                <h1>{formName} Form</h1>
                    <div>
                        {/* Display the form fields*/}
                    {currentForm.fields.map((row, index) => {
                        return (
                            <div key={index}>
                                <TextField
                                    id={row.label}
                                    label={row.label}
                                    name={row.label}
                                    margin="normal"
                                    defaultValue={this.defaultTypes(row.kind, row.label)}
                                    type={row.kind}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.handleChange}/>
                            </div>
                        );
                    })}
                    <br/>

                            <Button label="Submit" variant="contained" color="default"
                            onClick={() => this.createfullFiledFormDB(this.state, filterForm[0].formId)}>
                            Submit
                            </Button>

                            <Button label="Cancel" variant="contained" color="default"
                            onClick={browserHistory.goBack}>
                            Go Back
                            </Button>

                    <br/><br/>  
                </div>
                </Paper>
                </div>
            </center>

        );
    }
}

export default compose(graphql(retrive, { name: "retriveDB" }), graphql(addNewFullFiledForm, { name: "createfullFiledFormDB" }))(DisplayForm);
