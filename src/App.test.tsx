import App from './App';
import { mount } from 'enzyme';
import { OverviewPage } from './page/overviewPage/OverviewPage';
import React from 'react';

describe('test App', ()=> {
  test('renders header with correct class name', () => {
    const app = mount(<App />);
    const header = app.find('header');
    expect(header).toBeDefined();
  });

  test('renders overview page', () => {
    const app = mount(<App />);
    const overviewPage = app.find(OverviewPage);
    expect(overviewPage).toBeDefined();
  });
})

