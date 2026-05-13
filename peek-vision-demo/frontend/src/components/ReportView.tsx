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
              <tr><td>Result</td><td>{report.result}</td></tr>
              <tr><td>Confidence</td><td>{report.confidence}</td></tr>
              <tr>
                <td>Recommendations</td>
                <td>
                  {report.recommendations && report.recommendations.length > 0 ? (
                    <ul>
                      {report.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  ) : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
