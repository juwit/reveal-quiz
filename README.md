# reveal-quiz

reveal.js plugin that allows adding quizzes as slides.

![](site/capture.gif)

## features

* single-choice questions
* multiple-choice questions
* markdown in questions and answers
* answers explanations show after answer submission
* multicast & remote-control

## usage

Create a simple question slide in markdown:

```html
<section data-quiz>
# Who won the 2018 football world cup ?
- [x] France
- [ ] Germany
- [ ] Italy
- [ ] Brazil
</section>
```

The question itself should be a simple text, using a markdown title mark `#`.
The answers are written as Markdown task lists using `- [ ]`.
The checked answers (`- [x]`) are the valid ones.
If only one answer is valid, answers will be displayed as radio buttons, otherwise they will be displayed as check boxes.

An optional answers explanation can be added as a markdown blockquote using `>`, and will be displayed after the question was answered.

```html
<section data-quiz>
# Who is *Darth Sidious* master ?
- [ ] Darth Bane
- [ ] Darth Tenebrous
- [x] Darth Plagueis
> "Did you ever hear the Tragedy of Darth Plagueis the Wise?"
> - Sheev Palpatine, to Anakin Skywalker
</section>
```

## configuration

Configuration can be made global, or slide-specific.

Global configuration is passed to the plugin using standard *reveal.js* configuration, with the `quiz` property:

```html
<script type="module">
    import Reveal from './node_modules/reveal.js/dist/reveal.esm.js';
    import markdown from './node_modules/reveal.js/plugin/markdown/markdown.esm.js';
    
    import RevealQuizz from './node_modules/reveal-quiz/dist/reveal-quiz-bundle-esm.js';
    
    Reveal.initialize({
      quiz: {
        useTimer: true,
        defaultTimerDuration: 60,
      },
      plugins: [markdown, RevealQuizz],
    });
</script>
```

slide-specific configuration is passed using `data-quiz-config-*` attributes on quiz slides.

```html
<section data-quiz data-quiz-config-useTimer="true" data-quiz-config-timerDuration="30">
- Who won the 2018 football world cup ?
- [x] France
- [ ] Germany
- [ ] Italy
- [ ] Brazil
</section>
```

### available configuration properties

| global property   | slide property                     | default value | description                                         |
|-------------------|------------------------------------|---------------|-----------------------------------------------------|
| useTimer          | data-quiz-config-userTimer         | false         | set to `true` to activate a timer on questions      |
| timerDuration     | data-quiz-config-timerDuration     | 60            | the duration of the timer                           |
| randomizeAnswers  | data-quiz-config-randomizeAnswers  | false         | set to `true` to randomize the answers on questions |
