import React from 'react';

class DynamicForm extends React.Component {
  constructor (props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = { formdef: [] };
  }

  handleInputChange (formdef) {
    // TODO: Spin this out for more robust validation
    // TODO: Add warning
    let value;
    try {
      value = JSON.parse(formdef);
    } catch (e) {
      console.log(e);
      value = [];
    } finally {
      this.setState({ formdef: value });
    }
  }

  render () {
    return (
      <>
        <FormJSON
          defaultFormDefinition={JSON.stringify(defaultFormDef, null, 2)}
          onInputChange={this.handleInputChange}
        />
        <hr />
        <FormHTML fields={this.state.formdef} />
      </>
    );
  }
}

class FormJSON extends React.Component {
  constructor (props) {
    super(props);
    this.state = { formdef: this.props.defaultFormDefinition };
    // TODO: Is this the best way to do this?
    this.props.onInputChange(this.state.formdef);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    this.setState({ formdef: event.target.value });
    this.props.onInputChange(event.target.value);
  }

  render () {
    return (
      <form className='pure-form pure-form-stacked'>
        <label>
          Form definition JSON
          <textarea
            value={this.state.formdef}
            onChange={this.handleChange}
          />
        </label>
      </form>
    );
  }
}

class FormHTML extends React.Component {
  constructor (props) {
    super(props);
    this.state = { fields: {} };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleSubmit (event) {
    console.log(this.state.fields);
    event.preventDefault();
  }

  handleFieldChange (name, value) {
    // https://stackoverflow.com/a/171256/317076
    // https://stackoverflow.com/a/19837961/317076
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  render () {
    return (
      <form className='pure-form pure-form-stacked' onSubmit={this.handleSubmit}>
        {
          this.props.fields.map(field => {
            const props = {
              ...field,
              key: field.name,
              onInputChange: (val) => { this.handleFieldChange(field.name, val); }
            };

            // TODO: validate if has .conditional but not .conditional.name, etc.
            let display = true;
            if ('conditional' in field) {
              const arg = { [field.conditional.name]: '', ...this.state.fields }[field.conditional.name];
              // Famous last words:
              // eslint-disable-next-line
              const show_if = Function('"use strict"; return (' + field.conditional.show_if + ')')();
              display = show_if(arg);
            }

            if (display) {
              return React.createElement(fields[field.tag], props, null);
            } else {
              return null;
            }
          })
        }
        <button className='pure-button' type='submit'>Submit</button>
      </form>
    );
  }
}

class InputField extends React.Component {
  constructor (props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    this.setState({ value: event.target.value });
    this.props.onInputChange(event.target.value);
  }

  render () {
    return (
      <label>
        {this.props.human_label}
        <input
          type={this.props.type}
          name={this.props.name}
          onChange={this.handleChange}
        />
      </label>
    );
  }
}

const defaultFormDef = [
  {
    tag: 'input',
    name: 'first_name',
    type: 'text',
    human_label: 'First Name'
  }, {
    tag: 'input',
    name: 'last_name',
    type: 'text',
    human_label: 'Last Name'
  }, {
    tag: 'input',
    name: 'email',
    type: 'email',
    human_label: 'Email Address'
  }, {
    tag: 'input',
    name: 'phone_number',
    type: 'text',
    human_label: 'Phone Number'
  }, {
    tag: 'input',
    name: 'job_title',
    type: 'text',
    human_label: 'Job Title'
  }, {
    tag: 'input',
    name: 'date_of_birth',
    type: 'date',
    human_label: 'Date of Birth'
  }, {
    tag: 'input',
    name: 'parental_consent',
    type: 'checkbox',
    human_label: 'Parental Consent',
    conditional: {
      name: 'date_of_birth',
      show_if: '(value) => { const now = new Date(); return value >= new Date(now.getFullYear() - 13, now.getMonth(), now.getDate()).toISOString(); }'
    }
  }
];

// TODO: This pattern has a brittle coupling, assuming that field.type will
// correspond to a valid `type` attribute of the given tag. The actual tag
// used should be an implementation detail; instead of choosing both `input`
// and `type`, a developer ought to only have to choose a `type`.
const fields = {
  input: InputField
};

export default DynamicForm;
