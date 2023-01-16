# reveal-quizz

reveal.js plugin that allows adding quizzes as slides.

## usage

Create a simple question slide in markdown:

```html
<section data-quizz>
- Who won the 2018 football world cup ?
- [x] France
- [ ] Germany
- [ ] Italy
- [ ] Brazil
</section>
```

The question itself should be a simple text.
The anwsers are written as Markdown task lists.
The checked answers are the valid ones.
If only one answer is valid, answers will be displayed as radio buttons, otherwise they will be displayed as check boxes.
