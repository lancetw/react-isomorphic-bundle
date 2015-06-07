'use strict';

import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react/addons';
import HeaderComponent from 'src/shared/components/Header';
import stubRouterContext from 'tests/utils/stub-router-context.jsx';

describe('App', () => {

  jsdom();

  const TestUtils = React.addons.TestUtils;

  beforeEach(() => {

  });

  afterEach(() => {

  });

  it('displays two nav items with right text content', () => {


    const Header = stubRouterContext(HeaderComponent);
    const header = TestUtils.renderIntoDocument(<Header />);
    const renderedItems = TestUtils.scryRenderedDOMComponentsWithTag(header, 'a'),
    itemCount = renderedItems.length;

    expect(itemCount).toBe(2);

    expect(React.findDOMNode(renderedItems[0]).textContent).toEqual('Home');
    expect(React.findDOMNode(renderedItems[1]).textContent).toEqual('Info');
  });

});
