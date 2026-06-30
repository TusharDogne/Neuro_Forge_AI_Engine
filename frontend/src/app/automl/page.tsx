'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { datasets } from '../dataset-management/components/datasetData';
import AutoMLDatasetSelector from './components/AutoMLDatasetSelector';
import ProblemTypeDetector from './components/ProblemTypeDetector';
import ModelSelectionPanel from './components/ModelSelectionPanel';
import TrainingMetricsPanel from './components/TrainingMetricsPanel';
import AutoMLResultsPanel from './components/AutoMLResultsPanel';
import { BrainCircuit, RotateCcw, ChevronRight, Zap } from 'lucide-react';

export type ProblemType = 'classification' | 'regression' | 'clustering' | 'time-series';
export type TrainingPhase = 'idle' | 'detecting' | 'selecting' | 'training' | 'complete';

export interface ModelCandidate {
  id: string;
  name: string;
  shortName: string;
  problemType: ProblemType;
  score: number;
  trainTime: number;
  status: 'pending' | 'training' | 'done' | 'skipped';
  metrics: Record<string, number>;
}

export interface TrainingLog {
  ts: string;
  level: 'info' | 'success' | 'warn' | 'metric';
  msg: string;
}

const MODEL_LIBRARY: Record<ProblemType, ModelCandidate[]> = {
  classification: [
    { id: 'xgb', name: 'XGBoost Classifier', shortName: 'XGBoost', problemType: 'classification', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'rf', name: 'Random Forest', shortName: 'RandomForest', problemType: 'classification', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'lgbm', name: 'LightGBM', shortName: 'LightGBM', problemType: 'classification', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'lr', name: 'Logistic Regression', shortName: 'LogReg', problemType: 'classification', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'svm', name: 'Support Vector Machine', shortName: 'SVM', problemType: 'classification', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'catboost', name: 'CatBoost', shortName: 'CatBoost', problemType: 'classification', score: 0, trainTime: 0, status: 'pending', metrics: {} },
  ],
  regression: [
    { id: 'xgbr', name: 'XGBoost Regressor', shortName: 'XGBoost', problemType: 'regression', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'rfr', name: 'Random Forest Regressor', shortName: 'RandomForest', problemType: 'regression', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'ridge', name: 'Ridge Regression', shortName: 'Ridge', problemType: 'regression', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'lasso', name: 'Lasso Regression', shortName: 'Lasso', problemType: 'regression', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'svr', name: 'Support Vector Regressor', shortName: 'SVR', problemType: 'regression', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'elastic', name: 'ElasticNet', shortName: 'ElasticNet', problemType: 'regression', score: 0, trainTime: 0, status: 'pending', metrics: {} },
  ],
  clustering: [
    { id: 'kmeans', name: 'K-Means Clustering', shortName: 'KMeans', problemType: 'clustering', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'dbscan', name: 'DBSCAN', shortName: 'DBSCAN', problemType: 'clustering', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'hier', name: 'Hierarchical Clustering', shortName: 'Hierarchical', problemType: 'clustering', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'gmm', name: 'Gaussian Mixture Model', shortName: 'GMM', problemType: 'clustering', score: 0, trainTime: 0, status: 'pending', metrics: {} },
  ],
  'time-series': [
    { id: 'arima', name: 'ARIMA', shortName: 'ARIMA', problemType: 'time-series', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'prophet', name: 'Prophet', shortName: 'Prophet', problemType: 'time-series', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'lstm', name: 'LSTM Network', shortName: 'LSTM', problemType: 'time-series', score: 0, trainTime: 0, status: 'pending', metrics: {} },
    { id: 'sarima', name: 'SARIMA', shortName: 'SARIMA', problemType: 'time-series', score: 0, trainTime: 0, status: 'pending', metrics: {} },
  ],
};

const METRIC_KEYS: Record<ProblemType, string[]> = {
  classification: ['accuracy', 'f1', 'precision', 'recall', 'auc_roc'],
  regression: ['r2', 'rmse', 'mae', 'mape'],
  clustering: ['silhouette', 'davies_bouldin', 'calinski_harabasz'],
  'time-series': ['mae', 'rmse', 'mape', 'smape'],
};

function detectProblemType(pt: string): ProblemType {
  const lower = pt.toLowerCase();
  if (lower.includes('class')) return 'classification';
  if (lower.includes('regress')) return 'regression';
  if (lower.includes('cluster')) return 'clustering';
  if (lower.includes('time') || lower.includes('series')) return 'time-series';
  return 'classification';
}

