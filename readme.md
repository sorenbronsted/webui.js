# Webui.js
Webui.js is a [Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 
implementation for [Single-Page-Application](https://en.wikipedia.org/wiki/Single-page_application) in a browser
 
![](https://github.com/sorenbronsted/webui.js/workflows/CI/badge.svg)

## Introduction
Writing the client part of a business application can be a complex piece of software, and the best way to tame such a 
complex thing is to have [high cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science)) for robustness, 
reliability, reusability. and [loose coupling](https://en.wikipedia.org/wiki/Loose_coupling) for encapsulation, 
so changes in one place does not affect other places.

Mvc architecture is implemented by using the [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) 
where the model and view are subjects and the controller is an observer.

## How is data mapped to html elements?
Imaging you have a person defined by this class:
```
class Person {
  constructor(name,addess,zipcode,town) {
    this.name = name;
    this.address = address;
    this.zipcode = zipcode;
    this.town = town;
  }

  ...    
}
```

Then `name` property is mapped to an html element like  this `input` element:
```
<input data-class="Person" data-property="name">
```
or all the properties is mapped to input elements in a form element like this:
```
<form data-class="Person">
  <input data-property="name">
  <input data-property="address">
  <input data-property="zipcode">
  <input data-property="town">
</form>
```
Here the html input elements inherits the `data-class` information from the parent element.
The view has html fragment which it is responsible for, and which is shown on demand from the controller. 

## How is data flowing?
The data flows between MVC elements by events to have loose coupling. The event is defined like this:
```
class Event {
  constructor(sender, name, body) {
    this.sender = sender;
    this.name = name;
    this.body = body;
  }
}
```

The view sends the following events when:
 * an input element has changed, the name of event is `propertyChanged`, with the name of the property 
 and the new value in the body
 * an anchor element is clicked, the name of the event is `click`, with url information in the body
 * a button is pressed, the name of the event is the `data-property` from the button 

The model sends the following events when:
 * data is available from an asynchronous/rest call, the name of the event is `ok` with the data in the body
 * the asynchronous/rest call fails, the name of the event is `fail` with error information in body

## How is the data flow controlled?
A controller overrides the `handleEvent` method and can thereby reacts to events send to it, and 
transforms them to method calls on the model or the view. 
Managing the state of the controller can be complex, so to help with this, you can use a state machine to do that.
The `BaseController` has a `StateMachine` which is populated with the basic start and input states. 

## How is the application controlled?
To manage the state of the application i done by the browsers location object, which the router reacts to. 
The router is a subject and all controllers listen for event from it, and the router also uses it to change the location. 
Every controller has an activation url and when there is a match between activation url and the url from the router, 
then the controller is active. When the url's does not match then the controller is not active. 
In this way you can control whether a controller shall react to events or not.

## More information
See [documentation](https://sorenbronsted.github.io/webui.js/index.html) for this project.