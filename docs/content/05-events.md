# Events

!!! info 
    This section is intended for developers.


*reveal-quiz* makes an heavy use of *reveal.js* events.

Events are mainly used to implement multiplexing quizzes, but any other plugin can receive events.

This section lists all the events that are used by the plugin.

Events may be emitted by other user roles, in that case they transit throught the multiplex.

| Event                    | Emitter        | Listener | Description                                                        |
|--------------------------|----------------|----------|--------------------------------------------------------------------|
| `quiz-question-answered` | Trainee        | Admin    | Used to notify the Admin that a trainee has answered a question    |
| `quiz-show-responses`    | Trainer, Admin | Trainee  | Used to show the responses of all Trainees                         |
| `quiz-lock`              | Admin          | Trainee  | Used to lock the Trainees controls                                 |
| `quiz-unlock`            | Admin          | Trainee  | Used to unlock the Trainees controls                               |

## `quiz-question-answered`

This event is dispatched when a Trainee answers a question

!!! payload
    The payload of the event holds the answered question.
    ```
    {"data": <question> }
    ```

## `quiz-show-response`

This event is dispatched when a Trainee answers a question

!!! payload
    The payload of the event holds the id of the questions whose answers should be displayed.
    ```
    {"data": { "id": <questionId> } }
    ```

## `quiz-lock`

This event is dispatched when an Admin locks the Trainees slides.
It is also dispatched by default when a Trainee connects to a slide.

!!! payload
    This event does not have a payload

## `quiz-unlock`

This event is dispatched when an Admin unlocks the Trainees slides.
It is also dispatched by default when a Trainee connects to a slide.

!!! payload
    This event does not have a payload
