---
name: regime-analysis
description: Market/system regime detection and analysis protocol. Use when working with time series data, financial data, or any system that has distinct behavioral modes. Ensures models are tested across ALL regimes and prevents regime-blind analysis. Triggers on time series analysis, backtesting, or strategy development.
---

# Regime Analysis Skill

## Why Regime Analysis Is Non-Negotiable

A model trained on bull market data WILL fail in bear markets. A strategy backtested on calm periods WILL blow up during volatility spikes. **If you don't know which regimes your data covers, you don't know what your model actually learned.**

## Regime Detection Methods

### Method 1: Rolling Statistics (Simple, Always Works)
```python
def detect_regimes_rolling(df, returns_col='returns', window=20):
    """Simple regime detection using rolling mean and volatility."""
    roll_mean = df[returns_col].rolling(window).mean()
    roll_std = df[returns_col].rolling(window).std()
    med_std = roll_std.median()
    
    regimes = pd.Series('unknown', index=df.index)
    regimes[(roll_mean > 0) & (roll_std < med_std)] = 'bull_calm'
    regimes[(roll_mean > 0) & (roll_std >= med_std)] = 'bull_volatile'
    regimes[(roll_mean <= 0) & (roll_std < med_std)] = 'bear_calm'
    regimes[(roll_mean <= 0) & (roll_std >= med_std)] = 'bear_volatile'
    
    # Print regime distribution
    print("=== REGIME DISTRIBUTION ===")
    counts = regimes.value_counts()
    for regime, count in counts.items():
        pct = count / len(regimes) * 100
        flag = "⚠️ LOW" if count < 30 else "✓"
        print(f"  {regime}: {count} ({pct:.1f}%) {flag}")
    
    return regimes
```

### Method 2: Hidden Markov Model (Advanced)
```python
from hmmlearn.hmm import GaussianHMM

def detect_regimes_hmm(returns, n_regimes=3):
    """HMM-based regime detection."""
    model = GaussianHMM(n_components=n_regimes, covariance_type="full", n_iter=100)
    model.fit(returns.values.reshape(-1, 1))
    regimes = model.predict(returns.values.reshape(-1, 1))
    
    # Label regimes by mean return
    regime_means = pd.Series(returns.values).groupby(regimes).mean()
    labels = {i: f"regime_{i}_mean_{m:.4f}" for i, m in regime_means.items()}
    
    return pd.Series(regimes, index=returns.index).map(labels)
```

### Method 3: Structural Break Detection
```python
import ruptures

def detect_structural_breaks(series, n_breaks=5):
    """Detect structural breaks in time series."""
    algo = ruptures.Pelt(model="rbf").fit(series.values.reshape(-1, 1))
    breaks = algo.predict(pen=10)
    
    print(f"Detected {len(breaks)-1} structural breaks at indices: {breaks[:-1]}")
    return breaks
```

## Mandatory Regime Checklist

Before ANY modeling on time series data:

- [ ] **Regimes identified** using at least ONE method above
- [ ] **Every data point labeled** with its regime
- [ ] **Sample count per regime:** minimum 30, ideally 100+
- [ ] **Train/test stratified BY REGIME** (each regime in both sets)
- [ ] **Performance reported PER REGIME** (not just overall)

## Per-Regime Reporting Template

```
=== MODEL PERFORMANCE BY REGIME ===
Overall: accuracy=0.65 (MEANINGLESS alone)

Bull Calm:      acc=0.72 (n=450) ← Good
Bull Volatile:  acc=0.61 (n=180) ← Marginal
Bear Calm:      acc=0.48 (n=120) ← WORSE THAN RANDOM
Bear Volatile:  acc=0.42 (n=80)  ← FAIL (also low n)
Unknown:        acc=0.55 (n=50)  ← Insufficient data

VERDICT: Model only works in bull_calm regime.
         This is NOT a general model.
         It's a bull_calm bet disguised as a model.
```

## Regime-Aware Train/Test Split

```python
from sklearn.model_selection import StratifiedShuffleSplit

def regime_stratified_split(df, regime_col='regime', test_size=0.2):
    """Split data ensuring each regime is represented in both sets."""
    sss = StratifiedShuffleSplit(n_splits=1, test_size=test_size, random_state=42)
    
    for train_idx, test_idx in sss.split(df, df[regime_col]):
        train = df.iloc[train_idx]
        test = df.iloc[test_idx]
    
    # Verify regime coverage
    for regime in df[regime_col].unique():
        n_train = (train[regime_col] == regime).sum()
        n_test = (test[regime_col] == regime).sum()
        print(f"{regime}: train={n_train}, test={n_test}")
        if n_test < 10:
            print(f"  ⚠️ INSUFFICIENT test samples for {regime}")
    
    return train, test
```

**NOTE:** For time series, use TEMPORAL split with regime stratification — ensure each temporal fold covers multiple regimes. Never use random stratified split on time series.

## Minimum Samples Per Regime

| Regime Type | Minimum | For ML | For Statistical Testing |
|-------------|---------|--------|----------------------|
| Common (bull, calm) | 30 | 100 | 50 |
| Uncommon (bear, volatile) | 30 | 50 | 30 |
| Rare (crisis, shock) | 10* | 20* | 15* |

*For rare regimes with < 30 samples: acknowledge the limitation explicitly. Do NOT claim the model works in this regime.
