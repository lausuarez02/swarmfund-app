import React from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import BackgroundMusic from '../components/BackgroundMusic';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SwarmFund</h1>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '30px', 
              height: '30px',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                  overflow: 'hidden'
                }}
                whileHover={{
                  scale: 1.1,
                  borderColor: '#ffffff',
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '50%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transform: 'translateX(-50%)',
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '50%',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transform: 'translateX(-50%)',
                  }}
                />
              </motion.div>
            </div>
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
                  alignItems: 'center'
                }}
              >
                {/* <h1 style={{
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  SwarmFund
                </h1> */}

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
                      <div style={{ 
                        fontSize: '0.9rem', 
                        opacity: 0.7,
                        textAlign: 'left' 
                      }}>
                        {investments[key as keyof typeof investments].description}
                      </div>
                    </motion.button>
                  ))}
                </div>
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
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between'
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

                {/* New Swipe Confirmation Button */}
                <div style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '60px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '2px solid #4ade80',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      zIndex: 2,
                      color: 'white'
                    }}>
                      Swipe right to confirm
                    </div>
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDrag={(e, info) => {
                        const progress = Math.max(0, Math.min(1, info.offset.x / 200));
                        setSwipeProgress(progress);
                      }}
                      onDragEnd={(e, { offset }) => {
                        if (offset.x > 200) {
                          console.log('Transaction confirmed');
                          setShowConfirmScreen(false);
                        }
                        setSwipeProgress(0);
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '20px',
                        background: `linear-gradient(90deg, 
                          #4ade80 ${swipeProgress * 100}%, 
                          transparent ${swipeProgress * 100}%
                        )`,
                        cursor: 'grab',
                        userSelect: 'none',
                        zIndex: 1
                      }}
                      whileTap={{ cursor: 'grabbing' }}
                    >
                      <span style={{
                        fontSize: '24px',
                        color: '#fff',
                        transform: `translateX(${swipeProgress * (window.innerWidth * 0.8)}px)`,
                        transition: 'transform 0.1s ease'
                      }}>
                        →
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar with AI Sphere */}
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
          zIndex: 20
        }}>
          {/* Sphere Container with Label */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              transform: 'translateY(-10px)'
            }}>
              <SplineComponent
                scene="https://prod.spline.design/Z9zHLBmyH9g2Nu1j/scene.splinecode" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => console.log('Open AI Assistant')}
              />
            </div>
            <span style={{
              color: 'white',
              fontSize: '0.9rem',
              opacity: 0.9,
              fontWeight: '500',
              transform: 'translateY(-15px)'  // Move label up closer to sphere
            }}>
              AI Assistant
            </span>
          </div>
        </div>
      </main>
    </>
  );
} 