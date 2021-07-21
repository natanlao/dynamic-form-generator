# dynamic-form-generator

Given JSON description of a form, generates the form in HTML. Written with
React.

This was a coding challenge as part of the hiring process for a startup I'm
applying to. This is actually my first time using React. It's pretty cool.

## Run

```
npm install
npm run
```

You can do `npm test` to run Standard, but it will always fail since I never got
around to changing the tests from those provided by `create-react-app`.

## Timeline

Total time spent: about ten hours. The coding challenge noted an expectation of
two to three hours, but I exceeded the time limit (after discussion) given my
inexperience with these tools.

### Learning React

I have some experience with Javascript, but not React. To learn enough to
complete this challenge, I used these resources:

1. **Basic literacy** Ran through the React tutorial and concepts guide on
   [the React website](https://reactjs.org).

2. **Understanding common use cases, problems, pitfalls** Found the React
   subreddit and skimmed articles listed in the wiki. Skimmed top-ranked
   articles and comments mentioning React on Hacker News.

3. **Understanding common questions** Skimmed highest-voted React questions on
   Stack Overflow.

4. **Getting a hang of the syntax** Played around with the skeleton created by
   create-react-app.

Steps 2 and 3 were useful in building a general view of React, even if some of
the more technical stuff flew over my head without more experience.

This process took about 3 hours.

### Designing prototype

This process is largely documented in the commit history. In all, this took
about 7 hours.

I heavily leaned on the "Thinking in React" section of the React documentation.


## Discussion

### Validation

#### How about validation?

My implementation provides some degree of validation by leaning on HTML5's
validation features, which are generally available and can provide a consistent
validation experience [[1]][html5-form] [[2]][html5-input-types].

Client-side validation does not replace server-side validation. I would imagine
that a hypothetical backend implementing validation logic would use the same
schema used by this frontend to present the form (or vice versa, the point being
to maintain a single source of truth for the set of information the form is to
collect).

  [html5-form]: https://caniuse.com/forms
  [html5-input-types]: https://caniuse.com/input-email-tel-url


#### What happens if a field is empty?

If a field is empty, it is not represented in the form's output. It would be
trivial to represent empty form fields as `null` in the form's output, but I
decided against it since the presence of a field in the output can signal which
conditional fields were presented. (For example, if the `parental_consent`
checkbox is not shown to the user, it will be absent from the form's output.)

#### How can we dynamically set whether a field is required or not?

In a future implementation, a user could specify `"required": true` in the form
definition JSON to mark a field as required. This would be trivial to implement
client-side using the `required` attribute.

We might infer that fields we rely on for conditional evaluation (e.g., in the
provided example, `date_of_birth`) must be required, but I don't think they
necessarily have to be. It's possible that a form may care about a value only if
it is specified.

### Usability

#### How might we improve upon the design to make it an easier and more beautiful experience for users?

There are two kinds of users:

##### Developers (The People Making The Forms)

I would improve the developer experience by approaching the form definition JSON
in a different way. The `tag` and `type` properties of each field suggest a
leaky abstraction; ideally, the way we request data should be an implementation
detail, and a developer should only be concerned with the type of data they're
requesting. I would replace the `tag` and `type` properties with a single `type`
property which indicates the kind of data to be collected and hints at
validation (e.g. `email`, `phone`, `text`, `longtext`, `multiple-choice`,
`single-choice`, etc.), and manage that validation and presentation internally.

I would also add stronger validation features for the form definition JSON
itself, to, for example:

* verify that all `name` and `human_label` properties are unique and present,

* verify that all requisite fields of the `conditional` property are present,

* verify that any field required by `.conditional.name` is present, etc.

##### Users (The People Filling Out The Forms)

To improve the experience of those filling out forms, we might:

* Allow non-field instructional elements and cues to be specified in the form
  definition JSON to provide additional context in the form.

* Allow placeholder or example values to be specified in the form definition
  JSON.

* Add icons to form fields to hint at validations (e.g., an envelope icon
  could be displayed next to a field of type `email`).

* Pay special attention to accessibility concerns:
  - ensure all fields are labeled and readable with a screen reader,
  - use HTML validation over custom Javascript validation where possible
  - use `aria-*` attributes to hint at validation status when Javascript
    validation is unavoidable,
  - ensure that forms are easily navigable by keyboard,
  - prefer semantic markup, etc.

* Cache form input locally to prevent loss in the case of an accident, depending
  on the sensitivity of the data being collected.

* Improve the security of the forms, e.g. through CSRF protections.

### Styling

I'm not a great designer -- to make this project look passable, I used
[Pure.css](https://pure.css.io) and some CSS boilerplate I've collected over
some time that I use on my [personal website](https://natan.la). These styles
provide a degree of cross-browser consistency (thanks to
[Normalize.css](https://necolas.github.io/normalize.css/), used by Pure.css) and
make the form usable with little overhead.

### Input schema

A made two adjustments to the example input provided by the prompt:

* Functions are not permissible in JSON, so I converted the
  `conditional.show_if` function provided in the example input to a string.

* I modified the provided `conditional.show_if` function to compare a given date
  as a string by calling the `Date.toISODate` method.


## Resources used

All resources that I used to complete this challenge are listed in this README
or in the source code. Those resources include MDN, the React documentation, and
pages linked directly from those sources.
