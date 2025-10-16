import React, { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import ReportView from './components/ReportView'
import './App.css'

export default function App() {
  const [report, setReport] = useState<any | null>(null)

  return (
    <div className="container">
      <header>
        <h1>PeekVision — Screening Demo</h1>
        <p>Upload a retina photo and run a quick screening heuristic.</p>
      </header>

      <main>
        <ImageUploader onReport={(r) => setReport(r)} />
        {report && <ReportView report={report} />}
      </main>

      <footer>
        <small>Demo — not for clinical use.</small>
      </footer>
    </div>
  )
}
