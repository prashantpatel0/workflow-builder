// Catalog of services grouped by category with icon URLs
// Icons from Simple Icons CDN: https://cdn.simpleicons.org/
// Some specific vendor services (like AWS Glue) may not have dedicated icons; we use the vendor brand icon instead.

const si = (slug, color) => `https://cdn.simpleicons.org/${slug}${color ? '/' + color.replace('#','') : ''}`

// Helper: if a brand is missing or slug is wrong at runtime, the ServiceNode will fall back to a placeholder icon via onError.

export const CATALOG = [
  {
    category: 'Sources',
    items: [
      { id: 'reddit', label: 'Reddit', nodeType: 'input', icon: si('reddit', '#FF4500') },
      { id: 'kafka', label: 'Kafka', nodeType: 'input', icon: si('apachekafka') },
      { id: 's3-source', label: 'S3 Bucket', nodeType: 'input', icon: '/src/assets/icons/s3.svg' },
      { id: 'gcs-source', label: 'GCS Bucket', nodeType: 'input', icon: si('googlecloud') },
      { id: 'mysql-src', label: 'MySQL', nodeType: 'input', icon: si('mysql') },
      { id: 'postgres-src', label: 'PostgreSQL', nodeType: 'input', icon: si('postgresql') },
      { id: 'mongodb-src', label: 'MongoDB', nodeType: 'input', icon: si('mongodb') },
    ],
  },
  {
    category: 'Orchestration',
    items: [
      { id: 'airflow', label: 'Apache Airflow', nodeType: 'default', icon: si('apacheairflow') },
      { id: 'composer', label: 'Cloud Composer', nodeType: 'default', icon: si('googlecloud') },
      { id: 'stepfunctions', label: 'AWS Step Functions', nodeType: 'default', icon: '/src/assets/icons/stepfunctions.svg' },
      { id: 'prefect', label: 'Prefect', nodeType: 'default', icon: si('prefect') },
      { id: 'dagster', label: 'Dagster', nodeType: 'default', icon: si('dagster') },
    ],
  },
  {
    category: 'ETL / Processing',
    items: [
      { id: 'glue', label: 'AWS Glue', nodeType: 'default', icon: '/src/assets/icons/glue.svg' },
      { id: 'dbt', label: 'dbt', nodeType: 'default', icon: si('dbt') },
      { id: 'spark', label: 'Apache Spark', nodeType: 'default', icon: si('apachespark') },
      { id: 'pyspark', label: 'PySpark', nodeType: 'default', icon: '/src/assets/icons/pyspark.svg' },
      { id: 'python', label: 'Python', nodeType: 'default', icon: '/src/assets/icons/python.svg' },
      { id: 'beam', label: 'Apache Beam / Dataflow', nodeType: 'default', icon: si('googlecloud') },
      { id: 'emr', label: 'AWS EMR', nodeType: 'default', icon: si('amazonaws') },
      { id: 'databricks', label: 'Databricks', nodeType: 'default', icon: '/src/assets/icons/databricks.svg' },
      { id: 'airbyte', label: 'Airbyte', nodeType: 'default', icon: si('airbyte') },
      { id: 'fivetran', label: 'Fivetran', nodeType: 'default', icon: si('fivetran') },
      { id: 'lambda', label: 'AWS Lambda', nodeType: 'default', icon: '/src/assets/icons/lambda.svg' },
      { id: 'athena', label: 'Amazon Athena', nodeType: 'default', icon: '/src/assets/icons/athena.svg' },
      { id: 'adf', label: 'Azure Data Factory', nodeType: 'default', icon: '/src/assets/icons/adf.svg' },
      { id: 'azfunctions', label: 'Azure Functions', nodeType: 'default', icon: '/src/assets/icons/azfunctions.svg' },
      { id: 'azuredatabricks', label: 'Azure Databricks', nodeType: 'default', icon: '/src/assets/icons/azuredatabricks.svg' },
    ],
  },
  {
    category: 'Warehouses / Storage / Security',
    items: [
      { id: 'redshift', label: 'Amazon Redshift', nodeType: 'default', icon: '/src/assets/icons/redshift.svg' },
      { id: 'bigquery', label: 'Google BigQuery', nodeType: 'default', icon: si('googlebigquery') },
      { id: 'snowflake', label: 'Snowflake', nodeType: 'default', icon: si('snowflake') },
      { id: 'synapse', label: 'Azure Synapse', nodeType: 'default', icon: '/src/assets/icons/synapse.svg' },
      { id: 'clickhouse', label: 'ClickHouse', nodeType: 'default', icon: si('clickhouse') },
      { id: 'druid', label: 'Apache Druid', nodeType: 'default', icon: si('apache') },
      { id: 's3', label: 'Amazon S3', nodeType: 'default', icon: '/src/assets/icons/s3.svg' },
      { id: 'gcs', label: 'Google Cloud Storage', nodeType: 'default', icon: si('googlecloud') },
      { id: 'azure', label: 'Azure Storage', nodeType: 'default', icon: '/src/assets/icons/azurestorage.svg' },
      { id: 'azurecloud', label: 'Microsoft Azure', nodeType: 'default', icon: '/src/assets/icons/azure.svg' },
      { id: 'keyvault', label: 'Azure Key Vault', nodeType: 'default', icon: '/src/assets/icons/keyvault.svg' },
    ],
  },
  {
    category: 'Databases',
    items: [
      { id: 'postgres', label: 'PostgreSQL', nodeType: 'default', icon: si('postgresql') },
      { id: 'mysql', label: 'MySQL', nodeType: 'default', icon: si('mysql') },
      { id: 'mssql', label: 'SQL Server', nodeType: 'default', icon: si('microsoftsqlserver') },
      { id: 'mongo', label: 'MongoDB', nodeType: 'default', icon: si('mongodb') },
      { id: 'cosmosdb', label: 'Azure Cosmos DB', nodeType: 'default', icon: '/src/assets/icons/cosmosdb.svg' },
      { id: 'elastic', label: 'Elasticsearch', nodeType: 'default', icon: si('elasticsearch') },
    ],
  },
  {
    category: 'Messaging / Streaming',
    items: [
      { id: 'kafka', label: 'Apache Kafka', nodeType: 'default', icon: si('apachekafka') },
      { id: 'redpanda', label: 'Redpanda', nodeType: 'default', icon: si('redpanda') },
      { id: 'nats', label: 'NATS', nodeType: 'default', icon: si('natsdotio') },
      { id: 'kinesis', label: 'AWS Kinesis', nodeType: 'default', icon: '/src/assets/icons/kinesis.svg' },
      { id: 'eventhubs', label: 'Azure Event Hubs', nodeType: 'default', icon: '/src/assets/icons/eventhubs.svg' },
      { id: 'pubsub', label: 'Google Pub/Sub', nodeType: 'default', icon: si('googlecloud') },
      { id: 'rabbitmq', label: 'RabbitMQ', nodeType: 'default', icon: si('rabbitmq') },
    ],
  },
  {
    category: 'BI / Visualization',
    items: [
      { id: 'tableau', label: 'Tableau', nodeType: 'output', icon: '/src/assets/icons/tableau.svg' },
      { id: 'powerbi', label: 'Power BI', nodeType: 'output', icon: '/src/assets/icons/powerbi.svg' },
      { id: 'superset', label: 'Apache Superset', nodeType: 'output', icon: si('apachesuperset') },
      { id: 'looker', label: 'Looker', nodeType: 'output', icon: si('looker') },
      { id: 'lookerstudio', label: 'Looker Studio', nodeType: 'output', icon: si('googleanalytics') },
      { id: 'metabase', label: 'Metabase', nodeType: 'output', icon: si('metabase') },
      { id: 'grafana', label: 'Grafana', nodeType: 'output', icon: si('grafana') },
    ],
  }
]

export function findServiceById(id) {
  for (const group of CATALOG) {
    for (const item of group.items) if (item.id === id) return item
  }
  return null
}
