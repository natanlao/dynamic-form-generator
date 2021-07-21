import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// TODO: This pattern has a brittle coupling, assuming that field.type will
// correspond to a valid `type` attribute of the given tag. The actual tag
// used should be an implementation detail; instead of choosing both `input`
// and `type`, a developer ought to only have to choose a `type`.
const fields = {
  "input": InputField,
};

class DynamicForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log(this);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* TODO: Is there a way to use JSX here? */}
        {this.props.fields.map(field => React.createElement(fields[field.tag], field, null))}
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// TODO: How can I make this "private"?
// TODO: React is complaining about a key still
function InputField(props) {
  return (
    <label key={props.name}>
      {props.human_label}
      <input key={props.name} type={props.type} name={props.name} />
    </label>
  );
}


const default_input = [
  {
    "tag": "input",
    "name": "first_name",
    "type": "text",
    "human_label": "First Name"
  }, {
    "tag": "input",
    "name": "last_name",
    "type": "text",
    "human_label": "Last Name"
  }, {
    "tag": "input",
    "name": "email",
    "type": "email",
    "human_label": "Email Address"
  }, {
    "tag": "input",
    "name": "phone_number",
    "type": "text",
    "human_label": "Phone Number"
  }, {
    "tag": "input",
    "name": "job_title",
    "type": "text",
    "human_label": "Job Title"
  }, {
    "tag": "input",
    "name": "date_of_birth",
    "type": "date",
    "human_label": "Date of Birth"
  }, {
    "tag": "input",
    "name": "parental_consent",
    "type": "checkbox",
    "human_label": "Parental Consent",
    "conditional": {
      "name": "date_of_birth",
      "show_if": (value) => {
        const now = new Date();
          return value >= new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
      }
    }
  }
]

ReactDOM.render(
  <React.StrictMode>
    <DynamicForm fields={default_input} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
