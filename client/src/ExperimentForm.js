
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


const addNewForm = gql`
mutation($formId: Int! , $name: String! , $fields: [inputField]!){
  createForm(formId: $formId , name: $name , fields: $fields ) 
}`;


class ExperimentForm extends Component {
    createForm = async form => {
        await this.props.createFormDB({
          variables:{
            formId: Math.floor(Math.random() * (100 - 1)) + 1,
            name: form.Form_Name,
            fields: form.Form
          }
        })
      };

	constructor(props){
		super(props);
		this.state = {
			label: this.props.experiment ? this.props.experiment.label :'',
      Input_Name: this.props.experiment ? this.props.experiment.Input_Name:'',
      kind: this.props.experiment ? this.props.experiment.kind:'',
      Form_Name: this.props.experiment ? this.props.experiment.Form_Name:'',
      data: this.props.experiment ? this.props.experiment.data:'',
      Form: []
		};
	}
 
	handleChange = (event) => {
		event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
	};
   
	submit = ( event ) => {
		event.preventDefault();
		const field = {
            label: this.state.label.trim(),
            kind: this.state.kind.trim(),
            Input_Name: this.state.Input_Name.trim(),
            data: this.state.Input_Name.trim()
      
    }

    const refresfData = {
        label: this.props.experiment ? this.props.experiment.label :'',
      Input_Name: this.props.experiment ? this.props.experiment.Input_Name:'',
      kind: this.props.experiment ? this.props.experiment.kind:'',
      Form_Name: this.props.experiment ? this.props.experiment.Form_Name:'',
      data: this.props.experiment ? this.props.experiment.data:'',
      Form : this.state.Form.push(field)
    };
    
    this.setState({ refresfData });
  };


	render() {
    
	    return (
        <div>
          <center>
          <div>
			<form>
          <h1> Form Builder </h1> 
				<TextField
         id="label"
         label="Enter Label Name"
					name="label"
					value={this.state.label}
          onChange={this.handleChange}
          margin="normal"
					
			    /><br />
				<TextField
        id="Input Name"
        label="Enter Input Name"
					name="Input_Name"
					multiLine={true}
					value={this.state.Input_Name}
					onChange={this.handleChange}
					
			    /><br/>
          <TextField
        id="Input type"
        label="Enter Input type"
					name="kind"
					multiLine={true}
					value={this.state.kind}
					onChange={this.handleChange}
					
			    /><br/><br/>
				<Button 	label="Add Field" variant="contained" color="default"
					primary={true}
					onClick={this.submit}
				>
        Add Field
        </Button>
				<Button 
					label="Cancel" variant="contained" color="default"
					onClick={browserHistory.goBack}
          style={{marginLeft: 10}}>
          Cancel
          </Button>
         
			</form>
      </div>
      <br/>
      <div style = {{ margin: "auto" , width: 400}}>
      <Paper>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell  >Field Label</TableCell>
            <TableCell >Input Name</TableCell>
            <TableCell >Input type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.Form.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell >{row.label}</TableCell>
                <TableCell > {row.Input_Name}</TableCell>
                <TableCell > {row.kind}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
    </div>
    <div>
    <br/>
          <TextField
        id="Form Name"
        label="Enter Form Name"
					name="Form_Name"
					multiLine={true}
					value={this.state.Form_Name}
					onChange={this.handleChange}
					
			    /><br/><br/>
				<Button 	label="Done" variant="contained" color="default"
					primary={true}
					onClick={() => this.createForm(this.state)}
				>
        Done
        </Button>
      </div>
      </center>
    </div>
	 	);
	}
}

export default graphql(addNewForm , {name:"createFormDB"})(ExperimentForm);
