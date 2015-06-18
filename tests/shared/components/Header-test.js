'use strict';

import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react/addons';
import HeaderComponent from 'src/shared/components/HeaderComponent';
import stubRouterContext from 'tests/utils/stub-router-context.jsx';

describe('App', () => {

  jsdom();
  const TestUtils = React.addons.TestUtils;

  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('Header Test', () => {

    const Header = stubRouterContext(HeaderComponent);
    const _header = TestUtils.renderIntoDocument(<Header />);
    const renderedItems = TestUtils.scryRenderedDOMComponentsWithTag(_header, 'a'),
    itemCount = renderedItems.length;

    expect(itemCount).toBe(6);

    expect(React.findDOMNode(renderedItems[0]).textContent).toEqual('Home');
    expect(React.findDOMNode(renderedItems[1]).textContent).toEqual('Log In');
    expect(React.findDOMNode(renderedItems[2]).textContent).toEqual('Wall');
    expect(React.findDOMNode(renderedItems[3]).textContent).toEqual('Post');
  });

});
