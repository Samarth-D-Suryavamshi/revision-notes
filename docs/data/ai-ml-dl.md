# AI / Machine Learning / Deep Learning Interview Notes — System Flow Approach

---

# Priority 1 — Mathematics

## Linear Algebra

**Vectors & Matrices**
```
Vector = [1, 2, 3] → Point in space, direction + magnitude
Matrix = [[1,2], [3,4], [5,6]] → Grid of numbers, transforms data

Matrix Multiplication: A(m×n) × B(n×p) = C(m×p)
  Row of A dot Column of B → Each cell of C

Use: Feature vectors, image pixels, word embeddings, neural network weights
```

**Eigenvalues & Eigenvectors**
```
A × v = λ × v
Matrix A transforms vector v → v only scales by λ (no rotation)

Eigenvalue λ = how much v stretches/shrinks
Eigenvector v = direction that doesn't change under transformation

Use: PCA (find principal directions), PageRank, stability analysis
```

**SVD (Singular Value Decomposition)**
```
A = U × Σ × Vᵀ
U = left singular vectors (rows)
Σ = singular values (importance of each component)
Vᵀ = right singular vectors (columns)

Use: Dimensionality reduction, recommendation systems, image compression
```

## Calculus

**Derivatives & Gradients**
```
Derivative = Rate of change = Slope of curve
Partial Derivative = Derivative w.r.t one variable, others constant
Gradient = Vector of all partial derivatives = Direction of steepest ascent

Use: Gradient descent → Move opposite to gradient → Minimize loss
```

**Chain Rule**
```
dL/dw = dL/dy × dy/dz × dz/dw
Loss → Output → Activation → Weight

Use: Backpropagation computes gradients through layers
```

## Probability & Statistics

**Bayes' Theorem**
```
P(A|B) = P(B|A) × P(A) / P(B)

Posterior = Likelihood × Prior / Evidence

Use: Spam filter, medical diagnosis, belief updating
Example: P(Cancer|Positive) = P(Positive|Cancer) × P(Cancer) / P(Positive)
```

---

# Priority 2 — Python for ML

**System Flow — ML Project:**
```python
import numpy as np, pandas as pd, matplotlib.pyplot as plt

# 1. Load
df = pd.read_csv('data.csv')

# 2. Explore
df.head(), df.info(), df.describe(), df.isnull().sum()

# 3. Preprocess
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
scaler = StandardScaler(); X_train = scaler.fit_transform(X_train)

# 4. Train
model = RandomForestClassifier()
model.fit(X_train, y_train)

# 5. Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 6. Deploy
joblib.dump(model, 'model.pkl')
```

---

# Priority 3 — Data Preprocessing

**System Flow — Raw Data → ML-Ready:**
```
Raw Data → Inspect → Handle Missing → Encode Categorical → Scale → Split → Cross-Validate
```

| Problem | Detection | Fix |
|---------|-----------|-----|
| **Missing Values** | `df.isnull().sum()` | Mean/median (numerical), mode (categorical), drop (<5%) |
| **Encoding** | `df.dtypes` object columns | One-hot (nominal), Label (ordinal), Target encoding (high cardinality) |
| **Scaling** | Different units | Standardization (z-score: mean=0, std=1), Normalization (0-1) |
| **Class Imbalance** | `df['target'].value_counts()` | SMOTE (oversample minority), undersample, class weights |
| **Data Leakage** | Train score >> Test score | Split BEFORE any transformation, no future data in train |

**Train/Test Split vs Cross-Validation:**
```
Train/Test: 80% train, 20% test → One evaluation (risk: lucky/unlucky split)
K-Fold CV: Data → 5 folds → Train on 4, test on 1 → Repeat 5 times → Average score

Use CV for: Hyperparameter tuning, model selection, robust performance estimate
```

---

# Priority 4 — ML Fundamentals

| Type | What | Labels? | Example |
|------|------|---------|---------|
| **Supervised** | Learn from labeled data | Yes | Spam detection, house price |
| **Unsupervised** | Find patterns in unlabeled data | No | Clustering customers, anomaly detection |
| **Semi-Supervised** | Few labels + lots of unlabeled | Partial | Image classification with limited labels |
| **Reinforcement** | Learn by trial and error | Reward signal | Game playing, robotics, recommendation |

---

# Priority 5 — Supervised Learning Algorithms

