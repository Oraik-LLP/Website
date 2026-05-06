import { Activity, Camera, Car, Gauge, Radio, ShieldCheck, Wrench } from 'lucide-react';
import { useState } from 'react';

type SimulatorStep = 'home' | 'modes' | 'urgent' | 'analyzing' | 'report';

const symptoms = ['Engine', 'Brakes', 'Transmission', 'Electrical'];
const componentScores = [
  { label: 'Engine', value: 42 },
  { label: 'Brakes', value: 68 },
  { label: 'Transmission', value: 74 },
  { label: 'Electrical', value: 58 },
  { label: 'Suspension', value: 81 },
];

export function FixEaseSimulator() {
  const [step, setStep] = useState<SimulatorStep>('home');

  return (
    <section className="phone-simulator" aria-label="FixEase phone simulator">
      <div className="phone-side phone-side-left" />
      <div className="phone-frame">
        <div className="phone-notch">
          <span />
          <i />
        </div>
        <div className="phone-screen">
          <div className="phone-wallpaper" />
          <div className="phone-status">
            <span>09:41</span>
            <span>FixEase</span>
          </div>

          {step === 'home' && (
            <div className="sim-panel sim-home">
              <div className="sim-logo-lockup">
                <img src="/assets/fixease/fixease-logo.png" alt="FixEase logo" />
                <div>
                  <span>AI Car Diagnostics</span>
                  <strong>2024 Honda Civic Type R</strong>
                  <small className="easter-egg">K20A i-VTEC</small>
                </div>
              </div>
              <div className="health-orbit" aria-label="Health score 6.4 out of 10">
                <span>6.4</span>
                <small>Health score</small>
              </div>
              <div className="sim-grid">
                <div>
                  <Gauge size={16} />
                  <span>Confidence</span>
                  <strong>82%</strong>
                </div>
                <div>
                  <ShieldCheck size={16} />
                  <span>Privacy</span>
                  <strong>Local</strong>
                </div>
              </div>
              <button className="sim-primary" type="button" onClick={() => setStep('modes')}>
                Start demo
              </button>
            </div>
          )}

          {step === 'modes' && (
            <div className="sim-panel">
              <p className="sim-kicker">Choose diagnosis</p>
              <button className="mode-row" type="button" onClick={() => setStep('urgent')}>
                <Activity size={18} />
                <span>
                  <strong>Urgent Mode</strong>
                  Symptom chips and severity
                </span>
              </button>
              <button className="mode-row" type="button" onClick={() => setStep('urgent')}>
                <Camera size={18} />
                <span>
                  <strong>Photo Mode</strong>
                  Capture damage, leaks, or wear
                </span>
              </button>
              <button className="mode-row" type="button" onClick={() => setStep('urgent')}>
                <Radio size={18} />
                <span>
                  <strong>Gemini Live (Beta)</strong>
                  Real-time camera assistant
                </span>
              </button>
            </div>
          )}

          {step === 'urgent' && (
            <div className="sim-panel">
              <p className="sim-kicker">Urgent Mode</p>
              <h3>What is happening?</h3>
              <div className="symptom-grid">
                {symptoms.map((symptom) => (
                  <button key={symptom} className="symptom-chip" type="button">
                    {symptom}
                  </button>
                ))}
              </div>
              <label className="severity-control">
                <span>Severity</span>
                <strong>High</strong>
              </label>
              <button className="sim-primary" type="button" onClick={() => setStep('analyzing')}>
                Run AI scan
              </button>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="sim-panel sim-center">
              <div className="scan-ring">
                <Car size={42} />
              </div>
              <h3>Analyzing vehicle telemetry</h3>
              <p>Matching symptoms with possible engine and electrical issues.</p>
              <button className="sim-primary" type="button" onClick={() => setStep('report')}>
                Show report
              </button>
            </div>
          )}

          {step === 'report' && (
            <div className="sim-panel report-panel">
              <p className="sim-kicker">Diagnostic Report</p>
              <div className="report-score">
                <span>4.8</span>
                <div>
                  <strong>Needs Attention</strong>
                  <small>Confidence 86%</small>
                </div>
              </div>
              <div className="mini-section">
                <strong>Possible causes</strong>
                <p>Rough idle, ignition coil wear, or unstable sensor readings.</p>
              </div>
              <div className="mini-section">
                <strong>Recommendations</strong>
                <p>Inspect spark plugs, scan OBD codes, and avoid long drives before service.</p>
              </div>
              <div className="score-list">
                {componentScores.map((score) => (
                  <div key={score.label} className="score-row">
                    <span>{score.label}</span>
                    <i style={{ width: `${score.value}%` }} />
                  </div>
                ))}
              </div>
              <button className="sim-secondary" type="button" onClick={() => setStep('home')}>
                <Wrench size={16} />
                Reset demo
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="phone-side phone-side-right" />
    </section>
  );
}
