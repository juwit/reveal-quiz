# Usage

Creating a question in *reveal-quiz* is done using a custom *data* attribute, and markdown content.

## Markdown Structure

The following Markdown structure is expected by *reveal-quiz* to successfully create questions:

```markdown
# question title
- [ ] answer 1
- [x] answer 2
- [ ] answer 3
- [ ] answer 4
> explanation line 1
> explanation line 2
```

The question title should be a simple line of text, using a markdown title mark `#`.

The answers are written as Markdown task lists using `- [ ]`.
The checked answers (`- [x]`) are the valid ones, unchecked answers (`- [ ]`) are invalid ones.
Any number of answers, greater than 2 can be provided.

An optional answers explanation can be added as a markdown blockquote using `>`, and will be displayed after the question was answered.
The explanation can span on multiple lines.

## HTML section

The markdown should be placed in a HTML *section*.
Upon startup, *reveal-quiz* looks for sections with the `data-quiz` attribute.

```html
<section data-quiz>
    # question title
    - [ ] answer 1
    - [x] answer 2
</section>
```

The markdown is trimmed of whitespaces upon parsing, so indentation of the markdown content inside the section doesn't matter.

## Single-Choice question

A single-choice question is created when the markdown structure only contains a valid answer, such as in the following example:

```html
<section data-quiz>
    # Who is Darth Sidious master ?
    - [ ] Darth Bane
    - [ ] Darth Tenebrous
    - [x] Darth Plagueis
</section>
```

## Multiple-Choice question

A multiple-choice question is created when the markdown structure contains more than one valid answer, such as in the following example:

```html
<section data-quiz>
    # Which of those ships are used by the Rebel Alliance ?
    - [x] X-Wing fighter
    - [ ] TIE Fighter
    - [x] Y-Wing
    - [x] Tantive IV
</section>
```
