import React, { Component } from 'react';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
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
    const { data: { loading, fullfiledForms } } = this.props;
    if (loading) {
      return null;
    }
    const filterForm = fullfiledForms.filter(form => form.formId === this.props.match.params.formId)
    if (filterForm.length === 0)
      return (
        <center>
          <h1>Did Not Submit Yet</h1>
          <Button
            label="Cancel" variant="contained" color="default"
            onClick={browserHistory.goBack}
            style={{ marginLeft: 10 }}>
            Go Back
          </Button>
        </center>
      );
    return (

      <center>
        <h1>Form Submissions</h1>
        <div>

          <div style={{ display: "flex" }}>
            <div style={{ margin: "auto" }}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      {filterForm[0].fields.map((row, index) => {
                        return (
                          <TableCell key={index}>{row.label}</TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterForm.map((row, index1) => {
                      return (
                        <TableRow key={index1}>
                          {row.fields.map((row, index2) => {
                            return (
                              <TableCell key={index2}>{row.data}</TableCell>
                            );
                          })}
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
          style={{ marginLeft: 10 }}>
          Go Back
          </Button>
      </center>
    );
  }
}

export default graphql(rows)(displaySubmits);
