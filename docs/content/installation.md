# Installation

*reveal-quiz* bundles are published on Github Pages, and can be used directly without having to update your project.

## With plain old Javascript

Add the following script import in your HTML:

```html
<script src="https://juwit.github.io/reveal-quiz/dist/reveal-quiz-bundle.js"></script>
```

Add `RevealQuiz` to the list of *reveal.js* plugins:

```html
<script>
    Reveal.initialize({
        plugins: [RevealMarkdown, RevealHighlight, RevealQuiz],
    });
</script>
```

## With Javascript modules

When using Javascript modules, directly import the `reveal-quiz-bundle-esm.js` bundle

```html
<script type="module">
    import Reveal from 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/reveal.esm.min.js';
    import markdown from 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/plugin/markdown/markdown.esm.min.js';

    // use module import
    import * as RevealQuiz from 'https://juwit.github.io/reveal-quiz/dist/reveal-quiz-bundle-esm.js';

    Reveal.initialize({
        quiz: {
            timerDuration: 30,
            useTimer: false,
        },
        plugins: [markdown, RevealQuiz],
    });
</script>
```
