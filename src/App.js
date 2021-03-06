import React from 'react';

class DynamicForm extends React.Component {
  constructor (props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = { formdef: [], error: null };
  }

  handleInputChange (formdef) {
    this.setState({ error: null });
    let value;
    try {
      value = JSON.parse(formdef);
    } catch (e) {
      this.setState({ error: e.message });
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
        {this.state.error
          ? this.state.error
          : <FormHTML fields={this.state.formdef} />}
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
    // A checkgbox is either off or on, never null
    this.state = { value: this.props.type === 'checkbox' ? 'off' : '' };
    this.handleChange = this.handleChange.bind(this);
    this.props.onInputChange(this.state.value);
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

// This pattern has a brittle coupling; it assumes that field.type will
// correspond to a valid `type` attribute of the given tag. The actual tag
// used should be an implementation detail; instead of choosing both `input`
// and `type`, a developer ought to only have to choose a `type`.
const fields = {
  input: InputField
};

export default DynamicForm;
