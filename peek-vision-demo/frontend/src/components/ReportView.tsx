import React from 'react'

export default function ReportView({ report }: { report: any }) {
  return (
    <section className="report">
      <h2>Screening Report</h2>
      <div className="row">
        <div>
          <img src={report.previewUrl} alt="preview" style={{ maxWidth: 320 }} />
        </div>
        <div>
          <table>
            <tbody>
              <tr><td>File</td><td>{report.filename}</td></tr>
              <tr><td>Brightness</td><td>{Math.round(report.brightness)}</td></tr>
              <tr><td>Red mean</td><td>{Math.round(report.redMean)}</td></tr>
              <tr><td>Edge count</td><td>{report.edgeCount}</td></tr>
              <tr><td>Conclusion</td><td>{report.conclusion}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