## Regression

| Algorithm | How it works | When to use | Regularization |
|-----------|-------------|-------------|----------------|
| **Linear Regression** | y = w₁x₁ + w₂x₂ + b | Linear relationships, baseline | None |
| **Ridge (L2)** | Same + λ×Σw² | Multicollinearity, prevent overfit | L2 penalty |
| **Lasso (L1)** | Same + λ×Σ\|w\| | Feature selection (shrinks some to 0) | L1 penalty |
| **Elastic Net** | L1 + L2 combined | Many features, some correlated | Both |

**L1 vs L2 Regularization:**
```
L1 (Lasso): Penalty = λ × |w| → Sparse weights (feature selection)
L2 (Ridge): Penalty = λ × w² → Small weights (smooth, no zeros)

L1: "Which features matter?" → Some become exactly 0
L2: "Make all features small" → None become 0, all shrink
```

## Classification

| Algorithm | How it works | Strengths | Weaknesses |
|-----------|-------------|-----------|------------|
| **Logistic Regression** | Sigmoid of linear combo | Fast, interpretable, probabilistic | Linear boundaries only |
| **Decision Tree** | Recursive feature split | Interpretable, handles non-linearity | Overfits easily |
| **Random Forest** | 100+ trees, majority vote | Robust, handles missing, feature importance | Slow, less interpretable |
| **SVM** | Find hyperplane with max margin | Effective high-dim, kernel trick | Slow on large data |
| **KNN** | K nearest neighbors vote | Simple, no training | Slow prediction, sensitive to scale |
| **Naive Bayes** | Bayes + feature independence | Fast, text classification | Independence assumption |
| **Gradient Boosting** | Sequential trees correcting errors | High accuracy, handles complex patterns | Prone to overfit, slow training |
| **XGBoost** | Optimized gradient boosting | Fast, regularized, handles missing | Hyperparameter tuning needed |
| **LightGBM** | Leaf-wise tree growth | Faster than XGBoost, less memory | Can overfit on small data |
| **CatBoost** | Handles categorical natively | No encoding needed, robust | Slower than LightGBM |

**Decision Tree vs Random Forest vs XGBoost:**
```
Decision Tree: Single tree, overfits, interpretable
Random Forest: 100 trees (bagging), reduces variance, robust
XGBoost: Trees in sequence (boosting), reduces bias, highest accuracy

Bagging (Random Forest): Train trees in parallel on random subsets → Average
Boosting (XGBoost): Train tree 1 → Find errors → Train tree 2 on errors → ... → Weighted sum
```

---

# Priority 6 — Unsupervised Learning

| Algorithm | How it works | When to use |
|-----------|-------------|-------------|
| **K-Means** | Assign to nearest centroid, update centroids, repeat | Spherical clusters, known K |
| **Hierarchical** | Merge closest clusters bottom-up or split top-down | Unknown K, dendrogram visualization |
| **DBSCAN** | Density-based, core points + border points | Arbitrary shapes, noise detection |
| **PCA** | Find directions of max variance → project | Dimensionality reduction, visualization |
| **t-SNE** | Preserve local neighborhoods in low-dim | Visualization (not for generalization) |
| **UMAP** | Preserve both local and global structure | Faster than t-SNE, better global structure |

**K-Means Algorithm:**
```
1. Pick K random centroids
2. Assign each point to nearest centroid
3. Update centroids = mean of assigned points
4. Repeat 2-3 until convergence

Choose K: Elbow method (plot inertia vs K, pick elbow)
```

**PCA Intuition:**
```
Data in 3D → Find direction with max variance (PC1) → Project → Find next orthogonal direction (PC2) → Project
Result: 3D → 2D with minimal information loss
```

---

# Priority 7 — Model Evaluation

## Regression Metrics

| Metric | Formula | When to use |
|--------|---------|-------------|
| **MAE** | Mean of \|actual - predicted\| | Robust to outliers, same units as target |
| **MSE** | Mean of (actual - predicted)² | Penalizes large errors |
| **RMSE** | √MSE | Same units as target, penalizes large errors |
| **R²** | 1 - (SS_res / SS_tot) | Proportion variance explained (1 = perfect) |

## Classification Metrics

