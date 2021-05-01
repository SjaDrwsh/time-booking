import { ScooterParsing } from 'components/scooterParsing/ScooterParsing';
import { mount } from 'enzyme';
import React from 'react';
import { OverviewPage } from './OverviewPage';

describe('test OverviewPage', ()=> {
    test('renders div with class name OverviewPage', () => {
        const overviewPage = mount(<OverviewPage />);
        const className = overviewPage.find('div').filterWhere((element)=>{
            return element.props().className === 'OverviewPage';
        });
        
        expect(className).toBeDefined();
      }); 

      test('renders ScooterParsing ', () => {
        const overviewPage = mount(<OverviewPage />);
        const scooterParsing = overviewPage.find(ScooterParsing);
        
        expect(scooterParsing).toBeDefined();
      }); 
})

