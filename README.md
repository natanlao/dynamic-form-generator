# dynamic-form-generator


## Timeline

Total time spent:

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
about 1.5 hours (so far!).

I heavily leaned on the "Thinking in React" section of the React documentation.


## Discussion

### Styling

I'm not a great designer -- to make this project look passable, I used
[Pure.css](https://pure.css.io) and some CSS boilerplate I've collected over
some time that I use on my [personal website](https://natan.la). These styles
provide a degree of cross-browser consistency (thanks to
[Normalize.css](https://necolas.github.io/normalize.css/), used by Pure.css) and
make the form usable with little overhead, though it's a little bland.

### Input schema

Functions are not permissible in JSON, so I converted the `conditional.show_if`
function provided in the example input to a string.


## TODO

- Static type checking / linting
- Accessibility!
- Note: SSOT for backend and frontend processing of forms
- HTML validation?
- Note: should field.name be unique? do we enforce this?
- Move logic back into App.js?
- Talk about why choosing uncontrolled components for forms
- Talk about example input; does it make sense for developers to dictate
  attributes in that way?
- Referenced MDN as a resource
- Talk about modifications to input schema wrt conditionals (string in JSON
  inst of func)
- Consulted ESLint
- .show_if needs .toISODate for string comparison

