// lib/arweave/uploader.ts - Arweave permanent storage integration
// Uses Irys (formerly Bundlr) for bundled uploads to Arweave
//
// TODO: Install SDK: npm install @irys/sdk
// TODO: Set env vars: ARWEAVE_WALLET_KEY, IRYS_NODE_URL

interface UploadResult {
  transactionId: string;
  timestamp: string;
  size: number;
  cost: string;
}

interface UploadOptions {
  memorialId: string;
  data: string; // JSON stringified memorial data
  tags?: Record<string, string>;
}

interface CostEstimate {
  bytes: number;
  cost: string;
  currency: string;
}

/**
 * Initialize the Irys uploader with wallet credentials.
 *
 * TODO: Replace with actual Irys SDK initialization:
 * ```
 * import Irys from "@irys/sdk";
 * const irys = new Irys({
 *   network: "mainnet",
 *   token: "arweave",
 *   key: JSON.parse(process.env.ARWEAVE_WALLET_KEY!),
 * });
 * ```
 */
async function getIrysClient() {
  const walletKey = process.env.ARWEAVE_WALLET_KEY;
  if (!walletKey) {
    throw new Error('ARWEAVE_WALLET_KEY environment variable is not set. Please configure your Arweave wallet.');
  }

  // TODO: Return actual Irys client instance
  // const irys = new Irys({ network: "mainnet", token: "arweave", key: JSON.parse(walletKey) });
  // await irys.ready();
  // return irys;

  throw new Error('Irys SDK not yet installed. Run: npm install @irys/sdk');
}

/**
 * Estimate the cost of uploading data to Arweave.
 * Arweave pricing is based on data size — larger files cost more AR tokens.
 */
export async function estimateUploadCost(dataSize: number): Promise<CostEstimate> {
  // TODO: Replace with actual Irys price estimation:
  // const irys = await getIrysClient();
  // const price = await irys.getPrice(dataSize);
  // return {
  //   bytes: dataSize,
  //   cost: irys.utils.fromAtomic(price).toString(),
  //   currency: 'AR',
  // };

  return {
    bytes: dataSize,
    cost: '0.000000', // Placeholder
    currency: 'AR',
  };
}

/**
 * Fund the Irys node with AR tokens before uploading.
 * Must be called before upload if balance is insufficient.
 */
export async function fundUpload(amount: string): Promise<void> {
  // TODO: Replace with actual funding:
  // const irys = await getIrysClient();
  // await irys.fund(irys.utils.toAtomic(amount));

  console.log(`[Arweave] Would fund ${amount} AR tokens`);
}

/**
 * Upload memorial data permanently to Arweave via Irys.
 * Returns the transaction ID that serves as a permanent, immutable reference.
 *
 * For large uploads (>50MB), this uses chunked uploading to prevent
 * browser/server crashes.
 */
export async function uploadToArweave(options: UploadOptions): Promise<UploadResult> {
  const { memorialId, data, tags = {} } = options;
  const dataBuffer = Buffer.from(data, 'utf-8');

  // Add standard tags for discoverability on Arweave
  const allTags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'App-Name', value: 'LegacyVault' },
    { name: 'App-Version', value: '2.0' },
    { name: 'Memorial-Id', value: memorialId },
    { name: 'Timestamp', value: new Date().toISOString() },
    ...Object.entries(tags).map(([name, value]) => ({ name, value })),
  ];

  // TODO: Replace with actual Irys upload:
  // const irys = await getIrysClient();
  //
  // // Check balance
  // const price = await irys.getPrice(dataBuffer.length);
  // const balance = await irys.getLoadedBalance();
  // if (balance.lt(price)) {
  //   await irys.fund(price.minus(balance));
  // }
  //
  // // Upload with chunking for large files
  // const receipt = await irys.upload(dataBuffer, { tags: allTags });
  // return {
  //   transactionId: receipt.id,
  //   timestamp: new Date().toISOString(),
  //   size: dataBuffer.length,
  //   cost: irys.utils.fromAtomic(price).toString(),
  // };

  // Placeholder response for development
  const placeholderTxId = `ar_placeholder_${memorialId}_${Date.now()}`;
  console.log(`[Arweave] Would upload ${dataBuffer.length} bytes with tags:`, allTags);

  return {
    transactionId: placeholderTxId,
    timestamp: new Date().toISOString(),
    size: dataBuffer.length,
    cost: '0.000000',
  };
}

/**
 * Upload a large file using chunked uploading.
 * Splits files into manageable chunks to prevent memory issues.
 */
export async function uploadLargeFile(
  fileBuffer: Buffer,
  memorialId: string,
  fileName: string
): Promise<UploadResult> {
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks

  // TODO: Replace with actual chunked Irys upload:
  // const irys = await getIrysClient();
  // const uploader = irys.uploader.chunkedUploader;
  // uploader.setChunkSize(CHUNK_SIZE);
  //
  // uploader.on('chunkUpload', (info) => {
  //   console.log(`[Arweave] Chunk ${info.id} uploaded`);
  // });
  //
  // const receipt = await uploader.uploadData(fileBuffer, {
  //   tags: [
  //     { name: 'Content-Type', value: 'application/octet-stream' },
  //     { name: 'App-Name', value: 'LegacyVault' },
  //     { name: 'Memorial-Id', value: memorialId },
  //     { name: 'File-Name', value: fileName },
  //   ],
  // });

  const totalChunks = Math.ceil(fileBuffer.length / CHUNK_SIZE);
  console.log(`[Arweave] Would upload ${fileBuffer.length} bytes in ${totalChunks} chunks`);

  return {
    transactionId: `ar_placeholder_file_${Date.now()}`,
    timestamp: new Date().toISOString(),
    size: fileBuffer.length,
    cost: '0.000000',
  };
}
