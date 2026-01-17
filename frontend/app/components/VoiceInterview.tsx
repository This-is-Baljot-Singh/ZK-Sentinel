'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Play, ChevronRight, CheckCircle } from 'lucide-react';
import { PrivacyStatus } from './PrivacyStatus';
import { FloatingNav } from './FloatingNav';
import { useAppContext } from '../context/AppContext';

const questions = [
  "Please state your full name for verification.",
  "What is your current occupation?",
  "Can you confirm your residential address?",
  "What is the purpose of this financial verification?",
  "Do you have any outstanding loans or debts?",
  "Please confirm your identity with a security question."
];

export const VoiceInterview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [isRecording, setIsRecording] = useState(false);

  const router = useRouter();
  const { updateAgent, addActivity } = useAppContext();

  const handleNavigate = (item: 'home' | 'documents' | 'activity' | 'settings' | 'voice') => {
    switch (item) {
      case 'home': router.push('/'); break;
      case 'documents': router.push('/documents'); break;
      case 'activity': router.push('/activity'); break;
      case 'voice': router.push('/voice'); break;
      case 'settings': router.push('/settings'); break;
    }
  };

  const startInterview = () => {
    setCurrentQuestion(0);
    updateAgent('1', { status: 'Running', lastUpdated: Date.now() });
    addActivity({
      timestamp: Date.now(),
      title: 'Voice Interview Started',
      description: 'Voice Interviewer agent initiated identity verification',
      type: 'Analysis',
      severity: 'Info',
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    updateAgent('1', { status: 'Completed', lastUpdated: Date.now() });
    addActivity({
      timestamp: Date.now(),
      title: 'Voice Interview Completed',
      description: 'Voice Interviewer agent finished identity verification',
      type: 'Analysis',
      severity: 'Info',
    });
  };

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <PrivacyStatus />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-white mb-2">
            Voice Interview
          </h1>
          <p className="text-white/60 font-body text-lg">
            Interactive identity verification process
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            {currentQuestion === -1 ? (
              <div className="text-center">
                <Mic className="w-16 h-16 text-cyber mx-auto mb-6" />
                <h3 className="text-2xl font-display font-semibold text-white mb-4">
                  Start Voice Interview
                </h3>
                <p className="text-white/70 font-body mb-8">
                  Begin the interactive identity verification process with voice prompts.
                </p>
                <button
                  onClick={startInterview}
                  className="backdrop-blur-sm bg-cyber/20 border border-cyber/30 rounded-lg px-8 py-4 text-cyber hover:bg-cyber/30 transition-colors font-body flex items-center gap-2 mx-auto"
                >
                  <Play size={20} /> Start Interview
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-white/50 font-body text-sm mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-cyber h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-display font-semibold text-white mb-4">
                    {questions[currentQuestion]}
                  </h3>
                  <div className="flex justify-center">
                    <button
                      onClick={handleRecord}
                      disabled={isRecording}
                      className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isRecording
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-white/10 border-cyber/50 text-cyber hover:bg-cyber/20'
                      }`}
                    >
                      <Mic size={32} />
                    </button>
                  </div>
                  {isRecording && (
                    <p className="text-red-400 font-body text-sm mt-4">
                      Recording... Please speak your response.
                    </p>
                  )}
                </div>

                <button
                  onClick={nextQuestion}
                  disabled={isRecording}
                  className="backdrop-blur-sm bg-cyber/20 border border-cyber/30 rounded-lg px-8 py-4 text-cyber hover:bg-cyber/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-body flex items-center gap-2 mx-auto"
                >
                  {currentQuestion === questions.length - 1 ? (
                    <>
                      <CheckCircle size={20} /> Complete Interview
                    </>
                  ) : (
                    <>
                      <ChevronRight size={20} /> Next Question
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingNav activeItem="voice" onNavigate={handleNavigate} />
    </div>
  );
};
