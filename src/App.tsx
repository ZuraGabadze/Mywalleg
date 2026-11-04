/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import {
  PaymentState,
  PROCESSING_DURATION_MS,
  DONE_DURATION_MS,
  getStatusText,
  isPayingAnimationActive,
} from './paymentState';

export default function App() {
  const [paymentState, setPaymentState] = useState<PaymentState>('ready');
  const processingTimeoutRef = useRef<number | null>(null);
  const doneTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current !== null) {
        window.clearTimeout(processingTimeoutRef.current);
      }
      if (doneTimeoutRef.current !== null) {
        window.clearTimeout(doneTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = () => {
    if (paymentState !== 'ready') return;

    setPaymentState('processing');

    processingTimeoutRef.current = window.setTimeout(() => {
      setPaymentState('done');
      const successSound = new Audio('/apple-pay.mp3');
      successSound.play().catch((err) => console.log(err));

      doneTimeoutRef.current = window.setTimeout(() => {
        setPaymentState('ready');
      }, DONE_DURATION_MS);
    }, PROCESSING_DURATION_MS);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <main className="wallet-container">
      {/* Main Card - American Express Gold */}
      <div
        className={`main-card ${isPayingAnimationActive(paymentState) ? 'paying-animation' : ''}`}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        role="button"
        tabIndex={0}
        aria-label="American Express Gold Card ending in 2962"
      >
        <img
          src="/amex-card.png"
          alt="American Express"
          className="amex-image"
        />

        {/* Bottom-Left Overlay */}
        <div className="card-overlay-bottom-left">
          <div className="overlay-card-number">
            <span className="dots">••••</span> 2962
          </div>
        </div>

        {/* Right-Center Overlay */}
        <div className="card-overlay-right">
          <svg
            className="scan-box-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 5H5C4.4477 5 4 5.4477 4 6V8"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M17 5H19C19.552 5 20 5.4477 20 6V8"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M7 19H5C4.4477 19 4 18.552 4 18V16"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M17 19H19C19.552 19 20 18.552 20 18V16"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 6.5L7.5 9V15L12 17.5L16.5 15V9L12 6.5Z"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M7.5 9L12 11.5L16.5 9"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 11.5V17.5"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M7.5 12L12 14.5L16.5 12"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          <svg
            className="nfc-wave-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M9.3 22c1.7-2.6 2.7-5.9 2.7-9.5S11 5.6 9.3 3" />
            <path d="M14.4 24c2.3-3.2 3.6-7.3 3.6-11.5S16.7 4.2 14.4 1" />
            <path d="M4.9 19.5C5.8 17.5 6.3 15.1 6.3 12.5s-.5-5-1.4-7" />
          </svg>
        </div>
      </div>

      {/* Payment Animation Cycle & Status Prompt */}
      <div className="status-prompt" aria-live="polite">
        <div className="status-icon-container">
          {paymentState === 'ready' && (
            <svg
              className="phone-icon"
              width="28"
              height="34"
              viewBox="0 0 24 34"
              fill="none"
              stroke="#007AFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="30" rx="4" />
              <line x1="12" y1="28" x2="12.01" y2="28" />
            </svg>
          )}

          {paymentState === 'processing' && <div className="spinner" />}

          {paymentState === 'done' && (
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark-check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          )}
        </div>
        <div className="status-text">{getStatusText(paymentState)}</div>
      </div>

      {/* Bottom Stacked Cards */}
      <div className="stacked-cards">
        <div className="stacked-card card-white-red">
          <div className="red-stripe" />
        </div>
        <div className="stacked-card card-bog-black">
          <div className="bog-logo-box-small">
            <img
              src="/bog-logo.png"
              alt="BOG Lion"
              className="real-logo-img"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
