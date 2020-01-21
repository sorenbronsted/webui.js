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
The model and view communicates with the controller by passing events to it, and the controller takes action 
upon the received event. 
The model acts a proxy for some persistent domain entity and holds a list of these entities. 
The view has a html fragment and has an id of an element where to it attaches it self when shown.

A client typical has many controllers, views and models and to orchestrates the client though links and/or menus, 
you need to control which controllers is active at a given time. One way to do this, is to make the controller 
dependent on the information in the browsers location object, so when the location object changes each controller 
knows if it should react or not.

## Overview
The best way to explain the webui.js usages is to make and example which brings together i necessary classes, 
so checkout the demo-webui.js repo.
If you need does not fit this this way of making an application, there other extends points to use, but then
your also need to make more work.