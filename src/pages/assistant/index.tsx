import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Vapi from "@vapi-ai/web";

// Dynamically import Spline with no SSR
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading 3D model...</div>
});

export default function AIAssistant() {
  const router = useRouter();
  const vapiRef = useRef<any>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<Array<{role: string, content: string}>>([]);
  const initializingRef = useRef(false);

  useEffect(() => {
    const initializeVapi = async () => {
      // Prevent multiple initializations
      if (initializingRef.current || vapiRef.current) return;
      initializingRef.current = true;

      try {
        // Create new instance
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");
        vapiRef.current = vapiInstance;
        
        vapiInstance.on("call-start", () => {
          console.log("Call started");
          setTranscriptMessages([]); // Reset transcript for new call
        });

        vapiInstance.on("message", (message: any) => {
          if (message.type === "transcript") {
            setTranscriptMessages(prev => [...prev, {
              role: message.transcript.speaker === "assistant" ? "assistant" : "user",
              content: message.transcript.text
            }]);
          }
        });

        vapiInstance.on("call-end", async () => {
          console.log("Call ended");
        });

        vapiInstance.on("error", (error: any) => {
          console.error("Vapi error:", error);
        });

        await vapiInstance.start({
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en-US",
          },
          model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are SwarmFund's AI Assistant and Im Lautaro. You are an expert in DeFi and crypto investments. You have real-time access to the user's wallet balance (currently 10 USDC) and our vault performance data.

Current Vault Performance Data (Last 30 Days):

LOW RISK VAULT - "Stablecoin Shield"
- Current APY: 6.8%
- Historical Range: 3-8% APY
- Risk Level: Minimal
- Strategy: USDC/USDT lending on Silo Finance
- Recent Performance: +0.52% last 7 days
- Total TVL: nothing we are just starting.
- No impermanent loss risk
- Automated rebalancing between Superchain protocols

MEDIUM RISK VAULT - "DeFi Blue Chip"
- Current APY: 15.3%
- Historical Range: 10-20% APY
- Risk Level: Moderate
- Strategy: 
  * 40% ETH-USDC LP on Silo Finance
  * 30% WBTC-ETH LP on Silo Finance
- Recent Performance: +1.2% last 7 days
- Total TVL: nothing we are just starting.
- Smart rebalancing across Base, Optimism, and Ink

HIGH RISK VAULT - "Alpha Seeker"
- Current APY: 42.7%
- Historical Range: 25-60% APY
- Risk Level: High
- Strategy:
  * Leveraged kBTC positions (up to 2x)
  * Yield farming on new Superchain protocols
  * Active arbitrage opportunities
  * Options writing strategies
- Recent Performance: +3.8% last 7 days
- Total TVL: nothing we are just starting.
- Implements stop-loss mechanisms

Market Context:
- ETH Price: $2,447 (↑ 1.3% 24h)
- BTC Price: $88,180 (↑ 1.1% 24h)
- Gas fees on Ink: 0.001 ETH avg

You explain these options clearly and help users choose based on their risk tolerance. You're knowledgeable about:
- Current market conditions and trends
- Risk assessment and portfolio diversification
- Smart contract security and audits
- Gas optimization across the Superchain
- Yield farming strategies and opportunities

Your tone is professional but approachable. You explain complex DeFi concepts in simple terms. Always prioritize user security and risk awareness. With the user's 10 USDC, you can suggest appropriate allocation strategies based on their risk tolerance.`,
              },
            ],
          },
          voice: {
            provider: "11labs",
            voiceId: "21m00Tcm4TlvDq8ikWAM",
          },
          name: "SwarmFund AI Assistant",
        });

        // Send welcome message after connection is established
        setTimeout(() => {
          if (vapiRef.current) {
            vapiRef.current.say("Hey! Welcome to SwarmFund. I'm here to help you navigate the DeFi space. What would you like to know about our investment strategies or current opportunities?");
          }
        }, 1000);

      } catch (error) {
        console.error("Error initializing Vapi:", error);
        // Clean up on error
        if (vapiRef.current) {
          await vapiRef.current.stop();
          vapiRef.current = null;
        }
      } finally {
        initializingRef.current = false;
      }
    };

    // Initialize only on client-side
    if (typeof window !== 'undefined') {
      initializeVapi();
    }

    // Cleanup function
    return () => {
      const cleanup = async () => {
        if (vapiRef.current) {
          await vapiRef.current.stop();
          vapiRef.current = null;
        }
        initializingRef.current = false;
      };
      cleanup();
    };
  }, []); // Empty dependency array

  return (
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
      {/* Navigation Bar */}
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
        padding: '0 20px',
        zIndex: 10
      }}>
        <motion.button
          onClick={() => router.push('/')}
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
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          marginLeft: '15px'
        }}>
          AI Assistant
        </h1>
      </div>

      {/* Centered Sphere */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        zIndex: 1,
        touchAction: 'none',
        cursor: 'pointer'
      }}>
        <SplineComponent
          scene="https://prod.spline.design/Z9zHLBmyH9g2Nu1j/scene.splinecode"
          style={{ 
            width: '100%',
            height: '100%',
            pointerEvents: 'auto'
          }}
        />
      </div>

      {/* Transcript Messages */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '80%',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem',
        zIndex: 2
      }}>
        {transcriptMessages.length > 0 && 
          transcriptMessages[transcriptMessages.length - 1].content}
      </div>
    </main>
  );
} 