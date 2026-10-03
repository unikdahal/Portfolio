import{j as e}from"./index-CU2R9Btb.js";const o={title:"How Redis Talks: The RESP Protocol",category:"Systems",series:"Building Redis in Java",part:1,tag:"Systems · Protocol Design",date:"2026-05-02",readTime:"13 min read",excerpt:"Exploring the Redis Serialization Protocol (RESP) — the byte-level wire format that makes Redis compatible with clients like redis-cli."};function s(n){const t={blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...n.components},{Callout:r}=t;return r||c("Callout"),e.jsxs(e.Fragment,{children:[e.jsx(t.p,{children:"Hey, welcome to the blogs in this series. I will be explaining the implementation, design choices, and everything related to my project redis-java, which you can check out on GitHub. This is the first article of the series, so let's begin."}),`
`,e.jsx(t.p,{children:"Before building a Redis server that stores a key, expires a value, or replicates a write, we need to choose a language it should understand from the client. The understanding begins at the wire protocol."}),`
`,e.jsxs(t.p,{children:["Since we wanted this to be Redis compatible, we will choose the same protocol that Redis uses to communicate, called RESP: Redis Serialization Protocol. It is a complete specification for how bytes transfer between a client and server. Every command that you call, ",e.jsx(t.code,{children:"GET"}),", ",e.jsx(t.code,{children:"SET"}),", ",e.jsx(t.code,{children:"EXPIRE"}),", passes through RESP on its way in and out."]}),`
`,e.jsxs(t.p,{children:["Most of you using Redis might never need to know about this, but since I am building a Redis-compatible server that must correctly handle ",e.jsx(t.code,{children:"redis-cli"}),", ",e.jsx(t.code,{children:"Jedis"}),", ",e.jsx(t.code,{children:"Lettuce"}),", and ",e.jsx(t.code,{children:"redis-py"})," without any modification, RESP is something I need to get right. Everything else in the server is downstream of the parser."]}),`
`,e.jsx(t.p,{children:"This article covers what RESP looks like, why it is designed the way it is, and the specific challenges of parsing it correctly in a high-throughput streaming context."}),`
`,e.jsx(t.h2,{children:"Why not JSON? Why not HTTP?"}),`
`,e.jsx(t.p,{children:"This is a valid question. Redis was designed in 2009 and JSON was already well established while HTTP was present everywhere. Why was there a need to invent a completely new protocol at all?"}),`
`,e.jsx(t.p,{children:"The answer is simple: neither JSON nor HTTP is well-suited to the access pattern of a key-value store. JSON is a text format designed for human readability and schema flexibility. Both of these properties do not matter in a cache protocol. You do not need human-readable bytes. You do not need nested schemas. What you actually need is a format that is extremely fast to parse, produces low overhead per command, and maps directly to a small set of response types that a server typically returns: string, integer, error, list of strings, or nothing."}),`
`,e.jsxs(t.p,{children:["HTTP carries a significant framing overhead. Every request includes a method, path, headers, and a body separator. For a workload where the average command is ",e.jsx(t.code,{children:"GET key"}),", around 10 bytes of meaningful content, the HTTP headers actually dwarf the actual payload. HTTP is also inherently request-response, one at a time per connection, which conflicts directly with pipelining."]}),`
`,e.jsx(t.p,{children:"RESP makes the opposite tradeoffs. It is binary-safe, minimal, and streaming friendly. A GET command is expressed in around 20 bytes. A bulk string response carries its length prefix rather than a delimiter, which means the parser never has to scan the entire content. It can skip directly to the end because it already knows the end location from the prefix length. All design decisions in RESP optimize for the throughput and simplicity of a command response protocol over a persistent connection."}),`
`,e.jsxs(t.table,{children:[e.jsx(t.thead,{children:e.jsxs(t.tr,{children:[e.jsx(t.th,{style:{textAlign:"left"},children:"Protocol"}),e.jsx(t.th,{style:{textAlign:"left"},children:"Avg overhead"}),e.jsx(t.th,{style:{textAlign:"left"},children:"Parsing cost"}),e.jsx(t.th,{style:{textAlign:"left"},children:"Binary-safe"}),e.jsx(t.th,{style:{textAlign:"left"},children:"Pipelining"})]})}),e.jsxs(t.tbody,{children:[e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.strong,{children:"RESP"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"~20 bytes"}),e.jsx(t.td,{style:{textAlign:"left"},children:"O(1) type byte"}),e.jsx(t.td,{style:{textAlign:"left"},children:"✓"}),e.jsx(t.td,{style:{textAlign:"left"},children:"✓"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"HTTP/1.1"}),e.jsx(t.td,{style:{textAlign:"left"},children:"~400+ bytes"}),e.jsx(t.td,{style:{textAlign:"left"},children:"O(n) header scan"}),e.jsx(t.td,{style:{textAlign:"left"},children:"✗"}),e.jsx(t.td,{style:{textAlign:"left"},children:"Limited"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"JSON"}),e.jsx(t.td,{style:{textAlign:"left"},children:"Variable"}),e.jsx(t.td,{style:{textAlign:"left"},children:"O(n) full parse"}),e.jsx(t.td,{style:{textAlign:"left"},children:"✗"}),e.jsx(t.td,{style:{textAlign:"left"},children:"✗"})]})]})]}),`
`,e.jsx(r,{type:"tip",title:"The design insight",children:e.jsx(t.p,{children:"A bulk string response carries its length prefix rather than a delimiter. The parser reads a declared byte count and jumps directly to the end. It never scans the content at all. That single property is what makes RESP both binary-safe and stream-friendly at the same time."})}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"Five Types"}),`
`,e.jsx(t.p,{children:"RESP2 defines five data types. Every message on the wire will be one of these, and the first byte identifies the type unambiguously."}),`
`,e.jsxs(t.table,{children:[e.jsx(t.thead,{children:e.jsxs(t.tr,{children:[e.jsx(t.th,{style:{textAlign:"left"},children:"Type"}),e.jsx(t.th,{style:{textAlign:"center"},children:"Prefix"}),e.jsx(t.th,{style:{textAlign:"left"},children:"Typical use"})]})}),e.jsxs(t.tbody,{children:[e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Simple String"}),e.jsx(t.td,{style:{textAlign:"center"},children:e.jsx(t.code,{children:"+"})}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Status responses: ",e.jsx(t.code,{children:"OK"}),", ",e.jsx(t.code,{children:"PONG"})]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Error"}),e.jsx(t.td,{style:{textAlign:"center"},children:e.jsx(t.code,{children:"-"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"Error messages with class codes"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Integer"}),e.jsx(t.td,{style:{textAlign:"center"},children:e.jsx(t.code,{children:":"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"Numeric results, boolean flags"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Bulk String"}),e.jsx(t.td,{style:{textAlign:"center"},children:e.jsx(t.code,{children:"$"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"All data values and command arguments"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Array"}),e.jsx(t.td,{style:{textAlign:"center"},children:e.jsx(t.code,{children:"*"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"Commands and multi-value responses"})]})]})]}),`
`,e.jsx(t.h3,{children:"1. Simple String"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`+OK\\r\\n
+PONG\\r\\n
`})}),`
`,e.jsxs(t.p,{children:["A ",e.jsx(t.code,{children:"+"})," prefix followed by text, terminated by ",e.jsx(t.code,{children:"\\r\\n"}),". This is used for short server responses where the content is known to be safe ASCII with no embedded newlines. The response to ",e.jsx(t.code,{children:"SET"})," is ",e.jsx(t.code,{children:"+OK\\r\\n"}),". The response to ",e.jsx(t.code,{children:"PING"})," is ",e.jsx(t.code,{children:"+PONG\\r\\n"}),"."]}),`
`,e.jsx(r,{type:"warning",title:"Simple Strings are not binary safe",children:e.jsxs(t.p,{children:["If the content could contain ",e.jsx(t.code,{children:"\\r"})," or ",e.jsx(t.code,{children:"\\n"}),", you cannot use this type. The parser uses ",e.jsx(t.code,{children:"\\r\\n"})," as its only terminator and will misidentify where the message ends, corrupting everything that follows in the stream."]})}),`
`,e.jsx(t.h3,{children:"2. Error"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`-ERR unknown command 'foo'\\r\\n
-WRONGTYPE Operation against a key holding the wrong kind of value\\r\\n
-READONLY You can't write against a read only replica\\r\\n
`})}),`
`,e.jsxs(t.p,{children:["A ",e.jsx(t.code,{children:"-"})," prefix followed by an error message. The first word is conventionally the error class (",e.jsx(t.code,{children:"ERR"}),", ",e.jsx(t.code,{children:"WRONGTYPE"}),", ",e.jsx(t.code,{children:"READONLY"}),"). Clients use the error class to decide how they want to handle the failures, whether they want to retry, surface the error to the caller, or treat it as fatal."]}),`
`,e.jsx(r,{type:"warning",title:"Error strings are a contract",children:e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"-READONLY"})," error that replicas return when a client attempts a write is not a suggestion. It is a specific string that Jedis and Lettuce parse to decide whether to retry on a different node. Return any other string and the client library will not route correctly."]})}),`
`,e.jsx(t.h3,{children:"3. Integer"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`:1\\r\\n
:0\\r\\n
:42\\r\\n
`})}),`
`,e.jsxs(t.p,{children:["A ",e.jsx(t.code,{children:":"})," prefix followed by a signed 64-bit integer, terminated by ",e.jsx(t.code,{children:"\\r\\n"}),". Used for numeric results: the return value of ",e.jsx(t.code,{children:"INCR"}),", the result of ",e.jsx(t.code,{children:"LLEN"}),", the output of ",e.jsx(t.code,{children:"TTL"}),", and whether ",e.jsx(t.code,{children:"SETNX"})," succeeded. Integers in RESP are never floating point. ",e.jsx(t.code,{children:"INCRBYFLOAT"})," returns a Bulk String, not an Integer."]}),`
`,e.jsx(t.h3,{children:"4. Bulk String"}),`
`,e.jsxs(t.p,{children:["The most important type. A ",e.jsx(t.code,{children:"$"})," prefix, then the byte length of the content, then ",e.jsx(t.code,{children:"\\r\\n"}),", then the content itself, then another ",e.jsx(t.code,{children:"\\r\\n"}),"."]}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`$5\\r\\n
hello\\r\\n
`})}),`
`,e.jsx(t.p,{children:"The length prefix is what makes Bulk Strings binary safe. The parser reads exactly the declared number of bytes as content and does not scan for a delimiter. The content can contain anything: null bytes, newlines, arbitrary binary data. This is how Redis can store serialized protobuf, compressed blobs, or raw binary alongside plain text keys in the same protocol."}),`
`,e.jsx(r,{type:"note",title:"Nil vs empty string",children:e.jsxs(t.p,{children:["A length of ",e.jsx(t.code,{children:"-1"})," means ",e.jsx(t.code,{children:"$-1\\r\\n"}),", the null bulk string. ",e.jsx(t.code,{children:"GET"})," on a missing key returns this. A length of ",e.jsx(t.code,{children:"0"})," means ",e.jsx(t.code,{children:"$0\\r\\n\\r\\n"}),", an empty string that actually exists. These are semantically distinct and a correct server must never conflate them."]})}),`
`,e.jsx(t.h3,{children:"5. Array"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`*3\\r\\n
$3\\r\\nSET\\r\\n
$5\\r\\nmykey\\r\\n
$7\\r\\nmyvalue\\r\\n
`})}),`
`,e.jsxs(t.p,{children:["A ",e.jsx(t.code,{children:"*"})," prefix, then the number of elements, then each element encoded in its own RESP type. Arrays can contain any mixture of types, including nested arrays."]}),`
`,e.jsxs(t.p,{children:["This is how every client sends commands to the server. ",e.jsx(t.code,{children:"SET mykey myvalue"})," is encoded as an array of three bulk strings: ",e.jsx(t.code,{children:"SET"}),", ",e.jsx(t.code,{children:"mykey"}),", ",e.jsx(t.code,{children:"myvalue"}),". The server receives a ",e.jsx(t.code,{children:"*3\\r\\n"})," header, reads three bulk strings, assembles them into a command, and dispatches. A count of ",e.jsx(t.code,{children:"-1"})," is the null array. A count of ",e.jsx(t.code,{children:"0"})," is an empty array. Both are valid and distinct."]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"What a Session Actually Looks Like"}),`
`,e.jsx(t.p,{children:"Here is a minimal session covering connect, ping, set a key, and get it back, fully expanded on the wire."}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`CLIENT → SERVER

*1\\r\\n                    ← Array of 1 element
$4\\r\\n                    ← Bulk string, 4 bytes
PING\\r\\n                  ← "PING"

*3\\r\\n                    ← Array of 3 elements
$3\\r\\n                    ← Bulk string, 3 bytes
SET\\r\\n                   ← "SET"
$5\\r\\n                    ← Bulk string, 5 bytes
mykey\\r\\n                 ← "mykey"
$7\\r\\n                    ← Bulk string, 7 bytes
myvalue\\r\\n               ← "myvalue"

*2\\r\\n                    ← Array of 2 elements
$3\\r\\n                    ← Bulk string, 3 bytes
GET\\r\\n                   ← "GET"
$5\\r\\n                    ← Bulk string, 5 bytes
mykey\\r\\n                 ← "mykey"


SERVER → CLIENT

+PONG\\r\\n                 ← Simple string

+OK\\r\\n                   ← Simple string

$7\\r\\n                    ← Bulk string, 7 bytes
myvalue\\r\\n               ← "myvalue"
`})}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(t.p,{children:"Every message starts with one byte that tells you exactly what you are about to parse. Arrays tell you how many elements to expect. Bulk Strings tell you how many bytes to consume. There is no ambiguity at any point in the stream."}),`
`]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"The Parsing Challenge: Streaming and Partial Reads"}),`
`,e.jsx(t.p,{children:"The protocol is simple to describe. Parsing it correctly in a production server is harder, for one reason: TCP is a stream."}),`
`,e.jsx(t.p,{children:"When the server receives bytes from a client, it receives whatever the network delivers, which may be a complete command, a fragment of a command, multiple commands concatenated together, or any combination of these. The parser cannot assume that a complete message is available every time it reads from the socket."}),`
`,e.jsxs(t.p,{children:["Consider a client sending ",e.jsx(t.code,{children:"*3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nmykey\\r\\n$7\\r\\nmyvalue\\r\\n"}),". TCP might deliver this in three separate reads:"]}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`Read 1:   *3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nmy
Read 2:   key\\r\\n$7\\r\\nmyval
Read 3:   ue\\r\\n
`})}),`
`,e.jsx(t.p,{children:"A naive parser that expects a complete message on each read would either hang waiting for more bytes or crash trying to parse an incomplete array. A correct parser must maintain state across reads, remembering where it is in the current message so it can resume correctly when more bytes arrive."}),`
`,e.jsx(t.p,{children:"This is fundamentally a state machine problem. At any point the parser is in one of several states:"}),`
`,e.jsxs(t.table,{children:[e.jsx(t.thead,{children:e.jsxs(t.tr,{children:[e.jsx(t.th,{style:{textAlign:"left"},children:"State"}),e.jsx(t.th,{style:{textAlign:"left"},children:"Description"})]})}),e.jsxs(t.tbody,{children:[e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.code,{children:"WAITING_FOR_TYPE"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"Identify the message type from the initial byte"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.code,{children:"READING_INLINE"})}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Gather bytes until the ",e.jsx(t.code,{children:"\\r\\n"})," sequence is reached"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.code,{children:"READING_LENGTH"})}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Collect numeric digits until ",e.jsx(t.code,{children:"\\r\\n"}),", then parse the integer"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.code,{children:"READING_BULK_CONTENT"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"Ingest precisely N bytes of content"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.code,{children:"READING_TERMINATOR"})}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Ingest the final ",e.jsx(t.code,{children:"\\r\\n"})," following bulk data"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:e.jsx(t.code,{children:"COMMAND_COMPLETE"})}),e.jsx(t.td,{style:{textAlign:"left"},children:"Execute the dispatch and reset the parser state"})]})]})]}),`
`,e.jsx(t.p,{children:"If a read is only partial, the parser remains in its current state, ensuring previously consumed bytes are preserved. Once the network delivers more data, the parser resumes exactly where it paused, rather than restarting from the beginning."}),`
`,e.jsx(r,{type:"note",title:"How redis-java handles this",children:e.jsxs(t.p,{children:["This logic lives in Netty's ",e.jsx(t.code,{children:"RedisCommandHandler"}),", which works directly with ",e.jsx(t.code,{children:"ByteBuf"}),". It maintains separate read and write pointers and enables zero-copy slicing. If a command is not fully parsed when the handler returns, the ",e.jsx(t.code,{children:"ByteBuf"})," holds the remaining bytes for the next read event. No manual buffer management. No copying. The Netty pipeline takes care of all the plumbing."]})}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"Pipelining: Many Commands, One Flush"}),`
`,e.jsx(t.p,{children:"RESP natively supports pipelining, and understanding the mechanics of this feature requires a look at what pipelining actually means at the protocol level."}),`
`,e.jsx(t.p,{children:"Pipelining is not a dedicated mode or a complex protocol extension. It is simply the optimization of sending a batch of commands to the server sequentially without waiting for the round-trip latency of individual responses."}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-text",children:`CLIENT → SERVER (all at once, one TCP write)

*1\\r\\n$4\\r\\nPING\\r\\n
*3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nkey:1\\r\\n$5\\r\\nval:1\\r\\n
*3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nkey:2\\r\\n$5\\r\\nval:2\\r\\n
*3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nkey:3\\r\\n$5\\r\\nval:3\\r\\n
*2\\r\\n$3\\r\\nGET\\r\\n$5\\r\\nkey:1\\r\\n


SERVER → CLIENT (in order, after processing all five)

+PONG\\r\\n
+OK\\r\\n
+OK\\r\\n
+OK\\r\\n
$5\\r\\nval:1\\r\\n
`})}),`
`,e.jsx(t.p,{children:"From the perspective of the parser, a batch of five pipelined commands is indistinguishable from five distinct commands that simply arrived within the same TCP segment. The parser consumes them sequentially, the server executes them in the exact order received, and the responses are dispatched back in that same rigorous sequence."}),`
`,e.jsx(r,{type:"tip",title:"One network tax for the whole batch",children:e.jsx(t.p,{children:"Without pipelining, every command is a synchronous round-trip: send, wait, receive, repeat. With pipelining, the client flushes all five commands to the wire before the server has even acknowledged the first. The round-trip cost is paid once for the entire batch."})}),`
`,e.jsxs(t.p,{children:["In the redis-java project, pipelining support is an emergent property of the streaming parser design. The ",e.jsx(t.code,{children:"RedisCommandHandler"})," simply iterates over the bytes parsing a command, dispatching it, and immediately continuing the loop if more data remains in the buffer. No special-case logic is required. Pipelining is just the natural result of consecutive commands arriving together in a streaming context."]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"Binary Safety: Why It Matters More Than You Think"}),`
`,e.jsx(t.p,{children:"One of RESP's most critical properties is that Bulk Strings are binary safe. While it is a detail that is easy to gloss over, it is actually the foundation of what the protocol enables."}),`
`,e.jsx(t.p,{children:"Because the content of a Bulk String is framed by a length prefix rather than a delimiter, the payload can be any arbitrary sequence of bytes. This design choice ensures that Redis can store:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Serialized protobuf or MessagePack payloads"}),`
`,e.jsx(t.li,{children:"Compressed data with arbitrary byte patterns"}),`
`,e.jsx(t.li,{children:"Session tokens containing null bytes"}),`
`,e.jsx(t.li,{children:"Images, audio, or other binary assets"}),`
`,e.jsx(t.li,{children:"JSON that happens to contain newlines"}),`
`]}),`
`,e.jsx(t.p,{children:"None of these require any escaping, encoding, or transformation before storage. The bytes go in, the bytes come out. The protocol never misinterprets the content as framing because it already knows the payload size from the prefix."}),`
`,e.jsx(r,{type:"warning",title:"Use the wrong type and the stream breaks",children:e.jsxs(t.p,{children:["Simple Strings cannot contain ",e.jsx(t.code,{children:"\\r\\n"}),". If a server mistakenly sends user data as a Simple String, the parser misidentifies the message boundary. The stream gets corrupted and starts throwing errors that look completely unrelated to the actual cause. Always use Bulk Strings for any user-controlled data."]})}),`
`,e.jsxs(t.p,{children:["In practice, the implementation rule is simple: client libraries always encode command arguments as Bulk Strings. Servers never send user data as Simple Strings. Simple Strings are reserved strictly for fixed, known-safe responses like ",e.jsx(t.code,{children:"OK"}),", ",e.jsx(t.code,{children:"PONG"}),", and standard status messages."]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"Server Response: Adhering to the Specification"}),`
`,e.jsx(t.p,{children:"The set of response types returned by the server is essentially a subset of the types dispatched by the client. To ensure full compatibility, a server must use each specific RESP type correctly according to the situation:"}),`
`,e.jsxs(t.table,{children:[e.jsx(t.thead,{children:e.jsxs(t.tr,{children:[e.jsx(t.th,{style:{textAlign:"left"},children:"Command result"}),e.jsx(t.th,{style:{textAlign:"left"},children:"RESP type used"})]})}),e.jsxs(t.tbody,{children:[e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Key exists, return value"}),e.jsx(t.td,{style:{textAlign:"left"},children:"Bulk String"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Key does not exist"}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Null Bulk String (",e.jsx(t.code,{children:"$-1\\r\\n"}),")"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Write confirmed"}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Simple String (",e.jsx(t.code,{children:"+OK\\r\\n"}),")"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Numeric result"}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Integer (",e.jsx(t.code,{children:":N\\r\\n"}),")"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"List of values"}),e.jsx(t.td,{style:{textAlign:"left"},children:"Array of Bulk Strings"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Command failed"}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Error (",e.jsx(t.code,{children:"-ERR ...\\r\\n"}),")"]})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{style:{textAlign:"left"},children:"Wrong type used"}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Error (",e.jsx(t.code,{children:"-WRONGTYPE ...\\r\\n"}),")"]})]}),e.jsxs(t.tr,{children:[e.jsxs(t.td,{style:{textAlign:"left"},children:["Blocked (",e.jsx(t.code,{children:"BLPOP"}),", timeout)"]}),e.jsxs(t.td,{style:{textAlign:"left"},children:["Null Array (",e.jsx(t.code,{children:"*-1\\r\\n"}),")"]})]})]})]}),`
`,e.jsx(r,{type:"danger",title:"Wrong type means silent failure",children:e.jsxs(t.p,{children:["When Jedis or Lettuce dispatch ",e.jsx(t.code,{children:"GET"}),', they expect a Bulk String or Null Bulk String. If a server sends a Simple String instead, the client library suffers a silent misparse or throws an exception that looks exactly like a network failure. There is no "close enough" in protocol compatibility.']})}),`
`,e.jsxs(t.p,{children:["Achieving true compatibility requires more than just understanding the individual RESP types. It demands a rigorous adherence to the specific return type of every command. This precise implementation is the core contract that allows ",e.jsx(t.code,{children:"redis-cli"}),", ",e.jsx(t.code,{children:"Jedis"}),", ",e.jsx(t.code,{children:"Lettuce"}),", and ",e.jsx(t.code,{children:"redis-py"})," to interface with ",e.jsx(t.code,{children:"redis-java"})," seamlessly and without modification."]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h2,{children:"The Foundation Everything Else Builds On"}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(t.p,{children:"RESP is deliberately simple because everything in a Redis server depends on it. The parser runs in the hot path of every client connection. It is the first layer of the event loop, the gateway through which every command must pass before it can be routed, executed, or replicated."}),`
`]}),`
`,e.jsx(t.p,{children:"In the articles that follow, we will see how the event loop manages thousands of these connections simultaneously using a single thread, how commands are dispatched after parsing, and eventually how the same RESP encoding is used to propagate writes across the replication stream. Replication does not define its own wire format. It sends canonicalized RESP commands from master to replicas over a persistent connection, using the same encoding described here."}),`
`,e.jsx(t.p,{children:"That connection between RESP and replication will matter a great deal when we get to deterministic command canonicalization. For now, the important thing to have internalized is what the format looks like byte by byte, why each type exists, and what it costs to parse it incorrectly in a streaming context."}),`
`,e.jsx(t.p,{children:"The next article dives into the event loop: how Netty orchestrates ten thousand simultaneous connections through a non-blocking I/O model, and why your choice of threading model is the bedrock for everything from command dispatch to high-fidelity replication."}),`
`,e.jsx(t.p,{children:"The design choices discussed throughout this series are implemented within redis-java, a fully Redis-compatible server engineered from the ground up using Java 25."})]})}function d(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(s,{...n})}):s(n)}function c(n,t){throw new Error("Expected component `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}const j=Object.freeze(Object.defineProperty({__proto__:null,default:d,frontmatter:o},Symbol.toStringTag,{value:"Module"})),h={title:"The Single-Threaded Myth: Redis Event Loop & Netty",category:"Systems",series:"Building Redis in Java",part:2,tag:"Systems · Architecture",date:"2026-05-02",readTime:"10 min read",excerpt:"Why is Redis single-threaded? How does it handle 100k+ requests per second? Deep dive into the reactor pattern and Netty's event loop.",draft:!0};function i(n){const t={p:"p",...n.components};return e.jsx(t.p,{children:"Coming soon. In this part, we'll dive into the heart of Redis: the event loop. We'll explore why Redis chose a single-threaded model for command execution and how we replicate that performance in Java using Netty's non-blocking I/O."})}function x(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(i,{...n})}):i(n)}const f=Object.freeze(Object.defineProperty({__proto__:null,default:x,frontmatter:h},Symbol.toStringTag,{value:"Module"})),y={title:"Transactions without ACID: MULTI/EXEC in Depth",category:"Systems",series:"Building Redis in Java",part:3,tag:"Systems · Concurrency",date:"2026-05-02",readTime:"8 min read",excerpt:"Implementing MULTI, EXEC, and DISCARD. How Redis queues commands and why it doesn't support rollback.",draft:!0};function l(n){const t={p:"p",...n.components};return e.jsx(t.p,{children:"Coming soon. Redis transactions are unique. There's no rollback, only atomicity. We'll look at how the server buffers commands in a per-client queue and executes them in a single atomic block."})}function p(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(l,{...n})}):l(n)}const b=Object.freeze(Object.defineProperty({__proto__:null,default:p,frontmatter:y},Symbol.toStringTag,{value:"Module"})),m={title:"Replication & PSYNC2: How Replicas Catch Up",category:"Systems",series:"Building Redis in Java",part:4,tag:"Systems · Distributed",date:"2026-05-02",readTime:"15 min read",excerpt:"The complexity of partial resynchronization. Replication IDs, offsets, and the backlog buffer.",draft:!0};function a(n){const t={p:"p",...n.components};return e.jsx(t.p,{children:"Coming soon. Scaling Redis means replication. We'll implement the PSYNC2 protocol, handling master changes, replication backlogs, and ensuring eventual consistency across nodes."})}function g(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(a,{...n})}):a(n)}const w=Object.freeze(Object.defineProperty({__proto__:null,default:g,frontmatter:m},Symbol.toStringTag,{value:"Module"}));export{w as _,b as a,f as b,j as c};
