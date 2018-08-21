
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

const rows = gql`
{
    fullfiledForms{
    formId
      fields{
        label
        kind
        data
      }
    }
  }`;

  
class displaySubmits extends Component {
	render() {
        const {data: {loading , fullfiledForms}} = this.props;
            if(loading){
                return null;
                }
            const filterForm = fullfiledForms.filter(form => form.formId == this.props.match.params.formId)
            if(filterForm.length==0)
                return(
                <center>
                    <h1>Did Not Submit Yet</h1>
                    </center>
                );
	        return (
        
                <center>
                    <h1>{filterForm[0].formId} Form</h1>
                  <div>
                
      <div style={{ display: "flex"}}>
        <div style = {{ margin: "auto" }}>
        <Paper>
      <Table>
        <TableHead>
          <TableRow>
          {filterForm[0].fields.map(row => {
            return (
          <TableCell>{row.label}</TableCell>
            );})}
          </TableRow>
        </TableHead>
        <TableBody>
          {filterForm.map(row => {
            return (
              <TableRow key={row.id}>
                 {row.fields.map(row => {
                    return (
                    <TableCell>{row.data}</TableCell>
                        );})}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
    </div>
    </div>
    </div>
    <br />
				<Button 
					label="Cancel" variant="contained" color="default"
					onClick={browserHistory.goBack}
          style={{marginLeft: 10}}>
          Go Back
          </Button>
    </center>
	 	);
	}
}

export default graphql(rows)(displaySubmits);
