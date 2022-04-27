import React, { useState } from 'react';
import './App.css';
import { Centered } from './components/Centered';
import { ShakingText } from './components/ShakingText';
import { TrifoldContainer } from './components/TrifoldContainer';
import { TrifoldSection } from './components/TrifoldSection';
import { SocialIcon } from './components/SocialIcon';
import { ReactComponent as DiscordLogo } from './assets/Discord-Logo-White.svg';
import { PageHeader } from './components/PageHeader';
import { ConsoleApp } from './windows/apps/ConsoleApp';
import { HelloApp } from './windows/apps/HelloApp';
import { AppManagerComponent } from './windows/AppManager';


export let globalZIndex = {
  value: 0
}

function App() {
  return (
    <div className="App">
      <PageHeader/>
      <AppManagerComponent>
        <HelloApp/>
      </AppManagerComponent>
      <h1 className="main-header antialiased">mastriel.xyz</h1>

      <TrifoldContainer>
        <TrifoldSection noBorder='true' className="flex justify-center">
          <div>
            <Centered>
              <p className="text-xl font-thin">Hi!</p>
            </Centered>
            <div className="pb-14"/>
            <Centered>
              <img src="/basil500.png" alt="basil from omori" className="basil-img"/>
            </Centered>
            <div className="pb-24"/>
            <SocialIcon src={DiscordLogo} text='Mastriel#0085'/>
          </div>
        </TrifoldSection>
      </TrifoldContainer>
    </div>
  );
}

export default App;
