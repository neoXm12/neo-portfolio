import "./DataQuality.css";
import { dataQualityHighlights } from "../../data/siteData";

const DataQuality = () => {
  return (
    <section id="data-quality" className="section data-quality reveal">
      <div className="data-quality-panel">
        <div>
          <p className="section-eyebrow">Data Quality Leadership</p>
          <h2>Protecting enterprise data pipelines and analytics trust.</h2>
          <p className="section-description">
            I partner with data engineers to create and validate ETL/ELT pipelines, reconcile
            datasets, enforce quality gates, and support analytics-ready dataset delivery so reporting and downstream systems remain reliable.
          </p>
        </div>
        <div className="data-quality-facts">
          <div>
            <strong>Source-to-target validation</strong>
            <p>BigQuery, Kafka, Fivetran, dbt, Airflow</p>
          </div>
          <div>
            <strong>Quality engineering</strong>
            <p>Data reconciliation, lineage, schema drift, and analytics verification</p>
          </div>
        </div>
      </div>
      <div className="data-quality-grid">
        {dataQualityHighlights.map((item, index) => (
          <article key={index} className="data-quality-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DataQuality;