function randBetween(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}

function generateMetrics(pt: ProblemType): Record<string, number> {
  if (pt === 'classification') {
    const acc = randBetween(0.72, 0.97);
    return { accuracy: acc, f1: randBetween(acc - 0.05, acc + 0.02), precision: randBetween(acc - 0.04, acc + 0.03), recall: randBetween(acc - 0.06, acc + 0.01), auc_roc: randBetween(acc, Math.min(acc + 0.04, 0.99)) };
  }
  if (pt === 'regression') {
    const r2 = randBetween(0.65, 0.95);
    return { r2, rmse: randBetween(0.08, 0.42), mae: randBetween(0.05, 0.35), mape: randBetween(2.1, 18.4) };
  }
  if (pt === 'clustering') {
    return { silhouette: randBetween(0.3, 0.78), davies_bouldin: randBetween(0.4, 1.8), calinski_harabasz: randBetween(120, 980) };
  }
  return { mae: randBetween(0.04, 0.28), rmse: randBetween(0.06, 0.35), mape: randBetween(1.8, 12.4), smape: randBetween(2.0, 14.0) };
}

export default function AutoMLPage() {
  return (
    <AppLayout currentPath="/automl">
      <AutoMLWorkspace />
    </AppLayout>
  );
}

function AutoMLWorkspace() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0]?.id ?? '');
  const [phase, setPhase] = useState<TrainingPhase>('idle');
  const [detectedType, setDetectedType] = useState<ProblemType | null>(null);
  const [models, setModels] = useState<ModelCandidate[]>([]);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [bestModelId, setBestModelId] = useState<string | null>(null);
  const [epochData, setEpochData] = useState<{ epoch: number; loss: number; val_loss: number; score: number }[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs] = useState(20);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) ?? datasets[0];

  const addLog = (level: TrainingLog['level'], msg: string) => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setLogs((prev) => [...prev.slice(-199), { ts, level, msg }]);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setDetectedType(null);
    setModels([]);
    setLogs([]);
    setBestModelId(null);
    setEpochData([]);
    setCurrentEpoch(0);
  };

  const handleRun = () => {
    handleReset();
    const pt = detectProblemType(selectedDataset.problemType);
    const candidates = MODEL_LIBRARY[pt].map((m) => ({ ...m, status: 'pending' as const, score: 0, trainTime: 0, metrics: {} }));

    setPhase('detecting');
    addLog('info', `AutoML Engine v2.4 — initializing workspace`);
    addLog('info', `Dataset: ${selectedDataset.name} (${selectedDataset.rows} rows × ${selectedDataset.cols} cols)`);

    timerRef.current = setTimeout(() => {
      setDetectedType(pt);
      setPhase('selecting');
      addLog('success', `Problem type detected: ${pt.toUpperCase()}`);
      addLog('info', `Target column: ${selectedDataset.target ?? 'auto-detected'}`);
      addLog('info', `Loading ${candidates.length} candidate models for ${pt}…`);

      timerRef.current = setTimeout(() => {
        setModels(candidates);
        setPhase('training');
        addLog('info', `Model selection complete — beginning parallel evaluation`);
        addLog('info', `Cross-validation: 5-fold stratified`);

        // Train models sequentially with epoch simulation
        let epochIdx = 0;
        const epochInterval = setInterval(() => {
          epochIdx++;
          setCurrentEpoch(epochIdx);
          const loss = Math.max(0.05, 1.2 * Math.exp(-epochIdx * 0.18) + randBetween(-0.02, 0.02));
          const val_loss = Math.max(0.07, 1.35 * Math.exp(-epochIdx * 0.16) + randBetween(-0.03, 0.03));
          const score = Math.min(0.99, 0.45 + (epochIdx / totalEpochs) * 0.52 + randBetween(-0.01, 0.01));
          setEpochData((prev) => [...prev, { epoch: epochIdx, loss: parseFloat(loss.toFixed(4)), val_loss: parseFloat(val_loss.toFixed(4)), score: parseFloat(score.toFixed(4)) }]);

          if (epochIdx % 4 === 0) {
            addLog('metric', `Epoch ${epochIdx}/${totalEpochs} — loss: ${loss.toFixed(4)}, val_loss: ${val_loss.toFixed(4)}, score: ${score.toFixed(4)}`);
          }

          if (epochIdx >= totalEpochs) {
            clearInterval(epochInterval);
            // Train each model
            let modelIdx = 0;
            const trainNext = () => {
              if (modelIdx >= candidates.length) {
                // All done
                setModels((prev) => {
                  const scored = prev.map((m) => ({ ...m }));
                  const best = scored.reduce((a, b) => {
                    const aScore = pt === 'regression' ? (a.metrics.r2 ?? a.metrics.silhouette ?? (1 - (a.metrics.mae ?? 1))) : (a.metrics.accuracy ?? a.metrics.silhouette ?? (1 - (a.metrics.mae ?? 1)));
                    const bScore = pt === 'regression' ? (b.metrics.r2 ?? b.metrics.silhouette ?? (1 - (b.metrics.mae ?? 1))) : (b.metrics.accuracy ?? b.metrics.silhouette ?? (1 - (b.metrics.mae ?? 1)));
                    return bScore > aScore ? b : a;
                  });
                  setBestModelId(best.id);
                  addLog('success', `Best model selected: ${best.name}`);
                  const primaryMetric = pt === 'classification' ? `accuracy=${best.metrics.accuracy?.toFixed(4)}` : pt === 'regression' ? `R²=${best.metrics.r2?.toFixed(4)}` : pt === 'clustering' ? `silhouette=${best.metrics.silhouette?.toFixed(4)}` : `MAE=${best.metrics.mae?.toFixed(4)}`;
                  addLog('success', `Primary metric — ${primaryMetric}`);
                  addLog('info', `Model artifact saved to registry · experiment ID: EXP-${Math.floor(Math.random() * 9000 + 1000)}`);
                  return scored;
                });
                setPhase('complete');
                return;
              }
              const m = candidates[modelIdx];
              setModels((prev) => prev.map((x) => x.id === m.id ? { ...x, status: 'training' } : x));
              addLog('info', `Training ${m.name}…`);
              const t = 600 + Math.random() * 800;
              timerRef.current = setTimeout(() => {
                const metrics = generateMetrics(pt);
                const primaryScore = pt === 'regression' ? (metrics.r2 ?? 0) : pt === 'clustering' ? (metrics.silhouette ?? 0) : (metrics.accuracy ?? 0);
                setModels((prev) => prev.map((x) => x.id === m.id ? { ...x, status: 'done', metrics, score: primaryScore, trainTime: parseFloat((t / 1000).toFixed(2)) } : x));
                const key = pt === 'regression' ? 'r2' : pt === 'clustering' ? 'silhouette' : 'accuracy';
                addLog('metric', `  ${m.shortName} → ${key}=${metrics[key]?.toFixed(4)}, time=${( t / 1000).toFixed(2)}s`);
                modelIdx++;
                trainNext();
              }, t);
            };
            trainNext();
          }
        }, 220);
      }, 1200);
    }, 1800);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const isRunning = phase === 'detecting' || phase === 'selecting' || phase === 'training';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono-data mb-1">
            <span>ML Studio</span>
            <ChevronRight size={12} />
            <span className="text-copper">AutoML Engine</span>
          </div>
          <h1 className="text-xl font-600 text-foreground flex items-center gap-2">
            <BrainCircuit size={20} className="text-copper" />
            AutoML Workspace
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono-data">
            Automatic problem detection · model selection · real-time training metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-ghost text-xs gap-1.5" disabled={isRunning}>
            <RotateCcw size={13} />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn-primary text-xs gap-1.5"
          >
            <Zap size={13} />
            {isRunning ? 'Training in Progress…' : 'Run AutoML'}
          </button>
        </div>
      </div>

      {/* Dataset selector */}
      <AutoMLDatasetSelector
        datasets={datasets}
        selectedId={selectedDatasetId}
        onSelect={setSelectedDatasetId}
        disabled={isRunning}
      />

      {/* Problem type detector */}
      <ProblemTypeDetector
        phase={phase}
        detectedType={detectedType}
        dataset={selectedDataset}
      />

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_340px] gap-5 items-start">
        {/* Left column */}
        <div className="space-y-5">
          <ModelSelectionPanel
            models={models}
            phase={phase}
            bestModelId={bestModelId}
            problemType={detectedType}
          />
          <TrainingMetricsPanel
            epochData={epochData}
            currentEpoch={currentEpoch}
            totalEpochs={totalEpochs}
            phase={phase}
            problemType={detectedType}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <AutoMLResultsPanel
            models={models}
            bestModelId={bestModelId}
            phase={phase}
            logs={logs}
            problemType={detectedType}
          />
        </div>
      </div>
    </div>
  );
}
