# Med Vision AI - Virtual Medical Consultation Platform

## Overview

Med Vision AI is an advanced medical consultation platform that provides AI-powered initial patient assessments through video consultations. The platform helps triage patients and guide them to appropriate care levels while maintaining high standards of medical ethics and compliance.

## Key Features

- 🎥 Real-time video consultations with AI medical assistants
- 🌍 Support for 30+ languages including English, Spanish, Chinese, French, German, and more
- 🤖 Three specialized AI doctors: Dr. Ann, Dr. Dexter, and Dr. Judy
- 🏥 Smart triage system for appropriate care level recommendations
- 💬 Real-time speech recognition and transcription
- 🔒 Privacy-focused design

## Flow Chart

flowchart TD
A[Patient Login via MedRx] -->|Authentication| B[Redirected to MedVision AI Dashboard]

    B --> C{Choose Consultation Type}
    C -->|Video| D[Video Consultation 📹]
    C -->|Text| E[Text Consultation 💬]

    D --> F[Select AI Doctor]
    E --> F

    F --> G[Choose Preferred Language]

    G --> H[Consultation Begins]

    H --> I[AI-Assisted Triage Process]
    I -->|Collects Information| J[Symptom Assessment]
    J -->|Medical History| K[Risk Factor Identification]

    K --> L[Triage Classification]
    L -->|Self-care| M1[Low Urgency]
    L -->|Primary care| M2[Medium Urgency]
    L -->|Urgent care| M3[High Urgency]
    L -->|Emergency| M4[Critical Urgency]

    M1 --> N[Clinical Report Generation]
    M2 --> N
    M3 --> N
    M4 --> N

    N --> O[Report Contains:]
    O --> O1[Chief Complaints]
    O --> O2[Key Symptoms]
    O --> O3[Risk Factors]
    O --> O4[Triage Recommendation]
    O --> O5[Care Recommendations]

    N --> P[Report Saved to MedRx System]

    P --> Q[Patient Access to Report]
    P --> R[Healthcare Provider Access]

    R --> S[Follow-up Treatment Planning]

    classDef primary fill:#d0e8ff,stroke:#3182ce,stroke-width:2px
    classDef secondary fill:#e9f5e9,stroke:#38a169,stroke-width:2px
    classDef urgent fill:#feebc8,stroke:#dd6b20,stroke-width:2px
    classDef critical fill:#fed7d7,stroke:#e53e3e,stroke-width:2px
    classDef process fill:#f0f4f8,stroke:#4a5568,stroke-width:1px
    classDef report fill:#f9f7ff,stroke:#805ad5,stroke-width:2px

    class A,B,C,D,E,F,G,H primary
    class I,J,K,L process
    class M1 secondary
    class M2 primary
    class M3 urgent
    class M4 critical
    class N,O,O1,O2,O3,O4,O5,P,Q,R,S report

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI Integration**: Claude AI
- **Speech Recognition**: Whisper API

## Project Structure
