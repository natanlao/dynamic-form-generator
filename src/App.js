import React from 'react';
import logo from './logo.svg';
import './App.css';

class FormJSON extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.defaultValue};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onInputChange(event.target.value);
    console.log('foo');
  }

  render() {
    return (
      <form>
        <label>
          Input JSON
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
      </form>
    );
  }
}

class FormHTML extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log(this.props.fields.map(field => event.target.elements[field.name].value));
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
class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
    <label key={this.props.name}>
      {this.props.human_label}
      <input key={this.props.name}
             type={this.props.type}
             name={this.props.name}
             onChange={this.handleChange} />
    </label>
    );
  }
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
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {formdef: []};
  }

  // TODO: use standard naming convention
  handleInputChange(formdef) {
    this.setState({formdef: JSON.parse(formdef)});
  }

  render() {
    return (
      <div>
        <FormJSON
          defaultValue={JSON.stringify(default_input, null, 2)}
          onInputChange={this.handleInputChange} />
        <FormHTML fields={this.state.formdef} />
      </div>
    );
  }
}


export default DynamicForm;
