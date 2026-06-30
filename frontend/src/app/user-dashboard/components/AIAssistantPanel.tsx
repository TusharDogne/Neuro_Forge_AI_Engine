'use client';

import React, { useState } from 'react';
import {
  Send,
  Loader2,
  Sparkles,
  Brain,
  Database,
  Bot,
  Cpu,
  BarChart3,
  Rocket
} from 'lucide-react';

const promptCategories = [
  {
    title: 'Dataset',
    icon: Database,
    prompts: [
      'Explain my dataset health score',
      'Detect data quality issues',
      'Show missing value recommendations',
      'Detect outliers in my dataset',
      'Check multicollinearity'
    ]
  },

  {
    title: 'Modeling',
    icon: Brain,
    prompts: [
      'Recommend the best model',
      'How can I improve model accuracy?',
      'Why did Random Forest outperform others?',
      'Explain feature importance',
      'Should I use SMOTE?'
    ]
  },

  {
    title: 'Deep Learning',
    icon: Cpu,
    prompts: [
      'Suggest an ANN architecture',
      'Recommend a CNN architecture',
      'Recommend an LSTM architecture',
      'Should I use ANN or XGBoost?',
      'Explain training curves'
    ]
  },

  {
    title: 'Visualization',
    icon: BarChart3,
    prompts: [
      'Explain confusion matrix',
      'Explain SHAP values',
      'Explain regression residuals',
      'Explain cluster quality',
      'Generate EDA summary'
    ]
  },

  {
    title: 'LLM & RAG',
    icon: Bot,
    prompts: [
      'Build a PDF chatbot',
      'Generate a RAG pipeline',
      'Suggest embedding models',
      'Create a customer support chatbot',
      'Generate chatbot architecture'
    ]
  },

  {
    title: 'MLOps',
    icon: Rocket,
    prompts: [
      'Check for model drift',
      'How should I deploy this model?',
      'Recommend MLOps architecture',
      'Generate deployment code',
      'Prepare model for production'
    ]
  }
];

const mockResponses: Record<string, string> = {
  default:
    'Based on the current dataset profile, I recommend XGBoost with feature scaling and SMOTE balancing.'
};

export default function AIAssistantPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    {
      id: string;
      role: 'user' | 'assistant';
      text: string;
    }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user' as const,
      text
    };

    setMessages((prev) => [...prev, userMsg]);

    setInput('');
    setIsLoading(true);

    /*
    Backend Example

    const response = await axios.post(
      '/api/v1/copilot/chat',
      {
        message:text,
        dataset_id:selectedDataset
      }
    );
    */

    await new Promise((r) => setTimeout(r, 1200));

    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant' as const,
      text: mockResponses.default
    };

    setMessages((prev) => [...prev, assistantMsg]);

    setIsLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col h-full">

      {/* Header */}

      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-copper-500/10 flex items-center justify-center">
          <Sparkles className="text-copper-500" size={18} />
        </div>

        <div>
          <h3 className="font-semibold">AI Copilot</h3>
          <p className="text-xs text-muted-foreground">
            Senior AI Engineer Assistant
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">
            GPT-4o
          </span>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 && (

          <div className="space-y-4">

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Ask anything about datasets, ML, DL, RAG or MLOps.
              </p>
            </div>

            {promptCategories.map((category) => {

              const Icon = category.icon;

              return (
                <div key={category.title}>

                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} />
                    <h4 className="text-sm font-medium">
                      {category.title}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {category.prompts.map((prompt) => (

                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="
                          text-xs
                          px-3
                          py-1.5
                          rounded-full
                          border
                          border-border
                          hover:border-copper-500
                          transition
                        "
                      >
                        {prompt}
                      </button>

                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >

            <div
              className={`
              max-w-[85%]
              rounded-xl
              px-4
              py-3
              text-sm
              ${
                msg.role === 'user'
                  ? 'bg-copper-500/15'
                  : 'bg-muted'
              }
            `}
            >
              {msg.text}
            </div>

          </div>

        ))}

        {isLoading && (
          <div className="flex">
            <div className="bg-muted rounded-xl p-3">
              <Loader2
                size={16}
                className="animate-spin"
              />
            </div>
          </div>
        )}

      </div>

      {/* Input */}

      <div className="border-t border-border p-4 flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && sendMessage(input)
          }
          placeholder="Ask the AI Copilot..."
          className="input-field flex-1"
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading}
          className="btn-primary"
        >
          <Send size={16} />
        </button>

      </div>
    </div>
  );
}