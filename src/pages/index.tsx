import React from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import BackgroundMusic from '../components/BackgroundMusic';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/router';

// Dynamically import Spline with no SSR
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading 3D model...</div>
});

// Add new type for investment details
type Investment = {
  title: string;
  description: string;
  metrics: {
    apy: string;
    risk: string;
    term: string;
  };
};

// Add this near your other mock data
const mockInvestors = {
  low: [
    { image: "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg", name: "Vitalik" },
    { image: "https://pbs.twimg.com/profile_images/1892351277033521153/10wTuCtV_400x400.jpg", name: "Fede" },
    { image: "https://pbs.twimg.com/profile_images/1485841632360640514/bXz4KXyB_400x400.jpg", name: "Federico" },
  ],
  medium: [
    // { image: "https://pbs.twimg.com/profile_images/1744436021791395840/d0fxhGQt_400x400.jpg", name: "Stani" },
    // { image: "https://pbs.twimg.com/profile_images/1743339750470230016/UGtmXyNe_400x400.jpg", name: "Sandeep" },
    // { image: "https://pbs.twimg.com/profile_images/1654905367239798784/aqFxFv8e_400x400.jpg", name: "Hayden" },
    // { image: "https://pbs.twimg.com/profile_images/1733859038281666560/XcJ4yIzh_400x400.jpg", name: "John" },
  ],
  high: [
    { image: "https://pbs.twimg.com/profile_images/1892351277033521153/10wTuCtV_400x400.jpg", name: "Fede" },
    { image: "https://pbs.twimg.com/profile_images/1485841632360640514/bXz4KXyB_400x400.jpg", name: "Fede" },
  ]
};

