# Multiplex

*reveal-quiz* can multiplex presentations.

Multiplex is done using a server component, and a trainer and multiple trainees to follow the same slides, and answer the quizzes all at the same time.

``` mermaid
graph LR
  Trainer
  TraineeA[Trainee A]
  TraineeB[Trainee B]
  TraineeC[Trainee C]
  
  TraineeA -->|Follow slides| Trainer;
  TraineeB -->|Follow slides| Trainer;
  TraineeC -->|Follow slides| Trainer;
```

## Views

In a multiplex session, there are 3 views involved:

* admin view
    * The admin view show the current slide, as well as buttons to control the slides and quiz state. It can be considered as a *Speaker View*, and should be private to the trainer.
* trainer view
    * The trainer view show the current slide. This view can be shared to the Trainees on a dedicated screen for projection. 
* trainee view
    * The trainee view shows the current slide. In a multiplex session, the trainee view is locked, and the trainee cannot change slides. The trainee can follow the presentation on its own screen or device, and can also answer questions when the active slide is a question.