**Confusion Matrix:**
```
              Predicted
              Pos    Neg
Actual Pos    TP     FN
       Neg    FP     TN

Precision = TP / (TP + FP) → "Of predicted positive, how many are correct?"
Recall    = TP / (TP + FN) → "Of actual positive, how many did we catch?"
F1        = 2 × (P × R) / (P + R) → Harmonic mean
Accuracy  = (TP + TN) / Total → Misleading if imbalanced
```

| Scenario | Optimize |
|----------|----------|
| Medical diagnosis (cancer) | High Recall (don't miss sick patients) |
| Spam filter | High Precision (don't flag important emails) |
| Balanced dataset | Accuracy or F1 |
| Imbalanced dataset | F1, ROC-AUC, PR-AUC |

**ROC vs PR Curve:**
```
ROC: TPR vs FPR → Good for balanced data
PR: Precision vs Recall → Better for imbalanced data (focus on minority class)

AUC = Area Under Curve → 1.0 = perfect, 0.5 = random
```

---

# Priority 8 — Feature Engineering

**System Flow:**
```
Raw Features → Select (which matter?) → Extract (create new) → Transform (scale/encode) → Model
```

| Technique | What | Example |
|-----------|------|---------|
| **Feature Selection** | Remove irrelevant/redundant | Correlation, mutual info, L1 regularization |
| **Feature Extraction** | Create new from existing | Polynomial features, interaction terms |
| **PCA** | Reduce dimensions | 100 features → 10 principal components |
| **One-Hot Encoding** | Categorical → binary columns | Color: [R,G,B] → [1,0,0], [0,1,0], [0,0,1] |
| **Label Encoding** | Categorical → integers | Low=0, Medium=1, High=2 |
| **Target Encoding** | Category → mean target value | City "NYC" → avg house price in NYC |

---

# Priority 9 — Deep Learning

## Neural Network Basics

**System Flow — Forward Propagation:**
```
Input x → Weighted sum (z = Wx + b) → Activation (a = σ(z)) → Output ŷ

Layer 1: x → z₁ = W₁x + b₁ → a₁ = ReLU(z₁)
Layer 2: a₁ → z₂ = W₂a₁ + b₂ → a₂ = ReLU(z₂)
Layer N: aₙ₋₁ → zₙ = Wₙaₙ₋₁ + bₙ → ŷ = Softmax(zₙ)
```

**Backpropagation:**
```
1. Forward pass: Compute ŷ and loss L
2. Backward pass: Compute ∂L/∂w for each weight (chain rule)
3. Update: w = w - α × ∂L/∂w (gradient descent)
4. Repeat
```

**Activation Functions:**
| Function | Formula | Use | Problem |
|----------|---------|-----|---------|
| **Sigmoid** | 1/(1+e⁻ˣ) | Output layer (binary) | Vanishing gradient |
| **Tanh** | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | Hidden layers | Vanishing gradient |
| **ReLU** | max(0,x) | Hidden layers (default) | Dying ReLU (x<0 = 0) |
| **Leaky ReLU** | max(0.01x, x) | Hidden layers | Fixes dying ReLU |
| **Softmax** | eˣⁱ/Σeˣʲ | Output layer (multi-class) | — |

**Loss Functions:**
| Problem | Loss | Formula |
|---------|------|---------|
| Regression | MSE | Mean of (y - ŷ)² |
| Binary Classification | Binary Cross-Entropy | -[y log(ŷ) + (1-y) log(1-ŷ)] |
| Multi-class | Categorical Cross-Entropy | -Σ yᵢ log(ŷᵢ) |

**Optimizers:**
| Optimizer | How | Use |
|-----------|-----|-----|
| **SGD** | w = w - α×gradient | Simple, needs tuning |
| **Momentum** | SGD + velocity (accumulated gradients) | Faster convergence |
| **Adam** | Adaptive learning per parameter + momentum | Default choice, works well |
| **RMSprop** | Adaptive learning per parameter | RNNs, sequences |

**Batch Normalization:**
```
Normalize layer inputs (mean=0, std=1) → Learn scale + shift
Why? Faster training, higher learning rates, less sensitive to initialization
```

**Dropout:**
```
Training: Randomly set 20-50% of neurons to 0 → Prevent co-adaptation
Testing: Use all neurons (scale weights)
Why? Regularization, prevents overfitting
```

---

# Priority 10 — CNN (Computer Vision)

**System Flow — Image Classification:**
```
Image (224×224×3) → Conv Layer (filters detect edges) → ReLU → Pooling (reduce size)
                  → Conv Layer (filters detect shapes) → ReLU → Pooling
                  → Conv Layer (filters detect objects) → ReLU → Pooling
                  → Flatten → Dense → Softmax → Class probabilities
```

| Component | What | Why |
|-----------|------|-----|
| **Convolution** | Slide filter over image, compute dot product | Detect local features (edges, textures) |
| **Filter/Kernel** | Small weight matrix (3×3, 5×5) | Learnable feature detector |
| **Padding** | Add zeros around image | Preserve spatial dimensions |
| **Stride** | Step size of filter | Downsample, reduce computation |
| **Pooling** | Max/Avg over region (2×2) | Reduce dimensions, translation invariance |

**Transfer Learning:**
```
Pre-trained model (ImageNet, 1000 classes) → Remove last layer → Add new layer for your classes
→ Freeze early layers (generic features) → Fine-tune last layers (task-specific)

Why? Needs less data, faster training, better accuracy
```

---

# Priority 11 — RNN (Sequences)

**System Flow — Text Generation:**
```
"The cat sat..." → RNN processes word by word → Hidden state carries context → Predict next word

Problem: Long sequences → Gradient vanishes → Forget early words
```

| Variant | How | Use |
|---------|-----|-----|
| **LSTM** | Cell state + gates (forget, input, output) → Control information flow | Long sequences, text, speech |
| **GRU** | Simplified LSTM (2 gates instead of 3) | Faster, similar performance |

**LSTM vs GRU:**
```
LSTM: More parameters, better for long sequences, slower
GRU: Fewer parameters, faster, good for medium sequences
```

---

# Priority 12 — Transformers

**System Flow — Self-Attention:**
```
Input: "The cat sat"

For each word, compute:
  Query (Q) = What am I looking for?
  Key (K) = What do I contain?
  Value (V) = What information do I have?

Attention(Q,K,V) = softmax(QKᵀ/√d) × V

Result: Each word gets a weighted sum of all words (context-aware representation)
"sat" attends strongly to "cat" (subject-verb relationship)
```

**Multi-Head Attention:**
```
Instead of one attention, run 8 (or 16) in parallel → Each head learns different relationships
→ Concatenate → Linear projection

Head 1: Subject-verb relationships
Head 2: Pronoun-antecedent
Head 3: Adjective-noun
...
```

**Transformer Architecture:**
```
Encoder (BERT): Bidirectional attention → Understand context
  Input → Embedding + Positional Encoding → Multi-Head Attention → Feed Forward → Output

Decoder (GPT): Causal (left-to-right) attention → Generate text
  Input → Masked Multi-Head Attention → Cross-Attention → Feed Forward → Output
```

| Model | Type | Architecture | Use |
|-------|------|--------------|-----|
| **BERT** | Encoder-only | Bidirectional | Classification, NER, QA |
| **GPT** | Decoder-only | Causal (left-to-right) | Text generation, chat |
| **T5** | Encoder-Decoder | Both directions | Translation, summarization |
| **Llama** | Decoder-only | Optimized GPT | Open-source LLM |
| **Mistral** | Decoder-only | Sparse attention | Efficient, long context |

---

# Priority 13 — NLP

**System Flow — Text Processing Pipeline:**
```
Raw Text → Tokenization → Normalization → Vectorization → Model
```

| Technique | What | Example |
|-----------|------|---------|
| **Tokenization** | Split text into tokens | "Hello world" → ["Hello", "world"] |
| **Stemming** | Cut suffixes (crude) | "running" → "run", "better" → "better" |
| **Lemmatization** | Dictionary-based root word | "running" → "run", "better" → "good" |
| **TF-IDF** | Word importance = frequency in doc / rarity across docs | "the" = low, "neural" = high |
| **Word2Vec** | Word embeddings via context prediction | "king" - "man" + "woman" ≈ "queen" |
| **FastText** | Word2Vec + subword info | Handles rare words, out-of-vocabulary |

**Embeddings:**
```
Word → Dense vector (e.g., 300-dim) → Similar words = close in vector space
"King" ≈ [0.2, -0.5, 0.8, ...]
"Queen" ≈ [0.3, -0.4, 0.9, ...] (close to King)
"Apple" ≈ [-0.8, 0.2, -0.1, ...] (far from King)
```

---

# Priority 14 — Computer Vision

| Task | What | Approach |
|------|------|----------|
| **Classification** | What's in the image? | CNN → Softmax |
| **Object Detection** | Where are objects? | YOLO (single pass), Faster R-CNN (two-stage) |
| **Segmentation** | Pixel-level classification | U-Net, Mask R-CNN |

**YOLO vs Faster R-CNN:**
```
YOLO: Single forward pass → Predicts boxes + classes simultaneously → Fast (real-time)
Faster R-CNN: Propose regions → Classify each → Accurate but slow

YOLO for: Real-time (self-driving, surveillance)
Faster R-CNN for: Accuracy-critical (medical imaging)
```

**Vision Transformers (ViT):**
```
Image → Split into patches (16×16) → Flatten patches → Add position embedding → Transformer encoder → Classify

vs CNN: ViT needs more data but scales better, captures global context
```

---

# Priority 15 — Generative AI

## LLMs

**System Flow — Text Generation:**
```
Prompt → Tokenize → Pass through Transformer layers → Predict next token → Sample (temperature, top-p)
→ Append to sequence → Repeat until stop token
```

**Temperature vs Top-p:**
| Parameter | Effect | Value |
|-----------|--------|-------|
| **Temperature** | Randomness of sampling | 0 = deterministic, 1 = creative, >1 = random |
| **Top-p (nucleus)** | Cumulative probability threshold | 0.9 = sample from top 90% probable tokens |

**Prompt Engineering:**
```
Zero-shot: "Classify this review as positive or negative: ..."
Few-shot: "Here are 3 examples... Now classify: ..."
Chain-of-Thought: "Let's think step by step..." → Better reasoning
```

## RAG (Retrieval-Augmented Generation)

**System Flow:**
```
User Query → Embed query → Search vector DB (top-k relevant docs) → Retrieve chunks
         → Concatenate query + chunks → LLM generates answer with context

Why? Grounds LLM in facts, reduces hallucinations, uses private data
```

## Fine-Tuning vs Prompt Engineering

| Approach | What | Cost | Use |
|----------|------|------|-----|
| **Prompt Engineering** | Craft better prompts | Zero | Quick experiments, general tasks |
| **RAG** | Add external knowledge | Low | Domain-specific Q&A |
| **Fine-Tuning** | Train model weights on your data | High | Specific style, behavior, tasks |
| **LoRA** | Fine-tune low-rank adapters | Medium | Efficient fine-tuning, smaller footprint |

**LoRA (Low-Rank Adaptation):**
```
Instead of updating all billions of parameters → Add small trainable matrices (A, B) to each layer
→ Only train A and B (millions of params) → Merge at inference

Much cheaper than full fine-tuning, same quality
```

## AI Agents

**System Flow:**
```
User Request → Agent plans → Tool 1 (search) → Observation → Tool 2 (calculate) → Observation
         → Tool 3 (API call) → Observation → Synthesize → Final Answer

Tools: Search, calculator, code interpreter, API calls, database queries
MCP (Model Context Protocol): Standard way for models to use external tools
```

---

# Priority 16 — MLOps

**System Flow — ML Pipeline:**
```
Data Collection → Preprocessing → Feature Engineering → Training → Evaluation → Model Registry
                                                                           ↓
Deployment (API/Container) → Monitoring → Drift Detection → Retrain → Redeploy
```

| Component | Purpose | Tool |
|-----------|---------|------|
| **MLflow** | Track experiments, model registry, deployments | Experiment tracking |
| **Docker** | Containerize model + dependencies | Reproducible environments |
| **Kubernetes** | Orchestrate containers at scale | Auto-scaling, rolling updates |
| **Feature Store** | Centralized feature management | Feast, Tecton |
| **CI/CD for ML** | Automate training, testing, deployment | GitHub Actions + MLflow |

**Drift Detection:**
```
Data Drift: Input distribution changes (new user demographics)
Concept Drift: Relationship between input and output changes (seasonality)

Monitor: Distribution of features, prediction confidence, accuracy over time
Trigger: Retrain when drift exceeds threshold
```

---

# Priority 17 — Responsible AI

| Concern | What | Fix |
|---------|------|-----|
| **Bias** | Model favors certain groups | Balanced datasets, fairness constraints, auditing |
| **Fairness** | Equal outcomes across demographics | Demographic parity, equalized odds |
| **Explainability** | Understand why model predicted X | SHAP, LIME, attention weights |
| **Privacy** | Protect sensitive data | Differential privacy, federated learning |
| **Hallucinations** | LLM generates false information | RAG, fact-checking, human-in-the-loop |

**SHAP vs LIME:**
```
SHAP: Game-theoretic, consistent, global + local explanations
LIME: Local approximation, faster, less consistent

Use SHAP for: Feature importance, model debugging
Use LIME for: Quick local explanations
```

---

# Common Interview Questions — Quick Answers

| Question | One-Liner |
|----------|-----------|
| Bias vs Variance | Bias = underfitting (too simple). Variance = overfitting (too complex). Trade-off: sweet spot |
| Overfitting vs Underfitting | Overfit = memorizes training, bad on test. Underfit = too simple, bad on both. Fix: regularization, more data, simpler model |
| L1 vs L2 | L1 = sparse weights (feature selection). L2 = small weights (smooth). Elastic Net = both |
| Decision Tree vs Random Forest | Tree = single, overfits. Forest = 100 trees (bagging), robust, reduces variance |
| Random Forest vs XGBoost | Forest = parallel trees (bagging). XGBoost = sequential trees (boosting), higher accuracy |
| Precision vs Recall | Precision = of predicted positive, how many correct? Recall = of actual positive, how many caught? |
| ROC vs PR | ROC = TPR vs FPR (balanced). PR = Precision vs Recall (imbalanced) |
| PCA intuition | Find directions of max variance → Project data → Reduce dimensions with minimal loss |
| Backpropagation | Forward pass computes loss → Backward pass computes gradients (chain rule) → Update weights |
| CNN vs Transformer | CNN = local features, translation invariant, good for images. Transformer = global attention, good for sequences |
| LSTM vs GRU | LSTM = 3 gates, better for long sequences. GRU = 2 gates, faster, similar performance |
| Attention mechanism | Each token computes relevance to all others → Weighted sum → Context-aware representation |
| How GPT works | Decoder-only transformer → Causal attention → Predict next token → Sample → Repeat |
| What is RAG? | Retrieve relevant docs → Add to prompt → LLM generates grounded answer |
| Fine-tuning vs Prompt Engineering | Prompt = zero cost, quick. Fine-tuning = train weights, expensive, behavior change |
| Embeddings vs Vector DB | Embeddings = dense vectors. Vector DB = stores + searches vectors by similarity |
| Temperature vs Top-p | Temperature = randomness (0=deterministic). Top-p = cumulative probability cutoff |
| Hallucinations | LLM generates plausible but false info. Fix: RAG, fact-checking, grounding |
| AI Agents | LLM + tools (search, calculator, APIs) + planning + memory → Autonomous task completion |
| MLOps pipeline | Data → Preprocess → Train → Evaluate → Deploy → Monitor → Retrain |

---

# Quick Reference: When to Use What Algorithm

| Problem | Algorithm |
|---------|-----------|
| Tabular data, baseline | XGBoost, LightGBM |
| Text classification | BERT fine-tuning, Logistic Regression + TF-IDF |
| Text generation | GPT, Llama |
| Image classification | ResNet, ViT, transfer learning |
| Object detection | YOLO (real-time), Faster R-CNN (accuracy) |
| Recommendation | Matrix factorization, two-tower neural networks |
| Anomaly detection | Isolation Forest, Autoencoders |
| Time series | LSTM, Prophet, ARIMA |
| Clustering | K-Means (spherical), DBSCAN (arbitrary), Hierarchical (unknown K) |
| Dimensionality reduction | PCA (linear), t-SNE/UMAP (non-linear visualization) |

---

# Final Tip: Interview Flow for ML Questions

```
1. Understand problem → Classification? Regression? Clustering?
2. Explore data → Distributions, missing, correlations, imbalance
3. Preprocess → Handle missing, encode, scale, split
4. Model selection → Baseline (Logistic/Linear) → Complex (XGBoost/Neural Net)
5. Evaluate → Right metric for problem, cross-validation
6. Interpret → Feature importance, SHAP, business impact
7. Deploy → API, monitoring, drift detection
```

**Always remember:** Start simple, establish baseline, iterate. No model is perfect — explain trade-offs.