// Add this near your other mock data
const userInvestments = {
  medium: 5.0,  // 5.0 USDC invested in medium risk
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'low' | 'medium' | 'high' | null>(null);
  const [currentProject, setCurrentProject] = useState({
    name: 'Project X',
    description: 'AI-powered sustainable energy solution',
    requiredFunding: '500,000',
    risk: 'Medium'
  });
  const [showConfirmScreen, setShowConfirmScreen] = useState(false);
  const [userBalance] = useState("20"); // This would normally come from your backend
  const [investmentStatus, setInvestmentStatus] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);

  // Add Privy hooks
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();
  const [userWallet, setUserWallet] = useState<string | null>(null);

  const strategies = {
    low: { name: 'Conservative', risk: 'Low', returns: '5-10%', color: '#4ade80' },
    medium: { name: 'Balanced', risk: 'Medium', returns: '10-20%', color: '#fbbf24' },
    high: { name: 'Aggressive', risk: 'High', returns: '20%+', color: '#ef4444' }
  };

  const investments: Record<'low' | 'medium' | 'high', Investment> = {
    low: {
      title: "Blue Chip Portfolio",
      description: "A diversified portfolio of established companies focused on stable, long-term growth.",
      metrics: {
        apy: "5-10%",
        risk: "Low",
        term: "12+ months"
      }
    },
    medium: {
      title: "Growth Portfolio",
      description: "Balanced mix of established companies and emerging market opportunities.",
      metrics: {
        apy: "10-20%",
        risk: "Medium",
        term: "6-12 months"
      }
    },
    high: {
      title: "Venture Portfolio",
      description: "High-growth potential startups and emerging technology investments.",
      metrics: {
        apy: "20%+",
        risk: "High",
        term: "3-6 months"
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Rejected project'),
    onSwipedRight: () => console.log('Approved project'),
    preventScrollOnSwipe: true
  });

  const confirmHandlers = useSwipeable({
    onSwipedRight: () => {
      console.log('Transaction confirmed');
      setShowConfirmScreen(false);
    },
    preventScrollOnSwipe: true
  });

  // Add state for swipe progress
  const [swipeProgress, setSwipeProgress] = useState(0);

  const router = useRouter();

  // Update the state management at the top of your component
  const [userInvestments, setUserInvestments] = useState<Record<string, number>>({
    low: 0,
    medium: 0,
    high: 0
  });

  // Add loading state at the top of your component
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the embedded wallet when available
  useEffect(() => {
    if (wallets.length > 0) {
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
      if (embeddedWallet) {
        setUserWallet(embeddedWallet.address);
      }
    }
  }, [wallets]);

  if (!isClient) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/basement-grotesque"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        position: 'fixed',
        color: 'white',
        fontFamily: "'Basement Grotesque', sans-serif",
        background: '#000'
      }}>
        <SplineComponent
          scene="https://prod.spline.design/T5PkQxXsLO5s-Jgh/scene.splinecode"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* App Navigation Bar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 10
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '15px'
          }}>
            {showConfirmScreen && (
              <motion.button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowConfirmScreen(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                ←
              </motion.button>
            )}
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {showConfirmScreen ? 'Investment Details' : 'SwarmFund'}
            </h1>
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            {authenticated ? (
              <>
                {/* User is logged in */}
                <div style={{ 
                  width: '40px', 
                  height: '40px',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }} onClick={() => logout()}>
                  {user?.twitter?.profilePictureUrl ? (
                    <img 
                      src={user.twitter.profilePictureUrl} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      {user?.email?.address?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <motion.button
                  onClick={() => login()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(74, 222, 128, 0.2)',
                    border: '1px solid rgba(74, 222, 128, 0.5)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Connect
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          paddingTop: '60px',
          height: '100%',
          position: 'relative',
          zIndex: 5
        }}>
          <AnimatePresence>
            {!showConfirmScreen ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  padding: '1rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 'calc(100vh - 140px)',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Balance Display */}
                <div style={{
                  width: '100%',
                  maxWidth: '500px',
                  marginBottom: '2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.9rem',
                      opacity: 0.7 
                    }}>Available Balance</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px'
                    }}>
                      <span style={{ 
                        fontSize: '2.5rem',
                        fontWeight: '600',
                        background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ${userBalance}
                      </span>
                      <span style={{ 
                        fontSize: '1rem',
                        opacity: 0.6 
                      }}>USD</span>
                    </div>
                  </div>
                </div>

                {/* Investment Options */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: '100%',
                  maxWidth: '500px'
                }}>
                  {Object.entries(strategies).map(([key, strategy]) => (
                    <motion.button
                      key={key}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedStrategy(key as 'low' | 'medium' | 'high');
                        setShowConfirmScreen(true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '1.5rem',
                        border: `2px solid ${strategy.color}`,
                        borderRadius: '12px',
                        background: `linear-gradient(45deg, ${strategy.color}22, transparent)`,
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>{strategy.name}</span>
                        <span style={{ opacity: 0.8 }}>{strategy.returns}</span>
                      </div>
                      
                      {/* Show invested amount if authenticated and has investment */}
                      {authenticated && userInvestments[key as keyof typeof userInvestments] > 0 && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          alignSelf: 'flex-start',
                          marginTop: '-0.25rem'
                        }}>
                          <span style={{ color: strategy.color }}>
                            ${userInvestments[key as keyof typeof userInvestments].toFixed(2)}
                          </span>
                          <span style={{ opacity: 0.7 }}>invested</span>
                        </div>
                      )}

                      <div style={{ 
                        fontSize: '0.9rem', 
                        opacity: 0.7,
                        textAlign: 'left' 
                      }}>
                        {investments[key as keyof typeof investments].description}
                      </div>
                      
                      {/* Investor Avatars */}
                      {authenticated && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '0.5rem',
                          gap: '-8px'  // Negative gap for overlapping effect
                        }}>
                          {mockInvestors[key as keyof typeof mockInvestors].map((investor, index) => (
                            <div
                              key={index}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                marginLeft: index > 0 ? '-8px' : '0',  // Overlap effect
                                position: 'relative',
                                zIndex: 20 - index  // Higher z-index for first images
                              }}
                            >
                              <img
                                src={investor.image}
                                alt={investor.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          ))}
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '0.8rem',
                            opacity: 0.7
                          }}>
                            +{mockInvestors[key as keyof typeof mockInvestors].length} mate investors
                          </span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* {investmentStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      marginBottom: '1rem',
                      background: 'rgba(74, 222, 128, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid rgba(74, 222, 128, 0.2)',
                      color: '#4ade80',
                      textAlign: 'center',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}
                  >
                    🚀 {investmentStatus}
                  </motion.div>
                )} */}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  padding: '1rem',
                  width: '100%',
                  height: 'calc(100vh - 140px)',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Investment Details */}
                <div style={{ 
                  width: '100%',
                  maxWidth: '500px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  marginTop: '2rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}>
                  <h2 style={{ 
                    fontSize: '1.8rem',
                    marginBottom: '1rem',
                    color: strategies[selectedStrategy!].color,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                    {investments[selectedStrategy!].title}
                  </h2>
                  <p style={{ 
                    marginBottom: '1.5rem',
                    opacity: 1,
                    fontSize: '1.1rem',
                    lineHeight: '1.5',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>
                    {investments[selectedStrategy!].description}
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    textAlign: 'center'
                  }}>
                    {Object.entries(investments[selectedStrategy!].metrics).map(([key, value]) => (
                      <div key={key} style={{ 
                        padding: '1.2rem',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}>
                        <div style={{ 
                          opacity: 1,
                          fontSize: '1rem',
                          color: '#4ade80',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          {key.toUpperCase()}
                        </div>
                        <div style={{ 
                          marginTop: '0.5rem',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          color: '#ffffff'
                        }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Amount Input */}
                <div style={{
                  width: '100%',
                  maxWidth: '500px',
                  marginTop: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '0.5rem'
                  }}>
                    Investment Amount (USDC)
                  </div>
                  <input
                    type="number"
                    value={investmentAmount === 0 ? '' : investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1.2rem',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    }}
                    placeholder="Enter amount"
                    min="0"
                  />
                </div>

                {/* Confirmation Button */}
                <div style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <motion.button
                    onClick={async () => {
                      setIsInvesting(true);
                      
                      // Simulate transaction processing
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      
                      // Update investments
                      setUserInvestments(prev => ({
                        ...prev,
                        [selectedStrategy!]: (prev[selectedStrategy!] || 0) + investmentAmount
                      }));
                      
                      setInvestmentStatus(`Invested ${investmentAmount} USDC - Now earning ${strategies[selectedStrategy!].returns} with ${strategies[selectedStrategy!].name}`);
                      setInvestmentAmount(0);
                      setIsInvesting(false);
                      setShowConfirmScreen(false);
                    }}
                    disabled={isInvesting}
                    whileHover={{ scale: isInvesting ? 1 : 1.02 }}
                    whileTap={{ scale: isInvesting ? 1 : 0.98 }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: isInvesting ? '#3aa066' : '#4ade80',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'black',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: isInvesting ? 'default' : 'pointer',
                      boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isInvesting ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '3px solid rgba(0, 0, 0, 0.1)',
                            borderTop: '3px solid rgba(0, 0, 0, 0.8)',
                            borderRadius: '50%',
                          }}
                        />
                        Processing Investment...
                      </div>
                    ) : (
                      'Confirm Investment'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar with AI Sphere - Updated z-index */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50  // Increased z-index to be above other elements
        }}>
          {/* Sphere Container with Label */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            touchAction: 'none'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              transform: 'translateY(-10px)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <SplineComponent
                scene="https://prod.spline.design/Z9zHLBmyH9g2Nu1j/scene.splinecode" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'auto'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 2
                }}
                onClick={() => router.push('/assistant')}
              />
            </div>
            <span style={{
              color: 'white',
              fontSize: '0.9rem',
              opacity: 0.9,
              fontWeight: '500',
              transform: 'translateY(-15px)'
            }}>
              AI Assistant
            </span>
          </div>
        </div>
      </main>
    </>
  );
} 