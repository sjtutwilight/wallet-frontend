import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import NetworkSignerManager from './context/NetworkSignerManager';
import NetworkSelector from './components/NetworkSelector';
import SignerSelector from './components/SignerSelector';
import WalletProvider from './context/WalletProvider';
import game from './components/game';
import { PopupProvider } from './context/PopupContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';


import TokenManagement from './components/TokenManagement';
import TwilightSwap from './components/twilightswap/TwilightSwap';

// import Airdrop from './AirDrop/Airdrop';

import { AccountProvider } from './context/AccountContext';
import AccountSelection from './components/AccountSelection';
import './App.css';
import { UserProvider } from './context/UserContext';
import Lending from './components/Lending/Lending'
function App() {
    return (
        <UserProvider>
        <WalletProvider>
        
          <NetworkSignerManager>
          <AccountProvider>
              <PopupProvider>
              <ThemeProvider theme={theme}>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <div className="top-bar">
                            <div className="network-signer">
                            <SignerSelector />

                                <NetworkSelector />
                                <AccountSelection /> {/* Account Selection available globally */}

                            </div>
                            <div className="auth-links">
                                <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    Sign Up
                                </NavLink>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    Login
                                </NavLink>
                            </div>
                        </div>
                        <nav>
                            <ul>
                                <li>
                                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                        Dashboard
                                    </NavLink>
                                </li>
                               
                                <li>
                                    <NavLink to="/swap" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                        swap
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Lending" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    Lending
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/game" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    game
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink to="/airdrop" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    airdrop
                                    </NavLink>
                                </li> */}
                                <li>
                                    <NavLink to="/token management" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    token management
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink to="/pokemon" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                    pokemon
                                    </NavLink>
                                </li> */}
                            </ul>
                        </nav>
                        <Routes>
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/swap" element={<TwilightSwap />} />
                            <Route path="/Lending" element={<Lending />} />
                            <Route path="/game" element={<game />} />
                            {/* <Route path="/airdrop" element={<Airdrop />} /> */}
                            <Route path="/token management" element={<TokenManagement />} />
                        </Routes>
                    </header>
                </div>
            </Router>
            </ThemeProvider>
            </PopupProvider>
            </AccountProvider>
            </NetworkSignerManager>
        </WalletProvider>
        </UserProvider>
    );
}

export default App;

