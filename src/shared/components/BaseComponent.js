import React from 'react';

export default class ExampleComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }
}

// ref: http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
