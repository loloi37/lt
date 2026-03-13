// lib/arweave/status.ts - Check Arweave transaction confirmation status
// Arweave blocks take ~2 minutes. This queries the network to verify
// that a transaction has been mined and replicated.

const ARWEAVE_GATEWAY = process.env.ARWEAVE_GATEWAY_URL || 'https://arweave.net';
const ARWEAVE_GRAPHQL = `${ARWEAVE_GATEWAY}/graphql`;

export interface TransactionStatus {
  confirmed: boolean;
  blockHeight: number | null;
  blockHash: string | null;
  numberOfConfirmations: number;
  timestamp: number | null;
}

export interface ReplicationStatus {
  transactionId: string;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  confirmations: number;
  blockHeight: number | null;
  timestamp: number | null;
  gatewayUrl: string;
}

/**
 * Check the confirmation status of an Arweave transaction.
 * Queries the Arweave gateway's /tx/{id}/status endpoint.
 */
export async function getTransactionStatus(txId: string): Promise<TransactionStatus> {
  try {
    const response = await fetch(`${ARWEAVE_GATEWAY}/tx/${txId}/status`);

    if (response.status === 202) {
      // Transaction is pending (not yet mined)
      return {
        confirmed: false,
        blockHeight: null,
        blockHash: null,
        numberOfConfirmations: 0,
        timestamp: null,
      };
    }

    if (response.status === 200) {
      const data = await response.json();
      return {
        confirmed: true,
        blockHeight: data.block_height ?? null,
        blockHash: data.block_indep_hash ?? null,
        numberOfConfirmations: data.number_of_confirmations ?? 0,
        timestamp: data.timestamp ?? null,
      };
    }

    if (response.status === 404) {
      throw new Error(`Transaction ${txId} not found on Arweave network`);
    }

    throw new Error(`Unexpected status ${response.status} from Arweave gateway`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw error;
    }
    throw new Error(`Failed to check Arweave transaction status: ${error}`);
  }
}

/**
 * Query the Arweave GraphQL endpoint for detailed transaction info.
 * This provides richer metadata than the simple status endpoint.
 */
export async function queryTransactionDetails(txId: string): Promise<ReplicationStatus> {
  const query = `
    query {
      transaction(id: "${txId}") {
        id
        block {
          id
          height
          timestamp
        }
        tags {
          name
          value
        }
      }
    }
  `;

  try {
    const response = await fetch(ARWEAVE_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL query failed: ${response.status}`);
    }

    const result = await response.json();
    const tx = result?.data?.transaction;

    if (!tx) {
      return {
        transactionId: txId,
        status: 'pending',
        confirmations: 0,
        blockHeight: null,
        timestamp: null,
        gatewayUrl: `${ARWEAVE_GATEWAY}/${txId}`,
      };
    }

    const hasBlock = tx.block !== null;

    return {
      transactionId: txId,
      status: hasBlock ? 'confirmed' : 'confirming',
      confirmations: hasBlock ? 1 : 0, // GraphQL doesn't return confirmation count directly
      blockHeight: tx.block?.height ?? null,
      timestamp: tx.block?.timestamp ?? null,
      gatewayUrl: `${ARWEAVE_GATEWAY}/${txId}`,
    };
  } catch (error) {
    return {
      transactionId: txId,
      status: 'failed',
      confirmations: 0,
      blockHeight: null,
      timestamp: null,
      gatewayUrl: `${ARWEAVE_GATEWAY}/${txId}`,
    };
  }
}

/**
 * Poll for transaction confirmation with retries.
 * Useful for the UI to show real-time status updates.
 */
export async function waitForConfirmation(
  txId: string,
  maxAttempts: number = 30,
  intervalMs: number = 10000
): Promise<ReplicationStatus> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await queryTransactionDetails(txId);

    if (status.status === 'confirmed' || status.status === 'failed') {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  return {
    transactionId: txId,
    status: 'confirming',
    confirmations: 0,
    blockHeight: null,
    timestamp: null,
    gatewayUrl: `${ARWEAVE_GATEWAY}/${txId}`,
  };
}
