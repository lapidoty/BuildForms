
import React, { Component } from 'react';
import gql from "graphql-tag";
import {graphql, compose} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { BrowserRouter as Router , Link} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { browserHistory } from 'react-router';


const retrive = gql`
{
    forms{
    name
    formId
      fields{
        label
        kind
        data
      }
    }
  }`;

  const addNewFullFiledForm = gql`
mutation($formId: Int! , $fields: [inputField]!){
    createfullfiledForm(formId: $formId , fields: $fields ) 
}`;

class displayForm extends Component {
    createfullFiledFormDB = async (form , formId) => {
        console.log(Array.from(form.Form.values()))
        await this.props.createfullFiledFormDB({
          variables:{
            formId: formId,
            fields: Array.from(form.Form.values())
          }
        })
        browserHistory.goBack()
      };
    
	constructor(props){
        super(props);
        var myMap = new Map();
		this.state = {
            Form: myMap
		};
	}
 
    defaultTypes = (kind , label) => {
        switch(kind){
        case "email": 
            return "Enter a Email";
            break;
        case "color":
        this.state.Form.set( label , 
            {label: label,
             kind: '',
             Input_Name: '',
             data: "#000000"} );
            return "#000000";
            break;
        case "tel": 
            return "Enter a Phone";
            break;
        case "text": 
            return "text";
            break;
        case "number": 
            return "number";
            break;
    }
    }
	handleChange = (event) => {
		event.preventDefault();
    this.state.Form.set( event.target.name , 
        {label: event.target.name,
         kind: '',
         Input_Name: '',
         data: event.target.value} );
         console.log(event.target.value)
	};

	render() {
        const forms = this.props.retriveDB.forms;
        if(this.props.retriveDB.loading){
            return null;
          }
        const filterForm = forms.filter(form => form.formId == this.props.match.params.formId)
	    return (
        
                <center>
                    <h1>{filterForm[0].name} Form</h1>
                  <div>
                  
              {filterForm[0].fields.map((row , index) => {
            return (
                
                <div>
                   
                <TextField
                id={row.label}
               label={row.label}
                 name={row.label}
                 margin="normal"
                 multiLine={true}
                 defaultValue={this.defaultTypes(row.kind , row.label)}
                 type={row.kind}
                 InputLabelProps={{
                    shrink: true,
                  }}
					//value={this.state.Form}
					onChange={this.handleChange}
                 />
                 </div>
            );
          })}

          <Button 	label="Submit" variant="contained" color="default"
					primary={true}
					onClick={() => this.createfullFiledFormDB(this.state , filterForm[0].formId)}
				>
        Submit
        </Button>
        <Button 
					label="Cancel" variant="contained" color="default"
					onClick={browserHistory.goBack}
          style={{marginLeft: 10}}>
          Go Back
          </Button>
                  </div>
                  </center>
              
	 	);
	}
}

export default compose(graphql(retrive , {name:"retriveDB"}) , graphql(addNewFullFiledForm , {name:"createfullFiledFormDB"}))(displayForm);
