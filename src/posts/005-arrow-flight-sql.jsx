export default {
  id: "arrow-flight-sql-vs-thrift-migration",
  title: "Arrow Flight SQL vs ThriftServer: What I Learned Migrating Production",
  category: "Data",
  tag: "Data · Query Engines",
  date: "Apr 2026",
  readTime: "10 min read",
  excerpt:
    "Replacing ThriftServer with Arrow Flight SQL in a production Spark cluster cut 1.5 seconds per query and shrank the Docker image by 38%. Here's why the protocol difference matters — and what surprised us.",
  content: [
    {
      type: "p",
      text: "At Highradius, the G4 Data Platform team runs analytical queries against Spark via a JDBC interface. When I joined, that meant ThriftServer — Spark's built-in JDBC/ODBC endpoint based on the Hive Thrift protocol. It works. But we kept noticing query latencies that felt inconsistent with what the queries were actually doing.",
    },
    {
      type: "h2",
      text: "The problem with Thrift",
    },
    {
      type: "p",
      text: "ThriftServer serializes query results using the Hive Thrift binary format, then hands them off through JDBC. Every column is serialized to a Java type, passed over the wire, deserialized on the client. For large result sets — 500k rows — that serialization cycle compounds fast.",
    },
    {
      type: "p",
      text: "The deeper problem: Spark computes results in columnar Arrow format internally (since Spark 2.3). ThriftServer then converts that columnar data to row-based Thrift format to send it. The client receives it row-by-row and often converts it back to columnar for display or further processing. Two unnecessary format conversions per query.",
    },
    {
      type: "h2",
      text: "Arrow Flight SQL: zero-copy columnar transport",
    },
    {
      type: "p",
      text: "Arrow Flight SQL sends Arrow-format data directly over gRPC. No row→column→row conversion. The server serializes Arrow RecordBatches — which it already has internally — and streams them to the client. The ADBC (Arrow Database Connectivity) client implements the JDBC interface on top of Arrow Flight SQL, so application code doesn't need to change. Just swap the driver.",
    },
    {
      type: "h2",
      text: "What the numbers looked like",
    },
    {
      type: "ul",
      items: [
        "−1.5s per-query latency on a representative 50k-row analytical query",
        "Docker image: −38% (removed Hive Thrift and HiveServer2 dependencies)",
        "EKS cold start: −2 minutes (smaller image = faster pull in cold-start scenarios)",
        "Connection setup time: roughly halved (gRPC vs Thrift handshake overhead)",
      ],
    },
    {
      type: "quote",
      text: "The performance falls out of protocol alignment. Arrow Flight SQL matches what Spark does internally. Thrift fights it at every step.",
    },
    {
      type: "p",
      text: "The migration itself was the easy part: swap the driver, point at the Flight SQL endpoint instead of the ThriftServer port, test with representative queries. The hard part was validating byte-identical results for edge cases — null handling, timezone behavior, decimal precision — between the two drivers.",
    },
  ],
}
