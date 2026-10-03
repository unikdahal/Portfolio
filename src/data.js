export const DATA = {
  name: 'Unik Dahal',
  email: 'unikdahal03@gmail.com',
  github: 'https://github.com/unikdahal',
  linkedin: 'https://www.linkedin.com/in/unikdahal',
  work: [
    {
      number: '01',
      title: 'Taking the wait out of a query.',
      description:
        'Replaced the JDBC/Thrift query path with Arrow Flight SQL and ADBC, bringing fixed per-query overhead from roughly 1.5 seconds to 90 milliseconds.',
      detail:
        'Owned the client integration, connection pooling, and Kyuubi changes across the query path. The improvement is in transport overhead; total query time still depends on the workload.',
      tags: ['Arrow Flight SQL', 'ADBC', 'Kyuubi'],
      metric: '90',
      unit: 'ms',
      label: 'fixed overhead per query',
    },
    {
      number: '02',
      title: 'A new home for analytics.',
      description:
        'Helped move the analytical query layer from Snowflake to Spark and Iceberg, with roughly 90% lower compute costs.',
      detail:
        'Worked on a phased migration with Kyuubi and Polaris, preserving compatibility while ingestion and user operations moved between engines. The work spans query behavior, catalog integration, and the transitions between systems.',
      tags: ['Spark', 'Iceberg', 'Polaris'],
      metric: '~90',
      unit: '%',
      label: 'lower compute costs',
    },
    {
      number: '03',
      title: 'Seven services. One reliable workflow.',
      description:
        'Built Livecube import and export across seven microservices, so teams could move complex workbook setups between environments.',
      detail:
        'Used Saga orchestration and compensating actions to coordinate failures across services. This cut an environment recreation process from about six months to one month and reduced related production incidents by roughly 70%.',
      tags: ['Java', 'Microservices', 'Saga orchestration'],
      metric: '7',
      unit: '',
      label: 'services orchestrated',
    },
  ],
  contributions: [
    {
      project: 'Apache DataFusion',
      title: 'Making empty structs safe.',
      description:
        'Fixed a panic when constructing and compacting scalar values containing structs with no fields.',
      number: '#24582',
      href: 'https://github.com/apache/datafusion/pull/24582',
      language: 'Rust',
    },
    {
      project: 'Apache Arrow ADBC',
      title: 'A clearer way to connect.',
      description:
        'Added flightsql:// URI support to the Java driver, with transport selection and validation.',
      number: '#4539',
      href: 'https://github.com/apache/arrow-adbc/pull/4539',
      language: 'Java',
    },
    {
      project: 'Apache DataFusion Comet',
      title: 'A safer Iceberg scan path.',
      description:
        'Made reflection failures propagate instead of being mistaken for missing accessors during Iceberg scan planning.',
      number: '#5412',
      href: 'https://github.com/apache/datafusion-comet/pull/5412',
      language: 'Scala',
    },
  ],
  projects: [
    {
      number: '01',
      title: 'Redis, from scratch.',
      category: 'Systems experiment',
      description:
        'The best way I know to understand a system is to build one. A Redis-compatible server in Java, from the wire protocol to transactions, streams, and replication.',
      tags: ['Java', 'Netty', 'RESP', 'PSYNC2'],
      href: 'https://github.com/unikdahal/redis-java',
      link: 'Explore the code',
    },
    {
      number: '02',
      title: 'Sutine.',
      category: 'A business I co-own',
      description:
        'A clothing label, and a reason to own the whole stack. I build the commerce backend, storefront, admin tools, and infrastructure that bring it together.',
      tags: ['Spring Boot', 'React', 'MySQL', 'Cloudflare R2'],
      href: 'https://sutine.com',
      link: 'Visit Sutine',
    },
  ],
  stack: [
    { label: 'Languages', value: 'Java, Rust, Scala, SQL, Python, TypeScript' },
    {
      label: 'Data systems',
      value: 'Spark, Iceberg, DataFusion, Comet, Arrow, Kyuubi, Polaris',
    },
    {
      label: 'Backend & infrastructure',
      value: 'Spring Boot, Kafka, PostgreSQL, MySQL, Docker, Kubernetes, AWS',
    },
  ],
}
