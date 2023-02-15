# Configuration

Configuration can be made global, or slide-specific.

Global configuration is passed to the plugin using standard *reveal.js* configuration, with the `quiz` property:

```html
<script type="module">
    Reveal.initialize({
      quiz: {
        useTimer: true,
        defaultTimerDuration: 60,
      },
      plugins: [RevealQuizz],
    });
</script>
```

Slide-specific configuration is passed using `data-quiz-config-*` attributes on quiz slides.

```html
<section data-quiz 
         data-quiz-config-useTimer="true" 
         data-quiz-config-timerDuration="30">
# Who won the 2018 football world cup ?
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
