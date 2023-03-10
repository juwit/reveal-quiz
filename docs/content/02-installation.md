# Installation

*reveal-quiz* bundles are published on Github Pages, and can be used directly without having to update your project.

## With plain old Javascript

Add the following script import in your HTML and add `RevealQuiz` to the list of *reveal.js* plugins:

```html
<script src="https://juwit.github.io/reveal-quiz/dist/reveal-quiz-bundle.js"></script>

<script>
    Reveal.initialize({
        plugins: [RevealQuiz],
    });
</script>
```

## With Javascript modules

When using Javascript modules, directly import the `reveal-quiz-bundle-esm.js` bundle

```html
<script type="module">
    import Reveal from 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/reveal.esm.min.js';

    // use module import
    import * as RevealQuiz from 'https://juwit.github.io/reveal-quiz/dist/reveal-quiz-bundle-esm.js';

    Reveal.initialize({
        plugins: [RevealQuiz],
    });
</script>
```
