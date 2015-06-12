import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';

class Checkbox extends BaseComponent {
  displayName: 'Semantic Checkbox'

  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked || false,
      tabIndex: props.tabIndex || 0,
      ariaLabel: props.ariaLabel,
      onChange: props.onChange
    };

    this._bind('handleChange', 'notify');
  }

  handleChange() {
    React.findDOMNode(this.refs.notify).click();
  }

  notify() {
    const checked = !this.state.checked;

    typeof (this.state.onChange) === 'function'
      && this.state.onChange(checked);

    this.setState({checked: checked});
  }

  render() {
    return (
      <div
        className="ui toggle checkbox"
        role="checkbox"
        onClick={this.notify}
        tabIndex={this.state.tabIndex}
      >
        <input
          type="checkbox"
          ref="notify"
          checked={this.state.checked}
          onChange={this.handleChange}
          aria-label={this.state.ariaLabel}
        />
        <label>{this.props.children}</label>
      </div>
    );
  }
}

export default Checkbox;

